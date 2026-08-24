# ADR-0005 — Structured Content Separate from UI

## Status

Accepted — 2026-08-24

## Context

The same Procedures, Controls, Systems, Concepts, and imagery power multiple experiences and must be maintained, verified, versioned, and extended to future Aircraft Implementations.

## Decision

Represent learning content as structured domain entities and relationships outside React components. UI code renders the connected learning graph and may adapt presentation by viewport or product area, but must not own permanent aircraft content.

## Consequences

- Guide Mode, Cockpit Explorer, Aircraft Systems, and Aircraft Page reuse canonical identities.
- Content requires schemas, reference validation, publication, and revision policy.
- UI implementation cannot take placeholder design copy as production data.
- Localization and multi-aircraft expansion remain possible without duplicating screens.

## Alternatives Considered

- Hard-code content into components: rejected because it duplicates facts and couples updates to application releases.
- Independent feature-specific content files: rejected because they would fragment the learning graph.
- Custom CMS as the initial source: rejected as unnecessary v0.1 infrastructure; authoring source is decided in ADR-0010.
