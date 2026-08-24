# CockpitPath — Data Model

**Document Status:** Proposed v0.1
**Product:** CockpitPath
**Architecture Scope:** MVP / Beta v0.1
**Last Updated:** 2026-08-24

## 1. Purpose

This document defines the CockpitPath domain data model before implementation as PostgreSQL tables.

The model must support the connected CockpitPath learning experience:

```text
Aircraft
   ↓
Aircraft Implementation
   ↓
Journey
   ↓
Procedure
   ↓
Procedure Step
   ↓
Cockpit Control
   ↓
Aircraft System
   ↓
Concept
```

At the same time, the model must support:

* Real cockpit imagery
* Progressive cockpit navigation
* Dynamic hotspots
* Aircraft Systems diagrams
* Verification metadata
* Search
* User progress
* Resume
* Future entitlements
* Multiple aircraft later

This document defines domain entities and relationships.

It is not yet the final SQL schema.

---

# 2. Core Modeling Principles

## 2.1 Stable Identity

Every important domain entity should have a stable internal identity.

Display names are allowed to change.

Stable IDs must not depend on display text.

---

## 2.2 UUID Primary Keys

Primary application entities should generally use UUID identifiers.

Example:

```text
procedure.id
control.id
system.id
```

UUIDs are internal database identities.

Content authors should not be expected to manually work with UUIDs.

---

## 2.3 Stable Content Keys

Repository-authored content should use human-readable stable keys.

Examples:

```text
aircraft.b737-max-8

implementation.ifly-b737-max-8-msfs2024

journey.cold-dark-to-takeoff

procedure.power-up

step.power-up.battery-on

control.battery-switch

system.electrical

concept.standby-power
```

The naming convention is defined in [Content Key Conventions](../content/content-key-conventions.md).

A content key:

* Must be unique
* Must remain stable after publication
* Must not depend on display wording
* Must not be reused for unrelated content

Publishing resolves these keys to database identities.

---

# 3. Content Identity Layer

CockpitPath contains many different kinds of learning content that share common requirements.

Examples:

* Verification
* Publishing status
* Source references
* Revision information
* Future access rules

Instead of duplicating all common metadata independently, CockpitPath should use a shared conceptual entity:

`ContentRecord`

---

# 4. ContentRecord

Conceptual structure:

```text
ContentRecord
├── id
├── content_key
├── kind
├── status
├── locale
├── revision
├── content_hash
├── access_class
├── required_entitlement_key
├── published_at
├── archived_at
├── created_at
└── updated_at
```

Possible `kind` values include:

```text
JOURNEY
PROCEDURE
PROCEDURE_STEP
COCKPIT_AREA
CONTROL
SYSTEM
SYSTEM_COMPONENT
SYSTEM_LEARNING_SECTION
CONCEPT
```

Additional content kinds may be introduced later.

`ContentRecord.status` is the sole canonical editorial lifecycle state. Any publishable domain entity with a `content_record_id` derives `DRAFT`, `REVIEW`, `VERIFIED`, `PUBLISHED`, or `ARCHIVED` from this record and must not persist a duplicate lifecycle field. Other domain state must use a distinct name and enum, such as `availability`, `support_status`, `progress_status`, or `verification_status`.

---

# 5. Content Status

Possible internal states:

```text
DRAFT
REVIEW
VERIFIED
PUBLISHED
ARCHIVED
```

Important distinction:

**Verified** means content has passed the required verification process.

**Published** means the content is allowed to appear to users.

A verified item is not automatically required to be published.

---

# 6. Content Revision

`revision` identifies the published revision of a logical content entity.

Example:

```text
step.power-up.battery-on

revision 1
revision 2
revision 3
```

The stable logical step remains the same.

User progress continues to reference the same logical step.

---

# 7. Breaking Content Changes

Not every content change should preserve identity.

Example:

Changing:

```text
BATTERY → ON
```

to a clearer wording still represents the same step.

The stable ID remains.

However, replacing the step with a completely different operation may require a new step identity.

This protects historical progress from being silently reinterpreted.

---

# 8. Content Archiving

Published content should generally be archived rather than physically deleted.

This is especially important when user progress references it.

Example:

```text
Old Procedure Step
      ↓
ARCHIVED
      ↓
Existing historical progress remains valid
```

Do not cascade-delete user learning history when editorial content is removed.

---

# 9. Aircraft

`Aircraft` represents the real aircraft model or variant independent of simulator implementation.

Example:

```text
Aircraft
├── id
├── manufacturer
├── family
├── variant
├── display_name
├── slug
├── created_at
└── updated_at
```

Example:

```text
manufacturer: Boeing
family: 737 MAX
variant: 8
display_name: Boeing 737 MAX 8
```

---

# 10. Simulator

`Simulator` represents a supported flight simulation platform.

Conceptual structure:

```text
Simulator
├── id
├── name
├── product_family
├── display_name
├── slug
└── support_status
```

Example:

```text
Microsoft Flight Simulator 2024
```

Simulator patch versions should not create a new Simulator record for every update.

Specific tested versions belong to verification metadata.

---

# 11. AddOnProduct

`AddOnProduct` represents the aircraft implementation product.

Conceptual structure:

```text
AddOnProduct
├── id
├── developer_name
├── product_name
├── slug
└── support_status
```

Example:

```text
developer_name: iFly
product_name: Boeing 737 MAX 8
```

---

# 12. AircraftImplementation

This is one of the most important CockpitPath entities.

`AircraftImplementation` represents:

```text
Aircraft
+
Simulator
+
Add-on
```

Example:

```text
Boeing 737 MAX 8
+
Microsoft Flight Simulator 2024
+
iFly
```

Conceptual structure:

```text
AircraftImplementation
├── id
├── aircraft_id
├── simulator_id
├── addon_product_id
├── slug
├── display_name
├── support_status
├── created_at
└── updated_at
```

Almost all detailed CockpitPath learning content is scoped to an AircraftImplementation.

---

# 13. Why Implementation Is Separate

CockpitPath must not assume:

> Boeing 737 MAX 8 procedure = identical everywhere.

Different implementations may differ because of:

* Simulator behavior
* Add-on behavior
* Modeled features
* UI differences
* Version differences

Therefore:

```text
Procedure
Control
Cockpit View
System Content
```

are generally tied to:

`AircraftImplementation`

rather than only to `Aircraft`.

---

# 14. Journey

A `Journey` represents a structured learning path through multiple procedures.

Example:

```text
Cold & Dark → Takeoff
```

Conceptual structure:

```text
Journey
├── id
├── content_record_id
├── aircraft_implementation_id
├── slug
├── title
├── description
├── difficulty
├── estimated_scope
└── sort_order
```

v0.1 requires one primary Journey.

---

# 15. JourneySection

A Journey is not a copy of several procedures.

It references reusable Procedures.

Conceptually:

```text
Journey
    ↓
JourneySection
    ↓
Procedure
```

Structure:

```text
JourneySection
├── id
├── journey_id
├── procedure_id
├── sequence
├── title_override
├── required
└── notes
```

Example:

```text
01 → Power Up
02 → IRS & Navigation
03 → Overhead Preparation
...
14 → Takeoff
```

---

# 16. Why JourneySection Exists

The same Procedure may eventually be reused in:

* Different journeys
* Refresher journeys
* Full-flight journeys
* Training scenarios

Journey structure therefore belongs in its own relationship table.

---

# 17. ProcedureGroup

Aircraft Page groups procedures visually.

Example groups:

```text
Power & Preflight
Departure
Arrival & Shutdown
```

These should be content-defined rather than hard-coded into the UI.

Conceptual structure:

```text
ProcedureGroup
├── id
├── aircraft_implementation_id
├── key
├── title
└── sort_order
```

---

# 18. Procedure

A `Procedure` is an independently accessible operational flow.

Examples:

```text
Power Up
IRS & Navigation
Engine Start
Taxi
Takeoff
Shutdown
```

Structure:

```text
Procedure
├── id
├── content_record_id
├── aircraft_implementation_id
├── procedure_group_id
├── slug
├── title
├── short_description
└── sort_order
```

---

# 19. Procedure Step

A Procedure contains ordered `ProcedureStep` records.

Structure:

```text
ProcedureStep
├── id
├── content_record_id
├── procedure_id
├── sequence
├── step_type
├── title
├── action_text
├── location_hint
├── expected_result
├── explanation
├── tip
├── warning
├── optional
└── wait_hint
```

Not every optional text field must contain data.

---

# 20. Procedure Step Types

Supported initial values:

```text
ACTION
VERIFY
WAIT
INFORMATION
MULTI_ACTION
```

These describe interaction semantics, not presentation styling.

---

# 21. Procedure Step Example

Example logical record:

```text
step_type:
ACTION

title:
Battery Switch

action_text:
BATTERY → ON

location_hint:
Overhead → Electrical

expected_result:
Electrical indications become available.

optional:
false
```

Technical text above is illustrative until verified.

---

# 22. Step Ordering

Within one Procedure:

```text
(procedure_id, sequence)
```

must be unique.

Reordering a step should change `sequence`.

It should not automatically create a new step identity.

---

# 23. Controls

A `Control` represents a physical or visual cockpit element.

A control is not limited to switches.

Supported conceptual types may include:

```text
SWITCH
BUTTON
KNOB
LEVER
SELECTOR
DISPLAY
INDICATOR
ANNUNCIATOR
GAUGE
GROUP
OTHER
```

Structure:

```text
Control
├── id
├── content_record_id
├── aircraft_implementation_id
├── cockpit_area_id
├── aircraft_system_id
├── slug
├── canonical_name
├── control_type
├── what_it_does
└── when_used
```

---

# 24. Control Positions

Some controls have possible positions or states.

These represent **possible control positions**, not live simulator state.

Example:

```text
Battery Switch

OFF
ON
```

Conceptual entity:

```text
ControlPosition
├── id
├── control_id
├── value
├── display_label
├── description
└── sort_order
```

CockpitPath v0.1 must never treat this as telemetry.

---

# 25. Control Aliases

Cockpit Explorer search must support beginner-friendly aliases.

Structure:

```text
ControlAlias
├── id
├── control_id
├── alias
└── normalized_alias
```

Example:

```text
Battery Switch

battery
battery master
power switch
```

Canonical terminology remains unchanged.

---

# 26. Related Controls

Controls may have educational relationships.

Example:

```text
Battery Switch
↔ Standby Power
↔ Ground Power
↔ APU Generator Controls
```

Conceptual relation:

```text
ControlRelation
├── control_id
├── related_control_id
├── relation_type
└── sort_order
```

The relationship should not be stored twice unnecessarily.

---

# 27. Procedure Step ↔ Control

A Procedure Step may reference one or multiple cockpit controls.

This must support `MULTI_ACTION`.

Conceptual relation:

```text
ProcedureStepControl
├── procedure_step_id
├── control_id
├── role
├── sequence
└── preferred_hotspot_id
```

Possible roles:

```text
ACTION_TARGET
VERIFY_TARGET
CONTEXT
```

---

# 28. Why Step-Control Relationships Matter

This relationship connects:

```text
Guide Mode
↕
Cockpit Explorer
```

Example:

```text
BATTERY → ON
      ↓
Battery Switch
      ↓
Overhead → Electrical
```

The UI should not duplicate the definition of Battery Switch inside the procedure.

---

# 29. Cockpit Area

CockpitPath needs a semantic cockpit hierarchy independent of screenshots.

Use:

`CockpitArea`

Structure:

```text
CockpitArea
├── id
├── content_record_id
├── aircraft_implementation_id
├── parent_area_id
├── area_type
├── slug
├── title
└── sort_order
```

Possible types:

```text
COCKPIT
REGION
PANEL
AREA
```

---

# 30. Example Cockpit Hierarchy

```text
Full Cockpit
│
├── Overhead
│   │
│   ├── Electrical
│   ├── Fuel
│   ├── Hydraulics
│   └── Pneumatics
│
├── MCP
│
├── Main Instrument Panel
│
└── Center Pedestal
    │
    └── CDU / FMC
```

This hierarchy drives navigation.

---

# 31. Why CockpitArea Is Not an Image

An area describes **where something is**.

A screenshot describes **how that area is visually represented**.

Keeping them separate allows CockpitPath to replace imagery without rebuilding cockpit hierarchy.

---

# 32. Cockpit View

`CockpitView` represents a visual representation of a CockpitArea.

Structure:

```text
CockpitView
├── id
├── aircraft_implementation_id
├── cockpit_area_id
├── media_asset_id
├── view_role
├── title
├── sort_order
└── is_primary
```

Possible roles:

```text
OVERVIEW
PRIMARY
ALTERNATE
GUIDE
CLOSEUP
```

An area may have multiple views.

---

# 33. Example

```text
CockpitArea:
Overhead

CockpitViews:
- Full overhead
- Electrical-biased overhead view
- Guide Mode crop
```

The semantic area remains the same.

---

# 34. Hotspot

A `Hotspot` represents an interactive spatial region over a CockpitView.

Structure:

```text
Hotspot
├── id
├── cockpit_view_id
├── target_cockpit_area_id
├── target_control_id
├── x
├── y
├── width
├── height
├── shape
├── label
└── sort_order
```

For v0.1, rectangular hotspots are sufficient.

---

# 35. Hotspot Target Rule

A hotspot should normally target exactly one of:

```text
target_cockpit_area_id
```

or:

```text
target_control_id
```

Example:

Full cockpit hotspot:

```text
target_cockpit_area = Overhead
```

Electrical-area hotspot:

```text
target_control = Battery Switch
```

---

# 36. Normalized Coordinates

Hotspot coordinates should use normalized values.

Example:

```text
x      = 0.42
y      = 0.18
width  = 0.08
height = 0.06
```

Valid coordinate range:

```text
0.0 → 1.0
```

This allows hotspots to scale with responsive images.

---

# 37. Guide Me There

The following relationships make `Guide me there` possible:

```text
Control
   ↓
CockpitArea
   ↓
Parent CockpitArea
   ↓
Parent CockpitArea
   ↓
Full Cockpit
```

plus Hotspots connecting each visual level.

Example:

```text
Full Cockpit
→ Overhead
→ Electrical
→ Battery Switch
```

No manual hard-coded navigation path should be required for every Guide Mode step.

---

# 38. Media Asset

`MediaAsset` represents stored media metadata.

The binary file itself lives in Cloudflare R2.

Structure:

```text
MediaAsset
├── id
├── aircraft_implementation_id
├── asset_type
├── storage_key
├── mime_type
├── width
├── height
├── original_filename
├── capture_context
├── captured_addon_version
├── captured_simulator_version
├── verification_status
├── created_at
└── updated_at
```

---

# 39. Media Variants

Large source imagery may have multiple delivery variants.

Conceptual entity:

```text
MediaVariant
├── id
├── media_asset_id
├── variant_name
├── storage_key
├── width
├── height
├── file_size
└── mime_type
```

Potential variants:

```text
thumbnail
small
medium
large
original
```

---

# 40. Procedure Step Visual

Not every Procedure Step needs a unique screenshot.

A step may use:

* A CockpitView
* A specific Hotspot
* A dedicated MediaAsset
* Multiple supporting visuals

Conceptual relation:

```text
ProcedureStepVisual
├── procedure_step_id
├── cockpit_view_id
├── media_asset_id
├── hotspot_id
├── role
└── sort_order
```

Possible roles:

```text
PRIMARY
ORIENTATION
SECONDARY
```

---

# 41. Visual Reuse

Whenever practical:

```text
Same cockpit image
+
different dynamic hotspot
```

should be preferred over:

```text
duplicate image files
with baked annotations
```

This reduces media duplication and keeps annotations maintainable.

---

# 42. Aircraft System

`AircraftSystem` represents a learning system within one AircraftImplementation.

Examples:

```text
Electrical
Fuel
Hydraulics
Pneumatics
Air Conditioning
Flight Controls
```

Structure:

```text
AircraftSystem
├── id
├── content_record_id
├── aircraft_implementation_id
├── slug
├── title
├── short_description
└── sort_order
```

---

# 43. System Component

A system contains reusable components.

Example Electrical components:

```text
Aircraft Battery
Ground Power
APU Generator
Engine Generators
AC Power
DC Power
Distribution / Buses
Standby Power
```

Structure:

```text
SystemComponent
├── id
├── content_record_id
├── aircraft_system_id
├── slug
├── title
├── component_type
├── what_it_does
├── why_it_matters
└── sort_order
```

---

# 44. System Component ↔ Control

A System Component may relate to one or multiple cockpit controls.

Example:

```text
Aircraft Battery
      ↓
Battery Switch
```

Relation:

```text
SystemComponentControl
├── system_component_id
├── control_id
├── relation_type
└── sort_order
```

This powers:

`View in Cockpit Explorer`

---

# 45. System Relationships

Aircraft Systems diagrams are generated from structured component relationships.

Conceptual entity:

```text
SystemRelationship
├── id
├── aircraft_system_id
├── source_component_id
├── target_component_id
├── relationship_type
├── label
├── direction
└── sort_order
```

Example:

```text
Aircraft Battery
→ DC Power
```

Technical relationships must be verified before production publication.

---

# 46. System Diagram Rendering

Desktop, tablet, and mobile may render the same relationships differently.

Example:

### Desktop

```text
Sources → Domains → Distribution
```

### Mobile

```text
Sources
  ↓
Domains
  ↓
Distribution
```

The data model stores relationships.

The UI owns responsive geometry.

---

# 47. System Learning Section

Aircraft Systems content is divided into progressive learning sections.

Example Electrical sections:

```text
01 Big Picture
02 Power Sources
03 AC / DC
04 Distribution
05 Standby
06 Controls
07 Operations
```

Structure:

```text
SystemLearningSection
├── id
├── content_record_id
├── aircraft_system_id
├── sequence
├── title
├── summary
└── body
```

---

# 48. Learning Scenarios

Aircraft Systems may support educational scenarios.

Examples:

```text
Aircraft on Battery
Ground Power Available
APU Providing Power
Engines Running
```

Conceptual entity:

```text
SystemScenario
├── id
├── content_record_id
├── aircraft_system_id
├── title
├── description
└── sort_order
```

These are explicitly educational scenarios.

They are not simulator telemetry.

---

# 49. Scenario Relationships

A scenario may identify relationships to emphasize.

Conceptually:

```text
SystemScenarioRelationship
├── system_scenario_id
├── system_relationship_id
└── emphasis_order
```

Example:

```text
APU Generator
→ AC Power
→ Distribution
```

---

# 50. Concept

A `Concept` is reusable educational knowledge.

Examples:

```text
Electrical Bus
Standby Power
Ground Power
Bleed Air
Hydraulic Pressure
IRS
```

Structure:

```text
Concept
├── id
├── content_record_id
├── aircraft_implementation_id
├── slug
├── title
├── short_definition
└── why_it_matters
```

`aircraft_implementation_id` may be nullable.

A null implementation represents a concept that is sufficiently general to be shared.

---

# 51. Concept Relationships

Concepts may connect to several domain entities.

Required relations may include:

```text
ControlConcept

SystemComponentConcept

ProcedureStepConcept
```

Conceptually:

```text
Battery Switch
→ Standby Power

Aircraft Battery
→ Electrical Bus

BATTERY → ON step
→ Electrical Power concept
```

---

# 52. Procedure ↔ System

A Procedure may relate broadly to one or multiple aircraft systems.

Conceptual relationship:

```text
ProcedureSystem
├── procedure_id
├── aircraft_system_id
├── relationship_type
└── sort_order
```

Example:

```text
Power Up
→ Electrical
```

---

# 53. Step ↔ System

A specific step may also link to a system when the educational relationship is important.

Conceptual relation:

```text
ProcedureStepSystem
├── procedure_step_id
├── aircraft_system_id
└── relation_type
```

This supports Learn Mode links such as:

`Learn Electrical System →`

---

# 54. Sources

CockpitPath content must support traceable source metadata.

Use:

`SourceReference`

Structure:

```text
SourceReference
├── id
├── source_type
├── title
├── publisher
├── url
├── document_version
├── publication_date
├── notes
├── created_at
└── updated_at
```

Possible source types:

```text
ADDON_DOCUMENTATION
AIRCRAFT_DOCUMENTATION
SIMULATOR_DOCUMENTATION
TRAINING_MATERIAL
DIRECT_SIMULATOR_TEST
OTHER
```

---

# 55. Content ↔ Source

Sources attach to ContentRecords.

Conceptual relation:

```text
ContentSource
├── content_record_id
├── source_reference_id
├── purpose
├── locator
└── notes
```

`locator` may describe:

* Section
* Chapter
* Page
* Procedure
* Test scenario

without storing copyrighted source content unnecessarily.

---

# 56. Verification Event

Verification should have history rather than only one mutable date field.

Use:

`VerificationEvent`

Conceptual structure:

```text
VerificationEvent
├── id
├── content_record_id
├── verification_status
├── addon_version
├── simulator_version
├── verified_at
├── verified_by
├── notes
└── created_at
```

This allows CockpitPath to know:

> What was this content verified against?

---

# 57. Current Verification Status

The latest valid VerificationEvent may determine the user-facing verification status.

Do not invent:

* Version numbers
* Dates
* Source records

when verification has not occurred.

---

# 58. Media Verification

Media also needs capture and verification context.

For example:

```text
Image:
overhead-electrical.webp

Captured with:
iFly version X
MSFS version Y
```

These fields may remain null until confirmed.

---

# 59. User Profile

Authentication identity is owned by Supabase Auth.

CockpitPath should maintain a small application profile.

Conceptually:

```text
UserProfile
├── user_id
├── display_name
├── created_at
└── updated_at
```

`user_id` references the authenticated user identity.

Do not duplicate authentication password information.

---

# 60. User Preferences

Preferences may be stored separately.

Possible future structure:

```text
UserPreference
├── user_id
├── default_guide_mode
├── preferred_aircraft_implementation_id
└── updated_at
```

Only preferences actually required should be implemented.

Avoid creating a generic settings dump unnecessarily.

---

# 61. Journey Progress

Use:

`UserJourneyProgress`

Structure:

```text
UserJourneyProgress
├── id
├── user_id
├── journey_id
├── progress_status
├── current_journey_section_id
├── current_procedure_step_id
├── started_at
├── completed_at
├── last_activity_at
└── updated_at
```

There should normally be one active progress record per:

```text
user + journey
```

for v0.1.

---

# 62. Journey Progress Status

Possible values:

```text
NOT_STARTED
IN_PROGRESS
COMPLETED
```

A paused journey remains:

`IN_PROGRESS`.

---

# 63. Procedure Progress

Standalone Procedures also need resumable state.

Use:

`UserProcedureProgress`

Structure:

```text
UserProcedureProgress
├── id
├── user_id
├── procedure_id
├── progress_status
├── current_step_id
├── started_at
├── completed_at
├── last_activity_at
└── updated_at
```

A Procedure completed inside a Journey may update the same Procedure progress.

---

# 64. Step Progress

Individual completion belongs in:

`UserStepProgress`

Structure:

```text
UserStepProgress
├── id
├── user_id
├── procedure_step_id
├── progress_status
├── completed_at
├── skipped_at
└── updated_at
```

Possible statuses:

```text
COMPLETED
SKIPPED
```

Absence of a record can represent not completed.

---

# 65. Step Progress Constraint

The following must be unique:

```text
user_id + procedure_step_id
```

This prevents duplicate completion records.

Completing the same step repeatedly becomes an update or idempotent no-op.

---

# 66. Progress Percentages

Do not persist values such as:

```text
journey_progress_percent = 43
```

as the primary truth.

Percentages should be derived from:

* Required steps
* Completion records
* Journey structure

Materialized summaries may be introduced later for performance if necessary.

---

# 67. Progress and Content Revisions

Progress should reference stable logical step IDs.

Example:

```text
Battery Step revision 1
      ↓
user completes step
      ↓
Battery Step revision 2
```

The completion remains valid unless revision 2 represents a breaking semantic change.

Breaking changes require an explicit migration decision.

---

# 68. Archived Steps and Progress

If a completed step is later archived:

* Historical completion remains
* The archived step no longer counts toward current journey completion unless explicitly configured
* Progress calculation must use the current published procedure structure

Do not delete the historical progress row.

---

# 69. Resume

`Continue Learning` should be calculated from:

```text
UserJourneyProgress
       ↓
current_journey_section_id
       ↓
current_procedure_step_id
```

The Aircraft Page should not calculate resume position by guessing from the highest completed step.

Explicit current position is more reliable.

---

# 70. Progress Transactions

Completing a step may require several related operations.

Conceptually:

```text
Mark step completed
        ↓
Advance Procedure current step
        ↓
Possibly mark Procedure complete
        ↓
Advance Journey section if required
        ↓
Update last activity
```

These operations should be handled atomically where possible.

The detailed implementation belongs in the database and progress architecture.

---

# 71. Context Preservation

Temporary navigation context such as:

```text
Guide Mode
→ Electrical System
→ Return to Guide Mode Step 04
```

does not necessarily require permanent database storage.

It may use:

* URL state
* navigation state
* session state

Persistent learning progress remains database-backed.

---

# 72. Search Model

Cockpit Explorer search primarily indexes:

```text
Control.canonical_name
ControlAlias.alias
CockpitArea.title
AircraftSystem.title
```

Search results must remain scoped to the current AircraftImplementation unless the user explicitly searches globally in a future version.

---

# 73. Search Result Identity

Search should return canonical domain identities.

Example:

```text
Battery Switch
→ control_id
```

The UI can then resolve:

```text
Control
→ CockpitArea
→ CockpitView
→ Hotspot
```

and focus the correct location.

Do not store separate search-only navigation URLs as the source of truth.

---

# 74. Access Class

ContentRecord should remain compatible with future access rules.

Possible access classes:

```text
FREE
PRO
PACK
INHERIT
```

During v0.1 Beta, released content may all resolve to:

`FREE`.

---

# 75. Entitlements

Billing is out of scope.

The data model should nevertheless allow future:

`UserEntitlement`

Conceptually:

```text
UserEntitlement
├── id
├── user_id
├── entitlement_key
├── source_type
├── source_reference
├── starts_at
├── ends_at
├── revoked_at
└── created_at
```

Possible keys later:

```text
pro

aircraft.ifly-b737-max-8-msfs2024
```

This table does not need to be fully active during the free beta.

---

# 76. Entitlement Source

Future `source_type` may include:

```text
SUBSCRIPTION
PACK_PURCHASE
BETA
PROMOTION
ADMIN_GRANT
PARTNER
```

Entitlement identity must not be tied directly to a payment transaction.

---

# 77. Progress vs Entitlement

These domains remain separate.

```text
User loses entitlement
        ↓
Progress remains

User regains entitlement
        ↓
Previous progress returns
```

Never delete progress because content access changes.

---

# 78. Content Access Inheritance

Fine-grained access should not require an entitlement record for every step.

Example:

```text
Aircraft Content Access
       ↓
Journey
       ↓
Procedure
       ↓
Step
```

Lower-level content may inherit access from a meaningful parent scope.

The exact resolver will be defined in `access-control.md`.

---

# 79. Relationship Summary

The primary domain graph is:

```text
Aircraft
    │
    ├── Simulator
    │
    └── AddOnProduct
            │
            ▼
AircraftImplementation
    │
    ├── Journey
    │     │
    │     └── JourneySection
    │              │
    │              ▼
    ├── Procedure ────────────────┐
    │     │                       │
    │     ▼                       │
    │ ProcedureStep              │
    │     │                       │
    │     ▼                       │
    ├── Control ◄────────────────┘
    │     │
    │     ├── ControlAlias
    │     ├── ControlPosition
    │     └── CockpitArea
    │             │
    │             ▼
    │        CockpitView
    │             │
    │             ▼
    │          Hotspot
    │
    ├── AircraftSystem
    │       │
    │       ▼
    │ SystemComponent
    │       │
    │       ├── SystemRelationship
    │       └── SystemLearningSection
    │
    └── Concept
```

---

# 80. Cross-Learning Graph

The educational graph is:

```text
ProcedureStep
     │
     ▼
Control
     │
     ├──────────────► CockpitArea / Hotspot
     │
     ▼
AircraftSystem
     │
     ▼
SystemComponent
     │
     ▼
Concept
```

and in the reverse direction:

```text
SystemComponent
      ↓
Related Control
      ↓
Related Procedure
      ↓
Procedure Step
```

This connected graph is one of CockpitPath's primary product advantages.

---

# 81. Data Ownership

Conceptually:

### Product-Owned Shared Data

* Aircraft
* Implementations
* Journeys
* Procedures
* Controls
* Systems
* Concepts
* Media metadata
* Sources
* Verification

### User-Owned Private Data

* Journey progress
* Procedure progress
* Step progress
* Preferences
* Future entitlements

These categories should use different authorization policies.

---

# 82. Hard Delete Rules

Published learning entities should rarely be hard-deleted.

Prefer:

`ARCHIVED`

Hard delete may be appropriate for:

* Never-published mistakes
* Temporary import records
* Test data

Production deletion behavior should protect relational and progress integrity.

---

# 83. Media Delete Rules

A MediaAsset must not be deleted while published content references it.

Recommended conceptual process:

```text
Media Asset
   ↓
Remove / replace references
   ↓
Archive asset
   ↓
Eventually delete binary if safe
```

---

# 84. Uniqueness Constraints

Important conceptual uniqueness rules include:

```text
ContentRecord.content_key

AircraftImplementation.slug

Journey:
aircraft_implementation_id + slug

Procedure:
aircraft_implementation_id + slug

AircraftSystem:
aircraft_implementation_id + slug

Control:
aircraft_implementation_id + slug

JourneySection:
journey_id + sequence

ProcedureStep:
procedure_id + sequence

UserStepProgress:
user_id + procedure_step_id

UserJourneyProgress:
user_id + journey_id

UserProcedureProgress:
user_id + procedure_id
```

---

# 85. Reference Integrity

Content publishing should reject references to entities that:

* Do not exist
* Belong to the wrong AircraftImplementation
* Are archived
* Are incompatible
* Reference missing media
* Reference invalid cockpit hierarchy

Example invalid relationship:

```text
iFly 737 Procedure Step
→ Airbus A320 Control
```

This must fail validation.

---

# 86. Implementation Boundary Rule

Unless explicitly modeled as shared, content relationships must stay within the same AircraftImplementation.

Examples:

```text
Procedure Step
→ Control

Control
→ Cockpit Area

Control
→ System

System Component
→ Control
```

should normally share one implementation.

---

# 87. General Concepts Exception

Concepts may intentionally be shared across implementations.

Example:

`AC Power`

may eventually be a general concept.

Aircraft-specific explanations should remain implementation-scoped when necessary.

---

# 88. Publication Validation

Before publication, the system should validate at minimum:

### Journey

* Valid implementation
* Valid ordered sections
* All required Procedures exist

### Procedure

* At least one published step
* Unique step ordering

### Step

* Valid type
* Required action fields
* Valid referenced controls
* Valid media references

### Cockpit Explorer

* Valid hierarchy
* Valid primary views
* Hotspots inside normalized bounds

### Systems

* Valid components
* Valid relationships
* No dangling diagram edges

### Sources

* Required verification references where policy requires them

---

# 89. No Telemetry State in v0.1

The data model should not add fields such as:

```text
control.current_state
system_component.is_powered
generator.is_online
```

to runtime CockpitPath content.

CockpitPath v0.1 does not know live simulator state.

Possible control positions describe the control.

They do not describe the user's simulator.

---

# 90. Future Simulator State

If simulator integration is added later, live state should be modeled separately.

Conceptually:

```text
ObservedSimulatorState
```

must remain distinct from:

```text
Control
SystemComponent
ProcedureStep
```

Static educational content should not become mutable telemetry storage.

---

# 91. Analytics Data

Product analytics should not be mixed into the core relational content model unless necessary.

Events such as:

```text
journey_started
step_completed
cockpit_search_used
```

may be sent through an analytics abstraction.

Core progress remains authoritative in PostgreSQL.

Analytics events are not the source of truth for user completion.

---

# 92. Data Model Not Included Yet

This document intentionally does not fully define:

* Billing transactions
* Subscription provider data
* Notifications
* AI conversations
* Simulator telemetry
* Community content
* User-created procedures
* Flight planning
* Failure scenarios
* Knowledge quizzes

They are outside v0.1.

---

# 93. Recommended Core Table Groups

When converted to PostgreSQL, the schema will roughly fall into these groups.

## Platform

```text
profiles
```

## Aircraft

```text
aircraft
simulators
addon_products
aircraft_implementations
```

## Shared Content Metadata

```text
content_records
source_references
content_sources
verification_events
```

## Journeys and Procedures

```text
journeys
journey_sections
procedure_groups
procedures
procedure_steps
procedure_step_controls
procedure_step_visuals
procedure_step_concepts
procedure_step_systems
```

## Cockpit

```text
cockpit_areas
cockpit_views
controls
control_positions
control_aliases
control_relations
hotspots
```

## Systems

```text
aircraft_systems
system_components
system_component_controls
system_relationships
system_learning_sections
system_scenarios
system_scenario_relationships
```

## Concepts

```text
concepts
control_concepts
system_component_concepts
```

## Media

```text
media_assets
media_variants
```

## Progress

```text
user_journey_progress
user_procedure_progress
user_step_progress
```

## Future Access

```text
user_entitlements
```

---

# 94. MVP Implementation Priority

Not every table needs to be created on day one.

Recommended implementation order:

### Foundation

```text
aircraft
simulators
addon_products
aircraft_implementations
content_records
```

### Procedure Engine

```text
journeys
journey_sections
procedure_groups
procedures
procedure_steps
```

### Cockpit Model

```text
cockpit_areas
cockpit_views
controls
control_aliases
control_positions
hotspots
procedure_step_controls
procedure_step_visuals
```

### Progress

```text
profiles
user_journey_progress
user_procedure_progress
user_step_progress
```

### Learning Graph

```text
aircraft_systems
system_components
system_relationships
concepts
relationship tables
```

### Verification / Publishing

```text
source_references
content_sources
verification_events
```

Media tables should be introduced when cockpit content ingestion begins.

---

# 95. Data Model Success Criteria

The CockpitPath data model is successful when it can represent the following without duplicating content:

```text
Cold & Dark → Takeoff
        ↓
Power Up
        ↓
BATTERY → ON
        ↓
Battery Switch
        ↓
Overhead → Electrical
        ↓
Aircraft Battery
        ↓
Electrical System
        ↓
Standby Power
```

and the same entities can also power:

* Aircraft Page
* Guide Mode
* Cockpit Explorer
* Aircraft Systems
* Search
* Progress
* Resume

without each feature maintaining its own disconnected copy.

---

# 96. Architecture Rule

The central data-model rule for CockpitPath is:

> Procedures, cockpit controls, aircraft systems, concepts, and imagery are different views over one connected aircraft-learning graph.

The database should model that graph directly.

The UI should not recreate those relationships manually.

---

## Status

**CockpitPath Data Model v0.1**

Domain model established.

Ready to be refined into PostgreSQL schema, migration order, RLS policies, and structured content schemas.
