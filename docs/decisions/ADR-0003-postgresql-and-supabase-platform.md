# ADR-0003 — PostgreSQL and Supabase Platform

## Status

Superseded — 2026-08-24

Superseded by [ADR-0011 — Neon Postgres and Neon Auth Platform](ADR-0011-neon-postgres-and-neon-auth-platform.md).

## Context

CockpitPath has a relational learning graph, private progress, authentication, verification history, search, and future entitlement relationships. It needs strong constraints and server-rendering-compatible identity.

## Decision

Use Supabase PostgreSQL as the primary database and Supabase Auth for identity. Manage schema and RLS through version-controlled SQL migrations. Prefer explicit PostgreSQL/Supabase data access over an ORM by default.

## Consequences

- Foreign keys, transactions, indexes, SQL search, and RLS can enforce important contracts.
- The project depends on Supabase hosting and Auth integration while remaining based on standard PostgreSQL data concepts.
- Database design and policies require integration tests against a real compatible database.
- Primary learning-media binaries remain outside PostgreSQL.

## Alternatives Considered

- Document database: rejected because shared entities and many-to-many relationships are central.
- Custom PostgreSQL plus custom authentication: rejected as unnecessary operational work for v0.1.
- ORM-first schema ownership: deferred because it may obscure SQL, RLS, grants, and performance without a demonstrated benefit.
