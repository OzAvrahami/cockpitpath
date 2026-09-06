# Phase 4 — Guide Mode

**Status:** ✅ Complete

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

## Completed Implementation

The committed checkpoint implements the authenticated published-content route, action-first layout, Quick/Learn density, Expected Result confirmation, normalized dynamic hotspots, Done/Next, permitted Skip, autosave, exact resume, Focus Mode, missing-content/media states, and responsive companion-window behavior. The complete service chain was verified with synthetic test-only content because no verified operational aircraft procedure or approved cockpit media is currently available.

[ADR-0013 — Aircraft and Implementation Route Scopes](../decisions/ADR-0013-aircraft-and-implementation-route-scopes.md) defines the canonical aircraft-scoped Guide routes and shared aircraft-level Guide content. The currently implemented `/learn/[journeySlug]` and `/learn/[journeySlug]/[procedureSlug]` routes remain compatibility routes until the required schema, query, progress, link, and safe-redirect migration is completed before canonical content publication. Guide Mode continues to use its dedicated Focus Mode chrome.

## Target-layout validation

**Status:** Local refinement, automated verification, and user-performed manual validation complete; commit and deployment verification pending
**GitHub:** [Issue #1 — Validate Guide Mode across target device layouts](https://github.com/OzAvrahami/cockpitpath/issues/1)

The refined Simulator Companion v2 direction remains the implementation target. The validation work preserves Guide Mode's dedicated Focus Mode chrome, content order, Quick/Learn state, progress persistence, step outcomes, and authentication boundary.

| Target layout | Verification performed | Result |
| --- | --- | --- |
| 1440 × 900 wide desktop | Two-column action/visual composition, persistent step navigation, scalable action type, and media canvas contract | Automated contracts passed; user manual review approved |
| 1280 × 720 laptop | Two-column minimum sizing, viewport-height behavior, readable action/expected-result hierarchy, and reachable navigation | Automated contracts passed; user manual review approved |
| 1024 × 768 tablet landscape | Compact two-column composition, touch-target sizing, and media containment | Automated contracts passed; user manual review approved |
| 768 × 1024 tablet portrait | Single-column recomposition with action before visual, expected result, and learning detail | Automated contracts passed; user manual review approved |
| 400 × 900 mobile/companion | Compact stacked header, full-width primary action, two-column secondary navigation, safe-area padding, and horizontal-overflow containment | Automated contracts passed; user manual review approved |
| 480 × 900 narrow simulator companion | Refined v2 priority order, large primary action, stable deferred-media geometry, and no telemetry implication | Automated contracts passed; user manual review approved |

The audit found and corrected the following concrete gaps:

- Narrow header controls could shrink below the practical 44 px touch target; all Guide Mode header and navigation controls now retain touch-safe minimum heights.
- The three-column navigation footer was too rigid for narrow layouts and 200% reflow; the primary `Done — Next` action now occupies its own row below 550 px, with Previous and Skip in a separate row.
- Completed and skipped steps shared the same visual treatment; skipped, completed, and current segments now use distinct shapes/borders as well as color, while the progressbar exposes completion and current-step text to assistive technology.
- Successful step changes did not deliberately move focus to the new instruction, and Escape did not restore focus when used from a control; the current action heading now receives predictable programmatic focus after navigation, and Escape returns focus to the Focus Mode toggle.
- A contained image could letterbox independently of its hotspot overlay; available media now uses its recorded pixel dimensions for a shared responsive image/hotspot canvas.
- Direct server-rendered learning routes did not retain their own safe return destination when authentication was absent; both journey and procedure routes now use the existing validated sign-in-path contract as defense in depth.
- Long action, expected-result, explanation, and caption content now wraps safely, and the shell uses dynamic viewport height, horizontal clipping, and device safe-area insets.

Automated coverage verifies Guide Mode rendering, Quick/Learn hierarchy, required Skip behavior, completed/skipped/current progress semantics, normalized hotspot geometry, deferred-media behavior, responsive CSS contracts, focus restoration, server-session protection, and safe learning-route return destinations. Keyboard shortcuts continue to ignore interactive content; Escape exits Focus Mode; visible focus styling and reduced-motion behavior reuse the existing shared foundation.

Verified iFly 737 MAX 8 captures remain deferred under Issue #2. Their eventual integration must supply reviewed responsive crops or coordinate-preserving variants, attribution/provenance and verification metadata, and hotspot calibration against the final pixels. Until then, Guide Mode keeps an explicit unavailable-media state and never presents design placeholders as aircraft evidence.

Automated browser control was unavailable during this work and is not claimed. The user performed the manual visual and interaction review across the target layouts and approved the result, including the responsive composition and Guide Mode controls. Issue #1 remains In Progress until the implementation is committed, pushed, and verified on the Railway deployment.

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

`09485cc` — `feat: implement learning progress and Guide Mode`

[← Previous Phase — Learning State & Progress](phase-3-progress.md) · [↑ Implementation Dashboard](README.md) · [→ Next Phase — Cockpit Explorer](phase-5-cockpit-explorer.md)
