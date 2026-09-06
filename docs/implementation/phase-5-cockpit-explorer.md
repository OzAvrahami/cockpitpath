# Phase 5 — Cockpit Explorer

**Status:** ▶ In progress — local implementation and user-performed manual review approved; commit and deployment verification pending

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

The canonical protected entry route is `/app/cockpit/[implementationSlug]`. It belongs to the authenticated Application Shell namespace and is implementation-scoped because the selected simulator/add-on implementation owns the cockpit hierarchy, Controls, Views, media, and Hotspots. For the initial vertical slice, the route is `/app/cockpit/ifly-737-max-8-msfs-2024`. Route and shared-content ownership follow [ADR-0013 — Aircraft and Implementation Route Scopes](../decisions/ADR-0013-aircraft-and-implementation-route-scopes.md).

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

## Local Implementation Snapshot

Issue [#3 — Implement the Phase 5 Cockpit Explorer vertical slice](https://github.com/OzAvrahami/cockpitpath/issues/3) now has a local implementation at `/app/cockpit/[implementationSlug]`. The initial supported entry is `/app/cockpit/ifly-737-max-8-msfs-2024`.

The protected route runs inside Application Shell v1 and loads the implementation, hierarchy, views, media metadata, hotspots, controls, systems, concepts, and related procedures only through `cockpitpath_published`. The interface provides hierarchy navigation, view selection, content-backed control search, breadcrumbs, control detail, a `Guide me there` orientation path, and contextual links between Explorer and the existing Guide Mode compatibility routes. Explorer navigation context is retained in the URL. The Application Shell now marks Explorer as the current destination and exposes the real route from both the shared navigation and application home.

When the supported implementation has no published Explorer graph, the page states that published content is not available. Missing hierarchy and provider failures have separate truthful states. Unknown implementation slugs return not found. No canonical, synthetic, or production content is published by this implementation.

Verified iFly 737 MAX 8 cockpit captures remain deferred under Issue #2. The media surface retains stable responsive geometry and renders the Hotspot layer separately from image pixels; no placeholder is presented as authoritative aircraft media. Repository-owned synthetic content may be installed on the isolated development database under `/app/cockpit/synthetic-wp2` for manual review, then removed with the existing fixture cleanup command. It must not be published under canonical URLs or installed on staging or production.

Automated component and contract verification covers the published-content loader, hierarchy, search metadata, area/view/control resolution, normalized hotspot geometry, deferred media, route states, Application Shell current-page state, safe authentication return paths, and Guide Mode return context. Automated browser control was unavailable, so the user performed and approved the manual visual and interaction review at the target layouts. That review used the repository-owned synthetic fixture under `/app/cockpit/synthetic-wp2` on the isolated Neon development database; the fixture, its publication and source metadata, fixture-linked progress, and temporary verification users were cleaned afterward. Canonical iFly content remains unpublished, and no staging or production data was accessed or changed during the review or cleanup.

Verified iFly 737 MAX 8 cockpit imagery remains deferred under Issue #2 and does not block the structural Explorer implementation. Issue #3 remains in progress until this implementation is committed and the matching Railway deployment is verified.

## Relevant Commit(s)

Local implementation pending commit and deployment verification

[← Previous Phase — Guide Mode](phase-4-guide-mode.md) · [↑ Implementation Dashboard](README.md) · [→ Next Phase — Aircraft Systems](phase-6-aircraft-systems.md)
