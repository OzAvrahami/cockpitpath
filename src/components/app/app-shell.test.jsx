import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../app/auth/actions", () => ({ signOutAction: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname: () => "/app" }));

import AppShell, { closeAppMenuAndRestoreFocus, getCurrentAppPage } from "./app-shell";

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
    expect(markup).toContain('href="/app/cockpit/ifly-737-max-8-msfs-2024"');
    expect(markup).toContain('href="/account"');
    expect(markup).toContain('href="/"');
    expect(markup).toContain("Sign out");
    expect(markup).toContain('aria-controls="app-mobile-menu"');
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain('aria-label="Open application menu"');
    expect(markup).toContain('aria-label="Active aircraft: Boeing 737 MAX 8"');
    expect(markup).not.toContain('id="app-mobile-menu"');
  });

  it("marks Cockpit Explorer as the current application destination", () => {
    const markup = renderToStaticMarkup(
      <AppShell currentPage="cockpit"><p>Explorer content</p></AppShell>,
    );

    expect(markup).toContain('aria-current="page" href="/app/cockpit/ifly-737-max-8-msfs-2024"');
    expect(getCurrentAppPage("/app/cockpit/ifly-737-max-8-msfs-2024")).toBe("cockpit");
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

  it("marks the account destination as current without changing shell navigation", () => {
    const markup = renderToStaticMarkup(
      <AppShell currentPage="account">
        <p>Account content</p>
      </AppShell>,
    );

    expect(markup).toContain('aria-current="page" href="/account"');
    expect(markup).toContain('<a href="/app">App home</a>');
    expect(markup).toContain('aria-label="Open application menu"');
    expect(markup).toContain("Sign out");
  });
});
