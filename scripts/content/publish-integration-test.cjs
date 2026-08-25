const assert = require("node:assert/strict");
const { Client } = require("pg");
const { assertSafeDatabaseEnvironment } = require("../database-safety.cjs");
const { contentHash } = require("./hash.cjs");
const { loadContent } = require("./load.cjs");
const { applyPublication, planPublication } = require("./publisher.cjs");
const { ContentValidationError, validateGraph } = require("./validate.cjs");

assertSafeDatabaseEnvironment();

const PREFIX = "%.synthetic-wp2%";

async function countSynthetic(client) {
  const result = await client.query(
    "select count(*)::int as count from public.content_records where content_key like $1",
    [PREFIX],
  );
  return result.rows[0].count;
}

async function beginPublisher(client) {
  await client.query("BEGIN");
  await client.query("SET LOCAL ROLE cockpitpath_publisher");
}

async function main() {
  const rawGraph = await loadContent("test/fixtures/content/valid");
  const graph = validateGraph(rawGraph);
  const client = new Client({ connectionString: process.env.DATABASE_URL_UNPOOLED });
  await client.connect();

  try {
    const baseline = await countSynthetic(client);
    assert.equal(baseline, 0, "synthetic fixture rows already exist before integration test");

    const invalidGraph = structuredClone(rawGraph);
    invalidGraph.entities.find(({ kind }) => kind === "COCKPIT_VIEW").media = "media.synthetic-missing";
    assert.throws(() => validateGraph(invalidGraph), ContentValidationError);
    assert.equal(await countSynthetic(client), baseline, "invalid graph validation changed database state");

    await beginPublisher(client);
    const rollbackPlan = await planPublication(client, graph);
    assert.equal(rollbackPlan.actions.length, 18);
    await applyPublication(client, graph, rollbackPlan, { environment: "test/wp2-rollback" });
    await client.query("ROLLBACK");
    assert.equal(await countSynthetic(client), 0, "rolled-back publication left partial content");

    await beginPublisher(client);
    const beforeDryRun = await countSynthetic(client);
    const firstPlan = await planPublication(client, graph);
    assert.equal(await countSynthetic(client), beforeDryRun, "planning/dry-run wrote database rows");
    assert.equal(firstPlan.actions.length, 18);

    const firstResult = await applyPublication(client, graph, firstPlan, { environment: "test/wp2-integration" });
    const initialConceptId = firstResult.domainIds.get("concept.synthetic-wp2");
    assert(initialConceptId);
    const initialSection = await client.query(
      "select id from public.journey_sections where journey_id=$1",
      [firstResult.domainIds.get("journey.synthetic-wp2")],
    );

    const repeatPlan = await planPublication(client, graph);
    assert.equal(repeatPlan.actions.length, 0, "identical publication is not idempotent");
    assert.equal(repeatPlan.unchanged, 18);

    const revisedRaw = structuredClone(rawGraph);
    const revisedConcept = revisedRaw.entities.find(({ key }) => key === "concept.synthetic-wp2");
    revisedConcept.revision = 2;
    revisedConcept.short_definition = "Updated test-only concept definition.";
    revisedConcept.verifications = [{
      status: "VERIFIED",
      revision: 2,
      content_hash: contentHash(revisedConcept),
      verified_at: "2026-01-02T00:00:00Z",
      verified_by: "automated-test-fixture",
      method: "Synthetic fixture revision review",
    }];
    const revisedJourney = revisedRaw.entities.find(({ key }) => key === "journey.synthetic-wp2");
    revisedJourney.revision = 2;
    revisedJourney.description = "Updated test-only journey description.";
    revisedJourney.verifications = [{
      status: "VERIFIED",
      revision: 2,
      content_hash: contentHash(revisedJourney),
      verified_at: "2026-01-02T00:00:00Z",
      verified_by: "automated-test-fixture",
      method: "Synthetic fixture revision review",
    }];
    const revisedGraph = validateGraph(revisedRaw);
    const revisionPlan = await planPublication(client, revisedGraph);
    assert.equal(revisionPlan.actions.length, 2);
    const revisionResult = await applyPublication(client, revisedGraph, revisionPlan, { environment: "test/wp2-integration" });
    assert.equal(revisionResult.domainIds.get("concept.synthetic-wp2"), initialConceptId, "stable entity UUID changed after revision");
    const revisedSection = await client.query(
      "select id from public.journey_sections where journey_id=$1",
      [revisionResult.domainIds.get("journey.synthetic-wp2")],
    );
    assert.equal(revisedSection.rows[0].id, initialSection.rows[0].id, "stable Journey Section identity changed after revision");

    const draftRecord = await client.query(
      `insert into public.content_records (content_key, kind, status, revision)
       values ('concept.synthetic-wp2-draft', 'CONCEPT', 'DRAFT', 1) returning id`,
    );
    await client.query(
      `insert into public.concepts (content_record_id, slug, title, short_definition)
       values ($1, 'synthetic-wp2-draft', 'Synthetic Draft', 'Must not be runtime visible.')`,
      [draftRecord.rows[0].id],
    );

    await client.query("SET LOCAL ROLE cockpitpath_content_reader");
    const published = await client.query(
      "select count(*)::int as count from cockpitpath_published.content_records where content_key like $1",
      [PREFIX],
    );
    assert.equal(published.rows[0].count, 18, "published surface omitted graph content or exposed draft content");
    const rawDenied = await client.query(
      "select has_table_privilege(current_user, 'public.content_records', 'SELECT') as allowed",
    );
    assert.equal(rawDenied.rows[0].allowed, false, "reader capability can read raw editorial tables");

    await client.query("RESET ROLE");
    await client.query("ROLLBACK");
    assert.equal(await countSynthetic(client), 0, "synthetic publication fixtures persisted after integration test");

    console.log("Content publication integration passed: dry-run, rollback, publish, idempotency, revision identity, and published-only reads.");
  } catch (error) {
    try { await client.query("ROLLBACK"); } catch { /* Preserve original failure. */ }
    throw error;
  } finally {
    await client.end();
  }
}

const keepAlive = setInterval(() => {}, 1_000);
main().catch((error) => {
  const safeDetail = error.message || [error.name, error.code].filter(Boolean).join("/") || "unknown error";
  console.error(`Content publication integration failed: ${safeDetail}`);
  process.exitCode = 1;
}).finally(() => clearInterval(keepAlive));
