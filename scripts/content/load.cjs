const { readdir, readFile } = require("node:fs/promises");
const path = require("node:path");
const YAML = require("yaml");
const { parseDocument } = require("./schemas.cjs");

async function findYamlFiles(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const target = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...await findYamlFiles(target));
    else if (/\.ya?ml$/i.test(entry.name)) files.push(target);
  }
  return files;
}

async function loadContent(root) {
  const files = await findYamlFiles(path.resolve(root));
  const entities = [];
  const sources = [];
  for (const filePath of files) {
    const bytes = await readFile(filePath);
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    const documents = YAML.parseAllDocuments(text, { strict: true, uniqueKeys: true, stringKeys: true });
    for (const [index, document] of documents.entries()) {
      if (document.errors.length || document.warnings.length) {
        const diagnostics = [...document.errors, ...document.warnings].map((item) => item.message).join("; ");
        throw new Error(`${filePath}#document-${index + 1}: ${diagnostics}`);
      }
      const authoredAt = `${filePath}#document-${index + 1}`;
      const raw = document.toJS({ maxAliasCount: 0 });
      let parsed;
      try {
        parsed = parseDocument(raw);
      } catch (error) {
        const key = raw?.key ?? "unknown-key";
        const details = error.issues?.map((issue) => `${issue.path.join(".") || "document"}: ${issue.message}`).join("; ") ?? error.message;
        throw new Error(`${authoredAt}: ${key}: ${details}`);
      }
      const withFile = { ...parsed, filePath: authoredAt };
      if (parsed.kind === "SOURCE_REFERENCE") sources.push(withFile);
      else {
        entities.push(withFile);
        if (parsed.kind === "PROCEDURE") {
          for (const authoredStep of parsed.steps) {
            entities.push({ ...authoredStep, implementation: parsed.implementation, procedure: parsed.key, filePath: authoredAt });
          }
        }
      }
    }
  }
  return { root: path.resolve(root), files, entities, sources };
}

module.exports = { findYamlFiles, loadContent };
