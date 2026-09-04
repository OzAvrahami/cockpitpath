import Link from "next/link";

export function RouteFixMark({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      viewBox="0 0 48 48"
    >
      <path
        d="M10 36 24 14 40 20"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.6"
      />
      <path
        d="m7.05 34.12 5.9 3.76"
        fill="none"
        stroke="var(--public-text-muted)"
        strokeLinecap="round"
        strokeWidth="2.6"
      />
      <path d="m24 9.6-3.81 6.6h7.62Z" fill="var(--public-accent)" />
      <path
        d="m40 15.4-3.98 6.9h7.96Z"
        fill="none"
        stroke="var(--public-accent)"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
    </svg>
  );
}

export default function Brand({
  ariaLabel = "CockpitPath home — return to top",
  compact = false,
  href = "#top",
}) {
  return (
    <Link
      className="public-brand"
      data-public-home-link
      href={href}
      aria-label={ariaLabel}
    >
      <RouteFixMark className="public-brand__mark" />
      {compact ? null : <span>CockpitPath</span>}
    </Link>
  );
}
