import { describe, expect, it } from "vitest";

import {
  areaTrail,
  explorerContextPath,
  findViewForControl,
  guideContextPath,
  hotspotPosition,
  isValidImplementationSlug,
  searchControls,
} from "./explorer";

const explorer = {
  areas: [
    { id: "cockpit", parentId: null, slug: "cockpit", title: "Cockpit", views: [] },
    { id: "overhead", parentId: "cockpit", slug: "overhead", title: "Overhead", views: [] },
    {
      id: "electrical",
      parentId: "overhead",
      slug: "electrical",
      title: "Electrical",
      views: [{ id: "view", primary: true, hotspots: [{ targetControlId: "battery" }] }],
    },
  ],
  controls: [{
    id: "battery",
    areaId: "electrical",
    slug: "battery-switch",
    name: "Battery Switch",
    aliases: ["battery master", "power switch"],
  }],
};

describe("Cockpit Explorer model", () => {
  it("validates canonical implementation slugs", () => {
    expect(isValidImplementationSlug("ifly-737-max-8-msfs-2024")).toBe(true);
    expect(isValidImplementationSlug("../unsafe")).toBe(false);
    expect(isValidImplementationSlug("Invalid Slug")).toBe(false);
  });

  it("resolves hierarchy, control view, aliases, and location search", () => {
    expect(areaTrail(explorer.areas, "electrical").map(({ slug }) => slug)).toEqual([
      "cockpit", "overhead", "electrical",
    ]);
    expect(findViewForControl(explorer, explorer.controls[0])?.id).toBe("view");
    expect(searchControls(explorer, "battery master")).toEqual(explorer.controls);
    expect(searchControls(explorer, "overhead")).toEqual(explorer.controls);
    expect(searchControls(explorer, "unknown")).toEqual([]);
  });

  it("keeps normalized hotspots separate and preserves cross-feature context", () => {
    expect(hotspotPosition({ x: 0.1, y: 0.2, width: 0.3, height: 0.4 })).toEqual({
      left: "10%", top: "20%", width: "30%", height: "40%",
    });
    const explorerPath = explorerContextPath(
      "ifly-737-max-8-msfs-2024",
      "electrical",
      "battery-switch",
    );
    expect(explorerPath).toBe(
      "/app/cockpit/ifly-737-max-8-msfs-2024?area=electrical&control=battery-switch",
    );
    expect(guideContextPath(
      { journeySlug: "synthetic-journey", procedureSlug: "synthetic-procedure" },
      explorerPath,
      "battery-switch",
    )).toContain("from=%2Fapp%2Fcockpit%2Fifly-737-max-8-msfs-2024");
  });
});
