# CockpitPath — Cockpit Explorer Design Brief

**Product:** CockpitPath
**Area:** Cockpit Explorer
**Design Stage:** Initial Visual Design
**Last Updated:** 2026-08-24

## 1. Objective

Design the CockpitPath **Cockpit Explorer** experience.

Cockpit Explorer is one of CockpitPath's core learning experiences.

It allows flight simulation users to visually explore an aircraft cockpit, select cockpit controls, understand what they do, and see where those controls are used in procedures.

The UX specification is defined in:

`docs/ux/cockpit-explorer.md`

That document is the source of truth for product behavior and information hierarchy.

Do not redesign the underlying UX without a clear usability reason.

---

## 2. Existing Product Design Language

CockpitPath already has an approved visual direction.

Read and follow:

`docs/design/guide-mode-direction.md`

Also inspect the approved Guide Mode and Aircraft Page design references.

The Cockpit Explorer must feel like part of the same product.

Do not create a new visual direction.

Preserve the established characteristics:

* Dark, low-glare environment
* Cyan primary focus accent
* Minimal visual noise
* Strong information hierarchy
* Restrained borders
* Monospace only for technical values, control names, states, and compact metadata
* Highly readable interface typography
* Simulator-focused rather than website-focused character
* Premium but restrained visual treatment

---

## 3. Core User Question

Cockpit Explorer should answer:

> What is this control, what does it do, and when would I use it?

The experience is visual first.

The cockpit image is the main navigation surface.

Users should not need to know the technical name of a control before finding it.

---

## 4. Example Aircraft

Use the following implementation for all design examples:

**Aircraft**

Boeing 737 MAX 8

**Add-on**

iFly

**Simulator**

Microsoft Flight Simulator 2024

Do not invent add-on version numbers or verification dates.

Where verification metadata is required, use neutral placeholder states such as:

`VERIFICATION STATUS: PENDING`

---

## 5. Example Exploration Scenario

Use this example consistently across the design.

The user opens:

`Boeing 737 MAX 8 → Cockpit Explorer`

They navigate:

`Cockpit → Overhead → Electrical`

They select:

`Battery Switch`

The selected control should demonstrate the complete control-detail experience.

---

## 6. Example Control Content

### Control

`BATTERY SWITCH`

### Location

`OVERHEAD → ELECTRICAL`

### What It Does

Connects the aircraft battery to the electrical system and provides initial electrical power during aircraft startup.

### When You Use It

Used during aircraft power-up and shutdown procedures.

### Positions

`OFF`

`ON`

### Related System

`Electrical`

### Related Concepts

* Standby Power
* Electrical Bus
* Ground Power

### Used In Procedures

* Power Up
* Shutdown

This content is illustrative design content and does not represent final verified CockpitPath procedure content.

---

# 7. Core Experience

The Cockpit Explorer experience should support the following flow:

## Full Cockpit

The user sees a broad cockpit orientation.

Selectable major regions may include:

* Overhead
* Main Instrument Panel
* MCP
* Center Pedestal
* CDU / FMC

↓

## Panel

The user enters:

`Overhead`

Selectable system areas become visible.

For example:

* Electrical
* Fuel
* Hydraulics
* Pneumatics

↓

## Panel Area

The user enters:

`Electrical`

Individual controls become selectable.

↓

## Control

The user selects:

`Battery Switch`

CockpitPath highlights the control and opens its information.

The physical cockpit context should remain visible throughout the experience.

---

# 8. Progressive Hotspot Density

Do not display every control hotspot simultaneously on a full cockpit image.

Hotspot density should increase progressively.

### Full Cockpit Level

Show major cockpit regions.

### Panel Level

Show major system or functional areas.

### Area Level

Show individual controls.

This progressive model is critical.

The cockpit image must remain visually understandable rather than becoming covered with UI markers.

---

# 9. Main Visual Surface

The cockpit image should dominate the experience.

The interface should feel like exploring an interactive technical diagram rather than browsing documentation.

The design should provide enough surrounding context that users understand where the selected control physically exists in the cockpit.

Do not reduce the cockpit image to a small illustration beside a large text panel.

---

# 10. Hotspot Style

Reuse the existing CockpitPath hotspot language established during Guide Mode exploration.

Possible treatment:

* Cyan active boundary
* Focus corners
* Surrounding-area dimming
* Control label
* Optional connecting line
* Localized zoom

The selected hotspot must immediately communicate:

> This is the control you selected.

Do not rely on color alone.

---

# 11. Hotspot States

Demonstrate a system capable of supporting:

### Default

Minimal or invisible markers.

### Hover

Desktop only.

Subtle indication of interactive areas.

### Keyboard Focus

Visible accessible focus state.

### Selected

Strong CockpitPath focus state.

### Related

A secondary visual treatment for controls related to the selected control.

Do not cover the cockpit with permanent labels.

---

# 12. Control Detail Panel

Selecting a control should reveal information without navigating away from Cockpit Explorer.

On desktop, a side detail panel is likely appropriate.

It should support:

### Control Name

`BATTERY SWITCH`

### Location

`OVERHEAD → ELECTRICAL`

### What It Does

Short practical explanation.

### When You Use It

Operational context.

### Positions / States

Where relevant.

### Related System

`Electrical`

### Related Concepts

For example:

`STANDBY POWER`

`ELECTRICAL BUS`

`GROUND POWER`

### Used In Procedures

`POWER UP`

`SHUTDOWN`

### Simulator Notes

Only where relevant.

### Verification

Secondary metadata only.

The panel must not feel like a documentation article.

---

# 13. Information Hierarchy

Inside the selected control experience, prioritize:

1. Control identity
2. What it does
3. When it is used
4. Related procedure connections
5. Related system / concepts
6. Secondary technical information

The cockpit image remains more important than the text panel.

---

# 14. Search

Cockpit Explorer must include search.

Example queries:

`battery`

`APU`

`VNAV`

`fuel pump`

Search should support users who know approximately what they are looking for.

A result should show:

* Control name
* Panel / location
* Optional category

Selecting a result should:

1. Navigate to the correct cockpit region.
2. Focus the relevant panel.
3. Highlight the selected control.
4. Open its detail information.

Demonstrate this interaction visually.

---

# 15. Search Should Support Beginners

The design should not assume that users know exact aviation terminology.

The product model will support aliases.

For example:

Canonical:

`BATTERY SWITCH`

Possible search terms:

* battery
* battery master
* power switch

The UI does not need to expose aliases explicitly.

---

# 16. Breadcrumb Navigation

Cockpit Explorer should provide spatial orientation.

Example:

`COCKPIT → OVERHEAD → ELECTRICAL → BATTERY SWITCH`

The user should be able to move back through the cockpit hierarchy.

Breadcrumbs must remain compact and consistent with CockpitPath's existing technical visual language.

---

# 17. Panel Selector

Provide a compact way to jump directly between major cockpit areas.

Initial conceptual areas:

* Full Cockpit
* Overhead
* Main Instrument Panel
* MCP
* Center Pedestal
* CDU / FMC

Avoid large navigation cards once the user is already inside Cockpit Explorer.

---

# 18. Zoom and Pan Controls

The visual surface should support:

* Zoom in
* Zoom out
* Pan
* Reset
* Focus selected control
* Show full panel
* Show full cockpit

Controls should remain visually secondary.

On tablet, assume direct touch gestures for zoom and pan.

---

# 19. Guide Me There

Reuse the CockpitPath interaction:

`Guide me there`

This may be especially useful after a user selects a search result.

The intended orientation sequence is:

1. Full cockpit
2. Relevant panel
3. Relevant area
4. Exact control

The design should demonstrate how this can happen without navigating away from Cockpit Explorer.

Do not turn it into a separate page.

---

# 20. Related Procedures

Procedure integration is a major CockpitPath differentiator.

For the selected Battery Switch, show:

### USED IN PROCEDURES

`Power Up`

`Shutdown`

A user should be able to choose a procedure and see how the control is used.

Possible action:

`View in procedure →`

or equivalent.

Do not automatically leave Cockpit Explorer without clear user intent.

---

# 21. Related Controls

The selected control may display related cockpit controls.

For example:

### RELATED CONTROLS

* Standby Power
* Ground Power
* APU Generator

Selecting a related control should update the cockpit focus to that control.

This should feel like moving through the cockpit rather than opening unrelated pages.

---

# 22. Related Systems

The Battery Switch belongs to:

`Electrical`

Provide an appropriate entry point into Aircraft Systems content.

Do not design the full Aircraft Systems experience in this task.

Only show the connection from Cockpit Explorer.

---

# 23. Related Concepts

Concepts are reusable educational objects shared with Guide Mode.

Example:

* Electrical Bus
* Standby Power
* Ground Power

Selecting a concept should open concise supporting information without removing the user from the cockpit context.

Possible presentation:

* Drawer
* Inline expansion
* Compact popover

Avoid nested modal complexity.

---

# 24. Displays and Non-Switch Controls

The visual system must not assume every hotspot is a switch.

Cockpit Explorer will eventually contain:

* Switches
* Buttons
* Knobs
* Levers
* Displays
* Indicators
* Annunciators
* Gauges
* Composite control groups

The design language should work for all of them.

---

# 25. Desktop Experience

Create a wide desktop design.

Recommended priorities:

### Main area

Large interactive cockpit image.

### Secondary area

Control details.

### Supporting chrome

* Search
* Breadcrumb
* Panel selector
* Zoom controls

The cockpit image should remain dominant.

Do not create a conventional documentation sidebar that consumes excessive screen width.

---

# 26. iPad / Tablet Experience

Tablet is a primary CockpitPath target.

Create a dedicated iPad landscape design.

The experience should support:

* Direct hotspot selection
* Pinch-to-zoom behavior
* Drag to pan
* Large touch targets
* Easy panel navigation
* Search
* Detail content without hiding the entire image

A bottom sheet or responsive drawer may be appropriate.

The design should feel like interacting with a technical cockpit map.

---

# 27. Mobile Experience

Create a mobile design.

Cockpit Explorer remains supported, although mobile is not the ideal large-cockpit exploration environment.

Prioritize:

1. Search
2. Cockpit image
3. Selected hotspot
4. Control details

A bottom sheet is likely appropriate.

Users must still be able to return easily to the image while reading control information.

---

# 28. Narrow Companion Window

Also consider how Cockpit Explorer behaves around:

`400–550 px`

width.

This is not as important as Guide Mode's companion use case, but the experience should remain functional beside the simulator.

Possible behavior:

* Image remains primary
* Details become a drawer
* Search remains available
* Breadcrumbs simplify
* Panel selector becomes compact

A dedicated full design is optional if the responsive behavior can be clearly demonstrated elsewhere.

---

# 29. Interaction Example to Demonstrate

The design should clearly communicate this journey:

### State 1

Full cockpit.

User selects:

`OVERHEAD`

### State 2

Overhead panel.

User selects:

`ELECTRICAL`

### State 3

Electrical area.

User selects:

`BATTERY SWITCH`

### State 4

Battery Switch selected.

Detail information visible.

### State 5

User selects:

`POWER UP`

under Used in Procedures.

Show how CockpitPath offers the transition toward Guide Mode.

The complete transition to Guide Mode does not need to be designed in this task.

---

# 30. Visual Character

Maintain the approved CockpitPath personality:

* Dark
* Low glare
* Calm
* Precise
* Technical
* Premium
* Modern
* Aviation aware
* Focused

The cockpit itself should visually carry most of the aviation character.

The surrounding UI should remain restrained.

---

# 31. Avoid

Do not create:

* A cockpit simulator
* Clickable fake cockpit switches as website UI
* A maintenance manual interface
* A huge text documentation panel
* A gaming HUD
* A sci-fi control system
* A generic image annotation tool
* A conventional LMS
* A generic SaaS dashboard
* A card wall
* Heavy gamification
* AI chat functionality

Cockpit Explorer is an interactive aircraft-learning tool.

---

# 32. Image Placeholder

Real iFly Boeing 737 MAX 8 simulator screenshots are not yet available as production assets.

Use realistic structural placeholders where necessary.

Do not imply that placeholder cockpit illustrations are final product assets.

The production system will use real CockpitPath-approved simulator captures.

---

# 33. Verification

Do not invent:

* Add-on version numbers
* Simulator version numbers
* Verification dates
* Documentation sources

Use neutral design placeholders where metadata is needed.

Example:

`VERIFICATION STATUS: PENDING`

---

# 34. Responsive Philosophy

Do not simply scale the desktop design down.

Each target should be designed for its interaction model.

### Desktop

Mouse, trackpad, keyboard, large image.

### Tablet

Direct touch exploration.

### Mobile

Search-first and bottom-sheet driven.

---

# 35. Deliverable

Create **one Cockpit Explorer visual direction** using the already approved CockpitPath design language.

Do not create multiple visual directions.

Demonstrate:

### Wide Desktop

* Full exploration experience
* Selected Battery Switch
* Control detail panel
* Search
* Breadcrumbs
* Panel navigation
* Related procedures
* Related system / concepts
* Zoom controls

### iPad Landscape

* Touch-first exploration
* Selected control
* Detail interaction
* Search
* Panel switching

### Mobile

* Search
* Cockpit visual
* Selected hotspot
* Bottom-sheet control details

Also demonstrate the progressive hierarchy:

`Cockpit → Overhead → Electrical → Battery Switch`

The design should be sufficiently resolved to become a production reference if approved.

Do not design additional CockpitPath screens in this task.
