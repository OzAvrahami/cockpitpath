# CockpitPath — Guide Mode UX Specification

**Document Status:** Draft v0.1
**Product:** CockpitPath
**Area:** Learning Experience / Guide Mode
**Last Updated:** 2026-08-23

## 1. Purpose

Guide Mode is the core learning experience of CockpitPath.

It allows flight simulation users to follow an aircraft procedure step by step while actively operating the aircraft in their simulator.

The experience is designed to solve a common problem with video tutorials: users frequently need to pause, rewind, search for cockpit controls, and switch attention between the simulator and the video.

CockpitPath replaces this workflow with a structured, visual, self-paced guide.

At every step, the interface should answer four questions:

1. What should I do?
2. Where should I do it?
3. What should happen after I do it?
4. Why am I doing it?

---

## 2. Primary Use Case

A user is running:

* Microsoft Flight Simulator 2024
* iFly Boeing 737 MAX 8

CockpitPath is open simultaneously on:

* a second monitor,
* a tablet,
* an iPad,
* or a narrow browser window beside the simulator.

The user selects:

`Boeing 737 MAX 8 → Cold & Dark to Takeoff → Power Up`

CockpitPath then guides the user through the procedure one logical step at a time.

Guide Mode is not a static checklist and is not a video course.

It is an interactive **fly-along guide**.

---

## 3. Core UX Principle

### One Logical Action Per Step

Each step should focus on one logical action.

Good example:

`BATTERY → ON`

Bad example:

> Turn the battery on, configure standby power, connect ground power, verify electrical buses, and continue with IRS setup.

Related controls may be grouped when they naturally form one action.

Example:

`L IRS → NAV`

`R IRS → NAV`

The goal is to prevent users from losing track of which part of an instruction they have already completed.

---

## 4. Step Information Hierarchy

Information should always appear in this priority order:

1. **Action**
2. **Location / Visual**
3. **Expected Result**
4. **Explanation**
5. **Additional Information**

The interface must never allow explanations, metadata, or supporting information to visually compete with the current action.

---

## 5. Guide Header

The Guide Mode header should remain compact.

It should communicate:

* Aircraft
* Journey or procedure name
* Current section
* Current step
* Overall progress
* Current learning mode

Example:

`Boeing 737 MAX 8`

`Cold & Dark → Takeoff`

`Power Up`

`Step 4 of 16`

The header may also provide access to:

* Procedure overview
* Exit Guide Mode
* Quick / Learn mode switch
* Additional guide controls

---

## 6. Quick Mode and Learn Mode

CockpitPath supports two presentation modes using the same underlying procedure content.

### Learn Mode

Learn Mode is intended for users who are learning an aircraft or procedure.

It may display:

* Action
* Visual
* Cockpit location
* Expected result
* Explanation
* Tips
* Warnings
* System concepts

Example:

### Turn Battery ON

**DO**

`BATTERY → ON`

**LOCATION**

`OVERHEAD → ELECTRICAL`

**EXPECT**

Electrical indications become available.

**WHY**

The aircraft battery provides initial electrical power before another electrical source is connected.

---

### Quick Mode

Quick Mode is intended for users who already understand the procedure and primarily need operational guidance.

Example:

### BATTERY

`BATTERY → ON`

**EXPECT**

Electrical indications available.

Quick Mode hides most educational content by default.

Users may still expand additional information when required.

---

### Mode Switching

Users must be able to switch between:

`QUICK | LEARN`

at any time.

Changing modes must not:

* reset progress,
* change the current step,
* restart the procedure.

The selected mode should be remembered for future sessions.

---

## 7. Step Anatomy

A step may contain the following fields.

### Title

A short, direct description of the action.

Example:

`Turn Battery ON`

### Instruction

The exact action to perform.

Example:

`BATTERY → ON`

### Location

The cockpit location of the control.

Example:

`OVERHEAD → ELECTRICAL`

### Visual

A cockpit screenshot or diagram showing where the action takes place.

### Expected Result

The condition the user should observe after performing the action.

Example:

`APU GEN OFF BUS illuminates`

### Explanation

A concise explanation of why the action is performed.

### Tip

Useful non-essential information.

### Warning

Important information the user should notice before continuing.

### Reference Metadata

Internal or expandable information about the source and verification status of the instruction.

Not every step is required to contain every field.

---

## 8. Step Types

Guide Mode should support several step types.

### ACTION

The user changes a cockpit control.

Example:

`BATTERY → ON`

### VERIFY

The user confirms an existing state.

Example:

`Verify PARKING BRAKE is SET`

### WAIT

The user waits for a system condition.

Example:

`Wait for APU AVAIL`

### INFORMATION

No cockpit interaction is required.

The step provides context necessary for the next action.

### MULTI_ACTION

Several tightly related actions are performed together.

Example:

`L IRS → NAV`

`R IRS → NAV`

---

## 9. Visual Learning System

Visual guidance is a core CockpitPath capability.

Images should not merely decorate the guide.

Every visual should help answer:

> Where exactly should I look?

CockpitPath should prefer focused cockpit images over unnecessarily large screenshots.

---

## 10. Base Image and Hotspot Model

CockpitPath should avoid storing a separate screenshot for every step when several steps use the same cockpit area.

A single base image may define multiple hotspots.

Example base image:

`overhead-electrical.webp`

Possible hotspots:

* `battery`
* `standby-power`
* `ground-power`
* `apu`
* `apu-generator`

Each guide step references the appropriate hotspot.

The interface then highlights that hotspot dynamically.

---

## 11. Highlight Behavior

Highlights must remain understandable on both large and small screens.

Possible techniques include:

* outline
* focus ring
* arrow
* glow
* localized zoom
* surrounding area dimming

Color must never be the only indicator.

The target should remain identifiable for users with color-vision limitations.

---

## 12. Image Interaction

In the initial version, cockpit images should support:

### Zoom

Users can enlarge the image.

### Pan

Users can move around a zoomed image.

### Reset

Returns to the recommended guide view.

### Focus on Control

A step may automatically focus the image on its associated hotspot.

### Show Full Panel

Allows the user to zoom back out and understand the control's wider cockpit location.

---

## 13. Cockpit Orientation

Highly zoomed images can make users lose spatial context.

CockpitPath should therefore identify the current location.

Example:

**PANEL**

`OVERHEAD`

**AREA**

`ELECTRICAL`

A secondary action such as:

`Show in cockpit`

may display a wider image showing where the panel is located within the full flight deck.

---

## 14. Primary Navigation

Guide Mode should always provide clear step navigation.

Primary controls:

`Previous`

`Done — Next`

`Done — Next` is the primary action.

On touch devices, it must be large enough to use comfortably while operating the simulator.

---

## 15. Completing a Step

Selecting `Done — Next` should:

1. Mark the current step as completed.
2. Save progress automatically.
3. Advance to the next step.
4. Update progress indicators.

Users should never need to manually save their progress.

---

## 16. Returning to Previous Steps

A completed step remains marked as completed when revisited.

Users can still review and repeat the instruction.

Returning to an earlier step must not erase later progress automatically.

A secondary option may allow the user to mark a step as incomplete.

---

## 17. Skip Behavior

Users may skip a step.

`Skip Step`

must be visually secondary to the primary completion action.

Skipped steps must not appear as completed.

Possible status:

`Skipped`

rather than:

`Completed`

---

## 18. Optional Steps

Some instructions may depend on aircraft or simulator state.

Example:

* External power availability
* APU already running
* Weather-dependent configuration

Such steps may be marked:

`OPTIONAL`

The step should explain when it applies.

More advanced conditional procedure logic is outside the initial release.

---

## 19. Procedure Sections

Long procedures should be divided into meaningful sections.

Example journey:

### Cold & Dark → Takeoff

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

Sections reduce cognitive load and create natural progress milestones.

---

## 20. Section Completion

At the end of a section, CockpitPath should display a lightweight completion state.

Example:

# Power Up Complete

`16 of 16 steps completed`

**Next**

`IRS & Navigation`

The user can continue immediately or leave the guide.

---

## 21. Procedure Overview

Users should be able to inspect the current procedure without losing their place.

Example:

### Power Up

* Completed — Battery
* Completed — Standby Power
* Current — Ground Power
* Upcoming — IRS
* Upcoming — APU

The overview can also allow navigation to earlier or later steps.

---

## 22. Progress Persistence

Progress must be saved automatically.

Example:

`Cold & Dark → Takeoff`

`34 / 82 steps completed`

The system should remember:

* Journey
* Procedure
* Section
* Current step
* Completed steps
* Skipped steps
* Learning mode

---

## 23. Resume Experience

When returning to an unfinished guide, CockpitPath should offer immediate continuation.

Example:

# Continue where you left off

**Boeing 737 MAX 8**

`Cold & Dark → Takeoff`

`Power Up — Step 8`

Primary action:

`Continue`

Secondary action:

`Restart Section`

---

## 24. Desktop Layout

On a wide desktop display, the interface should keep the primary visual and instruction visible simultaneously.

Recommended conceptual layout:

* Main visual area
* Instruction area
* Expected result
* Learn-mode explanation
* Persistent navigation

The user should rarely need to scroll for normal action steps.

---

## 25. Narrow Side-Panel Layout

This is a primary CockpitPath use case.

The simulator may occupy most of the monitor while CockpitPath is displayed in a browser panel approximately:

`400–550 px`

wide.

Information priority becomes:

1. Action
2. Image
3. Expected Result
4. Navigation
5. Collapsible learning content

Guide Mode must remain fully usable at this width.

---

## 26. Tablet / iPad Layout

Tablet usage is a primary target.

The interface should support:

* Large touch targets
* Large cockpit images
* Persistent and accessible navigation
* No hover-dependent interaction
* Portrait orientation
* Landscape orientation

The product should feel natural when the tablet is physically positioned beside the simulator controls.

---

## 27. Mobile Layout

Mobile is supported but is not the primary Guide Mode target.

Content should stack vertically:

Action

Visual

Expected Result

Learning Content

Navigation

A complete procedure must still be possible from a phone.

---

## 28. Focus Mode

Guide Mode should support a distraction-free state.

Focus Mode hides:

* Public site navigation
* Marketing content
* Unnecessary account controls
* Non-essential interface elements

Focus Mode retains:

* Aircraft
* Procedure context
* Progress
* Current step
* Visual
* Instruction
* Navigation

Focus Mode is the preferred experience during active simulator use.

---

## 29. Keyboard Controls

Desktop users may use keyboard shortcuts.

Initial proposal:

`Right Arrow` — Next

`Left Arrow` — Previous

`Space` — Complete current step and continue

Keyboard shortcuts must not activate while the user is interacting with a text field, dialog, or incompatible control.

---

## 30. Learning Concepts

Learn Mode may identify important aviation concepts.

Examples:

* APU
* Bleed Air
* Electrical Bus
* IRS
* Packs
* VNAV
* LNAV

Selecting a concept should open a short explanation without leaving Guide Mode.

This may use a popover, drawer, or modal.

Only a limited concept system is required for the initial release.

---

## 31. Never Lose Procedure Context

Secondary interactions must not unexpectedly navigate away from the active guide.

The following should appear inside Guide Mode:

* Image zoom
* Concept explanations
* Cockpit orientation
* Tips
* Troubleshooting
* Sources
* Additional explanation

Appropriate patterns include:

* Drawer
* Popover
* Modal
* Expandable section

---

## 32. Can't Find It

A common user problem is knowing what to do but being unable to locate the control.

Guide Mode should support:

`Can't find it?`

This experience may show:

1. A wider cockpit view.
2. The relevant panel highlighted.
3. A closer panel view.
4. The exact control highlighted.

This feature is a key CockpitPath differentiator compared with video tutorials.

---

## 33. Expected Result Troubleshooting

If the user performs an action but the expected result does not appear, some steps may offer:

`Not seeing this?`

This opens concise troubleshooting guidance.

Example:

### Ground Power unavailable?

Verify that external power is available or connected through the aircraft's simulated ground-services interface.

Troubleshooting should only be added where a common and well-understood issue exists.

---

## 34. Content Verification Metadata

Each guide or step should support verification metadata.

Possible fields:

* Simulator
* Simulator version
* Aircraft
* Add-on
* Add-on version
* Source
* Last verified
* Simulator-specific notes

Example:

**Simulator**

Microsoft Flight Simulator 2024

**Aircraft**

Boeing 737 MAX 8

**Add-on**

iFly 737 MAX 8

This metadata should be accessible without cluttering the primary guide interface.

---

## 35. Content Accuracy Principle

CockpitPath instructions must not rely solely on copying an arbitrary online tutorial.

Content should be based on appropriate sources such as:

* Add-on documentation
* Simulator documentation
* Aircraft documentation where appropriate
* Multiple verified training sources
* Direct testing in the supported simulator and add-on

CockpitPath should explicitly distinguish between:

* aircraft procedure,
* simulator behavior,
* add-on-specific behavior.

---

## 36. Journey Completion

At the end of a complete journey, the user receives a meaningful completion state.

Example:

# Ready for Takeoff

**Cold & Dark → Takeoff completed**

The page may summarize:

* Sections completed
* Steps completed
* Skipped steps
* Recommended next guide

Gamification should remain restrained.

CockpitPath should feel like a professional learning companion rather than a game layered on top of the simulator.

---

## 37. Visual Design Principles

Guide Mode should feel:

* Focused
* Modern
* Calm
* Aviation-aware
* Professional
* Technical without being intimidating

The product may draw inspiration from aviation interfaces but must not attempt to imitate a Boeing cockpit UI.

Avoid:

* excessive borders,
* fake cockpit controls,
* tiny technical typography,
* excessive green terminal-style interfaces,
* unnecessary dashboards,
* visual noise,
* decorative aviation elements that reduce usability.

---

## 38. Accessibility

Guide Mode should support:

* Keyboard navigation
* Visible focus states
* Strong contrast
* Large touch targets
* Semantic controls
* Browser zoom
* Descriptive image metadata
* Non-color-only status indicators

---

## 39. v0.1 Out of Scope

The initial Guide Mode does not include:

* Voice commands
* Voice narration
* SimConnect integration
* Automatic simulator state detection
* Automatic step completion
* AI instructor
* Community-created procedures
* User annotations
* Multiplayer instructor mode
* Live aircraft telemetry

The architecture should avoid unnecessarily blocking these capabilities in the future.

---

## 40. Initial Success Criterion

Guide Mode v0.1 is successful when a user can:

1. Open Microsoft Flight Simulator 2024.
2. Load the iFly Boeing 737 MAX 8 in a Cold & Dark state.
3. Open CockpitPath on another screen or device.
4. Start the `Cold & Dark → Takeoff` journey.
5. Locate every required cockpit control using CockpitPath.
6. Understand what to do.
7. Verify the expected aircraft response.
8. Reach the takeoff phase without requiring a YouTube tutorial.

---

## 41. Design Exploration Requirements

The first visual design exploration should focus on Guide Mode before designing the wider CockpitPath product.

The design must demonstrate at least:

* Wide desktop layout
* Narrow simulator companion layout
* iPad / tablet layout
* Learn Mode
* Quick Mode
* Cockpit image highlighting
* Step navigation
* Progress display
* Expected result
* Expanded learning information

Guide Mode should establish the visual foundation for the rest of CockpitPath.

---

## 42. Core Product Principles

### Guide First

The guide experience is the primary product.

### Image Led

Visual orientation is essential to learning.

### One Step at a Time

Users should never face a large wall of procedure instructions.

### Quick + Learn

The same procedure supports both new learners and returning users.

### Simulator Companion

The interface is designed to remain open beside the simulator.

### Context Preserving

Users should never lose their current procedure position while exploring additional information.

### Verified Content

Procedure accuracy and simulator-specific verification are first-class product requirements.

---

## Status

**Guide Mode UX Specification v0.1**

Ready for visual design exploration.
