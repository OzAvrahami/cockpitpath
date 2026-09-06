import { describe, expect, it, vi } from "vitest";

const { authMock, getJourneyMock, redirectMock } = vi.hoisted(() => ({
  authMock: { getSession: vi.fn() },
  getJourneyMock: vi.fn(),
  redirectMock: vi.fn((path) => { throw new Error(`redirect:${path}`); }),
}));

vi.mock("../../../lib/auth/server", () => ({ auth: authMock }));
vi.mock("../../../lib/content/repository", () => ({
  getGuideRouteForStep: vi.fn(),
  getJourneyOutline: getJourneyMock,
}));
vi.mock("../../../lib/progress/data-api", () => ({ getGuideProgress: vi.fn() }));
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => { throw new Error("not-found"); }),
  redirect: redirectMock,
}));

import JourneyResumePage from "./page";

describe("JourneyResumePage", () => {
  it("protects the journey while preserving its safe return destination", async () => {
    authMock.getSession.mockResolvedValue({ data: { user: null } });

    await expect(
      JourneyResumePage({ params: Promise.resolve({ journeySlug: "cold-dark-to-takeoff" }) }),
    ).rejects.toThrow(
      "redirect:/auth/sign-in?returnTo=%2Flearn%2Fcold-dark-to-takeoff",
    );
    expect(getJourneyMock).not.toHaveBeenCalled();
  });
});
