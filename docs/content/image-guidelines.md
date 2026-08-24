# CockpitPath Image Guidelines

**Status:** Foundation v0.1<br>
**Last updated:** 2026-08-24

## Purpose

Images are functional learning assets. These guidelines cover capture, review, authoring metadata, and delivery suitability for the supported Aircraft Implementation.

## Allowed production sources

Prefer original CockpitPath simulator captures from the supported Boeing 737 MAX 8 / iFly / Microsoft Flight Simulator 2024 implementation. Original diagrams or other media must have documented creation provenance and rights. Third-party imagery requires explicit permitted use; availability online is not permission.

Design HTML placeholders and generated panel illustrations are not production media and must never be marked verified.

## Capture preparation

- Confirm the intended Aircraft Implementation and record actual version information when known.
- Use a repeatable simulator graphics, lighting, zoom/camera, and cockpit-state approach appropriate to the capture set.
- Remove unrelated simulator UI, cursor, notifications, debug overlays, and personal information.
- Capture enough surrounding context for orientation; use closer Views as separate assets when needed.
- Avoid visually ambiguous control states when the image is intended only for location.
- Retain the highest-quality approved source before generating delivery variants.

The exact capture settings remain open until real iFly/MSFS test captures are evaluated. Record the chosen standard then; do not invent settings now.

## Composition by use

- Full cockpit: major-region orientation, low hotspot density.
- Panel: recognizable edges and neighboring context.
- Area/control: sharp labels and usable zoom detail.
- Guide visual: current target is legible at companion width while preserving location.
- Aircraft identity: supports orientation and identity without becoming decorative marketing excess.

Do not permanently bake step highlights, arrows, labels, dimming, verification badges, or instructional state into a base cockpit capture. Those are dynamic overlays.

## Quality criteria

- Correct implementation and intended cockpit area.
- Sharp at required display/zoom size.
- Consistent color/lighting within a navigation sequence.
- No unintended cropping of the target or contextual landmarks.
- No visible compression artifacts that obscure labels.
- Correct orientation and no accidental mirroring.
- Accessible description identifies the meaningful view without pretending to replace full instruction.

## File and metadata contract

Use an approved web image format appropriate to quality and transparency needs. MIME type is confirmed from content, not extension. Store pixel dimensions, checksum, file size, stable storage key, original filename, capture context, implementation, versions when known, rights/source status, and verification state.

Filename and object-key naming should be descriptive but remains non-authoritative. Content references a stable Media Asset key/ID.

## Variants and performance

Generate only useful variants such as thumbnail, small, medium, large, and original. Preserve aspect ratio unless a separately reviewed crop is a distinct View or variant. The runtime selects responsive sizes and may prefetch only likely upcoming Guide visuals.

Do not upscale a low-resolution source. Do not deliver the original everywhere. Verify hotspot alignment against every crop/variant; normalized hotspots assume the same displayed image coordinate space.

## Editing

Permitted intrinsic edits include crop, exposure/color correction, privacy cleanup, and format optimization when they do not alter technical meaning. Record significant edits. Do not remove, move, redraw, or change cockpit controls, indications, labels, or states.

## Review checklist

- Rights and provenance recorded.
- Implementation/context correct.
- Version/date claims are real or left unset.
- Target and orientation remain clear at desktop, tablet, mobile, and companion sizes as relevant.
- Base asset contains no baked instruction.
- Accessible description is useful.
- Variants and dimensions match metadata.
- Hotspots were reviewed on the final published pixels.
