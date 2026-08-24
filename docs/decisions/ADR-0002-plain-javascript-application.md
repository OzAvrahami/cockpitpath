# ADR-0002 — Plain JavaScript Application

## Status

Accepted — 2026-08-24

## Context

CockpitPath needs reliable contracts for structured content, progress, access, and media without making TypeScript a project requirement.

## Decision

Write application source and project tooling in plain JavaScript. Use runtime schema validation, database constraints, explicit domain boundaries, JSDoc where it materially clarifies a contract, and tests. Do not introduce TypeScript or require TypeScript compilation.

## Consequences

- JavaScript is consistent across the application and content tooling.
- Runtime validation is mandatory at trust boundaries; compile-time assumptions cannot replace it.
- Generated third-party files may use another format only when the generating tool requires it.
- Reviews must pay particular attention to domain shapes and error handling.

## Alternatives Considered

- TypeScript: deliberately not selected; it conflicts with the established project language policy.
- Untyped ad hoc JavaScript: rejected because the content graph and security-sensitive mutations require explicit runtime contracts.
