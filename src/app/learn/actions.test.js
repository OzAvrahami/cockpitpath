import { beforeEach, describe, expect, it, vi } from "vitest";

const { recordMock, routeMock, setMock } = vi.hoisted(() => ({
  recordMock: vi.fn(),
  routeMock: vi.fn(),
  setMock: vi.fn(),
}));

vi.mock("../../lib/content/repository", () => ({ getGuideRouteForStep: routeMock }));
vi.mock("../../lib/progress/data-api", () => ({
  recordStepProgress: recordMock,
  setGuidePosition: setMock,
}));

import { recordStepProgressAction, setGuidePositionAction } from "./actions";

const journeyId = "00000000-0000-4000-8000-000000000001";
const stepId = "00000000-0000-4000-8000-000000000002";

describe("Guide Mode server actions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects malformed identities before reaching persistence", async () => {
    expect(await recordStepProgressAction({ journeyId: "bad", stepId, outcome: "COMPLETED" }))
      .toEqual({ ok: false, code: "INVALID_REQUEST" });
    expect(recordMock).not.toHaveBeenCalled();
  });

  it("records a completion without accepting an owner identity", async () => {
    recordMock.mockResolvedValue({ currentStepId: stepId, journeyStatus: "IN_PROGRESS" });
    routeMock.mockResolvedValue("/learn/synthetic-journey/synthetic-procedure");

    const result = await recordStepProgressAction({ journeyId, stepId, outcome: "COMPLETED" });

    expect(recordMock).toHaveBeenCalledWith(journeyId, stepId, "COMPLETED");
    expect(result.ok).toBe(true);
  });

  it("allows only the two documented information-density modes", async () => {
    expect(await setGuidePositionAction({ journeyId, stepId, mode: "EXPERT" }))
      .toEqual({ ok: false, code: "INVALID_REQUEST" });
    expect(setMock).not.toHaveBeenCalled();
  });
});
