const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { assertSafeDatabaseEnvironment } = require("./database-safety.cjs");

assertSafeDatabaseEnvironment();

const direction = process.argv[2];
if (!new Set(["up", "down"]).has(direction)) {
  throw new Error("Migration direction must be either up or down.");
}

const runner = path.resolve(
  "node_modules",
  "node-pg-migrate",
  "bin",
  "node-pg-migrate.js",
);
const result = spawnSync(
  process.execPath,
  [
    runner,
    direction,
    "--database-url-var",
    "DATABASE_URL_UNPOOLED",
    "--migrations-dir",
    "migrations",
    "--migrations-schema",
    "cockpitpath_migrations",
    "--create-migrations-schema",
  ],
  { env: process.env, stdio: "inherit" },
);

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
