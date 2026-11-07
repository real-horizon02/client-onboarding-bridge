# Client Onboarding Bridge — System Architecture

> **Document status:** Living document. Update after every infrastructure change.

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CLIENT ONBOARDING BRIDGE                             │
│                                                                             │
│  ┌────────────┐      ┌──────────────────────┐      ┌─────────────────────┐ │
│  │  Telegram  │◄────►│  Switch Local Server │◄────►│    Slack Workspace  │ │
│  │  Bot API   │      │   (Message Bus)      │      │   (bridge-* rooms)  │ │
│  └────────────┘      └──────────┬───────────┘      └──────────┬──────────┘ │
│                                 │                              │             │
│                      ┌──────────▼───────────┐                 │             │
│                      │   OpenCode Runtime   │◄────────────────┘             │
│                      │  (Agent Orchestrator)│                               │
│                      └──────────┬───────────┘                               │
│                                 │                                           │
│                      ┌──────────▼───────────┐                               │
│                      │  PHOTON Local        │                               │
│                      │  Controller (LLM)    │                               │
│                      └──────────────────────┘                               │
│                                                                             │
│  Agent Pipeline:                                                            │
│  [Intake] → [Spec-Writer] → [Quoter] → [Demo-Builder] → [PM Approval]      │
│                                                                ↓            │
│                                                      Telegram Delivery      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Descriptions

### 2.1 Switch Local Server
- **Role:** Central message bus and webhook relay.
- **Responsibilities:**
  - Receives inbound webhooks from Telegram and Slack.
  - Routes events to the correct OpenCode agent handler based on room/channel ID.
  - Emits outbound messages back to Telegram or Slack after agent processing.
  - Maintains an event log for auditability.
- **Deployment:** Runs locally on the host machine (default port configured via `SWITCH_SERVER_PORT`).
- **Config keys:** `SWITCH_SERVER_HOST`, `SWITCH_SERVER_PORT`, `SWITCH_SERVER_API_KEY`.

### 2.2 OpenCode
- **Role:** Agent orchestration engine.
- **Responsibilities:**
  - Loads agent definitions from `agents/` directory.
  - Manages the state machine (which stage the onboarding is in).
  - Calls PHOTON for LLM completions.
  - Posts results to the appropriate Slack bridge room.
  - Triggers next-stage agents automatically on completion.
- **Config keys:** `OPENCODE_API_ENDPOINT`, `OPENCODE_API_KEY`, `OPENCODE_MODEL`.

### 2.3 PHOTON Local Controller
- **Role:** Local LLM inference layer.
- **Responsibilities:**
  - Serves model completions to OpenCode via its local API.
  - Keeps all prospect data on-premises (no external LLM calls unless explicitly configured).
  - Manages model loading, GPU/CPU allocation, and request queuing.
- **Config keys:** `PHOTON_HOST`, `PHOTON_PORT`, `PHOTON_AUTH_TOKEN`.

### 2.4 Telegram Bot
- **Role:** Prospect-facing communication channel.
- **Responsibilities:**
  - Receives initial prospect inquiries in the `bridge-intake` Telegram group/channel.
  - Delivers the final approved onboarding package back to the prospect.
  - All messages pass through Switch Local Server; the bot never calls agents directly.
- **Config keys:** `TELEGRAM_BOT_TOKEN`, `TELEGRAM_INTAKE_CHAT_ID`, `TELEGRAM_DELIVERY_CHAT_ID`, `TELEGRAM_WEBHOOK_SECRET`.

### 2.5 Slack Workspace (bridge-* rooms)
- **Role:** Internal team collaboration and approval platform.
- **Responsibilities:**
  - Each pipeline stage has a dedicated channel (`bridge-intake`, `bridge-spec`, `bridge-quote`, `bridge-demo`).
  - `bridge-approvals` channel receives PM approval requests.
  - Team members can read, comment, and override agent outputs at any stage.
- **Config keys:** `SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET`, `SLACK_*_CHANNEL`.

---

## 3. Data Flow — Step by Step

```
Step 1 ─ INTAKE
  Prospect sends message → Telegram bridge-intake room
  → Telegram webhook → Switch Local Server
  → Switch routes to OpenCode [Intake Agent]
  → Intake Agent structures the data (via PHOTON)
  → Intake Agent posts summary → Slack #bridge-intake

Step 2 ─ SPECIFICATION
  Slack #bridge-intake message event → Switch Local Server
  → OpenCode [Spec-Writer Agent] triggered
  → Spec-Writer generates requirements document (via PHOTON)
  → Posts spec → Slack #bridge-spec

Step 3 ─ QUOTE
  Slack #bridge-spec message event → Switch Local Server
  → OpenCode [Quoter Agent] triggered
  → Quoter assembles quote package using rate-card/pricing.md rules (via PHOTON)
  → Posts quote → Slack #bridge-quote

Step 4 ─ DEMO
  Slack #bridge-quote message event → Switch Local Server
  → OpenCode [Demo-Builder Agent] triggered
  → Demo-Builder creates demo script / artefact (via PHOTON)
  → Posts demo → Slack #bridge-demo

Step 5 ─ PM APPROVAL REQUEST
  Demo-Builder completion → Switch Local Server
  → Posts approval request → Slack #bridge-approvals (mentions PM)
  → PM has APPROVAL_TIMEOUT_HOURS to respond

Step 6a ─ APPROVED
  PM reacts ✅ or types /approve in #bridge-approvals
  → Slack event → Switch Local Server
  → Switch triggers Telegram delivery
  → Prospect receives approved onboarding package in Telegram

Step 6b ─ REJECTED
  PM reacts ❌ or types /reject [reason] in #bridge-approvals
  → Slack event → Switch Local Server
  → Rejection reason logged; stage re-queued or case closed per approval-policy.md
  → Optional: Prospect notified of delay via Telegram

Step 7 ─ TIMEOUT
  If no PM response within APPROVAL_TIMEOUT_HOURS
  → Switch sends reminder to PM
  → After second timeout → escalation per approval-policy.md
```

---

## 4. Agent State Machine

```
         ┌──────────┐
  START ─►│  INTAKE  │
         └────┬─────┘
              │ intake_complete
         ┌────▼──────────┐
         │  SPEC-WRITER  │
         └────┬──────────┘
              │ spec_approved (auto)
         ┌────▼──────┐
         │   QUOTER  │
         └────┬──────┘
              │ quote_ready (auto)
         ┌────▼──────────────┐
         │   DEMO-BUILDER    │
         └────┬──────────────┘
              │ demo_ready (auto)
         ┌────▼───────────┐
         │  AWAITING_PM   │
         └────┬───────────┘
         ┌────┴────┐
         ▼         ▼
    APPROVED    REJECTED
         │         │
    Telegram   Re-queue /
    Delivery    Close
```

---

## 5. Security Principles

1. **No credentials in code** — all secrets via `.env` (`.gitignore`'d).
2. **Local-first** — PHOTON keeps prospect data on-premises.
3. **Webhook verification** — Telegram webhook secret + Slack signing secret validated on every inbound request.
4. **Principle of least privilege** — Each agent has only the permissions it needs in Slack (post to its own channel).
5. **Audit trail** — Switch Local Server logs all events with timestamps; logs are never committed.

---

## 6. Scalability Notes

- Switch Local Server is single-node by design for local deployments; horizontal scaling requires a managed queue (e.g., Redis Streams) in production.
- PHOTON can be pointed at a remote GPU cluster by changing `PHOTON_HOST`/`PHOTON_PORT` without code changes.
- Slack channels support threading; multiple onboarding cases run in parallel using thread replies.

---

## 7. Related Documents

| Document | Location |
|----------|----------|
| Room & Agent Mapping | [`docs/room-and-agent-mapping.md`](room-and-agent-mapping.md) |
| Approval Policy | [`docs/approval-policy.md`](approval-policy.md) |
| Testing Checklist | [`docs/testing-checklist.md`](testing-checklist.md) |
| Troubleshooting | [`docs/troubleshooting.md`](troubleshooting.md) |
| Setup Guide | [`scripts/setup.md`](../scripts/setup.md) |
