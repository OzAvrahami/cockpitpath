const { graphDigest } = require("./hash.cjs");

const ENTITY_ORDER = [
  "AIRCRAFT", "SIMULATOR", "ADDON_PRODUCT", "AIRCRAFT_IMPLEMENTATION", "MEDIA_ASSET",
  "COCKPIT_AREA", "AIRCRAFT_SYSTEM", "CONCEPT", "JOURNEY", "PROCEDURE",
  "PROCEDURE_STEP", "SYSTEM_COMPONENT", "CONTROL", "COCKPIT_VIEW", "HOTSPOT",
];

const TABLES = Object.freeze({
  AIRCRAFT: ["aircraft", ["manufacturer", "family", "variant", "display_name", "slug"]],
  SIMULATOR: ["simulators", ["name", "product_family", "display_name", "slug", "support_status"]],
  ADDON_PRODUCT: ["addon_products", ["developer_name", "product_name", "slug", "support_status"]],
  AIRCRAFT_IMPLEMENTATION: ["aircraft_implementations", ["aircraft_id", "simulator_id", "addon_product_id", "slug", "display_name", "support_status"]],
  JOURNEY: ["journeys", ["aircraft_implementation_id", "slug", "title", "description", "difficulty", "estimated_scope", "sort_order"]],
  PROCEDURE: ["procedures", ["aircraft_implementation_id", "slug", "title", "short_description", "sort_order"]],
  PROCEDURE_STEP: ["procedure_steps", ["aircraft_implementation_id", "procedure_id", "sequence", "step_type", "title", "action_text", "location_hint", "expected_result", "explanation", "tip", "warning", "is_optional", "wait_hint"]],
  MEDIA_ASSET: ["media_assets", ["aircraft_implementation_id", "asset_type", "storage_key", "mime_type", "width", "height", "original_filename", "accessible_description", "checksum", "capture_context", "captured_addon_version", "captured_simulator_version", "rights_status", "verification_status", "is_original_capture"]],
  COCKPIT_AREA: ["cockpit_areas", ["aircraft_implementation_id", "parent_area_id", "area_type", "slug", "title", "sort_order"]],
  AIRCRAFT_SYSTEM: ["aircraft_systems", ["aircraft_implementation_id", "slug", "title", "short_description", "sort_order"]],
  SYSTEM_COMPONENT: ["system_components", ["aircraft_implementation_id", "aircraft_system_id", "slug", "title", "component_type", "what_it_does", "why_it_matters", "sort_order"]],
  CONCEPT: ["concepts", ["aircraft_implementation_id", "slug", "title", "short_definition", "why_it_matters"]],
  CONTROL: ["controls", ["aircraft_implementation_id", "cockpit_area_id", "aircraft_system_id", "slug", "canonical_name", "control_type", "what_it_does", "when_used"]],
  COCKPIT_VIEW: ["cockpit_views", ["aircraft_implementation_id", "cockpit_area_id", "media_asset_id", "view_role", "title", "sort_order", "is_primary"]],
  HOTSPOT: ["hotspots", ["aircraft_implementation_id", "cockpit_view_id", "target_cockpit_area_id", "target_control_id", "x", "y", "width", "height", "shape", "label", "sort_order"]],
});

function eligibleEntities(graph) {
  return graph.entities.filter(({ status }) => status === "PUBLISHED" || status === "ARCHIVED");
}

async function readExisting(client, keys) {
  if (keys.length === 0) return new Map();
  const result = await client.query(
    `select id, content_key, kind, status, locale, revision, content_hash, audience,
            access_class, required_entitlement_key
     from public.content_records where content_key = any($1::text[])`,
    [keys],
  );
  return new Map(result.rows.map((row) => [row.content_key, row]));
}

async function planPublication(client, graph) {
  const entities = eligibleEntities(graph);
  const existing = await readExisting(client, entities.map(({ key }) => key));
  const actions = [];
  for (const entity of entities) {
    const current = existing.get(entity.key);
    const hash = graph.hashes.get(entity.key);
    if (!current) {
      if (entity.revision !== 1) throw new Error(`${entity.key}: a new logical entity must begin at revision 1`);
      if (entity.status === "ARCHIVED") throw new Error(`${entity.key}: cannot introduce a new entity as ARCHIVED`);
      actions.push({ action: "INSERT", entity, hash, previousRevision: null });
      continue;
    }
    if (current.kind !== entity.kind) throw new Error(`${entity.key}: persisted kind ${current.kind} cannot change to ${entity.kind}`);
    if (current.content_hash !== hash) {
      if (entity.revision !== current.revision + 1) throw new Error(`${entity.key}: changed content must advance revision from ${current.revision} to ${current.revision + 1}`);
      actions.push({ action: entity.status === "ARCHIVED" ? "ARCHIVE" : "UPDATE", entity, hash, previousRevision: current.revision });
      continue;
    }
    if (entity.revision !== current.revision) throw new Error(`${entity.key}: unchanged content must retain revision ${current.revision}`);
    const metadataChanged = current.status !== entity.status || current.locale !== entity.locale || current.audience !== entity.audience || current.access_class !== entity.access_class || current.required_entitlement_key !== (entity.required_entitlement_key ?? null);
    if (metadataChanged) actions.push({ action: entity.status === "ARCHIVED" ? "ARCHIVE" : "UPDATE", entity, hash, previousRevision: current.revision });
  }
  return { actions, unchanged: entities.length - actions.length, skipped: graph.entities.length - entities.length, sourceDigest: graphDigest(graph) };
}

function idFor(ids, key, optional = false) {
  if (!key && optional) return null;
  const value = ids.get(key);
  if (!value) throw new Error(`database identity is unavailable for ${key}`);
  return value;
}

function domainValues(entity, ids) {
  const implementation = () => idFor(ids, entity.implementation, true);
  switch (entity.kind) {
    case "AIRCRAFT": case "SIMULATOR": case "ADDON_PRODUCT": return entity;
    case "AIRCRAFT_IMPLEMENTATION": return { ...entity, aircraft_id: idFor(ids, entity.aircraft), simulator_id: idFor(ids, entity.simulator), addon_product_id: idFor(ids, entity.addon_product) };
    case "JOURNEY": case "PROCEDURE": case "MEDIA_ASSET": case "AIRCRAFT_SYSTEM": case "CONCEPT": return { ...entity, aircraft_implementation_id: implementation() };
    case "PROCEDURE_STEP": return { ...entity, aircraft_implementation_id: implementation(), procedure_id: idFor(ids, entity.procedure) };
    case "COCKPIT_AREA": return { ...entity, aircraft_implementation_id: implementation(), parent_area_id: idFor(ids, entity.parent_area, true) };
    case "SYSTEM_COMPONENT": return { ...entity, aircraft_implementation_id: implementation(), aircraft_system_id: idFor(ids, entity.system) };
    case "CONTROL": return { ...entity, aircraft_implementation_id: implementation(), cockpit_area_id: idFor(ids, entity.cockpit_area), aircraft_system_id: idFor(ids, entity.aircraft_system, true) };
    case "COCKPIT_VIEW": return { ...entity, aircraft_implementation_id: implementation(), cockpit_area_id: idFor(ids, entity.cockpit_area), media_asset_id: idFor(ids, entity.media) };
    case "HOTSPOT": return { ...entity, aircraft_implementation_id: implementation(), cockpit_view_id: idFor(ids, entity.cockpit_view), target_cockpit_area_id: idFor(ids, entity.target_cockpit_area, true), target_control_id: idFor(ids, entity.target_control, true) };
    default: throw new Error(`unsupported publisher kind ${entity.kind}`);
  }
}

async function upsertContentRecord(client, item) {
  const { entity, hash } = item;
  const result = await client.query(
    `insert into public.content_records
       (content_key, kind, status, locale, revision, content_hash, audience, access_class,
        required_entitlement_key, published_at, archived_at)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,
       case when $3 = 'PUBLISHED' then statement_timestamp() end,
       case when $3 = 'ARCHIVED' then statement_timestamp() end)
     on conflict (content_key) do update set
       status = excluded.status, locale = excluded.locale, revision = excluded.revision,
       content_hash = excluded.content_hash, audience = excluded.audience,
       access_class = excluded.access_class,
       required_entitlement_key = excluded.required_entitlement_key,
       published_at = case when excluded.status = 'PUBLISHED' then coalesce(content_records.published_at, statement_timestamp()) else content_records.published_at end,
       archived_at = case when excluded.status = 'ARCHIVED' then statement_timestamp() else null end
     returning id`,
    [entity.key, entity.kind, entity.status, entity.locale, entity.revision, hash, entity.audience, entity.access_class, entity.required_entitlement_key ?? null],
  );
  return result.rows[0].id;
}

async function upsertDomainEntity(client, entity, contentRecordId, ids) {
  const [table, columns] = TABLES[entity.kind];
  const valuesByColumn = domainValues(entity, ids);
  const parameters = [contentRecordId, ...columns.map((column) => valuesByColumn[column] ?? null)];
  const placeholders = parameters.map((_, index) => `$${index + 1}`).join(", ");
  const updates = columns.map((column) => `${column} = excluded.${column}`).join(", ");
  const result = await client.query(
    `insert into public.${table} (content_record_id, ${columns.join(", ")})
     values (${placeholders})
     on conflict (content_record_id) do update set ${updates}
     returning id`,
    parameters,
  );
  return result.rows[0].id;
}

async function upsertSources(client, graph, actions, contentIds) {
  const referenced = new Set(actions.flatMap(({ entity }) => entity.sources.map(({ key }) => key)));
  const sources = graph.sources.filter(({ key }) => referenced.has(key));
  const sourceIds = new Map();
  for (const source of sources) {
    const result = await client.query(
      `insert into public.source_references
       (source_key, source_type, title, publisher, url, repository_identifier,
        document_version, publication_date, notes, access_rights)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       on conflict (source_key) do update set
         source_type=excluded.source_type, title=excluded.title, publisher=excluded.publisher,
         url=excluded.url, repository_identifier=excluded.repository_identifier,
         document_version=excluded.document_version, publication_date=excluded.publication_date,
         notes=excluded.notes, access_rights=excluded.access_rights
       returning id`,
      [source.key, source.source_type, source.title, source.publisher ?? null, source.url ?? null, source.repository_identifier ?? null, source.document_version ?? null, source.publication_date ?? null, source.notes ?? null, source.access_rights ?? null],
    );
    sourceIds.set(source.key, result.rows[0].id);
  }
  for (const { entity } of actions) {
    await client.query("delete from public.content_sources where content_record_id=$1", [idFor(contentIds, entity.key)]);
    for (const link of entity.sources) {
      await client.query(
        `insert into public.content_sources (content_record_id, source_reference_id, purpose, locator, notes)
         values ($1,$2,$3,$4,$5)`,
        [idFor(contentIds, entity.key), sourceIds.get(link.key), link.purpose, link.locator ?? null, link.notes ?? null],
      );
    }
  }
}

async function replaceRelationships(client, actions, ids) {
  for (const { entity } of actions) {
    if (entity.kind === "JOURNEY") {
      await client.query("delete from public.journey_sections where journey_id=$1", [idFor(ids, entity.key)]);
      for (const section of entity.sections) await client.query(
        `insert into public.journey_sections (aircraft_implementation_id, journey_id, procedure_id, sequence, title_override, is_required, notes)
         values ($1,$2,$3,$4,$5,$6,$7)`,
        [idFor(ids, entity.implementation), idFor(ids, entity.key), idFor(ids, section.procedure), section.sequence, section.title_override ?? null, section.is_required, section.notes ?? null],
      );
    }
    if (entity.kind === "PROCEDURE_STEP") {
      await client.query("delete from public.procedure_step_controls where procedure_step_id=$1", [idFor(ids, entity.key)]);
      await client.query("delete from public.procedure_step_visuals where procedure_step_id=$1", [idFor(ids, entity.key)]);
      for (const link of entity.controls) await client.query(
        `insert into public.procedure_step_controls (aircraft_implementation_id, procedure_step_id, control_id, role, sequence, preferred_hotspot_id)
         values ($1,$2,$3,$4,$5,$6)`,
        [idFor(ids, entity.implementation), idFor(ids, entity.key), idFor(ids, link.key), link.role, link.sequence, idFor(ids, link.preferred_hotspot, true)],
      );
      for (const visual of entity.visuals) await client.query(
        `insert into public.procedure_step_visuals (aircraft_implementation_id, procedure_step_id, cockpit_view_id, media_asset_id, hotspot_id, role, sort_order)
         values ($1,$2,$3,$4,$5,$6,$7)`,
        [idFor(ids, entity.implementation), idFor(ids, entity.key), idFor(ids, visual.cockpit_view, true), idFor(ids, visual.media, true), idFor(ids, visual.hotspot, true), visual.role, visual.sort_order],
      );
    }
    if (entity.kind === "SYSTEM_COMPONENT") {
      await client.query("delete from public.system_component_controls where system_component_id=$1", [idFor(ids, entity.key)]);
      await client.query("delete from public.system_component_concepts where system_component_id=$1", [idFor(ids, entity.key)]);
      for (const link of entity.controls) await client.query(
        `insert into public.system_component_controls (aircraft_implementation_id, system_component_id, control_id, relation_type, sort_order)
         values ($1,$2,$3,$4,$5)`,
        [idFor(ids, entity.implementation), idFor(ids, entity.key), idFor(ids, link.key), link.relation_type, link.sort_order],
      );
      for (const link of entity.concepts) await client.query(
        `insert into public.system_component_concepts (system_component_id, concept_id, relation_type, sort_order)
         values ($1,$2,$3,$4)`,
        [idFor(ids, entity.key), idFor(ids, link.key), link.relation_type, link.sort_order],
      );
    }
  }
}

async function applyPublication(client, graph, plan, options = {}) {
  const contentIds = new Map();
  const domainIds = new Map();
  const keys = eligibleEntities(graph).map(({ key }) => key);
  const existing = await readExisting(client, keys);
  for (const [key, row] of existing) contentIds.set(key, row.id);

  for (const [kind, [table]] of Object.entries(TABLES)) {
    const kindKeys = graph.entities.filter((entity) => entity.kind === kind && keys.includes(entity.key)).map(({ key }) => key);
    if (kindKeys.length === 0) continue;
    const rows = await client.query(
      `select record.content_key, entity.id
       from public.${table} entity
       join public.content_records record on record.id = entity.content_record_id
       where record.content_key = any($1::text[])`,
      [kindKeys],
    );
    for (const row of rows.rows) domainIds.set(row.content_key, row.id);
  }

  const areaDepth = (entity) => {
    let depth = 0;
    let current = entity;
    while (current?.kind === "COCKPIT_AREA" && current.parent_area) {
      depth += 1;
      current = graph.byKey.get(current.parent_area);
    }
    return depth;
  };
  const ordered = [...plan.actions].sort((a, b) => {
    const kindDifference = ENTITY_ORDER.indexOf(a.entity.kind) - ENTITY_ORDER.indexOf(b.entity.kind);
    return kindDifference || areaDepth(a.entity) - areaDepth(b.entity) || a.entity.key.localeCompare(b.entity.key);
  });
  for (const item of ordered) contentIds.set(item.entity.key, await upsertContentRecord(client, item));
  for (const item of ordered) domainIds.set(item.entity.key, await upsertDomainEntity(client, item.entity, idFor(contentIds, item.entity.key), domainIds));
  await upsertSources(client, graph, ordered, contentIds);

  for (const { entity } of ordered) {
    for (const event of entity.verifications) await client.query(
      `insert into public.verification_events
       (content_record_id, aircraft_implementation_id, verification_status, content_revision,
        content_hash, addon_version, simulator_version, verified_at, verified_by, method, notes, limitations)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       on conflict do nothing`,
      [idFor(contentIds, entity.key), idFor(domainIds, event.implementation, true), event.status, event.revision, event.content_hash, event.addon_version ?? null, event.simulator_version ?? null, event.verified_at ?? null, event.verified_by ?? null, event.method ?? null, event.notes ?? null, event.limitations ?? null],
    );
  }
  await replaceRelationships(client, ordered, domainIds);

  if (ordered.length) {
    const publication = await client.query(
      `insert into public.content_publications (environment, source_digest, repository_revision, published_by)
       values ($1,$2,$3,$4) returning id`,
      [options.environment ?? "development", plan.sourceDigest, options.repositoryRevision ?? null, options.publishedBy ?? "repository-content-publisher"],
    );
    for (const item of ordered) await client.query(
      `insert into public.content_publication_items
       (publication_id, content_record_id, action, previous_revision, published_revision, content_hash)
       values ($1,$2,$3,$4,$5,$6)`,
      [publication.rows[0].id, idFor(contentIds, item.entity.key), item.action, item.previousRevision, item.entity.revision, item.hash],
    );
  }
  return { insertedOrUpdated: ordered.length, contentIds, domainIds };
}

module.exports = { applyPublication, eligibleEntities, planPublication };
