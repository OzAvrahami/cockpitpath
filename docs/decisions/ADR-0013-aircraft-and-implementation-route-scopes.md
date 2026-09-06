# ADR-0013 — Aircraft and Implementation Route Scopes

## Status

Accepted — 2026-09-06

Refines [ADR-0005 — Structured Content Separate from UI](ADR-0005-structured-content-separate-from-ui.md) and [ADR-0009 — Dynamic Hotspots over Base Images](ADR-0009-dynamic-hotspots-over-base-images.md). It does not supersede either decision.

## Context

CockpitPath connects Guide Mode, Cockpit Explorer, Aircraft Systems, and the Aircraft Page without duplicating their content. These experiences do not all have the same identity boundary.

An Aircraft such as the Boeing 737 MAX 8 owns the stable learning subject. A simulator/add-on combination such as the iFly Boeing 737 MAX 8 for Microsoft Flight Simulator 2024 is an Aircraft Implementation. Cockpit imagery, Cockpit Views, Hotspots, control bindings, simulator-specific behavior, and verified differences belong to that implementation rather than to the aircraft in general.

The earlier architecture showed route examples but explicitly deferred exact routing. The existing Guide routes omit aircraft identity, while the current content schema attaches Journey and Procedure records directly to an Aircraft Implementation. Canonical content is still unpublished, so the route and ownership migration must be defined before those URLs or records become public contracts.

## Decision

Use aircraft-scoped routes for the Aircraft Page, Guide Mode, and Aircraft Systems. Use implementation-scoped routes for Cockpit Explorer.

| Experience | Canonical route | Scope |
| --- | --- | --- |
| Aircraft Page | `/app/aircraft/[aircraftSlug]` | Aircraft |
| Guide journey entry | `/learn/[aircraftSlug]/[journeySlug]` | Aircraft and shared Journey |
| Guide procedure | `/learn/[aircraftSlug]/[journeySlug]/[procedureSlug]` | Aircraft and shared Procedure |
| Cockpit Explorer | `/app/cockpit/[implementationSlug]` | Aircraft Implementation |
| Aircraft Systems index | `/app/systems/[aircraftSlug]` | Aircraft |
| Aircraft System detail | `/app/systems/[aircraftSlug]/[systemSlug]` | Aircraft and shared Aircraft System |

`/app` remains the signed-in application home and `/account` remains the account destination. Aircraft Page, Cockpit Explorer, and Aircraft Systems belong to the authenticated `/app` namespace and render inside the shared Application Shell. Guide Mode remains under `/learn`, retains its dedicated Focus Mode chrome, and is not wrapped in the Application Shell. Public-site routes and same-page marketing navigation remain distinct from authenticated application routes.

For the initial supported product, the canonical Aircraft slug is `boeing-737-max-8` and the canonical Aircraft Implementation slug is `ifly-737-max-8-msfs-2024`.

### Guide content ownership

Journey, Procedure, Procedure Step order, and the default instructional meaning are shared at the Aircraft level. They describe the aircraft learning path and must not be copied wholesale for every simulator or add-on implementation.

An implementation binding supplies only the verified implementation-specific material needed to render or adapt that shared guide, including:

- Controls and their Cockpit Area bindings;
- Cockpit Views, media, and Hotspots;
- simulator/add-on behavior notes;
- implementation-specific expected-result or action differences; and
- narrow field-level overrides where the shared instruction is not accurate for that implementation.

Runtime composition resolves the shared aircraft-level guide plus the selected Aircraft Implementation binding. A narrow override replaces only its declared field; all other guide content continues to inherit from the aircraft-level record. Required bindings fail closed when they are missing or unpublished.

Complete Journey or Procedure duplication is prohibited merely because another simulator or add-on implementation is supported. A separate complete guide is justified only when the underlying aircraft procedure is materially different and requires its own reviewed identity, not as a shortcut for implementation-specific media, hotspots, or small behavioral differences.

### Explorer state and cross-links

Cockpit Explorer uses `[implementationSlug]` because its hierarchy, Control identities, Views, media, and Hotspots are implementation-specific. Area, view, control, and search selection are derived from the published graph; query or client state may preserve a selected entity, but must not become a second content identity system.

Guide-to-Explorer links use `/app/cockpit/[implementationSlug]` and resolve the selected Control/View/Hotspot from the graph. Explorer-to-Guide links return to the aircraft-scoped `/learn` URL and preserve only validated internal navigation context.

## Migration

Before canonical Guide content is published:

1. Migrate the content schema and publication contract so shared Journey, Procedure, Procedure Step, and Aircraft System ownership is aircraft-scoped, with explicit Aircraft Implementation bindings and narrow overrides.
2. Migrate runtime queries, progress resolution, links, authentication return destinations, and tests to the canonical aircraft-scoped Guide routes.
3. Add backward-compatible redirects:
   - `/learn/[journeySlug]` → `/learn/[aircraftSlug]/[journeySlug]`
   - `/learn/[journeySlug]/[procedureSlug]` → `/learn/[aircraftSlug]/[journeySlug]/[procedureSlug]`
4. Resolve the destination through published relationships rather than a hard-coded aircraft map. If the legacy slug is absent or ambiguous, fail safely instead of guessing.
5. Preserve validated query context and safe internal `returnTo` behavior through redirects. Never permit an external redirect.
6. Update every application-shell, progress, Guide Mode, and cross-feature caller before removing the legacy route handlers.

The redirects remain compatibility routes, not alternate canonical URLs. Their removal requires evidence that saved links and supported clients no longer depend on them.

## Consequences

- Aircraft learning URLs remain stable across simulator and add-on implementations.
- Cockpit Explorer URLs identify the exact implementation whose imagery and hotspots are rendered.
- A new implementation can reuse verified aircraft-level guides and systems while contributing only its verified bindings and differences.
- Content validation must distinguish shared aircraft truth from implementation-specific presentation and behavior.
- Progress identities must survive route migration and must not be duplicated per implementation unless product behavior explicitly requires implementation-specific progress.
- The existing Guide routes require a deliberate compatibility migration before canonical publication.
- The authenticated product surfaces share the `/app` namespace and Application Shell, while Guide Mode remains isolated under `/learn` with Focus Mode chrome.

## Alternatives Considered

- Scope every route and guide to Aircraft Implementation: rejected because it would encourage duplicate complete guides and make aircraft-level learning URLs unstable across simulator/add-on choices.
- Scope Cockpit Explorer only to Aircraft: rejected because an aircraft slug cannot identify the correct simulator capture, Cockpit View, Hotspot calibration, or implementation-specific Control binding.
- Put Guide Mode below `/app`: rejected because Guide Mode intentionally retains separate Focus Mode chrome rather than inheriting the Application Shell used by Aircraft Page, Cockpit Explorer, and Aircraft Systems.
- Keep the existing Guide routes without aircraft identity: rejected because Journey and Procedure slugs are not a sufficient long-term cross-aircraft namespace and cannot express the approved aircraft-level ownership contract.
