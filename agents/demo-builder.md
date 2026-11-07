# Demo-Builder Agent

> **Stage:** 4 of 5  
> **Pipeline position:** `#bridge-quote` → `#bridge-demo` → `#bridge-approvals`  
> **Trigger:** New human message posted in Slack `#bridge-quote`  
> **Output:** Demo artefact posted to `#bridge-demo`; approval request posted to `#bridge-approvals`

---

## Role

The Demo-Builder Agent is the **final automated agent** in the pipeline. It takes the quote package and constructs a **tailored demo script and talking-points document** that the sales team (or the bridge itself) can use to present the solution to the prospect.

After completing the demo artefact, it triggers the **PM approval gate** — no Telegram delivery happens without PM sign-off.

---

## Responsibilities

| Responsibility | Description |
|----------------|-------------|
| Parse quote package | Extract scope, deliverables, timeline guidance, client context |
| Build demo agenda | Structured walkthrough aligned to the prospect's stated need |
| Write talking points | Per-deliverable talking points, benefit statements |
| Identify feature highlights | 3–5 key features most relevant to this prospect |
| Write CTA | Clear call-to-action for the prospect at demo end |
| Post to `#bridge-demo` | Formatted demo artefact |
| Trigger approval gate | Posts approval request to `#bridge-approvals` mentioning PM |

---

## Input

```
Platform: Slack
Channel: #bridge-quote (SLACK_QUOTE_CHANNEL)
Format: Quote package from Quoter Agent
Includes: Case ID, deliverables, scope, timeline guidance, client context
```

---

## Output 1 — Demo Artefact (to `#bridge-demo`)

```markdown
# Demo Script — Case #<CASE_ID>

**Client:** <Name / Company>
**Date:** <ISO 8601>
**Presenter:** [TEAM TO ASSIGN]

---

## Demo Agenda (~30 minutes)

| # | Section | Duration | Owner |
|---|---------|----------|-------|
| 1 | Welcome & Agenda | 2 min | Presenter |
| 2 | Understanding Your Need | 5 min | Presenter |
| 3 | Solution Overview | 5 min | Presenter |
| 4 | Live Walkthrough | 10 min | Presenter |
| 5 | Q&A | 5 min | Presenter |
| 6 | Next Steps & CTA | 3 min | Presenter |

---

## Section 2 — Understanding Your Need (Talking Points)

Based on the intake, the client's primary need is:
> <stated need from intake>

Open with:
- "We understand you're looking to [restate need in client's language]..."
- "You mentioned [urgency signal] — that's a priority for us too."

---

## Section 3 — Solution Overview (Talking Points)

Key message: **We solve [problem] by [approach].**

- Benefit 1: <aligned to deliverable 1>
- Benefit 2: <aligned to deliverable 2>
- Benefit 3: <aligned to deliverable 3>

---

## Section 4 — Live Walkthrough (Feature Highlights)

### Feature 1: <name>
*Why it matters to this client:* <1 sentence>
*Demo step:* <what to show>

### Feature 2: <name>
*Why it matters to this client:* <1 sentence>
*Demo step:* <what to show>

### Feature 3: <name>
*Why it matters to this client:* <1 sentence>
*Demo step:* <what to show>

---

## Section 6 — CTA

"Based on our conversation today, the logical next step is [specific CTA].
We've prepared a quote — shall we walk through it now?"

**Primary CTA:** [PM TO CONFIRM]
**Fallback CTA:** "Can we schedule a follow-up call this week?"

---

## Objection Handling Cheat Sheet

| Objection | Response |
|-----------|----------|
| "Too expensive" | "Let's look at a phased approach..." |
| "Too complex to implement" | "Our onboarding team handles setup end-to-end..." |
| "Need to involve more stakeholders" | "We can prepare a one-pager for your team..." |

---
Case ID: <CASE_ID> | Demo v1.0 | Next → PM Approval
```

---

## Output 2 — Approval Request (to `#bridge-approvals`)

```
🔔 *Approval Required* — Case #<CASE_ID>

Client: <Name / Company>
Stage: Demo Ready

📋 Spec: <link to #bridge-spec message>
💰 Quote: <link to #bridge-quote message>
🎬 Demo: <link to #bridge-demo message>

@<PM_SLACK_USER> — please review and react:
  ✅ to approve → triggers Telegram delivery
  ❌ to reject → opens revision loop

Deadline: <timestamp + APPROVAL_TIMEOUT_HOURS>
```

---

## Handoff

- After posting to `#bridge-demo`, the Demo-Builder immediately posts the approval request to `#bridge-approvals`.
- The pipeline pauses here — no further automation until PM responds.
- See [`docs/approval-policy.md`](../docs/approval-policy.md) for timeout and escalation rules.

---

## Failure Behaviour

| Failure | Action |
|---------|--------|
| Quote package incomplete | Build demo with `[DATA MISSING]` markers; still post approval request |
| PHOTON unavailable | Retry 3× with exponential backoff; alert in `#bridge-demo` |
| PM Slack user not found | Post approval request without mention; alert in `#bridge-approvals` |

---

## Configuration

Uses shared `.env`:
- `PHOTON_*` — LLM inference
- `SLACK_QUOTE_CHANNEL` — reads from
- `SLACK_DEMO_CHANNEL` — writes demo artefact to
- `SLACK_APPROVALS_CHANNEL` — writes approval request to
- `PM_SLACK_USER_ID` — mentioned in approval request
- `APPROVAL_TIMEOUT_HOURS` — deadline calculation
- `OPENCODE_MODEL` — model

---

## Prompt Guidance (for OpenCode)

1. **Tailor every section to this client** — generic demos are less likely to be approved.
2. **Use the prospect's own language** — mirror terms from the intake summary.
3. **CTA must be specific** — "Let us know what you think" is not a CTA.
4. **Never include pricing in the demo script** — that is the PM's job in the quote.
5. **Keep the demo agenda realistic** — 30 minutes max unless brief specifies otherwise.

---

## Related

- Previous agent: [`agents/quoter.md`](quoter.md)
- Approval policy: [`docs/approval-policy.md`](../docs/approval-policy.md)
- Architecture: [`docs/architecture.md`](../docs/architecture.md)
