import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ChevronLeft, Pencil, Check, Trash2, Send, FileText, CheckCircle2, Copy, Link } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../store';
import { C, T, R, STATUS_FILL, formatAmount, formatDate } from '../tokens';
import { StatusPill } from '../components/StatusPill';
import { BottomSheet } from '../components/BottomSheet';
import { ConfirmModal } from '../components/ConfirmModal';
import { InvoiceSection } from '../components/InvoiceSection';
import { QuoteSection } from '../components/QuoteSection';

/* ── Inline editable field row ─────────────────────────── */
function FieldRow({ label, value, editable, onSave }: {
  label: string; value: string; editable?: boolean; onSave?: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(value);
  useEffect(() => { setDraft(value); }, [value]);

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '8px 0', borderBottom: `1px solid ${C.border}`,
      gap: 12, minWidth: 0,
    }}>
      <span style={{ fontSize: '13px', color: C.muted, flexShrink: 0, lineHeight: 1.6 }}>{label}</span>
      {editing && editable ? (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', minWidth: 0, flex: 1, justifyContent: 'flex-end' }}>
          <input
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            style={{
              fontSize: '13px', border: `1px solid ${C.black}`,
              borderRadius: R.md, padding: '2px 8px', outline: 'none',
              width: 120, textAlign: 'right', minWidth: 0,
            }}
          />
          <button
            onClick={() => { onSave?.(draft); setEditing(false); }}
            style={{
              background: C.black, border: 'none', borderRadius: R.sm,
              width: 24, height: 24, display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', color: C.white, flexShrink: 0,
            }}
          >
            <Check size={12} />
          </button>
        </div>
      ) : (
        <span
          onClick={() => editable && setEditing(true)}
          style={{
            fontSize: '13px', fontWeight: 500, color: C.black, lineHeight: 1.6,
            maxWidth: '60%', textAlign: 'right',
            cursor: editable ? 'text' : 'default',
            overflow: 'hidden', textOverflow: 'ellipsis', wordBreak: 'break-word',
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
}

/* ── Screen ─────────────────────────────────────────────── */
export default function ProjectDetail() {
  const { id }                                                 = useParams<{ id: string }>();
  const { projects, updateProject, advanceStatus, deleteProject, isOverdue } = useApp();
  const navigate                                               = useNavigate();

  const [showStatusSheet, setShowStatusSheet] = useState(false);
  const [showSwipeHint, setShowSwipeHint]     = useState(true);
  const [showDelete, setShowDelete]           = useState(false);
  const [showClear, setShowClear]             = useState(false);
  const [copied, setCopied]                   = useState<'quote' | 'invoice' | null>(null);

  const project = projects.find(p => p.id === id);

  useEffect(() => {
    if (!project) navigate('/projects', { replace: true });
  }, [project, navigate]);

  if (!project) return null;

  const overdue = isOverdue(project);

  // Next status for swipe hint colour
  const STATUS_ORDER = ['ready', 'in-progress', 'invoiced', 'cleared'];
  const currentIdx   = STATUS_ORDER.indexOf(project.status);
  const nextStatus   = currentIdx >= 0 && currentIdx < STATUS_ORDER.length - 1
    ? STATUS_ORDER[currentIdx + 1] : null;
  const hintBg       = nextStatus ? STATUS_FILL[nextStatus] : C.surface;

  // Action handlers
  // Quoting: send quote to client (sets sentAt, stays Quoting)
  const handleSendQuote = () => {
    updateProject(project.id, { sentAt: new Date().toISOString() });
  };
  // Quoting: client confirmed — move to In Progress
  const handleMarkQuoteAccepted = () => {
    updateProject(project.id, { status: 'in-progress' });
  };
  // In Progress: work done — generate invoice as Draft (no invoiceSentAt yet)
  const handleGenerateInvoice = () => {
    updateProject(project.id, { status: 'invoiced' });
  };
  // Invoiced: send invoice link to client
  const handleSendInvoice = () => {
    updateProject(project.id, { invoiceSentAt: new Date().toISOString() });
  };
  // Invoiced: mark payment received
  const handleClear = () => {
    updateProject(project.id, { status: 'cleared' });
    setShowClear(false);
  };
  const handleDelete = () => {
    deleteProject(project.id);
    navigate('/projects');
  };

  // Copy shareable links to clipboard
  const copyLink = (type: 'quote' | 'invoice') => {
    const path = type === 'quote' ? `/q/${project.id}` : `/i/${project.id}`;
    const url = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  // Bottom bar visibility
  const showBottom = project.status !== 'cleared' && project.status !== 'archived';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', position: 'relative', overflow: 'hidden', background: C.surface }}>

      {/* ── Top bar ─────────────────────────────────── */}
      <nav style={{
        background: C.black,
        padding: `calc(env(safe-area-inset-top, 0px) + 14px) 16px 12px`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10, flexShrink: 0, minHeight: 52,
      }}>
        <button
          onClick={() => navigate('/projects')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.white, minWidth: 44, minHeight: 44,
            display: 'flex', alignItems: 'center', padding: 0,
          }}
          aria-label="Go back"
        >
          <ChevronLeft size={24} />
        </button>

        <span style={{
          fontSize: '15px', fontWeight: 600, color: C.white, lineHeight: 1.4,
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {project.clientName}
        </span>

        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <button
            onClick={() => setShowDelete(true)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.45)', minWidth: 36, minHeight: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Delete project"
          >
            <Trash2 size={16} />
          </button>
          <div onClick={(e) => { e.stopPropagation(); setShowStatusSheet(true); }}>
            <StatusPill status={project.status} interactive onClick={() => setShowStatusSheet(true)} />
          </div>
        </div>
      </nav>

      {/* ── Scroll area ─────────────────────────────── */}
      <main style={{ flex: 1, padding: '12px 16px', paddingBottom: showBottom ? 88 : 32, overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Project section card */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: R.xl, padding: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted }}>
                Project details
              </span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {overdue && (
                  <span style={{
                    fontSize: '10px', fontWeight: 700, color: C.black,
                    background: C.yellow, padding: '2px 8px', borderRadius: R.pill,
                  }}>
                    Overdue
                  </span>
                )}
                <Pencil size={12} color={C.muted} />
              </div>
            </div>

            <FieldRow label="Client"         value={project.clientName}                    editable onSave={v => updateProject(project.id, { clientName: v })} />
            <FieldRow label="Type"           value={project.type}                          editable onSave={v => updateProject(project.id, { type: v })} />
            <FieldRow label="Quoted amount"  value={formatAmount(project.amount, project.currency)} editable
              onSave={v => {
                const num = parseFloat(v.replace(/[^0-9.]/g, ''));
                if (!isNaN(num)) updateProject(project.id, { amount: num });
              }}
            />
            <FieldRow label="Currency"       value={project.currency} />
            <FieldRow label="Started"        value={formatDate(project.startDate)} />
            {project.dueDate && (
              <FieldRow label="Due date" value={formatDate(project.dueDate)} />
            )}
            {project.notes && (
              <div style={{ padding: '8px 0' }}>
                <span style={{ fontSize: '11px', color: C.muted, display: 'block', marginBottom: 4 }}>Notes</span>
                <span style={{ fontSize: '13px', color: C.black, lineHeight: 1.6 }}>{project.notes}</span>
              </div>
            )}
          </div>

          {/* Invoice / Quote section */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: R.xl, padding: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted }}>
                {project.status === 'ready' ? 'Quote' : 'Invoice'}
              </span>
              {project.sentAt && project.status !== 'ready' && (
                <span style={{ fontSize: '11px', color: C.muted }}>
                  Sent {formatDate(project.sentAt, 'short')}
                </span>
              )}
            </div>
            {project.status === 'ready' ? (
              <QuoteSection
                project={project}
                onUpdate={(updates) => updateProject(project.id, updates)}
              />
            ) : (
              <InvoiceSection
                project={project}
                onUpdate={(updates) => updateProject(project.id, updates)}
              />
            )}
          </div>

        </div>
      </main>

      {/* ── Context-aware bottom action bar ─────────── */}
      <AnimatePresence>
        {showBottom && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: `12px 16px calc(24px + env(safe-area-inset-bottom, 0px))`,
              background: C.white, borderTop: `1px solid ${C.border}`,
              zIndex: 20, display: 'flex', flexDirection: 'column', gap: 8,
            }}
          >
            {/* Quoting stage */}
            {project.status === 'ready' && (
              <>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={handleSendQuote}
                    style={{ ...(!project.sentAt ? accentBtn(C.quoting) : secondaryBtn()), flex: 1 }}
                  >
                    <Send size={15} />
                    {!project.sentAt ? 'Send quote' : 'Resend quote'}
                  </button>
                  {project.sentAt && (
                    <button onClick={() => copyLink('quote')} style={iconBtn()} title="Copy quote link" aria-label="Copy quote link">
                      {copied === 'quote' ? <Check size={16} /> : <Link size={16} />}
                    </button>
                  )}
                </div>
                <button onClick={handleMarkQuoteAccepted} style={primaryBtn()}>
                  <CheckCircle2 size={15} /> Mark quote accepted
                </button>
              </>
            )}

            {/* In progress stage */}
            {project.status === 'in-progress' && (
              <button onClick={handleGenerateInvoice} style={primaryBtn()}>
                <FileText size={15} /> Generate invoice
              </button>
            )}

            {/* Invoiced stage */}
            {project.status === 'invoiced' && (
              <>
                {!project.invoiceSentAt ? (
                  /* Draft — not yet sent */
                  <button onClick={handleSendInvoice} style={accentBtn(C.invoiced)}>
                    <Send size={15} /> Send invoice
                  </button>
                ) : (
                  /* Sent — resend + clear */
                  <>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={handleSendInvoice} style={{ ...secondaryBtn(), flex: 1 }}>
                        <Send size={15} /> Resend invoice
                      </button>
                      <button onClick={() => copyLink('invoice')} style={iconBtn()} title="Copy invoice link" aria-label="Copy invoice link">
                        {copied === 'invoice' ? <Check size={16} /> : <Link size={16} />}
                      </button>
                    </div>
                    <button onClick={() => setShowClear(true)} style={accentBtn(C.cleared)}>
                      <CheckCircle2 size={15} /> Mark as cleared
                    </button>
                  </>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete confirmation ──────────────────────── */}
      <ConfirmModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        icon={<Trash2 size={22} color={C.danger} strokeWidth={2} />}
        iconBg={C.dangerLight}
        title="Delete project?"
        description={`This will permanently delete ${project.clientName} — ${project.type}. This cannot be undone.`}
        confirmLabel="Delete"
        confirmBg={C.danger}
        confirmTextColor={C.white}
        confirmIcon={<Trash2 size={15} />}
        onConfirm={handleDelete}
      />

      {/* ── Clear confirmation ───────────────────────── */}
      <ConfirmModal
        open={showClear}
        onClose={() => setShowClear(false)}
        icon={<CheckCircle2 size={22} color={C.black} strokeWidth={2} />}
        iconBg={C.cleared}
        title="Mark as cleared?"
        description="This means the invoice has been paid and everything is wrapped up."
        confirmLabel="Yes, clear it"
        confirmBg={C.cleared}
        confirmTextColor={C.black}
        confirmIcon={<CheckCircle2 size={15} />}
        onConfirm={handleClear}
      />

      {/* ── Status bottom sheet ──────────────────────── */}
      <BottomSheet
        open={showStatusSheet}
        onClose={() => setShowStatusSheet(false)}
        title={project.clientName}
        currentStatus={project.status}
        onSelectStatus={(status) => updateProject(project.id, { status })}
      />
    </div>
  );
}

/* ── Button style helpers ──────────────────────────────── */
function primaryBtn(): React.CSSProperties {
  return {
    width: '100%', height: 48, background: C.black, color: C.white,
    border: `1.5px solid ${C.black}`, borderRadius: R.xl,
    cursor: 'pointer', fontSize: '14px', fontWeight: 700,
    letterSpacing: '-0.01em', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 8,
  };
}
function secondaryBtn(): React.CSSProperties {
  return {
    width: '100%', height: 48, background: C.white, color: C.black,
    border: `1.5px solid ${C.black}`, borderRadius: R.xl,
    cursor: 'pointer', fontSize: '14px', fontWeight: 700,
    letterSpacing: '-0.01em', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 8,
  };
}
function accentBtn(fill: string): React.CSSProperties {
  return {
    width: '100%', height: 48, background: fill, color: C.black,
    border: `1.5px solid ${C.black}`, borderRadius: R.xl,
    cursor: 'pointer', fontSize: '14px', fontWeight: 700,
    letterSpacing: '-0.01em', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 8,
  };
}
function iconBtn(): React.CSSProperties {
  return {
    width: 48, height: 48, background: C.white, color: C.black,
    border: `1.5px solid ${C.black}`, borderRadius: R.xl,
    cursor: 'pointer', fontSize: '14px', fontWeight: 700,
    letterSpacing: '-0.01em', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 8,
  };
}