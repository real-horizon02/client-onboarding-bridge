# Setup Guide

> **Audience:** Developers, judges, and new team members setting up the Client Onboarding Bridge from scratch.  
> **Time required:** ~45–90 minutes (depending on existing tooling)

---

## Prerequisites

| Tool | Minimum Version | Notes |
|------|----------------|-------|
| Git | 2.40+ | For repo management |
| Node.js | 20 LTS | For connector adapters (if used) |
| Python | 3.11+ | For connector adapters (if used) |
| Switch Local Server | Latest | See Switch documentation |
| OpenCode | Latest | See OpenCode documentation |
| PHOTON Local Controller | Latest | See PHOTON documentation |
| Telegram account | — | To create a bot via @BotFather |
| Slack workspace | — | Admin access to install apps |
| curl / httpie | Any | For smoke testing |

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_ORG/client-onboarding-bridge.git
cd client-onboarding-bridge
```

If starting from this local directory (no remote yet):

```bash
cd e:\client-onboarding-bridge
git log --oneline   # Verify you are on feat/initial-documentation
```

---

## Step 2 — Configure Environment Variables

```bash
cp .env.example .env
```

Open `.env` in your editor and fill in **every** `REPLACE_ME` value. See the table below for where to find each value:

| Variable | Where to find it |
|----------|-----------------|
| `SWITCH_SERVER_API_KEY` | Switch Local Server admin panel / config |
| `OPENCODE_API_KEY` | OpenCode dashboard or CLI |
| `OPENCODE_MODEL` | OpenCode model list (e.g., `gpt-4o`, `claude-3-5-sonnet`) |
| `PHOTON_AUTH_TOKEN` | PHOTON config file or admin CLI |
| `TELEGRAM_BOT_TOKEN` | @BotFather → /newbot → token |
| `TELEGRAM_INTAKE_CHAT_ID` | See Step 4 below |
| `TELEGRAM_DELIVERY_CHAT_ID` | See Step 4 below |
| `TELEGRAM_WEBHOOK_SECRET` | Generate: `openssl rand -hex 32` |
| `SLACK_BOT_TOKEN` | Slack App → OAuth & Permissions → Bot User OAuth Token |
| `SLACK_SIGNING_SECRET` | Slack App → Basic Information → Signing Secret |
| `PM_SLACK_USER_ID` | Slack → Profile → Copy member ID |

> ⚠️ **Never commit `.env`.** It is in `.gitignore`. Verify: `git status` should NOT list `.env`.

---

## Step 3 — Start Switch Local Server

```bash
# Follow Switch Local Server's own documentation to start the service.
# Typical command (verify with your Switch version):
# switch-server start --port $SWITCH_SERVER_PORT --api-key $SWITCH_SERVER_API_KEY

# Smoke test:
curl -H "X-API-Key: $SWITCH_SERVER_API_KEY" \
     http://$SWITCH_SERVER_HOST:$SWITCH_SERVER_PORT/health
```

Expected: `{"status":"ok"}`

---

## Step 4 — Configure Telegram Bot

### 4a — Create the bot
```
1. Open Telegram → search @BotFather
2. /newbot → follow prompts
3. Copy the token → set TELEGRAM_BOT_TOKEN in .env
```

### 4b — Create intake group
```
1. Create a Telegram group: "bridge-intake" (or use existing)
2. Add your bot; make it admin
3. Send a test message to the group
4. Find the chat ID:
   curl https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getUpdates
   → look for "chat":{"id": -100XXXXXXXXXX}
5. Set TELEGRAM_INTAKE_CHAT_ID in .env (note: group IDs are negative)
```

### 4c — Register webhook
```bash
# Replace <YOUR_SWITCH_URL> with your Switch server's public URL
# For local dev, use ngrok: ngrok http $SWITCH_SERVER_PORT

curl -X POST \
  "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://<YOUR_SWITCH_URL>/telegram/webhook",
    "secret_token": "'$TELEGRAM_WEBHOOK_SECRET'"
  }'
```

Expected: `{"ok":true,"result":true,"description":"Webhook was set"}`

---

## Step 5 — Configure Slack App

### 5a — Create Slack App
```
1. Go to https://api.slack.com/apps → Create New App → From scratch
2. App Name: "Client Onboarding Bridge Bot"
3. Pick your workspace
```

### 5b — Set OAuth Scopes
Under **OAuth & Permissions → Bot Token Scopes**, add:
- `chat:write`
- `channels:history`
- `channels:read`
- `reactions:read`
- `users:read`
- `users:read.email`

### 5c — Install App
```
1. OAuth & Permissions → Install to Workspace → Allow
2. Copy Bot User OAuth Token → set SLACK_BOT_TOKEN in .env
3. Basic Information → Signing Secret → set SLACK_SIGNING_SECRET in .env
```

### 5d — Create Channels
In your Slack workspace, create these channels:
- `#bridge-intake`
- `#bridge-spec`
- `#bridge-quote`
- `#bridge-demo`
- `#bridge-approvals`

Invite the bot to each: `/invite @YourBotName`

### 5e — Configure Events API
```
1. Event Subscriptions → Enable Events → ON
2. Request URL: https://<YOUR_SWITCH_URL>/slack/events
3. Subscribe to bot events:
   - message.channels
   - reaction_added
4. Save Changes
```

---

## Step 6 — Start PHOTON Local Controller

```bash
# Follow PHOTON's own documentation.
# Smoke test:
curl -H "Authorization: Bearer $PHOTON_AUTH_TOKEN" \
     http://$PHOTON_HOST:$PHOTON_PORT/health
```

---

## Step 7 — Start OpenCode

```bash
# Follow OpenCode's own documentation.
# Smoke test:
curl -H "Authorization: Bearer $OPENCODE_API_KEY" \
     $OPENCODE_API_ENDPOINT/health
```

Register agents by pointing OpenCode at the `agents/` directory.  
Set `OPENCODE_MODEL` to your preferred local model loaded in PHOTON.

---

## Step 8 — Configure Switch Routes

In Switch Local Server's configuration, register the routes from  
[`docs/room-and-agent-mapping.md`](../docs/room-and-agent-mapping.md) Section 4.

---

## Step 9 — Run the Test Checklist

Follow [`docs/testing-checklist.md`](../docs/testing-checklist.md) end-to-end before declaring the system ready.

---

## Step 10 — Connecting to GitHub

```bash
# 1. Create a new repository on GitHub (do NOT initialise with README)
#    Name it: client-onboarding-bridge

# 2. Add the remote:
git remote add origin https://github.com/YOUR_ORG/client-onboarding-bridge.git

# 3. Push the feature branch (do NOT push directly to main without PR):
git push -u origin feat/initial-documentation

# 4. Open a Pull Request on GitHub:
#    base: main  ←  compare: feat/initial-documentation

# 5. After PM review and approval, merge to main.
```

> **Do not force-push to main.**  
> **Do not push `.env` or any file containing real credentials.**  
> Verify before pushing: `git diff --name-only HEAD` and `cat .gitignore`

---

## Step 11 — Judges / Reproduction Instructions

To reproduce this system from scratch:

```bash
# 1. Clone
git clone https://github.com/YOUR_ORG/client-onboarding-bridge.git
cd client-onboarding-bridge

# 2. Inspect branch
git branch -a
git checkout feat/initial-documentation

# 3. Read all documentation in order:
#    README.md
#    docs/architecture.md
#    docs/room-and-agent-mapping.md
#    scripts/setup.md  ← (this file)
#    docs/testing-checklist.md

# 4. Configure .env (cp .env.example .env, fill values)

# 5. Start services in order:
#    Switch Local Server → PHOTON → OpenCode → Register webhooks

# 6. Run testing-checklist.md end-to-end
```

All agent logic, routing tables, approval policies, and configuration templates  
are fully documented — no undocumented steps are required.
