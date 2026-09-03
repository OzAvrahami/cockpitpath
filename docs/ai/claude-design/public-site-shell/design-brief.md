# CockpitPath — Public Homepage & Application Shell Design Brief

## Status

Design Brief — v1

## Objective

Design the missing entry experience for CockpitPath.

The core learning product has already been designed and approved:

- Aircraft Page
- Guide Mode
- Cockpit Explorer
- Aircraft Systems

What is still missing is the experience around those product areas:

1. Public homepage
2. Global public navigation
3. Sign-in / sign-up presentation
4. Authenticated application shell
5. Entry into the supported aircraft experience
6. Clear transition from public website → learning application

This design must feel like the same CockpitPath product already established by the approved core designs.

Do not redesign the existing core learning experiences.

---

# Product Context

CockpitPath is a visual, interactive flight-simulation learning platform.

It helps simulator users learn complex aircraft without constantly pausing and rewinding videos.

The core learning loop is:

Procedure
→ find the cockpit control
→ understand the system/concept
→ return to the procedure

The product answers four core questions:

- What should I do next?
- Where is this control?
- What does this control do?
- How does this aircraft system work?

Initial supported aircraft implementation:

- Boeing 737 MAX 8
- iFly
- Microsoft Flight Simulator 2024

Current product language:

English.

---

# Important Product Boundary

CockpitPath is:

- Flight simulation learning software
- A second-monitor / tablet companion
- Visual and procedural
- Aviation-focused
- Technical but approachable
- Designed for beginner-to-intermediate users of advanced aircraft add-ons

CockpitPath is NOT:

- Airline training software
- Certified real-world training
- A generic online course platform
- A gaming dashboard
- A social network
- An AI chat product
- A flight-planning application

---

# Existing Approved Visual Direction

The existing Guide Mode direction is locked.

The new public site and shell must visually belong to that same product.

Existing design qualities include:

- Dark, low-glare aviation interface
- Near-black backgrounds
- Restrained cyan/teal accent
- High information clarity
- Compact aviation context
- Serious but modern
- Technical without looking like enterprise admin software
- Strong hierarchy
- Large action-oriented typography where appropriate
- Minimal decorative UI
- Designed to sit beside a simulator

Do not turn the homepage into a generic purple/blue SaaS landing page.

Do not use excessive gradients, glassmorphism, floating cards, fake AI visuals, or generic startup illustrations.

The public homepage may be more expressive than Guide Mode, but it must clearly share CockpitPath's visual DNA.

---

# Primary Design Problem

A first-time visitor currently has no meaningful entry experience.

The homepage must answer very quickly:

1. What is CockpitPath?
2. Why would I use it instead of YouTube/manuals?
3. What can I learn with it?
4. What does the experience look like?
5. What aircraft is supported?
6. How do I start?

A returning authenticated user must also immediately know:

- where to continue learning
- how to enter the aircraft experience
- how to reach their account

---

# Public Homepage

Design a complete public homepage.

Suggested information hierarchy:

## Hero

The hero should communicate the core CockpitPath value in seconds.

Possible positioning direction:

MASTER THE COCKPIT.
ONE STEP AT A TIME.

Supporting concept:

Learn complex aircraft while you fly.

Interactive step-by-step procedures, real cockpit locations, and system explanations — designed to sit beside your simulator.

Primary CTA:
Start learning

Secondary CTA:
Explore the 737 MAX

Do not treat this exact copy as mandatory if a stronger concise formulation fits the established product voice.

The hero should visually demonstrate the actual CockpitPath product.

Prefer a product composition derived from the approved Guide Mode / cockpit learning UI rather than abstract aviation artwork.

---

## Core Learning Modes

Explain the three main learning capabilities:

### FLY — Guide Mode

Know exactly what to do next.

Step-by-step procedures designed to follow while the simulator remains open.

### FIND — Cockpit Explorer

Locate and understand cockpit controls visually.

### UNDERSTAND — Aircraft Systems

Understand how aircraft systems and cockpit controls connect.

The section should communicate that these are connected experiences, not three unrelated features.

---

## Connected Learning Loop

Visually communicate:

Guide Mode
→ Cockpit Control
→ Aircraft System
→ back to Guide Mode

This is a major CockpitPath differentiator.

Keep the explanation visual and concise.

---

## Simulator Companion

Show that CockpitPath is intentionally designed for:

- second monitor
- narrow browser window
- iPad/tablet
- desktop
- mobile support

This section should specifically communicate use beside Microsoft Flight Simulator.

Do not make it look like a mobile-first consumer app.

---

## Supported Aircraft

Initial support:

Boeing 737 MAX 8

Implementation:

iFly
Microsoft Flight Simulator 2024

The design must clearly distinguish:

Aircraft
from
Simulator implementation/add-on.

Do not fabricate:

- step counts
- compatibility versions
- completion percentages
- verification dates

If needed, use neutral availability language.

---

## Product Preview

Show real-looking compositions of the already-approved product areas:

- Guide Mode
- Cockpit Explorer
- Aircraft Systems
- Aircraft Page

These should reflect the approved design language.

Do not invent a completely different internal application.

---

## Beta / Current Availability

CockpitPath v0.1 is currently a free beta.

Do not introduce pricing tables.

Do not imply paid plans already exist.

Possible communication:

Free during beta.

Additional aircraft and deeper learning content will expand over time.

Keep this understated.

---

## Final CTA

Strong closing action:

Start learning

and a secondary sign-in action for returning users.

---

## Footer

Keep the footer compact.

Potential items:

- CockpitPath
- Product / Aircraft
- Sign in
- Privacy
- Terms

Do not create a huge corporate footer.

---

# Public Header

Design a desktop and mobile public header.

Potential structure:

CockpitPath

Aircraft
How it works

Sign in
Start learning

Requirements:

- visually light
- low vertical height
- consistent with aviation/product UI
- clear authenticated and unauthenticated variants
- responsive mobile navigation

Do not create a traditional enterprise sidebar on the public site.

---

# Auth Pages

The application already has functional routes for:

- Sign up
- Sign in
- Forgot password
- Reset password

Design their presentation so they feel like CockpitPath.

They should be:

- focused
- minimal
- serious
- accessible
- visually connected to the public site

Do not build large marketing panels around every auth form.

A subtle aircraft/cockpit context may be used, but the form must remain the focus.

---

# Authenticated Application Shell

Design the global shell users see after authentication.

This shell must work around:

- Aircraft Page
- Guide Mode
- Cockpit Explorer
- Aircraft Systems
- Account

Do not redesign the inner layouts of the existing approved screens.

The shell should solve global orientation and navigation only.

Possible navigation concepts to evaluate:

CockpitPath
Aircraft
Continue Learning
Account

or another similarly compact structure.

Avoid adding features that do not exist.

---

# Post-Login Entry

CockpitPath v0.1 currently supports one aircraft implementation.

Do not create a large empty aircraft marketplace/library merely because multi-aircraft support is planned later.

Design a sensible v0.1 authenticated entry.

Preferred product logic:

If the user has active learning progress:

Sign in
→ Continue Learning / current aircraft context

If the user has no active progress:

Sign in
→ supported Aircraft Page / start-learning entry

The architecture must remain compatible with multiple aircraft later.

Explore how the shell can evolve into an aircraft library without forcing an unnecessary library screen in v0.1.

---

# Aircraft Entry

The supported aircraft identity should clearly communicate:

Boeing 737 MAX 8

iFly
Microsoft Flight Simulator 2024

Entry actions may include:

Start learning
Continue learning
Open aircraft

depending on state.

Do not use fictional progress values.

---

# Current Content Availability

There is currently no verified operational 737 learning content in production.

The design should therefore include an intentional content-unavailable / coming-soon state that still looks like a real product.

Do NOT solve this by inventing procedure steps.

Possible state concept:

Boeing 737 MAX 8
iFly · Microsoft Flight Simulator 2024

Learning content is being prepared and verified.

The empty state should not make the application feel broken.

---

# Relationship to Aircraft Page

Aircraft Page is already an approved design.

The new shell must make the transition into Aircraft Page natural.

Do not redesign Aircraft Page itself unless a tiny shell integration adjustment is needed.

Aircraft Page remains the primary aircraft learning hub.

---

# Responsive Priorities

Design at minimum:

## Desktop

1440px-class viewport.

## Narrow Desktop / Simulator Companion

Approximately 400–550px width.

The global shell must not consume too much space.

## iPad / Tablet

Touch-friendly.

## Mobile

Practical navigation and authentication.

Public homepage may stack vertically.

Do not assume the learning product itself becomes a simplified marketing mobile app.

---

# Visual Personality

CockpitPath should feel:

- precise
- calm
- focused
- technical
- aviation-specific
- modern
- trustworthy
- premium without being luxurious
- instructional without being academic

Avoid:

- playful gamification
- cartoon aviation
- glowing sci-fi cockpit interfaces
- generic SaaS dashboards
- excessive badges
- fake live telemetry
- fake aircraft status
- fake progress numbers

---

# Copy Tone

Copy should be:

- concise
- confident
- practical
- instructional
- aviation-aware

Avoid marketing language such as:

- Revolutionary
- AI-powered
- Supercharge
- Transform your journey
- Next-generation
- Ultimate platform

The product itself should provide credibility.

---

# Accuracy Rules

Do not fabricate aviation facts.

Do not invent:

- procedures
- cockpit control positions
- expected indications
- aircraft-system relationships
- supported version numbers
- verification dates
- procedure step counts

Design placeholder text must be clearly non-authoritative.

---

# Required Screens / States

Produce at minimum:

1. Public Homepage — desktop
2. Public Homepage — mobile
3. Public Header — desktop/mobile states
4. Sign In
5. Sign Up
6. Authenticated application shell
7. Authenticated entry with no progress
8. Authenticated entry with Continue Learning state
9. Supported aircraft / content-coming-soon state

Where useful, show the shell applied around one existing approved product screen without redesigning that screen.

---

# Interaction Requirements

Prototype or clearly demonstrate:

- Public header navigation
- Sign-in / sign-up entry
- Authenticated navigation
- Continue Learning
- Aircraft entry
- account access
- mobile menu
- transition from homepage to authenticated product

Do not prototype unrelated product functionality.

---

# Design Deliverable

Create one cohesive interactive design reference.

Preferred output location:

docs/design/screens/public-site-shell-v1/

Suggested files:

Public Site & Shell.dc.html
support.js

Create additional component .dc.html files only where they materially improve implementation clarity.

The design reference should be suitable for implementation by Codex afterward.

---

# Review Questions

The final design should make it easy to answer:

1. Does the homepage immediately explain CockpitPath?
2. Does it feel related to the existing Guide Mode design?
3. Does the website feel aviation-specific rather than generic SaaS?
4. Is the first supported aircraft clear?
5. Is the transition from public site to learning app obvious?
6. Does the authenticated shell stay out of the way of Guide Mode?
7. Does the v0.1 one-aircraft experience avoid an unnecessary empty library?
8. Can the shell expand naturally to multiple aircraft later?
9. Does the no-published-content state feel intentional rather than broken?
10. Is the experience strong on desktop, narrow simulator companion, iPad, and mobile?

---

# Constraints

Do not modify production application code.

Do not modify existing approved design references.

Do not implement the design.

This task is design only.

Return:

A. Design direction summary
B. Files created
C. Screens/states included
D. Navigation model
E. Post-login entry model
F. Responsive behavior
G. Relationship to existing approved CockpitPath designs
H. Important assumptions or unresolved design decisions