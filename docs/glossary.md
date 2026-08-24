# CockpitPath Glossary

**Status:** Foundation v0.1<br>
**Last updated:** 2026-08-24

Use these terms consistently in documentation, content, schemas, and application copy.

| Term | Meaning |
| --- | --- |
| Add-on Product | A third-party simulated-aircraft product, such as the iFly Boeing 737 MAX 8 product. |
| Aircraft | The real-world aircraft model or variant, independent of a simulator implementation. |
| Aircraft Implementation | The supported combination of Aircraft, Simulator, and Add-on Product. Most detailed learning content is scoped to one implementation. |
| Aircraft Page | The learning hub for one Aircraft Implementation. |
| Aircraft System | A structured learning area such as Electrical. It describes verified conceptual relationships, not live state. |
| Cockpit Area | A semantic location in the cockpit hierarchy: cockpit, region, panel, or area. It is not an image. |
| Cockpit Explorer | The visual experience for locating and understanding cockpit controls. |
| Cockpit View | A media-backed visual representation of a Cockpit Area. |
| Concept | Reusable educational knowledge connected to controls, procedure steps, or system components. |
| Content Key | A stable, human-readable authoring identifier resolved to a database UUID during publication. |
| Content Record | Shared identity and lifecycle metadata for a publishable learning entity. |
| Control | A selectable cockpit element, including a switch, button, knob, display, indicator, group, or other supported type. |
| Entitlement | A grant that may permit access to protected content. It is independent of progress and billing. |
| Expected Result | A condition the user should observe and confirm. v0.1 does not verify simulator state automatically. |
| Guide Mode | The step-by-step simulator-companion procedure experience. |
| Hotspot | Normalized spatial metadata over a Cockpit View. A hotspot is separate from the base image. |
| Journey | An ordered learning path that references reusable Procedures through Journey Sections. |
| Learning Graph | The connected set of procedures, controls, cockpit areas, systems, components, concepts, media, and relationships. |
| Media Asset | Stable metadata for a media binary stored in Cloudflare R2. Content references its ID, not its delivery URL. |
| Procedure | An independently accessible operational flow containing ordered Procedure Steps. |
| Procedure Step | One ordered learning unit with an interaction type such as `ACTION`, `VERIFY`, `WAIT`, `INFORMATION`, or `MULTI_ACTION`. |
| Published Runtime Content | Validated content in PostgreSQL that is eligible to be served to users. |
| Quick / Learn | Two information-density presentations of the same Procedure Step and progress state. |
| Repository Authoring Source | Version-controlled structured files edited and reviewed before publication. |
| RLS | PostgreSQL Row Level Security, used as defense in depth for user-owned data and explicitly exposed tables. |
| Simulator | A supported simulation platform, such as Microsoft Flight Simulator 2024. |
| Source Reference | Traceable metadata identifying evidence used to author or verify content. |
| System Component | A reusable element within an Aircraft System. |
| Verification | Evidence-backed confirmation of content against declared sources and, where applicable, a simulator/add-on version. Verification is separate from publication. |

## Reserved product terms

Use `Cold & Dark → Takeoff` for the primary v0.1 Journey and preserve the 14 canonical section names in the product specification. Use uppercase enum-style values such as `ACTION`, `PUBLISHED`, and `FREE` only for structured values, not as a substitute for natural interface language.
