'use client';
import { useState } from 'react';
import { Download, ExternalLink, File, FileSpreadsheet, FileText, Paperclip, ShieldCheck } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import type { Request, SourceAttachment } from '@/lib/demo-data';

function iconFor(kind: string) { return kind === 'XLSX' ? FileSpreadsheet : kind === 'PDF' ? FileText : File; }

export default function SourceAttachments({ request }: { request: Request }) {
  const [selected, setSelected] = useState<SourceAttachment|null>(null);
  if (!request.attachments.length) return null;
  return <section className="source-attachments" aria-label="Source attachments">
    <div className="attachment-heading"><div><Paperclip size={17}/><h3>Source attachments</h3><span>{request.attachments.length}</span></div><small>From {request.documentType === 'PR' || request.documentType === 'PO' || request.documentType === 'CBS' ? 'SAP S/4HANA' : 'source request'} · Sample files</small></div>
    <div className="attachment-list">{request.attachments.map(a => { const Icon=iconFor(a.kind); return <button key={a.id} onClick={()=>setSelected(a)} aria-label={`Preview ${a.name}`}><span className="attachment-icon"><Icon size={18}/><em>{a.kind}</em></span><span className="attachment-name"><b>{a.name}</b><small>{a.label} · {a.size}</small></span><span className="attachment-open">Preview <ExternalLink size={14}/></span></button>})}</div>
    <p className="attachment-foot"><ShieldCheck size={13}/> Source name, uploader, timestamp and version travel with each file.</p>
    <Sheet open={!!selected} onOpenChange={o=>{if(!o)setSelected(null)}}><SheetContent className="attachment-sheet"><SheetHeader><SheetTitle>{selected?.name}</SheetTitle><SheetDescription>{selected?.label} · {selected?.kind} · {selected?.size}</SheetDescription></SheetHeader>{selected&&<div className="attachment-viewer">
      <div className="attachment-provenance"><span>ORIGIN</span><b>{selected.source}</b><span>UPLOADED</span><b>{selected.uploadedBy} · {selected.uploadedAt}</b><span>VERSION</span><b>{selected.version}</b></div>
      <article className={'attachment-preview '+(selected.kind==='XLSX'?'spreadsheet':'')}><div className="preview-banner">SAMPLE SOURCE ATTACHMENT</div><span className="preview-type">{selected.preview.eyebrow}</span><h2>{selected.preview.title}</h2><p>{selected.preview.summary}</p><div className="preview-facts">{selected.preview.facts.map(([k,v])=><div key={k}><span>{k}</span><b>{v}</b></div>)}</div>{selected.preview.rows.length>0&&<div className="preview-table"><div>{selected.preview.columns.map(c=><b key={c}>{c}</b>)}</div>{selected.preview.rows.map((row,i)=><div key={i}>{row.map(cell=><span key={cell}>{cell}</span>)}</div>)}</div>}</article>
      <div className="attachment-actions"><button disabled><Download size={15}/> Download sample</button><p>Previewed inside PIH Workspace. A live connector will stream the authorized source file without creating a second master copy.</p></div>
    </div>}</SheetContent></Sheet>
  </section>;
}
