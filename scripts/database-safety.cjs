function assertSafeDatabaseEnvironment() {
  const branch = process.env.NEON_BRANCH ?? "";
  const allowedBranch =
    branch === "development" || /^(test|preview)[/-]/.test(branch);

  if (!allowedBranch) {
    throw new Error(
      "Database commands require NEON_BRANCH=development or an explicitly isolated test/preview branch.",
    );
  }

  if (!process.env.DATABASE_URL_UNPOOLED) {
    throw new Error("DATABASE_URL_UNPOOLED is required for database commands.");
  }
}

module.exports = { assertSafeDatabaseEnvironment };
