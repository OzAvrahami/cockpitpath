# Phase 9 — Beta Readiness

**Status:** ⬜ Planned

## Goal

Turn the connected v0.1 experience into a secure, reliable, observable, and testable limited beta.

## Why Now

Release hardening is meaningful only after the intended learning journey and its supporting experiences work end to end.

## Deliverables

- End-to-end authentication completion and reliability review.
- Security review, grants review, and RLS verification suite.
- Content verification review.
- Accessibility review.
- Responsive QA.
- Performance review.
- Image optimization.
- Production-safe error handling.
- Staging environment and release rehearsal.
- Railway production deployment.
- Cloudflare R2 production media pipeline.
- Operational observability and incident baseline.
- Basic product analytics only if a privacy-conscious approach is explicitly selected.
- Limited-beta release validation against the product roadmap's v0.1 outcomes.

Authentication completion here means production hardening and end-to-end release validation of Phase 1B.3, not postponing core authentication until Phase 9. RLS verification audits and release-tests the foundation established in Phases 1B.2 and 1B.5.

No speculative post-MVP capability is a beta requirement.

## Exit Criteria

- Staging passes the production build, migrations, RLS/security tests, content publication, and media checks.
- Authentication, journey start, progress save, sign-out/sign-in, resume, and cross-link smoke tests pass.
- Accessibility, responsive, performance, image, and error-handling quality gates pass.
- Railway deployment and rollback procedures are documented and rehearsed.
- The R2 production media pipeline is verified.
- Observability can identify critical failures without exposing secrets.
- Any selected analytics meet the approved privacy boundary.
- The project owner approves the limited beta.

## Dependencies

Phases 1B–8.

## Relevant Commit(s)

Not started

[← Previous Phase — Content Expansion](phase-8-content-expansion.md) · [↑ Implementation Dashboard](README.md)
