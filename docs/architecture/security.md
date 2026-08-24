# CockpitPath Security Baseline

**Status:** Accepted v0.1<br>
**Last updated:** 2026-08-24

## Purpose and posture

CockpitPath protects accounts, private progress, privileged publication, and media infrastructure. The browser UI is never an authorization boundary. Controls should be proportional to a free beta while preserving a safe path to future entitlements.

This baseline complements [authentication.md](authentication.md), [access-control.md](access-control.md), and [deployment.md](deployment.md).

## Protected assets

- Neon Auth sessions and account identity.
- User-owned progress and preferences.
- Draft, review, and unpublished content.
- Privileged database, R2, and deployment credentials.
- Content publication authority and verification history.
- Future entitlement state.
- Media rights/provenance metadata and non-public objects.

## Main threats and controls

| Threat | Required control |
| --- | --- |
| Cross-user progress access | Server ownership checks, parameter validation, explicit grants, and PostgreSQL RLS. |
| Draft or future paid-content leakage | Server content access resolver, no unrestricted browser table grants, access-filtered search and media resolution. |
| Privileged secret exposure | Server-only modules/configuration, bundle review, secret scanning, and redacted logs. |
| Forged progress mutation | Validated session identity, canonical relationship checks, idempotent server mutation. |
| Malicious authoring or media input | Schema/reference verification, review, file signature and type checks, controlled publisher. |
| Cross-site request or script attack | Safe cookie settings, origin/CSRF protections appropriate to mutation style, output escaping, restricted rich text. |
| Open redirect | Allowlisted origins and validated relative return paths. |
| Enumeration or brute force | Provider protections, generic auth errors, and proportionate rate limits. |
| Supply-chain compromise | Lockfile, dependency review, minimal packages, CI scanning, and controlled deployment credentials. |

## Input and output handling

Validate all route parameters, search queries, progress commands, authoring files, hotspot coordinates, media metadata, and access inputs at the trust boundary. Unknown fields should be rejected in administrative schemas unless explicitly allowed.

Authored Markdown is trusted editorial input only after review, but rendering must still use an allowlisted safe subset. Do not permit arbitrary HTML, scripts, event handlers, iframes, or unsafe URLs in learning content. React escaping does not make arbitrary HTML injection safe.

## Sessions and browser controls

Use HTTPS and secure, HTTP-only session cookies through the selected Neon Auth server-rendering flow, with an appropriate SameSite setting. Apply a Content Security Policy compatible with Next.js and the selected media domain, plus frame, referrer, MIME-sniffing, and permissions policies appropriate to the product.

CORS is not a substitute for authorization. Keep allowed origins narrow for any cross-origin media or API behavior.

## Database security

- Use least-privilege roles and explicit grants.
- Enable and test RLS on exposed user-owned tables.
- Include both row visibility and write checks.
- Keep publishing and other administrative database roles unavailable to browser code.
- Avoid dynamic SQL from untrusted input.
- Preserve audit context for privileged publication.
- Treat database views/functions as security surfaces and review their execution privileges.

The Phase 1B access-path decision must document how a verified Neon Auth identity is represented inside PostgreSQL for RLS. No policy may trust an unverified browser claim. If the Neon Data API is selected for any client-accessible path, every exposed table requires reviewed grants and RLS before exposure. Direct PostgreSQL access must preserve equivalent per-request identity and least privilege. Do not depend on the legacy Neon RLS / Neon Authorize product.

## Branch security

Neon branches isolate changes, but a child branch may begin with database and Neon Auth state from its parent. Treat every branch connection and auth endpoint as an environment-specific secret boundary. Restrict production-derived personal data, prefer schema-only or sanitized data where appropriate, and remove temporary branches according to a defined retention policy. Branching is not a substitute for grants, RLS, or application authorization.

## Media security

Uploads are administrative only in v0.1. Verify type by file content, allowlist formats, enforce limits, strip risky metadata, and use immutable keys. Do not expose R2 write credentials. Future signed delivery must bind short expiry and canonical object identity after entitlement checks.

## Secrets

Secrets live in environment-specific secret stores. Rotate a secret after suspected exposure and audit dependent deployments. Never copy production data or secrets into design files, documentation examples, support tickets, or local defaults.

## Logging and privacy

Log authentication outcomes, authorization denials, server failures, publication results, and operational identifiers needed for diagnosis. Do not log passwords, tokens, full cookies, privileged headers, or unnecessary raw search text. Define analytics consent, vendor, retention, and privacy notice before collecting nonessential product analytics.

## Abuse and availability

Apply request size bounds, query limits, database timeouts, and rate limits to authentication, search, progress mutation, media signing, and publishing as risk warrants. Cache public published content and immutable media; never cache private user responses in a shared cache.

## Incident baseline

Before public beta, assign an owner and write a short runbook covering credential revocation, Railway rollback, Neon Auth session invalidation options, content unpublication, user notification assessment, and evidence preservation. Provider-specific incident steps remain open until accounts exist.

## Security release checklist

- No privileged secrets in the browser bundle or repository.
- RLS negative tests pass for every user-owned table.
- Draft and archived content cannot be loaded or searched by normal users.
- Authentication redirects and session expiry are safe.
- Authored Markdown and media inputs reject active content.
- Dependency and production-build checks pass.
- Error pages and logs do not leak configuration or database detail.

## Explicit non-goals

No payment-card handling, billing webhooks, simulator telemetry, public upload, community authoring, or custom identity service exists in v0.1. Each would require an updated threat model before implementation.
