# ADR-0006 — Single Application / No Separate Backend

## Status

Accepted — 2026-08-24

## Context

v0.1 requires server rendering, authentication, progress mutations, content reads, search, and publication tooling but has no public API, long-running processing, or telemetry service requirement.

## Decision

Use one repository and one primary Next.js application. Server Components, Server Actions, Route Handlers, and server-only domain/data modules form the application backend boundary. Do not create a separate API server for v0.1.

## Consequences

- Deployment, session handling, and development remain simple.
- Presentation, domain, and persistence boundaries still exist as modules and remain independently testable.
- A future worker or service requires a new demonstrated need and architectural decision.
- Public REST endpoints are created only when an operation needs them, not for appearance.

## Alternatives Considered

- Separate Express or NestJS API: rejected because it adds deployment and contract overhead without a current requirement.
- Microservices: rejected as speculative and mismatched to v0.1 scale.
- GraphQL server: rejected because CockpitPath has no need for a separate general-purpose query boundary.
