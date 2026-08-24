# Phase 1 — Platform Foundation

**Status:** ✅ Complete

## Goal

Establish the application runtime, authenticated PostgreSQL platform, migration discipline, minimum domain schema, and database security boundary required by all user-owned CockpitPath behavior.

## Why This Phase Exists

Content, progress, and protected product experiences require a reproducible application and data platform. The real authenticated identity path must be proven before it is repeated across user-owned product tables.

## Phase 1A — Next.js Application Scaffold

**Status:** ✅ Complete

### Goal

Establish the smallest working web application and engineering quality baseline on which later checkpoints can build.

### Why Now

Platform integration and product features require a reproducible application runtime and testable repository baseline.

### Deliverables

- Next.js App Router with React.
- Plain JavaScript application baseline; TypeScript is not required.
- Minimal application shell.
- ESLint and Vitest configuration.
- Working test, lint, and build baseline.

### Exit Criteria

- The minimal application renders through the App Router.
- Test, lint, and build commands are defined and pass at the checkpoint.
- The scaffold contains no premature CockpitPath feature implementation.
- The plain JavaScript policy is preserved.

### Dependencies

[Phase 0 — Product, UX, Design & Architecture Foundation](phase-0-foundation.md).

### Relevant Commit(s)

`ec775e9` — `chore: establish Next.js application scaffold`

## Phase 1B — Platform Foundation

**Status:** ✅ Complete

### Goal

Establish the Neon architecture, development and migration setup, authenticated RLS proof, application authentication, minimum real domain schema, and applied database security.

### Why Now

Content, progress, and protected application experiences must not be built on an unproven identity or data-security path.

### Deliverables

Neon architecture, development and migration setup, authenticated RLS proof, application authentication, the first real domain schema, and applied database security.

### Exit Criteria

All Phase 1B.0–1B.5 exit criteria pass. The approved identity path, reproducible shared-content schema, secure database defaults, and security tests are reviewed and committed. The real user-owned RLS mechanism is proven and remains reserved for the first persistent user-owned schema in Phase 3.

### Dependencies

Phase 1A and the architecture baseline.

### Relevant Commit(s)

`7b2bd04`, `f7fec2f`, `54a9592`, `67c07f0`, and `cd9b84c` close Phase 1B.0–1B.5.

## 1B.0 — Architecture Migration to Neon

**Status:** ✅ Complete

### Goal

Replace the superseded Supabase platform direction before committing platform implementation to it.

### Why Now

Available Supabase project capacity no longer fit the project, while CockpitPath still required managed PostgreSQL, managed authentication, database branching, SQL migrations, and PostgreSQL RLS.

### Deliverables

- The Supabase platform decision was superseded before committed platform implementation.
- Neon Postgres selected as the primary database.
- Neon Auth selected for identity.
- PostgreSQL RLS retained as a database security boundary.
- Railway retained as the Next.js application host.
- Cloudflare R2 retained for learning media.
- [ADR-0011 — Neon Postgres and Neon Auth Platform](../decisions/ADR-0011-neon-postgres-and-neon-auth-platform.md) accepted.

### Exit Criteria

- Architecture documentation consistently identifies Neon Postgres and Neon Auth.
- The Supabase decision is explicitly superseded rather than silently rewritten.
- R2 and Railway remain unchanged.
- Identity propagation is reserved for an explicit implementation proof rather than assumed.

### Dependencies

Phase 0 and Phase 1A.

### Relevant Commit(s)

`7b2bd04` — `docs: migrate platform architecture to Neon`

## 1B.1 — Neon Development & Migration Foundation

**Status:** ✅ Complete

### Goal

Establish an isolated Neon development environment and a reproducible plain-SQL migration workflow without creating CockpitPath product tables.

### Why Now

The identity proof and every later schema change require a safe development target, environment discipline, and version-controlled migration mechanism first.

### External Neon Provider State

The following operational setup exists in Neon and the local development environment. It is not fully represented by the Git checkpoint:

- Neon project created with a production/default branch.
- Isolated development branch created.
- Local workspace linked to the development branch.
- Development database connection verified.
- Neon Auth enabled on development.
- Managed `neon_auth` schema verified.
- Development environment values pulled into ignored `.env.local`.
- `cockpitpath_migrations` metadata schema established.
- Migration workflow exercised and verified as repeatable against development.

### Committed Repository State

- Local `.neon` CLI context ignored by Git.
- `.env.local` and local secrets ignored by Git.
- `node-pg-migrate` and `pg` migration dependencies.
- SQL-only migration creation workflow.
- Unpooled `DATABASE_URL_UNPOOLED` connection for migrations.
- Dedicated `cockpitpath_migrations` metadata schema configuration.
- Version-controlled `migrations/` directory containing only `.gitkeep`.

No CockpitPath domain tables or domain SQL migrations exist yet. Commit `f7fec2f` records the repository tooling and ignore rules; it does not by itself represent or prove all external provider setup.

### Exit Criteria

- Development is isolated from the production/default branch.
- The development database connection, Neon Auth, and managed schema are verified.
- Local branch context and environment secrets are ignored by Git.
- A plain SQL migration can be created and applied with `node-pg-migrate` over the unpooled connection.
- Migration metadata uses its dedicated schema.
- The migration workflow is repeatable.
- The repository remains free of CockpitPath domain tables and premature domain migrations.

### Dependencies

Phase 1B.0.

### Relevant Commit(s)

`f7fec2f` — `chore: establish Neon migration foundation`

## 1B.2 — Neon Auth → PostgreSQL RLS Proof

**Status:** ✅ Complete

### Goal

Prove real authenticated identity propagation into PostgreSQL and real cross-user isolation before creating user-owned CockpitPath tables.

### Why Now

RLS policy syntax alone does not prove that the runtime request path carries verified identity. The trust boundary must work end to end before it is applied to real progress data.

### Proven Path

```text
Neon Auth
→ Neon-issued JWT
→ Neon Data API verification
→ authenticated PostgreSQL role
→ auth.user_id()
→ PostgreSQL RLS
```

### Completed Work

- Used real development-only Neon Auth users and Neon-issued JWTs.
- Proved Data API JWT validation and `auth.user_id()` as the PostgreSQL RLS identity boundary.
- Exercised PostgreSQL RLS through the real non-owner `authenticated` role rather than the owner/`BYPASSRLS` connection.
- Verified own-row access, cross-user read/write isolation, ownership-transfer prevention, unauthenticated denial, and invalid-token rejection.
- Preserved the separation between normal user access, trusted server access, publishing, and database administration.
- Removed temporary proof objects and test users, confirmed Neon Auth integrity, and left production untouched.
- Selected and documented the responsibility-based Data API/direct PostgreSQL architecture in [ADR-0012 — User-Scoped Data API and Server PostgreSQL Access](../decisions/ADR-0012-user-scoped-data-api-and-server-postgres-access.md).

### Exit Criteria

- Real Neon Auth sessions supplied the identity used by the Data API and PostgreSQL RLS.
- Positive own-row access and required cross-user negative cases passed through the non-owner path.
- Unauthenticated and tampered-token behavior was denied.
- The owner/`BYPASSRLS` connection was excluded from user-isolation assertions.
- Temporary proof objects and development test users were removed, and managed Neon Auth state remained intact.
- The resulting runtime responsibility boundary was reviewed, accepted, documented in ADR-0012, and committed.

### Dependencies

Phase 1B.1 and ADR-0011.

### Relevant Commit(s)

`54a9592` — `docs: record Neon Auth RLS access architecture`

## 1B.3 — Application Authentication Integration

**Status:** ✅ Complete

### Goal

Integrate Neon Auth into the Next.js application using the identity path proven in Phase 1B.2.

### Why Now

Application authentication should consume a proven trust boundary instead of deciding database identity and RLS behavior while building user flows.

### Deliverables

- Neon Auth integration in Next.js.
- Sign up, sign in, sign out, and password reset.
- Persistent, server-aware session validation and refresh behavior.
- Protected server-rendered routes and protected mutations.
- Safe redirect behavior and server-only secret handling.

Visual UI design is outside this checkpoint; existing UX and design sources govern it when needed.

### Exit Criteria

- Authentication flows work against the intended development branch.
- Protected routes and mutations derive identity from the validated server session.
- Expired, missing, and invalid sessions fail safely.
- Secrets do not reach browser bundles.
- Authentication tests pass.

### Dependencies

Phase 1B.2.

### Relevant Commit(s)

`67c07f0` — `feat: integrate Neon Auth with Next.js`

## 1B.4 — Core Database Schema

**Status:** ✅ Complete

### Goal

Begin implementing the approved conceptual CockpitPath data model with only the connected subset required by the first vertical slice.

### Why Now

The schema should follow the proven identity path and be driven by a real connected slice. The complete conceptual model must not be materialized in one uncontrolled migration.

### Deliverables

- Two version-controlled, reversible plain-SQL migrations.
- A 21-table shared learning graph covering Aircraft, Simulator, AddOnProduct, AircraftImplementation, Journey, Procedure, ProcedureStep, cockpit hierarchy, Controls, Hotspots, Systems, Components, Concepts, Media Assets, and their minimum connecting relationships.
- Canonical `ContentRecord` identity and lifecycle metadata with stable human-readable keys separate from UUID database identity.
- Database constraints and indexes for order, hotspot geometry, target XOR rules, foreign keys, and implementation-scoped relationships.
- One reusable, narrowly scoped `updated_at` trigger function.
- No profiles, progress, user-owned schema, or persistent aircraft content.

### Exit Criteria

- The minimum schema recreates from migrations on an empty isolated environment.
- Required relationships and constraints are tested.
- No domain table duplicates Neon Auth credential or session ownership.
- Schema scope is traceable to the first vertical slice.
- The checkpoint does not create the entire conceptual schema without demonstrated need.

### Dependencies

Phase 1B.2, coordinated with the minimum data needs of Phase 2.

### Relevant Commit(s)

`cd9b84c` — `feat: establish core learning database foundation`

## 1B.5 — Database Security Foundation

**Status:** ✅ Complete

### Goal

Apply the identity and RLS mechanism proven in Phase 1B.2 to real user-owned CockpitPath data and make that security reproducible.

### Why Now

Phase 1B.2 proves the mechanism with a narrow end-to-end test. Phase 1B.5 applies that mechanism consistently to the real CockpitPath schema before product features depend on user-owned data.

### Deliverables

- Secure owner-created default privileges for CockpitPath tables, sequences, and functions.
- Explicit denial of raw content-table access to `PUBLIC` and the Data API `anonymous`, `authenticated`, and `authenticator` roles.
- A branch-gated live database test harness covering schema, constraints, relationship scope, privileges, migration metadata, and fixture rollback.
- Full development-only migration UP, idempotent second UP, DOWN, re-UP, and final-state verification.
- No meaningless RLS policies on product-owned shared content and no invented user-owned table. Phase 1B.2's proven `auth.user_id()` policy mechanism remains the required foundation for Phase 3 progress data.
- Published-reader and publisher roles deliberately deferred until Phase 2 creates a meaningful published-only surface and grant model.

### Exit Criteria

- All CockpitPath tables are denied to unintended public and Data API roles.
- Future owner-created application objects inherit safe defaults.
- The complete schema and security boundary reproduce from migrations on the isolated development branch.
- Synthetic database fixtures roll back and no production content remains.
- Managed Neon Auth/Data API objects remain intact.
- The absence of persistent user-owned tables is explicit; RLS is applied when such a table is introduced rather than to shared editorial content for appearance.

### Dependencies

Phases 1B.2 and 1B.4.

### Relevant Commit(s)

`cd9b84c` — `feat: establish core learning database foundation`

[← Previous Phase — Foundation](phase-0-foundation.md) · [↑ Implementation Dashboard](README.md) · [→ Next Phase — Content Platform](phase-2-content-platform.md)
