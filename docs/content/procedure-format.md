# CockpitPath Procedure Format

**Status:** Foundation v0.1<br>
**Last updated:** 2026-08-24

## Purpose

This document defines the authoring contract for Procedures and Procedure Steps. It describes structure, not aircraft facts; examples are intentionally generic and unverified.

## Procedure contract

A Procedure file owns one independently accessible Procedure and its ordered Steps. It includes:

- stable `key` and route-facing `slug`;
- Aircraft Implementation reference;
- title and concise description;
- optional Procedure Group reference;
- lifecycle, audience, and access metadata;
- ordered Steps with stable keys and explicit sequence;
- source and verification references through shared content metadata.

Journey membership is authored on the Journey through Journey Sections, not inside the Procedure.

## Step types

| Type | Meaning | Required content intent |
| --- | --- | --- |
| `ACTION` | User changes one logical cockpit target. | Action plus target/control where applicable. |
| `VERIFY` | User observes and confirms a condition. | Observable expected result; no automatic-verification claim. |
| `WAIT` | User waits for a condition or declared interval. | Clear end condition or wait guidance. |
| `INFORMATION` | Context needed without an action. | Concise information and reason for its position. |
| `MULTI_ACTION` | Tightly related actions treated as one logical unit. | Ordered targets/actions and justification for grouping. |

An `optional` flag states applicability, not lower importance. Optional Steps explain when they apply.

## Minimal illustrative shape

```yaml
key: procedure.example
implementation: implementation.ifly-b737-max-8-msfs-2024
slug: example
title: Example Procedure
status: DRAFT
audience: AUTHENTICATED
access_class: FREE
steps:
  - key: step.example.confirm-state
    sequence: 10
    type: VERIFY
    title: Confirm the required state
    expected_result: >-
      The declared indication is visible in the simulator.
    optional: false
    controls:
      - key: control.example
        role: VERIFY_TARGET
```

This is a schema illustration only. It must not be published as aircraft content. Final field names are confirmed with the JavaScript validation schema before authoring begins.

## Step fields

Use separate fields for:

- `title`: brief human heading.
- `action_text`: exact action for `ACTION`/`MULTI_ACTION`.
- `location_hint`: readable orientation derived from or consistent with Cockpit Areas.
- `expected_result`: user-observed condition.
- `explanation`: why the step matters.
- `tip`: useful nonessential guidance.
- `warning`: important risk or sequencing information.
- `wait_hint`: end condition for `WAIT`.
- related Controls with explicit role and sequence.
- Visual references to Cockpit View, Media Asset, or Hotspot.
- related Concepts and Aircraft Systems.

Do not place the Control's reusable definition inside each Step. Do not encode presentation layout, CSS, component names, storage URLs, or fixed pixel coordinates.

## Ordering

Sequence values are unique within a Procedure and determine published order. Prefer spaced integers during authoring to make small insertions reviewable, but never expose sequence values as stable identity. Reordering must not rename keys.

## Expected results and telemetry boundary

Write an observable condition the user can confirm. Avoid words such as `detected`, `verified`, or `confirmed by CockpitPath`. Possible Control Positions describe domain knowledge; they do not represent the user's live simulator.

## Visual contract

A location-critical Step should reference a shared Cockpit View and preferred Hotspot, or a dedicated Media Asset when reuse is inappropriate. The UI renders focus dynamically. Follow the [image](image-guidelines.md) and [hotspot](hotspot-guidelines.md) guidelines.

## Validation rules

- Key, implementation, type, order, and lifecycle are valid.
- Required fields match Step type.
- Relationships target allowed kinds in the same implementation.
- A `MULTI_ACTION` has at least two ordered related actions/targets.
- Hotspots and visuals belong to the referenced control/area context.
- Published required Steps meet source and verification policy.
- Markdown contains only the approved safe subset.
- Required Journey flow has no inaccessible required Step.

## Revision compatibility

Clarifying text, correcting a typo, replacing a visual, or reordering retains the Step identity. Replacing the operation or changing what completion historically means requires a new Step key and an explicit progress-compatibility review.
