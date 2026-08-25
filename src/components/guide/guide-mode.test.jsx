import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock("../../app/learn/actions", () => ({
  recordStepProgressAction: vi.fn(),
  setGuidePositionAction: vi.fn(),
}));

import GuideMode from "./guide-mode";

const guide = {
  journey: { id: "journey", title: "Synthetic Journey", implementationName: "Synthetic Test Implementation" },
  section: { title: "Synthetic Section" },
  procedure: { title: "Synthetic Procedure" },
  steps: [{
    id: "step-one",
    sequence: 1,
    type: "ACTION",
    title: "Synthetic action",
    action: "Operate the synthetic control.",
    location: "Synthetic Panel",
    expectedResult: "The synthetic state changes.",
    explanation: "A test-only explanation.",
    tip: null,
    warning: null,
    optional: false,
    waitHint: null,
    controls: [{ id: "control", name: "Synthetic Control", area: "Synthetic Panel" }],
    concepts: [],
    visual: {
      title: "Synthetic View",
      media: { url: null },
      hotspot: { label: "Synthetic target", x: 0.1, y: 0.2, width: 0.2, height: 0.2 },
    },
  }],
};

describe("GuideMode", () => {
  it("renders the locked action, visual, expected-result, and navigation hierarchy", () => {
    const markup = renderToStaticMarkup(
      <GuideMode guide={guide} progress={{ currentStepId: "step-one", mode: "LEARN", status: "IN_PROGRESS", stepStatuses: {} }} />,
    );

    expect(markup).toContain("Operate the synthetic control.");
    expect(markup).toContain("Expected result");
    expect(markup).toContain("CockpitPath does not detect simulator state.");
    expect(markup).toContain("Done — Next");
    expect(markup).toContain("Quick");
    expect(markup).toContain("Learn");
    expect(markup).toContain("Target: Synthetic target");
  });

  it("keeps required-step Skip visibly unavailable", () => {
    const markup = renderToStaticMarkup(
      <GuideMode guide={guide} progress={{ currentStepId: "step-one", mode: "QUICK", status: "IN_PROGRESS", stepStatuses: {} }} />,
    );
    expect(markup).toContain("Required steps cannot be skipped");
    expect(markup).not.toContain("A test-only explanation.");
  });

  it("renders normalized hotspot geometry over an available cockpit visual", () => {
    const withMedia = structuredClone(guide);
    withMedia.steps[0].visual.media = {
      url: "/synthetic-guide-test.png",
      alt: "Synthetic cockpit view used only by this test",
    };
    const markup = renderToStaticMarkup(
      <GuideMode guide={withMedia} progress={{ currentStepId: "step-one", mode: "LEARN", status: "IN_PROGRESS", stepStatuses: {} }} />,
    );

    expect(markup).toContain('aria-label="Current target: Synthetic target"');
    expect(markup).toContain("left:10%");
    expect(markup).toContain("top:20%");
    expect(markup).toContain("width:20%");
    expect(markup).toContain("height:20%");
  });
});
