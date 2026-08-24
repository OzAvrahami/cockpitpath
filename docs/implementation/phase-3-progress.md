# Phase 3 — Learning State & Progress

**Status:** ⬜ Planned

## Goal

Persist and restore an authenticated user's position through the connected learning graph.

## Why Now

Progress must reference stable Journey, Procedure, and ProcedureStep identities from the content platform. Implementing progress earlier would couple persistence to placeholders or unstable UI state.

## Deliverables

- Journey progress.
- Procedure progress.
- Step completion.
- Permitted skip behavior.
- Idempotent autosave.
- Resume context.
- Continue Learning resolution.
- Cross-user isolation through the Phase 1B database security foundation.

Detailed behavior remains governed by the [progress model](../architecture/progress-model.md).

## Exit Criteria

- An authenticated user can start the vertical slice, complete or permissibly skip steps, leave, and resume at the correct context.
- Repeated autosaves are safe and idempotent.
- Invalid progress transitions are rejected.
- Continue Learning resolves the correct published learning context.
- Another user cannot read or alter the state.
- Progress behavior and tests match the architecture contract.

## Dependencies

Phases 1B and 2. Content identity must be stable before progress records depend on it.

## Relevant Commit(s)

Not started

[← Previous Phase — Content Platform](phase-2-content-platform.md) · [↑ Implementation Dashboard](README.md) · [→ Next Phase — Guide Mode](phase-4-guide-mode.md)
