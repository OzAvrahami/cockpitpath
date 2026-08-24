# CockpitPath — MVP v0.1

**Document Status:** Draft v0.1
**Product:** CockpitPath
**Release:** MVP / Beta v0.1
**Last Updated:** 2026-08-24

## 1. Purpose

This document defines the scope of CockpitPath v0.1.

The goal of v0.1 is not to build the complete CockpitPath platform.

The goal is to prove that CockpitPath provides a better way to learn and follow a complex aircraft procedure while actively using the simulator.

The first release should prioritize:

* One aircraft
* One simulator implementation
* One high-quality learning journey
* Strong cross-linking between procedures, cockpit controls, and systems
* Reliable progress and resume behavior
* Excellent simulator-companion usability

Depth and clarity are more important than breadth.

---

## 2. MVP Hypothesis

CockpitPath v0.1 should test the following hypothesis:

> Flight simulation users can learn and execute a complex aircraft procedure more comfortably using a visual, interactive CockpitPath guide beside the simulator than by repeatedly pausing and rewinding a traditional video tutorial.

The MVP should be designed to validate this experience.

---

## 3. Initial Aircraft

CockpitPath v0.1 supports one aircraft implementation:

### Aircraft

Boeing 737 MAX 8

### Add-on

iFly

### Simulator

Microsoft Flight Simulator 2024

The product architecture must support additional aircraft later, but v0.1 should not include multiple aircraft merely to demonstrate scalability.

---

## 4. Primary MVP Journey

The primary learning journey is:

**Cold & Dark → Takeoff**

This journey contains the following canonical sections:

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

The exact number of steps inside each section will be determined during verified content production.

Step counts shown in design references are placeholders and are not part of the MVP specification.

---

## 5. Journey Completion Requirement

The `Cold & Dark → Takeoff` journey should be complete enough that a user can begin with the supported aircraft in a cold-and-dark state and follow CockpitPath through the takeoff phase.

The journey should not require the user to leave CockpitPath to understand essential procedure steps.

External tools may still be required for simulator operations that are outside CockpitPath's scope.

---

## 6. Standalone Procedures

Each journey section should also be accessible independently as a Procedure.

For v0.1, the primary supported procedures are:

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

Additional procedures may exist if verified content is available, but they are not required to declare the primary MVP journey complete.

---

## 7. Optional Arrival Procedures

The product model may support additional procedures such as:

* ILS Approach
* Landing
* Shutdown

These are useful future extensions but are not required to complete the initial MVP hypothesis.

If included during v0.1 development, they should be treated as additional beta content rather than blocking the initial release.

---

## 8. Aircraft Page

v0.1 includes the approved Aircraft Page experience.

The Aircraft Page should provide:

* Aircraft identity
* Simulator and add-on context
* Continue Learning
* Start Journey
* Journey listing
* Procedure listing
* Cockpit Explorer entry
* Aircraft Systems entry
* Useful progress summary
* Content availability states

The page should answer:

> What should I learn or continue next on this aircraft?

---

## 9. Guide Mode

Guide Mode is the most important v0.1 product experience.

It must support:

* One logical action per step where practical
* Step title / action
* Cockpit location
* Visual reference
* Expected result
* Explanation
* Tip
* Warning
* Optional supporting information
* Previous
* Done — Next
* Skip
* Auto-save
* Resume
* Section navigation
* Focus Mode
* Quick and Learn information density
* Responsive use beside the simulator

---

## 10. Guide Mode Step Types

The content model should support the following step types:

* ACTION
* VERIFY
* WAIT
* INFORMATION
* MULTI_ACTION

Steps may also be marked optional where appropriate.

The initial content does not need to use every step type if the procedure does not require it.

---

## 11. Expected Result Behavior

Expected Result in v0.1 is user-confirmed.

CockpitPath does not know the live simulator state.

The interface must not claim that it automatically verified the expected result.

The user completes or confirms the step manually.

---

## 12. Quick and Learn

Guide Mode supports two information-density states:

### Quick

Focuses on the immediate action and essential visual guidance.

### Learn

Shows additional explanation, context, and concepts.

Switching between Quick and Learn must not:

* Reset progress
* Change the current step
* Navigate away from the guide
* Create separate procedure states

They are two presentations of the same learning step.

---

## 13. Focus Mode

Guide Mode should include Focus Mode.

Focus Mode reduces unnecessary application chrome while the user is actively following a procedure beside the simulator.

The experience should prioritize:

* Action
* Visual
* Expected result
* Navigation

The user must be able to exit Focus Mode easily.

---

## 14. Cockpit Imagery

Guide Mode v0.1 should use approved simulator captures from the supported iFly Boeing 737 MAX 8 implementation where visual identification is important.

Visual annotations should be rendered dynamically.

Examples include:

* Focus boundaries
* Corner markers
* Dimming
* Labels
* Hotspots

Annotations should not be permanently baked into source images.

---

## 15. Cockpit Explorer

v0.1 includes Cockpit Explorer.

Cockpit Explorer should allow the user to:

1. Open the aircraft cockpit.
2. Select a major cockpit region.
3. Navigate to a panel area.
4. Select a control.
5. Learn the control name.
6. Understand what the control does.
7. Understand when it is used.
8. See related system content.
9. See related procedures.
10. Open a relevant procedure.

---

## 16. Cockpit Explorer Scope

Cockpit Explorer does not need complete 737 MAX cockpit coverage for the first beta.

The priority is to support controls used by the primary `Cold & Dark → Takeoff` journey.

Recommended initial coverage should prioritize:

* Overhead
* MCP
* Main Instrument Panel where required
* Center Pedestal
* CDU / FMC

Coverage should expand based on procedure requirements.

---

## 17. Cockpit Explorer Search

Cockpit Explorer v0.1 should support searching controls.

Search should support:

* Canonical control name
* Search aliases
* Cockpit location

Selecting a search result should navigate to and focus the relevant control.

Search does not need advanced semantic AI functionality.

---

## 18. Guide Me There

Cockpit Explorer and Guide Mode may use the shared `Guide me there` pattern.

The intended orientation model is:

1. Cockpit
2. Panel
3. Area
4. Exact control

The implementation may use progressive images, zoom states, or visual transitions.

The important requirement is that the user can understand where the control is located.

---

## 19. Aircraft Systems

v0.1 includes the Aircraft Systems experience.

The initial required system is:

**Electrical**

Electrical establishes the reusable Aircraft Systems interaction model.

Additional systems such as Fuel or Hydraulics may be included only if content development capacity allows.

They are not required for the initial release.

---

## 20. Aircraft Systems v0.1 Requirements

The Electrical system experience should support:

* System introduction
* Conceptual system diagram
* Component selection
* Selected relationship highlighting
* Component explanation
* Why It Matters
* Related cockpit controls
* Related concepts
* Related procedures
* Learning sections
* Responsive diagram layouts

Diagram highlighting represents conceptual relationships.

It must not imply live aircraft state.

---

## 21. Shared Concepts

v0.1 should support reusable learning concepts.

Examples may include:

* Electrical Bus
* Standby Power
* Ground Power
* AC Power
* DC Power
* IRS
* Bleed Air

Only concepts actually required by MVP content need to be authored.

Concept definitions should be reusable across:

* Guide Mode
* Cockpit Explorer
* Aircraft Systems

---

## 22. Cross-Linking

Cross-linking is a core MVP requirement.

The same content objects should connect across product experiences.

Examples:

### Guide Mode

`BATTERY → ON`

→ control reference:

`Battery Switch`

### Cockpit Explorer

`Battery Switch`

→ system:

`Electrical`

→ used in:

`Power Up`

### Aircraft Systems

`Aircraft Battery`

→ cockpit control:

`Battery Switch`

→ procedure:

`Power Up`

The MVP should demonstrate that CockpitPath is one connected learning system.

---

## 23. Context Preservation

Moving between connected learning experiences should preserve useful context.

Examples:

* Guide Mode → concept → return to same step
* Cockpit Explorer → Aircraft Systems → return to selected control
* Aircraft Systems → Cockpit Explorer → focus related control
* Procedure link → preserve origin where practical

The initial implementation does not require a sophisticated universal navigation history system.

However, users should not lose important learning progress or position.

---

## 24. Authentication

v0.1 should support user accounts.

Authentication exists primarily to support:

* Progress persistence
* Resume across sessions
* Future entitlement support

Required authentication capabilities:

* Sign up
* Sign in
* Sign out
* Persistent authenticated session
* Basic account identity

Password reset should be supported if the chosen authentication provider makes it straightforward.

---

## 25. Anonymous Usage

The initial implementation may allow selected public content to be viewed without authentication.

However, persistent cross-device progress requires an authenticated account.

The exact anonymous-access behavior will be defined during architecture and access-control design.

---

## 26. Progress

v0.1 must persist meaningful learning progress.

Required progress states include:

* Current journey
* Current section
* Current step
* Completed steps
* Completed procedures where applicable
* Last learning position
* Resume timestamp where useful

Progress should auto-save.

The user should not need to manually press Save.

---

## 27. Resume

Resume is a core MVP feature.

A returning user should be able to open the Aircraft Page and see a prominent:

`Continue Learning`

entry.

The entry should identify:

* Journey
* Current section
* Current step

Selecting Continue should return the user to the correct Guide Mode location.

---

## 28. Progress Page

A dedicated Progress area may exist in v0.1 if required by the approved navigation shell.

It should remain simple.

Useful information may include:

* Journey completion
* Procedure completion
* Last activity

Avoid:

* Learning streaks
* XP
* Badges
* Leaderboards
* Performance scoring
* Gamification analytics

---

## 29. Content Status

Content should support publishing states such as:

* Draft
* Review
* Verified
* Published

User-facing availability states may include:

* Available
* Coming Soon

Internal editorial states do not need to be exposed to users.

---

## 30. Verification

The data model must support verification metadata.

At minimum, verified content should be able to store:

* Aircraft
* Add-on
* Simulator
* Source references
* Verification status
* Last verified date
* Add-on version when relevant
* Simulator version when relevant
* Simulator-specific notes

Unverified design placeholder information must never silently become production content.

---

## 31. Content Authoring

v0.1 requires a maintainable way to create and update structured learning content.

A complete visual CMS is not required for the first beta.

Content may initially be authored through:

* Repository files
* Structured content files
* Database-backed internal scripts
* Lightweight admin workflow

The architecture decision will be made separately.

The important requirement is:

> Learning content must remain separate from presentation components.

---

## 32. Content Must Not Be Hard-Coded Into UI

Procedure content, controls, systems, concepts, and verification data should not be embedded directly into page component source code as permanent product data.

The UI should render structured content.

This is required for:

* Future aircraft
* Version updates
* Verification changes
* Reusable entities
* Translation possibilities
* Content maintenance

---

## 33. Media Asset Management

v0.1 must support managed cockpit imagery.

Media metadata should allow future information such as:

* Aircraft implementation
* Panel
* View
* Crop
* Resolution
* Capture context
* Verification status

Hotspot coordinates should remain separate from the image file itself.

---

## 34. Responsive Support

v0.1 must support:

### Desktop

Primary development environment and simulator companion.

### Narrow companion browser

Approximately 400–550 px.

Especially important for Guide Mode.

### iPad / Tablet

Primary supported learning environment.

### Mobile

Supported for reference and learning.

The MVP is web-first.

---

## 35. Native Applications

Native iOS, iPadOS, Android, Windows, or macOS applications are not required for v0.1.

CockpitPath should begin as a responsive web application.

PWA capabilities may be considered later if they provide clear value.

---

## 36. Browser Support

v0.1 should target modern evergreen browsers.

Primary focus:

* Chrome
* Edge
* Safari

Exact supported browser versions will be defined during implementation.

Legacy browser support is not required.

---

## 37. Simulator Integration

v0.1 does not require simulator telemetry.

There is no requirement for:

* SimConnect
* Automatic switch detection
* Live simulator state
* Automatic step completion
* Aircraft-state synchronization

The architecture should avoid assumptions that would make future simulator integration unnecessarily difficult.

---

## 38. Flight Planning Integrations

v0.1 does not require integrations with:

* SimBrief
* Navigraph
* FlightAware
* Online ATC networks
* Weather providers

Route and FMC learning may use example or user-entered scenario data where necessary.

External flight-planning integration can be evaluated later.

---

## 39. AI

v0.1 does not include:

* AI instructor
* AI chat
* AI procedure generation
* AI cockpit recognition
* AI voice guidance

The core CockpitPath learning experience must prove its value without AI.

---

## 40. Voice and Audio

v0.1 does not require:

* Voice narration
* Speech recognition
* Spoken commands
* Audio callouts generated by CockpitPath

The first release is primarily visual and text-based.

---

## 41. Community Features

v0.1 does not include:

* User-created guides
* Comments
* Ratings
* Shared progress
* Community annotations
* Public profiles
* Social feeds

CockpitPath should first establish content quality and learning usability.

---

## 42. Billing

v0.1 beta does not require active billing.

The product should be structured so future access levels are possible.

Potential future entitlements may include:

* Free
* Pro
* Aircraft Pack

However, v0.1 may make all released beta content free.

Do not build payment infrastructure before it is required.

---

## 43. Entitlement Readiness

Although billing is out of scope, content access should not be architected in a way that makes future entitlements difficult.

Content may eventually support access properties such as:

* FREE
* PRO
* PACK

The exact implementation will be defined during access-control architecture.

---

## 44. Public Website

CockpitPath eventually needs a public-facing website.

For MVP, public pages may include:

* Landing page
* Product explanation
* Supported aircraft
* Sign in
* Sign up

Pricing does not need to be active during the free beta.

The learning application and public website should ideally live within the same web product and repository unless architecture provides a strong reason otherwise.

---

## 45. Marketing Scope

The public website should not delay the core learning MVP.

A polished but small landing experience is sufficient for beta.

The product experience is more important than extensive marketing pages.

---

## 46. Administration

A complete administrative dashboard is not required for v0.1.

Internal administration may initially rely on controlled developer/editor workflows.

The product still needs a safe way to:

* Publish content
* Update content
* Change availability
* Manage verification metadata

The exact workflow will be defined later.

---

## 47. Analytics

Basic product analytics may be included if easy to implement and privacy-appropriate.

Useful MVP events may include:

* Journey started
* Journey resumed
* Step completed
* Procedure completed
* Cockpit Explorer opened
* System opened

Advanced analytics infrastructure is not required.

---

## 48. Error and Empty States

v0.1 must provide basic states for:

* No saved progress
* Content unavailable
* Coming Soon
* Failed content load
* Failed image load
* Authentication required
* Offline / network problem where relevant

The user should never be left with an unexplained blank screen.

---

## 49. Accessibility

MVP implementation should include:

* Keyboard navigation
* Visible focus states
* Semantic controls
* Reasonable screen-reader support
* Sufficient contrast
* Non-color-only status communication
* Touch-friendly targets
* Browser zoom support

Accessibility should be built into components from the beginning rather than postponed completely.

---

## 50. Localization

CockpitPath v0.1 product content and interface may launch in English only.

The architecture should avoid unnecessarily preventing localization later.

Full multilingual content and interface localization are not MVP requirements.

---

## 51. MVP Required Experiences

The MVP should not be considered product-complete until the following primary journey works:

```text id="cp-mvp-flow"
User creates or opens account
        ↓
Selects Boeing 737 MAX 8
        ↓
Opens Aircraft Page
        ↓
Starts Cold & Dark → Takeoff
        ↓
Uses Guide Mode
        ↓
Opens cockpit-control explanation
        ↓
Returns to the same procedure step
        ↓
Uses Cockpit Explorer when needed
        ↓
Opens Electrical System explanation
        ↓
Returns to cockpit/procedure context
        ↓
Continues journey
        ↓
Leaves CockpitPath
        ↓
Returns later
        ↓
Continue Learning restores the correct position
```

This connected experience is more important than adding additional content categories.

---

## 52. Required v0.1 Scope

The minimum release scope is:

* Responsive web application
* User authentication
* Boeing 737 MAX 8 / iFly / MSFS 2024 implementation
* Aircraft Page
* Cold & Dark → Takeoff journey
* Guide Mode
* Quick / Learn
* Focus Mode
* Real cockpit imagery
* Dynamic visual annotations
* Cockpit Explorer
* Cockpit control search
* Electrical Aircraft System
* Shared learning concepts
* Cross-linking
* Persistent progress
* Continue Learning
* Verification metadata architecture
* Free beta access
* Basic public landing page

---

## 53. Explicitly Out of Scope for v0.1

The following are not required for MVP:

* Multiple complete aircraft
* Native mobile applications
* Native desktop application
* Live simulator telemetry
* SimConnect
* Automatic procedure completion
* SimBrief integration
* Navigraph integration
* Voice instructor
* AI instructor
* Community guides
* Comments
* Ratings
* Social features
* Multiplayer
* Flight planning
* Failure training
* Aircraft maintenance training
* Advanced quizzes
* Gamification
* Leaderboards
* Payment processing
* Subscription checkout
* Complex administrative CMS
* Full cockpit documentation
* Every aircraft system
* Complete arrival-to-shutdown journey

---

## 54. Release Quality Bar

CockpitPath v0.1 should prefer:

**One procedure that feels excellent**

over:

**Ten procedures that feel unfinished.**

The primary journey must feel trustworthy, understandable, visually clear, and comfortable to use beside the simulator.

Content accuracy and usability are release blockers.

Feature count is not.

---

## 55. MVP Success Criteria

The MVP is successful if beta users can:

1. Understand what CockpitPath is.
2. Begin the 737 MAX learning journey without external explanation.
3. Follow Guide Mode beside the simulator.
4. Find controls visually.
5. Understand important controls.
6. Learn supporting system concepts.
7. Move between procedure, cockpit, and system without becoming lost.
8. Resume after leaving the application.
9. Complete a meaningful portion of the journey.
10. Prefer the experience over repeatedly pausing a video tutorial for the same learning task.

---

## 56. Post-MVP Evaluation

After v0.1 usage, CockpitPath should evaluate:

* Where users abandon procedures
* Whether visual guidance is sufficient
* Whether Quick or Learn is used more often
* How frequently Cockpit Explorer is used during procedures
* Which controls users search for
* Which system explanations users open
* Whether users successfully resume later
* Whether users want more aircraft or deeper content first

These findings should guide v0.2 rather than assuming the roadmap in advance.

---

## Status

**CockpitPath MVP v0.1**

Scope defined for product, architecture, content, and implementation planning.
