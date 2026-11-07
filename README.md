# Client Onboarding Bridge

> **A multi-agent, multi-channel bridge that takes a prospect from first Telegram message to approved demo — entirely through automated, auditable workflows.**

[![GitHub Repo](https://img.shields.io/badge/GitHub-real--horizon02%2Fclient--onboarding--bridge-blue?logo=github)](https://github.com/real-horizon02/client-onboarding-bridge)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![Project Status](https://img.shields.io/badge/status-AWAITING%20PM%20REVIEW-orange.svg)](#review-prototype-urban-threads)

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Summary](#architecture-summary)
3. [Tech Stack](#tech-stack)
4. [Quick Start](#quick-start)
5. [Repository Layout](#repository-layout)
6. [End-to-End Workflow](#end-to-end-workflow)
7. [Review Prototype: Urban Threads](#review-prototype-urban-threads)
8. [Room & Channel Map](#room--channel-map)
9. [Configuration](#configuration)
10. [Connector Adapters & Express API](#connector-adapters--express-api)
11. [Running Tests](#running-tests)
12. [Contributing & GitHub Integration](#contributing--github-integration)
13. [License](#license)

---

## Overview

**Client Onboarding Bridge** automates the full commercial intake lifecycle:

```
Prospect (Telegram)
  │
  ▼
[bridge-intake]  ──► Slack intake summary  ──► Specification
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
                                           ▼                    ▼
                                    APPROVED               REJECTED
                               (Telegram delivery)    (re-queue / close)
```

Each stage is owned by a dedicated AI agent, routed through its own Slack channel (`bridge-*`), and stitched together by **Switch Local Server** acting as the message bus, with **PHOTON** handling local LLM inference and **OpenCode** orchestrating agent execution.

---

## Architecture Summary

| Layer | Technology | Role |
|-------|-----------|------|
| **Message Bus** | Switch Local Server | Routes events between Telegram, Slack, and agents |
| **LLM Runtime** | PHOTON Local Controller | Hosts local inference; keeps data private & on-premises |
| **Agent Orchestration** | OpenCode | Executes agent prompts, manages state machine |
| **Client Channel** | Telegram Bot API | Prospect-facing intake and final delivery |
| **Team Channel** | Slack (bridge-* rooms) | Internal coordination, approval threads, review gates |
| **Agents** | intake · spec-writer · quoter · demo-builder | Sequential processing pipeline |
| **Backend Connectors** | Node.js (Express + Pino + Axios) | Inbound webhooks, signature verification, and delivery dispatch |

Full system details → [`docs/architecture.md`](docs/architecture.md)

---

## Tech Stack

- **Switch Local Server** — Self-hosted event router / webhook relay
- **OpenCode** — Agent runtime with tool-use and state management
- **PHOTON Local Controller** — Local LLM inference layer (privacy-preserving)
- **Telegram Bot API** — Client-facing communication (`/webhook` and `/sendMessage`)
- **Slack Web API + Events API** — Internal team collaboration and PM approval gates
- **Node.js ≥ 20** — Express webhook connectors and environment validation scripts

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/real-horizon02/client-onboarding-bridge.git
cd client-onboarding-bridge

# 2. Configure environment variables
cp .env.example .env
# Edit .env with your real credentials (see Configuration section)

# 3. Check environment configuration
node scripts/check-env.js

# 4. Start connector services (optional / dev)
npm install
npm start

# 5. Review the prototype
# Open projects/urban-threads/index.html in any modern browser
```

> ⚠️ **Never commit `.env`** — it is strictly protected by `.gitignore`.

---

## Repository Layout

```
client-onboarding-bridge/
├── README.md                        ← You are here
├── package.json                     ← Connector adapters and dependencies
├── .env.example                     ← Safe template (no real tokens)
├── .gitignore                       ← Excludes secrets, logs, and temp files
├── .gitattributes                   ← LF line-ending normalization
│
├── src/                             ← Webhook and connector implementations
│   ├── index.js                     ← Express service entry point
│   ├── server.js                    ← Router setup and middleware
│   ├── connectors/
│   │   ├── telegram.js              ← Telegram intake webhook & delivery sender
│   │   └── slack.js                 ← Slack events & PM reaction approval listener
│   └── utils/
│       ├── case-id.js               ← Non-PII Case ID generator (COB-YYYYMMDD-XXXX)
│       ├── env-validator.js         ← Startup environment validator
│       └── logger.js                ← Structured logger with credential redaction
│
├── projects/
│   └── urban-threads/               ← Review prototype (AWAITING PM REVIEW)
│       ├── index.html               ← Prototype storefront & admin entry point
│       ├── styles.css               ← Responsive styles (desktop to 390px mobile)
│       ├── app.js                   ← Client interactions & in-memory catalog CRUD
│       ├── README.md                ← Prototype setup and test instructions
│       └── docs/
│           └── test-results.md      ← Full audit, responsive testing & bug fixes
│
├── agents/
│   ├── intake.md                    ← Intake Agent spec (Telegram → #bridge-intake)
│   ├── spec-writer.md               ← Spec-Writer Agent spec (#bridge-intake → #bridge-spec)
│   ├── quoter.md                    ← Quoter Agent spec (#bridge-spec → #bridge-quote)
│   └── demo-builder.md              ← Demo-Builder Agent spec (#bridge-quote → #bridge-demo)
│
├── rate-card/
│   └── pricing.md                   ← Pricing policy (structure only; zero invented prices)
│
├── docs/
│   ├── architecture.md              ← Full system architecture and flow diagrams
│   ├── room-and-agent-mapping.md    ← Telegram/Slack room ↔ agent mapping table
│   ├── approval-policy.md           ← PM approval, rejection, and escalation rules
│   ├── testing-checklist.md         ← QA and smoke-test procedures
│   └── troubleshooting.md           ← Diagnostics and solutions for all components
│
└── scripts/
    ├── check-env.js                 ← Diagnostic environment checker
    └── setup.md                     ← Step-by-step setup and judge reproduction guide
```

---

## End-to-End Workflow

Detailed flow → [`docs/architecture.md`](docs/architecture.md)

| Step | Actor | Channel / Location | Outcome |
|------|-------|--------------------|---------|
| 1 | Prospect | Telegram `bridge-intake` | Raw inquiry message received |
| 2 | Intake Agent | Slack `#bridge-intake` | Structured intake summary posted (need, urgency, contact) |
| 3 | Spec-Writer Agent | Slack `#bridge-spec` | Detailed specification document generated |
| 4 | Quoter Agent | Slack `#bridge-quote` | Quote package assembled (pricing structure; no hardcoded rates) |
| 5 | Demo-Builder Agent | Slack `#bridge-demo` | Interactive prototype generated ([Urban Threads](#review-prototype-urban-threads)) |
| 6 | PM | Slack `#bridge-approvals` | Human review gate: PM reacts with ✅ to approve or ❌ to reject |
| 7 | Delivery Handler | Telegram (prospect) | Approved package delivered directly to client |

---

## Review Prototype: Urban Threads

As part of the `bridge-demo` milestone, an interactive client review prototype named **Urban Threads** is integrated directly into the repository under [`projects/urban-threads/`](projects/urban-threads/).

* **Current Status:** `AWAITING PM REVIEW`
* **Technology:** Vanilla HTML5, CSS3, and ES6 JavaScript (zero external runtime dependencies).
* **Key Capabilities:**
  * Fully responsive design (tested on 1440px desktop, tablet, and 390px mobile viewports).
  * Product catalogue with real-time category, gender, and price filtering.
  * Accessible product quick-view modal with focus trapping and ESC support.
  * Demo authentication flow with mock customer credentials (`priya@demo.in` / `urban26`).
  * In-memory Store Admin dashboard with full product CRUD operations.
  * Mock customer enquiry / contact form.
* **Documentation & Audit:** See [`projects/urban-threads/README.md`](projects/urban-threads/README.md) and [`projects/urban-threads/docs/test-results.md`](projects/urban-threads/docs/test-results.md).

---

## Room & Channel Map

| Room / Channel | Platform | Handled By | Trigger / Purpose |
|----------------|----------|------------|-------------------|
| `bridge-intake` | Telegram | Intake Agent | Prospect submits inquiry |
| `#bridge-intake` | Slack | Spec-Writer Agent | Receives structured intake summary |
| `#bridge-spec` | Slack | Quoter Agent | Receives technical specification |
| `#bridge-quote` | Slack | Demo-Builder Agent | Receives quote package & scope breakdown |
| `#bridge-demo` | Slack | PM Reviewer | Receives prototype link / demo script |
| `#bridge-approvals` | Slack | PM Approver | PM gate (`✅` approval triggers client delivery) |
| Prospect Chat | Telegram | Bridge Delivery Handler | Final approved proposal delivered |

Full mapping details → [`docs/room-and-agent-mapping.md`](docs/room-and-agent-mapping.md)

---

## Configuration

All configuration is managed via environment variables. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable Group | Keys | Purpose |
|----------------|------|---------|
| **Switch Server** | `SWITCH_SERVER_HOST`, `SWITCH_SERVER_PORT`, `SWITCH_SERVER_API_KEY` | Event bus connection |
| **OpenCode** | `OPENCODE_API_ENDPOINT`, `OPENCODE_API_KEY`, `OPENCODE_MODEL` | Agent orchestration |
| **PHOTON** | `PHOTON_HOST`, `PHOTON_PORT`, `PHOTON_AUTH_TOKEN` | Local LLM inference |
| **Telegram** | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_INTAKE_CHAT_ID`, `TELEGRAM_DELIVERY_CHAT_ID`, `TELEGRAM_WEBHOOK_SECRET` | Client channel |
| **Slack** | `SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET`, `SLACK_*_CHANNEL` | Internal coordination |
| **Governance** | `PM_SLACK_USER_ID`, `APPROVAL_TIMEOUT_HOURS` | Human approval gate |

To verify your configuration without revealing secrets, run:
```bash
node scripts/check-env.js
```

---

## Connector Adapters & Express API

The Node.js connectors in `src/` provide endpoints for webhooks:

* `GET /health` — Service health check and timestamp.
* `POST /telegram/webhook` — Validates `X-Telegram-Bot-Api-Secret-Token`, assigns a case ID, and forwards events to Switch Local Server.
* `POST /slack/events` — Validates Slack HMAC-SHA256 signatures, filters bot loops, listens for PM `reaction_added` approvals (`✅`), and invokes client delivery.

---

## Running Tests

* **Environment Check:**
  ```bash
  node scripts/check-env.js
  ```
* **Syntax and Lint Check:**
  ```bash
  node --check src/index.js
  node --check src/server.js
  node --check projects/urban-threads/app.js
  ```
* **Full E2E Testing Checklist:** Follow the step-by-step procedures in [`docs/testing-checklist.md`](docs/testing-checklist.md).

---

## Contributing & GitHub Integration

The canonical repository is hosted at:
**`https://github.com/real-horizon02/client-onboarding-bridge.git`**

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Commit changes adhering to commit standards.
3. Push to your branch: `git push origin feat/your-feature`
4. Open a Pull Request against `main`. All PRs require PM approval prior to merge.

---

## License

Proprietary — All rights reserved. Client Onboarding Bridge team.
