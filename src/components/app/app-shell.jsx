"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOutAction } from "../../app/auth/actions";
import SubmitButton from "../auth/submit-button";
import Brand from "../public/brand";

const LEARNING_PATH = "/learn/cold-dark-to-takeoff";
export const COCKPIT_EXPLORER_PATH = "/app/cockpit/ifly-737-max-8-msfs-2024";

export function getCurrentAppPage(pathname, currentPage) {
  if (currentPage) return currentPage;
  if (pathname?.startsWith("/app/cockpit/")) return "cockpit";
  return "app";
}

export function closeAppMenuAndRestoreFocus({
  menuButton,
  schedule = requestAnimationFrame,
  setMenuOpen,
}) {
  setMenuOpen(false);
  schedule(() => menuButton?.focus());
}

function AccountLinks({ currentPage, onNavigate }) {
  return (
    <>
      <Link
        aria-current={currentPage === "account" ? "page" : undefined}
        href="/account"
        onClick={onNavigate}
      >
        Account
      </Link>
      <Link href="/" onClick={onNavigate}>
        Back to public site
      </Link>
      <form action={signOutAction}>
        <SubmitButton pendingLabel="Signing out…">Sign out</SubmitButton>
      </form>
    </>
  );
}

export default function AppShell({ children, currentPage }) {
  const pathname = usePathname();
  const resolvedCurrentPage = getCurrentAppPage(pathname, currentPage);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const firstMobileLinkRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;

    firstMobileLinkRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key !== "Escape") return;
      closeAppMenuAndRestoreFocus({
        menuButton: menuButtonRef.current,
        setMenuOpen,
      });
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="app-shell">
      <a className="app-skip-link" href="#app-main-content">
        Skip to main content
      </a>

      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__identity">
            <Brand
              ariaLabel="CockpitPath application home"
              href="/app"
            />
            <span
              aria-label="Active aircraft: Boeing 737 MAX 8"
              className="app-aircraft-context"
            >
              <small>Active aircraft</small>
              <strong>737 MAX 8</strong>
            </span>
          </div>

          <nav className="app-header__nav" aria-label="Application navigation">
            <Link
              aria-current={resolvedCurrentPage === "app" ? "page" : undefined}
              href="/app"
            >
              App home
            </Link>
            <Link
              aria-current={resolvedCurrentPage === "cockpit" ? "page" : undefined}
              href={COCKPIT_EXPLORER_PATH}
            >
              Cockpit Explorer
            </Link>
            <Link href={LEARNING_PATH}>Continue learning</Link>
          </nav>

          <details className="app-account-menu">
            <summary aria-current={resolvedCurrentPage === "account" ? "page" : undefined}>
              Account
            </summary>
            <div className="app-account-menu__panel">
              <AccountLinks currentPage={resolvedCurrentPage} />
            </div>
          </details>

          <button
            ref={menuButtonRef}
            aria-controls="app-mobile-menu"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close application menu" : "Open application menu"}
            className="app-header__menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <span aria-hidden="true" className="app-header__menu-icon">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>

        {menuOpen ? (
          <nav
            id="app-mobile-menu"
            className="app-mobile-nav"
            aria-label="Mobile application navigation"
          >
            <Link
              ref={firstMobileLinkRef}
              aria-current={resolvedCurrentPage === "app" ? "page" : undefined}
              href="/app"
              onClick={closeMenu}
            >
              App home
            </Link>
            <Link
              aria-current={resolvedCurrentPage === "cockpit" ? "page" : undefined}
              href={COCKPIT_EXPLORER_PATH}
              onClick={closeMenu}
            >
              Cockpit Explorer
            </Link>
            <Link href={LEARNING_PATH} onClick={closeMenu}>
              Continue learning
            </Link>
            <AccountLinks currentPage={resolvedCurrentPage} onNavigate={closeMenu} />
          </nav>
        ) : null}
      </header>

      <main id="app-main-content" className="app-main">
        {children}
      </main>
    </div>
  );
}
