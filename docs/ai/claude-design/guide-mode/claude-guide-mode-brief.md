# CockpitPath — Claude Design Brief: Guide Mode Exploration

## Context

CockpitPath is a web-based learning platform for flight simulation users.

Its core purpose is to help users learn complex aircraft without constantly pausing and rewinding video tutorials.

Instead of watching a tutorial, users open CockpitPath beside Microsoft Flight Simulator and follow an interactive, visual, step-by-step guide at their own pace.

The initial supported environment is:

* Microsoft Flight Simulator 2024
* Boeing 737 MAX 8
* iFly 737 MAX 8 add-on

The first major learning journey will guide a user from:

**Cold & Dark → Takeoff**

The product may later support additional aircraft, simulators, and paid subscription plans.

---

# Source UX Specification

The authoritative UX requirements are defined in:

`docs/ux/guide-mode.md`

The visual design must follow that UX specification.

Do not redesign or substantially change the underlying product workflow unless a proposed change clearly improves usability.

---

# Assignment

Create **three clearly distinct visual design directions** for CockpitPath Guide Mode.

Do not design the full CockpitPath website yet.

Do not focus on:

* Landing pages
* Marketing
* Pricing
* Account pages
* Aircraft library
* Dashboard

The goal of this exploration is to determine the visual DNA of the core product before applying it elsewhere.

All three concepts must represent the **same product and same example step**, so they can be compared directly.

---

# Primary Scenario

The user has Microsoft Flight Simulator 2024 running on their main screen.

CockpitPath is open on:

* a second monitor,
* an iPad,
* or a narrow browser window beside the simulator.

The active journey is:

**Boeing 737 MAX 8**

**Cold & Dark → Takeoff**

Section:

**Power Up**

Current step:

**Step 4 of 16**

Action:

**Turn Battery ON**

Instruction:

`BATTERY → ON`

Location:

`OVERHEAD → ELECTRICAL`

Expected result:

**Electrical indications become available.**

Learning explanation:

**The aircraft battery provides initial electrical power before another electrical source is connected.**

The interface should also visibly support:

`QUICK | LEARN`

---

# Core Product Hierarchy

The visual hierarchy must always prioritize:

1. Current action
2. Cockpit location / image
3. Expected result
4. Explanation
5. Tips and secondary information

The user should understand what to do within a few seconds of looking at the screen.

---

# Required Design Directions

Create three intentionally different directions.

## Direction A — Precision Aviation

A professional, highly focused interface influenced by aviation clarity and operational tools.

Characteristics may include:

* Strong information hierarchy
* High precision
* Restrained visual language
* Dark environment suitable for simulator use
* Subtle aviation references
* Clear state indicators
* Dense enough to feel professional without becoming intimidating

Do not imitate an aircraft avionics display.

---

## Direction B — Modern Learning

A clean and approachable digital learning product.

Characteristics may include:

* More breathing room
* Strong readability
* Friendly but professional presentation
* Clear educational hierarchy
* Excellent separation between instruction and explanation
* Modern SaaS-quality interface

It should make complex aircraft procedures feel easier to learn without appearing childish.

---

## Direction C — Simulator Companion

Optimize specifically for a product that stays open beside a running simulator.

Characteristics may include:

* Extremely fast scanning
* Large current action
* Strong cockpit image emphasis
* Minimal distraction
* Efficient navigation
* Excellent narrow-window behavior
* Clear focus on "look → perform → verify → continue"

This direction should feel particularly natural on a second display or iPad beside the simulator.

---

# Required Screens

For each visual direction, demonstrate the same Guide Mode experience in at least:

## 1. Wide Desktop

A normal desktop browser layout with sufficient space for image and learning information simultaneously.

## 2. Narrow Companion Window

Approximately:

`400–550 px`

wide.

This is a primary use case, not an afterthought.

Assume Microsoft Flight Simulator occupies the rest of the user's screen.

## 3. Tablet / iPad

Demonstrate a touch-friendly layout.

Landscape is preferred for the primary concept, but the layout should clearly be capable of adapting to portrait.

---

# Guide Components That Must Be Represented

The designs should account for:

* Aircraft identity
* Journey name
* Current section
* Step progress
* Quick / Learn mode
* Step title
* Primary action
* Cockpit location
* Cockpit image
* Highlighted cockpit control
* Expected result
* Explanation
* Previous step
* Done / Next
* Procedure overview access
* Focus Mode
* "Can't find it?" assistance

Not every secondary control needs equal visual prominence.

---

# Cockpit Image Requirement

The cockpit image is functional content, not decoration.

For the example design, use a realistic placeholder representing the Boeing 737 MAX overhead panel.

Clearly demonstrate a highlighted control area for the battery switch.

The highlight should communicate:

**Look here.**

Consider techniques such as:

* Focus ring
* Localized glow
* Arrow
* Dimmed surrounding area
* Automatic crop / zoom

Do not rely on color alone.

---

# Learn Mode

Learn Mode should clearly support:

### DO

`BATTERY → ON`

### LOCATION

`OVERHEAD → ELECTRICAL`

### EXPECT

Electrical indications become available.

### WHY

The aircraft battery provides initial electrical power before another electrical source is connected.

The explanatory information should remain secondary to the action.

---

# Quick Mode

Quick Mode should reduce the experience to the essential operational information.

For example:

### BATTERY

`BATTERY → ON`

### EXPECT

Electrical indications available.

The interface should make it obvious that Quick Mode and Learn Mode are two views of the same procedure rather than separate products.

---

# Navigation

The primary forward action is:

**Done — Next**

The secondary backward action is:

**Previous**

The design should make the next-step action extremely easy to find without creating accidental clicks.

Tablet touch targets should be generous.

---

# Overall Visual Personality

CockpitPath should feel:

* Modern
* Precise
* Focused
* Trustworthy
* Calm
* Premium
* Aviation-aware
* Technical without being intimidating

The experience should make the user feel that a complicated aircraft is manageable.

---

# Avoid

Do not use:

* Fake cockpit switches as normal website controls
* Excessive avionics imitation
* Green-on-black terminal aesthetics
* Tiny aviation-style fonts
* Excessive outlines or panel borders
* Decorative gauges
* Decorative aircraft silhouettes everywhere
* Large dashboard KPI cards
* Gaming HUD aesthetics
* Gamification-heavy UI
* Sci-fi aesthetics
* Generic LMS/course-platform design
* Generic admin-dashboard design

CockpitPath is a learning companion, not an aircraft simulator UI and not a corporate dashboard.

---

# Branding

There is currently no locked CockpitPath visual identity.

Do not spend significant effort designing a final logo.

A temporary wordmark:

**CockpitPath**

is sufficient.

The Guide Mode exploration should help define the future brand direction.

---

# Color

Explore appropriate palettes as part of each design direction.

A dark or low-glare experience is likely appropriate because many users will use CockpitPath next to a simulator, but the three directions do not need to use identical palettes.

Accessibility and contrast remain mandatory.

---

# Typography

Typography must prioritize fast scanning.

Critical cockpit actions must remain highly legible.

Avoid overly condensed technical fonts for primary instructional content.

Technical values or control states may use a suitable secondary type style where useful.

---

# Responsive Philosophy

Do not simply shrink the desktop design.

Each layout should respect its actual use case.

### Desktop

Use available space to keep the cockpit image and instruction visible together.

### Narrow Companion

Prioritize:

1. Action
2. Image
3. Expected result
4. Navigation

Learning explanation may collapse.

### Tablet

Prioritize touch interaction and strong image visibility.

---

# Design Goal

The successful concept should allow a user to glance away from Microsoft Flight Simulator, understand the next action almost immediately, perform it in the simulator, verify the result, and continue.

The interface should minimize the amount of time the user's attention is removed from the simulator.

---

# Deliverable

Produce three visual directions:

1. **Precision Aviation**
2. **Modern Learning**
3. **Simulator Companion**

For each direction:

* Show the wide desktop concept.
* Show the narrow companion concept.
* Show the tablet/iPad concept.
* Explain the visual rationale briefly.
* Identify the primary strengths of the direction.
* Identify any meaningful usability tradeoffs.

Do not choose a winner.

The objective is to compare the directions and select the visual foundation for CockpitPath before designing the rest of the product.
