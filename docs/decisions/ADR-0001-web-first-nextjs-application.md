# ADR-0001 — Web-First Next.js Application

## Status

Accepted — 2026-08-24

## Context

CockpitPath must work on desktop, a second monitor, iPad/tablet, mobile, and a 400–550 px simulator-companion window. v0.1 must validate the learning experience before investing in native clients.

## Decision

Build v0.1 as a responsive Next.js App Router application using React. Public pages and the authenticated learning application live in the same web product. Use server rendering where appropriate and Client Components only for browser interaction.

## Consequences

- One implementation reaches all required device classes.
- Guide Mode must treat the narrow companion layout and tablet as first-class behavior.
- Native platform integration and offline-native features are deferred.
- Application behavior must account for server/client boundaries and private versus cacheable data.

## Alternatives Considered

- Native iOS/Android applications: rejected for v0.1 because they multiply implementation and release effort.
- Desktop application: rejected because the core value does not require a packaged client.
- Generic client-rendered SPA: not selected because Next.js server rendering and a unified public/application routing model better fit the product.
