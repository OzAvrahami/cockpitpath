# CockpitPath — Aircraft Systems UX Specification

**Document Status:** Draft v0.1
**Product:** CockpitPath
**Area:** Aircraft Learning / Systems
**Last Updated:** 2026-08-24

## 1. Purpose

Aircraft Systems teaches users how an aircraft works beyond individual cockpit actions.

The primary question it answers is:

> How does this aircraft system work, why does it matter, and how does it connect to the controls I use?

Aircraft Systems complements the other core CockpitPath learning experiences:

### Guide Mode

Answers:

> What should I do next?

### Cockpit Explorer

Answers:

> What is this control and where is it?

### Aircraft Systems

Answers:

> How does the underlying aircraft system work and why?

These experiences should share the same aircraft, control, concept, and procedure entities rather than duplicate learning content.

---

## 2. Primary Use Case

A user opens:

`Boeing 737 MAX 8 → Systems`

and selects:

`Electrical`

The user wants to understand topics such as:

* Where electrical power comes from
* How power is distributed
* What the battery does
* What Ground Power does
* What the APU Generator does
* What engine generators do
* Why standby power exists
* How cockpit controls relate to the electrical system
* Which procedures use those controls

The experience should teach the system visually and progressively without requiring the user to read a technical manual.

---

## 3. Core Product Principle

Aircraft Systems should teach:

**Concept → Relationship → Cockpit → Procedure**

The user should first understand the system conceptually.

They should then be able to connect that knowledge to:

* Physical cockpit controls
* Operational procedures
* Related concepts
* Expected aircraft behavior

Aircraft Systems must not become a disconnected technical encyclopedia.

---

## 4. Learning Philosophy

CockpitPath should teach systems at the level required to become a better simulator pilot.

The product should be:

* Technically accurate
* Visually understandable
* Operationally relevant
* Progressive in depth
* Connected to real cockpit usage

Avoid unnecessary engineering detail unless it helps explain aircraft operation.

The goal is not aircraft maintenance training.

---

## 5. Initial System Example

Use the Boeing 737 MAX 8 Electrical System as the primary v0.1 design and content example.

Potential concepts include:

* Aircraft Battery
* External / Ground Power
* APU Generator
* Engine Generators
* AC Power
* DC Power
* Electrical Buses
* Standby Power
* Power Source Selection
* Basic power distribution

Exact technical content must later be verified against approved source material for the supported aircraft implementation.

---

## 6. System Library

The Aircraft Page may link to a Systems area.

Initial conceptual system list:

* Electrical
* Fuel
* Hydraulics
* Pneumatics
* Air Conditioning
* Flight Controls

Additional systems may be introduced later.

Each system may have a status such as:

* Available
* Partial
* Coming Soon

The initial beta does not require all aircraft systems to be complete.

---

## 7. System Page

Each system receives a dedicated learning page.

Example:

`Boeing 737 MAX 8 → Systems → Electrical`

The system page should establish:

* System name
* Short purpose statement
* Visual overview
* Learning sections
* Related cockpit controls
* Related procedures
* Related concepts

The page should immediately explain why the system matters to the pilot.

---

## 8. System Introduction

The top of a system page should provide a concise mental model.

Example intent:

### Electrical

The electrical system supplies power to aircraft equipment using several possible sources and distributes that power through electrical buses.

This introduction should be short.

Users should understand the basic idea before encountering technical detail.

---

## 9. System Diagram

A visual system diagram is a core Aircraft Systems feature.

For Electrical, a conceptual diagram may represent relationships such as:

```text
Battery
   │
   ▼
DC Power
   │
   ▼
Electrical Buses

Ground Power ─┐
APU Generator ├──► AC Power ───► Distribution
Engine Gen 1 ─┤
Engine Gen 2 ─┘
```

This is only a conceptual UX example.

Final diagrams must reflect verified aircraft-system behavior.

---

## 10. Diagram Philosophy

System diagrams should prioritize understanding rather than reproducing engineering schematics.

They should show:

* Main components
* Main relationships
* Flow
* Dependencies
* Important alternate sources

Avoid:

* Excessive wiring detail
* Maintenance-level schematics
* Hundreds of labels
* Unnecessary technical symbols

The user should be able to understand the high-level system within seconds.

---

## 11. Progressive System Detail

Aircraft Systems should support progressive learning depth.

### Overview

What does the system do?

### Sources / Inputs

Where does the system get its power, pressure, fuel, air, or control input?

### Distribution / Flow

Where does it go?

### Cockpit Controls

How does the pilot interact with it?

### Operational Use

When does the pilot care about this system?

### Deeper Concepts

Optional detail for users who want greater understanding.

Users should not be forced through every layer.

---

## 12. Learning Sections

A system page may contain structured sections.

For Electrical, an example structure could be:

### 01 — Big Picture

What the electrical system does.

### 02 — Power Sources

Battery, Ground Power, APU and engine generators.

### 03 — AC and DC

A beginner-friendly explanation of the two electrical domains.

### 04 — Distribution

How electrical buses distribute power.

### 05 — Standby Power

Why backup electrical power matters.

### 06 — Cockpit Controls

Where the pilot interacts with the system.

### 07 — Operational Flow

How the system is used during normal startup and shutdown.

These sections are conceptual until technical content is verified.

---

## 13. System Components

Important system components should be reusable entities.

Example:

`Aircraft Battery`

A component may contain:

* Name
* Short purpose
* System relationship
* Inputs
* Outputs
* Related controls
* Related concepts
* Related procedures

The same component should not be rewritten separately across multiple lessons.

---

## 14. Interactive Diagram Selection

Users should be able to select important components directly from a system diagram.

Example:

Select:

`BATTERY`

The system may:

1. Highlight the Battery node.
2. Highlight relevant relationships.
3. Open a concise explanation.
4. Show related cockpit controls.
5. Show procedures where it matters.

The diagram should remain visible.

---

## 15. Relationship Highlighting

Selecting one component may visually emphasize its connections.

Example:

Selecting:

`APU GENERATOR`

may emphasize:

`APU → Generator → AC Power → Bus`

while reducing emphasis on unrelated paths.

This should help users build a mental model of system flow.

---

## 16. Flow Mode

Where appropriate, a system diagram may support a simple flow-oriented view.

Example:

`Show power flow`

This may visually emphasize how power moves through the conceptual system.

This is educational visualization only.

CockpitPath v0.1 does not simulate live system state.

---

## 17. No Live State Assumption

Aircraft Systems v0.1 has no simulator telemetry.

The interface must never imply:

* A generator is currently online
* A bus is currently powered
* A valve is currently open
* A pump is currently active

unless this is purely an educational example and explicitly labeled as such.

System diagrams describe system relationships, not the user's live aircraft.

---

## 18. Example Scenarios

Aircraft Systems may explain common operational configurations.

Examples:

### Aircraft on Battery

Conceptual explanation of what the battery provides.

### External Power Connected

Conceptual explanation of Ground Power supplying the aircraft.

### APU Providing Power

Conceptual explanation of the APU Generator.

### Engines Running

Conceptual explanation of engine generators.

These should be labeled as learning scenarios rather than live simulator states.

---

## 19. Scenario Comparison

Where useful, users may compare two simplified system configurations.

Example:

`Before APU`

vs.

`APU Available`

The diagram can visually show what changes conceptually.

Do not turn this into an interactive aircraft-system simulator.

---

## 20. Cockpit Controls Connection

Every system should connect back to Cockpit Explorer.

Example:

### Electrical Cockpit Controls

* Battery Switch
* Standby Power
* Ground Power
* Generator Controls

Selecting:

`Battery Switch`

should offer:

`View in Cockpit Explorer →`

CockpitPath should open the correct cockpit panel and highlight that control.

---

## 21. Procedures Connection

Aircraft Systems should also connect to procedures.

Example:

### Used during

* Power Up
* Engine Start
* Shutdown

Selecting:

`Power Up`

should offer:

`View procedure →`

or:

`See Electrical system in Power Up →`

The system page should help explain why procedure steps exist.

---

## 22. Guide Mode Cross-Link

Guide Mode Learn Mode may link directly to system content.

Example Guide Mode step:

`BATTERY → ON`

Learn Mode may show:

`Learn how aircraft electrical power works →`

Opening this information should preserve the user's procedure context.

Depending on implementation, this may use:

* Drawer
* New internal context
* Saved return position

The user must be able to return to the same Guide Mode step easily.

---

## 23. Cockpit Explorer Cross-Link

Cockpit Explorer control details may show:

### RELATED SYSTEM

`Electrical →`

Opening Electrical Systems should preserve the selected control as context where possible.

For example:

`Electrical System`

with:

`Opened from: Battery Switch`

This connection may later allow the system diagram to focus the corresponding component automatically.

---

## 24. Related Concepts

Systems contain reusable concepts shared throughout CockpitPath.

Examples:

* Electrical Bus
* Bleed Air
* Hydraulic Pressure
* Fuel Crossfeed
* Pack
* Generator
* Standby Power

Selecting a concept should open a concise explanation without replacing the whole system learning page.

---

## 25. Glossary Behavior

Concept explanations should behave like a lightweight contextual glossary.

They may include:

* Simple definition
* Why it matters
* Related system
* Related cockpit controls

Avoid requiring users to leave the current learning context.

---

## 26. "Why Does This Matter?"

System sections should explicitly connect technical information to pilot actions.

Example:

### Why does Standby Power matter?

A short practical explanation should connect the concept to real cockpit behavior.

This is more useful for CockpitPath users than purely technical definitions.

---

## 27. Operational Relevance

System learning should frequently connect back to cockpit operation.

Useful patterns include:

### You will use this when...

### You will see this during...

### Related cockpit controls

### Related procedures

### What to expect in the simulator

This keeps system learning grounded in flight simulation.

---

## 28. Learning Depth

Aircraft Systems may support two levels of information density.

### Essentials

The concepts required to understand normal simulator operation.

### More Detail

Additional technical context.

This does not need to use the same Quick / Learn control as Guide Mode.

The system page itself is already a learning experience.

Progressive disclosure is preferred over a global mode switch.

---

## 29. System Navigation

Users need a compact way to move between aircraft systems.

Example:

`Electrical`

`Fuel`

`Hydraulics`

`Pneumatics`

`Air Conditioning`

`Flight Controls`

Avoid a large card wall once the user is inside the Systems experience.

---

## 30. System Search

The broader CockpitPath search architecture may eventually return:

* Controls
* Systems
* Concepts
* Procedures

Aircraft Systems itself does not require a dedicated search implementation in v0.1.

System pages should remain discoverable from Aircraft Page and related-control links.

---

## 31. Desktop Layout

On desktop, the system diagram should be visually important.

Recommended conceptual hierarchy:

### Main Area

Interactive system diagram.

### Secondary Area

Current concept / component explanation.

### Supporting Area

Related cockpit controls and procedures.

The experience should not become a long documentation article with a small diagram at the top.

---

## 32. Scrolling Behavior

Unlike Guide Mode, Aircraft Systems is naturally a learning page that may scroll vertically.

The production page may contain:

* Overview
* Diagram
* Sections
* Related controls
* Procedures

However, critical learning context should not become disconnected from the diagram.

Where useful, the diagram or section navigation may remain accessible while scrolling.

---

## 33. Tablet / iPad

Tablet is a primary learning platform.

The system diagram should support:

* Tap selection
* Large nodes
* Easy section switching
* Detail drawer or bottom sheet
* Comfortable landscape use
* Portrait adaptation

No hover-dependent interaction.

---

## 34. Mobile

Mobile should prioritize:

1. System overview
2. Simplified diagram
3. Selected component explanation
4. Learning sections

Complex diagrams may require horizontal simplification or alternative layouts.

Do not force a desktop-sized schematic into a tiny viewport.

A component list may complement the diagram on smaller screens.

---

## 35. Diagram Responsiveness

System diagrams may require different layouts by viewport.

The underlying conceptual relationships remain the same, but presentation may change.

Example:

### Desktop

Wide left-to-right diagram.

### Tablet

Compact landscape diagram.

### Mobile

Vertical flow diagram.

Responsive behavior should preserve understanding rather than preserve exact geometry.

---

## 36. Diagram Accessibility

System relationships cannot depend entirely on visual lines.

Accessible support should include:

* Named components
* Semantic relationships
* Keyboard focus
* Screen-reader descriptions
* Non-color-only highlighting
* Text descriptions of important flows

Users should be able to understand the main concept even if the visual diagram is not fully accessible.

---

## 37. System States and Color

Do not establish colors that imply real-time powered/unpowered aircraft state.

Cyan remains CockpitPath's focus and selection accent.

Additional colors may be used sparingly to differentiate conceptual flow types when necessary, but their meaning must be explained and not depend on color alone.

---

## 38. Content Verification

Every Aircraft Systems page should support verification metadata.

Possible fields:

* Aircraft
* Add-on
* Simulator
* Source
* Last verified
* Add-on version
* Simulator version
* Simulator-specific notes

No version number, date, or technical claim should be presented as verified unless it has actually been verified.

---

## 39. Source Quality

Aircraft Systems content requires stronger source discipline than general explanatory content.

System relationships should eventually be based on appropriate references such as:

* Supported add-on documentation
* Aircraft documentation where permitted and appropriate
* Simulator documentation
* Verified training material
* Direct simulator testing

Source policy will be defined separately.

---

## 40. Simulator-Specific Notes

If the supported iFly implementation behaves differently from expected aircraft behavior, CockpitPath may include:

### Simulator Note

This should clearly distinguish:

* Aircraft-system concept
* Add-on implementation behavior

Do not silently mix simulator limitations into aircraft-system explanations.

---

## 41. Content Reuse

The same entity should be reused across CockpitPath.

Example:

`Electrical Bus`

should not have unrelated definitions in:

* Guide Mode
* Cockpit Explorer
* Aircraft Systems

A shared concept entity should provide consistent foundational information.

Individual experiences may present different levels of detail.

---

## 42. System Completion

Aircraft Systems is primarily reference-based learning.

v0.1 does not require users to formally complete each system.

Future versions may support:

* Read progress
* System learning completion
* Knowledge checks

These are outside the initial core experience.

---

## 43. Knowledge Checks

Optional quizzes or knowledge checks are not required in v0.1.

The architecture should not prevent them later.

Possible future examples:

> Which source can provide electrical power before engine start?

These should remain secondary to simulator-oriented learning.

---

## 44. v0.1 Recommended Scope

For the first beta, Aircraft Systems does not need complete coverage.

Recommended initial high-quality systems:

### Electrical

Primary system used to establish the format.

Then potentially:

### Fuel

### Hydraulics

depending on content availability and beta priorities.

The UX must support additional systems without redesign.

---

## 45. v0.1 Out of Scope

Aircraft Systems v0.1 does not include:

* Live SimConnect visualization
* Real-time system state
* Animated engineering simulation
* Failure simulation
* Maintenance procedures
* Interactive circuit simulation
* AI instructor
* Voice narration
* Full technical aircraft manual replacement
* Certification training
* User-created diagrams
* Community-editable system content

---

## 46. Data Model Implications

Aircraft Systems introduces or reinforces reusable entities such as:

```text id="xevsg0"
Aircraft
System
System Component
Concept
Control
Procedure
Procedure Step
Diagram
Diagram Node
Diagram Relationship
Learning Section
```

Potential relationships include:

```text id="uyfgy7"
System → Components
Component → Controls
Component → Concepts
Component → Procedures
Control → System
Procedure Step → Control
Concept → Systems
Diagram Node → Component
Diagram Relationship → Diagram Nodes
```

The exact schema will be defined during technical architecture.

---

## 47. Primary Success Criterion

Aircraft Systems v0.1 is successful when a user can:

1. Open the Boeing 737 MAX 8 Electrical system.
2. Understand the basic purpose of the electrical system.
3. Identify its major power sources.
4. Understand the basic relationship between those sources and power distribution.
5. Select an important system component.
6. Understand what that component does.
7. Find its related cockpit controls.
8. Open that control in Cockpit Explorer.
9. See procedures where the component matters.
10. Return to the system page without losing learning context.

---

## 48. Core Learning Model

CockpitPath's primary learning model is:

### Procedure

**What do I do?**

↓

### Cockpit

**Where is it and what is this control?**

↓

### System

**Why does it work this way?**

↓

### Procedure

**Now the procedure makes sense.**

Users should be able to move naturally around this loop.

---

## 49. Design Requirements

The first Aircraft Systems visual design should demonstrate:

* Boeing 737 MAX 8 Electrical System
* System overview
* Interactive conceptual diagram
* Selected system component
* Component explanation
* System navigation
* Related cockpit controls
* Related concepts
* Related procedures
* Cockpit Explorer cross-link
* Progressive learning sections
* Desktop
* iPad / tablet
* Mobile

The visual design must extend the existing locked CockpitPath language.

Do not introduce a new product visual direction.

---

## Status

**Aircraft Systems UX Specification v0.1**

Ready for visual design.
