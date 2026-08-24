const { Client } = require("pg");
const { assertSafeDatabaseEnvironment } = require("../database-safety.cjs");
const { loadContent } = require("./load.cjs");
const { applyPublication, planPublication } = require("./publisher.cjs");
const { formatValidationError, validateGraph } = require("./validate.cjs");

function printPlan(plan, dryRun) {
  const counts = plan.actions.reduce((result, item) => ({ ...result, [item.action]: (result[item.action] ?? 0) + 1 }), {});
  console.log(`${dryRun ? "Dry run" : "Publication"}: ${plan.actions.length} change(s), ${plan.unchanged} unchanged, ${plan.skipped} non-runtime item(s) skipped.`);
  for (const action of ["INSERT", "UPDATE", "ARCHIVE"]) if (counts[action]) console.log(`  ${action}: ${counts[action]}`);
}

async function validate(root) {
  const graph = validateGraph(await loadContent(root));
  console.log(`Content valid: ${graph.entities.length} entity record(s), ${graph.sources.length} source(s), ${graph.files.length} file(s).`);
}

async function publish(root, dryRun) {
  assertSafeDatabaseEnvironment();
  const graph = validateGraph(await loadContent(root));
  console.log("Validated publication input.");
  const client = new Client({ connectionString: process.env.DATABASE_URL_UNPOOLED });
  await client.connect();
  console.log("Connected to the guarded database target.");
  try {
    await client.query("BEGIN");
    await client.query("SET LOCAL ROLE cockpitpath_publisher");
    const plan = await planPublication(client, graph);
    printPlan(plan, dryRun);
    if (!dryRun) await applyPublication(client, graph, plan, { environment: process.env.NEON_BRANCH });
    if (dryRun) await client.query("ROLLBACK");
    else await client.query("COMMIT");
  } catch (error) {
    try { await client.query("ROLLBACK"); } catch { /* Preserve the publication failure. */ }
    throw error;
  } finally {
    await client.end();
  }
}

async function main() {
  const [command, root = "content", ...flags] = process.argv.slice(2);
  if (command === "validate") return validate(root);
  if (command === "publish") return publish(root, flags.includes("--dry-run"));
  throw new Error("Usage: cli.cjs validate <directory> | publish <directory> [--dry-run]");
}

const keepAlive = setInterval(() => {}, 1_000);
main().catch((error) => {
  console.error(formatValidationError(error));
  process.exitCode = 1;
}).finally(() => clearInterval(keepAlive));
