const { createHash } = require("node:crypto");

const HASH_EXCLUDED_FIELDS = new Set([
  "audience",
  "filePath",
  "revision",
  "sources",
  "status",
  "verifications",
]);

function canonicalize(value, excludedFields = new Set()) {
  if (Array.isArray(value)) {
    return value.map((item) => canonicalize(item, excludedFields));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .filter((key) => !excludedFields.has(key))
        .sort()
        .map((key) => [key, canonicalize(value[key], excludedFields)]),
    );
  }
  return value;
}

function sha256(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function contentHash(entity) {
  const editorialRecord = { ...entity };
  for (const relationshipField of ["steps"]) {
    delete editorialRecord[relationshipField];
  }
  return sha256(canonicalize(editorialRecord, HASH_EXCLUDED_FIELDS));
}

function graphDigest(graph) {
  const withoutFilePath = (item) => {
    const copy = { ...item };
    delete copy.filePath;
    return copy;
  };
  return sha256(
    canonicalize({
      entities: graph.entities.map(withoutFilePath).sort((a, b) => a.key.localeCompare(b.key)),
      sources: graph.sources.map(withoutFilePath).sort((a, b) => a.key.localeCompare(b.key)),
    }),
  );
}

module.exports = { canonicalize, contentHash, graphDigest, sha256 };
