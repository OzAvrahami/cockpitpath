# CockpitPath — Technical Architecture Overview

**Document Status:** Proposed v0.1
**Product:** CockpitPath
**Architecture Scope:** MVP / Beta v0.1
**Last Updated:** 2026-08-24

## 1. Purpose

This document defines the high-level technical architecture for CockpitPath v0.1.

The architecture must support the current MVP while remaining capable of evolving toward:

* Multiple aircraft
* Additional simulator implementations
* Larger structured content libraries
* Future entitlements
* Additional learning experiences
* Future simulator integrations

The architecture should not introduce infrastructure for speculative features before they are needed.

---

# 2. Architecture Principles

CockpitPath should follow these principles.

## 2.1 One Product, One Primary Web Application

The public website and authenticated learning application should initially live in the same web application and repository.

Do not create separate frontend and backend applications unless a future requirement clearly justifies that separation.

---

## 2.2 Web First

CockpitPath v0.1 is a responsive web application.

Primary device classes:

* Desktop
* Second monitor
* Narrow simulator companion window
* iPad / tablet
* Mobile

Native applications are outside v0.1.

---

## 2.3 Structured Content, Not Hard-Coded Screens

Aircraft learning content must remain separate from UI implementation.

The UI should render structured domain data representing:

* Aircraft
* Simulator implementations
* Journeys
* Procedures
* Procedure Steps
* Controls
* Panels
* Hotspots
* Systems
* System Components
* Concepts
* Media Assets
* Verification metadata

---

## 2.4 Server-Enforced Access

The browser must not be treated as the security boundary.

Future FREE / PRO / PACK access decisions must be enforceable through the server and data layer.

Hiding UI elements is not sufficient access control.

---

## 2.5 Static Where Possible, Dynamic Where Necessary

Published learning content changes relatively infrequently.

User progress and authentication state change frequently.

CockpitPath should optimize these differently.

Published content should be cacheable.

Private progress should remain dynamic and user-specific.

---

## 2.6 Media Is a First-Class Architecture Concern

CockpitPath depends heavily on:

* High-resolution cockpit images
* Responsive image delivery
* Zoomable panel images
* Hotspot overlays
* Procedure imagery
* Aircraft imagery

Media storage and delivery should therefore be treated separately from ordinary application data.

---

# 3. Selected Technology Baseline

The recommended v0.1 stack is:

| Layer                         | Technology                              |
| ----------------------------- | --------------------------------------- |
| Web application               | Next.js                                 |
| Language                      | JavaScript                              |
| UI                            | React                                   |
| Application hosting           | Railway                                 |
| Database                      | PostgreSQL via Supabase                 |
| Authentication                | Supabase Auth                           |
| Authorization                 | Application rules + PostgreSQL RLS      |
| Media storage                 | Cloudflare R2                           |
| Media delivery                | Cloudflare CDN / controlled R2 delivery |
| Database migrations           | SQL migrations                          |
| Structured content validation | Runtime schema validation               |
| Search                        | PostgreSQL initially                    |
| Payments                      | None in v0.1                            |

Use current supported stable versions at implementation time rather than permanently tying the architecture to a specific patch version.

---

# 4. High-Level Architecture

The deployment view below is complemented by the module and trust-boundary [dependency map](dependency-map.md).

```text
                         ┌───────────────────────┐
                         │       Browser         │
                         │                       │
                         │ Desktop / iPad /      │
                         │ Companion / Mobile    │
                         └───────────┬───────────┘
                                     │
                                     │ HTTPS
                                     ▼
                         ┌───────────────────────┐
                         │      Next.js App      │
                         │       Railway         │
                         │                       │
                         │ Server Components     │
                         │ Route Handlers        │
                         │ Server Actions        │
                         │ Client Components     │
                         └──────┬────────┬───────┘
                                │        │
                     Auth/Data  │        │ Media
                                │        │
                                ▼        ▼
                  ┌─────────────────┐   ┌──────────────────┐
                  │    Supabase     │   │ Cloudflare R2    │
                  │                 │   │                  │
                  │ PostgreSQL      │   │ Cockpit Images   │
                  │ Auth            │   │ Panel Images     │
                  │ RLS             │   │ Media Assets     │
                  └─────────────────┘   └──────────────────┘
```

---

# 5. Web Application

CockpitPath should use the Next.js App Router with JavaScript.

The application should contain both:

* Public marketing routes
* Authenticated learning routes

within one application.

Conceptual route structure:

```text
/
├── aircraft
├── aircraft/[aircraftSlug]
├── learn/[journeySlug]
├── procedure/[procedureSlug]
├── cockpit/[aircraftSlug]
├── systems/[aircraftSlug]/[systemSlug]
├── progress
├── account
├── sign-in
└── sign-up
```

Exact routing will be defined during implementation.

---

# 6. JavaScript Strategy

CockpitPath should use plain JavaScript for the application.

JavaScript does not remove the need for strong application contracts.

The project must still use:

* Runtime schema validation
* Database constraints
* Foreign keys
* Content validation
* Explicit domain models
* Tests
* Clear module boundaries
* Predictable data contracts

Where useful, a runtime validation library such as Zod may be used.

Validation is especially important for:

* Structured content
* Progress mutations
* Publishing
* Route parameters
* Hotspot coordinates
* Media metadata
* Access-control input

The project should not require TypeScript.

Application source files should use JavaScript consistently unless a third-party generated file requires another format.

---

# 7. No Separate API Server for v0.1

CockpitPath should not begin with a separate Express, NestJS, or similar backend service.

The initial server boundary should live inside Next.js using:

* Server Components
* Server Actions
* Route Handlers
* Server-only modules

This keeps deployment and application architecture simpler.

A separate backend service may be introduced later if CockpitPath develops requirements such as:

* Large background-processing workloads
* Simulator integration services
* External public APIs
* Dedicated processing workers
* Long-running tasks unsuitable for web requests

None of these currently justify a separate backend.

---

# 8. Rendering Strategy

CockpitPath should use different rendering strategies for different data categories.

## 8.1 Public Marketing Content

May use:

* Static rendering
* Cached server rendering
* Revalidation where appropriate

---

## 8.2 Published Aircraft Content

Published learning content should be strongly cacheable.

Examples:

* Aircraft metadata
* Journey structure
* Procedure content
* Controls
* Systems
* Concepts

Publishing updated content should invalidate relevant caches.

---

## 8.3 Private User Data

Private data must remain dynamic.

Examples:

* User progress
* Resume position
* Account information
* Entitlements

Private data must never be shared through public caches.

---

# 9. Server vs Client Components

Prefer Server Components by default.

Use Client Components when browser interaction requires them.

Examples of appropriate Client Components include:

* Guide Mode step interaction
* Quick / Learn toggle
* Focus Mode
* Cockpit zoom and pan
* Hotspot interaction
* Cockpit Explorer navigation
* System diagram interaction
* Bottom sheets
* Drawers
* Local optimistic progress state

Do not turn complete pages into Client Components unnecessarily.

---

# 10. Application State

Avoid introducing a large global state library during v0.1 unless real requirements appear.

Prefer:

## Server State

Database-backed application state.

## URL State

Navigation state where meaningful.

Examples:

* Current aircraft
* Current system
* Selected procedure where appropriate

## Local React State

Temporary interactive UI state.

Examples:

* Selected hotspot
* Diagram selection
* Expanded explanation
* Current zoom level
* Bottom-sheet state

## Persistent Progress

Stored in PostgreSQL.

Redux or an equivalent global state system is not currently required.

---

# 11. Database

CockpitPath should use PostgreSQL hosted through Supabase.

PostgreSQL fits CockpitPath because its domain is strongly relational.

Examples:

```text
Aircraft
   ↓
Implementation
   ↓
Journey
   ↓
Procedure
   ↓
Procedure Step
   ↓
Control
   ↓
System
```

Many entities also have many-to-many relationships.

A relational database is preferable to treating the learning library as independent documents.

---

# 12. Supabase Responsibilities

Supabase should initially provide:

* PostgreSQL hosting
* Authentication
* Row Level Security support
* Server-side data access
* Database management
* Migration workflow integration

CockpitPath should not depend unnecessarily on every Supabase product.

For example, primary cockpit media is stored separately in Cloudflare R2.

---

# 13. Database Access

CockpitPath should initially use explicit Supabase/PostgreSQL access rather than introducing an ORM by default.

Schema and access logic should remain clear through:

* SQL migrations
* Explicit queries
* Database constraints
* RLS policies
* Database functions where useful
* Views where useful

Runtime application validation should be used where data enters the application.

An ORM may be evaluated later if it provides clear benefits without obscuring:

* SQL behavior
* Security
* Relationships
* Performance

---

# 14. Database Migrations

Database structure must be managed through version-controlled migrations.

Migrations should include:

* Tables
* Constraints
* Foreign keys
* Indexes
* RLS configuration
* Grants
* Functions
* Views
* Access-control changes

Production database changes should not depend on manual dashboard edits alone.

---

# 15. Authentication

CockpitPath should use Supabase Auth for v0.1.

Required capabilities:

* Sign up
* Sign in
* Sign out
* Persistent session
* Password reset
* Account identity

Initial authentication should remain simple.

Email/password authentication is sufficient for the MVP.

Additional authentication methods may be evaluated later.

---

# 16. Session Architecture

Authentication should work with Next.js server rendering.

The application must be able to determine the authenticated user during server requests.

Private application routes should not rely solely on client-side redirects.

Session state must be usable from:

* Server Components
* Server Actions
* Route Handlers
* Browser interactions

---

# 17. Authorization

Authorization should use two layers.

## 17.1 Application Layer

The server decides what operation the user is attempting.

Examples:

* Open protected content
* Update progress
* Request protected media
* Access future premium content

## 17.2 Database Layer

PostgreSQL RLS provides defense in depth.

Example:

```text
User A
→ can read User A progress

User A
→ can update User A progress

User A
→ cannot read User B progress

User A
→ cannot modify User B progress
```

Published content may use different policies based on access rules.

---

# 18. RLS Policy

Every exposed application table should explicitly define:

* Required grants
* Whether RLS is enabled
* SELECT policy
* INSERT policy
* UPDATE policy
* DELETE policy where applicable

Do not depend on accidental default permissions.

RLS policies should be tested.

---

# 19. Privileged Database Access

Administrative or publishing operations may require privileged server access.

Privileged credentials must:

* Remain server-only
* Never appear in browser bundles
* Never be exposed through public environment variables

Privileged access should only be used when user-scoped access is inappropriate.

---

# 20. Content Architecture

CockpitPath needs two distinct content concepts:

## Authoring Source

Where CockpitPath maintainers create, edit, review, and version learning content.

## Published Runtime Content

The validated content served to users.

Recommended v0.1 model:

```text
Version-controlled structured content
             ↓
Schema validation
             ↓
Reference validation
             ↓
Verification checks
             ↓
Publishing process
             ↓
PostgreSQL runtime content
```

This provides:

* Version history
* Code review
* Validation
* Repeatable publishing
* Rollback
* Relationship checking

---

# 21. Content Authoring Source of Truth

For v0.1, learning content should initially be maintained in the repository rather than through a custom CMS.

The exact authoring format will be defined in:

`docs/architecture/content-system.md`

Possible formats include:

* JSON
* YAML
* Markdown with structured metadata

The format should support:

* Human editing
* Validation
* Stable IDs
* References
* Version control
* Content review

---

# 22. Content Publishing Pipeline

A content publishing command should conceptually perform:

```text
Read content
    ↓
Validate schema
    ↓
Validate IDs
    ↓
Validate references
    ↓
Validate media references
    ↓
Validate aircraft implementation
    ↓
Validate relationships
    ↓
Validate publication state
    ↓
Reject errors
    ↓
Publish validated content
```

Invalid content should fail publishing.

It should never silently enter production.

---

# 23. Content Versioning

Published content should support version identity.

This helps with:

* Updates
* Verification
* Rollback
* Progress compatibility
* Debugging
* Auditing

A content update should not automatically destroy user progress.

Progress compatibility rules will be defined separately.

---

# 24. Content States

Internal content may use states such as:

```text
DRAFT
REVIEW
VERIFIED
PUBLISHED
ARCHIVED
```

Only appropriate published content should appear in the user application.

Verification and publication are related but should remain distinct concepts.

---

# 25. Media Storage

CockpitPath should use Cloudflare R2 for primary learning media.

Examples:

* Full cockpit images
* Panel images
* Control close-ups
* Guide Mode images
* Aircraft imagery
* Supporting diagrams
* Future media assets

Media binaries should not be stored directly in PostgreSQL.

---

# 26. Media Metadata

PostgreSQL should store media metadata.

Conceptual example:

```text
MediaAsset
├── id
├── type
├── aircraft_implementation_id
├── storage_key
├── width
├── height
├── mime_type
├── capture_context
├── verification_status
├── created_at
└── updated_at
```

The binary file remains in object storage.

---

# 27. Media Identity

Content should reference media through stable media IDs.

Prefer:

```text
media_asset_id
```

instead of hard-coded URLs.

Example:

```text
Procedure Step
      ↓
media_asset_id
      ↓
Media Asset
      ↓
storage_key
      ↓
Delivery URL
```

This allows the delivery layer to change without rewriting learning content.

---

# 28. Media Delivery

During the free beta, published learning imagery may be served from a dedicated media domain.

Conceptual example:

```text
assets.cockpitpath.com
```

The exact domain is not locked.

Media should support:

* Long-lived caching
* Versioned or immutable object keys
* Responsive variants
* Efficient browser delivery

---

# 29. Future Protected Media

Future premium content may require protected media access.

The architecture should allow:

```text
Authenticated request
        ↓
Access check
        ↓
Temporary authorized media access
        ↓
R2 object
```

The storage bucket itself should not become the entitlement system.

v0.1 does not need complex premium-media enforcement because beta content is free.

---

# 30. Responsive Media

CockpitPath should not deliver the largest available cockpit image to every device.

The media system should eventually support variants such as:

```text
thumbnail
small
medium
large
original
```

The exact image-processing implementation will be defined in the media architecture.

---

# 31. Hotspot Architecture

Hotspots must remain separate from images.

The image is:

**Base visual media**

The hotspot is:

**Structured spatial metadata**

Conceptual model:

```text
Hotspot
├── id
├── media_asset_id
├── target_type
├── target_id
├── x
├── y
├── width
├── height
├── shape
└── sort_order
```

Coordinates should preferably use normalized values.

Example:

```text
x = 0.42
y = 0.18
width = 0.08
height = 0.06
```

rather than fixed pixels.

This allows hotspots to scale with responsive imagery.

---

# 32. Cockpit View Hierarchy

Cockpit Explorer should not treat every screenshot as an unrelated asset.

The model should support a visual hierarchy.

Example:

```text
Full Cockpit
    ↓
Overhead
    ↓
Electrical Area
    ↓
Battery Switch
```

This hierarchy powers:

* Breadcrumbs
* Guide me there
* Search navigation
* Progressive hotspot density
* Visual orientation

---

# 33. Guide Mode Media

A Guide Mode step may reference:

* A cockpit view
* A media asset
* A control
* A hotspot or target region

The UI should render the appropriate visual annotation dynamically.

Procedure steps should not require separate permanently annotated image files for every action.

---

# 34. Progress Architecture

User progress belongs in PostgreSQL.

Progress must remain separate from published content.

Conceptually:

```text
Published Procedure Content
           │
           │ referenced by
           ▼
       User Progress
```

Do not modify procedure records to store individual user completion.

---

# 35. Progress Granularity

The architecture should support:

* Journey progress
* Procedure progress
* Current section
* Current step
* Completed steps
* Skipped steps where relevant
* Completed procedures
* Last learning position
* Last activity timestamp

The detailed schema will be defined in `data-model.md`.

---

# 36. Auto-Save

Guide Mode should auto-save after meaningful actions.

Examples:

* Step completed
* Step skipped
* Procedure transition
* Journey position changed

The user should not need to press Save.

---

# 37. Optimistic Progress

Guide Mode may update the interface immediately and persist the change afterward.

Example:

```text
User clicks Done — Next
        ↓
UI advances immediately
        ↓
Progress save sent
        ↓
Server confirms persistence
```

Errors must still be handled.

The user should not silently lose learning progress.

---

# 38. Progress Idempotency

Progress writes should be safe to retry.

Completing the same step multiple times must not create duplicate completion records.

This protects against:

* Double click
* Network retry
* Mobile connectivity issues
* Optimistic UI retry

---

# 39. Resume Architecture

The application should be able to determine a user's best resume target.

Conceptually:

```text
User
 ↓
Active Journey Progress
 ↓
Current Procedure
 ↓
Current Step
 ↓
Continue Learning target
```

Resume calculation should be domain logic rather than hard-coded inside the Aircraft Page.

---

# 40. Entitlement Architecture

Billing is not part of v0.1.

Entitlement compatibility is.

Future access should conceptually support:

```text
User
  +
Content
  +
Entitlement
  ↓
Access Decision
```

Possible future access classifications include:

* FREE
* PRO
* PACK

---

# 41. Separation of Concerns

Keep these concepts separate:

```text
Billing
Entitlement
Progress
Content
```

A future payment may generate an entitlement.

The entitlement provides access.

Progress remains independent.

Content remains independent.

---

# 42. Centralized Access Control

Avoid scattering checks such as:

```text
if (user.isPro)
```

through UI components.

Access decisions should use centralized domain logic.

Conceptually:

```text
canAccessContent({
  user,
  content,
  entitlements
})
```

The implementation may combine:

* Server-side rules
* Database policies
* Content metadata
* Entitlement records

---

# 43. Search

Cockpit Explorer v0.1 search should use PostgreSQL.

Do not introduce a dedicated search service initially.

Initial searchable fields may include:

* Control name
* Control aliases
* Panel
* System
* Aircraft implementation

PostgreSQL search and trigram-style matching should be sufficient initially.

---

# 44. Search Aliases

Controls may store search aliases.

Example:

```text
Battery Switch

Aliases:
- battery
- battery master
- power switch
```

Aliases support discovery.

They do not replace canonical aviation terminology.

---

# 45. Future Global Search

The architecture should allow search to later include:

* Controls
* Systems
* System Components
* Concepts
* Procedures

A dedicated external search system should only be introduced if PostgreSQL becomes insufficient.

---

# 46. Internal API Boundary

CockpitPath v0.1 does not need a public developer API.

Application operations may use:

* Server Actions
* Route Handlers
* Server-side domain modules

Examples:

```text
Complete step
Save progress
Load journey
Search controls
Resolve resume target
Generate media access
Load system
Publish content
```

Do not create REST endpoints simply for architectural appearance.

---

# 47. Domain Layer

Important application behavior should not live directly inside React components.

Reusable domain modules should handle logic such as:

* Progress calculation
* Resume calculation
* Journey structure
* Access decisions
* Content relationships
* Verification rules
* Search normalization

This makes logic independently testable.

---

# 48. Suggested Application Boundaries

Conceptually:

```text
Presentation
     ↓
Domain
     ↓
Data Access
     ↓
PostgreSQL / External Services
```

Additional cross-cutting areas include:

```text
Authentication
Authorization
Media
Content Publishing
Validation
```

These are module boundaries.

They do not require separate network services.

---

# 49. Runtime Validation

Application assumptions do not replace runtime validation.

Validate data crossing trust boundaries.

Examples:

* Progress updates
* Search requests
* Content publishing input
* Hotspot coordinates
* Route parameters
* Media metadata
* Access requests

Validation should fail clearly.

---

# 50. Caching

Caching should distinguish between data categories.

## Published Content

Cache aggressively where safe.

## User Progress

Never share cache between users.

## Account Data

Private and dynamic.

## Access Decisions

User-specific.

## Media

CDN/object caching appropriate to asset versioning.

---

# 51. Content Cache Invalidation

Publishing updated content should invalidate relevant cached content.

Prefer targeted invalidation.

Possible units:

* Aircraft
* Journey
* Procedure
* Cockpit view
* System

Avoid flushing all caches for every content change.

---

# 52. Performance Priorities

CockpitPath performance priorities are:

1. Guide Mode becomes usable quickly.
2. Current-step imagery loads quickly.
3. Cockpit Explorer interaction remains responsive.
4. Tablet performance remains strong.
5. Narrow-window behavior remains responsive.
6. Large unused images are not downloaded unnecessarily.

---

# 53. Image Prefetching

Guide Mode may prefetch upcoming images.

Conceptually:

```text
Current step loaded
        ↓
User reads / performs action
        ↓
Next step image prefetched
```

Do not preload every high-resolution image in a complete journey.

---

# 54. Deployment

The primary Next.js application should be deployed to Railway.

Deployment should originate from the GitHub repository.

The production configuration should use an appropriate Next.js production server build.

---

# 55. Deployment Topology

Initial production topology:

```text
Railway
└── CockpitPath Web
       │
       ├── Supabase
       │   ├── PostgreSQL
       │   └── Auth
       │
       └── Cloudflare
           └── R2 Media
```

No Redis, separate API server, or worker service is required initially.

---

# 56. Environments

CockpitPath should support at least:

## Local

Developer environment.

## Staging

Used for testing:

* Migrations
* Content
* Releases
* Publishing

## Production

User-facing environment.

Production credentials should not be reused as development defaults.

---

# 57. Environment Configuration

Configuration should be divided into:

## Browser-Safe Configuration

Only values intentionally safe for browser exposure.

## Server Secrets

Examples:

* Privileged database credentials
* R2 credentials
* Future third-party API secrets

Server secrets must never be bundled into browser code.

---

# 58. Security Baseline

v0.1 should include:

* HTTPS
* Secure authentication handling
* RLS
* Explicit database grants
* Server-side authorization
* Runtime input validation
* No browser-side secrets
* Protected privileged operations
* Content access enforcement
* Safe media upload rules
* Rate limiting where appropriate

---

# 59. Content Trust

Content verification status is part of the domain model.

CockpitPath must distinguish between:

* Draft content
* Content under review
* Verified content
* Published content

Design placeholder content must never become production truth automatically.

---

# 60. Content Verification Metadata

The architecture should support metadata such as:

* Aircraft
* Simulator
* Add-on
* Add-on version
* Simulator version
* Verification status
* Last verified date
* Source references
* Simulator-specific notes

Fields may be empty until actually verified.

Do not invent values to satisfy the schema.

---

# 61. Observability

v0.1 should provide basic operational visibility.

At minimum:

* Application logs
* Deployment logs
* Server errors
* Content publishing failures
* Migration failures

A dedicated error-monitoring provider may be selected during implementation.

It is not locked by this architecture document.

---

# 62. Product Analytics

Product analytics should sit behind a small application abstraction.

Potential events include:

```text
journey_started
journey_resumed
step_completed
procedure_completed
cockpit_explorer_opened
cockpit_control_opened
cockpit_search_used
system_opened
```

Do not tightly couple the application to one analytics vendor.

---

# 63. Testing Strategy

The project should support several test layers.

## Unit Tests

Domain logic.

Examples:

* Progress calculation
* Resume logic
* Access decisions
* Content validation

## Integration Tests

Database and server behavior.

Examples:

* RLS
* Progress persistence
* Publishing
* Search

## Component Tests

Interactive UI behavior.

Examples:

* Guide Mode navigation
* Hotspot selection
* Quick / Learn behavior

## End-to-End Tests

Critical product journeys.

Example:

```text
Sign in
→ Start journey
→ Complete steps
→ Leave application
→ Return
→ Continue Learning
→ Resume correct step
```

---

# 64. RLS Testing

Database security policies should be tested explicitly.

Required examples:

```text
User A cannot read User B progress.

User A cannot modify User B progress.

Anonymous users cannot access authenticated-only records.

Published FREE content follows the expected access policy.

Draft content is not publicly accessible.
```

Future entitlement tests should be added when paid access is introduced.

---

# 65. Accessibility Architecture

Interactive visual components must expose semantic alternatives.

Examples:

## Hotspot

Visual region + accessible control name.

## System Node

Visual element + keyboard-selectable semantic control.

## Diagram Relationship

Visual connection + textual description where required.

Accessibility must not depend exclusively on pixel coordinates.

---

# 66. Localization Readiness

CockpitPath v0.1 is English-only.

The architecture should still avoid unnecessary localization blockers.

Examples:

* UI strings should remain distinguishable from domain IDs.
* Content may carry language metadata later.
* Stable entity IDs should not depend on translated names.

A complete localization platform is not required.

---

# 67. Future Simulator Integration

Future simulator integration must remain optional.

A possible later architecture may add:

```text
Microsoft Flight Simulator
          ↓
Local CockpitPath Integration
          ↓
CockpitPath Web Platform
```

This is not part of v0.1.

The web application must remain fully useful without simulator telemetry.

---

# 68. Future Background Processing

A worker service may eventually be useful for:

* Image variant generation
* Media processing
* Large content imports
* Notifications
* Simulator-event processing

No worker infrastructure is required initially.

Long-running work should be separated from normal web requests if and when it becomes necessary.

---

# 69. Avoid Premature Infrastructure

Do not introduce during v0.1 without demonstrated need:

* Kubernetes
* Microservices
* Redis
* Kafka
* GraphQL server
* Dedicated search cluster
* Separate API repository
* Separate frontend repository
* Event bus
* Complex job queue
* Multi-region database
* Custom CMS platform

CockpitPath does not currently need these.

---

# 70. Scaling Philosophy

Early CockpitPath bottlenecks are more likely to be:

* Content production
* Media delivery
* Content verification
* Image quality
* Learning UX

rather than raw transaction throughput.

Architecture should optimize accordingly.

Do not build for hypothetical massive concurrency before the product is validated.

---

# 71. Repository Direction

CockpitPath should initially use one repository.

The repository will conceptually contain:

```text
Application
Structured content
Content schemas
Database migrations
Tests
Documentation
Design references
Publishing tools
Development scripts
```

Exact repository structure will be defined separately.

---

# 72. Architectural Boundaries

The application should maintain clear boundaries between:

```text
Presentation
Domain
Content
Persistence
Authentication
Authorization
Media
Validation
```

These boundaries should initially exist as project modules rather than separate services.

---

# 73. Key Architecture Decisions

CockpitPath v0.1 therefore chooses:

## Web

Next.js App Router.

## Language

JavaScript.

## UI

React.

## Deployment

Railway.

## Database

Supabase PostgreSQL.

## Authentication

Supabase Auth.

## Authorization

Server-side domain rules plus PostgreSQL RLS.

## Media

Cloudflare R2.

## Content

Version-controlled structured authoring → validation → publishing → PostgreSQL.

## Search

PostgreSQL initially.

## Backend

Next.js server boundary.

No separate API server.

## State

Server state + local React state + persistent PostgreSQL progress.

No global state library by default.

## Billing

Not implemented in v0.1.

Architecture remains entitlement-ready.

## Simulator Integration

Not implemented in v0.1.

---

# 74. Recommended Architecture Decision Records

Important decisions should receive ADRs.

Initial ADR candidates:

```text
ADR-0001 — Web-First Next.js Application
ADR-0002 — Plain JavaScript Application
ADR-0003 — PostgreSQL and Supabase Platform
ADR-0004 — Cloudflare R2 for Learning Media
ADR-0005 — Structured Content Separate from UI
ADR-0006 — Single Application / No Separate Backend
ADR-0007 — Database-Level RLS
ADR-0008 — Entitlement-Ready Access Model
ADR-0009 — Dynamic Hotspots over Base Images
ADR-0010 — Repository-Based Content Authoring
```

---

# 75. Detailed Architecture Documents

This overview intentionally does not define every implementation detail. The v0.1 foundation is completed by:

```text
docs/architecture/
├── overview.md
├── dependency-map.md
├── data-model.md
├── authentication.md
├── content-system.md
├── media-assets.md
├── access-control.md
├── progress-model.md
├── search.md
├── deployment.md
├── security.md
└── testing-strategy.md
```

Content authoring and publication contracts live under `docs/content/`. Accepted decision history lives under `docs/decisions/`. These documents must remain consistent with this architecture baseline.

---

# 76. Architecture Summary

CockpitPath v0.1 uses a deliberately simple architecture:

```text
Next.js + JavaScript
        ↓
Supabase PostgreSQL + Auth
        ↓
Cloudflare R2 Media
        ↓
Railway Deployment
```

The product remains one application and one repository.

The architecture prioritizes:

* Structured reusable learning content
* Strong content validation
* Content accuracy
* Media-heavy learning experiences
* Secure user progress
* Responsive simulator-companion UX
* Future multi-aircraft support
* Future entitlement support

without introducing infrastructure that the MVP does not yet need.

---

## Status

**CockpitPath Technical Architecture Overview v0.1**

Architecture baseline established.

Ready for detailed domain and data-model design.
