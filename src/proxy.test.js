import { beforeEach, describe, expect, it, vi } from "vitest";

const { middlewareHandler, middlewareMock } = vi.hoisted(() => ({
  middlewareHandler: vi.fn(() => "middleware-response"),
  middlewareMock: vi.fn(),
}));

middlewareMock.mockReturnValue(middlewareHandler);

vi.mock("./lib/auth/server", () => ({
  auth: { middleware: middlewareMock },
}));

import proxy, { config, getProtectedReturnPath } from "./proxy";

describe("protected route proxy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    middlewareMock.mockReturnValue(middlewareHandler);
  });

  it("protects the app, account, and learning route families", () => {
    expect(config.matcher).toEqual([
      "/account/:path*",
      "/app/:path*",
      "/learn/:path*",
    ]);
  });

  it("carries the requested protected app path through sign-in", () => {
    const request = {
      nextUrl: { pathname: "/app", search: "?view=compact" },
    };

    expect(getProtectedReturnPath(request)).toBe("/app?view=compact");
    expect(proxy(request)).toBe("middleware-response");
    expect(middlewareMock).toHaveBeenCalledWith({
      loginUrl: "/auth/sign-in?returnTo=%2Fapp%3Fview%3Dcompact",
    });
    expect(middlewareHandler).toHaveBeenCalledWith(request);
  });
});
