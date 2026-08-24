# Phase 2 — Content Platform

**Status:** ⬜ Planned

## Goal

Build the repository-authored, validated, publishable content system and prove it with one connected vertical content slice before broad feature UI.

## Why Now

Guide Mode, Cockpit Explorer, Aircraft Systems, and progress all depend on stable shared content identities and relationships. Building those experiences first would hard-code or duplicate the model they are meant to render.

## Deliverables

### 2.1 Structured Content Schemas

- JavaScript-compatible schemas for the minimum connected content entities and relationship fields.
- Stable content keys, lifecycle state, availability, ordering, and media-reference contracts consistent with the [content architecture](../architecture/content-system.md).
- English repository authoring format with no UI component acting as the permanent content store.

### 2.2 Content Validation

- Deterministic parse, schema, identity, reference, scope, graph, media, source, verification, access, and publication validation.
- Actionable errors tied to file path, content key, and validation rule.
- Rejection of placeholders and unverified claims from publishable content.

### 2.3 Publishing Pipeline

- Dry-run publication plan before writes.
- Transactional, idempotent publication to PostgreSQL.
- Content revision and provenance traceability.
- Cloudflare R2 media-reference verification without storing media binaries in PostgreSQL.
- Clear separation between authored repository truth and published runtime truth.

### 2.4 First Vertical Content Slice

The first slice must connect the minimum useful learning graph:

```text
Boeing 737 MAX 8
→ iFly / Microsoft Flight Simulator 2024 implementation
→ Cold & Dark → Takeoff
→ one Procedure
→ one Procedure Step
→ one Control
→ one Cockpit View
→ one Hotspot
→ one System Component
→ one Concept
→ required Media
```

This sequence defines relationships, not production aircraft facts. Instructions, expected results, control behavior, imagery, and technical claims may be published only after the applicable [source](../content/source-policy.md) and [verification](../content/verification-policy.md) workflow actually verifies them.

## Exit Criteria

- The vertical slice passes all content validation.
- Publication is reproducible, idempotent, and transactional in the isolated runtime schema.
- All graph and media references resolve.
- Published data can be read through a minimal verification path.
- No production claim is represented as verified without verification evidence.

## Dependencies

Phase 1B, especially the minimum schema and database security foundation.

## Relevant Commit(s)

Not started

[← Previous Phase — Platform Foundation](phase-1-platform.md) · [↑ Implementation Dashboard](README.md) · [→ Next Phase — Learning State & Progress](phase-3-progress.md)
