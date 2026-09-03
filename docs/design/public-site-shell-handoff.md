# CockpitPath — Public Site and Application Shell Handoff

**Status:** Current implementation handoff<br>
**Current visual target:** Public Site Visual Refinement v3<br>
**Supporting shell target:** Public Site and Shell Refined v2<br>
**Last audited:** 2026-09-03

## 1. Purpose

This document turns the existing public-site and application-shell design artifacts into an implementation reference. It does not authorize implementation, change product scope, or replace the approved product, UX, architecture, content, and Guide Mode contracts.

The target has two layers:

- [Public Site Visual Refinement v3](<refinements/public-site-shell-v3/Public Site Visual Refinement.dc.html>) is the latest public-site visual direction.
- [Public Site and Shell Refined v2](<refinements/public-site-shell-v2/Public Site and Shell Refined.dc.html>) remains the reference for public-header states, `/app`, authentication pages, and the signed-in application shell because v3 explicitly leaves those decisions unchanged and does not redraw their full state matrix.

The [Route & Fix v2 brand refinement](<brand/logo-v2/Route and Fix Refined.dc.html>) supplies the current mark. Guide Mode continues to follow the separately locked [Guide Mode direction](guide-mode-direction.md).

## 2. Source precedence and boundaries

Use the repository-wide [source-of-truth order](../README.md#source-of-truth-order). In particular:

1. Product scope and approved UX override the design artifacts.
2. Locked design-direction documents override exploratory visuals.
3. Architecture and ADRs control technical boundaries.
4. Content and media policies control what may be published as aircraft information.
5. The `.dc.html` files provide layout, composition, and interaction direction; they do not verify aircraft facts.

This handoff covers:

- the public marketing site at `/`;
- public and authenticated variants of the public header;
- the designed `/app` home;
- the shared shell around Aircraft Page, Cockpit Explorer, and Aircraft Systems;
- the visual treatment of existing authentication flows.

It does not redefine Guide Mode, aircraft content, access rules, authentication mechanics, progress behavior, media verification, or the implementation phase order. CockpitPath remains one web-first Next.js App Router application written in plain JavaScript, with server-enforced authentication and access boundaries. See the [architecture overview](../architecture/overview.md), [authentication contract](../architecture/authentication.md), [access-control contract](../architecture/access-control.md), [ADR-0001](../decisions/ADR-0001-web-first-nextjs-application.md), and [ADR-0002](../decisions/ADR-0002-plain-javascript-application.md).

## 3. Design audit and chronology

| Version | Role | Decisions established or refined |
| --- | --- | --- |
| [Public Site and Shell v1](<screens/public-site-shell-v1/Public Site and Shell.dc.html>) | First cohesive public-site and shell exploration | Established the dark public homepage, public navigation, auth views, a signed-in shell, responsive references, Fly / Find / Understand positioning, simulator-companion messaging, supported-aircraft presentation, and coming-soon states. Its flat card-heavy presentation and direct post-login aircraft entry were superseded. |
| [Route & Fix logo v1](<brand/logo-v1/Logo Directions.dc.html>) | Brand exploration | Compared three logo directions and recommended Route & Fix. |
| [Route & Fix logo v2](<brand/logo-v2/Route and Fix Refined.dc.html>) | Brand refinement | Refined Route & Fix into the current path, reference tick, filled learned fix, and outlined next fix. |
| [Public Site and Shell v2](<refinements/public-site-shell-v2/Public Site and Shell Refined.dc.html>) | Structural and visual refinement | Explicitly preserves the three-mode positioning, one-aircraft-first model, simple auth, and Route & Fix mark. Adds four dark surface levels, richer full-width product storytelling, persistent access to the public homepage when authenticated, a real `/app` home, and a distinct signed-in product shell. |
| [Public Site Visual Refinement v3](<refinements/public-site-shell-v3/Public Site Visual Refinement.dc.html>) | Latest visual refinement | Explicitly preserves v2 architecture, routes, `/app`, and Route & Fix. Rebuilds the public story around future real image slots, stronger cockpit imagery, composed product previews, Route & Fix geometry, and a genuinely recomposed 400 px layout. |

The current implementation target is therefore **v3 for the public page's visual composition, with v2 for the shell, app-home, auth, and unredrawn states**. v1 is historical context, not a parallel target.

### Preserved from earlier versions

- The promise: “Master the cockpit. One step at a time.”
- The one-supported-aircraft-first presentation: Boeing 737 MAX 8, iFly, Microsoft Flight Simulator 2024.
- The Fly / Find / Understand model and its connection to Guide Mode, Cockpit Explorer, and Aircraft Systems.
- A public homepage that explains the connected product before asking the user to enter it.
- Simple, form-first authentication.
- A compact signed-in product shell and separate Guide Mode chrome.
- Desktop, tablet, mobile, and narrow simulator-companion use as intentional contexts.
- Dark, low-glare surfaces, cyan focus/action color, restrained borders, and technical monospace metadata.

### Introduced or refined later

- v2 replaces the flat v1 sequence with four distinguishable dark surface levels and full visual feature treatments.
- v2 introduces `/app` so one supported aircraft does not appear as an empty library.
- v2 separates public navigation, app-home navigation, product-shell navigation, and Guide Mode Focus Mode.
- v3 makes approved future media the organizing element of every major public section rather than a decoration inside generic cards.
- v3 uses Route & Fix geometry across the hero, connected loop, header mark, and favicon.
- v3 recomposes the 400 px page instead of shrinking the desktop design.

## 4. Decision classification

### Locked design decisions

- Route & Fix is the brand mark. Its route line, origin/reference tick, upright filled fix, and upright outlined next fix must retain their meaning and orientation.
- The public page remains available to signed-in users; authentication changes its actions, not its public purpose.
- CockpitPath presents one supported aircraft first and must not render an empty multi-aircraft library.
- Fly, Find, and Understand are three connected views of the same learning graph, not independent products.
- Guide Mode uses its own Focus Mode chrome and does not carry the general application shell.
- Aircraft Page, Cockpit Explorer, and Aircraft Systems share the compact signed-in shell.
- The narrow simulator companion is a first-class presentation. It is side-by-side with the simulator and does not imply telemetry or simulator control.
- Production cockpit imagery is content, not decoration. Hotspots are dynamic overlays over clean base images.
- Real, verified aircraft content cannot be inferred from the examples rendered in the design artifacts.

### Implementation recommendations

These translate the design into maintainable UI but are not new product requirements:

- Define shared tokens for colors, type, spacing, radii, borders, shadows, and interaction states rather than copying inline artifact values.
- Build one accessible Route & Fix mark component with wordmark, mark-only, and favicon-sized variants.
- Build public and product navigation as separate components sharing identity primitives.
- Build public sections from reusable section-heading, media-slot, metadata, CTA, and product-preview primitives.
- Preserve source order in the DOM and use layout rules for desktop alternation; do not reorder content in a way that harms keyboard or screen-reader flow.
- Reserve image geometry with aspect-ratio containers to prevent layout shift when approved media replaces placeholders.
- Use progressive enhancement. The page's meaning and calls to action must not depend on animation, hover, or loaded background imagery.

### Placeholder content and temporary media

- Every `image-slot` in v3 is a placement and cropping requirement, not an approved asset.
- The striped `CockpitFrame` used by v2 is a capture-pending placeholder.
- Battery switch, electrical bus, step counts, progress values, procedure labels, system explanations, add-on versions, verification dates, and attribution shown inside design canvases are illustrative unless verified elsewhere in committed content.
- Initial implementation may use neutral placeholders or current approved synthetic content without changing section dimensions or hierarchy.
- Real iFly 737 MAX 8 cockpit captures are deferred. Their absence must not block the public shell structure, responsive implementation, accessibility work, or integration testing.

### Unresolved decisions requiring product approval

- **Successful sign-in destination:** v2 introduces `/app` and says sign-in lands there, while the current implementation redirects to `/account`; v2 also says an authenticated visit to `/` must remain on the public page. Confirm the migration rule and any return-to behavior before changing auth actions.
- **Feature route slugs:** architecture examples for Aircraft Page, Cockpit Explorer, and Aircraft Systems are conceptual. Confirm the final URLs before wiring public or app-shell CTAs.
- **Public navigation targets:** confirm whether “Aircraft” and “How it works” are homepage anchors, public routes, or a mix.
- **CTA behavior:** confirm the signed-out and signed-in destinations for “Start learning” and “Explore the 737 MAX,” including whether progress changes the destination.
- **Account menu:** avatar fallback, menu contents, and compact-navigation behavior are not fully specified by the artifacts.
- **Legal links:** Privacy and Terms appear in the visual design, but their routes and approved content are not defined here.
- **Tablet composition:** the intended behavior is clear, but v3 provides 1440 px and 400 px references rather than an exact tablet canvas. The intermediate layout needs implementation review rather than invented pixel matching.
- **Production media package:** exact capture list, aspect ratios, crop variants, attribution, source metadata, delivery breakpoints, and hotspot calibration await approved captures.
- **Motion:** Route & Fix paths imply visual continuity, but no required animation is specified. Motion should remain absent or minimal until explicitly approved.

## 5. Information architecture and routes

| Destination | Audience | Current/design state | Navigation context |
| --- | --- | --- | --- |
| `/` | Public and signed in | Existing route; v3 visual target | Public header. Signed-in visitors retain the public page with different right-side actions. |
| `/auth/sign-in` | Public | Existing route; v2 visual treatment | Focused auth layout with subtle cockpit context; form remains primary. |
| `/auth/sign-up` | Public | Existing route; v2 visual treatment | Focused auth layout. |
| `/auth/forgot-password` | Public | Existing route; v2 visual treatment | Focused auth layout. |
| `/auth/reset-password` | Public | Existing route; v2 visual treatment | Focused auth layout. |
| `/app` | Signed in | Designed in v2; not currently implemented | Compact app-home shell, showing the single supported aircraft and either no-progress or continue-learning state. |
| `/account` | Signed in | Existing protected route | Account destination; it is not a substitute for the designed app home. |
| `/learn/[journeySlug]` | Signed in | Existing protected resume/entry route | Resolves learning progress; not a general product-shell page. |
| `/learn/[journeySlug]/[procedureSlug]` | Signed in | Existing protected Guide Mode route | Guide Mode Focus Mode chrome only. |
| Aircraft Page | Signed in | Approved product area; exact route unresolved | Shared product shell. |
| Cockpit Explorer | Signed in | Current implementation phase; exact route unresolved | Shared product shell. |
| Aircraft Systems | Signed in | Planned product area; exact route unresolved | Shared product shell. |

Authentication, entitlement, progress, and publication checks remain server-enforced. Visual hiding is not access control.

## 6. Navigation model

### Public navigation

- Identity: Route & Fix mark plus CockpitPath wordmark.
- Primary context links: Aircraft and How it works.
- Signed-out actions: Sign in and Start learning.
- Signed-in actions: Continue Learning when progress exists, Open App, and the account control.
- The header stays a public-site header on `/`; do not replace it with the product shell merely because a session exists.
- At approximately 400 px, retain the identity and primary action, then expose secondary navigation through an accessible compact control. The exact menu presentation needs implementation review.

### Signed-in application navigation

- App home and product screens use a compact, product-facing shell rather than the public header.
- Desktop identity/context: CockpitPath, Aircraft, Continue Learning when available, and account.
- Narrow and mobile layouts collapse secondary controls without hiding the current context or account access.
- Guide Mode remains outside this shell so its action, image, expected result, and next-step control dominate the viewport.

## 7. Visual language

### Brand

- Use the Route & Fix mark consistently in public header, product shell, and favicon contexts.
- The filled upright triangle represents the learned/current fix; the outlined upright triangle represents the next fix. Do not rotate them to follow the line.
- The route motif may connect public content, but it must remain quiet and must not become an avionics display, map, or decorative tangle.

### Typography

- **Archivo**: interface, navigation, headings, body copy, and display text; weights 400–700 as needed.
- **IBM Plex Mono**: technical metadata, uppercase eyebrows, cockpit locations, procedure actions, compact state labels, and system/control identifiers; weights 400–600.
- Use monospace selectively. General body copy remains in the interface face for readability.
- The existing Guide Mode direction permits a separate educational face for longer explanation where appropriate; v3 does not require a serif face for the public shell.

### Color and surfaces

The artifact values should become semantic tokens. Small nearby variations may be consolidated only when contrast and visual hierarchy are preserved.

| Role | Reference values | Use |
| --- | --- | --- |
| Page | `#08090B` | Root public and application background. |
| Surface 1 | `#0B0D10` | Deep section or elevated card. |
| Surface 2 | `#0E1114` / `#0E1216` | Alternating public sections and technical panels. |
| Surface 3 | `#12171C` / `#151A1F` | Shell bar, nested panel, or control preview. |
| Border | `#15181C`, `#1A2126`, `#1C2126` | Quiet separators and container edges. |
| Emphasis border | `#17282B`, `#1C2E31`, `#3B767B` | Active/connected technical surfaces. |
| Primary text | `#F2F4F6` / `#FFFFFF` | Headings and essential copy. |
| Secondary text | `#D7DCE1` / `#C3CAD1` | Supporting copy. |
| Muted text | `#9AA3AC`, `#79838F`, `#6B7480`, `#5B6470` | Metadata with decreasing emphasis; each use must pass contrast requirements. |
| Accent | `#57E0E8` | Primary actions, focus, hotspots, and route fixes. |
| Accent hover | `#7DEAF0` | Pointer hover for primary actions. |
| Accent foreground | `#04191B` | Text/icons on cyan. |
| Technical accent text | `#8FB6BA` | Eyebrows and technical metadata. |

Do not treat the external canvas background, review labels, or canvas shadows as product UI.

### Spacing, surfaces, and borders

- Desktop public header: 64 px high with approximately 40 px horizontal inset.
- Desktop public content: approximately 40–48 px horizontal inset inside the 1440 px reference and 44–80 px section padding depending on hierarchy.
- Mobile public header: 54 px high with 16 px horizontal inset.
- Mobile page content: 18 px horizontal inset for primary public sections; auth forms may use approximately 26 px.
- App shell: approximately 56 px desktop and 50 px mobile.
- Public feature surfaces: usually 10–14 px corner radius; controls and nested panels: usually 6–8 px.
- Borders are generally 1 px; dynamic hotspots use a 2 px accent boundary.
- Shadows belong to true elevated previews or overlays, not every section.
- Preserve the four-level dark hierarchy from v2/v3. A flat black page divided into repeated generic cards is not the target.

### Interaction states

- Primary action: cyan fill, dark foreground, visible hover and focus states.
- Secondary action: quiet border and light text; strengthen border/text on hover and focus.
- Text navigation: muted at rest, primary text on hover/focus/current state.
- Disabled and unavailable states must remain legible and communicate their reason in text.
- Hotspots require keyboard focus, a visible focus ring, and a non-color cue for current/selected state.
- Do not use color as the sole state indicator.

## 8. Homepage hierarchy

Implement the public homepage in this order:

1. **Public header** — identity, context links, and session-appropriate actions.
2. **Hero** — core promise, short supporting copy, primary/secondary actions, cockpit-dominant image, and a small Guide Mode preview.
3. **Fly / Guide Mode** — action-first learning with a cockpit crop, dynamic hotspot, expected result, and next-step affordance.
4. **Find / Cockpit Explorer** — broad cockpit image, control hotspot, location path, and control summary.
5. **Understand / Aircraft Systems** — system relationship diagram paired with a tight control crop.
6. **Connected learning loop** — Fly, Find, and Understand connected with Route & Fix geometry and a return to the learner's step.
7. **Simulator companion** — simulator remains primary; CockpitPath sits beside it at a narrow width. Explicitly state that there is no telemetry connection.
8. **Supported aircraft** — one prominent Boeing 737 MAX 8 presentation with implementation and simulator metadata.
9. **Final call to action** — begin or continue the appropriate learning path.
10. **Compact footer** — product/auth links plus approved legal links when their routes and content exist.

v3 is a nine-piece review board rather than an exhaustive page-state matrix. Its omission of v2's final CTA/footer canvases does not remove them; v3 states that architecture is unchanged. Conversely, v1's standalone product-preview and beta sections should not be restored: later designs fold their purpose into the feature, supported-aircraft, and CTA sections.

## 9. Reusable sections and components

The implementation should be decomposable without turning every visual fragment into a public API.

| Primitive | Responsibility |
| --- | --- |
| Route & Fix identity | Mark, wordmark, monochrome/accent variants, accessible name, and favicon artwork. |
| Public header | Shared public links plus signed-out and signed-in action variants. |
| Product shell | Compact navigation for app home, Aircraft Page, Explorer, and Systems. |
| Auth frame | Identity, optional quiet cockpit context, form slot, feedback region, and secondary auth links. |
| Section heading | Eyebrow, heading, supporting text, and optional action. |
| Media slot | Stable aspect ratio, crop focal point, fallback/placeholder, credit metadata, and responsive source selection. |
| Cockpit preview | Base image plus separate hotspot overlay and non-authoritative preview label where required. |
| Guide preview | DO action, location, image, EXPECT result, and continuation control; it previews rather than reimplements Guide Mode. |
| Control preview | Cockpit location path, control name, hotspot, and route to Explorer when approved. |
| System preview | Concept nodes/edges paired with the related control crop. |
| Connected loop | Semantic links between procedure step, control, system, and return path; decorative route geometry is hidden from assistive technology. |
| Supported-aircraft feature | Aircraft name, implementation, simulator, availability/content state, approved media, and action. |
| App-home aircraft card | Single-aircraft entry with no-progress and continue-learning variants. |

## 10. Responsive behavior

### Wide desktop

- Treat 1440 px as the composition reference, not a fixed canvas.
- Keep cockpit imagery dominant in the hero and feature sections.
- Use split compositions where v3 shows text beside media; preserve comfortable reading measures.
- The floating Guide preview must not obscure the subject of the hero crop or essential text.
- Keep actions and current navigation immediately available without adding a dashboard sidebar.

### Tablet

- Collapse wide split sections before copy or imagery becomes cramped.
- Keep image focal points and hotspots correct after cropping.
- Support portrait and landscape without horizontal scrolling; landscape is the stronger simulator-companion/tablet reference.
- Use touch-sized controls and never rely on hover.
- Preserve the section order and connected narrative even when diagrams and previews stack.
- Because v3 has no exact tablet canvas, validate the intermediate composition against the design intent at implementation review.

### Approximately 400 px

- Recompose rather than scale the desktop page.
- Use a 54 px compact header with identity and an accessible navigation/action control.
- Hero order: metadata, headline, supporting line, meaningful portrait crop, then full-width actions.
- Stack Fly, Find, Understand, connected loop, companion, supported aircraft, CTA, and footer in desktop narrative order.
- Keep feature images meaningful at roughly 170 px in the shown Fly/Find previews; choose crops by subject, not by center-crop default.
- Use approximately 18 px page gutters, full-width 46–50 px primary actions, and no horizontal scrolling.
- The public 400 px layout is distinct from Guide Mode's 400–550 px companion layout, though both share touch and readability requirements.

## 11. Fly, Find, and Understand

- **Fly — Guide Mode:** tells the learner exactly what to do next, where to do it, what result to expect, and how to continue. The public preview follows DO → VISUAL → EXPECT, while the full experience follows the locked Guide Mode contract.
- **Find — Cockpit Explorer:** starts from visual location and lets the learner identify a control without already knowing its name. It connects location, control identity, related procedures, and related systems.
- **Understand — Aircraft Systems:** explains how the related components and concepts connect so procedures are understood rather than memorized.

The public page must show the relationship explicitly:

```text
procedure step → cockpit control → aircraft system → return to the learner's step
```

The visual loop is explanatory, not a new workflow or data model. The underlying relationships come from the approved content graph and published records.

## 12. Media and image-slot requirements

Follow [Media Assets](../architecture/media-assets.md), [Image Guidelines](../content/image-guidelines.md), [Hotspot Guidelines](../content/hotspot-guidelines.md), [Source Policy](../content/source-policy.md), and [Verification Policy](../content/verification-policy.md).

Each production media slot must support:

- a stable semantic slot identifier and intended subject;
- desktop, tablet, and narrow/mobile crop variants or focal-point metadata;
- intrinsic dimensions/aspect ratio to prevent layout shift;
- descriptive alternative text when the image conveys content, or empty alternative text when it is decorative;
- source, ownership/license, attribution, simulator, aircraft implementation, version, capture context, and verification metadata as required by content policy;
- separate hotspot coordinates tied to the correct image/crop version;
- responsive delivery through supported formats and sizes;
- a safe unavailable/loading fallback that does not present fictional aircraft detail.

The v3 slots imply the following future capture groups:

- cockpit-wide hero and supported-aircraft hero;
- overhead/electrical panel for Fly;
- wider panel/control-group context for Find;
- tight control crop for Understand;
- Guide, control, and system crops for the connected loop;
- simulator scene plus narrow CockpitPath companion composition;
- portrait-aware hero and feature crops for approximately 400 px.

Do not bake hotspots, labels, progress, or explanatory copy into source images. Do not use temporary imagery as aircraft documentation. Capture replacement is a content/media task and remains non-blocking for structural implementation.

## 13. Accessibility and reduced motion

- Use semantic landmarks, one logical heading hierarchy, real links for navigation, and buttons only for actions.
- Provide a skip link and visible keyboard focus across public, auth, and product-shell contexts.
- Meet WCAG AA contrast for text, controls, focus indicators, and essential diagram relationships. Validate muted token uses individually.
- Maintain at least 44 × 44 px effective touch targets where practical, especially at tablet and narrow widths.
- Ensure auth errors, progress state, availability, and current navigation are announced and are not color-only.
- Give informative media useful alternative text. Hide decorative route lines, framing corners, and repeated brand geometry from assistive technology.
- Provide text equivalents for the connected loop and system diagrams. Keyboard order must follow the explanatory sequence.
- Support browser zoom and text reflow without clipped content or horizontal scrolling at 400 px.
- Under `prefers-reduced-motion: reduce`, remove nonessential path drawing, pulsing hotspots, parallax, auto-scrolling, and large transitions. No information may depend on animation.
- Avoid autoplay. If motion is later approved, it must be optional, short, and non-blocking.

## 14. Implementation boundaries

- Do not copy the design canvas' inline HTML/CSS into the application wholesale.
- Do not add TypeScript or change the single-application architecture.
- Do not move authentication, entitlement, progress, or publication checks into client-only UI.
- Do not create simulator telemetry, aircraft control, native-app, billing, AI, or multi-aircraft behavior from the public visuals.
- Do not make unverified procedures, controls, systems, versions, dates, or attribution visible as authoritative content.
- Do not duplicate Guide Mode inside public preview components or wrap Guide Mode in the product shell.
- Do not invent final routes where this handoff marks them unresolved.
- Do not block shell work on deferred real captures; use stable media-slot contracts and explicitly non-authoritative placeholders.

## 15. Measurable acceptance criteria

An implementation following this handoff is acceptable when:

1. `/` renders the section order in Section 8 and uses the v3 image-led composition rather than the v1 card grid.
2. Public header states expose the correct signed-out or signed-in actions without automatically replacing `/` with the app shell.
3. `/app`, when approved and implemented, presents one supported aircraft and distinct no-progress/continue-learning states without an empty library.
4. Aircraft Page, Explorer, and Systems share the compact product shell; Guide Mode does not.
5. Fly, Find, and Understand are labeled, visually distinct, and connected in both visible copy and an accessible text sequence.
6. The page works at 1440 px, representative tablet portrait/landscape widths, 550 px, and approximately 400 px with no horizontal scroll or clipped primary action.
7. At 400 px, the hero is recomposed in the documented order, actions are full width, and image crops retain their intended subject.
8. Keyboard-only users can reach every navigation item, CTA, form control, and interactive preview with a visible focus indicator.
9. Text, controls, and essential graphics meet WCAG AA contrast; 200% zoom and text reflow preserve access to content.
10. Reduced-motion mode removes nonessential motion without losing information or interaction.
11. Every production cockpit image carries required source/verification metadata and uses separate hotspot overlays; temporary media is visibly non-authoritative.
12. Missing real captures do not break layout, accessibility, responsive tests, or navigation integration.
13. Existing authentication, access-control, progress, content-publication, and Guide Mode tests continue to pass.
14. No new behavior exceeds the v0.1 product or architecture boundaries.

## 16. Recommended implementation sequence

1. **Resolve navigation contracts:** approve sign-in landing/return behavior, public anchor targets, CTA destinations, feature-route slugs, and legal-link handling.
2. **Establish shared presentation primitives:** semantic tokens, font loading, Route & Fix identity, focus styles, buttons/links, surface primitives, and media-slot contract.
3. **First implementation slice — public frame and hero:** implement the public header's signed-out state, hero content hierarchy, media fallback, primary/secondary actions with approved destinations, footer shell, and the approximately 400 px recomposition. Verify keyboard access, contrast, reflow, and reduced motion before expanding the page.
4. **Complete the public narrative:** add Fly, Find, Understand, connected loop, simulator companion, supported aircraft, final CTA, and signed-in public-header state using placeholders that cannot be mistaken for verified aircraft content.
5. **Align authentication presentation:** apply the v2 auth frame without changing server-side auth behavior until the destination decision is approved.
6. **Implement `/app`:** add no-progress and continue-learning variants against real server-derived progress, then migrate sign-in/CTA routing according to the approved contract.
7. **Integrate the product shell:** wrap Aircraft Page, Cockpit Explorer, and Aircraft Systems as those routes are implemented; keep Guide Mode isolated.
8. **Replace media progressively:** add approved capture variants, metadata, responsive delivery, and calibrated hotspots without restructuring the page.
9. **Run cross-context validation:** desktop, tablet, narrow companion, approximately 400 px, keyboard, screen reader, zoom/reflow, reduced motion, auth states, and missing-media states.

The recommended first slice is deliberately narrow: it proves brand, public navigation, image-slot behavior, responsive composition, and accessibility without coupling the work to deferred cockpit captures or unresolved signed-in routing.

## 17. Reference set

### Design artifacts

- [Public Site Visual Refinement v3](<refinements/public-site-shell-v3/Public Site Visual Refinement.dc.html>)
- [Public Site and Shell Refined v2](<refinements/public-site-shell-v2/Public Site and Shell Refined.dc.html>)
- [Public Site and Shell v1](<screens/public-site-shell-v1/Public Site and Shell.dc.html>)
- [Route & Fix Refined v2](<brand/logo-v2/Route and Fix Refined.dc.html>)
- [Logo Directions v1](<brand/logo-v1/Logo Directions.dc.html>)
- [Guide Mode refined reference](<refinements/guide-mode-v2/Guide Mode Refined.dc.html>)
- [Public-site and shell design brief](<../ai/claude-design/public-site-shell/design-brief.md>)

### Product, UX, architecture, and implementation

- [Product vision](../product/vision.md)
- [MVP v0.1](../product/mvp-v0.1.md)
- [Product roadmap](../product/roadmap.md)
- [Guide Mode UX](../ux/guide-mode.md)
- [Cockpit Explorer UX](../ux/cockpit-explorer.md)
- [Aircraft Systems UX](../ux/aircraft-systems.md)
- [Guide Mode direction](guide-mode-direction.md)
- [Architecture overview](../architecture/overview.md)
- [Authentication](../architecture/authentication.md)
- [Access control](../architecture/access-control.md)
- [Media assets](../architecture/media-assets.md)
- [Implementation dashboard](../implementation/README.md)
- [Phase 4 — Guide Mode](../implementation/phase-4-guide-mode.md)
- [Phase 5 — Cockpit Explorer](../implementation/phase-5-cockpit-explorer.md)
- [Phase 6 — Aircraft Systems](../implementation/phase-6-aircraft-systems.md)
- [Phase 7 — Aircraft Page](../implementation/phase-7-aircraft-page.md)
