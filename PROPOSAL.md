# PIH Connected Decision Workspace — phased proposal

## Direction

Provide one contextual place for PIH staff to review, approve and act across existing enterprise systems, with a shared document and correspondence layer for entity-wide traceability. Preserve source-system authority and use Signature.ai for signing. Avoid treating a consolidated dashboard as a replacement for every source application or assuming a new DMS is the only viable storage architecture.

The prototype demonstrates purchase evidence, leave coverage, document review, lifecycle visibility, correspondence references and internal review threads. It uses sample data and session-only state. Its contextual questions are deterministic demonstrations, not an operational AI engine.

## Indicative delivery: 12–16 weeks after kickoff

This is a planning estimate, not a committed deadline. It assumes a dedicated product owner, design/engineering capacity, available source-system owners and APIs, a PIH identity integration, and timely security and records decisions. Discovery must validate effort, licensing and dependencies before committing the schedule.

| Phase | Indicative window | Outcome / gate |
| --- | --- | --- |
| Discovery and governance | Weeks 1–2 | Confirm entities, user roles, delegation, approval types, document ownership, retention, classification, numbering and API access. Choose existing document repository versus a new shared service. |
| Platform foundation | Weeks 3–5 | PIH SSO, authorization, connector contract, audit store, reliable action delivery, document metadata and reference allocation. |
| First controlled pilot | Weeks 6–9 | One entity, selected purchase/leave workflows and Signature.ai integration; document versions, correspondence register and review threads. Pilot entry requires permission, concurrency and failure-recovery checks. |
| Lifecycle and expansion | Weeks 10–12 | Draft/review/approval/signature/dispatch tracking, verified signature/dispatch receipts, reminders, entity-aware search; add service desk and Tamas based on validated APIs. |
| Hardening and phased rollout | Weeks 13–16 | Accessibility, mobile-web testing, UAT, monitoring, operations handover and gradual entity onboarding. Native mobile follows after API and workflow stability. |

## Proposed information standard

Internal reference: ENTITY-DIRECTION-YEAR-SEQUENCE, for example UCC-OUT-2026-000043. Allocate transactionally per entity/direction/year at registration. Do not reuse issued identifiers. Keep cancellation and supersession history. Preserve external references verbatim and link incoming and reply records. A barcode represents the immutable record identifier and is not an access credential.

Sensitivity: proposed Public, Internal and Confidential. Category: examples Contract, Project correspondence, Circular, Board & legal. Audience restrictions and retention rules are separate governed metadata. The President's office and entity records owners must agree the final taxonomy and sequencing rules.

## Production controls and acceptance

Every user sees only source-authorized records. A displayed classification badge alone is not a control. Every approval action is idempotent, checks current source state, and remains pending until confirmed by the source. Approval, signature and dispatch are distinct events. Audit records retain actor, entity, document version, source reference, action, reason and timestamp. Search and generated summaries inherit source permissions. AI explanations cite authorized evidence, show freshness and explicitly disclose missing inputs; arbitrary generated actions are prohibited.

Begin AI assistance after reliable connectors and evidence retrieval exist. Use schema-based components selected from permitted request types; do not generate executable UI or decide approval authority from model output.

## Discovery decisions

Which DMS/repositories exist today? Which system owns correspondence registration? Who owns entity codes and reference allocation? Which signature, SAP and service desk APIs are licensed and accessible? Which review stages are mandatory? What delegations, signing mandates, dispatch channels, retention rules, data-residency requirements and restricted audiences apply? What volumes and response-time targets define pilot success?
