# Room & Agent Mapping

> Maps every Telegram room, Slack channel, and bridge room to its owning agent, trigger, and output.

---

## 1. Telegram Rooms

| Room / Chat | Purpose | Direction | Handled By |
|-------------|---------|-----------|------------|
| `bridge-intake` (Telegram) | Prospect submits initial inquiry | Inbound → Switch | Intake Agent |
| Prospect DM / Group | Final approved delivery | Outbound ← Switch | Bridge delivery handler |

**How to find the Telegram chat ID:**
1. Add your bot to the room.
2. Send a message.
3. Call `https://api.telegram.org/bot<TOKEN>/getUpdates` — look for `"chat":{"id": ...}`.
4. Set the value as `TELEGRAM_INTAKE_CHAT_ID` or `TELEGRAM_DELIVERY_CHAT_ID` in `.env`.

---

## 2. Slack Channels (bridge-* rooms)

| Channel | `SLACK_*_CHANNEL` env key | Owning Agent | Trigger | Output |
|---------|--------------------------|--------------|---------|--------|
| `#bridge-intake` | `SLACK_INTAKE_CHANNEL` | Intake Agent | New Telegram message received | Structured intake summary (name, company, need, urgency) |
| `#bridge-spec` | `SLACK_SPEC_CHANNEL` | Spec-Writer Agent | Message posted in `#bridge-intake` | Full specification document |
| `#bridge-quote` | `SLACK_QUOTE_CHANNEL` | Quoter Agent | Message posted in `#bridge-spec` | Quote package (scope, timeline, pricing guidance) |
| `#bridge-demo` | `SLACK_DEMO_CHANNEL` | Demo-Builder Agent | Message posted in `#bridge-quote` | Demo script / walkthrough artefact |
| `#bridge-approvals` | `SLACK_APPROVALS_CHANNEL` | PM (human) | Demo ready in `#bridge-demo` | ✅ Approved or ❌ Rejected with reason |

---

## 3. Agent-to-Room Matrix

```
Agent            Reads From            Writes To
─────────────────────────────────────────────────────────────────
Intake           Telegram bridge-intake  Slack #bridge-intake
Spec-Writer      Slack #bridge-intake    Slack #bridge-spec
Quoter           Slack #bridge-spec      Slack #bridge-quote
Demo-Builder     Slack #bridge-quote     Slack #bridge-demo
                                         + Slack #bridge-approvals (PM ping)
Bridge Delivery  Slack #bridge-approvals Telegram (prospect)
```

---

## 4. Switch Local Server Route Table

Switch Local Server must be configured with the following routes:

| Inbound Event | Source | Route To | Notes |
|---------------|--------|----------|-------|
| Telegram message in intake chat | Telegram webhook | OpenCode → Intake Agent | Filter by `TELEGRAM_INTAKE_CHAT_ID` |
| Slack message in `#bridge-intake` | Slack Events API | OpenCode → Spec-Writer | Filter by channel ID; skip bot messages |
| Slack message in `#bridge-spec` | Slack Events API | OpenCode → Quoter | Filter by channel ID; skip bot messages |
| Slack message in `#bridge-quote` | Slack Events API | OpenCode → Demo-Builder | Filter by channel ID; skip bot messages |
| Slack message in `#bridge-demo` | Slack Events API | OpenCode → Approval Notifier | Sends PM ping to `#bridge-approvals` |
| PM ✅ reaction / `/approve` in `#bridge-approvals` | Slack Events API | OpenCode → Telegram Delivery | Triggers final delivery |
| PM ❌ reaction / `/reject` in `#bridge-approvals` | Slack Events API | OpenCode → Rejection Handler | Logs, re-queues, or closes |

> **Bot-message filtering:** Every Slack-to-agent route must check `event.bot_id` and discard if present, to avoid infinite loops.

---

## 5. OpenCode Room Configuration

Each agent is registered in OpenCode with its room bindings. Example agent registration (pseudo-config):

```yaml
agents:
  - id: intake
    trigger:
      platform: telegram
      chat_id: "${TELEGRAM_INTAKE_CHAT_ID}"
    output:
      platform: slack
      channel: "${SLACK_INTAKE_CHANNEL}"

  - id: spec-writer
    trigger:
      platform: slack
      channel: "${SLACK_INTAKE_CHANNEL}"
      filter: human_messages_only
    output:
      platform: slack
      channel: "${SLACK_SPEC_CHANNEL}"

  - id: quoter
    trigger:
      platform: slack
      channel: "${SLACK_SPEC_CHANNEL}"
      filter: human_messages_only
    output:
      platform: slack
      channel: "${SLACK_QUOTE_CHANNEL}"

  - id: demo-builder
    trigger:
      platform: slack
      channel: "${SLACK_QUOTE_CHANNEL}"
      filter: human_messages_only
    output:
      platform: slack
      channel: "${SLACK_DEMO_CHANNEL}"

  - id: approval-notifier
    trigger:
      platform: slack
      channel: "${SLACK_DEMO_CHANNEL}"
    output:
      platform: slack
      channel: "${SLACK_APPROVALS_CHANNEL}"
      mention: "${PM_SLACK_USER_ID}"
```

---

## 6. Creating Slack Channels

```bash
# Using Slack CLI (slack) or via Slack UI:
# Create these channels in your workspace:
#   bridge-intake
#   bridge-spec
#   bridge-quote
#   bridge-demo
#   bridge-approvals

# Invite the bot to each channel:
# /invite @YourBotName (in each channel)
```

---

## 7. Telegram Bot Setup

```
1. Message @BotFather on Telegram.
2. /newbot → follow prompts → copy the token.
3. Set TELEGRAM_BOT_TOKEN in .env.
4. Create / identify the intake group, add the bot, make it admin.
5. Set TELEGRAM_INTAKE_CHAT_ID in .env.
6. Enable webhook:
   POST https://api.telegram.org/bot<TOKEN>/setWebhook
   Body: {"url": "https://your-switch-server/telegram/webhook",
          "secret_token": "<TELEGRAM_WEBHOOK_SECRET>"}
```
