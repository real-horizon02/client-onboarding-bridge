# Intake Agent

> **Stage:** 1 of 5  
> **Pipeline position:** Telegram → `#bridge-intake`  
> **Trigger:** New human message in Telegram `bridge-intake` room  
> **Output:** Structured intake summary posted to Slack `#bridge-intake`

---

## Role

The Intake Agent is the **first point of contact** in the pipeline. It transforms a free-form prospect message from Telegram into a clean, structured summary that the rest of the pipeline can consume.

It does **not** make business decisions, generate quotes, or promise timelines. Its only job is to listen, understand, and summarise.

---

## Responsibilities

| Responsibility | Description |
|----------------|-------------|
| Parse prospect message | Extract key entities: name, company, need, timeline, budget hints |
| Classify urgency | Rate urgency: `LOW` / `MEDIUM` / `HIGH` based on message signals |
| Identify ambiguities | Flag missing information the team may need to follow up on |
| Format summary | Produce a structured Slack message in a consistent template |
| Pass to next stage | Posting to `#bridge-intake` automatically triggers Spec-Writer |

---

## Input

```
Platform: Telegram
Room: bridge-intake (TELEGRAM_INTAKE_CHAT_ID)
Format: Free-form text from prospect
```

---

## Output Template

The Intake Agent posts the following to Slack `#bridge-intake`:

```
🟢 *New Client Inquiry — Case #<CASE_ID>*

*Contact:* <Name or "Unknown"> | <Company or "Unknown">
*Source:* Telegram
*Received:* <ISO 8601 timestamp>

*Stated Need:*
<1–3 sentence summary of what the prospect wants>

*Urgency:* <LOW | MEDIUM | HIGH>
*Urgency signals:* <brief note on why — e.g., "mentions deadline next month">

*Key Details:*
- <bullet>
- <bullet>

*Missing / Ambiguous:*
- <what's unclear and may need follow-up>

*Raw Message (excerpt):*
> <first 280 chars of original Telegram message>

---
Case ID: <CASE_ID> | Next stage → Spec-Writer
```

---

## Handoff

- **Automatic:** Posting to `#bridge-intake` triggers Switch Local Server → OpenCode → Spec-Writer Agent.
- **Manual override:** A team member can type `/skip-spec` in the thread to bypass specification and go directly to Quoter (requires PM approval).

---

## Failure Behaviour

| Failure | Action |
|---------|--------|
| PHOTON unavailable | Retry 3× with exponential backoff; alert team in `#bridge-intake` if all fail |
| Telegram message is empty / sticker / media only | Post to `#bridge-intake`: "⚠️ Non-text message received — manual review needed" |
| Case ID collision | Append timestamp suffix; log warning |

---

## Configuration

No agent-specific config beyond shared `.env`. The Intake Agent uses:
- `PHOTON_*` — LLM inference
- `TELEGRAM_INTAKE_CHAT_ID` — room to listen on
- `SLACK_INTAKE_CHANNEL` — room to post to
- `OPENCODE_MODEL` — model for extraction

---

## Prompt Guidance (for OpenCode)

The agent should be prompted to:
1. **Extract only what is stated** — do not infer company size, budget, or technical maturity beyond what the prospect explicitly says.
2. **Never fabricate contact information.**
3. **Flag ambiguity explicitly** rather than guessing.
4. **Keep the summary under 400 words.**
5. **Never include PII in the case ID** — use an auto-generated UUID or sequence number.

---

## Related

- Architecture: [`docs/architecture.md`](../docs/architecture.md)
- Next agent: [`agents/spec-writer.md`](spec-writer.md)
- Room mapping: [`docs/room-and-agent-mapping.md`](../docs/room-and-agent-mapping.md)
