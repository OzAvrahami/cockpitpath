# ADR-0009 — Dynamic Hotspots over Base Images

## Status

Accepted — 2026-08-24

## Context

Many Procedures and Cockpit Explorer states reuse the same cockpit imagery with different targets. Baked annotations duplicate media, become stale, and do not scale or expose semantic controls accessibly.

## Decision

Store clean base images as Media Assets and store Hotspots separately as normalized structured coordinates over Cockpit Views. Render focus, labels, dimming, and selection dynamically. v0.1 supports rectangular hotspots.

## Consequences

- One image can support multiple Controls and Steps.
- Highlights adapt to responsive layouts and can provide keyboard/semantic behavior.
- Image revisions require hotspot revalidation.
- Coordinate transforms, overlap validation, and accessible alternatives become implementation responsibilities.

## Alternatives Considered

- One annotated image per step: rejected because it duplicates files and bakes presentation into content.
- Fixed pixel coordinates: rejected because responsive media changes rendered size.
- Computer-vision target detection: rejected as unnecessary and unverified for v0.1.
