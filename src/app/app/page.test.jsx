import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getJourneyMock, getProgressMock } = vi.hoisted(() => ({
  getJourneyMock: vi.fn(),
  getProgressMock: vi.fn(),
}));

vi.mock("../../lib/content/repository", () => ({
  getJourneyOutline: getJourneyMock,
}));
vi.mock("../../lib/progress/data-api", () => ({
  getGuideProgress: getProgressMock,
}));

import ApplicationHomePage from "./page";

const journey = {
  id: "journey-id",
  slug: "cold-dark-to-takeoff",
  title: "Cold & Dark → Takeoff",
  sections: [{ procedureId: "procedure-id", procedureSlug: "power-up" }],
};

async function renderAppHome() {
  return renderToStaticMarkup(await ApplicationHomePage());
}

describe("ApplicationHomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getJourneyMock.mockResolvedValue(journey);
    getProgressMock.mockResolvedValue({ journey: null, procedure: null, steps: [] });
  });

  it("presents the one supported aircraft and the real Guide Mode journey", async () => {
    const markup = await renderAppHome();

    expect(markup.match(/<h1/g)).toHaveLength(1);
    expect(markup).toContain('id="app-home-title">Boeing 737 MAX 8</h1>');
    expect(markup).toContain("iFly");
    expect(markup).toContain("Microsoft Flight Simulator 2024");
    expect(markup).toContain("Cold &amp; Dark → Takeoff");
    expect(markup).toContain('href="/learn/cold-dark-to-takeoff"');
    expect(markup).toContain("Start Guide Mode");
    expect(markup).toContain('data-media-status="deferred"');
  });

  it("uses authoritative progress only to distinguish continue from start", async () => {
    getProgressMock.mockResolvedValue({
      journey: { currentStepId: "step-id", status: "IN_PROGRESS" },
      procedure: null,
      steps: [],
    });

    const markup = await renderAppHome();

    expect(markup).toContain("Continue Guide Mode");
    expect(markup).not.toContain("Step 04");
    expect(markup).not.toContain("% complete");
  });

  it("uses a truthful fallback when progress cannot be loaded", async () => {
    getProgressMock.mockRejectedValue(new Error("provider unavailable"));

    const markup = await renderAppHome();

    expect(markup).toContain("Open Guide Mode");
    expect(markup).toContain("resolve any saved position");
    expect(markup).not.toContain("Start Guide Mode");
    expect(markup).not.toContain("Continue Guide Mode");
  });

  it("does not create routes or dead links for unavailable future areas", async () => {
    const markup = await renderAppHome();

    expect(markup).toContain("Aircraft Page");
    expect(markup).toContain("Cockpit Explorer");
    expect(markup).toContain("Aircraft Systems");
    expect(markup.match(/Coming soon/g)).toHaveLength(3);
    expect(markup).not.toContain('href="/aircraft"');
    expect(markup).not.toContain('href="/cockpit-explorer"');
    expect(markup).not.toContain('href="/systems"');
  });
});
