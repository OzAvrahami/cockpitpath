export function initialStepIndex(steps, currentStepId) {
  if (!steps.length) return -1;
  const index = steps.findIndex(({ id }) => id === currentStepId);
  return index >= 0 ? index : 0;
}

export function stepIndexById(steps, stepId, fallbackIndex) {
  const index = steps.findIndex(({ id }) => id === stepId);
  return index >= 0 ? index : fallbackIndex;
}

export function resolvedStepStatuses(initialStatuses, stepId, outcome) {
  return {
    ...initialStatuses,
    [stepId]: initialStatuses[stepId] === "COMPLETED" ? "COMPLETED" : outcome,
  };
}

export function hotspotStyle(hotspot) {
  if (!hotspot) return null;
  return {
    left: `${hotspot.x * 100}%`,
    top: `${hotspot.y * 100}%`,
    width: `${hotspot.width * 100}%`,
    height: `${hotspot.height * 100}%`,
  };
}
