# CockpitPath Content Authoring Guide

**Status:** Foundation v0.1<br>
**Last updated:** 2026-08-24

## Purpose

This guide explains how maintainers create structured, connected, evidence-backed CockpitPath learning content. It does not teach aircraft facts. Authors must use the [source policy](source-policy.md) and [verification policy](verification-policy.md) for every technical claim.

## Core rule

Author one connected aircraft-learning graph, not separate copies for each feature.

```text
Procedure Step → Control → Cockpit Area / View / Hotspot
                      ↘ System Component → Aircraft System
                       ↘ Concept
```

Guide Mode, Cockpit Explorer, Aircraft Systems, search, imagery, and progress consume these shared identities and relationships.

## Language and format

All repository content, metadata, notes, and identifiers are in English. Use UTF-8 YAML for structured entities and CommonMark Markdown only inside designated rich-text fields. Application tooling is JavaScript, not TypeScript.

Use stable content keys defined in [content-key-conventions.md](content-key-conventions.md). Never paste database UUIDs or hard-coded R2 URLs into authored relationships.

## Roles

One person may hold multiple roles in a small v0.1 team, but the responsibilities remain visible:

- Author: drafts learning content and connects existing entities.
- Technical reviewer: evaluates technical accuracy and scope distinctions.
- Simulator verifier: reproduces relevant behavior in the declared implementation.
- Media reviewer: checks capture quality, context, rights, and hotspots.
- Publisher: reviews validation output and applies an approved publication plan.

Content cannot self-verify merely because its author believes it is correct. If independent review is not possible during beta, record that limitation rather than implying stronger assurance.

## Authoring sequence

1. Define or confirm the Aircraft Implementation.
2. Register sources and their permitted use.
3. Define semantic Cockpit Areas before Cockpit Views and Controls.
4. Register Media Assets, then author Cockpit Views and Hotspots.
5. Define Controls and aliases with canonical terminology.
6. Define required Concepts and Aircraft System entities.
7. Author Procedures and Steps that reference those shared entities.
8. Assemble reusable Procedures into the Journey.
9. Run schema, reference, graph, media, and verification validation locally.
10. Request review, address findings, and publish through the controlled workflow.

This is dependency order, not a requirement to finish all cockpit or system content before the first Procedure. Build only the graph needed by the v0.1 Journey and Electrical learning experience.

## Writing style

- Put one logical action in a step where practical.
- Use the approved aircraft/control term as the canonical name.
- Write concise operational English for motivated beginner-to-intermediate simulator users.
- Separate action, expected result, explanation, warning, tip, and simulator-specific notes.
- State observable results without claiming CockpitPath detected them.
- Distinguish real-aircraft information, simulator behavior, add-on behavior, and CockpitPath educational simplification.
- Reuse Concepts instead of creating inconsistent definitions in multiple experiences.
- Include deeper detail only when it improves simulator operation or understanding.

Do not copy long manual passages, invent system behavior, promote a design placeholder, or present CockpitPath as approved real-world training.

## Editing existing content

Keep a stable key when correcting wording, adding sources, improving explanation, changing imagery, or reordering the same logical entity. Create a new key when the entity's meaning or action changes enough that historical progress would be misleading.

Never reuse an archived key for a different entity. Do not hard-delete published entities through authoring files; mark them for archival and follow the compatibility review in [publishing-workflow.md](publishing-workflow.md).

## Review checklist

- Scope matches Boeing 737 MAX 8 / iFly / MSFS 2024 where implementation-specific.
- Every technical statement has appropriate evidence.
- Verification fields contain actual values or remain pending/null.
- References point to canonical shared entities in the same implementation unless intentionally shared.
- The user can understand what to do, where, what to expect, and why.
- Visual targets use dynamic hotspots and accessible text.
- Required content access is coherent across the full Journey.
- No placeholder counts, version numbers, dates, or design descriptions were promoted.

## v0.1 scope discipline

Required depth is the 14-section `Cold & Dark → Takeoff` Journey, Cockpit Explorer coverage needed by it, and the verified Electrical learning experience. Arrival Procedures, complete cockpit coverage, additional systems, telemetry, billing, community authoring, and a custom CMS remain outside the required content foundation.
