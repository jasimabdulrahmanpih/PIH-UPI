import type { Request } from './demo-data';

export type OntologyNode = { id: string; type: string; label: string; value: string };
export type OntologyRelation = { from: string; verb: string; to: string };
export type OntologyEvidence = { id: string; label: string; source: string };
export type RequestOntology = {
  requestId: string;
  schema: string;
  nodes: OntologyNode[];
  relations: OntologyRelation[];
  evidence: OntologyEvidence[];
};

/** Server-side extension point for an enterprise ontology or external AI source.
 * Identity, entitlements and source citations must be verified before context is returned. */
export interface ExternalContextProvider {
  getRequestOntology(actorSubject: string, requestId: string): Promise<RequestOntology>;
  ask(input: { actorSubject: string; requestId: string; question: string; ontologyVersion: string }): Promise<{
    answer: string;
    evidenceIds: string[];
    providerResponseId: string;
  }>;
}

export function demoOntology(r: Request): RequestOntology {
  const fieldNodes = Object.entries(r.fields).slice(0, 4).map(([label, value], i) => ({ id: `field-${i}`, type: label, label, value }));
  const attachmentNodes = r.attachments.map((a, i) => ({ id: `attachment-${i}`, type: a.label, label: a.name, value: `${a.kind} · ${a.size}` }));
  return {
    requestId: r.id,
    schema: 'PIH request ontology · sample v1',
    nodes: [
      { id: 'request', type: 'Request', label: r.title, value: r.id },
      { id: 'requester', type: 'Person', label: r.name, value: r.department },
      { id: 'source', type: 'Application', label: ['SAP S/4HANA','SuccessFactors','Signature.ai','IT Service Desk','Tamas','AI Applications'][r.app], value: r.id },
      ...fieldNodes,
      ...attachmentNodes,
    ],
    relations: [
      { from: 'requester', verb: 'submitted', to: 'request' },
      { from: 'request', verb: 'recorded in', to: 'source' },
      ...fieldNodes.slice(0, 3).map(n => ({ from: 'request', verb: 'has', to: n.id })),
      ...attachmentNodes.map(n => ({ from: 'request', verb: 'includes', to: n.id })),
    ],
    evidence: [
      { id: 'E1', label: 'Request record and supplied fields', source: `${r.id} · Sample source payload` },
      { id: 'E2', label: 'Workflow actors and handoffs', source: `${r.audit.length} sample/session audit events` },
      { id: 'E3', label: 'Source attachments', source: r.attachments.length ? `${r.attachments.length} sample source files` : 'No attachment supplied' },
    ],
  };
}
