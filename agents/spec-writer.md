# Spec-Writer Agent

> **Stage:** 2 of 5  
> **Pipeline position:** `#bridge-intake` → `#bridge-spec`  
> **Trigger:** New human message posted in Slack `#bridge-intake`  
> **Output:** Detailed specification document posted to Slack `#bridge-spec`

---

## Role

The Spec-Writer Agent converts the structured intake summary into a **full project specification**. This document becomes the shared source of truth for the Quoter and Demo-Builder agents, and is the primary artefact the PM reviews for scope accuracy.

---

## Responsibilities

| Responsibility | Description |
|----------------|-------------|
| Expand intake summary | Turn bullet points into detailed requirements |
| Define scope | Explicit in-scope and out-of-scope statements |
| Identify deliverables | List concrete, measurable outputs |
| State assumptions | Document what is being assumed (must be validated with client) |
| Surface open questions | List questions that require client or PM input before quoting |
| Produce structured spec | Consistent markdown document |

---

## Input

```
Platform: Slack
Channel: #bridge-intake (SLACK_INTAKE_CHANNEL)
Format: Structured intake summary from Intake Agent
Includes: Case ID, stated need, urgency, missing info
```

---

## Output Template

Posted to Slack `#bridge-spec` as a thread or message:

```markdown
# Specification — Case #<CASE_ID>

**Client:** <Name / Company>
**Date:** <ISO 8601>
**Spec Version:** 1.0
**Status:** DRAFT — Awaiting PM Review

---

## 1. Objectives
<What the client wants to achieve. 2–5 bullet points.>

## 2. Scope

### In Scope
- <item>
- <item>

### Out of Scope
- <item>
- <item>

## 3. Deliverables
| # | Deliverable | Description | Acceptance Criteria |
|---|------------|-------------|---------------------|
| 1 | | | |

## 4. Assumptions
- <assumption> ← *must be validated with client*
- <assumption>

## 5. Open Questions
- [ ] <question for client or PM>
- [ ] <question>

## 6. Technical Notes
<Any technical constraints, integrations, or platform requirements>

## 7. Next Steps
- PM to review this spec
- Resolve open questions before quoting
- Quoter Agent will generate quote once spec is confirmed

---
Case ID: <CASE_ID> | Spec v1.0 | Next stage → Quoter
```

---

## Handoff

- **Automatic:** Posting to `#bridge-spec` triggers Switch Local Server → OpenCode → Quoter Agent.
- **Manual override:** A team member can edit the spec in thread and type `/confirm-spec` to signal readiness if they want to review before Quoter runs.

---

## Failure Behaviour

| Failure | Action |
|---------|--------|
| Intake summary missing key fields | Post spec with explicit `[MISSING]` markers; flag in Open Questions |
| PHOTON unavailable | Retry 3× with exponential backoff; alert in `#bridge-spec` |
| Spec generation exceeds token limit | Split into multiple messages; label `Part 1 / 2` etc. |

---

## Configuration

Uses shared `.env`:
- `PHOTON_*` — LLM inference
- `SLACK_INTAKE_CHANNEL` — reads from
- `SLACK_SPEC_CHANNEL` — writes to
- `OPENCODE_MODEL` — model for spec generation

---

## Prompt Guidance (for OpenCode)

1. **Ground in the intake summary** — do not add scope not mentioned by the prospect.
2. **Be specific** — vague deliverables are worse than fewer deliverables.
3. **Explicitly mark assumptions** — every assumption that could affect price or timeline must be called out.
4. **Open questions are valuable** — it is better to flag uncertainty than to spec something incorrectly.
5. **Do not set timelines or prices** — those belong to the Quoter.

---

## Related

- Previous agent: [`agents/intake.md`](intake.md)
- Next agent: [`agents/quoter.md`](quoter.md)
- Architecture: [`docs/architecture.md`](../docs/architecture.md)
