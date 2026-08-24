# ADR-0012 — User-Scoped Data API and Server PostgreSQL Access

## Status

Accepted — 2026-08-24

Refines [ADR-0007 — Database-Level RLS](ADR-0007-database-level-rls.md) and [ADR-0011 — Neon Postgres and Neon Auth Platform](ADR-0011-neon-postgres-and-neon-auth-platform.md). It does not supersede either decision.

## Context

ADR-0011 deliberately deferred the runtime database access path until Phase 1B could prove how a verified Neon Auth identity reaches PostgreSQL RLS. CockpitPath requires server-side domain authorization and database-enforced isolation for private user-owned data, while published learning content and content publishing have different trust and privilege requirements.

Phase 1B.2 completed a real development-environment proof using two Neon Auth users. The successful path was:

```text
Neon Auth session
→ Neon-issued JWT
→ Neon Data API JWT validation
→ authenticated PostgreSQL role
→ auth.user_id()
→ PostgreSQL RLS
```

The proof demonstrated own-row access, cross-user read and write isolation, ownership-transfer prevention, unauthenticated denial, and invalid-token rejection. The user assertions ran through the non-owner Data API path; the owner connection was used only for temporary setup, inspection, and cleanup.

The Data API can be called from a browser, but that capability does not change CockpitPath's server-first architecture. The browser is not the primary authorization boundary.

## Decision

Use a responsibility-based runtime access model for CockpitPath v0.1:

| Responsibility | Access path |
| --- | --- |
| Authentication | Neon Auth owns identity, credentials, and sessions. |
| Private user-owned data | Browser → Next.js server/domain authorization → Neon Data API with the verified Neon Auth JWT → PostgreSQL RLS using `auth.user_id()`. |
| Published learning content | Next.js server → direct PostgreSQL through a dedicated least-privileged read role. |
| Content publishing | Server-only publishing process → direct PostgreSQL through a dedicated narrowly privileged publishing role. |
| Migrations and necessary administration | Privileged database owner connection. |

Server-side authorization remains mandatory for every protected operation. RLS is defense in depth and must reject cross-user access even when a query omits or attempts to defeat application ownership filtering.

Do not trust a browser-provided owner ID. A user-owned write must derive or check ownership against the identity established by the validated Neon Auth JWT and exposed to PostgreSQL as `auth.user_id()`.

The database owner and any role with `BYPASSRLS` must not be used for normal application runtime access. Runtime content and publishing roles must be separate and limited to their stated responsibilities.

User-owned schema must use an identity type compatible with the actual Neon Auth subject returned by `auth.user_id()`. Do not assume that application user IDs are UUIDs. The final SQL schema design must verify the provider contract before choosing column and constraint types.

Exact Next.js Neon Auth SDK calls, cookie/session adapters, and Data API client APIs are Phase 1B.3 implementation details, not part of this decision.

## Consequences

- Private data receives two authorization layers: Next.js domain authorization and PostgreSQL RLS based on provider-validated identity.
- The application uses two database access paths, but their responsibilities do not overlap: Data API is for authenticated user-scoped operations, while direct PostgreSQL is for trusted server-controlled content, publishing, migrations, and administration.
- Published-content reads do not require user identity propagation into a database session, but they still require a dedicated read-only role and explicit publication filtering.
- Publishing can use transactions and narrowly elevated grants without exposing those credentials to the browser or normal runtime path.
- Migrations must define explicit grants, RLS policies, and `WITH CHECK` rules for every exposed user-owned table.
- Tests must use real validated identity propagation; manually setting an unverified user ID or claim is not an Auth-to-RLS test.
- Data API configuration, JWT behavior, and the `auth.user_id()` contract become provider integration points that must be covered by integration tests and reviewed when Neon changes them.

## Alternatives Considered

- Direct PostgreSQL with application-side JWT verification and `request.jwt.claims` initialization for all user-scoped operations: can be secure when implemented correctly, but adds application-owned verification and per-transaction identity initialization. It was not the proven Phase 1B.2 path and adds unnecessary v0.1 plumbing.
- Data API for all database access: would unify transport, but would route trusted published-content reads, transactional publishing, and administrative work through a user-oriented HTTP data boundary without a corresponding security or simplicity benefit.
- Direct PostgreSQL for all database access: would simplify transport count, but user-scoped requests would still require a separate verified identity propagation mechanism. Using the owner connection would bypass the required RLS boundary and is prohibited.
- Responsibility-based hybrid: selected because each path has one clear trust responsibility. It avoids implementing the same operation twice while preserving the proven Data API identity boundary for private data and direct PostgreSQL strengths for trusted server operations.
