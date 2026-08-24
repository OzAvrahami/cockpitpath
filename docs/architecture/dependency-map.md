# CockpitPath Architecture Dependency Map

**Status:** Accepted v0.1<br>
**Last updated:** 2026-08-24

This map identifies allowed dependencies and trust boundaries. It complements the deployment topology in [overview.md](overview.md); boxes are modules or managed platforms, not microservices.

```mermaid
flowchart TB
    Browser["Browser<br/>Server-rendered UI + interactive React"]
    Web["Next.js App Router on Railway<br/>Server Components · Actions · Route Handlers"]
    Domain["Server-only domain modules<br/>progress · access · search · content relationships"]
    Auth[Neon Auth]
    UserData[User-owned data access]
    DataAPI[Neon Data API]
    RLS["PostgreSQL RLS<br/>auth.user_id()"]
    ContentData[Published-content data access]
    DB[("Neon Postgres<br/>private + published data")]
    Media[Media delivery module]
    R2[(Cloudflare R2)]
    Author[Repository authoring files]
    Publish[Validation and publishing command]
    Admin[Migration / necessary administration]

    Browser -->|HTTPS| Web
    Web -->|session operations| Auth
    Web --> Domain
    Domain --> UserData
    UserData -->|verified Neon Auth JWT| DataAPI
    DataAPI -->|authenticated role| RLS
    RLS -->|private rows| DB
    Domain --> ContentData
    ContentData -->|direct PostgreSQL read role| DB
    Domain --> Media
    Media --> R2
    Author --> Publish
    Publish -->|direct PostgreSQL publishing role| DB
    Publish -->|verify referenced objects| R2
    Admin -->|owner only where required| DB
```

## Dependency rules

- Presentation may depend on domain interfaces, not directly on privileged credentials.
- Domain modules may depend on validation and data-access interfaces, not React components.
- Browser requests cross the Next.js boundary; Data API browser capability does not make the browser CockpitPath's authorization boundary.
- User progress reads and mutations pass through server/domain authorization, then the Data API with a verified Neon Auth JWT, and are also constrained by PostgreSQL RLS.
- Published learning content is read through server-only direct PostgreSQL access using a dedicated least-privileged read role.
- The publishing command is a server-only administrative path with its own narrowly privileged PostgreSQL role, not a public runtime endpoint.
- The database owner and any `BYPASSRLS` role are reserved for migrations or necessary administration and are not normal runtime credentials.
- R2 stores binaries; PostgreSQL stores media identity, metadata, and relationships.
- No reverse dependency from authored content to UI modules is allowed.

Phase 1B.2 selected this boundary after a successful real Neon Auth-to-RLS proof. See [ADR-0012](../decisions/ADR-0012-user-scoped-data-api-and-server-postgres-access.md).

## v0.1 versus future-ready

The solid architecture above is required for v0.1. Future billing, protected-media signing, workers, and simulator integration may attach to domain boundaries later; none is deployed or required now.
