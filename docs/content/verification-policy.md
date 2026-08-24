# CockpitPath Verification Policy

**Status:** Accepted v0.1<br>
**Last updated:** 2026-08-24

## Purpose

Verification records what content was checked, against which evidence and software context, by whom, and when. It is an evidence state, not a visual badge added for completeness.

## Lifecycle and verification

Editorial lifecycle values are `DRAFT`, `REVIEW`, `VERIFIED`, `PUBLISHED`, and `ARCHIVED`. A Verification Event separately records an outcome. `VERIFIED` content may remain unpublished; publishing never makes unverified content verified.

Recommended event outcomes:

- `PENDING`: not yet evaluated or evidence incomplete.
- `VERIFIED`: evidence and required checks passed for the declared scope.
- `REJECTED`: a reviewed claim did not pass.
- `STALE`: prior verification no longer covers the current content or supported version context.

Final enum names may be consolidated with the SQL schema, but their meanings must remain distinct.

## Verification record

Record:

- content key and revision/hash;
- result;
- source references and locators;
- Aircraft Implementation;
- add-on and simulator versions actually checked, when relevant;
- verifier identity;
- verification date;
- method and reproducible test notes where applicable;
- limitations, unresolved differences, and simulator-specific notes.

Do not populate a version or date that was not observed. Do not reuse a design-reference badge such as a fabricated `VERIFIED` date.

## Required depth by content type

| Content | Minimum verification focus |
| --- | --- |
| Procedure Step | Action, order/context, target Control, expected result, applicability, and implementation behavior. |
| Control | Canonical identity, location, type/positions, practical description, and related Procedures/Systems. |
| Cockpit View/Hotspot | Correct implementation, visible target, coordinate accuracy, orientation, and media provenance. |
| System Component/Relationship | Source applicability, conceptual correctness, operational relevance, and no live-state implication. |
| Concept | Accurate definition, proper general/implementation scope, and consistent reuse. |
| Journey | Required Procedures, canonical order, access coherence, and end-to-end usability. |

## Procedure verification

Verify both evidence and execution. A reviewer should reproduce applicable steps in the declared simulator/add-on state, record prerequisites and deviations, and confirm expected results are observable by a user. The test does not give CockpitPath telemetry.

One verified step does not automatically verify a whole Procedure. A Procedure becomes verified only when all required published Steps and their critical relationships meet policy. The Journey additionally requires an end-to-end review of transitions and prerequisites.

## System verification

System diagrams are high-risk because simplification can imply false relationships. Review every Component and edge, the direction/label, explanatory text, and responsive textual representation. Explicitly label learning Scenarios and ensure cyan/focus presentation cannot be read as current state.

## Independence and conflicts

Prefer a verifier other than the original author for technical content. If v0.1 staffing requires self-verification, record it and seek later independent review. A source conflict blocks the disputed claim until documented resolution or a narrower supportable statement is authored.

## Staleness triggers

Reverification is required when:

- action or technical meaning changes;
- referenced source changes materially;
- add-on or simulator update may affect behavior or imagery;
- Media Asset pixels/crop change enough to affect a hotspot;
- related Control/System identity changes;
- a defect report challenges accuracy;
- the supported implementation scope changes.

Pure spelling or non-semantic formatting changes may retain verification if the publisher records them as non-semantic.

No arbitrary expiry interval is imposed before evidence exists about update cadence. Last-verified dates remain visible metadata, and release review may mark older verification stale based on actual platform changes.

## Publication gate

Production learning content cannot publish merely because a schema is valid. The publisher confirms required Verification Events cover the exact content revision/hash and all blocking relationships. `PENDING`, `REJECTED`, or `STALE` required content fails publication.

Coming-soon catalog labels may publish without technical detail if they make no unverified system or procedure claims.

## Corrections

Accuracy defects are documented, prioritized, corrected in repository source, revalidated, reverified, and republished. Archive unsafe content promptly when necessary. Preserve prior events; do not edit history to make an old review appear successful.
