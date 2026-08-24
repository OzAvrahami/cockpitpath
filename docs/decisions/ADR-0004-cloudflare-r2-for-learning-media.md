# ADR-0004 — Cloudflare R2 for Learning Media

## Status

Accepted — 2026-08-24

## Context

Guide Mode and Cockpit Explorer depend on high-resolution, responsive cockpit imagery. Media delivery, caching, variants, and future protected access have different needs from relational application data.

## Decision

Store learning-media binaries in Cloudflare R2. Store stable Media Asset identity, storage keys, dimensions, capture context, verification, rights, and relationships in PostgreSQL. Resolve delivery URLs at runtime; authored content references Media Asset keys/IDs.

## Consequences

- Database rows remain small and relational while media can use object/CDN caching.
- Publishing must validate that referenced objects exist.
- Media lifecycle and database publication are coordinated but not one transaction.
- Future signed delivery can be added without rewriting content references.

## Alternatives Considered

- PostgreSQL binary storage: rejected for large learning media.
- Supabase Storage: viable but not selected; at the time of this decision, the established platform baseline separated R2 media from Supabase data/auth. The later platform change in ADR-0011 does not change the R2 decision.
- Repository-hosted production images: rejected because large/versioned delivery assets would burden source history and deployment.
