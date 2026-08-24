const assert = require("node:assert/strict");
const { Client } = require("pg");
const { assertSafeDatabaseEnvironment } = require("./database-safety.cjs");

assertSafeDatabaseEnvironment();

const EXPECTED_TABLES = [
  "addon_products",
  "aircraft",
  "aircraft_implementations",
  "aircraft_systems",
  "cockpit_areas",
  "cockpit_views",
  "concepts",
  "content_records",
  "controls",
  "hotspots",
  "journey_sections",
  "journeys",
  "media_assets",
  "procedure_step_controls",
  "procedure_step_visuals",
  "procedure_steps",
  "procedures",
  "simulators",
  "system_component_concepts",
  "system_component_controls",
  "system_components",
];

const EXPECTED_FOREIGN_KEYS = [
  "cockpit_areas_parent_scope_fk",
  "cockpit_views_area_scope_fk",
  "cockpit_views_media_scope_fk",
  "controls_area_scope_fk",
  "controls_system_scope_fk",
  "hotspots_area_scope_fk",
  "hotspots_control_scope_fk",
  "hotspots_view_scope_fk",
  "journey_sections_journey_scope_fk",
  "journey_sections_procedure_scope_fk",
  "procedure_step_controls_control_scope_fk",
  "procedure_step_controls_step_scope_fk",
  "procedure_step_visuals_step_scope_fk",
  "procedure_steps_procedure_scope_fk",
  "system_component_controls_component_scope_fk",
  "system_component_controls_control_scope_fk",
  "system_components_system_scope_fk",
];

let savepointCounter = 0;

async function expectDatabaseError(client, label, operation, expectedCodes) {
  savepointCounter += 1;
  const savepoint = `expected_failure_${savepointCounter}`;
  await client.query(`SAVEPOINT ${savepoint}`);

  let databaseError;
  try {
    await operation();
  } catch (error) {
    databaseError = error;
  }

  await client.query(`ROLLBACK TO SAVEPOINT ${savepoint}`);
  await client.query(`RELEASE SAVEPOINT ${savepoint}`);

  assert(databaseError, `${label}: expected PostgreSQL to reject the statement`);
  assert(
    expectedCodes.includes(databaseError.code),
    `${label}: expected SQLSTATE ${expectedCodes.join(" or ")}, received ${databaseError.code}`,
  );
}

async function insertContentRecord(client, contentKey, kind) {
  const result = await client.query(
    `insert into public.content_records (content_key, kind)
     values ($1, $2)
     returning id`,
    [contentKey, kind],
  );
  return result.rows[0].id;
}

async function verifySchema(client) {
  const tables = await client.query(
    `select tablename
     from pg_tables
     where schemaname = 'public'
       and tablename = any($1::text[])
     order by tablename`,
    [EXPECTED_TABLES],
  );
  assert.deepEqual(
    tables.rows.map(({ tablename }) => tablename),
    EXPECTED_TABLES,
    "core table set does not match the expected vertical-slice schema",
  );

  const foreignKeys = await client.query(
    `select conname
     from pg_constraint
     where contype = 'f'
       and conname = any($1::text[])
     order by conname`,
    [EXPECTED_FOREIGN_KEYS],
  );
  assert.deepEqual(
    foreignKeys.rows.map(({ conname }) => conname),
    [...EXPECTED_FOREIGN_KEYS].sort(),
    "required cross-entity foreign keys are missing",
  );

  const migrationRows = await client.query(
    `select name
     from cockpitpath_migrations.pgmigrations
     order by run_on, name`,
  );
  assert.equal(migrationRows.rows.length, 2, "expected both Work Package 1 migrations");

  const timestampInfrastructure = await client.query(`
    select
      count(*) filter (where t.tgname like '%_set_updated_at')::int as trigger_count,
      bool_and(not p.prosecdef) as security_invoker,
      bool_and('search_path=pg_catalog' = any(p.proconfig)) as safe_search_path
    from pg_trigger t
    join pg_proc p on p.oid = t.tgfoid
    where not t.tgisinternal
      and p.oid = 'public.cockpitpath_set_updated_at()'::regprocedure
  `);
  assert.deepEqual(
    timestampInfrastructure.rows[0],
    { trigger_count: 17, security_invoker: true, safe_search_path: true },
    "shared updated_at trigger infrastructure is incomplete or unsafe",
  );
}

async function verifySecurity(client) {
  const grants = await client.query(
    `select grantee, table_name, privilege_type
     from information_schema.table_privileges
     where table_schema = 'public'
       and table_name = any($1::text[])
       and grantee = any($2::text[])`,
    [EXPECTED_TABLES, ["PUBLIC", "anonymous", "authenticated", "authenticator"]],
  );
  assert.deepEqual(grants.rows, [], "an exposed role has an explicit content-table grant");

  for (const role of ["anonymous", "authenticated", "authenticator"]) {
    for (const table of EXPECTED_TABLES) {
      const privilege = await client.query(
        `select
           has_table_privilege($1, format('public.%I', $2::text), 'SELECT') as can_select,
           has_table_privilege($1, format('public.%I', $2::text), 'INSERT') as can_insert,
           has_table_privilege($1, format('public.%I', $2::text), 'UPDATE') as can_update,
           has_table_privilege($1, format('public.%I', $2::text), 'DELETE') as can_delete`,
        [role, table],
      );
      assert.deepEqual(
        privilege.rows[0],
        { can_select: false, can_insert: false, can_update: false, can_delete: false },
        `${role} has effective privileges on public.${table}`,
      );
    }
  }

  const roleBoundary = await client.query(
    `select rolname, rolcanlogin, rolbypassrls
     from pg_roles
     where rolname in ('anonymous', 'authenticated', 'authenticator', 'neondb_owner')
     order by rolname`,
  );
  const owner = roleBoundary.rows.find(({ rolname }) => rolname === "neondb_owner");
  assert.equal(owner.rolcanlogin, true, "migration owner should remain a login role");
  assert.equal(owner.rolbypassrls, true, "migration owner boundary changed unexpectedly");
  for (const role of roleBoundary.rows.filter(({ rolname }) => rolname !== "neondb_owner")) {
    assert.equal(role.rolbypassrls, false, `${role.rolname} unexpectedly bypasses RLS`);
  }

  const schemaBoundary = await client.query(
    `select has_schema_privilege('public', 'public', 'CREATE') as public_can_create`,
  );
  assert.equal(schemaBoundary.rows[0].public_can_create, false, "PUBLIC can create in public schema");

  await client.query("create table public.cockpitpath_db_test_default_privileges (id integer)");
  await client.query(`
    create function public.cockpitpath_db_test_default_function()
    returns integer
    language sql
    set search_path = pg_catalog
    as 'select 1'
  `);

  for (const role of ["anonymous", "authenticated", "authenticator"]) {
    const defaults = await client.query(
      `select
         has_table_privilege($1, 'public.cockpitpath_db_test_default_privileges', 'SELECT') as table_select,
         has_function_privilege($1, 'public.cockpitpath_db_test_default_function()', 'EXECUTE') as function_execute`,
      [role],
    );
    assert.deepEqual(
      defaults.rows[0],
      { table_select: false, function_execute: false },
      `safe default privileges did not apply to ${role}`,
    );
  }

  const publicFunctionAcl = await client.query(`
    select exists (
      select 1
      from pg_proc p
      cross join lateral aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) acl
      where p.oid = 'public.cockpitpath_db_test_default_function()'::regprocedure
        and acl.grantee = 0
        and acl.privilege_type = 'EXECUTE'
    ) as public_can_execute
  `);
  assert.equal(publicFunctionAcl.rows[0].public_can_execute, false, "PUBLIC can execute a new function");
}

async function verifyConstraintsAndRelationships(client) {
  await expectDatabaseError(
    client,
    "duplicate content key",
    () => client.query(
      `insert into public.content_records (content_key, kind)
       values ('concept.db-test-duplicate', 'CONCEPT'), ('concept.db-test-duplicate', 'CONCEPT')`,
    ),
    ["23505"],
  );
  await expectDatabaseError(
    client,
    "invalid revision",
    () => client.query(
      `insert into public.content_records (content_key, kind, revision)
       values ('concept.db-test-invalid-revision', 'CONCEPT', 0)`,
    ),
    ["23514"],
  );
  await expectDatabaseError(
    client,
    "invalid editorial status",
    () => client.query(
      `insert into public.content_records (content_key, kind, status)
       values ('concept.db-test-invalid-status', 'CONCEPT', 'READY')`,
    ),
    ["23514"],
  );

  const aircraftRecord = await insertContentRecord(client, "aircraft.db-test-model", "AIRCRAFT");
  const simulatorRecord = await insertContentRecord(client, "simulator.db-test-sim", "SIMULATOR");
  const addonRecord = await insertContentRecord(client, "addon.db-test-addon", "ADDON_PRODUCT");
  const addonTwoRecord = await insertContentRecord(client, "addon.db-test-addon-two", "ADDON_PRODUCT");
  const implementationRecord = await insertContentRecord(
    client,
    "implementation.db-test-primary",
    "AIRCRAFT_IMPLEMENTATION",
  );
  const implementationTwoRecord = await insertContentRecord(
    client,
    "implementation.db-test-secondary",
    "AIRCRAFT_IMPLEMENTATION",
  );

  const aircraft = await client.query(
    `insert into public.aircraft
       (content_record_id, manufacturer, family, variant, display_name, slug)
     values ($1, 'Synthetic', 'DB Test', 'One', 'Synthetic DB Test Aircraft', 'db-test-model')
     returning id`,
    [aircraftRecord],
  );
  const simulator = await client.query(
    `insert into public.simulators
       (content_record_id, name, display_name, slug)
     values ($1, 'Synthetic Simulator', 'Synthetic Simulator', 'db-test-sim')
     returning id`,
    [simulatorRecord],
  );
  const addon = await client.query(
    `insert into public.addon_products
       (content_record_id, developer_name, product_name, slug)
     values ($1, 'Synthetic', 'DB Test Add-on', 'db-test-addon')
     returning id`,
    [addonRecord],
  );
  const addonTwo = await client.query(
    `insert into public.addon_products
       (content_record_id, developer_name, product_name, slug)
     values ($1, 'Synthetic', 'DB Test Add-on Two', 'db-test-addon-two')
     returning id`,
    [addonTwoRecord],
  );
  const implementation = await client.query(
    `insert into public.aircraft_implementations
       (content_record_id, aircraft_id, simulator_id, addon_product_id, slug, display_name)
     values ($1, $2, $3, $4, 'db-test-primary', 'Synthetic Primary Implementation')
     returning id`,
    [implementationRecord, aircraft.rows[0].id, simulator.rows[0].id, addon.rows[0].id],
  );
  const implementationTwo = await client.query(
    `insert into public.aircraft_implementations
       (content_record_id, aircraft_id, simulator_id, addon_product_id, slug, display_name)
     values ($1, $2, $3, $4, 'db-test-secondary', 'Synthetic Secondary Implementation')
     returning id`,
    [implementationTwoRecord, aircraft.rows[0].id, simulator.rows[0].id, addonTwo.rows[0].id],
  );
  const implementationId = implementation.rows[0].id;
  const implementationTwoId = implementationTwo.rows[0].id;

  const journeyRecord = await insertContentRecord(client, "journey.db-test-journey", "JOURNEY");
  const procedureRecord = await insertContentRecord(client, "procedure.db-test-procedure", "PROCEDURE");
  const procedureTwoRecord = await insertContentRecord(client, "procedure.db-test-procedure-two", "PROCEDURE");
  const stepRecord = await insertContentRecord(client, "step.db-test-procedure.action", "PROCEDURE_STEP");
  const duplicateStepRecord = await insertContentRecord(
    client,
    "step.db-test-procedure.duplicate-sequence",
    "PROCEDURE_STEP",
  );
  const invalidStepRecord = await insertContentRecord(
    client,
    "step.db-test-procedure.invalid-type",
    "PROCEDURE_STEP",
  );

  const journey = await client.query(
    `insert into public.journeys
       (content_record_id, aircraft_implementation_id, slug, title)
     values ($1, $2, 'db-test-journey', 'Synthetic Journey')
     returning id`,
    [journeyRecord, implementationId],
  );
  const procedure = await client.query(
    `insert into public.procedures
       (content_record_id, aircraft_implementation_id, slug, title)
     values ($1, $2, 'db-test-procedure', 'Synthetic Procedure')
     returning id`,
    [procedureRecord, implementationId],
  );
  const procedureTwo = await client.query(
    `insert into public.procedures
       (content_record_id, aircraft_implementation_id, slug, title)
     values ($1, $2, 'db-test-procedure-two', 'Synthetic Procedure Two')
     returning id`,
    [procedureTwoRecord, implementationId],
  );
  await client.query(
    `insert into public.journey_sections
       (aircraft_implementation_id, journey_id, procedure_id, sequence)
     values ($1, $2, $3, 1)`,
    [implementationId, journey.rows[0].id, procedure.rows[0].id],
  );
  await expectDatabaseError(
    client,
    "duplicate journey sequence",
    () => client.query(
      `insert into public.journey_sections
         (aircraft_implementation_id, journey_id, procedure_id, sequence)
       values ($1, $2, $3, 1)`,
      [implementationId, journey.rows[0].id, procedureTwo.rows[0].id],
    ),
    ["23505"],
  );
  const step = await client.query(
    `insert into public.procedure_steps
       (content_record_id, aircraft_implementation_id, procedure_id, sequence, step_type, title)
     values ($1, $2, $3, 1, 'ACTION', 'Synthetic Action')
     returning id`,
    [stepRecord, implementationId, procedure.rows[0].id],
  );
  await expectDatabaseError(
    client,
    "duplicate procedure-step sequence",
    () => client.query(
      `insert into public.procedure_steps
         (content_record_id, aircraft_implementation_id, procedure_id, sequence, step_type, title)
       values ($1, $2, $3, 1, 'ACTION', 'Duplicate Sequence')`,
      [duplicateStepRecord, implementationId, procedure.rows[0].id],
    ),
    ["23505"],
  );
  await expectDatabaseError(
    client,
    "invalid step type",
    () => client.query(
      `insert into public.procedure_steps
         (content_record_id, aircraft_implementation_id, procedure_id, sequence, step_type, title)
       values ($1, $2, $3, 2, 'CLICK', 'Invalid Action')`,
      [invalidStepRecord, implementationId, procedure.rows[0].id],
    ),
    ["23514"],
  );

  const mediaRecord = await insertContentRecord(client, "media.db-test-view", "MEDIA_ASSET");
  const rootAreaRecord = await insertContentRecord(client, "area.db-test-root", "COCKPIT_AREA");
  const childAreaRecord = await insertContentRecord(client, "area.db-test-child", "COCKPIT_AREA");
  const secondAreaRecord = await insertContentRecord(client, "area.db-test-secondary", "COCKPIT_AREA");
  const systemRecord = await insertContentRecord(client, "system.db-test-system", "AIRCRAFT_SYSTEM");
  const componentRecord = await insertContentRecord(
    client,
    "component.db-test-system.component",
    "SYSTEM_COMPONENT",
  );
  const conceptRecord = await insertContentRecord(client, "concept.db-test-concept", "CONCEPT");
  const controlRecord = await insertContentRecord(client, "control.db-test-control", "CONTROL");
  const controlTwoRecord = await insertContentRecord(client, "control.db-test-control-two", "CONTROL");
  const viewRecord = await insertContentRecord(client, "view.db-test-child.primary", "COCKPIT_VIEW");
  const hotspotRecord = await insertContentRecord(
    client,
    "hotspot.db-test-child.control",
    "HOTSPOT",
  );

  const media = await client.query(
    `insert into public.media_assets
       (content_record_id, aircraft_implementation_id, asset_type, storage_key, mime_type,
        width, height, accessible_description, checksum)
     values ($1, $2, 'COCKPIT_VIEW', 'db-tests/synthetic.png', 'image/png',
       1000, 500, 'Synthetic database test image', $3)
     returning id`,
    [mediaRecord, implementationId, "0".repeat(64)],
  );
  const rootArea = await client.query(
    `insert into public.cockpit_areas
       (content_record_id, aircraft_implementation_id, area_type, slug, title)
     values ($1, $2, 'COCKPIT', 'db-test-root', 'Synthetic Root')
     returning id`,
    [rootAreaRecord, implementationId],
  );
  const childArea = await client.query(
    `insert into public.cockpit_areas
       (content_record_id, aircraft_implementation_id, parent_area_id, area_type, slug, title)
     values ($1, $2, $3, 'AREA', 'db-test-child', 'Synthetic Child')
     returning id`,
    [childAreaRecord, implementationId, rootArea.rows[0].id],
  );
  const secondArea = await client.query(
    `insert into public.cockpit_areas
       (content_record_id, aircraft_implementation_id, area_type, slug, title)
     values ($1, $2, 'COCKPIT', 'db-test-secondary', 'Synthetic Secondary Area')
     returning id`,
    [secondAreaRecord, implementationTwoId],
  );
  const system = await client.query(
    `insert into public.aircraft_systems
       (content_record_id, aircraft_implementation_id, slug, title)
     values ($1, $2, 'db-test-system', 'Synthetic System')
     returning id`,
    [systemRecord, implementationId],
  );
  const component = await client.query(
    `insert into public.system_components
       (content_record_id, aircraft_implementation_id, aircraft_system_id, slug, title)
     values ($1, $2, $3, 'db-test-component', 'Synthetic Component')
     returning id`,
    [componentRecord, implementationId, system.rows[0].id],
  );
  const concept = await client.query(
    `insert into public.concepts
       (content_record_id, aircraft_implementation_id, slug, title, short_definition)
     values ($1, $2, 'db-test-concept', 'Synthetic Concept', 'Synthetic definition')
     returning id`,
    [conceptRecord, implementationId],
  );
  const control = await client.query(
    `insert into public.controls
       (content_record_id, aircraft_implementation_id, cockpit_area_id, aircraft_system_id,
        slug, canonical_name, control_type)
     values ($1, $2, $3, $4, 'db-test-control', 'Synthetic Control', 'SWITCH')
     returning id`,
    [controlRecord, implementationId, childArea.rows[0].id, system.rows[0].id],
  );
  const controlTwo = await client.query(
    `insert into public.controls
       (content_record_id, aircraft_implementation_id, cockpit_area_id,
        slug, canonical_name, control_type)
     values ($1, $2, $3, 'db-test-control-two', 'Synthetic Control Two', 'BUTTON')
     returning id`,
    [controlTwoRecord, implementationTwoId, secondArea.rows[0].id],
  );
  const view = await client.query(
    `insert into public.cockpit_views
       (content_record_id, aircraft_implementation_id, cockpit_area_id, media_asset_id,
        view_role, title, is_primary)
     values ($1, $2, $3, $4, 'PRIMARY', 'Synthetic Primary View', true)
     returning id`,
    [viewRecord, implementationId, childArea.rows[0].id, media.rows[0].id],
  );

  const hotspotValues = [hotspotRecord, implementationId, view.rows[0].id];
  await expectDatabaseError(
    client,
    "hotspot outside normalized bounds",
    () => client.query(
      `insert into public.hotspots
         (content_record_id, aircraft_implementation_id, cockpit_view_id, target_control_id,
          x, y, width, height)
       values ($1, $2, $3, $4, 0.9, 0.2, 0.2, 0.2)`,
      [...hotspotValues, control.rows[0].id],
    ),
    ["23514"],
  );
  await expectDatabaseError(
    client,
    "hotspot without target",
    () => client.query(
      `insert into public.hotspots
         (content_record_id, aircraft_implementation_id, cockpit_view_id, x, y, width, height)
       values ($1, $2, $3, 0.1, 0.1, 0.2, 0.2)`,
      hotspotValues,
    ),
    ["23514"],
  );
  await expectDatabaseError(
    client,
    "hotspot with dual target",
    () => client.query(
      `insert into public.hotspots
         (content_record_id, aircraft_implementation_id, cockpit_view_id,
          target_cockpit_area_id, target_control_id, x, y, width, height)
       values ($1, $2, $3, $4, $5, 0.1, 0.1, 0.2, 0.2)`,
      [...hotspotValues, childArea.rows[0].id, control.rows[0].id],
    ),
    ["23514"],
  );
  const hotspot = await client.query(
    `insert into public.hotspots
       (content_record_id, aircraft_implementation_id, cockpit_view_id, target_control_id,
        x, y, width, height)
     values ($1, $2, $3, $4, 0.1, 0.1, 0.2, 0.2)
     returning id`,
    [...hotspotValues, control.rows[0].id],
  );

  await client.query(
    `insert into public.procedure_step_controls
       (aircraft_implementation_id, procedure_step_id, control_id, role, sequence, preferred_hotspot_id)
     values ($1, $2, $3, 'ACTION_TARGET', 1, $4)`,
    [implementationId, step.rows[0].id, control.rows[0].id, hotspot.rows[0].id],
  );
  await client.query(
    `insert into public.system_component_controls
       (aircraft_implementation_id, system_component_id, control_id, relation_type)
     values ($1, $2, $3, 'OPERATED_BY')`,
    [implementationId, component.rows[0].id, control.rows[0].id],
  );
  await client.query(
    `insert into public.system_component_concepts
       (system_component_id, concept_id, relation_type)
     values ($1, $2, 'EXPLAINS')`,
    [component.rows[0].id, concept.rows[0].id],
  );
  await client.query(
    `insert into public.procedure_step_visuals
       (aircraft_implementation_id, procedure_step_id, cockpit_view_id, hotspot_id, role)
     values ($1, $2, $3, $4, 'PRIMARY')`,
    [implementationId, step.rows[0].id, view.rows[0].id, hotspot.rows[0].id],
  );

  await expectDatabaseError(
    client,
    "missing relationship reference",
    () => client.query(
      `insert into public.procedure_step_controls
         (aircraft_implementation_id, procedure_step_id, control_id, role, sequence)
       values ($1, $2, gen_random_uuid(), 'CONTEXT', 2)`,
      [implementationId, step.rows[0].id],
    ),
    ["23503"],
  );
  await expectDatabaseError(
    client,
    "cross-implementation step-control relationship",
    () => client.query(
      `insert into public.procedure_step_controls
         (aircraft_implementation_id, procedure_step_id, control_id, role, sequence)
       values ($1, $2, $3, 'CONTEXT', 2)`,
      [implementationId, step.rows[0].id, controlTwo.rows[0].id],
    ),
    ["23503"],
  );
}

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL_UNPOOLED });
  await client.connect();

  try {
    await verifySchema(client);
    const baselineRows = await client.query(
      "select count(*)::int as count from public.content_records",
    );
    await client.query("BEGIN");
    await verifySecurity(client);
    await verifyConstraintsAndRelationships(client);
    await client.query("ROLLBACK");

    const persistentRows = await client.query("select count(*)::int as count from public.content_records");
    assert.equal(
      persistentRows.rows[0].count,
      baselineRows.rows[0].count,
      "synthetic database fixtures persisted unexpectedly",
    );
    console.log("Database tests passed: schema, constraints, relationships, grants, and rollback isolation.");
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // Preserve the original test failure.
    }
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(`Database tests failed: ${error.message}`);
  process.exitCode = 1;
});
