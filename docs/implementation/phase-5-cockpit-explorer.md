# Phase 5 — Cockpit Explorer

**Status:** ⬜ Planned

## Goal

Let users locate, inspect, and navigate relationships around the same cockpit controls used in Guide Mode.

## Why Now

Cockpit Explorer should reuse proven cockpit entities, views, hotspots, and Guide Mode links. It must not introduce a parallel or duplicate control catalog.

## Deliverables

- Cockpit hierarchy using CockpitArea and CockpitView.
- Shared Controls and Hotspots.
- Search aliases.
- Breadcrumbs and preserved navigation context.
- Control details.
- `Guide me there` location flow.
- Cross-links from control context to related Guide Mode content.

Cockpit Explorer explicitly reuses the same Control, CockpitArea, CockpitView, and Hotspot graph used by Guide Mode. Screen-specific copies of these entities are not part of the architecture.

Implementation details remain governed by the [Cockpit Explorer UX](../ux/cockpit-explorer.md) and its existing [design brief](../ai/claude-design/cockpit-explorer/design-brief.md).

## Exit Criteria

- A user can navigate or search to the vertical-slice Control.
- The Control's cockpit area, view, hotspot, aliases, and detail resolve from the shared content graph.
- `Guide me there` communicates where to look.
- Related Guide Mode links preserve useful context in both directions.
- Breadcrumbs and return navigation preserve user orientation.
- No duplicate Control, Cockpit, or Hotspot data model exists.

## Dependencies

Phases 2 and 4.

## Relevant Commit(s)

Not started

[← Previous Phase — Guide Mode](phase-4-guide-mode.md) · [↑ Implementation Dashboard](README.md) · [→ Next Phase — Aircraft Systems](phase-6-aircraft-systems.md)
