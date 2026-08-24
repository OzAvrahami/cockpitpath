const { ZodError } = require("zod");
const { contentHash } = require("./hash.cjs");
const { isValidContentKey, keyMatchesKind } = require("./keys.cjs");

class ContentValidationError extends Error {
  constructor(diagnostics) {
    super(`Content validation failed with ${diagnostics.length} error(s).`);
    this.name = "ContentValidationError";
    this.diagnostics = diagnostics;
  }
}

const referenceRules = Object.freeze({
  AIRCRAFT_IMPLEMENTATION: [["aircraft", "AIRCRAFT"], ["simulator", "SIMULATOR"], ["addon_product", "ADDON_PRODUCT"]],
  JOURNEY: [["implementation", "AIRCRAFT_IMPLEMENTATION"]],
  PROCEDURE: [["implementation", "AIRCRAFT_IMPLEMENTATION"]],
  PROCEDURE_STEP: [["implementation", "AIRCRAFT_IMPLEMENTATION"], ["procedure", "PROCEDURE"]],
  MEDIA_ASSET: [["implementation", "AIRCRAFT_IMPLEMENTATION", true]],
  COCKPIT_AREA: [["implementation", "AIRCRAFT_IMPLEMENTATION"], ["parent_area", "COCKPIT_AREA", true]],
  AIRCRAFT_SYSTEM: [["implementation", "AIRCRAFT_IMPLEMENTATION"]],
  SYSTEM_COMPONENT: [["implementation", "AIRCRAFT_IMPLEMENTATION"], ["system", "AIRCRAFT_SYSTEM"]],
  CONCEPT: [["implementation", "AIRCRAFT_IMPLEMENTATION", true]],
  CONTROL: [["implementation", "AIRCRAFT_IMPLEMENTATION"], ["cockpit_area", "COCKPIT_AREA"], ["aircraft_system", "AIRCRAFT_SYSTEM", true]],
  COCKPIT_VIEW: [["implementation", "AIRCRAFT_IMPLEMENTATION"], ["cockpit_area", "COCKPIT_AREA"], ["media", "MEDIA_ASSET"]],
  HOTSPOT: [["implementation", "AIRCRAFT_IMPLEMENTATION"], ["cockpit_view", "COCKPIT_VIEW"], ["target_cockpit_area", "COCKPIT_AREA", true], ["target_control", "CONTROL", true]],
});

function diagnostic(entity, rule, message, path = entity.filePath) {
  return { key: entity.key, path, rule, message };
}

function effectiveImplementation(entity, byKey) {
  if (entity.kind === "AIRCRAFT_IMPLEMENTATION") return entity.key;
  if (entity.implementation) return entity.implementation;
  if (entity.kind === "PROCEDURE_STEP") return byKey.get(entity.procedure)?.implementation;
  return undefined;
}

function validateGraph(graph) {
  const diagnostics = [];
  const byKey = new Map();
  const all = [...graph.sources, ...graph.entities];

  for (const item of all) {
    if (!isValidContentKey(item.key)) diagnostics.push(diagnostic(item, "key.syntax", "invalid stable content key"));
    if (!keyMatchesKind(item.key, item.kind)) diagnostics.push(diagnostic(item, "key.kind", `key prefix does not match ${item.kind}`));
    if (byKey.has(item.key)) diagnostics.push(diagnostic(item, "key.unique", `duplicate key also declared in ${byKey.get(item.key).filePath}`));
    else byKey.set(item.key, item);
  }

  const uniqueness = new Map();
  const rememberUnique = (entity, rule, signature) => {
    if (!signature) return;
    const composite = `${rule}:${signature}`;
    if (uniqueness.has(composite)) diagnostics.push(diagnostic(entity, rule, `value conflicts with ${uniqueness.get(composite).key}`));
    else uniqueness.set(composite, entity);
  };
  for (const entity of graph.entities) {
    if (["AIRCRAFT", "SIMULATOR", "ADDON_PRODUCT", "AIRCRAFT_IMPLEMENTATION"].includes(entity.kind)) rememberUnique(entity, "identity.slug", `${entity.kind}:${entity.slug}`);
    if (["JOURNEY", "PROCEDURE", "COCKPIT_AREA", "AIRCRAFT_SYSTEM", "CONTROL"].includes(entity.kind)) rememberUnique(entity, "identity.scoped-slug", `${entity.kind}:${entity.implementation}:${entity.slug}`);
    if (entity.kind === "SYSTEM_COMPONENT") rememberUnique(entity, "identity.scoped-slug", `${entity.kind}:${entity.system}:${entity.slug}`);
    if (entity.kind === "CONCEPT") rememberUnique(entity, "identity.scoped-slug", `${entity.kind}:${entity.implementation ?? "GLOBAL"}:${entity.slug}`);
    if (entity.kind === "MEDIA_ASSET") rememberUnique(entity, "media.storage-key", entity.storage_key);
    if (entity.kind === "COCKPIT_VIEW") {
      rememberUnique(entity, "view.order", `${entity.cockpit_area}:${entity.sort_order}`);
      if (entity.is_primary) rememberUnique(entity, "view.primary", entity.cockpit_area);
    }
    if (entity.kind === "HOTSPOT") rememberUnique(entity, "hotspot.order", `${entity.cockpit_view}:${entity.sort_order}`);
  }

  function requireReference(owner, key, expectedKind, field) {
    if (!key) return undefined;
    const target = byKey.get(key);
    if (!target) diagnostics.push(diagnostic(owner, "reference.missing", `${field} references missing key ${key}`));
    else if (target.kind !== expectedKind) diagnostics.push(diagnostic(owner, "reference.kind", `${field} expects ${expectedKind}, received ${target.kind}`));
    return target;
  }

  for (const entity of graph.entities) {
    for (const [field, kind, optional] of referenceRules[entity.kind] ?? []) {
      if (!optional || entity[field]) requireReference(entity, entity[field], kind, field);
    }
    for (const source of entity.sources) requireReference(entity, source.key, "SOURCE_REFERENCE", "sources");
    for (const event of entity.verifications) {
      if (event.implementation) requireReference(entity, event.implementation, "AIRCRAFT_IMPLEMENTATION", "verification.implementation");
      if (event.revision !== entity.revision) diagnostics.push(diagnostic(entity, "verification.revision", "verification revision must match the authored revision"));
    }

    const implementation = effectiveImplementation(entity, byKey);
    const assertSameImplementation = (target, field, allowGlobal = false) => {
      if (!target) return;
      const targetImplementation = effectiveImplementation(target, byKey);
      if (allowGlobal && !targetImplementation) return;
      if (implementation && targetImplementation !== implementation) diagnostics.push(diagnostic(entity, "reference.scope", `${field} crosses AircraftImplementation scope`));
    };

    if (entity.kind === "JOURNEY") {
      const sequences = new Set();
      for (const section of entity.sections) {
        const procedure = requireReference(entity, section.procedure, "PROCEDURE", "sections.procedure");
        assertSameImplementation(procedure, "sections.procedure");
        if (sequences.has(section.sequence)) diagnostics.push(diagnostic(entity, "sequence.unique", `duplicate journey section sequence ${section.sequence}`));
        sequences.add(section.sequence);
      }
    }
    if (entity.kind === "PROCEDURE") {
      const sequences = new Set();
      for (const step of entity.steps) {
        if (sequences.has(step.sequence)) diagnostics.push(diagnostic(step, "sequence.unique", `duplicate procedure step sequence ${step.sequence}`));
        sequences.add(step.sequence);
      }
    }
    if (entity.kind === "PROCEDURE_STEP") {
      const procedure = byKey.get(entity.procedure);
      assertSameImplementation(procedure, "procedure");
      const controlSequences = new Set();
      for (const link of entity.controls) {
        const control = requireReference(entity, link.key, "CONTROL", "controls.key");
        assertSameImplementation(control, "controls.key");
        if (link.preferred_hotspot) {
          const hotspot = requireReference(entity, link.preferred_hotspot, "HOTSPOT", "controls.preferred_hotspot");
          assertSameImplementation(hotspot, "controls.preferred_hotspot");
          if (hotspot?.target_control !== link.key) diagnostics.push(diagnostic(entity, "hotspot.control", "preferred hotspot must target the linked control"));
        }
        if (controlSequences.has(link.sequence)) diagnostics.push(diagnostic(entity, "sequence.unique", `duplicate step-control sequence ${link.sequence}`));
        controlSequences.add(link.sequence);
      }
      for (const visual of entity.visuals) {
        const view = visual.cockpit_view && requireReference(entity, visual.cockpit_view, "COCKPIT_VIEW", "visuals.cockpit_view");
        const media = visual.media && requireReference(entity, visual.media, "MEDIA_ASSET", "visuals.media");
        const hotspot = visual.hotspot && requireReference(entity, visual.hotspot, "HOTSPOT", "visuals.hotspot");
        assertSameImplementation(view, "visuals.cockpit_view");
        assertSameImplementation(media, "visuals.media", true);
        assertSameImplementation(hotspot, "visuals.hotspot");
        if (view && media && view.media !== media.key) diagnostics.push(diagnostic(entity, "visual.media", "visual media must match the cockpit view media"));
        if (view && hotspot && hotspot.cockpit_view !== view.key) diagnostics.push(diagnostic(entity, "visual.hotspot", "visual hotspot must belong to the selected cockpit view"));
      }
    }
    if (entity.kind === "COCKPIT_AREA" && entity.parent_area) assertSameImplementation(byKey.get(entity.parent_area), "parent_area");
    if (entity.kind === "CONTROL") {
      assertSameImplementation(byKey.get(entity.cockpit_area), "cockpit_area");
      if (entity.aircraft_system) assertSameImplementation(byKey.get(entity.aircraft_system), "aircraft_system");
    }
    if (entity.kind === "COCKPIT_VIEW") {
      assertSameImplementation(byKey.get(entity.cockpit_area), "cockpit_area");
      assertSameImplementation(byKey.get(entity.media), "media", true);
    }
    if (entity.kind === "HOTSPOT") {
      const view = byKey.get(entity.cockpit_view);
      const target = byKey.get(entity.target_cockpit_area ?? entity.target_control);
      assertSameImplementation(view, "cockpit_view");
      assertSameImplementation(target, "hotspot target");
      if ((target?.kind === "CONTROL" || target?.kind === "COCKPIT_AREA") && view) {
        const visibleArea = view.cockpit_area;
        let targetArea = target.kind === "CONTROL" ? target.cockpit_area : target.key;
        const seen = new Set();
        while (targetArea && targetArea !== visibleArea && !seen.has(targetArea)) {
          seen.add(targetArea);
          targetArea = byKey.get(targetArea)?.parent_area;
        }
        if (targetArea !== visibleArea) diagnostics.push(diagnostic(entity, "hotspot.context", "target control is outside the cockpit view area hierarchy"));
      }
    }
    if (entity.kind === "SYSTEM_COMPONENT") {
      assertSameImplementation(byKey.get(entity.system), "system");
      for (const link of entity.controls) assertSameImplementation(requireReference(entity, link.key, "CONTROL", "controls.key"), "controls.key");
      for (const link of entity.concepts) assertSameImplementation(requireReference(entity, link.key, "CONCEPT", "concepts.key"), "concepts.key", true);
    }
  }

  for (const area of graph.entities.filter(({ kind }) => kind === "COCKPIT_AREA")) {
    const seen = new Set([area.key]);
    let parent = area.parent_area;
    while (parent) {
      if (seen.has(parent)) {
        diagnostics.push(diagnostic(area, "cockpit.cycle", "cockpit area hierarchy contains a cycle"));
        break;
      }
      seen.add(parent);
      parent = byKey.get(parent)?.parent_area;
    }
  }

  for (const entity of graph.entities.filter(({ status }) => status === "PUBLISHED")) {
    const hash = contentHash(entity);
    if (entity.sources.length === 0) diagnostics.push(diagnostic(entity, "publication.sources", "published content requires at least one source"));
    const verified = entity.verifications.some((event) => event.status === "VERIFIED" && event.revision === entity.revision && event.content_hash === hash);
    if (!verified) diagnostics.push(diagnostic(entity, "publication.verification", `published revision requires a VERIFIED event for content hash ${hash}`));
    if (entity.kind === "PROCEDURE" && entity.steps.length === 0) diagnostics.push(diagnostic(entity, "publication.completeness", "published procedure requires at least one step"));
    if (entity.kind === "JOURNEY" && entity.sections.length === 0) diagnostics.push(diagnostic(entity, "publication.completeness", "published journey requires at least one section"));
    if (entity.kind === "MEDIA_ASSET" && (entity.rights_status !== "APPROVED" || entity.verification_status !== "VERIFIED")) diagnostics.push(diagnostic(entity, "publication.media", "published media requires approved rights and verified metadata"));
    const referencedKeys = collectReferenceKeys(entity);
    for (const key of referencedKeys) {
      const target = byKey.get(key);
      if (target && target.kind !== "SOURCE_REFERENCE" && target.status !== "PUBLISHED") diagnostics.push(diagnostic(entity, "publication.graph", `published content references non-published ${key}`));
    }
  }

  if (diagnostics.length) throw new ContentValidationError(diagnostics);
  return { ...graph, byKey, hashes: new Map(graph.entities.map((entity) => [entity.key, contentHash(entity)])) };
}

function collectReferenceKeys(entity) {
  const keys = new Set(entity.sources.map(({ key }) => key));
  for (const [field] of referenceRules[entity.kind] ?? []) if (entity[field]) keys.add(entity[field]);
  if (entity.kind === "JOURNEY") for (const item of entity.sections) keys.add(item.procedure);
  if (entity.kind === "PROCEDURE_STEP") {
    for (const item of entity.controls) { keys.add(item.key); if (item.preferred_hotspot) keys.add(item.preferred_hotspot); }
    for (const item of entity.visuals) for (const field of ["cockpit_view", "media", "hotspot"]) if (item[field]) keys.add(item[field]);
  }
  if (entity.kind === "SYSTEM_COMPONENT") {
    for (const item of [...entity.controls, ...entity.concepts]) keys.add(item.key);
  }
  return keys;
}

function formatValidationError(error) {
  if (error instanceof ContentValidationError) return error.diagnostics.map((item) => `${item.path}: [${item.rule}] ${item.key}: ${item.message}`).join("\n");
  if (error instanceof ZodError) return error.issues.map((issue) => `${issue.path.join(".") || "document"}: ${issue.message}`).join("\n");
  return error.message || [error.name, error.code].filter(Boolean).join(" (") + (error.code ? ")" : "") || "Unknown content command failure";
}

module.exports = { ContentValidationError, collectReferenceKeys, formatValidationError, validateGraph };
