# CockpitPath Documentation

**Status:** Foundation v0.1<br>
**Last updated:** 2026-09-03

This directory is the documentation source of truth for CockpitPath product, UX, design, content, and architecture decisions. Repository documentation and project artifacts are written in English. CockpitPath v0.1 uses plain JavaScript; TypeScript is not a project requirement.

## Implementation

- [Implementation dashboard](implementation/README.md) — The current technical implementation status and execution sequence.

## Source-of-truth order

When documents appear to disagree, use this order and record the conflict rather than silently merging it:

1. Product scope and approved UX documents.
2. Locked design-direction documents.
3. Architecture decisions (ADRs) and architecture contracts.
4. Content authoring and verification policies.
5. Design briefs and design-component HTML references.

Design-component HTML files demonstrate layout and interaction only. Their step counts, version numbers, verification dates, and aircraft-system descriptions are placeholders unless separately verified through the content workflow.

## Product and UX

- [Product vision](product/vision.md)
- [MVP v0.1](product/mvp-v0.1.md)
- [Target users](product/target-users.md)
- [Roadmap](product/roadmap.md)
- [Pricing and access strategy](product/pricing-strategy.md)
- [Guide Mode UX](ux/guide-mode.md)
- [Cockpit Explorer UX](ux/cockpit-explorer.md)
- [Aircraft Systems UX](ux/aircraft-systems.md)
- [Locked Guide Mode direction](design/guide-mode-direction.md)
- [Public site and application shell handoff](design/public-site-shell-handoff.md)

## Architecture

- [Architecture overview](architecture/overview.md)
- [Dependency map](architecture/dependency-map.md)
- [Data model](architecture/data-model.md)
- [Authentication](architecture/authentication.md)
- [Content system](architecture/content-system.md)
- [Media assets](architecture/media-assets.md)
- [Access control](architecture/access-control.md)
- [Progress model](architecture/progress-model.md)
- [Search](architecture/search.md)
- [Deployment](architecture/deployment.md)
- [Security](architecture/security.md)
- [Testing strategy](architecture/testing-strategy.md)

## Content

- [Authoring guide](content/authoring-guide.md)
- [Content key conventions](content/content-key-conventions.md)
- [Aircraft structure](content/aircraft-structure.md)
- [Procedure format](content/procedure-format.md)
- [Cockpit content model](content/cockpit-content-model.md)
- [System content model](content/system-content-model.md)
- [Image guidelines](content/image-guidelines.md)
- [Hotspot guidelines](content/hotspot-guidelines.md)
- [Source policy](content/source-policy.md)
- [Verification policy](content/verification-policy.md)
- [Publishing workflow](content/publishing-workflow.md)
- [Glossary](glossary.md)

## Architecture decisions

ADRs record both the accepted v0.1 baseline and later supersessions. A new ADR supersedes an accepted decision; existing history is not rewritten silently.

- [ADR-0001 — Web-First Next.js Application](decisions/ADR-0001-web-first-nextjs-application.md)
- [ADR-0002 — Plain JavaScript Application](decisions/ADR-0002-plain-javascript-application.md)
- [ADR-0003 — PostgreSQL and Supabase Platform (superseded)](decisions/ADR-0003-postgresql-and-supabase-platform.md)
- [ADR-0004 — Cloudflare R2 for Learning Media](decisions/ADR-0004-cloudflare-r2-for-learning-media.md)
- [ADR-0005 — Structured Content Separate from UI](decisions/ADR-0005-structured-content-separate-from-ui.md)
- [ADR-0006 — Single Application / No Separate Backend](decisions/ADR-0006-single-application-no-separate-backend.md)
- [ADR-0007 — Database-Level RLS](decisions/ADR-0007-database-level-rls.md)
- [ADR-0008 — Entitlement-Ready Access Model](decisions/ADR-0008-entitlement-ready-access-model.md)
- [ADR-0009 — Dynamic Hotspots over Base Images](decisions/ADR-0009-dynamic-hotspots-over-base-images.md)
- [ADR-0010 — Repository-Based Content Authoring](decisions/ADR-0010-repository-based-content-authoring.md)
- [ADR-0011 — Neon Postgres and Neon Auth Platform](decisions/ADR-0011-neon-postgres-and-neon-auth-platform.md)
- [ADR-0012 — User-Scoped Data API and Server PostgreSQL Access](decisions/ADR-0012-user-scoped-data-api-and-server-postgres-access.md)

## Scope boundaries

v0.1 is one Next.js App Router application, written in JavaScript, deployed on Railway, with Neon Postgres and Neon Auth plus Cloudflare R2 media. It has no separate API server, Redis, microservices, GraphQL server, custom CMS, billing implementation, or simulator telemetry.

The content model remains ready for additional aircraft and future `FREE`, `PRO`, and `PACK` access without implementing speculative infrastructure now.

`ContentRecord.status` is the sole canonical editorial lifecycle state. Other domain state must use a distinct, explicitly named field and enum, such as `availability`, `support_status`, `progress_status`, or `verification_status`; it must not duplicate `DRAFT`, `REVIEW`, `VERIFIED`, `PUBLISHED`, or `ARCHIVED`.

## Known documentation conflicts

- Current project direction marks Aircraft Page, Cockpit Explorer, and Aircraft Systems as approved, while their checked-in folders/briefs still use exploration or initial-design language. Treat the designs as approved; the repository labels are stale until their approval metadata is updated.
- Some design HTML renders illustrative step counts, technical explanations, add-on versions, and verification dates. They are explicitly non-authoritative and must not enter published content.
