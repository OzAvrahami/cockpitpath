import { describe, expect, it } from "vitest";

import {
  DEFAULT_AUTH_DESTINATION,
  getSafeReturnPath,
  getSignInPath,
} from "./redirects";

describe("authentication return paths", () => {
  it("uses the application home as the default destination", () => {
    expect(DEFAULT_AUTH_DESTINATION).toBe("/app");
    expect(getSafeReturnPath()).toBe("/app");
    expect(getSignInPath()).toBe("/auth/sign-in?returnTo=%2Fapp");
  });

  it.each([
    "/app",
    "/app/aircraft?view=compact#content",
    "/account",
    "/learn/cold-dark-to-takeoff",
    "/learn/cold-dark-to-takeoff/power-up?mode=learn",
  ])("preserves the allowed internal destination %s", (path) => {
    expect(getSafeReturnPath(path)).toBe(path);
  });

  it.each([
    "https://attacker.example/app",
    "//attacker.example/app",
    "/\\attacker.example/app",
    "javascript:alert(1)",
    "/auth/sign-in",
    "/unapproved-route",
    "",
  ])("rejects the unsafe or unsupported destination %s", (path) => {
    expect(getSafeReturnPath(path)).toBe("/app");
  });
});
