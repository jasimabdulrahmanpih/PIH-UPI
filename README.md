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

The prototype represents requests from systems such as SAP S/4HANA, SuccessFactors, Signature.ai, service desk, and other PIH applications. These are sample adapters only. No live credentials, vendor endpoints, or production data are included.

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

The intended production architecture keeps each source system authoritative. PIH-UPI would retrieve only records the signed-in user is allowed to see, submit decisions through controlled connectors, confirm the resulting source state, and record a durable audit trail. Approval, electronic signature, and dispatch remain separate verified events.

See [PROPOSAL.md](./PROPOSAL.md) for the phased delivery proposal and [INTEGRATION.md](./INTEGRATION.md) for the proposed connector, identity, decision reliability, and production controls.

## Status

Prototype for product discovery and stakeholder review. It should not be used for operational approvals or production data.
