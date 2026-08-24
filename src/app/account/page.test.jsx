import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { authMock, redirectMock } = vi.hoisted(() => ({
  authMock: {
    getSession: vi.fn(),
  },
  redirectMock: vi.fn((path) => {
    throw new Error(`redirect:${path}`);
  }),
}));

vi.mock("../../lib/auth/server", () => ({ auth: authMock }));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));

import AccountPage from "./page";

describe("AccountPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects an unauthenticated server request to sign in", async () => {
    authMock.getSession.mockResolvedValue({
      data: { session: null, user: null },
      error: null,
    });

    await expect(AccountPage({ searchParams: Promise.resolve({}) })).rejects.toThrow(
      "redirect:/auth/sign-in",
    );
  });

  it("renders safe session state for an authenticated user", async () => {
    authMock.getSession.mockResolvedValue({
      data: {
        session: {
          id: "internal-session-id",
          token: "internal-access-token",
        },
        user: {
          id: "internal-user-id",
          name: "Test Learner",
          email: "learner@example.com",
        },
      },
      error: null,
    });
    const markup = renderToStaticMarkup(
      await AccountPage({ searchParams: Promise.resolve({}) }),
    );

    expect(markup).toContain("Signed in as Test Learner.");
    expect(markup).not.toContain("Data API token path:");
    expect(markup).not.toContain("internal-session-id");
    expect(markup).not.toContain("internal-user-id");
    expect(markup).not.toContain("internal-access-token");
  });
});
