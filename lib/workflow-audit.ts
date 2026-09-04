/** Shared event shape for the UI and future source adapters. Production events
 * must be written by the server and reconciled with their source system. */
export type WorkflowActor = {
  id: string;
  name: string;
  kind: 'human' | 'agent' | 'system';
};

export type WorkflowEvent = {
  id: string;
  requestId: string;
  occurredAt: string;
  actor: WorkflowActor;
  action: string;
  summary: string;
  outcome: 'completed' | 'attention' | 'waiting';
  source: string;
  evidence: string;
  version: string;
  provenance: 'sample' | 'session' | 'source';
  fromStatus?: string;
  toStatus?: string;
  note?: string;
  agentRun?: {
    id: string;
    delegatedBy: string;
    scope: string;
    tool: string;
    handoff: string;
  };
};
