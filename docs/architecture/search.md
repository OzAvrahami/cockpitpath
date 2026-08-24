# CockpitPath Search Architecture

**Status:** Accepted v0.1<br>
**Last updated:** 2026-08-24

## Purpose

v0.1 search helps a user find cockpit controls within the current Aircraft Implementation and navigate to the canonical Cockpit Explorer location. PostgreSQL is sufficient; no dedicated search service or semantic AI search is required.

## v0.1 searchable data

Required fields:

- Control canonical name.
- Control aliases.
- Cockpit Area title and ancestry.
- Related panel/location text.

Aircraft System names may improve control ranking and may be returned as context, but global cross-type search is future work. Search must not index placeholder design text.

## Query flow

```mermaid
flowchart LR
    Q[User query] --> N[Normalize and validate]
    N --> S[Scope to Aircraft Implementation]
    S --> A[Apply publication and access filters]
    A --> M[PostgreSQL exact, prefix, and fuzzy match]
    M --> R[Rank and limit]
    R --> C[Return canonical Control identity + location]
    C --> X[Cockpit Explorer resolves view and hotspot]
```

## Normalization and matching

Normalize case, surrounding whitespace, repeated whitespace, and punctuation that does not distinguish a control. Preserve the user's original query for display and privacy-safe diagnostics. Do not apply language-specific stemming that changes aviation abbreviations without evidence.

Initial ranking order:

1. Exact canonical name.
2. Exact alias.
3. Canonical prefix.
4. Alias prefix.
5. Token or trigram similarity.
6. Location or related-system supporting match.

Canonical terminology always remains the displayed result. Aliases improve discovery but do not rename controls.

## Result contract

A result includes canonical Control identity, display name, control type where helpful, immediate cockpit location, relevant parent panel, and enough hierarchy identity for navigation. Do not store a search-only URL as truth; Cockpit Explorer derives the route and focus from the graph.

If a control lacks a valid published Cockpit View or Hotspot, publication should normally reject it from the searchable Explorer scope. A deliberately text-only control must be explicitly modeled and must not promise visual focus.

## PostgreSQL implementation direction

Use normalized columns or a controlled search projection plus indexes suitable for equality, prefix, and trigram matching. A materialized search projection is optional only if ordinary joins are not adequate. Keep search SQL explicit and test query plans with representative content.

Search queries are bounded by minimum/maximum length, result limit, and timeout. Debounce interactive requests in the browser; rate-limit only where observed abuse or cost justifies it.

## Access and privacy

Apply publication, audience, and entitlement rules before ranking or returning any field. Results cannot reveal draft, archived, or inaccessible content. Search analytics must not include sensitive user data; raw queries require a documented retention choice before collection.

## Empty and error states

- Empty query: show suggested visual navigation or no results, not the entire cockpit index.
- No match: explain that aliases may be limited and offer panel browsing.
- Service error: preserve the current Cockpit Explorer context and provide retry.
- Ambiguous match: return distinct canonical controls with location labels.

## Future-ready boundary

Global search may later include Procedures, Systems, Components, and Concepts using the same canonical identities and access filtering. An external engine is introduced only after measured PostgreSQL limitations, not in anticipation of scale.

## Required tests

- Exact, alias, prefix, typo-tolerant, abbreviation, and no-result queries.
- Implementation scoping and duplicate names in different panels.
- Inaccessible and unpublished records never appear.
- Selection resolves the correct Cockpit Area, View, and Hotspot.
- Ranking stability and acceptable query plan on representative volume.
- Keyboard and screen-reader operation of results.
