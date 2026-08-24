const KEY_PATTERN = /^[a-z]+(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)+$/;

const KIND_PREFIXES = Object.freeze({
  ADDON_PRODUCT: "addon",
  AIRCRAFT: "aircraft",
  AIRCRAFT_IMPLEMENTATION: "implementation",
  AIRCRAFT_SYSTEM: "system",
  COCKPIT_AREA: "area",
  COCKPIT_VIEW: "view",
  CONCEPT: "concept",
  CONTROL: "control",
  HOTSPOT: "hotspot",
  JOURNEY: "journey",
  MEDIA_ASSET: "media",
  PROCEDURE: "procedure",
  PROCEDURE_STEP: "step",
  SIMULATOR: "simulator",
  SOURCE_REFERENCE: "source",
  SYSTEM_COMPONENT: "component",
});

function isValidContentKey(value) {
  return typeof value === "string" && KEY_PATTERN.test(value);
}

function keyMatchesKind(key, kind) {
  return KIND_PREFIXES[kind] !== undefined && key.startsWith(`${KIND_PREFIXES[kind]}.`);
}

module.exports = { KEY_PATTERN, KIND_PREFIXES, isValidContentKey, keyMatchesKind };
