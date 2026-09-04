"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { signOutAction } from "../../app/auth/actions";
import Brand from "../public/brand";

const LEARNING_PATH = "/learn/cold-dark-to-takeoff";

export function closeAppMenuAndRestoreFocus({
  menuButton,
  schedule = requestAnimationFrame,
  setMenuOpen,
}) {
  setMenuOpen(false);
  schedule(() => menuButton?.focus());
}

function AccountLinks({ onNavigate }) {
  return (
    <>
      <Link href="/account" onClick={onNavigate}>
        Account
      </Link>
      <Link href="/" onClick={onNavigate}>
        Back to public site
      </Link>
      <form action={signOutAction}>
        <button type="submit">Sign out</button>
      </form>
    </>
  );
}

export default function AppShell({ children }) {
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
            <Link aria-current="page" href="/app">
              App home
            </Link>
            <Link href={LEARNING_PATH}>Continue learning</Link>
          </nav>

          <details className="app-account-menu">
            <summary>Account</summary>
            <div className="app-account-menu__panel">
              <AccountLinks />
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
              aria-current="page"
              href="/app"
              onClick={closeMenu}
            >
              App home
            </Link>
            <Link href={LEARNING_PATH} onClick={closeMenu}>
              Continue learning
            </Link>
            <AccountLinks onNavigate={closeMenu} />
          </nav>
        ) : null}
      </header>

      <main id="app-main-content" className="app-main">
        {children}
      </main>
    </div>
  );
}
