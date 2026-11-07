# Approval Policy

> Defines how PM approval, rejection, timeouts, and escalation work in the Client Onboarding Bridge.

---

## 1. Overview

Before any onboarding package is delivered to a prospect via Telegram, a **designated Project Manager (PM)** must review and approve it in the Slack `#bridge-approvals` channel.

The bridge enforces this gate automatically — no approved signal = no Telegram delivery.

---

## 2. Approval Actions

| Action | Method | Effect |
|--------|--------|--------|
| **Approve** | React ✅ to the approval request message OR type `/approve` in thread | Triggers Telegram delivery to prospect |
| **Approve with edits** | Type `/approve` followed by edited text in thread | Delivers edited version to prospect |
| **Reject — revise** | React ❌ OR type `/reject revise [reason]` | Sends case back to the relevant stage (spec / quote / demo) |
| **Reject — close** | Type `/reject close [reason]` | Closes the case; logs reason; no Telegram delivery |
| **Hold** | Type `/hold [reason]` | Pauses the timer; no auto-escalation until released with `/resume` |

---

## 3. Approval Request Format

When a demo is ready, the bridge posts in `#bridge-approvals`:

```
🔔 *Approval Required* — Case #<CASE_ID>
Client: <Prospect Name / Company>
Stage: Demo Ready
Demo: <link or inline content>
Spec: #bridge-spec → thread <link>
Quote: #bridge-quote → thread <link>

@<PM_SLACK_USER> — please review and react ✅ to approve or ❌ to reject.
Deadline: <timestamp + APPROVAL_TIMEOUT_HOURS>
```

---

## 4. Timeout & Escalation

| Elapsed Time | Trigger | Action |
|-------------|---------|--------|
| 50% of `APPROVAL_TIMEOUT_HOURS` | Reminder | Bridge re-pings PM in thread |
| 100% of `APPROVAL_TIMEOUT_HOURS` | First timeout | Bridge escalates to channel with `@here` |
| 150% of `APPROVAL_TIMEOUT_HOURS` | Second timeout | Case auto-holds; logs escalation; human intervention required |

Default `APPROVAL_TIMEOUT_HOURS` = 24 (configurable in `.env`).

---

## 5. Rejection Workflow

### 5a — Reject → Revise (stage loopback)

```
PM rejects with: /reject revise spec "Scope is unclear"
        │
        ▼
Bridge marks case status = REJECTED_SPEC
        │
        ▼
Spec-Writer Agent re-triggered with original intake + PM comment
        │
        ▼
New spec posted → #bridge-spec (thread reply)
        │
        ▼
Pipeline resumes from spec stage
```

### 5b — Reject → Close

```
PM rejects with: /reject close "Prospect out of scope"
        │
        ▼
Bridge marks case status = CLOSED
        │
        ▼
Prospect optionally notified via Telegram: "Thank you for your interest..."
        │
        ▼
Case archived in audit log
```

---

## 6. Audit Log Requirements

Every approval action must be logged with:

| Field | Description |
|-------|-------------|
| `case_id` | Unique case identifier |
| `action` | APPROVED / REJECTED_REVISE / REJECTED_CLOSE / HELD / RESUMED |
| `actor` | Slack user ID of PM |
| `timestamp` | ISO 8601 UTC |
| `stage` | Pipeline stage at time of action |
| `reason` | Free-text reason (required for rejections) |

Logs are stored locally by Switch Local Server. **Logs must never be committed to git.**

---

## 7. Approval Permissions

Only the user configured as `PM_SLACK_USER_ID` in `.env` can trigger approval actions. All other approval reactions are silently ignored and logged as "unauthorised attempt."

> To add additional approvers, support for a `PM_SLACK_USER_IDS` comma-separated list can be added in future.

---

## 8. Manual Override (Break-glass)

In the event of system failure, a human team member can manually post to Telegram using the platform's native interface. This should be:

1. Documented in the case audit log manually.
2. Reported to the system owner.
3. Followed by a postmortem to prevent recurrence.
