# ADR-0010 — Repository-Based Content Authoring

## Status

Accepted — 2026-08-24

## Context

v0.1 needs reviewable, versioned, validated structured content and a safe publication workflow. Content volume and editorial staffing do not justify building a custom CMS.

## Decision

Use English UTF-8 repository files as the authoring source: YAML for structured entities with approved Markdown fields for rich explanation. Run schema, identity, reference, graph, media, source, and verification validation before transactional publication into PostgreSQL.

## Consequences

- Content changes use ordinary version history and review.
- Authors work with stable human-readable keys rather than UUIDs.
- Publishing tooling must produce deterministic dry runs, preserve identity, and support rollback by repository revision.
- PostgreSQL is the runtime source, but manual runtime edits are not editorial truth.
- A CMS may be considered later if content scale and users justify it.

## Alternatives Considered

- Custom CMS: rejected for v0.1 as disproportionate scope.
- Author directly in production PostgreSQL: rejected because it weakens review, reproducibility, and rollback.
- Keep runtime content in repository files only: rejected because relational queries, access, search, publication state, and connected runtime data fit PostgreSQL.
- Unstructured Markdown pages: rejected because graph relationships and validation require structured fields.
