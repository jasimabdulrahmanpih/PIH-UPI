# PIH Approval Hub

This is an interactive responsive prototype using representative data. Decisions live in React state for the current session. Reloading resets them. There is no PIH SSO, durable audit store, live source connection, or digital-signature execution. The hosted preview is owner-only.

## Integration boundary

`lib/approval-contract.ts` defines the server-side connector contract and extensible registry. It is a foundation, not a deployed integration service. Each application adapter implements listAssigned, getRequest and decide. Adding an adapter should not require changing the approval UI; the prototype UI's sample application catalog is currently separate from this future runtime registry.

A future HTTP API should expose GET /api/approvals (cursor and source filters), GET /api/approvals/:source/:id and POST /api/approvals/:source/:id/decisions. Both web and mobile clients use the same API. Authenticate with PIH's identity provider, derive the actor server-side and verify source permissions for every read and action. Never trust a client-supplied assignee. Keep credentials in managed server secrets.

Source connectors must map source IDs, identities, fields, due dates, supported actions and versions. Verify vendor API availability and licensed scopes for the actual SAP landscape, SuccessFactors tenant, internal Signature.ai, service desk vendor and Tamas before implementing adapters. No vendor API endpoints have been assumed here.

## Decision reliability

Require expectedVersion and idempotencyKey. Reject stale requests and unsupported actions. Return operations require a reason. A decision is complete only after the source confirms it. Record actor, before/after version, action, note, source transaction and timestamps in a durable audit store. For network timeouts, reconcile source state before retrying. Use an outbox and bounded retries; surface pending and failed delivery states distinctly. Refresh request data before action and reconcile external decisions. Digital signatures must preserve the signing provider's authentication, consent and evidence process; the prototype only demonstrates an approve-for-signing step.

## Before production

Provision identity, server storage, per-source service accounts and a test environment. Exercise permissions, concurrent decisions, expired sessions, source outages, retries, duplicate delivery, pagination and tenant separation. Review privacy, audit retention and document access with PIH owners. Replace demo identity and all fixtures; implement source-specific attachment previews and links only from verified authorized source metadata.
