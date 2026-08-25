import { notFound, redirect } from "next/navigation";

import { auth } from "../../../lib/auth/server";
import {
  getGuideRouteForStep,
  getJourneyOutline,
} from "../../../lib/content/repository";
import { getGuideProgress } from "../../../lib/progress/data-api";

export const dynamic = "force-dynamic";

export default async function JourneyResumePage({ params }) {
  const { data: sessionData } = await auth.getSession();
  if (!sessionData?.user) redirect("/auth/sign-in");

  const { journeySlug } = await params;
  const journey = await getJourneyOutline(journeySlug);
  if (!journey?.sections.length) notFound();

  const first = journey.sections[0];
  try {
    const progress = await getGuideProgress(journey.id, first.procedureId);
    const resumePath = await getGuideRouteForStep(
      journey.id,
      progress.journey?.currentStepId,
    );
    if (resumePath) redirect(resumePath);
  } catch {
    // Fall back to the first published Procedure without exposing provider errors.
  }

  redirect(`/learn/${encodeURIComponent(journey.slug)}/${encodeURIComponent(first.procedureSlug)}`);
}
