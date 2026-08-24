# ADR-0007 — Database-Level RLS

## Status

Accepted — 2026-08-24

## Context

Progress is private user-owned data. Application bugs or incorrectly scoped queries must not permit one user to access another user's records. The browser UI is not an authorization boundary.

## Decision

Use server-side authorization plus PostgreSQL Row Level Security for every exposed user-owned table. Define explicit grants, `SELECT`/write policies, and write checks. Test policies using anonymous, multiple user, and privileged roles.

## Consequences

- Data ownership has defense in depth.
- RLS policy design becomes a required part of migrations and testing.
- Privileged publishing credentials remain server-only and narrowly used.
- Hiding UI or relying only on client-provided user IDs is insufficient.

## Alternatives Considered

- Application-only authorization: rejected because a missed predicate could expose user data.
- RLS-only authorization: rejected because the server must still validate operation intent and provide coherent errors.
- Separate database per user: rejected as operationally inappropriate.
