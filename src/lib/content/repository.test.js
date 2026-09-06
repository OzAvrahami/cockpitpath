import { beforeEach, describe, expect, it, vi } from "vitest";

const { queryMock } = vi.hoisted(() => ({ queryMock: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("./database", () => ({ queryPublished: queryMock }));

import { getCockpitExplorer } from "./repository";

function result(rows) {
  return { rowCount: rows.length, rows };
}

describe("getCockpitExplorer", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads and composes one implementation-scoped published cockpit graph", async () => {
    queryMock
      .mockResolvedValueOnce(result([{
        id: "implementation",
        slug: "synthetic-wp2",
        display_name: "Synthetic implementation",
        support_status: "SUPPORTED",
        aircraft_slug: "synthetic-aircraft",
        aircraft_name: "Synthetic Aircraft",
        simulator_name: "Synthetic Simulator",
        developer_name: "Synthetic Developer",
        product_name: "Synthetic Add-on",
      }]))
      .mockResolvedValueOnce(result([{
        id: "area",
        parent_area_id: null,
        area_type: "PANEL",
        slug: "synthetic-panel",
        title: "Synthetic Panel",
        sort_order: 1,
      }]))
      .mockResolvedValueOnce(result([{
        id: "view",
        cockpit_area_id: "area",
        view_role: "PRIMARY",
        title: "Synthetic View",
        sort_order: 1,
        is_primary: true,
        media_id: "media",
        storage_key: "synthetic/test.png",
        mime_type: "image/png",
        width: 1600,
        height: 900,
        accessible_description: "Synthetic view",
        rights_status: "PENDING",
        verification_status: "PENDING",
      }]))
      .mockResolvedValueOnce(result([{
        id: "control",
        cockpit_area_id: "area",
        slug: "synthetic-control",
        canonical_name: "Synthetic Control",
        control_type: "SWITCH",
        what_it_does: "Test purpose",
        when_used: "Test use",
        search_aliases: ["test switch"],
        system_id: "system",
        system_slug: "synthetic-system",
        system_title: "Synthetic System",
      }]))
      .mockResolvedValueOnce(result([{
        id: "hotspot",
        cockpit_view_id: "view",
        target_cockpit_area_id: null,
        target_control_id: "control",
        x: "0.1",
        y: "0.2",
        width: "0.3",
        height: "0.4",
        shape: "RECTANGLE",
        label: "Synthetic Control",
        sort_order: 1,
      }]))
      .mockResolvedValueOnce(result([{
        control_id: "control",
        id: "concept",
        title: "Synthetic Concept",
        short_definition: "Test definition",
        why_it_matters: "Test reason",
      }]))
      .mockResolvedValueOnce(result([{
        control_id: "control",
        journey_slug: "synthetic-journey",
        journey_title: "Synthetic Journey",
        procedure_slug: "synthetic-procedure",
        procedure_title: "Synthetic Procedure",
        step_id: "step",
        step_sequence: 1,
        step_title: "Synthetic Step",
      }]));

    const explorer = await getCockpitExplorer("synthetic-wp2");

    expect(queryMock).toHaveBeenCalledTimes(7);
    expect(queryMock.mock.calls[0][1]).toEqual(["synthetic-wp2"]);
    expect(explorer.implementation.slug).toBe("synthetic-wp2");
    expect(explorer.areas[0].views[0].media.url).toBeNull();
    expect(explorer.areas[0].views[0].hotspots[0]).toMatchObject({
      targetControlId: "control", x: 0.1, width: 0.3,
    });
    expect(explorer.controls[0].concepts[0].title).toBe("Synthetic Concept");
    expect(explorer.controls[0].procedures[0].procedureSlug).toBe("synthetic-procedure");
    expect(explorer.controls[0].aliases).toEqual(["test switch"]);
  });

  it("returns null when no published implementation matches", async () => {
    queryMock.mockResolvedValueOnce(result([]));
    await expect(getCockpitExplorer("unknown-implementation")).resolves.toBeNull();
    expect(queryMock).toHaveBeenCalledOnce();
  });
});
