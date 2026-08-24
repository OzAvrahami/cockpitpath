import { describe, expect, it } from "vitest";

import { getAuthConfig } from "./config";

const validEnvironment = {
  NEON_AUTH_BASE_URL: "https://auth.example.test",
  NEON_AUTH_COOKIE_SECRET: "a-secure-development-secret-with-32-characters",
};

describe("getAuthConfig", () => {
  it("returns the required server-only Auth configuration", () => {
    expect(getAuthConfig(validEnvironment)).toEqual({
      baseUrl: validEnvironment.NEON_AUTH_BASE_URL,
      cookieSecret: validEnvironment.NEON_AUTH_COOKIE_SECRET,
    });
  });

  it.each(["NEON_AUTH_BASE_URL", "NEON_AUTH_COOKIE_SECRET"])(
    "fails clearly when %s is missing",
    (name) => {
      const environment = { ...validEnvironment };
      delete environment[name];

      expect(() => getAuthConfig(environment)).toThrow(name);
    },
  );

  it("rejects a malformed Auth base URL", () => {
    expect(() =>
      getAuthConfig({
        ...validEnvironment,
        NEON_AUTH_BASE_URL: "not-a-url",
      }),
    ).toThrow("valid absolute URL");
  });

  it("rejects a non-HTTP Auth base URL", () => {
    expect(() =>
      getAuthConfig({
        ...validEnvironment,
        NEON_AUTH_BASE_URL: "file:///local-auth",
      }),
    ).toThrow("must use HTTP or HTTPS");
  });

  it("rejects a cookie secret shorter than the SDK minimum", () => {
    expect(() =>
      getAuthConfig({
        ...validEnvironment,
        NEON_AUTH_COOKIE_SECRET: "too-short",
      }),
    ).toThrow("at least 32 characters");
  });
});
