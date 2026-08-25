import { beforeAll, describe, expect, it } from "vitest";
import loadModule from "./load.cjs";
import schemaModule from "./schemas.cjs";
import validationModule from "./validate.cjs";

const { loadContent } = loadModule;
const { parseDocument } = schemaModule;
const { ContentValidationError, validateGraph } = validationModule;

let fixture;

function copyGraph() {
  return structuredClone(fixture);
}

function expectRule(graph, rule) {
  try {
    validateGraph(graph);
  } catch (error) {
    expect(error).toBeInstanceOf(ContentValidationError);
    expect(error.diagnostics.some((item) => item.rule === rule)).toBe(true);
    return;
  }
  throw new Error(`Expected validation rule ${rule} to fail`);
}

beforeAll(async () => {
  fixture = await loadContent("test/fixtures/content/valid");
});

describe("repository content validation", () => {
  it("accepts the complete synthetic connected graph", () => {
    const result = validateGraph(copyGraph());
    expect(result.entities).toHaveLength(18);
    expect(result.sources).toHaveLength(1);
  });

  it("rejects duplicate stable keys", () => {
    const graph = copyGraph();
    graph.entities.push(structuredClone(graph.entities[0]));
    expectRule(graph, "key.unique");
  });

  it("rejects missing and wrong-kind references", () => {
    const missing = copyGraph();
    missing.entities.find(({ kind }) => kind === "CONTROL").cockpit_area = "area.synthetic-missing";
    expectRule(missing, "reference.missing");

    const wrongKind = copyGraph();
    wrongKind.entities.find(({ kind }) => kind === "CONTROL").cockpit_area = "system.synthetic-wp2";
    expectRule(wrongKind, "reference.kind");
  });

  it("rejects cockpit hierarchy cycles", () => {
    const graph = copyGraph();
    graph.entities.find(({ key }) => key === "area.synthetic-wp2-cockpit").parent_area = "area.synthetic-wp2-panel";
    expectRule(graph, "cockpit.cycle");
  });

  it("rejects implementation-scoped relationship crossings", () => {
    const graph = copyGraph();
    graph.entities.find(({ kind }) => kind === "CONTROL").implementation = "implementation.synthetic-other";
    graph.entities.push({
      ...structuredClone(graph.entities.find(({ kind }) => kind === "AIRCRAFT_IMPLEMENTATION")),
      key: "implementation.synthetic-other",
      slug: "synthetic-other",
      status: "DRAFT",
      verifications: [],
    });
    expectRule(graph, "reference.scope");
  });

  it("rejects hotspot geometry outside normalized bounds", () => {
    const hotspot = structuredClone(fixture.entities.find(({ kind }) => kind === "HOTSPOT"));
    delete hotspot.filePath;
    hotspot.x = 0.9;
    hotspot.width = 0.2;
    expect(() => parseDocument(hotspot)).toThrow(/outside normalized bounds/);
  });

  it("rejects invalid lifecycle states", () => {
    const aircraft = structuredClone(fixture.entities.find(({ kind }) => kind === "AIRCRAFT"));
    delete aircraft.filePath;
    aircraft.status = "READY";
    expect(() => parseDocument(aircraft)).toThrow();
  });

  it("requires matching verification before publication", () => {
    const graph = copyGraph();
    graph.entities.find(({ kind }) => kind === "CONTROL").verifications = [];
    expectRule(graph, "publication.verification");
  });

  it("rejects broken media references", () => {
    const graph = copyGraph();
    graph.entities.find(({ kind }) => kind === "COCKPIT_VIEW").media = "media.synthetic-missing";
    expectRule(graph, "reference.missing");
  });
});
