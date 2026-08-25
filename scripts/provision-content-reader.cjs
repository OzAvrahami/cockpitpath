const { randomBytes } = require("node:crypto");
const { readFile, writeFile } = require("node:fs/promises");
const { Client } = require("pg");

const { assertSafeDatabaseEnvironment } = require("./database-safety.cjs");

const ROLE_NAME = "cockpitpath_content_runtime_development";
const ENVIRONMENT_KEY = "CONTENT_DATABASE_URL";
let lastStage = "startup";

function runtimeConnectionString(ownerConnectionString, password) {
  const url = new URL(ownerConnectionString);
  url.username = ROLE_NAME;
  url.password = password;
  return url.toString();
}

async function readLocalConnectionString() {
  const source = await readFile(".env.local", "utf8");
  const match = source.match(new RegExp(`^${ENVIRONMENT_KEY}=(.+)$`, "m"));
  return match?.[1]?.trim() || null;
}

async function updateLocalEnvironment(connectionString) {
  const path = ".env.local";
  const source = await readFile(path, "utf8");
  const line = `${ENVIRONMENT_KEY}=${connectionString}`;
  const pattern = new RegExp(`^${ENVIRONMENT_KEY}=.*$`, "m");
  const updated = pattern.test(source)
    ? source.replace(pattern, line)
    : `${source.replace(/\s*$/, "")}\n${line}\n`;
  await writeFile(path, updated, { encoding: "utf8", mode: 0o600 });
}

async function main() {
  assertSafeDatabaseEnvironment();
  let contentConnectionString = await readLocalConnectionString();
  const owner = new Client({ connectionString: process.env.DATABASE_URL_UNPOOLED });

  lastStage = "owner connection";
  await owner.connect();
  try {
    const roleResult = await owner.query(
      "select exists (select 1 from pg_roles where rolname = $1) as exists",
      [ROLE_NAME],
    );
    const roleExists = roleResult.rows[0].exists;

    if (!roleExists) {
      const password = randomBytes(32).toString("base64url");
      contentConnectionString = runtimeConnectionString(
        process.env.DATABASE_URL_UNPOOLED,
        password,
      );

      lastStage = "SQL login role creation";
      await owner.query("BEGIN");
      await owner.query(
        "select set_config('cockpitpath.reader_password', $1, true)",
        [password],
      );
      await owner.query(`
        DO $provision$
        BEGIN
          EXECUTE format(
            'CREATE ROLE ${ROLE_NAME} LOGIN PASSWORD %L NOSUPERUSER NOCREATEDB NOCREATEROLE INHERIT NOREPLICATION NOBYPASSRLS',
            current_setting('cockpitpath.reader_password')
          );
        END;
        $provision$;
      `);
      await owner.query(`GRANT cockpitpath_content_reader TO ${ROLE_NAME}`);
      await owner.query("COMMIT");
    } else if (!contentConnectionString) {
      throw new Error(
        "The development reader role exists but ignored CONTENT_DATABASE_URL is missing.",
      );
    } else {
      lastStage = "capability membership verification";
      await owner.query(`GRANT cockpitpath_content_reader TO ${ROLE_NAME}`);
    }
  } catch (error) {
    try {
      await owner.query("ROLLBACK");
    } catch {
      // Preserve the original provisioning failure.
    }
    throw error;
  } finally {
    await owner.end();
  }

  lastStage = "local environment update";
  await updateLocalEnvironment(contentConnectionString);

  lastStage = "runtime capability verification";
  const runtime = new Client({ connectionString: contentConnectionString });
  await runtime.connect();
  try {
    const capabilities = await runtime.query(`
      select current_user = '${ROLE_NAME}' as expected_identity,
             not pg_has_role(current_user, 'neon_superuser', 'MEMBER') as no_provider_superuser,
             not (select rolbypassrls or rolsuper or rolcreatedb or rolcreaterole from pg_roles where rolname = current_user) as no_elevated_attributes,
             has_schema_privilege(current_user, 'cockpitpath_published', 'USAGE') as published_schema,
             has_table_privilege(current_user, 'cockpitpath_published.journeys', 'SELECT') as published_read,
             has_table_privilege(current_user, 'public.journeys', 'SELECT') as editorial_read,
             has_table_privilege(current_user, 'public.journeys', 'UPDATE') as editorial_write,
             has_table_privilege(current_user, 'public.source_references', 'SELECT') as source_read
    `);
    const observed = capabilities.rows[0];
    if (
      !observed.expected_identity ||
      !observed.no_provider_superuser ||
      !observed.no_elevated_attributes ||
      !observed.published_schema ||
      !observed.published_read ||
      observed.editorial_read ||
      observed.editorial_write ||
      observed.source_read
    ) {
      throw new Error("The development content-reader privilege boundary is incorrect.");
    }
  } finally {
    await runtime.end();
  }

  console.log(
    "Development content reader provisioned; CONTENT_DATABASE_URL was written to ignored .env.local and the privilege boundary passed.",
  );
}

main().catch((error) => {
  console.error(
    `Content-reader provisioning failed during ${lastStage}: ${error.code || error.name || "unknown error"}`,
  );
  process.exitCode = 1;
});
