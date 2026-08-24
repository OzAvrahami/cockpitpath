# CockpitPath — Guide Mode Design Direction

**Status:** Locked
**Version:** v1.0
**Product:** CockpitPath
**Area:** Guide Mode
**Decision Date:** 2026-08-23

## 1. Decision

CockpitPath Guide Mode will use the refined **Simulator Companion** direction as its visual and interaction foundation.

The selected design is based primarily on the original Direction C — Simulator Companion, refined with selected elements from Directions A and B.

The refined visual reference is stored under:

`docs/design/refinements/guide-mode-v2/`

Primary reference:

`Guide Mode Refined.dc.html`

Supporting hotspot reference:

`PanelImage.dc.html`

---

## 2. Why This Direction Was Selected

CockpitPath is designed to remain open beside an active flight simulator.

The interface must therefore optimize for short, repeated glances rather than prolonged interaction.

The selected direction best supports the intended usage pattern:

1. Look at CockpitPath.
2. Understand the current action.
3. Return attention to the simulator.
4. Perform the action.
5. Verify the expected result.
6. Continue to the next step.

The interface deliberately minimizes conventional website chrome and keeps the active procedure at the center of the experience.

---

## 3. Core Visual Characteristics

The selected Guide Mode uses:

* Dark, low-glare surfaces
* High-contrast instructional content
* Cyan as the primary interaction and focus accent
* Large procedural actions
* Large cockpit imagery
* Minimal navigation chrome
* Restrained use of borders
* Monospace typography for technical cockpit values and commands
* Standard readable typography for interface text
* Separate educational typography for longer explanations where appropriate

The interface should feel:

* Precise
* Calm
* Modern
* Premium
* Technical
* Aviation-aware
* Simulator-focused

It should not feel like:

* A generic SaaS dashboard
* A traditional online course platform
* An avionics display
* A gaming HUD
* A cockpit imitation

---

## 4. Information Hierarchy

Guide Mode follows the hierarchy:

### 1. DO

The current cockpit action.

Example:

`BATTERY → ON`

This is always the strongest element on the screen.

### 2. VISUAL

The cockpit image showing where the action takes place.

### 3. EXPECT

The observable simulator result that indicates the action was performed correctly.

### 4. WHY

A concise explanation of the purpose of the action.

### 5. SUPPORTING INFORMATION

Examples include:

* Tips
* Warnings
* Concepts
* Troubleshooting
* Verification metadata
* Sources

Supporting information must never visually compete with the active procedure.

---

## 5. Quick and Learn Modes

Quick and Learn are two information-density states of the same Guide Mode interface.

They are not separate products or separate layouts.

### Quick Mode

Quick Mode prioritizes:

1. Action
2. Cockpit image
3. Expected result
4. Navigation

Educational explanation remains collapsed or secondary.

### Learn Mode

Learn Mode preserves the same layout while adding:

* WHY explanation
* Learning concepts
* Relevant tips
* Additional educational context

Switching modes must not:

* Reset progress
* Change the current step
* Restart the procedure
* Cause disruptive layout changes

---

## 6. Simulator Companion Layout

The narrow companion layout is considered a first-class CockpitPath experience.

Target range:

`400–550 px`

The layout should remain fully usable while Microsoft Flight Simulator occupies the majority of the user's main display.

Priority order:

1. Action
2. Cockpit image
3. Expected result
4. Done — Next
5. Educational content

Horizontal scrolling is not permitted.

---

## 7. Desktop Layout

On wide desktop screens:

* The active action remains highly prominent.
* The cockpit image receives the majority of the working area.
* Expected result remains visible without requiring navigation away from the current step.
* Learn Mode explanation may appear below or beside the expected result.
* Primary navigation remains immediately accessible.

The interface should avoid conventional dashboard sidebars while Guide Mode is active.

---

## 8. Tablet Layout

Tablet and iPad usage are primary CockpitPath scenarios.

Tablet layouts must prioritize:

* Large cockpit imagery
* Large touch targets
* Highly visible current action
* Accessible Quick / Learn switching
* Large Done — Next interaction
* No hover-dependent controls
* Comfortable landscape usage

Portrait support will be implemented responsively but is not the primary initial visual reference.

---

## 9. Progress

Guide Mode uses compact progress indicators.

Preferred presentation:

* Segmented progress for procedures with an appropriate number of steps
* Continuous progress bar when a segmented representation would become visually excessive

Progress remains secondary to the active action.

The interface also displays the current step numerically.

Example:

`STEP 04 / 16`

---

## 10. Procedure Context

Guide Mode should provide compact orientation including:

* Aircraft
* Journey
* Current section
* Current step

Example:

`737 MAX 8 · COLD & DARK → TAKEOFF · POWER UP`

This context must remain visible without becoming a large application header.

---

## 11. Cockpit Image System

Cockpit images are functional learning content.

Production CockpitPath will use real supported simulator and aircraft captures.

The implementation must use:

**Base Image + Dynamic Hotspot Overlay**

Instructional overlays should not be permanently baked into the source screenshot.

A hotspot may define:

* Position
* Size
* Focus behavior
* Highlight type
* Control label
* Suggested zoom
* Orientation context

---

## 12. Hotspot Presentation

The current visual reference demonstrates:

* Active-area border
* Surrounding-area dimming
* Focus framing
* Control label
* Cyan focus treatment

The production implementation may adjust the exact visual treatment based on real cockpit screenshots.

The core requirement is unchanged:

> The user must immediately understand where to look.

Highlighting must not depend on color alone.

---

## 13. Guide Me There

`Guide me there` is a selected CockpitPath interaction.

It assists users who understand the instruction but cannot locate the cockpit control.

The intended experience may progressively show:

1. Full cockpit
2. Relevant cockpit panel
3. Relevant panel area
4. Exact control

The user must remain inside Guide Mode throughout the experience.

---

## 14. Expected Result

Expected result is a first-class component of a procedure step.

Example:

### EXPECT

`Electrical indications become available.`

CockpitPath v0.1 does not automatically read simulator state.

Therefore the interface must never visually imply that an expected condition has been automatically verified.

The user is responsible for confirming the result in the simulator.

---

## 15. Primary Navigation

Primary action:

`Done — Next`

Secondary action:

`Previous`

Tertiary action:

`Skip`

Done — Next must remain visually dominant.

On narrow and touch interfaces, the primary action should receive especially generous interaction space.

---

## 16. Focus Mode

The selected design assumes that the active guide itself is the primary product experience.

During active simulator use, unnecessary application chrome should be removed.

Focus Mode should hide or minimize:

* Public website navigation
* Marketing content
* Account controls
* Dashboard navigation
* Non-essential product controls

---

## 17. Content Overflow

Design references use fixed-size canvases for exploration.

The production interface must support content of varying length.

When:

* WHY
* TIP
* WARNING
* Troubleshooting
* Supporting educational content

exceeds available space, the content area must become scrollable without making primary navigation difficult to access.

Primary action and navigation should remain easily reachable.

---

## 18. Accessibility

Implementation must preserve:

* Strong contrast
* Visible keyboard focus
* Large touch targets
* Semantic controls
* Browser zoom compatibility
* Keyboard operation
* Non-color-only status communication
* Descriptive cockpit visual metadata

---

## 19. Design References

### Initial Exploration

`docs/design/explorations/guide-mode-v1/`

Contains the original:

* Precision Aviation
* Modern Learning
* Simulator Companion

directions.

### Selected Refinement

`docs/design/refinements/guide-mode-v2/`

Contains the refined Simulator Companion direction.

These files represent design references, not production application source code.

---

## 20. Design Decision Summary

The CockpitPath Guide Mode design foundation is officially:

**Simulator Companion — Refined v2**

The selected direction combines:

### From Simulator Companion

* Minimal chrome
* Image dominance
* Large procedural actions
* Strong narrow-window support
* Dark low-glare interface
* Simulator-first interaction model

### From Precision Aviation

* Clearer progress
* Stronger technical context
* Restrained monospace usage
* Operational precision

### From Modern Learning

* Explicit DO / EXPECT / WHY hierarchy
* Improved educational readability
* Clear separation between instruction and explanation

---

## 21. Status

**LOCKED**

This design direction is approved as the visual foundation for CockpitPath Guide Mode.

Future Guide Mode changes should refine this direction rather than introduce unrelated visual languages.

The next design area is:

**Aircraft Page**
