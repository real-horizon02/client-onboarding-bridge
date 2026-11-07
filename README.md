# Client Onboarding Bridge

> **A multi-agent, multi-channel bridge that takes a prospect from first Telegram message to approved demo — entirely through automated, auditable workflows.**

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Summary](#architecture-summary)
3. [Tech Stack](#tech-stack)
4. [Quick Start](#quick-start)
5. [Repository Layout](#repository-layout)
6. [End-to-End Workflow](#end-to-end-workflow)
7. [Room & Channel Map](#room--channel-map)
8. [Configuration](#configuration)
9. [Running Tests](#running-tests)
10. [Contributing](#contributing)
11. [Connecting to GitHub](#connecting-to-github)
12. [License](#license)

---

## Overview

**Client Onboarding Bridge** automates the full commercial intake lifecycle:

```
Prospect (Telegram)
  │
  ▼
[bridge-intake]  ──► Slack summary  ──► Specification
                                              │
                                              ▼
                                           Quote
                                              │
                                              ▼
                                            Demo
                                              │
                                              ▼
                                       PM Approval
                                              │
                                    ┌─────────┴──────────┐
                                    ▼                     ▼
                             APPROVED                REJECTED
                          (Telegram delivery)    (re-queue / close)
```

Each stage is owned by a dedicated AI agent, routed through its own Slack channel (`bridge-*`), and stitched together by **Switch Local Server** acting as the message bus, with **PHOTON** handling local LLM inference and **OpenCode** orchestrating agent execution.

---

## Architecture Summary

| Layer | Technology | Role |
|-------|-----------|------|
| **Message Bus** | Switch Local Server | Routes events between Telegram, Slack, and agents |
| **LLM Runtime** | PHOTON Local Controller | Hosts local inference; keeps data on-premises |
| **Agent Orchestration** | OpenCode | Executes agent prompts, manages state machine |
| **Client Channel** | Telegram Bot | Prospect-facing intake and final delivery |
| **Team Channel** | Slack (bridge-* rooms) | Internal coordination, approval threads |
| **Agents** | intake · spec-writer · quoter · demo-builder | Sequential processing pipeline |

Full details → [`docs/architecture.md`](docs/architecture.md)

---

## Tech Stack

- **Switch Local Server** — Self-hosted event router / webhook relay
- **OpenCode** — Agent runtime with tool-use and state management
- **PHOTON Local Controller** — Local LLM inference layer (privacy-preserving)
- **Telegram Bot API** — Client-facing communication
- **Slack Web API + Events API** — Internal team collaboration and approval
- **Node.js ≥ 20 / Python ≥ 3.11** (connector adapters)

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/YOUR_ORG/client-onboarding-bridge.git
cd client-onboarding-bridge

# 2. Configure environment
cp .env.example .env
# → Edit .env with real tokens (see Configuration section)

# 3. Follow the setup guide
# See scripts/setup.md for step-by-step service startup

# 4. Run checks
# See docs/testing-checklist.md
```

> ⚠️ **Never commit `.env`** — it is in `.gitignore`.

---

## Repository Layout

```
client-onboarding-bridge/
├── README.md                        ← You are here
├── .env.example                     ← Safe template (no real tokens)
├── .gitignore
│
├── agents/
│   ├── intake.md                    ← Intake agent spec
│   ├── spec-writer.md               ← Specification agent spec
│   ├── quoter.md                    ← Quote agent spec
│   └── demo-builder.md              ← Demo builder agent spec
│
├── rate-card/
│   └── pricing.md                   ← Pricing policy (no hard prices; set by PM)
│
├── docs/
│   ├── architecture.md              ← Full system architecture
│   ├── room-and-agent-mapping.md    ← Telegram/Slack room → agent mapping
│   ├── approval-policy.md           ← PM approval / rejection rules
│   ├── testing-checklist.md         ← QA and smoke-test procedures
│   └── troubleshooting.md           ← Common issues and fixes
│
└── scripts/
    └── setup.md                     ← Installation walkthrough
```

---

## End-to-End Workflow

Detailed flow → [`docs/architecture.md`](docs/architecture.md)

| Step | Actor | Channel | Outcome |
|------|-------|---------|---------|
| 1 | Prospect | Telegram `bridge-intake` | Raw inquiry message |
| 2 | Intake Agent | Slack `bridge-intake` | Structured intake summary posted |
| 3 | Spec-Writer Agent | Slack `bridge-spec` | Detailed specification document |
| 4 | Quoter Agent | Slack `bridge-quote` | Quote package (no hardcoded prices) |
| 5 | Demo-Builder Agent | Slack `bridge-demo` | Demo artefact / walkthrough |
| 6 | PM | Slack `bridge-approvals` | Approve or reject with reason |
| 7 | Bridge | Telegram (prospect) | Approved package delivered / rejection handled |

---

## Room & Channel Map

Full table → [`docs/room-and-agent-mapping.md`](docs/room-and-agent-mapping.md)

---

## Configuration

All configuration is via environment variables. Copy `.env.example` → `.env` and fill in:

- `SWITCH_SERVER_*` — Switch Local Server connection
- `OPENCODE_*` — OpenCode API endpoint and key
- `PHOTON_*` — PHOTON controller address and auth
- `TELEGRAM_*` — Bot token, chat IDs, webhook secret
- `SLACK_*` — Bot token, signing secret, channel names
- `PM_SLACK_USER_ID` — The Slack user ID of the approving PM

---

## Running Tests

See [`docs/testing-checklist.md`](docs/testing-checklist.md) for the full checklist.

```bash
# Lint / static analysis (add your runner here)
# npm test   OR   pytest   — depending on adapter language
```

---

## Contributing

1. Branch from `main`: `git checkout -b feat/your-feature`
2. Make changes, add tests
3. Open a Pull Request; PM approval required before merge to `main`

---

## Connecting to GitHub

See the final section of [`scripts/setup.md`](scripts/setup.md) for the exact commands to push this repository to GitHub without exposing credentials.

---

## License

Proprietary — All rights reserved. Contact the project owner before redistribution.
