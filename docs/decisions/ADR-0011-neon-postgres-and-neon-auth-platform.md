# ADR-0011 — Neon Postgres and Neon Auth Platform

## Status

Accepted — 2026-08-24

Supersedes [ADR-0003 — PostgreSQL and Supabase Platform](ADR-0003-postgresql-and-supabase-platform.md).

## Context

CockpitPath still requires relational PostgreSQL, managed authentication, PostgreSQL Row Level Security, version-controlled SQL migrations, and economical isolated development environments. The project owner has reached the available free Supabase project capacity and does not want to adopt a paid Supabase plan at this development stage.

Neon is currently a better project-capacity fit while preserving the PostgreSQL-native architecture. Neon also provides database branches for isolated development and test environments. Current Neon Auth is built on Better Auth, stores its managed identity and session data in the Neon database, and branches that state with the database.

## Decision

Use Neon Postgres as the primary database and Neon Auth for identity. Continue to enforce sensitive access through server-side authorization plus PostgreSQL RLS. Manage schema, grants, functions, and RLS through version-controlled SQL migrations without requiring an ORM merely for migration ownership.

Use Neon database branches conceptually for production, development, and isolated feature or test environments where useful. Exact branch names, lifecycle automation, and the SQL migration runner are deferred to the Neon Phase 1B implementation.

The implementation phase must evaluate the current Neon Data API and direct PostgreSQL access as architectural options. It must define how verified Neon Auth identity reaches PostgreSQL RLS before choosing policy identity expressions. The legacy product previously named Neon RLS or Neon Authorize is not part of this decision.

Cloudflare R2 remains the learning-media store. Railway remains the Next.js application host.

## Consequences

- CockpitPath retains PostgreSQL constraints, transactions, indexes, SQL search, and native RLS.
- Neon Auth identity, session, and configuration data participates in database branching, so branch security and data handling must cover authentication state as well as application data.
- Each application environment must use the intended Neon branch and its corresponding authentication configuration; production credentials are never development defaults.
- Database and RLS tests must run against an isolated real PostgreSQL environment using the selected identity propagation path.
- The project depends on Neon Postgres and Neon Auth behavior and must monitor provider capabilities, limits, and pricing as the product evolves.
- This decision reflects CockpitPath's current capacity needs; it does not claim Neon will always be less expensive.

## Alternatives Considered

- Continue with Supabase: technically viable, but not selected because the available free project capacity is exhausted and a paid plan is not desired at this stage.
- Self-managed PostgreSQL plus self-managed authentication: rejected because it adds operational and security work without a current product requirement.
- Neon Postgres with a separate authentication provider: viable, but not selected because branch-compatible Neon Auth better fits the desired isolated environment model.
- ORM-owned schema and migrations: not required; it would not replace the need to review explicit SQL, grants, functions, and RLS policies.
