const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { randomBytes } = require("node:crypto");
const path = require("node:path");
const { Client } = require("pg");

const { assertSafeDatabaseEnvironment } = require("./database-safety.cjs");
const { loadContent } = require("./content/load.cjs");
const { applyPublication, planPublication } = require("./content/publisher.cjs");
const { validateGraph } = require("./content/validate.cjs");

assertSafeDatabaseEnvironment();

const CONTENT_PREFIX = "%.synthetic-wp2%";
const TEST_ENVIRONMENT = "test/wp3-guide";

function authUrl(path) {
  return `${process.env.NEON_AUTH_BASE_URL.replace(/\/$/, "")}/${path}`;
}

function dataUrl(path) {
  return `${process.env.NEON_DATA_API_URL.replace(/\/$/, "")}/${path}`;
}

function applicationUrl(path) {
  const baseUrl = (process.env.COCKPITPATH_TEST_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
  return `${baseUrl}${path}`;
}

function updateCookies(jar, response) {
  const values = response.headers.getSetCookie?.() || [];
  for (const value of values) {
    const pair = value.split(";", 1)[0];
    const separator = pair.indexOf("=");
    if (separator > 0) jar.set(pair.slice(0, separator), pair.slice(separator + 1));
  }
}

function cookieHeader(jar) {
  return [...jar].map(([name, value]) => `${name}=${value}`).join("; ");
}

async function authRequest(session, path, { method = "GET", body } = {}) {
  const response = await fetch(authUrl(path), {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Origin: "http://localhost:3000",
      ...(session.cookies.size ? { Cookie: cookieHeader(session.cookies) } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    redirect: "manual",
  });
  updateCookies(session.cookies, response);
  return response;
}

async function createAuthUser(label) {
  const stamp = `${Date.now()}-${randomBytes(5).toString("hex")}`;
  const session = {
    cookies: new Map(),
    email: `cockpitpath-wp3-${label}-${stamp}@example.com`,
    password: randomBytes(24).toString("base64url"),
    userId: null,
    token: null,
  };
  const signup = await authRequest(session, "sign-up/email", {
    method: "POST",
    body: { email: session.email, password: session.password, name: `WP3 ${label}` },
  });
  assert(signup.ok, `development Auth sign-up failed for ${label}`);
  const signupData = await signup.json();
  session.userId = signupData.user?.id || signupData.data?.user?.id;

  const tokenResponse = await authRequest(session, "token");
  assert(tokenResponse.ok, `development Auth token retrieval failed for ${label}`);
  const tokenData = await tokenResponse.json();
  session.token = tokenData.token || tokenData.data?.token;
  assert(session.userId && session.token, `development Auth identity was incomplete for ${label}`);
  return session;
}

async function applicationRequest(session, path, { method = "GET", body } = {}) {
  const response = await fetch(applicationUrl(path), {
    method,
    headers: {
      Accept: "application/json, text/html",
      "Content-Type": "application/json",
      ...(session.cookies.size ? { Cookie: cookieHeader(session.cookies) } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    redirect: "manual",
  });
  updateCookies(session.cookies, response);
  return response;
}

async function createApplicationUser() {
  const stamp = `${Date.now()}-${randomBytes(5).toString("hex")}`;
  const session = {
    cookies: new Map(),
    email: `cockpitpath-wp3-app-${stamp}@example.com`,
    password: randomBytes(24).toString("base64url"),
    userId: null,
    token: null,
  };
  const signup = await applicationRequest(session, "/api/auth/sign-up/email", {
    method: "POST",
    body: { email: session.email, password: session.password, name: "WP3 App" },
  });
  assert(signup.ok, "application Auth sign-up failed");
  const signupData = await signup.json();
  session.userId = signupData.user?.id || signupData.data?.user?.id;

  const tokenResponse = await applicationRequest(session, "/api/auth/token");
  assert(tokenResponse.ok, "application Auth token retrieval failed");
  const tokenData = await tokenResponse.json();
  session.token = tokenData.token || tokenData.data?.token;
  assert(session.userId && session.token, "application Auth identity was incomplete");
  return session;
}

async function deleteAuthUser(session) {
  if (!session) return false;
  const response = await authRequest(session, "delete-user", {
    method: "POST",
    body: { password: session.password },
  });
  return response.ok;
}

async function cleanupReservedAuthUsers(client) {
  const result = await client.query(`
    select id
    from neon_auth."user"
    where email like 'cockpitpath-wp3-%@example.com'
  `);

  assert(process.env.npm_execpath, "Auth cleanup must run through the repository npm command");
  const npxCliPath = path.join(path.dirname(process.env.npm_execpath), "npx-cli.js");
  for (const { id } of result.rows) {
    assert.match(id, /^[A-Za-z0-9_-]+$/, "Auth user ID was not safe for CLI cleanup");
    execFileSync(
      process.execPath,
      [
        npxCliPath,
        "--yes",
        "neonctl@latest",
        "neon-auth",
        "user",
        "delete",
        id,
        "--branch",
        "development",
        "--output",
        "json",
      ],
      { cwd: process.cwd(), stdio: "ignore", windowsHide: true },
    );
  }

  const remaining = await client.query(`
    select count(*)::int as count
    from neon_auth."user"
    where email like 'cockpitpath-wp3-%@example.com'
  `);
  assert.equal(remaining.rows[0].count, 0, "reserved Work Package 3 Auth users remain");
}

async function dataRequest(token, path, { method = "GET", body } = {}) {
  return fetch(dataUrl(path), {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Accept-Profile": "public",
      "Content-Profile": "public",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

async function json(response) {
  const value = await response.json();
  return Array.isArray(value) ? value : [value];
}

async function rpc(token, name, body) {
  const response = await dataRequest(token, `rpc/${name}`, { method: "POST", body });
  if (!response.ok) {
    let providerCode = "unavailable";
    let providerMessage = "unavailable";
    try {
      const payload = await response.json();
      providerCode = String(payload.code || payload.error || "unavailable").slice(0, 80);
      providerMessage = String(payload.message || "unavailable")
        .replaceAll(/https?:\/\/\S+/g, "[redacted URL]")
        .slice(0, 200);
    } catch {
      // The HTTP status remains enough to diagnose a non-JSON provider response.
    }
    throw new Error(`${name} failed through the authenticated Data API path (HTTP ${response.status}, code ${providerCode}, ${providerMessage})`);
  }
  return (await json(response))[0];
}

async function cleanupSynthetic(client) {
  const records = await client.query(
    "select id, kind from public.content_records where content_key like $1",
    [CONTENT_PREFIX],
  );
  const recordIds = records.rows.map(({ id }) => id);
  if (!recordIds.length) {
    await client.query("delete from public.source_references where source_key='source.synthetic-wp2-fixture'");
    return;
  }

  const ids = async (table) => (await client.query(
    `select entity.id from public.${table} entity where entity.content_record_id = any($1::uuid[])`,
    [recordIds],
  )).rows.map(({ id }) => id);
  const journeyIds = await ids("journeys");
  const procedureIds = await ids("procedures");
  const stepIds = await ids("procedure_steps");
  const implementationIds = await ids("aircraft_implementations");
  const componentIds = await ids("system_components");

  await client.query("delete from public.user_step_progress where procedure_step_id = any($1::uuid[])", [stepIds]);
  await client.query("delete from public.user_procedure_progress where procedure_id = any($1::uuid[])", [procedureIds]);
  await client.query("delete from public.user_journey_progress where journey_id = any($1::uuid[])", [journeyIds]);
  await client.query("delete from public.content_publication_items where content_record_id = any($1::uuid[])", [recordIds]);
  await client.query("delete from public.content_publications where environment=$1", [TEST_ENVIRONMENT]);
  await client.query("delete from public.verification_events where content_record_id = any($1::uuid[])", [recordIds]);
  await client.query("delete from public.content_sources where content_record_id = any($1::uuid[])", [recordIds]);
  await client.query("delete from public.procedure_step_visuals where procedure_step_id = any($1::uuid[])", [stepIds]);
  await client.query("delete from public.procedure_step_controls where procedure_step_id = any($1::uuid[])", [stepIds]);
  await client.query("delete from public.system_component_concepts where system_component_id = any($1::uuid[])", [componentIds]);
  await client.query("delete from public.system_component_controls where system_component_id = any($1::uuid[])", [componentIds]);
  await client.query("delete from public.journey_sections where journey_id = any($1::uuid[])", [journeyIds]);
  await client.query("delete from public.hotspots where aircraft_implementation_id = any($1::uuid[])", [implementationIds]);
  await client.query("delete from public.cockpit_views where aircraft_implementation_id = any($1::uuid[])", [implementationIds]);
  await client.query("delete from public.controls where aircraft_implementation_id = any($1::uuid[])", [implementationIds]);
  await client.query("delete from public.system_components where aircraft_implementation_id = any($1::uuid[])", [implementationIds]);
  await client.query("delete from public.aircraft_systems where aircraft_implementation_id = any($1::uuid[])", [implementationIds]);
  await client.query("delete from public.concepts where content_record_id = any($1::uuid[])", [recordIds]);
  await client.query("delete from public.procedure_steps where content_record_id = any($1::uuid[])", [recordIds]);
  await client.query("delete from public.procedures where content_record_id = any($1::uuid[])", [recordIds]);
  await client.query("delete from public.journeys where content_record_id = any($1::uuid[])", [recordIds]);
  await client.query("delete from public.cockpit_areas where aircraft_implementation_id = any($1::uuid[])", [implementationIds]);
  await client.query("delete from public.media_assets where content_record_id = any($1::uuid[])", [recordIds]);
  await client.query("delete from public.aircraft_implementations where content_record_id = any($1::uuid[])", [recordIds]);
  await client.query("delete from public.addon_products where content_record_id = any($1::uuid[])", [recordIds]);
  await client.query("delete from public.simulators where content_record_id = any($1::uuid[])", [recordIds]);
  await client.query("delete from public.aircraft where content_record_id = any($1::uuid[])", [recordIds]);
  await client.query("delete from public.content_records where id = any($1::uuid[])", [recordIds]);
  await client.query("delete from public.source_references where source_key='source.synthetic-wp2-fixture'");
}

async function setupSynthetic(client) {
  await client.query("BEGIN");
  try {
    await cleanupSynthetic(client);
    await client.query("SET LOCAL ROLE cockpitpath_publisher");
    const graph = validateGraph(await loadContent("test/fixtures/content/valid"));
    const plan = await planPublication(client, graph);
    assert.equal(plan.actions.length, 18, "synthetic Guide graph is incomplete");
    await applyPublication(client, graph, plan, { environment: TEST_ENVIRONMENT });
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

async function contentIds(client) {
  const result = await client.query(`
    select journey.id as journey_id,
           procedure.id as procedure_id,
           array_agg(step.id order by step.sequence) as step_ids
    from public.journeys journey
    join public.content_records journey_record on journey_record.id=journey.content_record_id
    join public.journey_sections section on section.journey_id=journey.id
    join public.procedures procedure on procedure.id=section.procedure_id
    join public.procedure_steps step on step.procedure_id=procedure.id
    where journey_record.content_key='journey.synthetic-wp2'
    group by journey.id, procedure.id
  `);
  assert.equal(result.rows.length, 1);
  return result.rows[0];
}

async function verifyRuntimeReader() {
  assert(process.env.CONTENT_DATABASE_URL, "CONTENT_DATABASE_URL is required");
  const reader = new Client({ connectionString: process.env.CONTENT_DATABASE_URL });
  await reader.connect();
  try {
    const published = await reader.query(
      "select count(*)::int as count from cockpitpath_published.procedure_steps step join cockpitpath_published.procedures procedure on procedure.id=step.procedure_id where procedure.slug='synthetic-procedure'",
    );
    assert.equal(published.rows[0].count, 3, "published reader did not resolve the Guide steps");
    await assert.rejects(
      () => reader.query("select * from public.procedure_steps limit 1"),
      (error) => error.code === "42501",
    );
  } finally {
    await reader.end();
  }
}

async function verifyProgress(ids, userA, userB) {
  const [firstStep, optionalStep, finalStep] = ids.step_ids;
  const startBody = { p_journey_id: ids.journey_id, p_procedure_id: ids.procedure_id };
  await rpc(userA.token, "cockpitpath_start_guide", startBody);
  await rpc(userB.token, "cockpitpath_start_guide", startBody);

  const selectA = await dataRequest(
    userA.token,
    `user_journey_progress?journey_id=eq.${ids.journey_id}&select=user_id,current_procedure_step_id,progress_status,guide_mode`,
  );
  assert(selectA.ok);
  const ownA = await json(selectA);
  assert.equal(ownA.length, 1);
  assert.equal(ownA[0].user_id, userA.userId, "auth.user_id() did not persist the verified Neon Auth subject");

  const crossRead = await dataRequest(
    userB.token,
    `user_journey_progress?user_id=eq.${encodeURIComponent(userA.userId)}&select=user_id`,
  );
  assert(crossRead.ok);
  assert.equal((await json(crossRead)).length, 0, "User B could read User A progress");

  const reverseRead = await dataRequest(
    userA.token,
    `user_journey_progress?user_id=eq.${encodeURIComponent(userB.userId)}&select=user_id`,
  );
  assert(reverseRead.ok);
  assert.equal((await json(reverseRead)).length, 0, "User A could read User B progress");

  const crossWrite = await dataRequest(
    userB.token,
    `user_journey_progress?user_id=eq.${encodeURIComponent(userA.userId)}`,
    { method: "PATCH", body: { guide_mode: "QUICK" } },
  );
  assert.equal(crossWrite.ok, false, "User B could directly modify User A progress");

  const anonymous = await dataRequest(null, "user_journey_progress?select=id");
  assert.equal(anonymous.ok, false, "anonymous progress access was permitted");
  const tampered = await dataRequest(`${userA.token.slice(0, -1)}x`, "user_journey_progress?select=id");
  assert.equal(tampered.ok, false, "a tampered Auth token reached progress data");

  await rpc(userA.token, "cockpitpath_record_step_progress", {
    p_journey_id: ids.journey_id,
    p_procedure_step_id: firstStep,
    p_outcome: "COMPLETED",
  });
  const skipped = await rpc(userA.token, "cockpitpath_record_step_progress", {
    p_journey_id: ids.journey_id,
    p_procedure_step_id: optionalStep,
    p_outcome: "SKIPPED",
  });
  assert.equal(skipped.current_procedure_step_id, finalStep, "Skip did not advance atomically");

  const refreshedToken = await authRequest(userA, "token");
  assert(refreshedToken.ok, "session did not persist across token refresh");
  const resumed = await dataRequest(
    userA.token,
    `user_journey_progress?journey_id=eq.${ids.journey_id}&select=current_procedure_step_id`,
  );
  assert.equal((await json(resumed))[0].current_procedure_step_id, finalStep, "reload did not resume the exact saved position");

  const completed = await rpc(userA.token, "cockpitpath_record_step_progress", {
    p_journey_id: ids.journey_id,
    p_procedure_step_id: finalStep,
    p_outcome: "COMPLETED",
  });
  assert.equal(completed.journey_status, "COMPLETED", "Journey did not complete atomically");
  const retried = await rpc(userA.token, "cockpitpath_record_step_progress", {
    p_journey_id: ids.journey_id,
    p_procedure_step_id: finalStep,
    p_outcome: "COMPLETED",
  });
  assert.equal(retried.journey_status, "COMPLETED", "completion retry was not idempotent");
}

async function verifyApplication(ids, session) {
  const route = "/learn/synthetic-journey/synthetic-procedure";
  const initial = await applicationRequest(session, route);
  assert.equal(initial.status, 200, "authenticated Guide route did not render");
  const initialHtml = await initial.text();
  assert.match(initialHtml, /Synthetic Procedure/, "Guide Procedure context was absent");
  assert.match(initialHtml, /Operate the synthetic test control/, "first published Guide step was absent");
  assert.match(initialHtml, /CockpitPath does not detect simulator state/, "Expected Result disclosure was absent");
  assert.match(initialHtml, /Verified media is not available/, "missing-media state was absent");

  const [firstStep, optionalStep, finalStep] = ids.step_ids;
  await rpc(session.token, "cockpitpath_record_step_progress", {
    p_journey_id: ids.journey_id,
    p_procedure_step_id: firstStep,
    p_outcome: "COMPLETED",
  });
  await rpc(session.token, "cockpitpath_record_step_progress", {
    p_journey_id: ids.journey_id,
    p_procedure_step_id: optionalStep,
    p_outcome: "SKIPPED",
  });
  await rpc(session.token, "cockpitpath_set_guide_position", {
    p_journey_id: ids.journey_id,
    p_procedure_step_id: finalStep,
    p_guide_mode: "QUICK",
  });

  const resumed = await applicationRequest(session, route);
  assert.equal(resumed.status, 200, "Guide route reload failed");
  const resumedHtml = await resumed.text();
  assert.match(resumedHtml, /Confirm the synthetic test result/, "Guide route did not resume the exact saved step");
  assert.match(resumedHtml, /aria-pressed="true"[^>]*>Quick</, "saved Quick mode was not server-rendered");

  const secondReload = await applicationRequest(session, route);
  assert.equal(secondReload.status, 200, "persistent application session did not survive another reload");
}

async function main() {
  const mode = process.argv[2] || "verify";
  const owner = new Client({ connectionString: process.env.DATABASE_URL_UNPOOLED });
  await owner.connect();
  let userA;
  let userB;
  let completed = false;

  try {
    if (mode === "cleanup") {
      await cleanupSynthetic(owner);
      await cleanupReservedAuthUsers(owner);
      console.log("Synthetic Guide integration content and progress removed from development.");
      return;
    }

    await setupSynthetic(owner);
    if (mode === "setup") {
      console.log("Synthetic Guide integration content is available on development for local UI verification.");
      completed = true;
      return;
    }

    const ids = await contentIds(owner);
    await verifyRuntimeReader();
    if (mode === "app") {
      userA = await createApplicationUser();
      await verifyApplication(ids, userA);
      completed = true;
      console.log("Application Guide integration passed: Next.js session, restricted content, Data API progress, and exact reload resume.");
      return;
    }
    userA = await createAuthUser("user-a");
    userB = await createAuthUser("user-b");
    await verifyProgress(ids, userA, userB);
    completed = true;
    console.log("Guide integration passed: real Auth JWTs, Data API RLS, atomic progress, resume, and restricted published reads.");
  } finally {
    if (mode !== "setup") {
      await cleanupSynthetic(owner);
      const usersRemoved = await Promise.all([deleteAuthUser(userA), deleteAuthUser(userB)]);
      if (usersRemoved.some((removed, index) => (index === 0 ? userA : userB) && !removed)) {
        await cleanupReservedAuthUsers(owner);
      }
    }
    await owner.end();
    if (!completed && mode !== "cleanup") process.exitCode = 1;
  }
}

main().catch((error) => {
  const detail = String(error.message || error.code || error.name || "unknown error")
    .replaceAll(/https?:\/\/\S+/g, "[redacted URL]")
    .replaceAll(/Bearer\s+\S+/gi, "Bearer [redacted]");
  console.error(`Guide integration failed: ${detail}`);
  process.exitCode = 1;
});
