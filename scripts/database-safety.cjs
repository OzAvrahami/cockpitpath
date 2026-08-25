function assertSafeDatabaseEnvironment(environment = process.env) {
  const branch = environment.NEON_BRANCH ?? "";
  const allowedBranch =
    branch === "development" ||
    branch === "staging" ||
    /^(test|preview)[/-]/.test(branch);

  if (!allowedBranch) {
    throw new Error(
      "Database commands require NEON_BRANCH=development, staging, or an explicitly isolated test/preview branch.",
    );
  }

  if (!environment.DATABASE_URL_UNPOOLED) {
    throw new Error("DATABASE_URL_UNPOOLED is required for database commands.");
  }
}

module.exports = { assertSafeDatabaseEnvironment };
