'use client';
import { Bot, UserRound, Workflow, History, Clock, Check, TriangleAlert } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import type { Request } from '@/lib/demo-data';

const dateFormat = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Qatar', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

export default function WorkflowAudit({ request }: { request: Request }) {
  const events = request.audit;
  const agents = events.filter(e => e.actor.kind === 'agent').length;
  return <section id="workflow-audit" className="workflow-audit" aria-label="Workflow audit trail">
    <div className="audit-heading"><div><History size={19}/><h3>Workflow audit trail</h3></div><span>{events.length} events</span></div>
    <p className="audit-intro">Every handoff, with a named owner.{agents > 0 && <> Includes agent work and its boundaries.</>}</p>
    <div className="audit-legend"><span><UserRound size={13}/> People</span>{agents > 0 && <span><Bot size={14}/> Agents</span>}<span><Workflow size={13}/> Systems</span><small>Qatar time · UTC+3</small></div>
    <Accordion className="audit-timeline" multiple>
      {events.map(event => {
        const ActorIcon = event.actor.kind === 'agent' ? Bot : event.actor.kind === 'system' ? Workflow : UserRound;
        const OutcomeIcon = event.outcome === 'attention' ? TriangleAlert : event.outcome === 'waiting' ? Clock : Check;
        return <AccordionItem key={event.id} value={event.id} className={'audit-event '+event.actor.kind}>
          <span className="audit-node"><ActorIcon size={15}/></span>
          <AccordionTrigger className="audit-event-toggle">
            <span className="audit-event-copy">
              <span className="audit-actor"><b>{event.actor.name}</b><em>{event.actor.kind === 'human' ? 'Person' : event.actor.kind === 'agent' ? 'Agent' : 'System'}</em></span>
              <strong>{event.action}</strong>
              <span className="audit-summary">{event.summary}</span>
              <span className="audit-time"><time dateTime={event.occurredAt}>{dateFormat.format(new Date(event.occurredAt))}</time><span className={event.provenance === 'session' ? 'session-event' : ''}>{event.provenance === 'sample' ? 'Sample history' : event.provenance === 'session' ? 'This session' : 'Source event'}</span></span>
              <span className={'audit-outcome '+event.outcome}><OutcomeIcon size={12}/>{event.outcome === 'attention' ? 'Needs human attention' : event.outcome === 'waiting' ? 'Handoff recorded' : 'Step completed'}<span>· Details</span></span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="audit-detail">
            <dl><div><dt>Source</dt><dd>{event.source}</dd></div><div><dt>Evidence</dt><dd>{event.evidence}</dd></div><div><dt>Version</dt><dd>{event.version}</dd></div>
              {event.fromStatus && <div><dt>State change</dt><dd>{event.fromStatus} → {event.toStatus}</dd></div>}
              {event.note && <div><dt>Return reason</dt><dd>{event.note}</dd></div>}
              {event.agentRun && <><div><dt>Delegated by</dt><dd>{event.agentRun.delegatedBy}</dd></div><div><dt>Allowed scope</dt><dd>{event.agentRun.scope}</dd></div><div><dt>Tool activity</dt><dd>{event.agentRun.tool}</dd></div><div><dt>Human handoff</dt><dd>{event.agentRun.handoff}</dd></div><div><dt>Agent run</dt><dd className="audit-id">{event.agentRun.id}</dd></div></>}
              <div><dt>Event ID</dt><dd className="audit-id">{event.id}</dd></div>
            </dl>
          </AccordionContent>
        </AccordionItem>;
      })}
    </Accordion>
    <div className="audit-current"><span className="live-dot"/><p>{request.status === 'Pending' ? <><b>With you now</b> · {request.action === 'sign' ? 'Review & sign' : 'Review & decide'}</> : <><b>{request.status} in this session</b> · Source confirmation unavailable</>}</p></div>
    <p className="audit-disclaimer">Illustrative prior history + your session actions. Agents shown here are examples. This demo trail resets on reload.</p>
  </section>;
}
