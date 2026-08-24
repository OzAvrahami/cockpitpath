# CockpitPath Content Key Conventions

**Status:** Accepted v0.1<br>
**Last updated:** 2026-08-24

## Purpose

Content keys are stable, human-readable identities used in repository authoring. Publication resolves them to PostgreSQL UUID primary keys. Keys are not display labels, paths, URLs, or database IDs.

## Syntax

A key has a kind prefix and one or more lowercase kebab-case segments separated by dots.

```text
kind.segment[-segment][.child-segment...]
```

Allowed characters are lowercase ASCII letters, digits, hyphens within segments, and dots between segments. A segment starts and ends with a letter or digit. Do not use spaces, underscores, slashes, uppercase letters, punctuation, version numbers that are not part of product identity, or translated display text.

Examples:

```text
aircraft.b737-max-8
simulator.msfs-2024
addon.ifly-b737-max-8
implementation.ifly-b737-max-8-msfs-2024
journey.cold-dark-to-takeoff
procedure.power-up
step.power-up.battery-on
area.overhead.electrical
view.overhead.electrical.primary
control.battery-switch
system.electrical
component.electrical.aircraft-battery
concept.standby-power
media.overhead.electrical.primary
hotspot.overhead.electrical.battery-switch
source.ifly-manual.<approved-document-segment>
```

The source example is a pattern only; authors must use the real approved source identity and must not invent a document title.

## Kind prefixes

Use the controlled prefixes shown above. New kinds require a documented schema change so validators, publishers, and relationship rules agree. Do not abbreviate one kind in multiple ways.

## Scope

Keys are globally unique in the authoring repository even where database uniqueness could be narrower. The surrounding file path supplies implementation organization, but a key remains unambiguous in validation output and publication logs.

Implementation-specific entities may share a readable trailing name only if their full global keys remain distinct. If a second implementation is added, update the convention deliberately before creating collisions; do not retrofit UUIDs into authoring files.

## Stability rules

- Display-name edits do not change a key.
- File moves do not change a key.
- Reordering does not change a key.
- Media replacement does not change the logical view/control key, but may require a new Media Asset key and revision.
- A semantically different Procedure Step receives a new key.
- Archived keys remain reserved forever.
- Keys are never generated from current sequence numbers.

Procedure Step keys should describe the logical action, not the displayed title. Avoid `step.power-up.step-04` because order changes. Use a concise target/action such as `step.power-up.battery-on` after technical review confirms the canonical meaning.

## References and aliases

Relationship fields store full keys. Search aliases are content fields and are not alternate keys. Slugs used in routes may resemble a key segment but are independently changeable presentation identifiers.

## Validation

Publishing rejects malformed keys, duplicates, unknown prefixes, references to an incompatible kind, reused archived keys, and key-to-UUID remapping. Key comparisons are exact and case-sensitive after syntax validation; the authoring tool must not silently normalize invalid input.
