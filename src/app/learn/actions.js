"use server";

import { getGuideRouteForStep } from "../../lib/content/repository";
import {
  recordStepProgress,
  setGuidePosition,
} from "../../lib/progress/data-api";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validIdentifier(value) {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

function failure(error) {
  return {
    ok: false,
    code: error?.code === "UNAUTHENTICATED" ? "UNAUTHENTICATED" : "PERSISTENCE",
  };
}

export async function setGuidePositionAction({ journeyId, stepId, mode = null }) {
  if (
    !validIdentifier(journeyId) ||
    !validIdentifier(stepId) ||
    (mode !== null && mode !== "QUICK" && mode !== "LEARN")
  ) {
    return { ok: false, code: "INVALID_REQUEST" };
  }

  try {
    const progress = await setGuidePosition(journeyId, stepId, mode);
    const nextPath = await getGuideRouteForStep(journeyId, progress.currentStepId);
    return { ok: true, progress, nextPath };
  } catch (error) {
    return failure(error);
  }
}

export async function recordStepProgressAction({ journeyId, stepId, outcome }) {
  if (
    !validIdentifier(journeyId) ||
    !validIdentifier(stepId) ||
    !["COMPLETED", "SKIPPED"].includes(outcome)
  ) {
    return { ok: false, code: "INVALID_REQUEST" };
  }

  try {
    const progress = await recordStepProgress(journeyId, stepId, outcome);
    const nextPath = await getGuideRouteForStep(journeyId, progress.currentStepId);
    return { ok: true, progress, nextPath };
  } catch (error) {
    return failure(error);
  }
}
