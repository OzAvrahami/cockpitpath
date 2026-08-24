# ADR-0008 — Entitlement-Ready Access Model

## Status

Accepted — 2026-08-24

## Context

v0.1 beta is free, but future product policy may include `FREE`, `PRO`, and aircraft/content `PACK` access. Building billing now would distract from product validation, while equating authentication with permanent access would create future coupling.

## Decision

Separate authentication, publication, audience, commercial access class, entitlement, billing, and progress. Centralize server access decisions and support inheritable `FREE`, `PRO`, `PACK`, and `INHERIT` classifications in the content/access model. Implement no billing or paid checkout in v0.1.

## Consequences

- All released v0.1 learning content can resolve to `FREE` without removing the future policy seam.
- Progress survives entitlement changes.
- UI cannot use scattered `isPro` checks as authority.
- Future billing may issue entitlements without becoming the content or progress model.
- Some schema/policy fields exist before paid behavior, but no speculative billing tables or provider integration are required.

## Alternatives Considered

- Treat every authenticated user as permanently authorized: rejected because it couples identity to content access.
- Implement billing immediately: rejected as out of v0.1 scope.
- Step-level paywalls: rejected because they damage Journey integrity and create excessive complexity.
