# PIH Unified Processing Interface (PIH-UPI)

PIH-UPI is a unified decision workspace for Power International Holding. It brings approval requests, supporting evidence, correspondence, signing steps, and decision history from multiple business systems into one consistent experience.

The project is currently an interactive prototype. It uses representative sample data to demonstrate the proposed user experience; it is not connected to live PIH systems and does not execute real approvals or signatures.

## Purpose

PIH employees currently make decisions across several applications, each with its own interface and context. PIH-UPI explores a single workspace where an authorized user can:

- Review assigned requests from different business applications
- See the most relevant facts and missing evidence before deciding
- Open the full context for purchase, leave, access, travel, project, and document requests
- Approve or return requests with a clear reason
- Review and simulate an electronic signing flow
- Track decision and workflow events in an audit view
- Browse correspondence and document lifecycle information
- Work from desktop, tablet, or mobile layouts

## Core integration mission

The key production work for PIH-UPI is to connect PIH's approval and decision sources into one governed interface. Depending on each platform's supported capabilities, integrations may use secured APIs, Model Context Protocol (MCP) servers, SAP OData services, events, or other approved service interfaces.

The target integration landscape includes:

- **SAP S/4HANA** for finance, procurement, and other ERP approval requests
- **SAP Business Technology Platform (BTP)** for integration services, workflow orchestration, events, and access to SAP capabilities
- **SAP SuccessFactors** for HR workflows such as leave and employee-related approvals
- **Signiture.ai**, PIH's in-house document-signing portal, for controlled document review, signing sessions, and verified signing receipts
- **DAMAS**, PIH's task-management application, for assigned tasks, workflow context, status, and actions
- **ManageEngine ServiceDesk Plus** for IT service-desk requests and ticket approvals
- **HIKMAH**, PIH's AI platform, and AI applications added over time, for governed AI-assisted tasks and decision context
- **Microsoft 365 email**, accessed through Microsoft Graph with the required identity, consent, mailbox permissions, and governance controls, for approval requests that currently arrive or are completed through email

Each source remains authoritative for its own records and business rules. PIH-UPI provides the common decision experience, while connectors retrieve authorized context, submit permitted actions, and confirm the final result with the source system.

## Contextual GenUI data contract

The contextual GenUI depends on every API, MCP server, or OData connector providing a consistent, structured view of each request. At minimum, the integration layer should supply:

- Source system, request type, unique source identifier, and authoritative record link
- Request title, description, requester, assigned decision-maker, PIH entity, department, priority, and due date
- Current status, source version, workflow stage, prior decisions, and permitted actions for the signed-in user
- Request-specific business fields such as amounts, budgets, vendors, dates, employee details, service category, or document metadata
- Supporting evidence, attachments, related records, comments, correspondence, and verified document versions
- Missing, unavailable, stale, or conflicting information that the user should see before deciding
- Audit information, including actors, timestamps, source transactions, and confirmation receipts

The normalized contract allows the application to select and compose the right decision surface for the request—for example, budget evidence for a purchase, team coverage for leave, ticket impact for an IT request, or the verified document version for a signature. Generated summaries and interfaces must use only information the user is authorized to access, show where the evidence came from, preserve source freshness, and disclose missing inputs.

Decision write-back must include the authenticated actor, intended action, reason or note when required, expected source version, and an idempotency key. PIH-UPI should show an action as complete only after the authoritative system confirms it.

## Prototype features

- Unified request queue with search, priority, and source filters
- Quick summary and full-context views for each request
- Guided questions for budget, changes, coverage, and risk evidence
- Source-specific decision screens using representative PIH workflows
- Session-based approvals, returns, signing receipts, and history
- Workflow audit trail, including sample agent activity
- Correspondence register and document journey
- Interactive mobile preview at `/mobile-preview`
- Responsive layouts for common phone, tablet, and desktop sizes

## Sample source applications

The current prototype represents requests from systems such as SAP S/4HANA, SAP SuccessFactors, Signiture.ai, service desk, and other PIH applications. These are sample adapters only. SAP BTP, DAMAS, ManageEngine ServiceDesk Plus, HIKMAH, future AI applications, and Microsoft 365 email are part of the intended integration landscape; they are not live integrations in this prototype. No credentials, vendor endpoints, mailbox data, or production records are included.

## Important limitations

- All data is fictional and intended for demonstration.
- Decisions are stored only in the current browser session and reset on reload.
- There is no PIH single sign-on, live source connection, or durable audit store.
- The signing experience does not create a legal signature or execute a document.
- Contextual answers use deterministic sample logic rather than a production AI service.
- Production use requires authorization checks, source reconciliation, security review, records governance, monitoring, and tested integrations.

## Run locally

### Requirements

- Node.js 22.13 or newer
- pnpm

### Setup

```bash
git clone https://github.com/jasimabdulrahmanpih/PIH-UPI.git
cd PIH-UPI
pnpm install
pnpm dev
```

Open the local address shown in Terminal, normally `http://localhost:3000`.

## Available commands

```bash
pnpm dev       # Start the development server
pnpm build     # Create a production build
pnpm start     # Run the built application locally
pnpm lint      # Check the code for lint issues
pnpm format    # Format the source files
```

## Project structure

```text
app/                 Application pages and decision experiences
components/          Shared interface components
hooks/               Reusable React hooks
lib/                 Demo data, contracts, audit logic, and utilities
public/              Static assets
PROPOSAL.md           Phased delivery and governance proposal
INTEGRATION.md        Proposed integration and reliability boundaries
```

## Production direction

The intended production architecture keeps each source system authoritative. A governed integration layer would connect through the mechanism supported and approved for each system, normalize its request data into the contextual GenUI contract, and expose only records the signed-in user is allowed to see. PIH-UPI would submit decisions through controlled connectors, confirm the resulting source state, and record a durable audit trail. Approval, electronic signature, email capture, and dispatch remain separate verified events.

See [PROPOSAL.md](./PROPOSAL.md) for the phased delivery proposal and [INTEGRATION.md](./INTEGRATION.md) for the proposed connector, identity, decision reliability, and production controls.

## Status

Prototype for product discovery and stakeholder review. It should not be used for operational approvals or production data.
