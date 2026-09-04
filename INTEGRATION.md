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

## Contextual decision workspace (v2)

The UI now uses a compact queue and distinct purchase, leave, and document decision surfaces. Guided question matching selects budget, changes or risk evidence. This is deterministic progressive disclosure, not an LLM service or open-ended GenUI engine. Added line items, calendar and document excerpts are explicitly sample evidence. No prior versions are fabricated; missing risk inputs remain visible.

Correspondence adds a sample register, document lifecycle, local review threads, entity/classification filtering and proposed reference standard. It does not upload files, issue official references, dispatch mail, enforce classification ACLs or persist records. Record allocation must be atomic in production. Preserve original references separately, including Arabic strings. Use sensitivity plus category/audience metadata instead of treating Board & legal as a universal sensitivity level.

## Quick and mobile views (v3)

Quick view is the default decision surface: scope, short summary, three relevant facts, missing evidence and actions. Full context uses the original source-specific surfaces. Switching modes preserves the active request and decision state; the mode preference alone is stored locally in the browser. Quick view does not bypass source permissions or decision validation in a future production integration.

The mobile layout uses an expandable request queue, a single decision column and fixed bottom actions. Actions are hidden while browsing the queue. The `/mobile-preview` route embeds the actual app at 360×780, 390×844 and 768×1024 viewports; it is an interactive demonstration, not a native app. Demo action data remains session-local.

## Signing and scrolling (v4)

Requests now declare their required action independently of their application: approve or sign. The Signature.ai sample uses Review & sign. The in-page signing experience shows an illustrative document, a signature placement preview, sample saved/generated/local-image options, explicit sample review and consent, and a demo receipt. Signed is a separate session status and does not imply dispatch. Uploaded images remain local object URLs and are revoked when replaced or the signing component is unmounted. No actual signature artifact, original contract, source transaction or legally executed document is produced.

Production signing must be initiated as a source-controlled signing session for an immutable document version, with signer authorization, authentication/step-up, consent, signature-field mapping, tamper evidence and receipt reconciliation handled by Signature.ai. Never treat a saved signature image as sufficient proof of identity or mark a source document signed from a client callback alone.

The desktop mobile preview now fits its frame in the available window and prevents outer scrolling; only the app scrolls. On phone-sized browsers the preview route shows the app directly. The mobile request queue expands into the page, with no nested list scroller and no underlying decision panel while choosing a request. Already-open production tabs can retain a prior bundle until refreshed; the prominent view selector is present in the current build.
