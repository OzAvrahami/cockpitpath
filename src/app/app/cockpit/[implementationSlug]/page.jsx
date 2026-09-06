import Link from "next/link";
import { notFound } from "next/navigation";

import CockpitExplorer from "../../../../components/cockpit/cockpit-explorer";
import {
  SUPPORTED_IMPLEMENTATION_SLUG,
  isValidImplementationSlug,
} from "../../../../lib/cockpit/explorer";
import { getSafeReturnPath } from "../../../../lib/auth/redirects";
import { getCockpitExplorer } from "../../../../lib/content/repository";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cockpit Explorer | CockpitPath",
  description: "Explore published cockpit areas and controls for the supported aircraft implementation.",
};

function ExplorerUnavailable({ providerFailure = false }) {
  return (
    <section
      className="cockpit-unavailable"
      aria-labelledby="cockpit-unavailable-title"
      role={providerFailure ? "alert" : "status"}
    >
      <p className="app-eyebrow">Find · Cockpit Explorer</p>
      <h1 id="cockpit-unavailable-title">
        {providerFailure ? "Cockpit Explorer is temporarily unavailable" : "Published cockpit content is not available yet"}
      </h1>
      <p>
        {providerFailure
          ? "The published content provider could not be reached. No cockpit data was changed."
          : "Verified cockpit media and the initial published control slice are still being prepared for this implementation."}
      </p>
      <div className="cockpit-unavailable__actions">
        {providerFailure ? <Link className="public-button public-button--primary" href={`/app/cockpit/${SUPPORTED_IMPLEMENTATION_SLUG}`}>Try again</Link> : null}
        <Link className="public-button public-button--secondary" href="/app">Back to app home</Link>
      </div>
    </section>
  );
}

export default async function CockpitExplorerPage({ params, searchParams }) {
  const { implementationSlug } = await params;
  const query = await searchParams;

  if (!isValidImplementationSlug(implementationSlug)) notFound();

  let explorer;
  try {
    explorer = await getCockpitExplorer(implementationSlug);
  } catch {
    if (implementationSlug !== SUPPORTED_IMPLEMENTATION_SLUG) notFound();
    return <ExplorerUnavailable providerFailure />;
  }

  if (!explorer) {
    if (implementationSlug !== SUPPORTED_IMPLEMENTATION_SLUG) notFound();
    return <ExplorerUnavailable />;
  }

  if (!explorer.areas.length) {
    return (
      <section className="cockpit-unavailable" aria-labelledby="cockpit-empty-title" role="status">
        <p className="app-eyebrow">Find · Cockpit Explorer</p>
        <h1 id="cockpit-empty-title">No published cockpit areas are available</h1>
        <p>The implementation is available, but its Explorer hierarchy has not been published yet.</p>
        <Link className="public-button public-button--secondary" href="/app">Back to app home</Link>
      </section>
    );
  }

  return (
    <CockpitExplorer
      explorer={explorer}
      initialAreaSlug={typeof query?.area === "string" ? query.area : undefined}
      initialControlSlug={typeof query?.control === "string" ? query.control : undefined}
      returnPath={getSafeReturnPath(query?.from, null)}
    />
  );
}
