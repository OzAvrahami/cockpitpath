import Link from "next/link";

import Brand, { RouteFixMark } from "../public/brand";

const destinationCopy = {
  account: "Continue to your account after authentication.",
  app: "Continue to the CockpitPath app after authentication.",
  learn: "Return to your learning session after authentication.",
};

export function getDestinationCopy(returnTo) {
  if (typeof returnTo !== "string") {
    return destinationCopy.app;
  }

  if (returnTo === "/account" || returnTo.startsWith("/account/")) {
    return destinationCopy.account;
  }

  if (returnTo === "/learn" || returnTo.startsWith("/learn/")) {
    return destinationCopy.learn;
  }

  return destinationCopy.app;
}

export function AuthDestination({ id, returnTo }) {
  return (
    <p className="auth-destination" id={id}>
      <span>Next destination</span>
      {getDestinationCopy(returnTo)}
    </p>
  );
}

export function AuthMessage({ children, id, title, variant = "status" }) {
  const isError = variant === "error";

  return (
    <div
      className={`auth-message auth-message--${variant}`}
      id={id}
      role={isError ? "alert" : "status"}
    >
      {title ? <strong>{title}</strong> : null}
      <p>{children}</p>
    </div>
  );
}

export default function AuthFrame({ children }) {
  return (
    <div className="auth-shell">
      <a className="auth-skip-link" href="#auth-main-content">
        Skip to authentication form
      </a>

      <header className="auth-header">
        <Brand ariaLabel="CockpitPath public homepage" href="/" />
        <Link className="auth-header__public-link" href="/">
          Back to public site
        </Link>
      </header>

      <main className="auth-main" id="auth-main-content">
        <div className="auth-main__content">{children}</div>

        <aside className="auth-context" aria-labelledby="auth-context-title">
          <RouteFixMark className="auth-context__mark" />
          <p className="auth-context__eyebrow">Connected visual learning</p>
          <h2 id="auth-context-title">Pick up the path with context.</h2>
          <p>
            Move between procedures, cockpit controls, and aircraft systems in
            one focused learning experience.
          </p>
          <div className="auth-context__path" aria-label="Fly, Find, Understand">
            <span>Fly</span>
            <span aria-hidden="true">→</span>
            <span>Find</span>
            <span aria-hidden="true">→</span>
            <span>Understand</span>
          </div>
          <p className="auth-context__aircraft">
            Boeing 737 MAX 8 <span aria-hidden="true">·</span> iFly
            <span aria-hidden="true"> · </span>Microsoft Flight Simulator 2024
          </p>
        </aside>
      </main>
    </div>
  );
}
