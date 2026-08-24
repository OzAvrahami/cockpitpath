# CockpitPath — Target Users

**Document Status:** Draft v0.1
**Product:** CockpitPath
**Last Updated:** 2026-08-24

## 1. Purpose

This document defines the primary users CockpitPath is designed for.

CockpitPath should not attempt to serve every type of aviation or simulation user equally.

The initial product should focus on simulator users who are motivated to learn complex aircraft but find traditional learning workflows inefficient while actively using the simulator.

---

## 2. Primary Target User

The primary CockpitPath user is:

> A flight simulation user who wants to learn a complex aircraft in a structured, visual way while using the simulator.

This user may already understand basic flight simulation but does not yet feel comfortable operating a specific advanced aircraft from start to finish.

They want guidance that is:

* Clear
* Visual
* Practical
* Structured
* Easy to follow beside the simulator
* More interactive than a checklist
* More convenient than repeatedly pausing a video

---

## 3. Core User Characteristics

Primary users are likely to:

* Use Microsoft Flight Simulator or a similar modern simulator
* Purchase or use detailed aircraft add-ons
* Want realistic or semi-realistic procedures
* Learn through YouTube, manuals, checklists, and community guides today
* Use a second monitor, tablet, or another device while flying
* Want to understand what they are doing, not only memorize button sequences
* Spend significant time learning one aircraft
* Value clear cockpit orientation
* Be willing to follow structured learning material

---

## 4. Primary Persona — The Learning Simmer

### Profile

The Learning Simmer enjoys realistic flight simulation but is still learning advanced aircraft operation.

They may know how to:

* Start the simulator
* Fly basic aircraft
* Use basic autopilot functions
* Navigate simulator menus
* Follow simple checklists

But they may struggle with:

* Cold-and-dark startup
* FMC initialization
* Aircraft-specific systems
* Finding unfamiliar cockpit controls
* Understanding why procedure steps occur
* Remembering long flows
* Following video tutorials while interacting with the simulator

### Typical Goal

> I want to learn how to operate this aircraft properly without constantly pausing a video.

### CockpitPath Value

CockpitPath gives this user:

* Step-by-step guidance
* Exact cockpit location
* Real cockpit imagery
* Explanations when needed
* Resume support
* System understanding
* A structured learning path

This is the most important v0.1 persona.

---

## 5. Secondary Persona — The Returning Simmer

### Profile

The Returning Simmer has previously learned an aircraft but has not flown it recently.

They remember the overall process but forget details such as:

* Startup order
* FMC sequence
* Specific switch locations
* Before Takeoff flow
* System-specific steps

### Typical Goal

> I already know this aircraft, but I need a clear refresher without watching a 45-minute tutorial again.

### CockpitPath Value

This user benefits from:

* Quick Mode
* Standalone procedures
* Procedure navigation
* Control search
* Cockpit Explorer
* Fast visual reminders
* Continue Learning

This persona may use CockpitPath more as an operational reference than as a full course.

---

## 6. Secondary Persona — The Curious Systems Learner

### Profile

This user can already follow aircraft procedures but wants to understand why those procedures exist.

They ask questions such as:

* Why do I turn the Battery on first?
* Why do I need the APU?
* What does Bleed Air actually do?
* What is an electrical bus?
* Why do I configure the MCP before pushback?
* What happens when I turn this switch on?

### Typical Goal

> I do not want to just memorize the flow. I want the aircraft to make sense.

### CockpitPath Value

This user benefits from:

* Learn Mode
* Aircraft Systems
* Related concepts
* Cockpit Explorer
* Procedure-to-system cross-links
* Why It Matters explanations

This persona validates the deeper educational value of CockpitPath.

---

## 7. Secondary Persona — The Visual Learner

### Profile

This user struggles with text-only checklists or technical manuals.

They learn more effectively when they can see:

* The exact panel
* The exact control
* The surrounding cockpit area
* Visual system relationships
* What should change after an action

### Typical Goal

> Show me where it is instead of just telling me its name.

### CockpitPath Value

This user benefits strongly from:

* Real cockpit imagery
* Dynamic highlights
* Guide me there
* Cockpit Explorer
* Visual system diagrams
* Expected-result guidance

CockpitPath should remain strongly visual even as its content library grows.

---

## 8. Experience Range

CockpitPath should primarily support users between two extremes.

### Lower Boundary

The user should have basic familiarity with flight simulation.

CockpitPath does not need to teach from zero:

* What an airplane is
* Basic simulator camera controls
* Basic mouse interaction
* Basic concepts such as runway, altitude, or throttle

Beginner-friendly explanations are important, but CockpitPath v0.1 is not a complete introduction to aviation.

### Upper Boundary

Experienced simulator pilots may still find CockpitPath useful as:

* Reference
* Refresher
* Procedure companion
* Systems reference

However, the product should not optimize exclusively for expert pilots who already know the aircraft in detail.

---

## 9. Technical Skill Level

Users should not need technical or developer knowledge.

CockpitPath should assume users understand normal consumer web applications.

The user should not need to know:

* File paths
* Simulator APIs
* Add-on configuration files
* Database concepts
* Programming
* Technical aircraft documentation conventions

Complexity should remain inside the product.

---

## 10. Simulator Skill Level

CockpitPath v0.1 primarily targets:

**Beginner-to-intermediate users of advanced aircraft add-ons**

rather than:

**Complete flight-simulation beginners**

or:

**Professional-level aircraft experts**

The product may eventually expand in both directions.

---

## 11. Device Behavior

A major characteristic of the target audience is multi-device simulator usage.

Likely configurations include:

### Main Monitor + Second Monitor

Simulator on one monitor.

CockpitPath on another.

### Main Monitor + iPad

Simulator on PC.

CockpitPath on a tablet beside the controls.

### Ultrawide / Single Monitor

Simulator uses most of the screen.

CockpitPath runs in a narrow browser window beside it.

### Mobile

Used primarily for:

* Reference
* System learning
* Procedure review
* Quick cockpit lookup

Mobile is supported, but it is not the ideal primary Guide Mode experience.

---

## 12. Companion-Window User

A particularly important CockpitPath usage pattern is the narrow companion window.

The user may have only:

`400–550 px`

available beside the simulator.

This user needs:

* Large current action
* Minimal navigation chrome
* Clear visual reference
* Easy Done — Next
* No unnecessary dashboard elements
* No horizontal scrolling

Guide Mode should be especially optimized for this behavior.

---

## 13. Tablet User

Tablet users are a primary audience.

An iPad or similar tablet is naturally suited to CockpitPath because it can remain physically beside:

* Keyboard
* Flight controls
* Throttle
* Simulator display

Tablet UX should receive first-class treatment rather than behaving as a stretched mobile design.

---

## 14. User Motivation

Users may come to CockpitPath for several reasons.

### Learn a New Aircraft

The strongest acquisition use case.

### Complete a First Cold-and-Dark Flight

A high-value milestone.

### Refresh Forgotten Procedures

Useful for returning users.

### Find a Cockpit Control

A utility-oriented use case.

### Understand a System

A deeper learning use case.

### Follow Procedures While Flying

The primary recurring usage pattern.

---

## 15. Current Alternatives

Target users currently use combinations of:

* YouTube tutorials
* Aircraft manuals
* PDF guides
* Static checklists
* Discord communities
* Forums
* Reddit
* Written tutorials
* Personal notes
* Trial and error

CockpitPath does not need to replace every one of these resources.

It should outperform them specifically for:

> structured aircraft learning while the simulator is actively open.

---

## 16. Main User Frustrations

Common frustrations CockpitPath should address include:

* Constantly pausing videos
* Rewinding because a step was missed
* Not knowing where a control is located
* Losing track of the current procedure step
* Checklists that assume too much knowledge
* Manuals that contain too much information
* Tutorials that explain actions but not reasons
* Different terminology across tutorials
* Forgetting progress between sessions
* Searching multiple sources for one procedure

---

## 17. User Expectations

Users should expect CockpitPath to be:

* Easy to understand
* Visually clear
* Fast
* Accurate
* Consistent
* Respectful of simulator screen space
* Reliable when resuming progress
* Explicit about simulator/add-on differences

Users should not need to learn how CockpitPath itself works before they can learn the aircraft.

---

## 18. Trust

Trust is especially important for this audience.

A user following a cockpit procedure needs confidence that:

* The step is correct
* The control is correctly identified
* The screenshot matches their aircraft implementation
* Simulator-specific differences are clearly marked
* Verification information is not fabricated

A polished interface cannot compensate for inaccurate procedural content.

---

## 19. User Learning Styles

CockpitPath should primarily support:

### Visual learning

Cockpit images, highlights, diagrams.

### Procedural learning

Performing actions in sequence.

### Contextual learning

Understanding information while it is relevant.

### Exploratory learning

Selecting cockpit controls or system components freely.

CockpitPath does not need to rely heavily on traditional lecture-style learning.

---

## 20. Information Depth Preferences

Users have different preferences for detail.

CockpitPath should support both:

### Action-oriented users

> Just tell me what to do next.

Primarily served by Quick Mode.

### Understanding-oriented users

> Explain why I am doing this.

Primarily served by Learn Mode and Aircraft Systems.

These users should use the same underlying procedure and progress state.

---

## 21. International Audience

CockpitPath should be designed for an international flight simulation audience.

The v0.1 interface and content may be English only.

Terminology should generally use internationally recognized aviation and aircraft terminology.

Avoid unnecessary local assumptions.

Localization may be added later.

---

## 22. Commercial Audience

Potential paying users are likely to be people who:

* Regularly use realistic aircraft add-ons
* Purchase simulator products
* Value structured learning
* Want to learn multiple aircraft over time
* See learning efficiency as worth paying for

The MVP should validate usefulness before optimizing aggressively for monetization.

---

## 23. Users CockpitPath Is Not Primarily Designed For

CockpitPath v0.1 is not primarily designed for:

### Real-world pilot certification

CockpitPath is a flight simulation learning product.

### Aircraft maintenance technicians

It is not maintenance training.

### Professional type-rating students

CockpitPath must not position itself as certified training material.

### Complete aviation beginners

The product assumes some basic simulator familiarity.

### Casual arcade players

Users who do not want realistic aircraft procedures are unlikely to gain much value.

### Users seeking live aircraft automation

CockpitPath does not control the simulator.

### Users seeking a flight planner

Flight planning is not the core product.

---

## 24. Professional Aviation Boundary

CockpitPath may use real aviation concepts and procedures as part of simulator education.

However, the product should clearly position itself as:

**Flight simulation learning software**

and not as:

* Approved training material
* Certified operational guidance
* Airline procedure documentation
* Real-world flight operations software

This distinction should remain clear in product messaging and legal documentation.

---

## 25. User Journey — First Visit

A likely first-time flow is:

```text id="cp-first-user"
Discovers CockpitPath
        ↓
Understands the visual learning concept
        ↓
Sees Boeing 737 MAX 8 support
        ↓
Creates account or begins available content
        ↓
Opens Aircraft Page
        ↓
Starts Cold & Dark → Takeoff
        ↓
Follows the first Guide Mode steps
        ↓
Sees CockpitPath locate a real cockpit control
        ↓
Understands the immediate value
```

The product should reach this value moment quickly.

---

## 26. User Journey — Returning User

```text id="cp-returning-user"
Returns to CockpitPath
        ↓
Signs in / existing session restored
        ↓
Aircraft Page
        ↓
Continue Learning
        ↓
Returns to the exact section and step
        ↓
Continues beside simulator
```

Resume friction should be extremely low.

---

## 27. User Journey — Reference Use

```text id="cp-reference-user"
Needs to find a cockpit control
        ↓
Opens Cockpit Explorer
        ↓
Searches or visually navigates
        ↓
Selects control
        ↓
Reads explanation
        ↓
Returns to simulator
```

CockpitPath should remain valuable even when the user is not following a complete learning journey.

---

## 28. User Journey — Systems Learning

```text id="cp-systems-user"
Does not understand a procedure step
        ↓
Opens related concept or system
        ↓
Sees conceptual explanation
        ↓
Connects system component to cockpit control
        ↓
Returns to procedure
        ↓
Procedure now makes more sense
```

This loop represents the deeper CockpitPath learning model.

---

## 29. Product Priority Implications

Because of these users, CockpitPath should prioritize:

1. Guide Mode usability
2. Cockpit imagery accuracy
3. Fast visual orientation
4. Tablet support
5. Narrow companion support
6. Reliable progress
7. Concise explanations
8. Cross-linking
9. Search
10. Content trust

Features such as social profiles or extensive dashboards should remain lower priority.

---

## 30. Primary User Definition

For product and architecture decisions, use the following default user:

> A motivated beginner-to-intermediate flight simulation user learning a complex aircraft add-on, using CockpitPath beside Microsoft Flight Simulator on a second monitor, tablet, or narrow browser window.

When a design choice creates tension between this user and an edge case, the primary user should generally win during v0.1.

---

## Status

**CockpitPath Target Users v0.1**

Primary audience defined for product, UX, content, architecture, and implementation decisions.
