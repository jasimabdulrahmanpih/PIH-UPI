'use client';
import { useState } from 'react';
import { ArrowRight, Bot, CornerDownLeft, Network, Sparkles, X } from 'lucide-react';
import type { Request } from '@/lib/demo-data';
import { apps } from '@/lib/demo-data';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { demoOntology, type RequestOntology } from '@/lib/ontology-contract';

type Message = { id: string; role: 'user' | 'assistant'; text: string; evidence?: string[] };

function answerFor(r: Request, ontology: RequestOntology, question: string) {
  const q = question.toLowerCase();
  const fields = ontology.nodes.filter(n => n.id.startsWith('field-')).map(n => [n.label, n.value]);
  if (/who|related|entity|people|vendor|counterparty/.test(q)) {
    return { text: `${r.name} submitted this ${r.department} request. ${fields.slice(0, 2).map(([k,v]) => `${k} is ${v}`).join('; ')}. These relationships come from the request ontology, not an inference about PIH’s wider organization.`, evidence: ['E1'] };
  }
  if (/agent|autom|workflow|audit/.test(q)) {
    const agents = r.audit.filter(e => e.actor.kind === 'agent');
    return { text: agents.length ? `${agents.map(e => `${e.actor.name}: ${e.action}`).join(' ')} The audit trail records each agent’s allowed scope and human handoff; the final decision remains with the assigned person.` : `No agent step is recorded for this sample request. The workflow shows ${r.audit.length} human or system events, and the decision remains with the assigned person.`, evidence: ['E2'] };
  }
  if (/risk|missing|need|policy|check|verify|gap|concern/.test(q)) {
    const gap = r.id === 'PR-2026-0842' ? 'Comparison quotes and unposted commitments are missing.' : r.app === 1 ? 'Team overlap and the covering colleague’s acceptance are not verified.' : r.app === 2 ? 'The full agreement and source signing session are required.' : 'Only the supplied request fields are available; supporting policy evidence is not connected.';
    return { text: `${gap} I would keep this as a human verification point before acting.`, evidence: ['E1', 'E2'] };
  }
  if (/cost|amount|budget|value|balance/.test(q)) {
    const values = fields.filter(([k]) => /budget|value|balance|cost|term|duration/i.test(k)).map(([k,v]) => `${k}: ${v}`);
    return { text: `${r.amount} is the recorded request scope.${values.length ? ` Related context: ${values.join('; ')}.` : ''} No additional financial commitments are available in this sample.`, evidence: ['E1'] };
  }
  return { text: `${r.title} is a ${apps[r.app].category.toLowerCase()} request from ${r.name}, currently ${r.status.toLowerCase()}. Its recorded scope is ${r.amount}. Ask about relationships, risks, workflow agents or value for a more focused answer.`, evidence: ['E1', 'E2'] };
}

export default function ContextAssistant({ request: r }: { request: Request }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const ontology = demoOntology(r);
  const suggestions = r.app === 0 ? ['What is missing before approval?', 'Who and what is related?', 'What did an agent do?'] : r.app === 2 ? ['What still needs human action?', 'Explain the signing workflow', 'Who and what is related?'] : ['Summarize this request', 'What should I verify?', 'Show the workflow context'];
  function ask(question: string) {
    const q = question.trim(); if (!q) return;
    const response = answerFor(r, ontology, q);
    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'user', text: q }, { id: crypto.randomUUID(), role: 'assistant', text: response.text, evidence: response.evidence }]);
    setInput(''); setOpen(true);
  }
  return <section id="request-ai" className={'context-assistant '+(open?'open':'')} aria-label="AI context assistant">
    <button className="assistant-launch" onClick={() => setOpen(v => !v)} aria-expanded={open}>
      <span className="assistant-mark"><Sparkles size={17}/></span><span><b>Ask PIH Context</b><small>Understand this request through its people, systems and evidence.</small></span>
      <span className="assistant-state">{open ? <X size={17}/> : <><span>Open</span><ArrowRight size={16}/></>}</span>
    </button>
    {open && <div className="assistant-body">
      <div className="ontology-strip"><Network size={16}/><div><span>CONTEXT MAP · {ontology.schema}</span><div>{ontology.relations.slice(0,3).map((rel,i)=><span key={i}>{ontology.nodes.find(n=>n.id===rel.from)?.type} <i>{rel.verb}</i> {ontology.nodes.find(n=>n.id===rel.to)?.type}</span>)}</div></div></div>
      <div className="assistant-source"><span className="live-dot"/><b>Sample ontology loaded</b><span>External AI source adapter · Not connected</span></div>
      <Accordion className="ontology-inspect"><AccordionItem value="ontology"><AccordionTrigger>Inspect connected context <span>{ontology.nodes.length} concepts</span></AccordionTrigger><AccordionContent><dl>{ontology.nodes.map(n=><div key={n.id}><dt>{n.type}</dt><dd><b>{n.id.startsWith('field-')?n.value:n.label}</b>{!n.id.startsWith('field-')&&<span>{n.value}</span>}</dd></div>)}</dl><div className="ontology-evidence">{ontology.evidence.map(e=><p key={e.id}><b>[{e.id}] {e.label}</b><span>{e.source}</span></p>)}</div></AccordionContent></AccordionItem></Accordion>
      {messages.length === 0 ? <div className="assistant-welcome"><Bot size={18}/><p>I can connect the facts on this request, its workflow history and missing evidence. My answers stay within the sample context shown here.</p></div> : <div className="assistant-messages" aria-live="polite">{messages.map(m=><div key={m.id} className={'assistant-message '+m.role}><span>{m.role==='assistant'?'PIH Context':'You'}</span><p>{m.text}</p>{m.evidence&&<div>{m.evidence.map(id=><small key={id}>[{id}] {ontology.evidence.find(e=>e.id===id)?.label}</small>)}</div>}</div>)}</div>}
      <div className="assistant-prompts">{suggestions.map(q=><button key={q} onClick={()=>ask(q)}>{q}</button>)}</div>
      <form className="assistant-input" onSubmit={e=>{e.preventDefault();ask(input)}}><input aria-label="Ask PIH Context about this request" placeholder="Ask about this request…" maxLength={2000} value={input} onChange={e=>setInput(e.target.value)}/><button aria-label="Send question" disabled={!input.trim()}><CornerDownLeft size={17}/></button></form>
      <p className="assistant-disclaimer">Demo responses from visible sample data. A production provider must enforce PIH permissions and return source citations.</p>
    </div>}
  </section>;
}
