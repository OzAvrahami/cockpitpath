# CockpitPath — Pricing & Access Strategy

**Document Status:** Draft v0.1
**Product:** CockpitPath
**Last Updated:** 2026-08-24

## 1. Purpose

This document defines CockpitPath's early product principles for pricing, access control, and future monetization.

It does **not** define final prices.

The immediate objective is to ensure that:

* v0.1 can launch as a free beta
* Product value can be validated before monetization
* The architecture remains ready for future paid access
* Billing complexity does not delay the core learning product
* Content access can evolve without restructuring the entire platform

---

## 2. Current Decision

CockpitPath v0.1 Beta should launch with released beta content available for free.

No payment method is required to use the initial beta experience.

The beta should focus on answering:

> Is CockpitPath useful enough that simulator users want to keep using it?

before answering:

> What is the optimal price?

---

## 3. Why v0.1 Is Free

The first release still needs to validate several important assumptions:

* Whether users prefer CockpitPath over video-based learning
* Whether Guide Mode works well beside the simulator
* Whether users return and resume learning
* Whether Cockpit Explorer adds meaningful value
* Whether Aircraft Systems content is useful
* Which parts of the product users value most
* How much content users expect per aircraft
* How frequently users use CockpitPath

Charging before understanding these behaviors would make early product learning more difficult.

---

## 4. Monetization Principle

CockpitPath should monetize **ongoing learning value**, not artificial friction.

Paid access should eventually represent meaningful value such as:

* Complete aircraft learning journeys
* Broader procedure libraries
* Full cockpit coverage
* Deeper Aircraft Systems content
* Additional aircraft
* Continued verified content maintenance

CockpitPath should not create unnecessary limitations merely to manufacture a paywall.

---

## 5. Architecture Requirement

Although billing is out of scope for v0.1, CockpitPath must be **entitlement-ready**.

The product should not assume:

```text
authenticated user = access to everything forever
```

Instead, content access should eventually be capable of evaluating:

```text
User
+
Content
+
Entitlement
=
Access decision
```

The exact technical implementation will be defined during architecture work.

---

## 6. Initial Access Levels

The content model should be capable of representing future access categories such as:

### FREE

Content available without a paid entitlement.

### PRO

Content available through a CockpitPath subscription.

### PACK

Content available through ownership of a specific aircraft or content pack.

These categories define future capability only.

They do not imply that all three must be offered commercially.

---

## 7. Beta Access

During v0.1 Beta, released content may effectively behave as:

`FREE`

even if the content model already supports an entitlement classification.

This allows CockpitPath to validate the access architecture without implementing billing.

---

## 8. Public vs Authenticated Access

Access and authentication are separate concerns.

CockpitPath may eventually support:

### Public Content

Accessible without signing in.

Examples may include:

* Landing pages
* Product previews
* Limited aircraft information
* Selected learning samples

### Authenticated Free Content

Requires an account but no payment.

Benefits may include:

* Saved progress
* Resume
* Cross-device learning state

### Paid Content

Requires both authentication and the appropriate entitlement.

The exact v0.1 public-content boundary will be decided during access-control architecture.

---

## 9. Future Subscription Direction

A subscription is a plausible long-term business model because CockpitPath may provide recurring value through:

* New aircraft
* New procedures
* Content updates
* Simulator compatibility updates
* System learning
* Cockpit coverage
* Verification and maintenance

A future subscription may include:

`CockpitPath Pro`

However, the subscription model is not locked at this stage.

---

## 10. Potential Subscription Structure

One possible future structure is:

### Free

A meaningful product sample.

Potential examples:

* Selected procedures
* Limited Cockpit Explorer content
* Selected Aircraft Systems learning
* Limited journey access

### Pro

Potentially includes:

* Complete journeys
* Full procedures
* Full supported Cockpit Explorer content
* Aircraft Systems
* Multiple supported aircraft
* Future premium learning features

This is directional only.

The exact boundary between Free and Pro should be determined after product usage is understood.

---

## 11. Aircraft Packs

CockpitPath may later evaluate one-time Aircraft Packs.

Example:

`Boeing 737 MAX Learning Pack`

An Aircraft Pack could potentially unlock:

* Journeys
* Procedures
* Cockpit Explorer coverage
* Systems learning

for one aircraft implementation.

Aircraft Packs may be:

* An alternative to subscription
* A supplement to subscription
* Rejected entirely if they create unnecessary complexity

No decision is required during v0.1.

---

## 12. Why Packs Remain Possible

Some simulator users prefer buying aircraft-related products individually rather than maintaining another subscription.

CockpitPath's content model should therefore avoid making aircraft-specific entitlements impossible.

This is an architectural consideration, not a commitment to sell packs.

---

## 13. Entitlement Granularity

Avoid extremely granular monetization.

CockpitPath should not create payment rules for individual:

* Procedure steps
* Cockpit switches
* Images
* Concepts
* Small learning sections

Access should generally operate at meaningful product boundaries.

Examples:

* Journey
* Aircraft content bundle
* Product tier

The technical model may support lower-level inheritance, but the customer experience should remain understandable.

---

## 14. Entitlement Inheritance

Future access rules should allow content to inherit access from a parent entity.

Example:

```text
Aircraft Pack
    ↓
Journey
    ↓
Procedure
    ↓
Procedure Step
```

If a user has access to the journey, CockpitPath should not require separate step-level entitlement records.

This should be considered when designing the content and access-control models.

---

## 15. Free Content Must Be Useful

If CockpitPath later uses a freemium model, Free should demonstrate the real product.

It should not be a nearly empty shell.

A free user should be able to experience:

* Real Guide Mode
* Real cockpit imagery
* Real visual guidance
* Real CockpitPath learning content

The free experience should clearly communicate why upgrading might be valuable.

---

## 16. Avoid Aggressive Paywalls

CockpitPath should avoid disruptive upgrade prompts during active simulator use.

For example, Guide Mode should not interrupt an active procedure unexpectedly with repeated subscription messaging.

Access restrictions should be communicated before the user begins unavailable content whenever possible.

---

## 17. Locked Content Behavior

If content later requires an entitlement, the interface should clearly communicate:

* What the content is
* Why it is unavailable
* Which access level unlocks it

Do not allow users to begin a journey and unexpectedly encounter a paywall halfway through unless this was explicitly communicated before starting.

---

## 18. Journey Integrity

A critical future pricing principle is:

> Do not break a learning journey into confusing monetization fragments.

If a complete journey is marketed as available to a user, all required steps should remain accessible.

Optional premium supporting material may differ, but the core procedure flow should remain coherent.

---

## 19. Existing Progress

If a user's entitlement changes in the future, CockpitPath should preserve their historical learning progress.

Loss of content access should not mean deletion of:

* Progress records
* Completion history
* Last learning location

If access is restored later, previous progress should still exist.

---

## 20. Entitlements and Progress

Progress data and entitlement data must remain separate.

Conceptually:

```text
Progress answers:
What has the user learned or completed?

Entitlement answers:
What content may the user currently access?
```

One should not overwrite the other.

---

## 21. Beta-to-Paid Transition

If CockpitPath later transitions from free beta to paid access, existing beta users should receive clear communication.

Possible strategies may include:

* Temporary grandfathered access
* Founding-user discount
* Trial period
* Continued access to previously released beta content
* Direct transition to Free tier

No strategy is locked now.

The transition should respect users who helped validate the beta.

---

## 22. Pricing Research

Final pricing should be informed by:

* Beta user feedback
* Engagement
* Completion behavior
* Repeat usage
* Aircraft demand
* Content-production cost
* Competitive products
* Willingness-to-pay research

Pricing should not be chosen only by comparing competitor subscription numbers.

---

## 23. Potential Pricing Dimensions

Future pricing evaluation may consider:

### Monthly Subscription

Simple entry point.

### Annual Subscription

May align better with long-term simulator hobby usage.

### Aircraft Pack

Potential one-time option.

### Free Trial

Potential evaluation path.

These options should be researched after v0.1 validation.

---

## 24. No Final Price Yet

No specific monthly or annual price is considered part of the CockpitPath product specification at this stage.

Any prices discussed during product exploration are provisional examples only.

They must not appear in production product copy or implementation constants unless formally approved later.

---

## 25. Billing Provider

CockpitPath should not select or integrate a payment provider during Product Foundation unless required for another architectural decision.

Possible future providers may be evaluated during monetization implementation.

The architecture should avoid unnecessary coupling to a specific billing vendor.

---

## 26. Billing Data

When billing is eventually introduced, CockpitPath should not attempt to become the source of truth for sensitive payment-card information.

Payment information should be handled by an appropriate external payment provider.

CockpitPath should primarily retain references and entitlement-related state required by the product.

---

## 27. Billing vs Entitlement

Future architecture should treat:

**Billing**

and:

**Entitlement**

as related but separate concepts.

Example:

```text
Payment Provider
      ↓
Subscription
      ↓
Entitlement
      ↓
CockpitPath Content Access
```

This separation allows future access sources beyond subscriptions.

Examples may include:

* Promotional access
* Beta access
* Lifetime access
* Aircraft Pack
* Internal testing
* Complimentary access

---

## 28. Access Sources

An entitlement may eventually originate from:

* Free product policy
* Subscription
* Aircraft Pack purchase
* Promotional grant
* Beta grant
* Administrative grant

The architecture should not assume that every entitlement corresponds directly to one payment transaction.

---

## 29. Admin Overrides

Future internal administration may need the ability to grant or revoke content access for:

* Testing
* Support
* Beta users
* Reviewers
* Partners

This should not require modifying user progress.

A complete entitlement-admin interface is not required in v0.1.

---

## 30. Content Metadata

Future content may support metadata such as:

```text
access_tier: FREE
```

or equivalent structured access information.

However, avoid scattering pricing logic directly throughout content files or UI components.

Access decisions should be centralized.

---

## 31. UI Responsibility

The UI may display access state.

The UI must **not** be the security boundary.

Hiding a button is insufficient access control.

Protected content must eventually be enforced through the application or data-access layer.

This will be defined in the technical architecture.

---

## 32. Content Preview

Future paid content may provide previews.

Examples:

* Journey overview
* Procedure titles
* Selected first steps
* System introduction
* Cockpit Explorer sample

Preview behavior should be explicitly modeled rather than implemented through accidental partial data exposure.

---

## 33. Commercial Content Unit

The most natural commercial unit for CockpitPath is likely the **aircraft learning experience**, which combines:

* Journeys
* Procedures
* Cockpit Explorer
* Systems
* Concepts
* Media

The product should avoid presenting these interconnected areas as unrelated purchases unless future evidence strongly supports that model.

---

## 34. Multi-Aircraft Subscription Value

A subscription becomes increasingly compelling as CockpitPath supports more aircraft.

Potential recurring value may come from:

* New supported aircraft
* Expanded existing aircraft
* Updated simulator compatibility
* New systems learning
* New journeys
* Continuous content verification

Monetization should therefore follow content quality and breadth rather than precede them.

---

## 35. Content Maintenance

CockpitPath's future pricing should recognize that content requires ongoing maintenance.

Aircraft learning content may need updates due to:

* Add-on updates
* Simulator updates
* Procedure changes
* UI changes
* New verified information
* Screenshot replacement

CockpitPath is not simply selling static documents.

Maintained accuracy is part of the potential paid value.

---

## 36. Commercial Trust

Users paying for CockpitPath should be able to trust that:

* Content access is clear
* Billing terms are understandable
* Cancellation is straightforward
* Progress is not intentionally held hostage
* Paywalls do not appear unpredictably
* Paid content remains maintained

Commercial behavior should reinforce product trust.

---

## 37. Analytics Before Monetization

During free beta, CockpitPath should learn:

* How many users start journeys
* How many return
* How much of the journey they complete
* Which learning areas they use
* Whether they use multiple sessions
* Which features create repeat value

These signals are more useful initially than checkout optimization.

---

## 38. Monetization Readiness Gate

Active billing should not be introduced merely because the architecture supports it.

Before introducing paid access, CockpitPath should have evidence that:

1. Users understand the product.
2. Users complete meaningful learning sessions.
3. Users return.
4. Content quality is trustworthy.
5. There is demand for additional content.
6. The product can reliably manage access.
7. Support and billing operations are manageable.

---

## 39. v0.1 Requirements

For v0.1, this strategy requires only:

* Free beta access
* User authentication
* Content access abstraction
* Future entitlement-compatible data model
* No payment processing
* No checkout
* No subscription management
* No pricing page required for beta
* No billing-provider dependency

---

## 40. Explicitly Out of Scope for v0.1

Do not build:

* Stripe or other payment integration
* Subscription checkout
* Credit-card handling
* Billing portal
* Coupon system
* Invoice system
* Tax calculation
* Refund tooling
* Upgrade/downgrade flows
* Trial-expiration logic
* Complex entitlement administration
* Aircraft Pack checkout

unless the product strategy changes before implementation.

---

## 41. Architectural Rule

CockpitPath v0.1 should satisfy both of the following:

> Billing can be added later without rebuilding the content model.

and:

> Removing billing entirely would not make the core learning architecture unnecessarily complex.

This balance is important.

---

## 42. Current Commercial Position

CockpitPath's current commercial position is:

```text
v0.1 Beta
    ↓
Free access
    ↓
Validate recurring learning value
    ↓
Understand content demand
    ↓
Research willingness to pay
    ↓
Choose monetization model
    ↓
Introduce paid access only when justified
```

---

## Status

**CockpitPath Pricing & Access Strategy v0.1**

Free beta strategy established.

Future monetization remains intentionally flexible while the product and data model remain entitlement-ready.
