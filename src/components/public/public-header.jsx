"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import Brand from "./brand";

const CONTINUE_PATH = "/learn/cold-dark-to-takeoff";
const MINIMUM_BACK_TO_TOP_THRESHOLD = 480;

export function getBackToTopThreshold(viewportHeight) {
  return Math.max(viewportHeight, MINIMUM_BACK_TO_TOP_THRESHOLD);
}

export function hasPassedBackToTopThreshold(scrollY, viewportHeight) {
  return scrollY >= getBackToTopThreshold(viewportHeight);
}

export function canShowBackToTop({
  blockingRegionVisible,
  menuOpen,
  thresholdPassed,
}) {
  return thresholdPassed && !menuOpen && !blockingRegionVisible;
}

export function returnToTop({ focusTarget, smooth, windowObject }) {
  const reducedMotion = windowObject.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  windowObject.scrollTo({
    behavior: smooth && !reducedMotion ? "smooth" : "auto",
    top: 0,
  });
  focusTarget?.focus({ preventScroll: true });
}

function BackToTop({ menuOpen }) {
  const [scrollState, setScrollState] = useState({
    blockingRegionVisible: false,
    thresholdPassed: false,
  });

  useEffect(() => {
    let animationFrame;

    function updateScrollState() {
      const blockingRegionVisible = [
        document.getElementById("final-cta"),
        document.querySelector(".public-footer"),
      ]
        .filter(Boolean)
        .some((element) => {
          const bounds = element.getBoundingClientRect();
          return bounds.top < window.innerHeight && bounds.bottom > 0;
        });

      setScrollState({
        blockingRegionVisible,
        thresholdPassed: hasPassedBackToTopThreshold(
          window.scrollY,
          window.innerHeight,
        ),
      });
    }

    function requestUpdate() {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateScrollState);
    }

    updateScrollState();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  const visible = canShowBackToTop({ ...scrollState, menuOpen });

  function handleBackToTop(event) {
    returnToTop({
      focusTarget: document.querySelector("[data-public-home-link]"),
      smooth: event.detail > 0,
      windowObject: window,
    });
  }

  return (
    <button
      aria-hidden={!visible}
      aria-label="Back to top"
      className={`public-back-to-top${visible ? " is-visible" : ""}`}
      data-visible={visible}
      onClick={handleBackToTop}
      tabIndex={visible ? 0 : -1}
      type="button"
    >
      <span aria-hidden="true" className="public-back-to-top__icon">
        ↑
      </span>
      <span aria-hidden="true" className="public-back-to-top__text">
        Top
      </span>
    </button>
  );
}

function HeaderActions({ authenticated, mobile = false, onNavigate }) {
  if (authenticated) {
    return (
      <>
        <Link
          className={mobile ? "public-button public-button--primary" : "public-header__continue"}
          href={CONTINUE_PATH}
          onClick={onNavigate}
        >
          Continue learning
        </Link>
        <Link
          className="public-button public-button--quiet"
          href="/account"
          onClick={onNavigate}
        >
          Account
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        className={mobile ? "public-button public-button--quiet" : "public-header__signin"}
        href="/auth/sign-in"
        onClick={onNavigate}
      >
        Sign in
      </Link>
      <Link
        className="public-button public-button--primary"
        href="/auth/sign-up"
        onClick={onNavigate}
      >
        Start learning
      </Link>
    </>
  );
}

export default function PublicHeader({ authenticated }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const firstMobileLinkRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;

    firstMobileLinkRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      requestAnimationFrame(() => menuButtonRef.current?.focus());
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header className="public-header public-header--sticky">
        <div className="public-header__inner">
        <div className="public-header__identity">
          <Brand />
          <nav className="public-header__nav" aria-label="Public navigation">
            <Link href="#aircraft">Aircraft</Link>
            <Link href="#how-it-works">How it works</Link>
          </nav>
        </div>

        <div className="public-header__actions">
          <HeaderActions authenticated={authenticated} />
        </div>

        <button
          ref={menuButtonRef}
          aria-controls="public-mobile-menu"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="public-header__menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <span aria-hidden="true" className="public-header__menu-icon">
            <span />
            <span />
            <span />
          </span>
        </button>
        </div>

        {menuOpen ? (
          <nav
            id="public-mobile-menu"
            className="public-mobile-nav"
            aria-label="Mobile public navigation"
          >
            <Link ref={firstMobileLinkRef} href="#aircraft" onClick={closeMenu}>
              Aircraft
            </Link>
            <Link href="#how-it-works" onClick={closeMenu}>
              How it works
            </Link>
            <div className="public-mobile-nav__actions">
              <HeaderActions
                authenticated={authenticated}
                mobile
                onNavigate={closeMenu}
              />
            </div>
          </nav>
        ) : null}
      </header>
      <BackToTop menuOpen={menuOpen} />
    </>
  );
}
