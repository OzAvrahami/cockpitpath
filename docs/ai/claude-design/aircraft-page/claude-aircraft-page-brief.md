# CockpitPath — Aircraft Page Design Brief

## Objective

Design the CockpitPath **Aircraft Page** using the already approved Guide Mode visual language.

Do not create a new visual direction.

The Guide Mode design foundation is locked and documented in:

`docs/design/guide-mode-direction.md`

The Aircraft Page should feel unmistakably part of the same CockpitPath product.

---

## Product Context

CockpitPath is a visual, step-by-step learning platform for flight simulation users.

The initial supported aircraft environment is:

* Boeing 737 MAX 8
* iFly
* Microsoft Flight Simulator 2024

The Aircraft Page is the main learning hub for a specific aircraft.

Its primary purpose is to help the user answer:

> What should I learn or continue next on this aircraft?

---

## Primary User Scenario

The user has selected:

**Boeing 737 MAX 8**

The Aircraft Page should allow the user to:

* Continue an unfinished learning journey
* Start a journey
* Browse individual procedures
* Begin learning the cockpit
* Explore aircraft systems
* Understand what content is available
* Understand what content is coming later

The interface should guide rather than overwhelm.

---

## Visual Foundation

Use the approved CockpitPath visual direction:

**Simulator Companion — Refined v2**

Preserve:

* Dark low-glare surfaces
* Cyan primary accent
* Minimal visual noise
* Strong typography
* Aviation-aware technical details
* Restrained use of monospace
* Clear hierarchy
* Premium simulator-focused character

Do not turn the Aircraft Page into a generic SaaS dashboard.

---

## Required Aircraft Identity

The page should clearly establish:

**Boeing 737 MAX 8**

Supported implementation:

**iFly**

Simulator:

**Microsoft Flight Simulator 2024**

The product architecture distinguishes:

* Aircraft
* Simulator
* Add-on implementation

The visual design should make this understandable without excessive metadata.

---

## Primary Content Areas

The Aircraft Page should account for the following areas.

### Continue Learning

If the user has active progress, this should be the most immediately useful element.

Example:

**Cold & Dark → Takeoff**

Current section:

`Power Up`

Progress:

`Step 4 of 16`

Primary action:

`Continue`

The experience should make returning to an unfinished guide effortless.

---

## Journeys

Journeys are larger learning experiences containing multiple procedure sections.

Initial example:

### Cold & Dark → Takeoff

Possible supporting information:

* Difficulty
* Number of sections
* Approximate learning scope
* Progress
* Completion state

Future journeys may include:

* Gate to Gate
* Full Flight
* Approach Training
* Recurrent Practice

Do not over-design unsupported future content.

---

## Procedures

Users should be able to open individual procedures independently.

Examples:

* Power Up
* IRS & Navigation
* Overhead Preparation
* FMC Initialization
* Route Setup
* Performance Setup
* Pushback
* Engine Start
* After Start
* Taxi
* Before Takeoff
* Takeoff
* ILS Approach
* Landing
* Shutdown

Procedures should remain easy to scan.

Avoid presenting a giant wall of equal-sized cards.

Use hierarchy, grouping, sections, or another appropriate structure.

---

## Learn the Aircraft

The page should introduce learning areas beyond procedural guides.

Initial conceptual areas:

### Cockpit

Learn where major controls and panels are located.

### Systems

Understand aircraft systems such as:

* Electrical
* Fuel
* Hydraulics
* Pneumatics
* Air conditioning
* Flight controls

### Procedures

Learn operational flows step by step.

The page should make these areas feel connected rather than like separate products.

---

## Cockpit Explorer Entry

Cockpit Explorer is planned as an important CockpitPath learning feature.

The Aircraft Page should include an appropriate entry point.

Example intent:

> Explore the cockpit and learn what each control does.

Do not design the full Cockpit Explorer experience in this task.

Only design its entry point from the Aircraft Page.

---

## Progress

Progress should be useful without turning the page into analytics.

Possible progress information:

* Current journey
* Completed procedures
* Journey completion
* Continue position

Avoid:

* KPI dashboards
* Charts
* excessive statistics
* gamification-heavy progress

CockpitPath should remain a focused learning companion.

---

## Content Status

The design should gracefully support different content states:

* Available
* In progress
* Completed
* Coming soon
* Free
* Pro-ready future state

The initial beta may be entirely free.

Do not make pricing or subscription status visually dominant.

The architecture may support Free / Pro later.

---

## Primary Actions

The most important action on the page is usually:

`Continue`

when progress exists.

Otherwise:

`Start Journey`

or an equivalent primary learning action.

Secondary actions include:

* Open procedure
* Explore cockpit
* Learn systems

---

## Navigation

The Aircraft Page belongs to the full CockpitPath application rather than Focus Mode.

It may therefore contain more product navigation than Guide Mode.

However, preserve the product's restrained visual style.

Likely navigation areas may include:

* Aircraft
* Learn
* Progress
* Account

Do not design a large enterprise-style sidebar unless strongly justified.

---

## Responsive Requirements

Demonstrate:

### Wide Desktop

Primary web application experience.

### Tablet / iPad

Important CockpitPath device class.

### Mobile

The Aircraft Page should remain practical on phone screens.

Unlike active Guide Mode, the Aircraft Page does not need a narrow 480 px simulator-companion layout as its primary special case.

Normal responsive behavior is sufficient.

---

## Content Density

The Aircraft Page contains significantly more information than one Guide Mode step.

Do not solve this by displaying everything simultaneously.

Use progressive disclosure and strong grouping.

A user should quickly understand:

1. What they were doing last.
2. What they can start next.
3. How the aircraft learning content is organized.

---

## Aircraft Imagery

Aircraft imagery may be used to establish identity.

Avoid large decorative hero photography that pushes useful learning content below the fold.

If an aircraft image is included, it should support orientation and identity rather than behave like a marketing hero.

Cockpit imagery may be more relevant than exterior promotional imagery.

---

## Branding

Continue using the temporary CockpitPath identity established by the Guide Mode direction.

Do not redesign the CockpitPath logo in this task.

Branding will be addressed separately after the core learning product screens are established.

---

## Avoid

Do not create:

* Generic learning management system UI
* Enterprise dashboard
* Large KPI cards
* Course marketplace
* Netflix-style content wall
* Heavy gamification
* Social/community features
* Marketing homepage
* Pricing UI
* AI chat interface
* Flight planning interface

---

## Deliverable

Create one refined Aircraft Page direction consistent with the approved CockpitPath Guide Mode.

Show:

1. Wide desktop
2. iPad / tablet
3. Mobile

Use:

**Boeing 737 MAX 8 — iFly — Microsoft Flight Simulator 2024**

as the example aircraft.

Demonstrate:

* Continue Learning
* Journeys
* Procedures
* Learn the Aircraft
* Cockpit Explorer entry
* Progress states
* Available / coming-soon content

Do not design additional CockpitPath pages yet.
