# Phase 0 — Product, UX, Design & Architecture Foundation

**Status:** ✅ Complete

## Goal

Establish an approved product and technical foundation detailed enough to begin implementation without relying on major unresolved assumptions.

## Why This Phase Exists

Product scope, interaction behavior, content trust, and system boundaries had to be defined before application or platform choices could be implemented safely. This phase prevents product behavior and core architecture from being invented piecemeal in application code.

## Deliverables

### Product foundation

- [Product vision](../product/vision.md)
- [MVP v0.1 definition](../product/mvp-v0.1.md)
- [Target users](../product/target-users.md)
- [Product roadmap](../product/roadmap.md)
- [Pricing and access strategy](../product/pricing-strategy.md)

### UX and design foundation

- [Guide Mode UX](../ux/guide-mode.md)
- [Cockpit Explorer UX](../ux/cockpit-explorer.md)
- [Aircraft Systems UX](../ux/aircraft-systems.md)
- Approved core designs, including the [locked Guide Mode design direction](../design/guide-mode-direction.md)

The detailed UX and design sources remain authoritative; this phase document does not duplicate them.

### Technical and content foundation

- [Architecture overview](../architecture/overview.md)
- [Conceptual data model](../architecture/data-model.md)
- [Content architecture](../architecture/content-system.md) and authoring/verification policies
- Security, authentication, deployment, progress, search, and testing baselines
- [ADR foundation](../README.md#architecture-decisions) for the major v0.1 technical decisions

## Exit Criteria

- v0.1 product scope and target users are explicit.
- Core UX behavior and design direction are approved.
- Architecture, data relationships, content ownership, and verification policy are documented.
- Major technical decisions are captured in ADRs.
- The repository is ready for an application scaffold without inventing product behavior in code.

## Dependencies

None. This is the implementation foundation.

## Relevant Commit(s)

`0520323` — `docs: establish CockpitPath product and architecture foundation`

[↑ Implementation Dashboard](README.md) · [→ Next Phase — Platform Foundation](phase-1-platform.md)
