# Phase 7 — Aircraft Page

**Status:** ⬜ Planned

## Goal

Assemble the supported aircraft's useful entry and return experience from working underlying capabilities.

## Why Now

The Aircraft Page is an aggregating surface. It follows Guide Mode, Cockpit Explorer, Aircraft Systems, and progress so it can present real destinations and state rather than become a disconnected static mock.

## Deliverables

- Continue Learning.
- Journey overview.
- Procedure library.
- Cockpit Explorer entry.
- Aircraft Systems entry.
- Progress summary.

The canonical protected route is `/app/aircraft/[aircraftSlug]`; for the initial supported aircraft it is `/app/aircraft/boeing-737-max-8`. It belongs to the authenticated Application Shell namespace. The Aircraft Page is aircraft-scoped and links to the implementation-scoped Cockpit Explorer selected for the active simulator/add-on context. Route and ownership rules follow [ADR-0013 — Aircraft and Implementation Route Scopes](../decisions/ADR-0013-aircraft-and-implementation-route-scopes.md).

## Exit Criteria

- The page derives its state from published content and authenticated progress.
- Continue Learning restores the correct learning context.
- Every exposed entry opens a functioning underlying experience.
- Unavailable content is represented honestly.
- Responsive and accessible navigation checks pass.

## Dependencies

Phases 3–6.

## Relevant Commit(s)

Not started

[← Previous Phase — Aircraft Systems](phase-6-aircraft-systems.md) · [↑ Implementation Dashboard](README.md) · [→ Next Phase — Content Expansion](phase-8-content-expansion.md)
