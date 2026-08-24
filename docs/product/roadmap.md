# CockpitPath — Product Roadmap

**Document Status:** Draft v0.1
**Product:** CockpitPath
**Last Updated:** 2026-08-24

## 1. Purpose

This document defines the directional product roadmap for CockpitPath.

The roadmap is intended to:

* Establish development priorities
* Prevent premature feature expansion
* Guide architecture decisions
* Separate MVP requirements from future possibilities
* Maintain focus on validating the core learning experience

This roadmap is directional rather than a fixed delivery commitment.

Later phases may change based on beta usage, content production capacity, technical findings, and user feedback.

---

## 2. Roadmap Principle

CockpitPath should expand in the following order:

```text
Prove the learning experience
        ↓
Improve quality and content depth
        ↓
Prove the platform can support more aircraft
        ↓
Establish a stable product
        ↓
Add integrations and monetization where justified
```

The product should not build advanced platform capabilities before the core learning experience has been proven useful.

---

# Phase 0 — Product Foundation

## Goal

Define CockpitPath clearly enough that implementation can begin without relying on major unresolved product assumptions.

## Status

**In progress**

## Required Work

* Product Vision
* MVP definition
* Target users
* Product roadmap
* UX specifications
* Core visual design
* Technical architecture
* Content architecture
* Data model
* Repository structure
* Initial engineering decisions

## Core UX Areas

The following core experiences are already defined:

* Aircraft Page
* Guide Mode
* Cockpit Explorer
* Aircraft Systems

These experiences establish the core CockpitPath learning model.

## Exit Criteria

Phase 0 is complete when:

* v0.1 scope is clearly defined
* Core UX behavior is documented
* Core design direction is locked
* Architecture is documented
* Content structure is defined
* Repository is ready for implementation

---

# Phase 1 — v0.1 Beta

## Goal

Prove that CockpitPath is an effective simulator-side learning companion for one complex aircraft journey.

## Primary Product Hypothesis

> A simulator user can learn and follow a complex aircraft procedure more comfortably using CockpitPath beside the simulator than by repeatedly pausing and rewinding a traditional video tutorial.

## Supported Aircraft

**Boeing 737 MAX 8**

Implementation:

**iFly**

Simulator:

**Microsoft Flight Simulator 2024**

---

## Primary Journey

`Cold & Dark → Takeoff`

Canonical sections:

1. Power Up
2. IRS & Navigation
3. Overhead Preparation
4. FMC Initialization
5. Route Setup
6. Performance Setup
7. MCP Preparation
8. Before Pushback
9. Pushback
10. Engine Start
11. After Start
12. Taxi
13. Before Takeoff
14. Takeoff

The exact number of steps will be determined through verified content production.

---

## Required Product Experiences

### Aircraft Page

Users can:

* Open the supported aircraft
* Start the learning journey
* Resume an existing journey
* Browse procedures
* Enter Cockpit Explorer
* Enter Aircraft Systems

---

### Guide Mode

Users can:

* Follow procedures step by step
* See real cockpit imagery
* See dynamically rendered control highlights
* Understand expected results
* Use Quick or Learn information density
* Use Focus Mode
* Move backward and forward
* Skip optional steps where permitted
* Automatically save progress
* Resume later

---

### Cockpit Explorer

Users can:

* Navigate visually through cockpit areas
* Select cockpit controls
* Search for controls
* Understand what controls do
* See where controls are used
* Open related procedures
* Open related Aircraft Systems content

Initial coverage should focus primarily on controls required by the MVP journey.

---

### Aircraft Systems

Initial required system:

**Electrical**

Users can:

* Understand the system at a conceptual level
* Select major components
* View conceptual relationships
* Understand operational relevance
* Open related cockpit controls
* Open related procedures

Technical system content remains subject to verification.

---

## Supporting Platform Capabilities

v0.1 should include:

* Responsive web application
* Authentication
* Persistent user sessions
* Progress persistence
* Continue Learning
* Structured learning content
* Managed media assets
* Verification metadata
* Cross-linked content entities
* Free beta access
* Small public-facing landing experience

---

## Explicitly Deferred

v0.1 does not require:

* Multiple complete aircraft
* SimConnect
* Live simulator telemetry
* AI instructor
* Voice guidance
* Native applications
* SimBrief
* Navigraph
* Community features
* Payment processing
* Advanced CMS
* Gamification
* Failure training
* Complete arrival and shutdown journey

---

## Beta Audience

The initial beta should be intentionally limited.

The objective is to observe real learning behavior rather than maximize traffic.

Early testers should ideally include:

* Users learning the iFly 737 MAX
* Returning 737 users
* Users who normally learn through YouTube
* Second-monitor users
* Tablet users

---

## v0.1 Exit Criteria

v0.1 is successful enough to advance when users can reliably:

1. Understand what CockpitPath does.
2. Start the supported journey.
3. Follow Guide Mode beside the simulator.
4. Find required controls.
5. Understand important controls.
6. Open supporting system explanations.
7. Move between learning contexts without becoming lost.
8. Leave the application.
9. Return later.
10. Resume at the correct position.

Technical stability and content accuracy are required.

---

# Phase 2 — v0.2 Content & Product Polish

## Goal

Improve the quality of the proven learning experience before expanding the platform significantly.

The main question becomes:

> What prevents users from comfortably completing and reusing the existing experience?

---

## Potential Priorities

### Procedure Quality

Refine:

* Instructions
* Screenshots
* Hotspot placement
* Expected Results
* Learn explanations
* Tips
* Warnings
* Optional-step handling

---

### Additional 737 Procedures

Potential additions:

* ILS Approach
* Landing
* Shutdown

This could extend the product toward:

`Cold & Dark → Shutdown`

without introducing another aircraft yet.

---

### Additional Systems

Potential additions based on procedure relevance:

* Fuel
* Hydraulics
* Pneumatics
* Air Conditioning

System order should be based on real user learning needs rather than completing a checklist of aircraft systems.

---

### Cockpit Explorer Coverage

Expand control coverage based on:

* Procedure requirements
* Search activity
* User confusion
* Frequently viewed controls

Do not attempt to document every cockpit control merely for completeness.

---

### Search Improvements

Potential improvements:

* Better aliases
* Broader global search
* Search across controls, systems, concepts, and procedures
* Better search ranking

AI search is not required.

---

### Resume and Navigation Polish

Improve:

* Context restoration
* Back behavior
* Cross-link navigation
* Continue Learning
* Multi-device progress reliability

---

### Performance

Optimize:

* Cockpit image loading
* Responsive image delivery
* Prefetching
* Hotspot rendering
* Initial page load
* Guide Mode responsiveness

Media-heavy performance should receive particular attention.

---

## v0.2 Decision Inputs

Priorities should be informed by real v0.1 usage.

Useful signals may include:

* Where users leave the journey
* Most-searched controls
* Most-opened explanations
* Quick vs Learn usage
* Cockpit Explorer usage
* System-page usage
* Resume success
* Device types
* User feedback

---

# Phase 3 — v0.3 Multi-Aircraft Foundation

## Goal

Prove that CockpitPath is a reusable aircraft-learning platform rather than a product structurally tied to the iFly 737 MAX.

This phase should begin only after the first aircraft experience is stable.

---

## Second Aircraft

A second aircraft implementation should be selected based on:

* User demand
* Add-on popularity
* Documentation availability
* Image-capture feasibility
* Content-production complexity
* Licensing considerations
* Meaningful contrast with the 737 implementation

The specific aircraft is intentionally not locked in this roadmap.

---

## Platform Validation

Adding a second aircraft should test whether the architecture correctly supports:

* Aircraft families
* Simulator implementations
* Add-on implementations
* Aircraft-specific procedures
* Shared concepts
* Different cockpit structures
* Different control types
* Different systems
* Separate progress

---

## Aircraft Selection

CockpitPath should now provide a useful Aircraft Library.

Users may have:

* Available aircraft
* Learning progress per aircraft
* Different content availability
* Future entitlement differences

The library should remain focused rather than becoming a marketplace.

---

## Content Tooling

At this point, increased content volume may justify improving internal authoring tools.

Possible needs include:

* Content validation
* Hotspot authoring
* Media selection
* Procedure ordering
* Relationship management
* Verification workflow
* Preview tooling

A full enterprise CMS is still not automatically required.

---

# Phase 4 — v1.0

## Goal

Establish CockpitPath as a stable, trustworthy product ready for broader public usage.

v1.0 should represent product maturity rather than simply a version number.

---

## Expected Characteristics

By v1.0, CockpitPath should have:

* Proven Guide Mode
* Reliable progress
* Stable cross-link navigation
* High-quality cockpit imagery
* Strong Cockpit Explorer
* Useful system learning
* Consistent content verification
* Responsive desktop/tablet/mobile behavior
* At least one deeply complete aircraft experience
* Architecture proven beyond hard-coded MVP assumptions

A second aircraft may be included before or at v1.0 depending on development findings.

---

## Product Quality

v1.0 should meet a stronger quality bar for:

* Accessibility
* Performance
* Error handling
* Monitoring
* Authentication reliability
* Data integrity
* Media delivery
* Content accuracy
* Browser compatibility

---

## Public Product

The public-facing CockpitPath experience should now clearly explain:

* What CockpitPath is
* Supported aircraft
* Learning experience
* Account model
* Content access
* Product status

Marketing should remain secondary to the learning product itself.

---

# Phase 5 — Monetization

## Goal

Introduce paid access only after CockpitPath demonstrates recurring user value.

Monetization should fund continued:

* Content production
* Aircraft expansion
* Verification
* Product development

It should not distort the core learning experience.

---

## Possible Model

CockpitPath may use a freemium model.

Potential entitlement categories:

### Free

Could include:

* Limited aircraft content
* Selected procedures
* Selected cockpit controls
* Product evaluation content

### Pro

Could include:

* Full journeys
* Expanded systems learning
* Full Cockpit Explorer coverage
* Additional aircraft content

### Aircraft Packs

A future alternative or supplement to subscription access.

No specific pricing model is locked by this roadmap.

---

## Monetization Principle

Users should understand CockpitPath's value before encountering aggressive paywall behavior.

The beta should remain focused on learning validation rather than conversion optimization.

---

# Phase 6 — Simulator Integration

## Goal

Evaluate whether live simulator awareness meaningfully improves CockpitPath.

This is intentionally post-core-product work.

---

## Possible Capabilities

Future simulator integration may include:

* Detect simulator connection
* Read selected aircraft state
* Detect some cockpit control states
* Assist Expected Result verification
* Suggest when a step appears complete
* Improve Guide Mode context

---

## Critical Principle

Simulator integration should **augment** CockpitPath.

It should not become required for the core learning experience.

CockpitPath must remain useful when:

* Integration is unavailable
* Simulator APIs change
* A supported add-on does not expose required state
* The user is learning away from the simulator

---

## Automatic Completion

If telemetry is introduced, CockpitPath should be conservative about automatic step completion.

The system should distinguish:

* Observed simulator state
* CockpitPath inference
* User-confirmed completion

Avoid false confidence.

---

# Phase 7 — Ecosystem Integrations

## Goal

Add integrations only when they reduce meaningful friction in the existing learning workflow.

Potential integrations may include:

* SimBrief
* Navigraph
* Simulator-specific services

These should be evaluated individually.

---

## Integration Principle

CockpitPath should not become a flight-planning suite.

Integrations should provide learning context rather than duplicate mature external products.

Example:

Use SimBrief flight-plan data to help explain FMC setup.

Not:

Build a replacement flight planner.

---

# Phase 8 — Advanced Learning

Potential later capabilities may include:

* Knowledge checks
* Guided cockpit tours
* Recurrent practice journeys
* Scenario-based training
* Failure-related learning
* Personalized recommendations
* Learning history

These should be based on demonstrated user demand.

---

# Phase 9 — AI-Assisted Learning

AI is deliberately not part of the initial CockpitPath value proposition.

Future AI capabilities may be evaluated after the structured content model is mature.

Possible examples:

* Ask a question about the current procedure step
* Explain a system concept differently
* Help locate existing CockpitPath content
* Adapt explanation depth

AI should reference trusted CockpitPath content rather than invent aircraft procedures.

---

## AI Principle

AI must not replace:

* Verified procedural content
* Content relationships
* Aircraft implementation metadata
* Source verification

AI may help users navigate or understand trusted content.

It should not become the source of truth.

---

# Long-Term Aircraft Expansion

CockpitPath may eventually support multiple categories.

Potential examples include:

### Airliners

Multiple Boeing and Airbus families.

### Business Aviation

Complex business jets.

### General Aviation

Advanced piston and turboprop aircraft.

Other aircraft categories may be evaluated if they fit the learning model.

---

# What the Roadmap Does Not Commit To

This roadmap does not guarantee implementation of:

* SimConnect
* AI
* Native apps
* Community content
* Aircraft Packs
* Subscription pricing
* SimBrief
* Navigraph
* Failure training
* Any specific second aircraft

These are future options, not current commitments.

---

# Prioritization Framework

When evaluating future work, CockpitPath should ask:

### 1. Does this make learning easier?

### 2. Does this reduce simulator-side friction?

### 3. Does this improve content trust?

### 4. Does this deepen the connected learning model?

### 5. Is there evidence users need it?

### 6. Does it justify its implementation and maintenance cost?

Features that do not clearly improve the core learning experience should remain lower priority.

---

# Current Focus

CockpitPath is currently focused on:

**Phase 0 — Product Foundation**

followed by:

**Phase 1 — v0.1 Beta**

The immediate priority is not future feature expansion.

The immediate priority is:

> Build one excellent, connected Boeing 737 MAX learning experience and validate that CockpitPath solves the original learning problem.

---

## Status

**CockpitPath Product Roadmap v0.1**

Directional roadmap established. Future phases remain subject to validation and learning from real product usage.
