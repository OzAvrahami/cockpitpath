import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../app/auth/actions", () => ({ signOutAction: vi.fn() }));

import AppShell, { closeAppMenuAndRestoreFocus } from "./app-shell";

describe("AppShell", () => {
  it("renders the shared signed-in navigation and closed mobile disclosure", () => {
    const markup = renderToStaticMarkup(
      <AppShell>
        <p>Application content</p>
      </AppShell>,
    );

    expect(markup).toContain('href="#app-main-content"');
    expect(markup).toContain('<main id="app-main-content"');
    expect(markup).toContain('aria-label="Application navigation"');
    expect(markup).toContain('aria-current="page"');
    expect(markup).toContain('href="/learn/cold-dark-to-takeoff"');
    expect(markup).toContain('href="/account"');
    expect(markup).toContain('href="/"');
    expect(markup).toContain("Sign out");
    expect(markup).toContain('aria-controls="app-mobile-menu"');
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain('aria-label="Open application menu"');
    expect(markup).toContain('aria-label="Active aircraft: Boeing 737 MAX 8"');
    expect(markup).not.toContain('id="app-mobile-menu"');
  });

  it("closes the mobile menu and restores focus after Escape", () => {
    const setMenuOpen = vi.fn();
    const focus = vi.fn();
    const schedule = vi.fn((callback) => callback());

    closeAppMenuAndRestoreFocus({
      menuButton: { focus },
      schedule,
      setMenuOpen,
    });

    expect(setMenuOpen).toHaveBeenCalledWith(false);
    expect(schedule).toHaveBeenCalledOnce();
    expect(focus).toHaveBeenCalledOnce();
  });
});
