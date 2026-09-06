import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import CockpitExplorer from "./cockpit-explorer";

const explorer = {
  implementation: {
    slug: "synthetic-wp2",
    aircraftName: "Synthetic Aircraft",
    addonDeveloper: "Synthetic Developer",
    simulatorName: "Synthetic Simulator",
  },
  areas: [
    { id: "cockpit", parentId: null, slug: "synthetic-cockpit", title: "Synthetic Cockpit", views: [] },
    {
      id: "panel",
      parentId: "cockpit",
      slug: "synthetic-panel",
      title: "Synthetic Panel",
      views: [{
        id: "view",
        title: "Synthetic Cockpit View",
        primary: true,
        media: { url: null },
        hotspots: [{
          id: "hotspot",
          targetAreaId: null,
          targetControlId: "control",
          label: "Synthetic Control",
          x: 0.1,
          y: 0.2,
          width: 0.2,
          height: 0.2,
        }],
      }],
    },
  ],
  controls: [{
    id: "control",
    areaId: "panel",
    slug: "synthetic-control",
    name: "Synthetic Control",
    type: "SWITCH",
    whatItDoes: "Supports Explorer tests.",
    whenUsed: "Only during isolated validation.",
    aliases: ["test switch"],
    system: { id: "system", slug: "synthetic-system", title: "Synthetic System" },
    concepts: [{ id: "concept", title: "Synthetic Concept" }],
    procedures: [{
      journeySlug: "synthetic-journey",
      procedureSlug: "synthetic-procedure",
      procedureTitle: "Synthetic Procedure",
      stepId: "step",
      stepSequence: 1,
    }],
  }],
};

describe("CockpitExplorer", () => {
  it("renders the responsive, searchable Explorer with deferred media", () => {
    const markup = renderToStaticMarkup(<CockpitExplorer explorer={explorer} />);

    expect(markup).toContain("Cockpit Explorer");
    expect(markup).toContain('type="search"');
    expect(markup).toContain('data-media-status="deferred"');
    expect(markup).toContain('data-hotspot-layer="separate"');
    expect(markup).toContain('aria-label="Cockpit location"');
    expect(markup).toContain('aria-label="Cockpit area selector"');
    expect(markup).toContain("Select a cockpit control");
  });

  it("resolves selected control detail and Guide Mode context from shared data", () => {
    const markup = renderToStaticMarkup(
      <CockpitExplorer
        explorer={explorer}
        initialControlSlug="synthetic-control"
        returnPath="/learn/synthetic-journey/synthetic-procedure"
      />,
    );

    expect(markup).toContain('aria-label="Selected control: Synthetic Control"');
    expect(markup).toContain("Guide me there");
    expect(markup).toContain("Supports Explorer tests.");
    expect(markup).toContain("test switch");
    expect(markup).toContain("Synthetic System");
    expect(markup).toContain("Synthetic Concept");
    expect(markup).toContain("Synthetic Procedure · step 1");
    expect(markup).toContain("← Back to Guide Mode");
  });
});
