# Testing Checklist

> Run through this checklist before every deployment, demo, or PR merge.

---

## Pre-Flight (Environment)

- [ ] `.env` file exists and all `REPLACE_ME` values are filled
- [ ] Switch Local Server is running and reachable at `SWITCH_SERVER_HOST:SWITCH_SERVER_PORT`
- [ ] PHOTON Local Controller is running and reachable at `PHOTON_HOST:PHOTON_PORT`
- [ ] OpenCode is running at `OPENCODE_API_ENDPOINT`
- [ ] Telegram bot is active (`getMe` returns bot info)
- [ ] Slack bot is active and invited to all `bridge-*` channels
- [ ] All five Slack channels exist: `bridge-intake`, `bridge-spec`, `bridge-quote`, `bridge-demo`, `bridge-approvals`
- [ ] `PM_SLACK_USER_ID` is set and belongs to a real workspace member

---

## Smoke Test — Component Connectivity

### Switch Local Server
```bash
curl -H "X-API-Key: $SWITCH_SERVER_API_KEY" \
     http://$SWITCH_SERVER_HOST:$SWITCH_SERVER_PORT/health
# Expected: {"status":"ok"}
```

### PHOTON Local Controller
```bash
curl -H "Authorization: Bearer $PHOTON_AUTH_TOKEN" \
     http://$PHOTON_HOST:$PHOTON_PORT/health
# Expected: {"status":"ok","models":[...]}
```

### OpenCode
```bash
curl -H "Authorization: Bearer $OPENCODE_API_KEY" \
     $OPENCODE_API_ENDPOINT/health
# Expected: {"status":"ok","agents":[...]}
```

### Telegram Bot
```bash
curl https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getMe
# Expected: {"ok":true,"result":{"id":...,"username":"..."}}
```

### Slack Bot
```bash
curl -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
     https://slack.com/api/auth.test
# Expected: {"ok":true,"user":"...","team":"..."}
```

---

## End-to-End Pipeline Test

Perform this test with **non-production / test prospect data only.**

### Step 1 — Intake
- [ ] Send a test message to the Telegram `bridge-intake` room: `"Hi, I'm interested in your services — test run [DATE]"`
- [ ] Verify webhook received by Switch Local Server (check server logs)
- [ ] Verify Intake Agent is triggered in OpenCode (check agent logs)
- [ ] Verify structured summary appears in Slack `#bridge-intake` within 60 seconds
- [ ] Summary must contain: prospect name/identifier, stated need, urgency flag

### Step 2 — Specification
- [ ] Verify Spec-Writer Agent auto-triggers after `#bridge-intake` post
- [ ] Verify specification document appears in Slack `#bridge-spec` within 120 seconds
- [ ] Spec must contain: objectives, scope, deliverables, assumptions, open questions

### Step 3 — Quote
- [ ] Verify Quoter Agent auto-triggers after `#bridge-spec` post
- [ ] Verify quote package appears in Slack `#bridge-quote` within 120 seconds
- [ ] Quote must contain: scope summary, timeline, pricing guidance (no hardcoded numbers), next steps
- [ ] Confirm no actual prices are hardcoded (PM provides final numbers)

### Step 4 — Demo
- [ ] Verify Demo-Builder Agent auto-triggers after `#bridge-quote` post
- [ ] Verify demo artefact/script appears in Slack `#bridge-demo` within 180 seconds
- [ ] Demo must contain: demo agenda, talking points, feature highlights, CTA

### Step 5 — PM Approval Request
- [ ] Verify approval request appears in Slack `#bridge-approvals` mentioning `PM_SLACK_USER_ID`
- [ ] Approval message contains links to spec, quote, and demo
- [ ] Deadline timestamp is correct (`now + APPROVAL_TIMEOUT_HOURS`)

### Step 6a — Approve
- [ ] React ✅ to the approval request as the PM user
- [ ] Verify bridge receives the reaction event
- [ ] Verify Telegram delivery message sent to prospect within 30 seconds
- [ ] Telegram message contains approved onboarding package

### Step 6b — Reject (separate test run)
- [ ] Type `/reject revise spec "Test rejection"` in `#bridge-approvals` thread as PM
- [ ] Verify case status updates to REJECTED_SPEC
- [ ] Verify Spec-Writer Agent is re-triggered
- [ ] Verify new spec appears in `#bridge-spec` as a thread reply

### Step 7 — Timeout (optional / simulated)
- [ ] Temporarily set `APPROVAL_TIMEOUT_HOURS=0.01` (~36 seconds)
- [ ] Trigger pipeline, do not approve
- [ ] Verify reminder is sent at ~50% mark
- [ ] Verify escalation ping at 100% mark
- [ ] Restore `APPROVAL_TIMEOUT_HOURS` to production value

---

## Security Checks

- [ ] `.env` is NOT tracked by git (`git status` shows no `.env`)
- [ ] `git log --all -- .env` returns no commits
- [ ] Telegram webhook rejects requests without correct `secret_token` header
- [ ] Slack events with invalid `X-Slack-Signature` are rejected (HTTP 403)
- [ ] Bot-message loop prevention: posting to `#bridge-intake` as a bot does NOT re-trigger Intake Agent

---

## Regression Checklist (after code changes)

- [ ] All smoke tests pass
- [ ] Re-run Step 1–6a of the E2E pipeline test
- [ ] No new credentials appear in `git diff`
- [ ] `.gitignore` still excludes `.env`, logs, and runtime data

---

## Sign-Off

| Tester | Date | Environment | Result | Notes |
|--------|------|-------------|--------|-------|
| | | | | |
