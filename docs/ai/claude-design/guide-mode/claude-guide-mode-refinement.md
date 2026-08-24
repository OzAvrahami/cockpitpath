# CockpitPath — Guide Mode Refinement Brief

## Objective

Refine the previously created **Direction C — Simulator Companion** into one stronger, production-oriented CockpitPath Guide Mode direction.

Do not create additional design directions.

Direction C has been selected as the visual foundation for CockpitPath.

The goal of this iteration is to preserve its strongest characteristics while selectively incorporating useful elements from Directions A and B.

---

## Source Material

Use the following project materials as references:

* `docs/ux/guide-mode.md`
* Previous Guide Mode visual exploration
* Previous PanelImage / hotspot exploration

The UX specification remains the source of truth.

---

# Selected Foundation

Use:

## Direction C — Simulator Companion

as the primary foundation.

Preserve the core characteristics that made this direction successful:

* Dark, low-glare environment
* Minimal interface chrome
* Extremely fast visual scanning
* Large and obvious current action
* Cockpit image dominance
* Strong `Done — Next` primary action
* Excellent narrow companion-window behavior
* Strong tablet usability
* Cyan accent direction
* Simulator-first rather than website-first feeling

The interface should feel like a companion that stays beside the simulator, not a conventional website or learning dashboard.

---

# Elements to Incorporate From Direction A

Direction A contained useful precision and operational clarity.

Bring selected elements into the refined design:

* Clearer step progress
* Clear section context
* Strong aircraft / procedure orientation
* Technical precision
* Limited monospace typography for cockpit controls, values, and procedural commands

Examples:

`BATTERY → ON`

`STEP 04 / 16`

`OVERHEAD → ELECTRICAL`

Do **not** bring over Direction A's heavier interface chrome, excessive borders, or dense metadata.

The refined design should remain visually lighter and simpler than Direction A.

---

# Elements to Incorporate From Direction B

Direction B had a strong educational hierarchy.

In Learn Mode, establish a clearer relationship between:

### DO

What the user must perform.

### EXPECT

What the user should observe after performing the action.

### WHY

A concise explanation of why the action matters.

This structure should improve learning clarity without turning the interface into a conventional course platform.

Use the calmer readability of Direction B for explanatory text, while retaining Direction C's dark simulator-companion visual language.

---

# Quick Mode and Learn Mode

Quick Mode and Learn Mode must remain two views of the **same interface and same procedure**.

Do not create substantially different layouts.

Switching modes must feel like increasing or reducing information density.

---

## Quick Mode

Quick Mode should prioritize:

1. Action
2. Cockpit image
3. Expected result
4. Navigation

Example:

### BATTERY → ON

Cockpit image with highlighted battery switch.

### EXPECT

Electrical indications become available.

`Done — Next`

Supporting explanations should remain collapsed.

---

## Learn Mode

Learn Mode uses the same layout but expands educational information.

Example:

### BATTERY → ON

Cockpit image with highlighted battery switch.

### EXPECT

Electrical indications become available.

### WHY

The aircraft battery provides initial electrical power before another electrical source is connected.

The additional explanation must remain visually secondary to the current action.

---

# Desktop Layout

Refine the wide desktop layout so the visual hierarchy is immediately understandable.

The current action should remain extremely prominent.

The cockpit image should continue to occupy the majority of the available workspace.

Do not introduce a large conventional sidebar unless it clearly improves the experience.

The user should be able to see simultaneously:

* Current action
* Cockpit image
* Expected result
* Primary navigation

Learn Mode may reveal the explanation below or beside the expected result without reducing the cockpit image excessively.

---

# Narrow Companion Layout

The narrow companion layout is one of CockpitPath's most important use cases.

Target approximately:

`400–550 px`

wide.

Assume Microsoft Flight Simulator occupies the majority of the monitor.

Priority order:

1. Current action
2. Cockpit image
3. Expected result
4. Done — Next
5. Additional learning information

The interface must remain comfortable and immediately readable without horizontal scrolling.

Preserve Direction C's strong narrow-window behavior.

---

# Tablet / iPad

Preserve the strong simulator-companion character on tablet.

Requirements:

* Large touch targets
* Highly visible cockpit image
* Large current action
* Strong Done — Next button
* No hover dependencies
* Comfortable landscape usage
* Layout capable of adapting to portrait later

---

# Step Header and Context

Improve context without adding unnecessary interface weight.

The user should easily understand:

* Aircraft
* Current journey / procedure
* Current section
* Step position

Example:

`737 MAX 8 · POWER UP · STEP 04 / 16`

Avoid large navigation headers.

Context should remain compact.

---

# Progress

Improve progress visibility compared with the original Direction C.

Progress must be understandable at a glance but remain secondary to the active step.

Possible solutions include:

* Thin progress track
* Segmented progress indicator
* Step number + subtle progress bar

Do not create dashboard-style progress components.

---

# Current Action

The current action remains the strongest element in the interface.

Example:

# BATTERY → ON

Use monospace or technical typography where useful.

The action must be understandable during a very short glance away from the simulator.

---

# Cockpit Image

Preserve the Base Image + Hotspot concept.

The previous PanelImage is only a structural placeholder.

The production system will eventually use real simulator cockpit captures.

The visual design should demonstrate:

* Base cockpit image
* Highlighted active control
* Surrounding-area dimming where appropriate
* Clear focus indication
* Control label where useful

The hotspot must clearly communicate:

> Look here.

Do not permanently bake instructional graphics into the cockpit image.

The product architecture will render hotspot overlays dynamically.

---

# "Guide Me There"

Replace or refine the previous:

`Can't find it?`

interaction.

Preferred wording:

## Guide me there

This interaction helps a user who understands the instruction but cannot locate the relevant control.

It may progressively reveal:

1. Full cockpit
2. Relevant panel
3. Relevant panel area
4. Exact control

This should remain a secondary action.

---

# Expected Result

Expected result is a first-class part of each step.

It should be clearly visible without competing with the current action.

Example:

### EXPECT

Electrical indications become available.

Use a visual state treatment that communicates verification without making it look like the action has already been automatically confirmed by the software.

CockpitPath does not currently detect simulator state.

---

# Navigation

Primary:

## Done — Next

Secondary:

`Previous`

Tertiary:

`Skip`

`Done — Next` must remain the dominant interaction.

On tablet and narrow layouts it should be especially easy to hit.

---

# Focus Mode

Guide Mode should continue to feel as though Focus Mode is the natural default during simulator use.

Avoid unnecessary:

* Site navigation
* Marketing elements
* Account UI
* Dashboard controls

The guide itself is the product.

---

# Visual Character

The refined CockpitPath Guide Mode should feel:

* Precise
* Calm
* Modern
* Premium
* Low glare
* Aviation aware
* Simulator focused
* Highly usable
* Technical without being intimidating

Avoid:

* Generic SaaS dashboard styling
* Generic online-course styling
* Fake avionics UI
* Gaming HUD styling
* Decorative aircraft graphics
* Excessive panels
* Excessive borders
* Excessive metadata

---

# Deliverable

Create **one refined Guide Mode direction** based on Direction C.

Show:

1. Wide desktop
2. Narrow companion window
3. iPad landscape

Demonstrate both:

* Quick Mode
* Learn Mode

The design should be sufficiently resolved that it can become the visual foundation for implementation and for the rest of the CockpitPath product.

Do not design the public website, dashboard, aircraft library, pricing pages, or account experience yet.
