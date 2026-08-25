import { beforeEach, describe, expect, it, vi } from "vitest";

const { authMock, getGuideMock, getProgressMock, notFoundMock, redirectMock, startMock } = vi.hoisted(() => ({
  authMock: { getSession: vi.fn() },
  getGuideMock: vi.fn(),
  getProgressMock: vi.fn(),
  notFoundMock: vi.fn(() => { throw new Error("not-found"); }),
  redirectMock: vi.fn((path) => { throw new Error(`redirect:${path}`); }),
  startMock: vi.fn(),
}));

vi.mock("../../../../components/guide/guide-mode", () => ({ default: () => null }));
vi.mock("../../../../lib/auth/server", () => ({ auth: authMock }));
vi.mock("../../../../lib/content/repository", () => ({ getGuideProcedure: getGuideMock }));
vi.mock("../../../../lib/progress/data-api", () => ({
  getGuideProgress: getProgressMock,
  startGuideProgress: startMock,
}));
vi.mock("next/navigation", () => ({ notFound: notFoundMock, redirect: redirectMock }));

import GuideProcedurePage from "./page";

const params = Promise.resolve({ journeySlug: "synthetic-journey", procedureSlug: "synthetic-procedure" });
const guide = {
  journey: { id: "journey-id" },
  procedure: { id: "procedure-id" },
  steps: [{ id: "step-one" }, { id: "step-two" }],
};

describe("GuideProcedurePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMock.getSession.mockResolvedValue({ data: { user: { id: "managed-user" } } });
    getGuideMock.mockResolvedValue(guide);
    getProgressMock.mockResolvedValue({
      journey: { currentStepId: "step-two", mode: "LEARN", status: "IN_PROGRESS" },
      procedure: { currentStepId: "step-two" },
      steps: [{ stepId: "step-one", status: "COMPLETED" }],
    });
  });

  it("enforces a real server session", async () => {
    authMock.getSession.mockResolvedValue({ data: { user: null } });
    await expect(GuideProcedurePage({ params })).rejects.toThrow("redirect:/auth/sign-in");
    expect(getGuideMock).not.toHaveBeenCalled();
  });

  it("returns not found for missing or unpublished Guide content", async () => {
    getGuideMock.mockResolvedValue(null);
    await expect(GuideProcedurePage({ params })).rejects.toThrow("not-found");
  });

  it("passes explicit saved position and completion state to Guide Mode", async () => {
    const element = await GuideProcedurePage({ params });
    expect(element.props.progress).toEqual({
      currentStepId: "step-two",
      mode: "LEARN",
      status: "IN_PROGRESS",
      stepStatuses: { "step-one": "COMPLETED" },
    });
  });
});
