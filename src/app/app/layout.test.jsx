import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { authMock, redirectMock } = vi.hoisted(() => ({
  authMock: { getSession: vi.fn() },
  redirectMock: vi.fn((path) => {
    throw new Error(`redirect:${path}`);
  }),
}));

vi.mock("../../components/app/app-shell", () => ({
  default: ({ children }) => <div data-testid="app-shell">{children}</div>,
}));
vi.mock("../../lib/auth/server", () => ({ auth: authMock }));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));

import ApplicationLayout from "./layout";

describe("ApplicationLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("protects /app when no authenticated server session exists", async () => {
    authMock.getSession.mockResolvedValue({
      data: { session: null, user: null },
      error: null,
    });

    await expect(
      ApplicationLayout({ children: <p>Protected content</p> }),
    ).rejects.toThrow("redirect:/auth/sign-in?returnTo=%2Fapp");
  });

  it("renders the application shell for an authenticated session", async () => {
    authMock.getSession.mockResolvedValue({
      data: { session: { id: "private-session" }, user: { id: "user-1" } },
      error: null,
    });

    const markup = renderToStaticMarkup(
      await ApplicationLayout({ children: <p>Protected content</p> }),
    );

    expect(markup).toContain('data-testid="app-shell"');
    expect(markup).toContain("Protected content");
    expect(markup).not.toContain("private-session");
  });
});
