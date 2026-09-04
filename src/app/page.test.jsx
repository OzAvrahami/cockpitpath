import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { authMock } = vi.hoisted(() => ({
  authMock: {
    getSession: vi.fn(),
  },
}));

vi.mock("../lib/auth/server", () => ({ auth: authMock }));

import HomePage from "./page";

async function renderHome() {
  return renderToStaticMarkup(await HomePage());
}

describe("HomePage", () => {
  beforeEach(() => {
    authMock.getSession.mockReset();
    authMock.getSession.mockResolvedValue({
      data: { session: null, user: null },
    });
  });

  it("renders the complete signed-out public story", async () => {
    const markup = await renderHome();

    expect(markup).toContain('<h1 id="page-title">');
    expect(markup).toContain("Master the cockpit.");
    expect(markup).toContain('id="how-it-works"');
    expect(markup).toContain('id="fly-title">Guide Mode</h2>');
    expect(markup).toContain('id="find-title">Cockpit Explorer</h2>');
    expect(markup).toContain('id="understand-title">Aircraft Systems</h2>');
    expect(markup).toContain('id="loop-title">Not three separate tools.</h2>');
    expect(markup).toContain('id="companion-title">A focused simulator companion.</h2>');
    expect(markup).toContain('id="aircraft-title">Boeing 737 MAX 8</h2>');
    expect(markup).toContain('id="final-cta"');
    expect(markup).toContain('href="/auth/sign-up"');
    expect(markup).toContain('href="/auth/sign-in"');
    expect(markup).not.toContain('href="/app"');
    expect(markup).not.toContain("Privacy");
    expect(markup).not.toContain("Terms");
  });

  it("keeps the homepage public and renders authenticated actions", async () => {
    authMock.getSession.mockResolvedValue({
      data: { session: { id: "private-session" }, user: { id: "user-1" } },
    });

    const markup = await renderHome();

    expect(markup).toContain("Master the cockpit.");
    expect(markup).toContain('href="/learn/cold-dark-to-takeoff"');
    expect(markup).toContain('href="/app"');
    expect(markup).toContain('href="/account"');
    expect(markup).not.toContain("private-session");
  });

  it("falls back to the signed-out page when session lookup is unavailable", async () => {
    authMock.getSession.mockRejectedValue(new Error("provider unavailable"));

    const markup = await renderHome();

    expect(markup).toContain('href="/auth/sign-up"');
    expect(markup).toContain("Master the cockpit.");
  });

  it("marks every deferred media slot explicitly", async () => {
    const markup = await renderHome();
    const mediaSlots = markup.match(/data-media-status="deferred"/g) ?? [];

    expect(mediaSlots).toHaveLength(9);
    expect(markup).toContain("Verified cockpit capture pending");
    expect(markup).toContain("Illustrative preview · not verified aircraft content");
  });

  it("provides the public landmarks, heading hierarchy, and mobile disclosure semantics", async () => {
    const markup = await renderHome();

    expect(markup.match(/<h1/g)).toHaveLength(1);
    expect(markup.match(/<h2/g)).toHaveLength(7);
    expect(markup).toContain("<header");
    expect(markup).toContain('<main id="main-content"');
    expect(markup).toContain("<footer");
    expect(markup).toContain('href="#main-content"');
    expect(markup).toContain('id="top"');
    expect(markup).toContain('href="#top"');
    expect(markup).toContain('aria-label="Public navigation"');
    expect(markup).toContain('aria-controls="public-mobile-menu"');
    expect(markup).toContain('aria-expanded="false"');
  });
});
