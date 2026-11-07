# Pricing Policy

> **⚠️ This document defines pricing STRUCTURE and CATEGORIES only.**  
> **Actual rates and prices are set exclusively by the PM / account team and are NEVER stored in this repository.**

---

## 1. Purpose

This document gives the Quoter Agent the structural framework to categorise engagements and suggest a pricing model — without containing or inventing any actual monetary values.

All fields marked `[PM TO COMPLETE]` in quotes must be filled by a human before client delivery.

---

## 2. Engagement Categories

The Quoter Agent uses these categories to classify an engagement based on the specification.

| Category | Typical Characteristics | Suggested Pricing Model |
|----------|------------------------|------------------------|
| **Discovery** | Short duration, research-focused, low deliverable count | Fixed Price |
| **Standard Engagement** | Defined scope, 2–8 week delivery, medium complexity | Fixed Price or T&M |
| **Complex Engagement** | Multi-phase, >8 weeks, high technical complexity | Time & Materials |
| **Retainer** | Ongoing support, recurring deliverables | Monthly Retainer |
| **Custom / Bespoke** | Unique requirements not fitting above categories | PM determines |

---

## 3. Complexity Scoring

The Quoter Agent may assign a complexity score to each deliverable:

| Score | Label | Indicators |
|-------|-------|-----------|
| 1 | LOW | Templated output, minimal customisation, clear requirements |
| 2 | MEDIUM | Some customisation, moderate unknowns, standard tooling |
| 3 | HIGH | High customisation, significant unknowns, novel requirements |

> Complexity scores inform structure only. They do not map to any price point without PM input.

---

## 4. Pricing Models

### 4a — Fixed Price
- Scope is well-defined and stable.
- Risk is absorbed by the delivery team.
- Change requests trigger a change order.
- **Quote field:** `Fixed Price: [PM TO COMPLETE]`

### 4b — Time & Materials (T&M)
- Scope may evolve.
- Client pays for actual time spent.
- Requires agreed rate card (held by PM — not in this repo).
- **Quote fields:**
  - `Estimated hours: [PM TO COMPLETE]`
  - `Rate: [PM TO COMPLETE]`
  - `Estimated total: [PM TO COMPLETE]`

### 4c — Monthly Retainer
- Ongoing engagement with defined monthly deliverables.
- **Quote field:** `Monthly retainer: [PM TO COMPLETE]`

---

## 5. Add-Ons and Extras

The Quoter Agent may list common add-ons as options. These are structural categories — no prices are listed here:

| Add-On | Description | Pricing Type |
|--------|------------|--------------|
| Priority support | Dedicated SLA-backed support | Retainer |
| Extended warranty | Coverage beyond standard period | Fixed |
| Training & onboarding | Live or async team training | Fixed or T&M |
| Documentation package | Full written documentation | Fixed |
| Integration work | Third-party system integration | T&M |

---

## 6. What the Quoter Agent Must NOT Do

- ❌ Insert any numeric price, rate, or cost estimate
- ❌ Reference specific currency amounts
- ❌ Imply a price range (e.g., "typically \$5k–\$10k")
- ❌ Compare against competitor pricing
- ❌ Guarantee delivery timelines without PM confirmation

---

## 7. Rate Card Management

The actual rate card (hourly rates, retainer amounts, fixed-price tiers) is maintained by the PM/account team in a **separate, non-committed document** (e.g., a password-protected spreadsheet or CRM).

It is never stored in this repository.

---

## 8. Quote Review Sign-Off

Before any quote leaves `#bridge-quote` and proceeds to the demo stage, the PM should confirm:

- [ ] Category is correct
- [ ] Pricing model is appropriate
- [ ] All `[PM TO COMPLETE]` fields are filled
- [ ] Timeline ranges are validated
- [ ] Open questions are resolved or explicitly deferred

Type `/confirm-quote` in the `#bridge-quote` thread to signal readiness.
