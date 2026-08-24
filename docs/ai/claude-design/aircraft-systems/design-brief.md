# CockpitPath — Aircraft Systems Design Brief

**Product:** CockpitPath
**Area:** Aircraft Systems
**Design Stage:** Initial Visual Design
**Last Updated:** 2026-08-24

## 1. Objective

Design the CockpitPath **Aircraft Systems** learning experience.

Aircraft Systems is one of the three core CockpitPath learning pillars:

* Guide Mode — what should I do?
* Cockpit Explorer — what is this control and where is it?
* Aircraft Systems — how does the underlying system work and why?

The UX source of truth is:

`docs/ux/aircraft-systems.md`

Read that document before designing.

Do not substantially redesign the UX model unless a change clearly improves usability.

---

## 2. Existing Visual Language

CockpitPath already has an approved visual direction.

Read:

`docs/design/guide-mode-direction.md`

Also inspect the approved references for:

* Guide Mode
* Aircraft Page
* Cockpit Explorer

Aircraft Systems must extend the same product language.

Preserve:

* Dark, low-glare environment
* Cyan as the main focus and selection accent
* Restrained borders
* Minimal visual noise
* Strong information hierarchy
* Monospace for technical labels, values, states, and compact metadata
* Highly readable interface typography
* Serif where appropriate for explanatory learning text
* Premium but restrained presentation
* Simulator-focused visual character

Do not create a new design direction.

---

# 3. Example Aircraft and System

Use the following example throughout the design:

**Aircraft**

Boeing 737 MAX 8

**Add-on**

iFly

**Simulator**

Microsoft Flight Simulator 2024

**System**

Electrical

Do not invent:

* Add-on version numbers
* Simulator versions
* Verification dates
* Documentation references

Use neutral placeholders where verification metadata is shown.

Example:

`VERIFICATION STATUS: PENDING`

---

# 4. Primary User Question

The Aircraft Systems experience should answer:

> How does this system work, why does it matter, and how does it connect to what I do in the cockpit?

The design should help the user build a simple mental model before introducing technical detail.

---

# 5. Electrical System Example

Use the Electrical System as the design example.

The experience should conceptually demonstrate relationships between major elements such as:

* Aircraft Battery
* Ground / External Power
* APU Generator
* Engine Generator 1
* Engine Generator 2
* AC Power
* DC Power
* Electrical Buses
* Standby Power

The diagram is educational and conceptual.

Do not imply that this is a final verified Boeing electrical schematic.

---

# 6. Core Learning Model

The experience should visually support:

**Source**

Where power comes from.

↓

**Distribution**

How power moves through the system.

↓

**Cockpit Controls**

How the pilot interacts with it.

↓

**Procedures**

Where the system matters operationally.

Aircraft Systems should not feel like a standalone encyclopedia.

---

# 7. Main System Page

Design:

`Boeing 737 MAX 8 → Systems → Electrical`

The page should establish:

* Aircraft context
* Current system
* Short system purpose statement
* Interactive conceptual diagram
* Learning sections
* Related cockpit controls
* Related procedures
* Related concepts

The diagram should be one of the most important visual elements on the page.

---

# 8. System Introduction

Provide a short introductory mental model.

Example design content:

## Electrical

The electrical system provides power to aircraft equipment using several available power sources and distributes that power through the aircraft electrical network.

Keep this short.

The user should understand the basic idea before exploring individual components.

---

# 9. Interactive Diagram

Design a clear conceptual Electrical System diagram.

A simplified relationship might conceptually resemble:

```text
BATTERY
   │
   ▼
DC POWER
   │
   ▼
DISTRIBUTION / BUSES

GROUND POWER ───┐
APU GENERATOR ──┼──► AC POWER ───► DISTRIBUTION
ENGINE GEN 1 ───┤
ENGINE GEN 2 ───┘
```

This is not a technical specification.

The final system relationships will be defined and verified during content development.

---

# 10. Diagram Philosophy

The diagram should prioritize mental-model formation.

It should clearly communicate:

* Major sources
* Major relationships
* Direction / flow
* Distribution
* Important alternative sources

Avoid:

* Maintenance schematic appearance
* Dense engineering notation
* Excessive wiring lines
* Hundreds of labels
* Decorative aviation graphics

A beginner should be able to look at the diagram and understand its overall structure quickly.

---

# 11. Diagram Interaction

Important components should be selectable.

Example:

User selects:

`BATTERY`

The interface should:

1. Highlight the Battery node.
2. Emphasize relevant relationships.
3. Reduce emphasis on unrelated diagram paths.
4. Show component information.
5. Provide related cockpit controls.
6. Provide related procedures.

The diagram should remain visible while reading component information.

---

# 12. Example Selected Component

Use:

`AIRCRAFT BATTERY`

as the selected example.

Show content such as:

### What It Does

Provides an initial source of electrical power and supports specific aircraft electrical functions.

### Why It Matters

The battery allows essential electrical power to be available before another electrical source is connected.

### Related Cockpit Control

`BATTERY SWITCH`

### Related Concepts

* DC Power
* Electrical Bus
* Standby Power

### Used In Procedures

* Power Up
* Shutdown

This is illustrative design content and not final verified technical content.

---

# 13. Component Detail Panel

On Desktop, selected-component information may use a secondary panel.

The panel should remain subordinate to the system diagram.

Suggested hierarchy:

### Component name

`AIRCRAFT BATTERY`

### Role

Short practical explanation.

### Why it matters

Operational relevance.

### Related controls

Example:

`BATTERY SWITCH`

### Related concepts

Example:

`DC POWER`

`STANDBY POWER`

### Used in procedures

`POWER UP`

`SHUTDOWN`

### Verification metadata

Secondary only.

Avoid creating a long technical-document sidebar.

---

# 14. Relationship Highlighting

When a component is selected, visually demonstrate how connected relationships become clearer.

Example:

Selecting:

`APU GENERATOR`

could emphasize:

`APU GENERATOR → AC POWER → DISTRIBUTION`

while unrelated sources become more subdued.

The effect should feel educational, not like live telemetry.

---

# 15. No Live Simulator State

This requirement is critical.

CockpitPath v0.1 does not know the aircraft's live electrical state.

Do not visually imply that:

* Battery is currently active
* APU Generator is online
* Ground Power is connected
* Engine Generators are supplying power
* A bus is currently powered

unless the design explicitly labels the view as a conceptual learning scenario.

Cyan means:

**selected / focused**

not:

**currently powered**

---

# 16. Learning Scenarios

The system experience may include conceptual scenarios such as:

* Aircraft on Battery
* External Power Available
* APU Providing Power
* Engines Running

These must be clearly labeled as learning configurations.

Example:

`LEARNING SCENARIO · APU PROVIDING POWER`

Do not present them as the state of the user's simulator.

---

# 17. Scenario Switching

Demonstrate a lightweight way to switch conceptual scenarios if useful.

Possible pattern:

`BATTERY`

`GROUND POWER`

`APU POWER`

`ENGINE POWER`

The goal is to show how the system relationship changes conceptually.

Do not design a full electrical-system simulator.

---

# 18. Progressive Learning Sections

The page should support structured learning.

Example:

### 01 — Big Picture

What the electrical system does.

### 02 — Power Sources

Battery, Ground Power, APU Generator, Engine Generators.

### 03 — AC and DC

Simple explanation of the main electrical domains.

### 04 — Distribution

How power reaches aircraft systems.

### 05 — Standby Power

Why backup electrical power exists.

### 06 — Cockpit Controls

How pilots interact with the system.

### 07 — Operational Flow

How the system appears during normal aircraft operation.

The design does not need to show every section fully expanded at once.

Use progressive disclosure.

---

# 19. Section Navigation

Provide compact system-section navigation.

Avoid large learning cards.

Possible pattern:

`01 BIG PICTURE`

`02 POWER SOURCES`

`03 AC / DC`

`04 DISTRIBUTION`

`05 STANDBY`

`06 CONTROLS`

`07 OPERATIONS`

The design should show which section is currently active.

---

# 20. System Navigation

Users also need to switch between aircraft systems.

Potential systems:

* Electrical
* Fuel
* Hydraulics
* Pneumatics
* Air Conditioning
* Flight Controls

Use a compact selector consistent with Cockpit Explorer's panel selector.

Do not create a large card grid once the user is inside the Systems experience.

---

# 21. Related Cockpit Controls

Show a direct relationship between system knowledge and Cockpit Explorer.

For Electrical, examples may include:

* Battery Switch
* Standby Power
* Ground Power
* Generator Controls

Provide an action such as:

`View in Cockpit Explorer →`

Selecting it should conceptually take the user directly to the appropriate control.

Do not design Cockpit Explorer again.

Use the already approved experience.

---

# 22. Cockpit Explorer Context

Demonstrate how the system page can preserve context.

Example:

User is learning:

`Aircraft Battery`

Related control:

`Battery Switch`

Action:

`View in Cockpit Explorer`

Cockpit Explorer should eventually open:

`Cockpit → Overhead → Electrical → Battery Switch`

This relationship is important to the CockpitPath product model.

---

# 23. Related Procedures

System learning should connect directly to operations.

Example:

### USED IN PROCEDURES

`Power Up`

`Engine Start`

`Shutdown`

Provide a clear action:

`View procedure →`

or:

`See in procedure →`

Do not automatically move the user out of Aircraft Systems without clear intent.

---

# 24. Guide Mode Connection

Aircraft Systems may be opened from a Guide Mode Learn explanation.

For example:

Guide step:

`BATTERY → ON`

could link to:

`Learn Electrical System →`

The visual design should support easy return to the original Guide Mode context.

Do not redesign Guide Mode.

---

# 25. Related Concepts

Display reusable educational concepts such as:

* Electrical Bus
* AC Power
* DC Power
* Standby Power
* Generator

Concepts should be visually consistent with the concept treatment already used in Guide Mode and Cockpit Explorer.

Selecting a concept should reveal concise contextual information.

Do not create unnecessary modal nesting.

---

# 26. Essentials vs More Detail

Aircraft Systems should support progressive learning depth.

Do not use the Guide Mode Quick / Learn toggle.

Instead use contextual disclosure.

Possible patterns:

`Essentials`

and:

`More detail`

or expandable sections.

The default view should remain beginner-friendly.

---

# 27. Why This Matters

Include an operational-learning pattern such as:

### WHY THIS MATTERS

This should connect technical understanding to simulator operation.

Example design content:

Understanding the available power sources helps explain why the startup procedure moves from Battery to external or APU power before engine start.

This is one of CockpitPath's key educational differentiators.

---

# 28. Desktop Design

Create a wide Desktop design.

Prioritize:

### Primary

Interactive Electrical System diagram.

### Secondary

Selected component explanation.

### Supporting

* Learning sections
* Related controls
* Procedures
* Concepts

The diagram should remain central.

Avoid designing a long documentation page where the diagram appears once and disappears above the fold.

---

# 29. Desktop Scrolling

Aircraft Systems may scroll vertically.

The design should demonstrate how important context remains available.

Possible approaches:

* Sticky system navigation
* Sticky or persistent diagram region
* Section-based diagram changes
* Compact current-system header

Do not over-engineer scrolling behavior in the design mockup.

---

# 30. iPad / Tablet Design

Create a dedicated iPad landscape layout.

Tablet is a primary CockpitPath learning device.

Priorities:

* Large system diagram
* Touch-friendly nodes
* Component selection
* Bottom sheet or drawer for details
* Large touch targets
* Clear section navigation
* Clear system switching

No hover dependencies.

---

# 31. Mobile Design

Create a mobile representation.

Do not attempt to shrink the wide Desktop diagram unchanged.

Prefer a mobile-specific representation.

Possible pattern:

```text
BATTERY
   ↓
DC POWER
   ↓
BUSES
```

with expandable source groups.

The design should preserve conceptual understanding over geometric consistency.

Prioritize:

1. System purpose
2. Simplified diagram
3. Selected component
4. Component explanation
5. Related controls / procedures

---

# 32. Responsive Diagram Philosophy

The conceptual relationships stay consistent across devices.

The geometry may change.

### Desktop

Wide relationship diagram.

### Tablet

Compact landscape diagram.

### Mobile

Vertical or stacked system flow.

This is expected behavior, not a compromise.

---

# 33. Diagram Visual Language

The system diagram should feel related to CockpitPath but should not mimic aircraft avionics.

Use:

* Dark surfaces
* Restrained line work
* Clear nodes
* Cyan for current focus
* Neutral inactive relationships
* Strong typography
* Subtle grouping

Avoid:

* Neon circuit-board aesthetics
* Sci-fi diagrams
* Gaming effects
* Animated glowing electrical lines
* Avionics imitation

---

# 34. Flow Types

If multiple conceptual flow types require differentiation, use minimal visual distinctions.

Do not rely on color alone.

Possible supporting cues:

* Labels
* Line styles
* Direction arrows
* Group boundaries
* Icons only where useful

Do not establish unnecessary complex visual legends.

---

# 35. Verification Treatment

Show secondary verification status where appropriate.

Example:

`MSFS 2024 · iFly 737 MAX 8 · VERIFICATION STATUS: PENDING`

Do not invent technical source references.

Verification information must never dominate learning content.

---

# 36. Content Status

The system area may eventually support:

* Available
* Partial
* Coming Soon

Example:

`ELECTRICAL · AVAILABLE`

`FUEL · AVAILABLE`

`PNEUMATICS · COMING SOON`

Keep these states visually restrained.

Do not make the system page look like a product roadmap.

---

# 37. Accessibility

The visual design should support implementation with:

* Keyboard-selectable nodes
* Visible focus states
* Semantic component names
* Strong contrast
* Non-color-only relationship communication
* Large touch targets
* Text descriptions of diagram relationships
* Browser zoom

Do not create nodes that require pixel-perfect clicking.

---

# 38. Placeholder Content

All system relationships and technical statements in this design are illustrative unless already verified elsewhere in CockpitPath documentation.

The design must not imply technical certification or final technical accuracy.

The objective is to define the interaction and learning presentation.

---

# 39. Avoid

Do not create:

* Maintenance schematic UI
* Interactive engineering simulation
* Electrical circuit simulator
* Gaming HUD
* Sci-fi power network
* Generic LMS
* Documentation wiki
* Long article with decorative diagram
* Dashboard KPI cards
* AI chat
* Quiz experience
* Failure simulation
* Live aircraft telemetry

Aircraft Systems is a visual learning experience.

---

# 40. Deliverable

Create **one Aircraft Systems visual direction** extending the approved CockpitPath design language.

Do not create multiple directions.

Use:

`Boeing 737 MAX 8 → Electrical`

as the example.

Demonstrate:

### Wide Desktop

* System overview
* Interactive conceptual diagram
* Selected Aircraft Battery component
* Component detail
* Learning section navigation
* System navigation
* Related cockpit controls
* Related procedures
* Related concepts
* Cockpit Explorer connection

### iPad Landscape

* Touch-first system diagram
* Selected component
* Detail interaction
* Section navigation
* System navigation

### Mobile

* Simplified responsive system diagram
* Selected component
* Component explanation
* Related controls and procedures

Also demonstrate at least one conceptual learning scenario if it improves understanding.

The design should be sufficiently resolved to become the production visual reference if approved.

Do not design any additional CockpitPath screens.
