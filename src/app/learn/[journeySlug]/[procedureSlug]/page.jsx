import { notFound, redirect } from "next/navigation";

import GuideMode from "../../../../components/guide/guide-mode";
import { auth } from "../../../../lib/auth/server";
import { getGuideProcedure } from "../../../../lib/content/repository";
import {
  getGuideProgress,
  startGuideProgress,
} from "../../../../lib/progress/data-api";

export const dynamic = "force-dynamic";

export default async function GuideProcedurePage({ params }) {
  const { data: sessionData } = await auth.getSession();
  if (!sessionData?.user) redirect("/auth/sign-in");

  const { journeySlug, procedureSlug } = await params;
  const guide = await getGuideProcedure(journeySlug, procedureSlug);
  if (!guide) notFound();

  let progress;
  try {
    progress = await getGuideProgress(guide.journey.id, guide.procedure.id);
    if (!progress.journey) {
      const started = await startGuideProgress(guide.journey.id, guide.procedure.id);
      progress.journey = started;
    }
  } catch {
    return (
      <main className="guide-unavailable">
        <h1>Learning progress is temporarily unavailable</h1>
        <p>Your progress was not changed. Please try again shortly.</p>
      </main>
    );
  }

  const currentStepId =
    progress.procedure?.currentStepId ||
    (guide.steps.some(({ id }) => id === progress.journey?.currentStepId)
      ? progress.journey.currentStepId
      : guide.steps[0].id);

  return (
    <GuideMode
      guide={guide}
      progress={{
        currentStepId,
        mode: progress.journey?.mode || "LEARN",
        status: progress.journey?.status || "IN_PROGRESS",
        stepStatuses: Object.fromEntries(
          progress.steps.map(({ stepId, status }) => [stepId, status]),
        ),
      }}
    />
  );
}
