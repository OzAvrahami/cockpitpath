import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock("../../app/learn/actions", () => ({
  recordStepProgressAction: vi.fn(),
  setGuidePositionAction: vi.fn(),
}));

import GuideMode, {
  focusGuideTarget,
  guideMediaAspectRatio,
  guideShortcutAction,
} from "./guide-mode";

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
    expect(markup).toContain('role="progressbar"');
    expect(markup).toContain('aria-valuetext="0 of 1 steps complete, 0 skipped. Step 1 is current."');
    expect(markup).toContain('aria-label="Step navigation"');
    expect(markup).toContain('aria-controls="guide-stage"');
  });

  it("keeps required-step Skip visibly unavailable", () => {
    const markup = renderToStaticMarkup(
      <GuideMode guide={guide} progress={{ currentStepId: "step-one", mode: "QUICK", status: "IN_PROGRESS", stepStatuses: {} }} />,
    );
    expect(markup).toContain("Required steps cannot be skipped");
    expect(markup).toContain('aria-label="Skip unavailable: this step is required"');
    expect(markup).not.toContain("A test-only explanation.");
  });

  it("renders normalized hotspot geometry over an available cockpit visual", () => {
    const withMedia = structuredClone(guide);
    withMedia.steps[0].visual.media = {
      url: "/synthetic-guide-test.png",
      alt: "Synthetic cockpit view used only by this test",
      width: 1600,
      height: 900,
    };
    const markup = renderToStaticMarkup(
      <GuideMode guide={withMedia} progress={{ currentStepId: "step-one", mode: "LEARN", status: "IN_PROGRESS", stepStatuses: {} }} />,
    );

    expect(markup).toContain('aria-label="Current target: Synthetic target"');
    expect(markup).toContain('class="guide-visual__canvas"');
    expect(markup).toContain("aspect-ratio:1600 / 900");
    expect(markup).toContain("left:10%");
    expect(markup).toContain("top:20%");
    expect(markup).toContain("width:20%");
    expect(markup).toContain("height:20%");
  });

  it("distinguishes completed, skipped, and current progress without color alone", () => {
    const withProgress = structuredClone(guide);
    withProgress.steps = [
      withProgress.steps[0],
      { ...structuredClone(withProgress.steps[0]), id: "step-two", action: "Second synthetic action." },
      { ...structuredClone(withProgress.steps[0]), id: "step-three", action: "Third synthetic action." },
    ];

    const markup = renderToStaticMarkup(
      <GuideMode
        guide={withProgress}
        progress={{
          currentStepId: "step-three",
          mode: "LEARN",
          status: "IN_PROGRESS",
          stepStatuses: { "step-one": "COMPLETED", "step-two": "SKIPPED" },
        }}
      />,
    );

    expect(markup).toContain('aria-valuenow="1"');
    expect(markup).toContain('aria-valuetext="1 of 3 steps complete, 1 skipped. Step 3 is current."');
    expect(markup).toContain("guide-progress__tick is-completed");
    expect(markup).toContain("guide-progress__tick is-skipped");
    expect(markup).toContain("guide-progress__tick is-current");
    expect(markup).toContain('tabindex="-1"');
  });

  it("keeps deferred media explicit and separate from a rendered hotspot overlay", () => {
    const markup = renderToStaticMarkup(
      <GuideMode guide={guide} progress={{ currentStepId: "step-one", mode: "LEARN", status: "IN_PROGRESS", stepStatuses: {} }} />,
    );

    expect(markup).toContain("Verified media is not available for this step yet.");
    expect(markup).not.toContain('class="guide-hotspot"');
  });
});

describe("Guide Mode interaction helpers", () => {
  it("uses verified media dimensions and a stable fallback aspect ratio", () => {
    expect(guideMediaAspectRatio({ width: 2048, height: 1152 })).toBe("2048 / 1152");
    expect(guideMediaAspectRatio({ width: 0, height: null })).toBe("16 / 9");
  });

  it("schedules predictable focus on the new current action", () => {
    const target = { focus: vi.fn() };
    const schedule = vi.fn((callback) => callback());

    focusGuideTarget(target, schedule);

    expect(schedule).toHaveBeenCalledOnce();
    expect(target.focus).toHaveBeenCalledWith({ preventScroll: false });
  });

  it("maps keyboard shortcuts while respecting boundaries and interactive content", () => {
    const state = { focusMode: false, stepIndex: 1, stepCount: 3 };

    expect(guideShortcutAction({ key: "ArrowLeft" }, state)).toBe("PREVIOUS");
    expect(guideShortcutAction({ key: "ArrowRight" }, state)).toBe("NEXT");
    expect(guideShortcutAction({ code: "Space" }, state)).toBe("COMPLETE");
    expect(guideShortcutAction({ key: "ArrowLeft" }, { ...state, stepIndex: 0 })).toBeNull();
    expect(guideShortcutAction({ key: "ArrowRight" }, { ...state, stepIndex: 2 })).toBeNull();
    expect(guideShortcutAction({ code: "Space", interactive: true }, state)).toBeNull();
    expect(guideShortcutAction({ key: "ArrowRight", altKey: true }, state)).toBeNull();
  });

  it("lets Escape leave Focus Mode even when focus is on a control", () => {
    expect(
      guideShortcutAction(
        { key: "Escape", interactive: true },
        { focusMode: true, stepIndex: 0, stepCount: 1 },
      ),
    ).toBe("EXIT_FOCUS");
  });
});
