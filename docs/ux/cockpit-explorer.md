# CockpitPath — Cockpit Explorer UX Specification

**Document Status:** Draft v0.1
**Product:** CockpitPath
**Area:** Cockpit Learning / Explorer
**Last Updated:** 2026-08-24

## 1. Purpose

Cockpit Explorer allows users to visually explore an aircraft cockpit and learn what individual controls, panels, displays, and systems do.

The primary question it answers is:

> What is this control, what does it do, and when would I use it?

Cockpit Explorer complements Guide Mode.

Guide Mode answers:

> What should I do next?

Cockpit Explorer answers:

> What is this thing I am looking at?

The two experiences should be connected so users can move naturally between understanding a cockpit control and seeing how it is used in procedures.

---

## 2. Primary Use Case

A user opens:

`Boeing 737 MAX 8 → Cockpit Explorer`

The initial supported implementation is:

* Boeing 737 MAX 8
* iFly
* Microsoft Flight Simulator 2024

The user sees a visual representation of the cockpit.

They may:

1. Select a cockpit area.
2. Explore a specific panel.
3. Select a control or display.
4. Read a concise explanation.
5. See related systems and procedures.
6. Open a procedure that uses that control.

The experience should encourage exploration without overwhelming the user.

---

## 3. Core Product Principle

Cockpit Explorer is **visual first**.

The cockpit image is the primary navigation surface.

The user should not need to know the technical name of a control before finding it.

The product should support the learning flow:

**See it → Select it → Understand it → See where it is used**

---

## 4. Relationship to Guide Mode

Cockpit Explorer and Guide Mode use the same underlying cockpit-control model.

A Guide Mode step may reference:

`battery-switch`

Cockpit Explorer may also reference:

`battery-switch`

This allows the same control to connect to:

* Cockpit location
* Description
* System
* Related concepts
* Related procedures
* Guide Mode hotspots

Control definitions should not be duplicated separately for each feature.

---

## 5. Explorer Hierarchy

Cockpit Explorer should support hierarchical exploration.

Example:

```text
Aircraft
└── Cockpit
    ├── Overhead
    │   ├── Electrical
    │   ├── Fuel
    │   ├── Hydraulics
    │   ├── Pneumatics
    │   └── Air Conditioning
    │
    ├── Main Instrument Panel
    │   ├── Captain PFD
    │   ├── Captain ND
    │   ├── Engine Displays
    │   └── Standby Instruments
    │
    ├── MCP
    │
    ├── Center Pedestal
    │   ├── CDU / FMC
    │   ├── Radios
    │   └── Transponder
    │
    └── Aft / Other Panels
```

The exact panel taxonomy should reflect the supported aircraft implementation.

---

## 6. Entry Experience

When Cockpit Explorer opens, users should initially see a broad cockpit orientation view.

The page should clearly identify:

* Aircraft
* Simulator
* Add-on implementation
* Current cockpit area
* Available cockpit regions

Example:

`Boeing 737 MAX 8`

`Cockpit Explorer`

The initial image may contain large selectable regions such as:

* Overhead
* Main Panel
* MCP
* Center Pedestal

Users should be able to enter a region directly from the visual.

---

## 7. Visual Exploration Model

The main cockpit image uses:

**Base Image + Interactive Hotspots**

Hotspots may represent:

* Entire panels
* Panel sections
* Individual switches
* Knobs
* Buttons
* Displays
* Indicators

Different exploration levels may use different hotspot densities.

The full cockpit view should not expose hundreds of individual controls simultaneously.

---

## 8. Progressive Detail

Hotspot density should increase as the user zooms into a cockpit area.

Example:

### Level 1 — Cockpit

Clickable regions:

* Overhead
* MCP
* Main Panel
* Pedestal

### Level 2 — Overhead

Clickable groups:

* Electrical
* Fuel
* Hydraulics
* Pneumatics

### Level 3 — Electrical

Clickable controls:

* Battery switch
* Standby Power
* Ground Power
* Generator switches

This prevents the cockpit from becoming visually cluttered.

---

## 9. Selection Behavior

Selecting a hotspot should:

1. Highlight the selected control.
2. Preserve the cockpit image context.
3. Open control information without navigating away from the Explorer.

The information may appear in:

* Side panel
* Drawer
* Bottom sheet on mobile
* Responsive detail panel

The image should remain visible whenever possible.

---

## 10. Control Detail Structure

A selected cockpit control should support the following information.

### Name

Example:

`BATTERY SWITCH`

### Location

Example:

`OVERHEAD → ELECTRICAL`

### What It Does

A concise description of the control's purpose.

### When You Use It

Operational context describing when a pilot normally interacts with it.

### Possible Positions / States

Example:

* OFF
* ON

Where relevant.

### What to Expect

Observable effects associated with using the control.

### Related System

Example:

`Electrical`

### Related Concepts

Example:

* Electrical Bus
* Standby Power
* Ground Power

### Used In Procedures

Example:

* Power Up
* Shutdown

### Simulator Notes

Only when behavior differs or requires specific knowledge in the supported add-on.

### Verification Metadata

Available through secondary information rather than dominating the interface.

Not every field is required for every control.

---

## 11. Content Writing Principle

Control descriptions should answer practical learning questions.

Avoid content that reads like copied technical manuals.

Prefer:

> Connects the aircraft battery to the electrical system and provides initial electrical power during aircraft startup.

Over:

> A highly technical description containing unnecessary engineering detail.

CockpitPath should remain technically accurate while being understandable to simulator users learning the aircraft.

---

## 12. "Used In Procedures"

This is a key connection between Cockpit Explorer and Guide Mode.

For a selected control:

### Used in

`Power Up`

`Shutdown`

Selecting a procedure should offer an appropriate action such as:

`View procedure`

or:

`See this control in procedure`

The user should not unexpectedly lose their current Cockpit Explorer context.

---

## 13. Procedure Cross-Linking

A control may be used in multiple procedures.

Example:

### BATTERY SWITCH

Used in:

* Power Up
* Shutdown
* Electrical troubleshooting procedure in the future

The system should not duplicate control explanations inside each procedure.

Guide Mode references the shared control entity.

---

## 14. Related Concepts

Cockpit controls may connect to reusable learning concepts.

Example:

`BATTERY SWITCH`

Related concepts:

* Battery Bus
* Standby Power
* AC Power
* DC Power

Selecting a concept should open a concise explanation without leaving Cockpit Explorer.

The concept system should be shared with Learn Mode in Guide Mode.

---

## 15. Related Controls

Some controls are best understood together.

Example:

`BATTERY SWITCH`

Related controls:

* Standby Power
* Ground Power
* APU Generator

Cockpit Explorer may provide:

`Related controls`

Selecting one should move the visual focus to the corresponding hotspot.

---

## 16. Systems Connection

Controls should link to the system they belong to.

Example:

`BATTERY SWITCH`

System:

`Electrical`

Selecting the system may open the corresponding aircraft-system learning content.

The user should always understand whether they are:

* exploring a cockpit control,
* learning a system,
* following a procedure.

These experiences are related but distinct.

---

## 17. Search

Cockpit Explorer should support searching for cockpit controls.

Examples:

`battery`

`APU`

`VNAV`

`fuel pump`

Search results should show:

* Control name
* Cockpit location
* Related panel

Selecting a result should automatically navigate the Explorer to the correct panel and highlight the control.

Search should not require exact technical terminology.

Aliases may be supported in the content model.

---

## 18. Search Aliases

Controls may define alternate search terms.

Example:

```text
Control:
Battery Switch

Aliases:
battery
battery master
power switch
```

This helps beginners find controls even when they do not yet know the official terminology.

Aliases are search metadata and should not alter the canonical displayed control name.

---

## 19. Breadcrumbs

Cockpit Explorer should provide lightweight spatial orientation.

Example:

`Cockpit → Overhead → Electrical → Battery Switch`

Breadcrumbs should allow users to navigate back to:

* Electrical panel
* Overhead
* Full cockpit

without losing the overall aircraft context.

---

## 20. Back Navigation

Back navigation should follow the cockpit hierarchy rather than browser-like page jumps.

Example:

Battery Switch

→ Electrical

→ Overhead

→ Full Cockpit

The experience should feel like moving through the physical cockpit.

---

## 21. Zoom and Pan

Cockpit imagery should support:

* Zoom
* Pan
* Reset
* Focus selected control
* Show full panel
* Show full cockpit

Touch gestures should work naturally on tablets.

Desktop should support mouse and trackpad interaction.

---

## 22. Focus Behavior

When a control is selected, CockpitPath may automatically:

1. Zoom toward the relevant area.
2. Center the control.
3. Dim surrounding content.
4. Display a focus outline or frame.
5. Show the control name.

Users must still be able to zoom out and understand the control's wider cockpit location.

---

## 23. Highlight System

The Cockpit Explorer highlight model should be shared with Guide Mode.

Possible presentation:

* Cyan focus border
* Corner focus marks
* Surrounding-area dimming
* Control label
* Optional connecting line

Color must not be the only indicator.

The highlight should remain understandable on real simulator screenshots with complex backgrounds.

---

## 24. Hotspot Interaction States

Hotspots may support:

### Default

Invisible or minimally visible.

### Hover

Desktop only.

Indicates that an area is interactive.

### Focus

Keyboard-accessible state.

### Selected

Strong active highlight.

### Related

Subtle secondary indication when showing related controls.

The default cockpit image should not look covered in UI markers.

---

## 25. Explore Mode

The default experience is exploration-oriented.

Users may move freely through the cockpit without starting a formal lesson.

There is no requirement to complete controls in sequence.

Cockpit Explorer is not a course.

---

## 26. Optional Guided Exploration

A future experience may provide guided cockpit tours such as:

* Overhead Panel Introduction
* Main Instrument Panel Basics
* MCP Introduction

These are not required for v0.1.

The architecture should allow them later without turning Cockpit Explorer itself into Guide Mode.

---

## 27. Desktop Layout

On wide desktop screens, a recommended conceptual layout is:

### Main area

Large cockpit image.

### Secondary area

Selected control details.

The cockpit image should remain the dominant part of the screen.

The detail panel should not become a large documentation sidebar that reduces useful image space excessively.

---

## 28. Narrow Desktop Behavior

Cockpit Explorer may also be used beside the simulator.

Unlike Guide Mode, this is not the primary Cockpit Explorer scenario, but it should still remain functional.

At narrower widths:

* Detail panel may become a drawer.
* Selected control remains visible.
* Cockpit image retains useful size.
* Search remains accessible.

---

## 29. Tablet / iPad

Tablet is a primary CockpitPath device class.

Cockpit Explorer should work especially well for direct touch exploration.

Requirements:

* Pinch to zoom
* Drag to pan
* Large interactive regions
* Bottom sheet or drawer for control details
* No hover dependency
* Easy return to full panel / cockpit

The experience should feel similar to exploring an interactive technical diagram.

---

## 30. Mobile

Mobile should support Cockpit Explorer but may use a simplified interaction model.

A likely structure:

1. Cockpit image
2. Selected hotspot
3. Bottom sheet with details

The image should remain accessible while reading control information.

Search becomes especially important on small screens.

---

## 31. Cockpit Panel Selector

Users should have a direct way to switch between major cockpit areas.

Possible areas for the initial Boeing 737 MAX implementation:

* Full Cockpit
* Overhead
* Main Instrument Panel
* MCP
* Center Pedestal
* CDU / FMC

The selector should remain compact.

Avoid large card-based navigation once the user is inside Cockpit Explorer.

---

## 32. Search vs Visual Navigation

Cockpit Explorer supports two complementary discovery methods:

### Visual

The user recognizes where something is located and selects it.

### Search

The user knows the name or approximate name and wants CockpitPath to locate it.

Both should lead to the same control-detail experience.

---

## 33. Unknown Control Scenario

A common use case is:

> I see this switch in the cockpit but I do not know what it is called.

Visual browsing solves this problem.

The user should be able to select the control directly from the cockpit image without performing a text search.

This is one of the main reasons Cockpit Explorer exists.

---

## 34. Can't Find a Control

If the user searches for a control, CockpitPath may use the same orientation pattern as Guide Mode:

`Guide me there`

The Explorer should then show:

1. Full cockpit
2. Relevant panel
3. Relevant area
4. Selected control

This navigation pattern should be consistent across CockpitPath.

---

## 35. Control States

Some controls have meaningful positions or states.

Example:

### Battery Switch

Positions:

`OFF`

`ON`

Cockpit Explorer should explain states where they help understanding.

It should not simulate full cockpit logic in v0.1.

Interactive control manipulation is outside the initial scope.

---

## 36. Displays and Indicators

Not every cockpit hotspot is a switch.

Cockpit Explorer must support:

* Displays
* Indicators
* Annunciators
* Gauges
* Knobs
* Levers
* Buttons
* Switches

The content model should not assume that every hotspot has an ON/OFF state.

---

## 37. Composite Controls

Some areas contain groups of closely related controls.

The Explorer should support both:

### Group entity

Example:

`MCP Speed Controls`

and:

### Individual entity

Example:

`IAS/MACH Selector`

This allows appropriate levels of explanation without forcing every tiny component to become a separate learning object.

---

## 38. Content Verification

Every Cockpit Explorer entry should support verification metadata.

Possible fields:

* Aircraft
* Add-on
* Simulator
* Add-on version
* Simulator version
* Source
* Last verified
* Simulator-specific notes

Verification metadata remains secondary in the primary interface.

No version numbers or verification dates should be displayed unless actually verified.

---

## 39. Simulator-Specific Differences

If the supported add-on behaves differently from the aircraft documentation or another simulator implementation, CockpitPath should explicitly mark the note.

Example:

### Simulator Note

Behavior in the iFly implementation differs from the real-aircraft sequence in this specific context.

Such notes should be used only where verified and relevant.

---

## 40. Accessibility

Cockpit Explorer must not require precise mouse interaction.

Requirements include:

* Keyboard-accessible hotspots
* Visible focus indicators
* Accessible hotspot names
* Sufficient contrast
* Non-color-only highlighting
* Large touch targets
* Browser zoom support
* Screen-reader descriptions where practical

Hotspots should have semantic labels rather than being anonymous image regions.

---

## 41. Image Quality

Cockpit Explorer depends heavily on high-quality imagery.

Images should be:

* Sharp
* High resolution
* Consistently framed
* Captured from the supported simulator implementation
* Free from unnecessary simulator UI overlays
* Suitable for zooming

Image capture standards will be documented separately.

---

## 42. Content Density

Cockpit Explorer may eventually contain hundreds of controls.

The interface must avoid exposing all control labels at once.

Progressive detail, zoom level, panel grouping, search, and contextual selection should manage complexity.

The cockpit should remain visually recognizable.

---

## 43. v0.1 Scope

The initial Cockpit Explorer should support a limited, high-quality subset of the Boeing 737 MAX cockpit.

Recommended first areas:

* Overhead
* MCP
* Main Instrument Panel
* Center Pedestal
* CDU / FMC

Not every cockpit control must be documented before the first beta.

Quality and clarity are more important than complete cockpit coverage.

---

## 44. v0.1 Out of Scope

Cockpit Explorer v0.1 does not include:

* Real-time SimConnect state
* Interactive cockpit simulation
* Automatic aircraft-control detection
* Animated system logic
* User-created hotspots
* Community annotations
* Voice search
* AI instructor
* AR cockpit overlays
* Full aircraft training course
* Automatic control manipulation

---

## 45. Data Model Implications

The UX assumes reusable entities such as:

```text
Aircraft
Panel
Panel Area
Control
Hotspot
System
Concept
Procedure
Procedure Step
```

Relationships may include:

```text
Control → Panel
Control → System
Control → Related Controls
Control → Related Concepts
Control → Procedures
Procedure Step → Control
Hotspot → Control
```

The exact technical schema will be defined in the architecture documentation.

---

## 46. Primary Success Criterion

Cockpit Explorer v0.1 is successful when a user can:

1. Open a Boeing 737 MAX cockpit view.
2. Select a cockpit region.
3. Select an unfamiliar control.
4. Immediately learn what the control is called.
5. Understand what it does.
6. Understand when it is used.
7. See the related system.
8. See procedures that use the control.
9. Open the relevant procedure without losing context.
10. Return to cockpit exploration easily.

---

## 47. Product Connection

Cockpit Explorer forms one of CockpitPath's three core learning pillars:

### Guide Mode

Learn **what to do next**.

### Cockpit Explorer

Learn **what cockpit controls are and where they are**.

### Aircraft Systems

Learn **why the aircraft works the way it does**.

These pillars should share content entities and visual language rather than behave as isolated products.

---

## 48. Design Requirements

The first Cockpit Explorer visual design should demonstrate:

* Full cockpit or panel exploration
* Progressive hotspot hierarchy
* Selected cockpit control
* Control information panel
* Search
* Breadcrumbs
* Related system
* Related concepts
* Used-in-procedures links
* Guide me there
* Zoom / pan controls
* Desktop layout
* iPad / tablet layout
* Mobile layout

The design must extend the existing CockpitPath visual language rather than introduce a new visual direction.

---

## Status

**Cockpit Explorer UX Specification v0.1**

Ready for visual design exploration.
