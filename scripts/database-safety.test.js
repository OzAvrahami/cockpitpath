import { describe, expect, it } from "vitest";

import databaseSafety from "./database-safety.cjs";

const { assertSafeDatabaseEnvironment } = databaseSafety;
const connection = "postgresql://example.invalid/database";

describe("database command safety", () => {
  it.each(["development", "staging", "test/security", "preview/42"])(
    "allows the isolated %s branch",
    (branch) => {
      expect(() =>
        assertSafeDatabaseEnvironment({
          NEON_BRANCH: branch,
          DATABASE_URL_UNPOOLED: connection,
        }),
      ).not.toThrow();
    },
  );

  it.each(["production", "main", "", undefined])(
    "rejects the unsafe %s branch",
    (branch) => {
      expect(() =>
        assertSafeDatabaseEnvironment({
          NEON_BRANCH: branch,
          DATABASE_URL_UNPOOLED: connection,
        }),
      ).toThrow(/require NEON_BRANCH/);
    },
  );

  it("requires the unpooled administrative connection", () => {
    expect(() =>
      assertSafeDatabaseEnvironment({ NEON_BRANCH: "staging" }),
    ).toThrow(/DATABASE_URL_UNPOOLED/);
  });
});
