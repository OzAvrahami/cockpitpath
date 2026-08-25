import { describe, expect, it } from "vitest";

import {
  hotspotStyle,
  initialStepIndex,
  resolvedStepStatuses,
  stepIndexById,
} from "./model";

const steps = [{ id: "step-a" }, { id: "step-b" }, { id: "step-c" }];

describe("Guide Mode model", () => {
  it("resumes the exact stored step and falls back to the first published step", () => {
    expect(initialStepIndex(steps, "step-b")).toBe(1);
    expect(initialStepIndex(steps, "archived-step")).toBe(0);
    expect(initialStepIndex([], "step-a")).toBe(-1);
  });

  it("keeps a completed step completed across an idempotent skip retry", () => {
    expect(resolvedStepStatuses({ "step-a": "COMPLETED" }, "step-a", "SKIPPED"))
      .toEqual({ "step-a": "COMPLETED" });
    expect(resolvedStepStatuses({}, "step-b", "SKIPPED"))
      .toEqual({ "step-b": "SKIPPED" });
  });

  it("uses the returned step identity without guessing from sequence", () => {
    expect(stepIndexById(steps, "step-c", 0)).toBe(2);
    expect(stepIndexById(steps, "step-missing", 1)).toBe(1);
  });

  it("maps normalized hotspot geometry to responsive percentages", () => {
    expect(hotspotStyle({ x: 0.1, y: 0.2, width: 0.25, height: 0.3 })).toEqual({
      left: "10%",
      top: "20%",
      width: "25%",
      height: "30%",
    });
  });
});
