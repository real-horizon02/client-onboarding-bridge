# Troubleshooting Guide

> Common issues, root causes, and fixes for the Client Onboarding Bridge.

---

## Quick Diagnostic Commands

```bash
# Check all services
curl http://$SWITCH_SERVER_HOST:$SWITCH_SERVER_PORT/health
curl http://$PHOTON_HOST:$PHOTON_PORT/health
curl $OPENCODE_API_ENDPOINT/health
curl https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getMe
curl -H "Authorization: Bearer $SLACK_BOT_TOKEN" https://slack.com/api/auth.test
```

---

## 1. Telegram Issues

### 1.1 Bot not receiving messages

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| No webhook hits in Switch logs | Webhook not registered | Re-register: `POST /setWebhook` with correct URL |
| Webhook registered but Switch not receiving | Firewall / NAT blocking inbound | Expose Switch port or use tunnel (ngrok for dev only) |
| Bot receives messages but Intake Agent not triggered | Switch route misconfigured | Check Switch route table for `TELEGRAM_INTAKE_CHAT_ID` |
| `{"ok":false,"error_code":401}` from getMe | Invalid bot token | Regenerate token via @BotFather; update `.env` |

### 1.2 Bot can't post to Telegram

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| `bot was kicked` error | Bot removed from group | Re-add bot and make admin |
| `chat not found` | Wrong `TELEGRAM_DELIVERY_CHAT_ID` | Re-verify chat ID via `/getUpdates` |
| `have no rights to send a message` | Bot lacks send permissions | Adjust group/channel permissions |

---

## 2. Slack Issues

### 2.1 Bot not posting to channels

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| `channel_not_found` | Channel doesn't exist or wrong name | Create channel; verify `SLACK_*_CHANNEL` env values match exactly |
| `not_in_channel` | Bot not invited | `/invite @YourBotName` in each `bridge-*` channel |
| `invalid_auth` | Wrong `SLACK_BOT_TOKEN` | Re-install Slack app; copy new bot token |
| `missing_scope` | Bot lacks required OAuth scopes | Re-install Slack app with `chat:write`, `channels:history`, `reactions:read` |

### 2.2 Slack events not received

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| No events in Switch logs | Events API URL not configured | Set Request URL in Slack App → Event Subscriptions |
| `invalid_signature` in Switch logs | Wrong `SLACK_SIGNING_SECRET` | Copy signing secret from Slack App → Basic Information |
| Events received but agent not triggered | Switch route filter too strict | Check channel ID filter in Switch route table |
| Infinite loop: bot triggers itself | Missing bot-message filter | Add `if event.bot_id: return` check in Switch route handler |

### 2.3 Approval reactions not detected

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| ✅ reaction doesn't trigger delivery | `reaction_added` event not subscribed | Add `reaction_added` to Slack App event subscriptions |
| Reaction received but PM check fails | `PM_SLACK_USER_ID` mismatch | Verify user ID: `GET /users.lookupByEmail?email=...` |

---

## 3. Switch Local Server Issues

### 3.1 Server not starting

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| `Address already in use` | Port conflict | Change `SWITCH_SERVER_PORT` or kill conflicting process |
| `invalid API key` on startup | `SWITCH_SERVER_API_KEY` not set | Set in `.env` and restart |

### 3.2 Routes not working

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| Events received but not routed | Route not registered | Check Switch route configuration; restart Switch after config change |
| Wrong agent triggered | Ambiguous route filter | Make channel ID / chat ID filters more specific |

---

## 4. PHOTON Local Controller Issues

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| `connection refused` on PHOTON health check | PHOTON not started | Start PHOTON service |
| Slow completions | Model too large for available RAM/VRAM | Use a smaller model; check PHOTON model config |
| `out of memory` errors | VRAM exhausted | Reduce context length or switch to CPU inference |
| `model not found` | Model not downloaded | Pull the model via PHOTON's model management CLI |
| `unauthorized` | Wrong `PHOTON_AUTH_TOKEN` | Re-generate token in PHOTON config and update `.env` |

---

## 5. OpenCode Issues

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| Agent not triggered | OpenCode not connected to Switch | Check OpenCode → Switch webhook registration |
| Agent produces empty output | PHOTON unreachable from OpenCode | Verify `PHOTON_HOST`/`PHOTON_PORT` in OpenCode config |
| Agent loops indefinitely | Missing state transition | Check agent state machine config; add explicit completion signal |
| Wrong agent triggered for a stage | Agent ID mismatch | Verify agent IDs in OpenCode match the route table in Switch |

---

## 6. Pipeline Stage Stuck

If a case is stuck at a stage and not advancing:

```
1. Check Switch Local Server logs for the last received event.
2. Check OpenCode logs for the last agent invocation.
3. Check the target Slack channel for any output.
4. If output exists but next stage not triggered:
   → Check if the channel message event was filtered (bot message filter).
5. Manually re-post a message to the stuck channel to re-trigger.
6. Document the incident and open a bug report.
```

---

## 7. Credential / Secret Issues

> ⚠️ If credentials are accidentally committed:

```bash
# 1. IMMEDIATELY revoke the exposed credential on its platform.
# 2. Generate a new credential and update .env.
# 3. Remove from git history (requires force push — coordinate with team):
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
# 4. Force push (with team permission):
# git push origin --force --all
# 5. Notify all collaborators to re-clone.
```

---

## 8. Getting Help

1. Check this document first.
2. Check `docs/architecture.md` for system design context.
3. Search Switch / OpenCode / PHOTON project documentation.
4. Open an issue in this repository with:
   - Environment (OS, service versions)
   - Steps to reproduce
   - Relevant log excerpts (**with credentials redacted**)
