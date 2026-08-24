# CockpitPath Hotspot Guidelines

**Status:** Foundation v0.1<br>
**Last updated:** 2026-08-24

## Purpose

Hotspots are normalized structured spatial metadata rendered dynamically over Cockpit Views. They power Cockpit Explorer selection, Guide Mode focus, and `Guide me there` without altering base images.

## Coordinate model

For v0.1, use rectangular hotspots with top-left origin and normalized values:

```text
x, y, width, height ∈ [0, 1]
x + width ≤ 1
y + height ≤ 1
```

Coordinates refer to the full displayed pixel content of the associated Cockpit View before CSS layout scaling. Letterboxing or object-fit behavior must preserve the same coordinate transform. A crop with different image content requires its own View/hotspots or a proven transform.

## Target rule

A normal navigation hotspot targets exactly one `CockpitArea` or one `Control`, never both. The target must belong to the same Aircraft Implementation and be semantically reachable from the View's Area.

A Guide Step may choose a preferred Hotspot for a referenced Control. It does not own a duplicate coordinate box.

## Authoring principles

- Bound the visible interactive object, including enough tolerance for touch without selecting adjacent controls.
- Use the smallest region that remains reliable across approved viewports and zoom.
- Avoid overlapping default hotspots. Where dense controls require overlap, define deterministic priority and review the interaction on touch.
- Do not use invisible hotspots to target controls not actually visible.
- Progressively increase density from cockpit to panel to area views.
- Use stable target identity; labels are derived from the target and may have a short contextual override only when necessary.

## Suggested shape

```yaml
key: hotspot.overhead.electrical.example-control
view: view.overhead.electrical.primary
target_control: control.example-control
shape: RECTANGLE
x: 0.40
y: 0.20
width: 0.10
height: 0.08
sort_order: 10
```

This is a structural example, not verified cockpit geometry.

## Accessibility

Every interactive hotspot exposes an accessible name from its canonical target and behaves as a semantic keyboard-selectable control. Visible focus, selected framing, labels/corners, and textual location ensure color is not the only cue. Provide non-image navigation/search for users who cannot use precise spatial input.

Visual hit regions may be enlarged for touch separately from the authored semantic boundary if the implementation prevents collisions and preserves the visible focus target.

## Focus and styling boundary

Content owns target coordinates and optional focus intent. UI owns cyan focus styling, dimming, corners, animation, responsive zoom, and layout. Do not author CSS colors, pixels, or component-specific options into content.

## Quality review

Review on the exact final Media Asset revision at:

- wide desktop;
- iPad/tablet with touch;
- mobile when supported;
- 400–550 px companion width for Guide Mode;
- browser zoom and keyboard focus.

Confirm that the target is immediately identifiable, surrounding context is adequate, and navigation to/from parent Areas works.

## Validation

- All numeric values are finite and within normalized bounds.
- Width and height are positive and meet a configured minimum unless explicitly reviewed.
- Exactly one allowed target exists and is published-compatible.
- View and target share an implementation.
- No duplicate key or unintended duplicate target/View pair.
- Overlap warnings are reviewed; impossible or ambiguous targets are errors.
- Referenced Media Asset dimensions are known.
- A Control search result has a focusable published hotspot where visual navigation is promised.

## Change management

Changing the underlying image revision requires hotspot revalidation. Moving a box for accuracy retains Hotspot identity. Retargeting it to a different Control normally requires a new key because its semantic meaning changed.
