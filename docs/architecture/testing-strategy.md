# CockpitPath Testing Strategy

**Status:** Accepted v0.1<br>
**Last updated:** 2026-08-24

## Purpose

Testing must protect the core promise: a user can follow, leave, and correctly resume a verified connected Journey while private data and unpublished content remain isolated. Tests are organized by risk, not by a target percentage alone.

## Test layers

| Layer | Primary scope | Representative contracts |
| --- | --- | --- |
| Static and content validation | Repository artifacts | JavaScript conventions, schemas, keys, references, media, verification, graph integrity. |
| Unit | Pure domain modules | Access resolution, progress calculation, resume fallback, search normalization, publication planning. |
| Integration | Next.js server + PostgreSQL/Supabase | Auth session use, progress transactions, RLS, search SQL, publishing idempotency. |
| Component | Interactive React behavior | Guide navigation, Quick/Learn, focus, hotspot keyboard behavior, diagram selection, failure states. |
| End-to-end | Real browser and deployed-like stack | Sign-in through resume, Cockpit Explorer cross-links, responsive critical journeys. |
| Visual and accessibility | Approved screens and viewports | Layout regression, contrast, focus, semantics, zoom, touch targets. |

Tests and test artifacts use plain JavaScript unless a third-party generated artifact requires otherwise.

## Content validation suite

Every content change runs parse, schema, key uniqueness, reference, implementation-scope, graph, order, media, hotspot, source, verification, access-inheritance, and publication-state checks. Include fixtures for every failure category and assert actionable file/key diagnostics.

The suite must prove the 14 canonical Journey sections in approved order without asserting placeholder step counts. Illustrative aircraft-system statements from design files are never golden production fixtures.

## Domain unit tests

Highest-priority units:

- Step completion, skipping, Procedure/Journey completion, and percentages.
- Resume selection and archived-content fallback.
- Access decisions across publication, audience, commercial class, and ownership.
- Stable key normalization and duplicate detection.
- Search normalization and deterministic ranking.
- Content revision compatibility classification and publication diff plans.
- Hotspot normalized-bound and target rules.

Use fixed clocks and deterministic IDs/hashes where time or identity affects assertions.

## Database and RLS matrix

For every exposed table, test anonymous, User A, User B, and privileged publisher roles as relevant. Required negative cases include:

- User A cannot select, insert, update, or delete User B progress.
- A forged `user_id` cannot pass write checks.
- Anonymous actors cannot access authenticated records.
- Draft, review, verified-but-unpublished, and archived content are unavailable to runtime roles.
- Published public versus authenticated content follows policy.
- Privileged publishing cannot be reached with a normal session.

Run tests against a real PostgreSQL/Supabase-compatible local or isolated test environment; mocks do not prove RLS.

## Integration tests

- Authenticated server rendering and session refresh.
- Atomic and idempotent progress mutation, including retry and stale-tab handling.
- Publication dry run, transaction rollback on error, stable UUID preservation, and cache-invalidation intent.
- Search scoping, access filtering, ranking, and navigation resolution.
- Media reference validation and missing-object failure.
- Content revision with existing progress.

Each test owns or isolates its data and must not depend on execution order.

## Component and interaction tests

Test behavior rather than implementation details:

- `Done — Next`, Previous, Skip, section completion, and save-failure recovery.
- Quick/Learn and Focus Mode preserve the same step and progress.
- Cockpit View zoom/pan controls, semantic hotspot selection, and `Guide me there` hierarchy.
- Aircraft System node selection changes explanation without implying live state.
- Loading, empty, unauthenticated, unavailable, image-failure, and network-error states.

## Critical end-to-end journey

```text
Create or sign in to an account
→ open Boeing 737 MAX 8 Aircraft Page
→ start Cold & Dark → Takeoff
→ complete and skip representative steps
→ open a related control and return to the same step
→ open Electrical learning and return
→ close/sign out
→ sign in again
→ Continue Learning resumes the exact valid position
```

Use authored test fixtures labeled as fixtures, not claimed aircraft truth.

## Responsive and accessibility coverage

At minimum exercise wide desktop, iPad/tablet landscape and portrait, mobile, and the 400–550 px Guide Mode companion range. Verify no horizontal scroll in the companion layout, usable touch targets, browser zoom, keyboard order, visible focus, semantic controls, accessible names, non-color-only states, reduced motion where applicable, and textual alternatives for visual relationships.

Automated checks are necessary but not sufficient. Manually review image hotspots and system relationships on representative devices/viewports.

## Performance checks

Set implementation-time budgets after a first production-shaped vertical slice. Measure Guide Mode usable render, current and next image loading, responsive variant selection, Cockpit Explorer interaction, search latency, and database query plans. Do not choose arbitrary budgets before representative assets exist.

## Release gates

- All required validation, unit, integration, RLS, build, and critical end-to-end tests pass.
- No unresolved high-severity security or accessibility defect.
- Staging publication and media checks pass.
- Manual smoke confirms authentication, Guide Mode, cross-link return, save, and resume.
- Approved designs are visually compared without treating their placeholder content as assertions.

## Intentionally deferred

Billing, entitlement-provider, simulator telemetry, multi-aircraft scale, and worker tests are added when those capabilities are approved. Future readiness does not justify empty test scaffolding now.
