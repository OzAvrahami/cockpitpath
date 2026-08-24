# Phase 4 — Guide Mode

**Status:** ⬜ Planned

## Goal

Implement CockpitPath's first major user-facing learning experience for the verified vertical slice.

## Why Now

Guide Mode is the core product hypothesis. It follows content and progress so its first implementation can render real connected learning data and persist genuine user state rather than operate as a static mock.

## Deliverables

- Procedure rendering.
- Procedure Step rendering.
- Quick and Learn information-density modes.
- Expected Result presentation without implying simulator telemetry verification.
- Dynamic cockpit imagery.
- Dynamic hotspot overlays.
- Dominant `Done — Next` interaction and permitted Skip behavior.
- Progress, autosave, and resume integration.
- Focus Mode.
- First-class narrow simulator-companion layout.
- iPad/tablet behavior.
- Responsive wide-desktop and companion-window behavior.

Implementation must follow the existing [Guide Mode UX](../ux/guide-mode.md) and [locked Guide Mode design direction](../design/guide-mode-direction.md). Those documents remain the source of truth for detailed interaction and visual behavior and are not duplicated here.

## Exit Criteria

- A user can complete the vertical-slice Procedure through the intended Quick/Learn flow.
- Procedure instructions, expected results, imagery, and hotspots resolve from published content.
- Done, Next, Skip, progress save, and resume behavior work together correctly.
- Focus Mode and primary navigation remain usable on wide desktop, iPad/tablet, and the defined narrow companion range.
- The experience does not imply automatic simulator-state verification.
- Accessibility checks for the experience pass.

## Dependencies

Phases 2 and 3.

## Relevant Commit(s)

Not started

[← Previous Phase — Learning State & Progress](phase-3-progress.md) · [↑ Implementation Dashboard](README.md) · [→ Next Phase — Cockpit Explorer](phase-5-cockpit-explorer.md)
