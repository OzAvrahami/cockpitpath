# CockpitPath — Product Vision

**Document Status:** Draft v0.1
**Product:** CockpitPath
**Last Updated:** 2026-08-24

## 1. Vision

CockpitPath is a visual, interactive learning platform for flight simulation users who want to learn complex aircraft while actively using the simulator.

Instead of relying on long videos, static checklists, or technical manuals, CockpitPath guides users through aircraft procedures, cockpit controls, and systems in a format designed to remain visible beside the simulator.

The long-term vision is:

> Make learning a complex simulated aircraft feel like having a clear visual instructor beside the cockpit.

---

## 2. The Problem

Complex flight simulation aircraft can be difficult to learn.

Users often depend on:

* YouTube tutorials
* PDF manuals
* Static checklists
* Forum posts
* Community guides
* Trial and error

These resources are useful, but they are often poorly suited to learning while flying.

A typical video-based workflow requires the user to:

1. Watch a step.
2. Pause the video.
3. Return to the simulator.
4. Find the correct cockpit control.
5. Perform the action.
6. Return to the video.
7. Rewind if something was missed.
8. Repeat the process.

This creates unnecessary friction.

The user is forced to manage the learning material instead of concentrating on learning the aircraft.

---

## 3. Product Opportunity

CockpitPath turns aircraft learning into an interactive companion experience.

The product should allow a user to place CockpitPath on:

* A second monitor
* An iPad or tablet
* A narrow browser window beside the simulator
* A mobile device when necessary

and follow aircraft learning content without constantly switching context.

The core opportunity is not simply to digitize checklists.

CockpitPath combines:

* Visual procedures
* Real cockpit imagery
* Interactive cockpit exploration
* Aircraft-system learning
* Progress tracking
* Cross-linked learning content

into one connected experience.

---

## 4. Core Product Promise

CockpitPath should help users answer four questions:

### What should I do?

Answered by **Guide Mode**.

### Where is it?

Answered by visual guidance and **Cockpit Explorer**.

### What is this control?

Answered by **Cockpit Explorer**.

### Why does it work this way?

Answered by **Aircraft Systems** and reusable learning concepts.

These questions should be connected rather than treated as separate learning products.

---

## 5. Core Learning Loop

CockpitPath's primary learning loop is:

```text
Procedure
   ↓
What should I do?
   ↓
Cockpit
   ↓
Where is the control?
   ↓
Control
   ↓
What does it do?
   ↓
System
   ↓
Why does it work this way?
   ↓
Procedure
   ↓
The procedure now makes more sense.
```

The product should allow users to move naturally between these levels without losing context.

---

## 6. Core Product Areas

CockpitPath is built around four connected product areas.

### 6.1 Aircraft Page

The learning hub for a specific aircraft implementation.

It helps users:

* Continue unfinished learning
* Start journeys
* Browse procedures
* Open Cockpit Explorer
* Learn aircraft systems
* Understand available content

---

### 6.2 Guide Mode

An interactive fly-along procedure experience.

Guide Mode tells the user exactly what to do next while keeping the relevant cockpit location visible.

A typical step contains:

* Action
* Cockpit location
* Visual reference
* Expected result
* Explanation
* Supporting learning information

Guide Mode is designed specifically for use beside the simulator.

---

### 6.3 Cockpit Explorer

A visual cockpit-learning environment.

Users can explore the cockpit without knowing the technical name of a control.

The core flow is:

```text
See it
→ Select it
→ Understand it
→ See where it is used
```

Cockpit Explorer connects physical cockpit controls to systems, concepts, and procedures.

---

### 6.4 Aircraft Systems

A visual learning experience for understanding how aircraft systems work.

Aircraft Systems connects:

* System components
* Cockpit controls
* Concepts
* Procedures
* Operational relevance

The goal is not maintenance-level technical training.

The goal is to give simulator users enough understanding that cockpit actions and procedures make sense.

---

## 7. Initial Aircraft

The first CockpitPath aircraft implementation is:

**Aircraft**

Boeing 737 MAX 8

**Add-on**

iFly

**Simulator**

Microsoft Flight Simulator 2024

The first complete learning journey is intended to cover:

**Cold & Dark → Takeoff**

This first aircraft should establish the reusable product model for future aircraft.

CockpitPath must not be architected as a Boeing 737-only product.

---

## 8. Primary Audience

CockpitPath is primarily designed for flight simulation users who:

* Want to learn advanced aircraft
* Prefer structured learning
* Find video tutorials inefficient while flying
* Use realistic aircraft add-ons
* Want to understand procedures rather than memorize switches
* May use a second monitor or tablet alongside the simulator

The product should be approachable for motivated beginners while remaining useful to more experienced simulator pilots.

---

## 9. Learning Philosophy

CockpitPath should be:

### Visual

Show the cockpit whenever visual location matters.

### Operational

Connect information to what the user actually does in the simulator.

### Progressive

Teach the essential idea first and deeper detail second.

### Connected

Procedures, controls, systems, and concepts should reference shared content entities.

### Contextual

Users should be able to learn without repeatedly leaving their current task.

### Accurate

Aircraft and simulator-specific information must be verified before being presented as authoritative.

---

## 10. Content Philosophy

CockpitPath should not copy manuals or recreate long-form documentation.

Content should transform verified source information into simulator-oriented learning material.

Prefer:

* Clear actions
* Concise explanations
* Visual references
* Practical operational context
* Expected outcomes
* Relevant concepts

Avoid unnecessary technical detail unless it improves understanding.

---

## 11. Accuracy and Verification

Accuracy is a core product requirement.

CockpitPath must distinguish between:

* Real aircraft procedure or system information
* Simulator-specific behavior
* Add-on-specific behavior
* CockpitPath educational interpretation

Content should support metadata such as:

* Aircraft
* Simulator
* Add-on
* Add-on version
* Simulator version
* Source
* Last verified
* Simulator-specific notes

No version, source, date, or technical statement should be shown as verified unless verification has actually occurred.

---

## 12. Real Cockpit Imagery

Where cockpit location matters, CockpitPath should use approved simulator captures from the supported aircraft implementation.

Real cockpit imagery is especially important for:

* Guide Mode
* Cockpit Explorer
* Control identification
* Visual orientation

Highlights, hotspots, focus frames, and annotations should be rendered dynamically above the base image rather than baked permanently into screenshots.

---

## 13. Simulator Companion Design

CockpitPath is not designed only as a conventional website.

Its learning experiences must work as a companion to the simulator.

Important usage environments include:

* Wide desktop
* Second monitor
* iPad / tablet
* 400–550 px companion browser window
* Mobile

Guide Mode has the strongest narrow-window requirement.

Tablet is a primary CockpitPath learning device class.

---

## 14. Product Personality

CockpitPath should feel:

* Calm
* Precise
* Modern
* Technical
* Focused
* Premium
* Aviation-aware

It should not feel like:

* A generic online course
* A gaming HUD
* An enterprise dashboard
* A maintenance manual
* A social network
* A video platform

The simulator and aircraft should remain the center of attention.

---

## 15. Connected Content Model

CockpitPath should treat learning content as reusable structured entities.

Examples include:

* Aircraft
* Simulator implementation
* Journey
* Procedure
* Procedure Step
* Cockpit Panel
* Control
* Hotspot
* System
* System Component
* Concept
* Media Asset

A Procedure Step may reference a Control.

The same Control may appear in Cockpit Explorer.

That Control may belong to a System.

The System may reference Concepts and Procedures.

This shared model is fundamental to CockpitPath.

---

## 16. Progress

CockpitPath should remember where users are in their learning.

Progress should support useful behaviors such as:

* Resume journey
* Resume procedure
* Completed steps
* Completed procedures
* Last learning position

Progress exists to reduce friction.

CockpitPath should avoid unnecessary gamification.

---

## 17. Business Direction

CockpitPath should be architected so a future freemium business model is possible.

Potential future access models may include:

* Free content
* Pro subscription
* Aircraft-specific premium content
* Aircraft packs

The initial beta does not require paid access.

Billing infrastructure should not drive the first product implementation.

---

## 18. Future Expansion

The CockpitPath model should eventually support additional aircraft and simulator implementations.

Possible future aircraft categories include:

* Airliners
* Business jets
* General aviation aircraft
* Military aircraft where appropriate

Future integrations may include simulator-aware features, but the core learning product must remain useful without telemetry.

---

## 19. What CockpitPath Is Not

CockpitPath is not intended to become:

* A replacement flight simulator
* A real-aircraft certification platform
* A maintenance training platform
* A live cockpit control system
* A flight planning service
* A multiplayer network
* A social community platform
* A generic LMS
* A video hosting platform
* An aircraft marketplace

These may overlap with the flight simulation ecosystem, but they are not the core CockpitPath product.

---

## 20. v0.1 Strategic Focus

The first version should prove one core idea:

> A user can successfully learn and follow a complex aircraft procedure more comfortably with CockpitPath beside the simulator than with a traditional video tutorial.

The first beta should prioritize depth and quality for one aircraft over shallow coverage of many aircraft.

---

## 21. Product Success

CockpitPath succeeds when a user can:

1. Choose an aircraft.
2. Start or resume a learning journey.
3. Follow a procedure while using the simulator.
4. Find the exact cockpit control required.
5. Understand what the control does.
6. Understand the related aircraft system when desired.
7. Return to the procedure without losing context.
8. Continue later from the same position.

The user should spend less time managing learning material and more time learning and flying.

---

## 22. Long-Term Vision

Over time, CockpitPath can become a structured learning layer for complex flight simulation aircraft.

The long-term product should make it possible for a user to approach an unfamiliar aircraft and progressively move from:

**I do not know this cockpit**

to:

**I can operate it**

to:

**I understand why the procedures work**

without needing to assemble the learning process manually from disconnected sources.

---

## Status

**CockpitPath Product Vision v0.1**

Ready to guide MVP scope, architecture, content design, and implementation decisions.
