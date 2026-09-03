/** Transport-independent contract for future server-side source connectors.
 * Do not implement enterprise credentials or authorization in browser code.
 */
export type ApprovalAction = 'approve' | 'return';
export interface Actor { subject: string; tenantId: string; }
export interface ApprovalRecord {
  source: string;
  sourceId: string;
  version: string;
  assignedTo: string;
  title: string;
  submittedAt: string;
  dueAt?: string;
  fields: Record<string, string>;
  actions: ApprovalAction[];
}
export interface Decision {
  sourceId: string;
  expectedVersion: string;
  action: ApprovalAction;
  note?: string;
  idempotencyKey: string;
}
export interface DecisionReceipt {
  sourceTransactionId: string;
  status: 'confirmed';
  confirmedAt: string;
}
export interface ApprovalConnector {
  id: string;
  listAssigned(actor: Actor, cursor?: string): Promise<{items: ApprovalRecord[]; nextCursor?: string}>;
  getRequest(actor: Actor, sourceId: string): Promise<ApprovalRecord>;
  /** Must enforce source permissions, version checks, allowed actions and idempotency.
   * Resolve only after the source confirms. Reject on conflict or unavailable source.
   */
  decide(actor: Actor, decision: Decision): Promise<DecisionReceipt>;
}
export class ConnectorRegistry {
  private connectors = new Map<string, ApprovalConnector>();
  register(connector: ApprovalConnector) {
    if (this.connectors.has(connector.id)) throw new Error('Connector already registered');
    this.connectors.set(connector.id, connector);
  }
  get(id: string) {
    const connector = this.connectors.get(id);
    if (!connector) throw new Error('Unknown source');
    return connector;
  }
  all() { return [...this.connectors.values()]; }
}
