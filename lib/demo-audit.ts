import type { Request } from './demo-data';
import type { WorkflowEvent } from './workflow-audit';

const sourceNames = ['SAP S/4HANA', 'SuccessFactors', 'Signature.ai', 'IT Service Desk', 'Tamas', 'AI Applications'];

/** Illustrative history only. These agents and source activities have not run. */
export function sampleAudit(r: Omit<Request, 'audit'>): WorkflowEvent[] {
  const source = sourceNames[r.app];
  const make = (suffix: string, minute: string, event: Partial<WorkflowEvent>): WorkflowEvent => ({
    id: `${r.id}-${suffix}`, requestId: r.id, occurredAt: `2026-09-02T09:${minute}:00+03:00`,
    actor: { id: 'demo-router', name: 'PIH workflow', kind: 'system' },
    action: '', summary: '', outcome: 'completed', source, evidence: `${r.id} · Sample request fields`,
    version: 'Sample version 1', provenance: 'sample', ...event,
  });
  const events = [make('submitted', '00', {
    actor: { id: `demo-requester-${r.id}`, name: r.name, kind: 'human' },
    action: 'Request submitted', summary: `${r.department} submitted this request to ${source}.`,
    fromStatus: 'Draft', toStatus: 'Submitted',
  })];
  if (r.app === 0 || r.app === 2 || r.app === 5) {
    const procurement = r.app === 0;
    const signature = r.app === 2;
    const missingQuotes = r.id === 'PR-2026-0842';
    events.push(make('agent', '02', {
      actor: { id: `demo-agent-${r.app}`, name: procurement ? 'Procurement review agent' : signature ? 'Document preparation agent' : 'Access review agent', kind: 'agent' },
      action: missingQuotes ? 'Budget checked · review gap flagged' : signature ? 'Signing packet prepared' : procurement ? 'Purchase context prepared' : 'Pilot scope checked',
      summary: missingQuotes ? 'QAR 91,500 would remain. Comparison quotes are missing; human review requested.' : signature ? 'Matched the counterparty, contract value and signature step to the sample agreement.' : procurement ? 'Collected the vendor, cost center and available allocation for the approver.' : 'Checked the 30-day pilot and approved-document scope. Access has not been provisioned.',
      outcome: missingQuotes ? 'attention' : 'completed',
      evidence: signature ? 'DOC-2026-0156 · Illustrative agreement excerpt' : procurement ? `${r.id} · Vendor, budget and cost-center fields` : `${r.id} · Pilot duration and data-scope fields`,
      agentRun: {
        id: `demo-run-${r.id.toLowerCase()}`,
        delegatedBy: procurement ? 'Procurement Operations · Sample workflow owner' : signature ? 'Legal Operations · Sample workflow owner' : 'AI Operations · Sample workflow owner',
        scope: signature ? 'Prepare and check document metadata. Cannot approve, sign or dispatch.' : procurement ? 'Read request fields and calculate budget. Cannot approve or place an order.' : 'Read pilot scope and flag exceptions. Cannot approve or grant access.',
        tool: signature ? 'document.extract · sample' : procurement ? 'request.read + budget.calculate · sample' : 'pilot.scope.check · sample',
        handoff: missingQuotes ? 'Jasim to resolve the missing quotes and decide.' : signature ? 'Legal reviewer, then authorized human signatory.' : 'Jasim retains the final decision.',
      },
    }));
  }
  if (r.app === 2 || r.app === 3 || r.app === 5) {
    events.push(make('review', '10', {
      actor: { id: `demo-reviewer-${r.app}`, name: r.app === 2 ? 'Omar Ibrahim · Legal reviewer' : r.app === 3 ? 'Marketing manager · Sample reviewer' : 'Security reviewer · Sample reviewer', kind: 'human' },
      action: r.app === 2 ? 'Legal review & approval completed' : r.app === 3 ? 'Manager review completed' : 'Security review completed',
      summary: r.app === 2 ? 'The sample approval stage is complete. An authorized electronic signature is still required.' : 'The request records a completed prior review. Supporting review notes are not attached.',
      evidence: `${r.id} · Recorded review-status field; source review receipt unavailable`,
    }));
  }
  events.push(make('assigned', '12', {
    action: r.action === 'sign' ? 'Assigned to Jasim for signature' : 'Assigned to Jasim for decision',
    summary: r.action === 'sign' ? 'Waiting for document review and explicit signing consent.' : 'Prepared context handed to the assigned human approver.',
    outcome: 'waiting', fromStatus: 'Submitted', toStatus: 'Pending',
  }));
  return events;
}

export function decisionEvent(r: Request, status: string, note = '', signatureMethod?: string): WorkflowEvent {
  return {
    id: crypto.randomUUID(), requestId: r.id, occurredAt: new Date().toISOString(),
    actor: { id: 'demo-jasim', name: 'Jasim · You', kind: 'human' },
    action: status === 'Signed' ? 'Demo signature applied' : status === 'Returned' ? 'Request returned' : 'Request approved',
    summary: status === 'Signed' ? `${signatureMethod}. Document review and signing consent confirmed in this demo.` : status === 'Returned' ? 'Returned with a reason for the requester.' : 'Human approval recorded in this session.',
    outcome: 'completed', source: 'PIH workspace · Demo session',
    evidence: 'Session event only. No source transaction or confirmation; nothing was sent externally.',
    version: 'Sample version 1', provenance: 'session', fromStatus: r.status, toStatus: status,
    ...(note ? { note } : {}),
  };
}
