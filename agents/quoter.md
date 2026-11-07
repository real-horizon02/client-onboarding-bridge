# Quoter Agent

> **Stage:** 3 of 5  
> **Pipeline position:** `#bridge-spec` → `#bridge-quote`  
> **Trigger:** New human message posted in Slack `#bridge-spec`  
> **Output:** Quote package posted to Slack `#bridge-quote`

---

## Role

The Quoter Agent produces a **quote package** based on the confirmed specification. It applies the guidelines in `rate-card/pricing.md` to structure the quote — but it **never inserts actual prices or rates**. Final pricing is always set by the PM or account team after review.

---

## Responsibilities

| Responsibility | Description |
|----------------|-------------|
| Parse specification | Extract deliverables, scope, assumptions, open questions |
| Structure quote sections | Scope summary, deliverable breakdown, timeline estimate, pricing guidance |
| Apply rate card rules | Reference `rate-card/pricing.md` for category and structure guidance |
| Flag open questions | Carry forward any unresolved questions from the spec |
| Produce quote package | Consistent, PM-ready document |

---

## ⚠️ Pricing Rules

> **The Quoter Agent MUST NOT insert actual prices, rates, or cost estimates.**
>
> Pricing is the sole responsibility of the PM / account team.
> The agent produces **pricing structure guidance only** (e.g., "This engagement is likely a Time & Materials arrangement — PM to confirm rate").
>
> See [`rate-card/pricing.md`](../rate-card/pricing.md) for category definitions.

---

## Input

```
Platform: Slack
Channel: #bridge-spec (SLACK_SPEC_CHANNEL)
Format: Specification document from Spec-Writer Agent
Includes: Case ID, deliverables, scope, assumptions, open questions
```

---

## Output Template

Posted to Slack `#bridge-quote`:

```markdown
# Quote Package — Case #<CASE_ID>

**Client:** <Name / Company>
**Date:** <ISO 8601>
**Quote Version:** 1.0
**Status:** DRAFT — PM to finalise pricing

---

## 1. Scope Summary
<2–4 sentence summary of what is being quoted>

## 2. Deliverable Breakdown

| # | Deliverable | Complexity | Pricing Type | Notes |
|---|------------|------------|--------------|-------|
| 1 | | LOW/MED/HIGH | Fixed / T&M / Retainer | |

## 3. Timeline Guidance
- **Estimated Duration:** <range, e.g. "4–6 weeks"> ← PM to confirm
- **Key Milestones:**
  - Kickoff → <week>
  - Delivery → <week>
  - Review/Acceptance → <week>

> ⚠️ Timeline is indicative only. PM must validate before client delivery.

## 4. Pricing Guidance

**Category:** <from rate-card/pricing.md — e.g. "Standard Engagement / T&M">
**Pricing structure:** Time & Materials / Fixed Price / Retainer ← PM to select
**Rate:** [PM TO COMPLETE]
**Total estimate:** [PM TO COMPLETE]

## 5. Inclusions & Exclusions

### Included
- <item>

### Excluded (available as add-ons)
- <item>

## 6. Assumptions Carried Forward
- <from spec>

## 7. Open Questions (must resolve before client delivery)
- [ ] <question>

## 8. Next Steps
- PM to review and complete pricing fields
- PM to approve → triggers Demo-Builder
- PM to approve final package → triggers Telegram delivery

---
Case ID: <CASE_ID> | Quote v1.0 | Next stage → Demo-Builder
```

---

## Handoff

- **Automatic:** Posting to `#bridge-quote` triggers Switch Local Server → OpenCode → Demo-Builder Agent.
- **Manual override:** PM can add final pricing and type `/confirm-quote` to signal readiness before demo runs.

---

## Failure Behaviour

| Failure | Action |
|---------|--------|
| Spec missing deliverables | Post quote with `[SPEC INCOMPLETE — PM REVIEW]` banner |
| Open questions still unresolved | Carry forward to quote; flag prominently |
| PHOTON unavailable | Retry 3× with exponential backoff; alert in `#bridge-quote` |

---

## Configuration

Uses shared `.env`:
- `PHOTON_*` — LLM inference
- `SLACK_SPEC_CHANNEL` — reads from
- `SLACK_QUOTE_CHANNEL` — writes to
- `OPENCODE_MODEL` — model

---

## Prompt Guidance (for OpenCode)

1. **Never invent prices.** Use `[PM TO COMPLETE]` as the placeholder for all monetary fields.
2. **Complexity scoring** (LOW / MED / HIGH) is based on scope, not cost.
3. **Timeline ranges** are acceptable; point estimates are not — always express as a range.
4. **Carry forward all open questions** from the spec; do not silently drop them.
5. **Reference `rate-card/pricing.md`** for category classification only.

---

## Related

- Previous agent: [`agents/spec-writer.md`](spec-writer.md)
- Next agent: [`agents/demo-builder.md`](demo-builder.md)
- Pricing rules: [`rate-card/pricing.md`](../rate-card/pricing.md)
- Architecture: [`docs/architecture.md`](../docs/architecture.md)
