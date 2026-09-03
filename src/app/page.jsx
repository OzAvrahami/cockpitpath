import Link from "next/link";

import Brand, { RouteFixMark } from "../components/public/brand";
import MediaSlot from "../components/public/media-slot";
import PublicHeader from "../components/public/public-header";
import { auth } from "../lib/auth/server";

const CONTINUE_PATH = "/learn/cold-dark-to-takeoff";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "CockpitPath | Master the cockpit, one step at a time",
  description:
    "Connected visual learning for flight-simulator procedures, cockpit controls, and aircraft systems.",
};

async function isAuthenticated() {
  try {
    const { data } = await auth.getSession();
    return Boolean(data?.user);
  } catch {
    return false;
  }
}

function ProductLabel({ children }) {
  return <span className="public-product-label">{children}</span>;
}

function IllustrativeNotice() {
  return (
    <span className="public-illustrative-note">
      Illustrative preview · not verified aircraft content
    </span>
  );
}

function GuidePreview({ compact = false }) {
  return (
    <div className={`public-guide-preview${compact ? " is-compact" : ""}`}>
      <p className="public-guide-preview__context">Guide Mode · preview</p>
      <div className="public-guide-preview__action">
        <span className="public-do-label">Do</span>
        <span>Example cockpit location</span>
      </div>
      <p className="public-guide-preview__instruction">
        NEXT ACTION <span>→ CONFIRM</span>
      </p>
      <div className="public-guide-preview__progress" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="public-guide-preview__expect">
        <span>Expect</span>
        The simulator shows the expected result.
      </div>
      <span className="public-guide-preview__button" aria-hidden="true">
        Done — Next →
      </span>
      {compact ? null : <IllustrativeNotice />}
    </div>
  );
}

export default async function HomePage() {
  const authenticated = await isAuthenticated();
  const primaryPath = authenticated ? CONTINUE_PATH : "/auth/sign-up";
  const primaryLabel = authenticated ? "Continue learning" : "Start learning";

  return (
    <div id="top" className="public-site">
      <a className="public-skip-link" href="#main-content">
        Skip to main content
      </a>
      <PublicHeader authenticated={authenticated} />

      <main id="main-content" className="public-main">
        <section className="public-hero" aria-labelledby="page-title">
          <div className="public-hero__content">
            <p className="public-eyebrow">
              Boeing 737 MAX 8 · iFly · Microsoft Flight Simulator 2024
            </p>
            <h1 id="page-title">
              Master the cockpit.
              <span>One step at a time.</span>
            </h1>
            <p className="public-hero__lead">
              Learn complex aircraft while you fly.
            </p>
            <p className="public-hero__summary">
              Interactive step-by-step procedures, real cockpit locations, and
              system explanations — built to sit beside your simulator.
            </p>
          </div>

          <MediaSlot
            className="public-hero__media"
            label="737 MAX 8 flight deck · wide, low-light composition"
            slotId="hero-cockpit"
          >
            <svg
              aria-hidden="true"
              className="public-hero__route"
              focusable="false"
              viewBox="0 0 800 520"
            >
              <path d="M80 260c200-30 370 10 505 170" />
              <path className="public-route-fix" d="m590 438-12-24 26 3Z" />
            </svg>
          </MediaSlot>

          <div className="public-hero__actions">
            <Link className="public-button public-button--primary" href={primaryPath}>
              {primaryLabel}
            </Link>
            <Link className="public-button public-button--secondary" href="#aircraft">
              Explore the 737 MAX
            </Link>
          </div>

          <div className="public-hero__preview">
            <GuidePreview />
          </div>
        </section>

        <section
          id="how-it-works"
          className="public-section public-section--fly"
          aria-labelledby="fly-title"
        >
          <div className="public-section__intro">
            <ProductLabel>Fly</ProductLabel>
            <h2 id="fly-title">Guide Mode</h2>
            <p>
              Know exactly what to do next. One action, one expected result,
              one tap to continue — built to follow while the simulator stays
              open.
            </p>
          </div>

          <div className="public-demo-panel">
            <p className="public-demo-panel__path">
              Procedure → current step → cockpit location
            </p>
            <div className="public-demo-panel__instruction">
              <span className="public-do-label">Do</span>
              <strong>NEXT ACTION → CONFIRM</strong>
            </div>
            <MediaSlot
              className="public-demo-panel__media"
              label="Overhead-panel learning crop"
              slotId="fly-panel"
            >
              <span className="public-hotspot" aria-hidden="true" />
            </MediaSlot>
            <div className="public-demo-panel__expect">
              <span>Expect</span>
              A concise, observable simulator result.
            </div>
            <div className="public-demo-panel__footer">
              <span className="public-guide-preview__button" aria-hidden="true">
                Done — Next →
              </span>
              <IllustrativeNotice />
            </div>
          </div>
        </section>

        <section
          className="public-section public-section--find"
          aria-labelledby="find-title"
        >
          <MediaSlot
            className="public-find__media"
            label="Wide cockpit panel with room for control discovery"
            slotId="find-panel"
          >
            <span className="public-hotspot public-hotspot--find" aria-hidden="true" />
          </MediaSlot>
          <div className="public-find__intro">
            <ProductLabel>Find</ProductLabel>
            <h2 id="find-title">Cockpit Explorer</h2>
            <p>
              Locate and understand cockpit controls visually — without
              needing to know what anything is called first.
            </p>
          </div>
          <div className="public-control-preview">
            <span>Cockpit → panel → control group</span>
            <strong>Selected control</strong>
            <IllustrativeNotice />
          </div>
        </section>

        <section
          className="public-section public-section--understand"
          aria-labelledby="understand-title"
        >
          <div className="public-section__intro">
            <ProductLabel>Understand</ProductLabel>
            <h2 id="understand-title">Aircraft Systems</h2>
            <p>
              See how the systems behind those controls connect, so procedures
              make sense instead of just working.
            </p>
          </div>

          <div className="public-system-story">
            <MediaSlot
              className="public-system-story__media"
              label="Tight cockpit-control crop"
              slotId="understand-control-crop"
            />
            <ol className="public-system-story__nodes" aria-label="Illustrative relationship">
              <li>
                <span>01</span>
                Procedure context
              </li>
              <li>
                <span>02</span>
                Cockpit control
              </li>
              <li>
                <span>03</span>
                System concept
              </li>
            </ol>
            <IllustrativeNotice />
          </div>
        </section>

        <section
          className="public-section public-section--loop"
          aria-labelledby="loop-title"
        >
          <div className="public-loop__heading">
            <p className="public-eyebrow">One connected learning loop</p>
            <h2 id="loop-title">Not three separate tools.</h2>
            <p>
              Every procedure can connect to where a control lives and the
              system it belongs to — then return you to the learning context
              you left.
            </p>
          </div>

          <div className="public-loop__visual" aria-hidden="true">
            <svg focusable="false" viewBox="0 0 1000 300">
              <path className="public-loop__outbound" d="M160 185 500 60l340 125" />
              <path className="public-loop__return" d="M840 185c70 95-610 125-680 0" />
              <path className="public-loop__origin" d="m142 200 36-30" />
              <path className="public-loop__current" d="m500 38-18 32h36Z" />
              <path className="public-loop__next" d="m840 162-18 32h36Z" />
            </svg>
            <div className="public-loop__item public-loop__item--fly">
              <MediaSlot label="Guide Mode action crop" slotId="loop-guide" />
              <span>Fly · Guide Mode</span>
            </div>
            <div className="public-loop__item public-loop__item--find">
              <MediaSlot label="Highlighted control crop" slotId="loop-control" />
              <span>Find · Cockpit control</span>
            </div>
            <div className="public-loop__item public-loop__item--understand">
              <MediaSlot label="System explanation crop" slotId="loop-system" />
              <span>Understand · System</span>
            </div>
          </div>

          <ol className="public-loop__accessible">
            <li>Fly: follow the current procedure step.</li>
            <li>Find: locate the related cockpit control.</li>
            <li>Understand: learn the related system concept.</li>
            <li>Return to the procedure context without losing your place.</li>
          </ol>
        </section>

        <section
          className="public-section public-section--companion"
          aria-labelledby="companion-title"
        >
          <div className="public-section__intro public-section__intro--wide">
            <p className="public-eyebrow">Built to sit beside the simulator</p>
            <h2 id="companion-title">A focused simulator companion.</h2>
            <p>
              Designed for short glances while Microsoft Flight Simulator stays
              in focus — from a full monitor down to a narrow companion window.
              CockpitPath and the simulator run side by side; there is no live
              telemetry connection.
            </p>
          </div>

          <div className="public-companion__visual">
            <MediaSlot
              className="public-companion__simulator"
              label="Simulator scene · desktop or external view"
              slotId="sim-monitor"
            />
            <div className="public-companion__window">
              <p>CockpitPath · companion 420 px</p>
              <GuidePreview compact />
            </div>
          </div>
        </section>

        <section
          id="aircraft"
          className="public-section public-section--aircraft"
          aria-labelledby="aircraft-title"
        >
          <MediaSlot
            className="public-aircraft__media"
            label="Boeing 737 MAX 8 cockpit or exterior hero"
            slotId="aircraft-hero"
          />
          <div className="public-aircraft__content">
            <p className="public-eyebrow">Supported aircraft</p>
            <h2 id="aircraft-title">Boeing 737 MAX 8</h2>
            <dl className="public-aircraft__metadata">
              <div>
                <dt>Implementation</dt>
                <dd>iFly</dd>
              </div>
              <div>
                <dt>Simulator</dt>
                <dd>Microsoft Flight Simulator 2024</dd>
              </div>
            </dl>
            <p>Learning content is being prepared and verified.</p>
            <Link className="public-button public-button--primary" href={primaryPath}>
              {primaryLabel} →
            </Link>
          </div>
        </section>

        <section
          id="final-cta"
          className="public-final-cta"
          aria-labelledby="final-cta-title"
        >
          <RouteFixMark className="public-final-cta__mark" />
          <p className="public-eyebrow">Your next fix</p>
          <h2 id="final-cta-title">
            {authenticated
              ? "Continue learning the 737 MAX 8."
              : "Start learning the 737 MAX 8."}
          </h2>
          <p>
            Procedures, cockpit locations, and aircraft systems — connected in
            one visual learning path.
          </p>
          <div className="public-final-cta__actions">
            <Link className="public-button public-button--primary" href={primaryPath}>
              {primaryLabel}
            </Link>
            {authenticated ? (
              <Link className="public-button public-button--quiet" href="/account">
                Account
              </Link>
            ) : (
              <Link className="public-final-cta__signin" href="/auth/sign-in">
                Already have an account? Sign in
              </Link>
            )}
          </div>
        </section>
      </main>

      <footer className="public-footer">
        <div className="public-footer__inner">
          <Brand />
          <nav aria-label="Footer navigation">
            <Link href="#aircraft">Aircraft</Link>
            <Link href="#how-it-works">How it works</Link>
            <Link href={authenticated ? "/account" : "/auth/sign-in"}>
              {authenticated ? "Account" : "Sign in"}
            </Link>
          </nav>
          <p>© 2026 CockpitPath</p>
        </div>
      </footer>
    </div>
  );
}
