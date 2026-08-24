# CockpitPath Source Policy

**Status:** Accepted v0.1<br>
**Last updated:** 2026-08-24

## Purpose

This policy defines acceptable evidence and traceability for simulator-oriented learning content. CockpitPath is not approved real-world training material, and polish must never substitute for accuracy.

## Required distinctions

Every technical claim must be understood as one or more of:

- Real-aircraft procedure or system information.
- Microsoft Flight Simulator platform behavior.
- iFly add-on behavior.
- CockpitPath educational interpretation or simplification.

Do not silently blend categories. When behavior differs, use a verified Simulator Note or implementation-specific explanation.

## Source hierarchy

Prefer the source closest to the claim and supported implementation:

1. Official supported add-on documentation for add-on behavior and procedures.
2. Official simulator documentation for platform behavior.
3. Authoritative aircraft documentation where permitted, relevant, and appropriate to simulator learning.
4. Reputable training material with clear provenance and applicable scope.
5. Reproducible direct testing in the supported simulator/add-on.
6. Secondary community sources only as leads or corroboration, not sole authority for safety- or sequence-critical claims.

Direct testing shows observed implementation behavior; it does not prove real-aircraft behavior. A single video, forum post, AI response, design file, or unsourced checklist is not sufficient production authority.

## Source Reference metadata

Record a stable source key, source type, exact title, publisher/owner, URL or repository-safe identifier where permitted, document version, publication date when known, notes, and access/rights constraints. Content relationships add purpose, precise locator, and claim-specific notes.

Unknown metadata stays null or explicitly unknown. Never invent page numbers, versions, dates, publishers, or URLs to satisfy a schema.

## Direct simulator testing

A test record identifies Aircraft, Simulator, Add-on Product, actual versions when known, date, tester, initial conditions, reproducible actions, observed result, and limitations. Screenshots or notes may support the record but do not replace a clear procedure.

If versions are unknown, the observation may remain evidence under review but cannot support a version-specific verified claim.

## Multiple-source use

Use multiple sources when a claim crosses aircraft, simulator, and add-on boundaries; when sources conflict; or when a simplified system relationship needs corroboration. More sources do not automatically mean higher confidence—the reviewer assesses applicability and authority.

## Copyright and licenses

Store bibliographic metadata and concise locators, not copied manuals. Paraphrase into CockpitPath's simulator-oriented educational language. Quotes must be short, necessary, attributed, and permitted. Images, diagrams, and screenshots require documented rights or an original-capture basis.

Do not commit proprietary manuals or restricted source files unless the repository is authorized to store and distribute them. A private reviewer may consult a permitted source without making the source binary part of CockpitPath.

## Conflicts

When sources disagree:

1. Record the conflicting claims and scope/version.
2. Determine whether the difference is aircraft, airline, simulator, add-on, or version specific.
3. Reproduce add-on behavior when relevant.
4. Escalate to technical review.
5. Keep the affected content unverified/unpublished until resolved, or publish only an explicitly bounded claim that the evidence supports.

Never silently choose the wording that best matches an existing design.

## Prohibited sources of truth

- Placeholder copy and counts in design HTML.
- AI-generated technical claims without independent approved evidence.
- Search-result snippets without reviewing the source.
- Unattributed community checklists as sole evidence.
- Another CockpitPath field that itself lacks traceable sources.

## Review checklist

- Source is applicable to the exact claim and implementation scope.
- Locator allows a reviewer to find the evidence.
- Rights permit the intended use.
- Direct testing is reproducible.
- Conflicts and limitations are recorded.
- The authored text is a concise transformation, not a copied manual passage.
