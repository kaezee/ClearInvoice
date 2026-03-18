import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ChevronLeft, Check, Trash2, Send, FileText, CheckCircle2, Link, Calendar, X } from 'lucide-react';
import { DarkNavBtn } from '../components/ui/CircleIconBtn';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../store';
import { C, T, R, STATUS_FILL, formatAmount, formatDate } from '../tokens';
import { StatusPill } from '../components/StatusPill';
import { BottomSheet } from '../components/BottomSheet';
import { ConfirmModal } from '../components/ConfirmModal';
import { DeleteModal } from '../components/DeleteModal';
import { InvoiceSection } from '../components/InvoiceSection';
import { QuoteSection } from '../components/QuoteSection';
import { Project, QuoteRevision, Contact } from '../types';
import { ServicesSection, ServiceItem } from '../components/ui/ServicesSection';

/* ── Locked fields per status ──────────────────────────── */
const LOCKED_FIELDS: Record<string, string[]> = {
  'ready':       [],
  'in-progress': ['currency', 'depositAmount', 'startDate'],
  'invoiced':    ['amount', 'currency', 'depositAmount', 'startDate', 'dueDate'],
  'cleared':     [],
  'archived':    [],
};

const LOCK_NOTES: Record<string, Record<string, string>> = {
  'in-progress': {
    currency:      'Currency is fixed once a project has started',
    depositAmount: 'Deposit was agreed at quoting',
    startDate:     "Start date can't be changed once a project has begun",
  },
  'invoiced': {
    amount:  'Amount is locked once an invoice has been generated',
    dueDate: 'Due date is set on the invoice',
  },
};

const CURRENCIES = ['GBP', 'USD', 'EUR', 'INR', 'AUD', 'CAD'];
const EDIT_CURRENCIES = ['GBP', 'USD', 'EUR', 'INR'];

function currSym(c: string): string {
  const m: Record<string, string> = { GBP: '£', USD: '$', EUR: '€', INR: '₹', AUD: 'A$', CAD: 'C$' };
  return m[c] || c;
}

/* ── Time-ago helper ────────────────────────────────────── */
function timeAgo(iso: string): string {
  const ms    = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(ms / 3_600_000);
  if (hours < 1)  return 'just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/* ── Draft shape ────────────────────────────────────────── */
interface Draft {
  clientName:         string;
  clientEmail:        string;
  contactPerson:      string;
  additionalContacts: Contact[];
  services:           ServiceItem[];
  amount:             string;
  currency:           string;
  depositAmount:      string;
  startDate:          string;
  dueDate:            string;
  notes:              string;
}

function toDraft(p: Project): Draft {
  return {
    clientName:         p.clientName    || '',
    clientEmail:        p.clientEmail   || '',
    contactPerson:      p.contactPerson || '',
    additionalContacts: p.additionalContacts || [],
    services:           p.services      || [],
    amount:             String(p.amount || 0),
    currency:           p.currency      || 'GBP',
    depositAmount:      p.depositAmount ? String(p.depositAmount) : '',
    startDate:          p.startDate     || '',
    dueDate:            p.dueDate       || '',
    notes:              p.notes         || '',
  };
}

/* ── Lock icon ──────────────────────────────────────────── */
function LockSvg() {
  return (
    <svg width="10" height="11" viewBox="0 0 10 11" fill="none" style={{ flexShrink: 0 }}>
      <rect x="1" y="4.5" width="8" height="6" rx="1" stroke={C.disabled} strokeWidth="1.3" fill="none"/>
      <path d="M3 4.5V3a2 2 0 0 1 4 0v1.5" stroke={C.disabled} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Display field row (view mode) ─────────────────────── */
function DisplayRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 0', borderBottom: `1px solid ${C.border}`,
      gap: 12, minWidth: 0,
    }}>
      <span style={{ fontSize: '13px', color: C.muted, flexShrink: 0, lineHeight: 1.6 }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 500, color: C.black, lineHeight: 1.6, maxWidth: '60%', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {value}
      </span>
    </div>
  );
}

/* ── Editable field row (edit mode, active state) ──────── */
function EditableRow({
  label, value, type = 'text', onChange, prefix,
}: {
  label: string; value: string; type?: string; onChange: (v: string) => void; prefix?: string;
}) {
  const base: React.CSSProperties = {
    background: 'transparent', border: 'none',
    borderBottom: `1px solid ${C.border}`,
    outline: 'none', fontFamily: 'inherit',
    fontSize: '13px', fontWeight: 500, color: C.black,
    padding: '2px 0', width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 120ms',
  };

  return (
    <div style={{ padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
      <label style={{
        fontSize: '10px', fontWeight: 600, color: C.muted,
        display: 'block', marginBottom: 4,
      }}>
        {label}
      </label>

      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={3}
          style={{ ...base, resize: 'none', lineHeight: 1.6, paddingTop: 4 }}
          onFocus={e => (e.currentTarget.style.borderBottomColor = C.black)}
          onBlur={e  => (e.currentTarget.style.borderBottomColor = C.border)}
        />
      ) : type === 'date' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
            type="date"
            value={value}
            onChange={e => onChange(e.target.value)}
            style={{ ...base, flex: 1, cursor: 'pointer' }}
            onFocus={e => (e.currentTarget.style.borderBottomColor = C.black)}
            onBlur={e  => (e.currentTarget.style.borderBottomColor = C.border)}
          />
          <Calendar size={14} color={C.muted} style={{ flexShrink: 0, pointerEvents: 'none' }} />
        </div>
      ) : type === 'select' ? (
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ ...base, cursor: 'pointer', appearance: 'none', paddingRight: 20 }}
          onFocus={e => (e.currentTarget.style.borderBottomColor = C.black)}
          onBlur={e  => (e.currentTarget.style.borderBottomColor = C.border)}
        >
          {EDIT_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {prefix && <span style={{ fontSize: '13px', color: C.muted, flexShrink: 0 }}>{prefix}</span>}
          <input
            type={type === 'number' ? 'text' : type === 'email' ? 'email' : 'text'}
            inputMode={type === 'number' ? 'decimal' : undefined}
            value={value}
            onChange={e => onChange(e.target.value)}
            style={{ ...base, flex: 1 }}
            onFocus={e => (e.currentTarget.style.borderBottomColor = C.black)}
            onBlur={e  => (e.currentTarget.style.borderBottomColor = C.border)}
          />
        </div>
      )}
    </div>
  );
}

/* ── Locked field row (edit mode, read-only) ────────────── */
function LockedRow({ label, value, lockNote }: { label: string; value: string; lockNote?: string }) {
  return (
    <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '8px 0', paddingLeft: 2, paddingRight: 2 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: T.sm.fontSize, color: C.disabled, flexShrink: 0, lineHeight: 1.6 }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: T.sm.fontSize, color: C.disabled, textAlign: 'right' }}>{value || '—'}</span>
          <LockSvg />
        </div>
      </div>
      {lockNote && (
        <p style={{ fontSize: T.label.fontSize, color: C.disabled, margin: '3px 0 0', lineHeight: 1.5 }}>{lockNote}</p>
      )}
    </div>
  );
}

/* ── Formatted amount edit row ──────────────────────────── */
function AmountEditRow({ label, value, onChange, prefix, footer }: {
  label: string; value: string; onChange: (v: string) => void; prefix?: string;
  footer?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);

  const formatted = (() => {
    const n = parseFloat(value);
    return !isNaN(n) && n > 0 ? n.toLocaleString() : value;
  })();

  const base: React.CSSProperties = {
    background: 'transparent', border: 'none',
    borderBottom: `1px solid ${C.border}`,
    outline: 'none', fontFamily: 'inherit',
    fontSize: '13px', fontWeight: 500, color: C.black,
    padding: '2px 0', flex: 1,
    boxSizing: 'border-box',
    transition: 'border-color 120ms',
  };

  return (
    <div style={{ borderBottom: footer ? 'none' : undefined }}>
      <div style={{ padding: '10px 0', borderBottom: footer ? 'none' : `1px solid ${C.border}` }}>
        <label style={{
          fontSize: '10px', fontWeight: 600, color: C.muted,
          display: 'block', marginBottom: 4,
        }}>
          {label}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {prefix && <span style={{ fontSize: '13px', color: C.muted, flexShrink: 0 }}>{prefix}</span>}
          <input
            type="text"
            inputMode="decimal"
            value={focused ? value : formatted}
            onChange={e => {
              const raw = e.target.value.replace(/,/g, '');
              onChange(raw);
            }}
            onFocus={e => {
              setFocused(true);
              e.currentTarget.style.borderBottomColor = C.black;
            }}
            onBlur={e => {
              setFocused(false);
              e.currentTarget.style.borderBottomColor = C.border;
            }}
            style={base}
          />
        </div>
      </div>
      {footer && (
        <div style={{ paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>
          {footer}
        </div>
      )}
    </div>
  );
}

/* ── Category tags ─────────────────────────────────────── */
function CategoryTags({
  tags, onChange, editMode,
}: {
  tags: string[]; onChange?: (t: string[]) => void; editMode: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [input, setInput]   = useState('');

  const commit = () => {
    const v = input.trim();
    if (v && tags.length < 5 && !tags.includes(v)) onChange?.([...tags, v]);
    setInput('');
    setAdding(false);
  };

  if (!editMode) {
    if (!tags.length) return null;
    return (
      <div style={{ padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
        <span style={{ fontSize: T.sm.fontSize, color: C.muted, display: 'block', marginBottom: 6 }}>Categories</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {tags.map((t, i) => (
            <span key={i} style={{
              background: C.surface, border: `1.5px solid ${C.disabled}`, borderRadius: 16,
              fontSize: T.xs.fontSize, fontWeight: 600, color: C.muted, padding: '4px 12px',
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
      <label style={{
        fontSize: '10px', fontWeight: 600, color: C.muted,
        display: 'block', marginBottom: 8,
      }}>
        Categories
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        {tags.map((t, i) => (
          <span key={i} style={{
            background: '#F0F0F0', border: `1.5px solid #C4C4C4`, borderRadius: 16,
            fontSize: '11px', fontWeight: 600, color: '#6B6B6B',
            padding: '4px 8px 4px 12px',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            {t}
            <button
              onClick={() => onChange?.(tags.filter((_, j) => j !== i))}
              onMouseEnter={e => (e.currentTarget.style.color = C.danger)}
              onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#9CA3AF', padding: 0, display: 'flex', alignItems: 'center',
                lineHeight: 1, transition: 'color 150ms',
              }}
            >
              <X size={12} />
            </button>
          </span>
        ))}

        {tags.length < 5 && (
          adding ? (
            <input
              autoFocus
              value={input}
              onChange={e => setInput(e.target.value)}
              onBlur={commit}
              onKeyDown={e => {
                if (e.key === 'Enter') commit();
                if (e.key === 'Escape') { setInput(''); setAdding(false); }
              }}
              placeholder="Add, enter"
              style={{
                border: `1px dashed ${C.border}`, borderRadius: 16,
                fontSize: '11px', fontWeight: 500, color: C.black,
                padding: '4px 12px', outline: 'none',
                background: 'transparent', width: 100,
              }}
            />
          ) : (
            <button
              onClick={() => setAdding(true)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.black; e.currentTarget.style.color = C.black; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.borderStrong; }}
              style={{
                border: `1px dashed ${C.border}`, borderRadius: 16,
                fontSize: T.xs.fontSize, fontWeight: 500, color: C.borderStrong,
                padding: '4px 12px', background: 'transparent', cursor: 'pointer',
                transition: 'border-color 150ms, color 150ms',
              }}
            >
              + Add
            </button>
          )
        )}

        {tags.length >= 5 && (
          <span style={{ fontSize: T.label.fontSize, color: C.disabled }}>Maximum 5 categories</span>
        )}
      </div>
    </div>
  );
}

/* ── Screen ─────────────────────────────────────────────── */
export default function ProjectDetail() {
  const { id }     = useParams<{ id: string }>();
  const { projects, updateProject, deleteProject, isOverdue, invoiceDefaults, updateInvoiceDefaults, archiveProject } = useApp();
  const navigate   = useNavigate();

  const goBack = () => {
    // navigate(-1) pops back to whatever was before ProjectDetail:
    //   • Active/Cleared tab on /projects  → back to /projects ✓
    //   • Archived sheet (URL was /projects) → back to /projects (sheet reopens via sessionStorage) ✓
    //   • Real /archived route             → back to /archived ✓
    if ((window.history.state as any)?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/projects');
    }
  };

  const [showStatusSheet, setShowStatusSheet] = useState(false);
  const [showDelete, setShowDelete]           = useState(false);
  const [showClear, setShowClear]             = useState(false);
  const [copied, setCopied]                   = useState<'quote' | 'invoice' | null>(null);
  const [editMode, setEditMode]               = useState(false);
  const [amountIsCustom, setAmountIsCustom]   = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [draft, setDraft]                     = useState<Draft>(() => ({
    clientName: '', clientEmail: '', contactPerson: '', additionalContacts: [],
    services: [], amount: '0', currency: 'GBP',
    depositAmount: '', startDate: '', dueDate: '', notes: '',
  }));
  const [savedDraft, setSavedDraft] = useState<Draft>(draft);

  const project = projects.find(p => p.id === id);

  useEffect(() => {
    if (!project) navigate('/projects', { replace: true });
  }, [project, navigate]);

  if (!project) return null;

  const overdue    = isOverdue(project);
  const locked     = LOCKED_FIELDS[project.status] || [];

  /* Amount is also locked in 'ready' status if the quote has been sent */
  const isLocked = (f: string) => {
    if (f === 'amount' && project.status === 'ready' && !!project.sentAt) return true;
    return locked.includes(f);
  };

  const getLockNote = (f: string) => {
    if (f === 'amount' && project.status === 'ready' && project.sentAt)
      return 'Quoted amount is locked after the quote has been sent';
    return LOCK_NOTES[project.status]?.[f];
  };

  const sym        = currSym(draft.currency || project.currency);

  const showBottom  = project.status !== 'cleared' && project.status !== 'archived';
  const showEditBtn = project.status !== 'cleared' && project.status !== 'archived';

  /* ── Edit mode handlers ─────────────────────────────── */
  const openEdit = () => {
    const d = toDraft(project);
    // Detect whether the stored amount was already a manual override
    const svcTotal = (project.services || []).reduce((sum, s) => sum + s.price, 0);
    setAmountIsCustom((project.services || []).length > 0 && project.amount !== svcTotal);
    setDraft(d);
    setSavedDraft(d);
    setEditMode(true);
  };

  const cancelEdit = () => {
    setDraft(savedDraft);
    setAmountIsCustom(false);
    setEditMode(false);
  };

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(savedDraft);

  const handleSave = () => {
    if (!hasChanges) { setEditMode(false); return; }
    const hasSentDoc = !!project.sentAt || !!project.invoiceSentAt;
    // Sync invoiceItems from services whenever there is no locked sent document
    const updatedItems =
      !hasSentDoc && draft.services.length > 0
        ? draft.services.map((s, i) => ({ id: String(i + 1), description: s.name, amount: s.price }))
        : undefined;
    updateProject(project.id, {
      clientName:         draft.clientName,
      clientEmail:        draft.clientEmail   || undefined,
      contactPerson:      draft.contactPerson || undefined,
      additionalContacts: draft.additionalContacts.length ? draft.additionalContacts : undefined,
      services:           draft.services.length ? draft.services : undefined,
      amount:        parseFloat(draft.amount) || project.amount,
      currency:      draft.currency,
      depositAmount: draft.depositAmount ? parseFloat(draft.depositAmount) : undefined,
      startDate:     draft.startDate,
      dueDate:       draft.dueDate || undefined,
      notes:         draft.notes   || undefined,
      ...(updatedItems ? { invoiceItems: updatedItems } : {}),
    });
    setAmountIsCustom(false);
    setEditMode(false);
  };

  const setField    = (k: keyof Draft) => (v: string) => setDraft(prev => ({ ...prev, [k]: v }));

  /* Services change → auto-recalc amount unless manually overridden */
  const setServices = (svcs: ServiceItem[]) => {
    setDraft(prev => {
      const total = svcs.reduce((sum, s) => sum + s.price, 0);
      return {
        ...prev,
        services: svcs,
        ...(amountIsCustom ? {} : { amount: total > 0 ? String(total) : '0' }),
      };
    });
  };

  /* ── Action handlers (unchanged) ───────────────────── */
  const handleSendQuote         = () => updateProject(project.id, { sentAt: new Date().toISOString() });
  const handleMarkQuoteAccepted = () => updateProject(project.id, { status: 'in-progress' });
  const handleGenerateInvoice   = () => updateProject(project.id, { status: 'invoiced' });
  const handleSendInvoice       = () => updateProject(project.id, { invoiceSentAt: new Date().toISOString() });
  const handleClear             = () => { updateProject(project.id, { status: 'cleared' }); setShowClear(false); };
  const handleDelete            = () => { deleteProject(project.id); navigate('/projects'); };
  const handleArchiveInstead    = () => { archiveProject(project.id); navigate('/projects'); };

  /* ── Revise quote: save current version, create new draft ── */
  const handleReviseQuote = () => {
    const currentVersion = project.quoteVersion ?? 1;
    const currentRef = `QUO-${String(currentVersion).padStart(3, '0')}`;
    const revision: QuoteRevision = {
      quoteNumber: currentRef,
      sentAt: project.sentAt!,
      items: [...project.invoiceItems],
      supersededAt: new Date().toISOString(),
    };
    updateProject(project.id, {
      quoteRevisions: [...(project.quoteRevisions ?? []), revision],
      quoteVersion: currentVersion + 1,
      sentAt: undefined,
      viewedAt: undefined,
      expiryDate: undefined,
    });
  };

  const copyLink = (type: 'quote' | 'invoice') => {
    const path = type === 'quote' ? `/q/${project.id}` : `/i/${project.id}`;
    navigator.clipboard.writeText(`${window.location.origin}${path}`).catch(() => {});
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', position: 'relative', overflow: 'hidden', background: C.surface }}>

      {/* ── Top bar ─────────────────────────────────── */}
      <nav style={{
        background: C.black,
        padding: `calc(env(safe-area-inset-top, 0px) + 14px) 16px 12px`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10, flexShrink: 0, minHeight: 52,
      }}>
        {editMode ? (
          <>
            {/* Cancel */}
            <NavCancelBtn onClick={cancelEdit} />

            {/* Centre title */}
            <span style={{
              fontSize: '15px', fontWeight: 600, color: C.white,
              letterSpacing: '-0.01em',
              position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            }}>
              Edit project
            </span>

            {/* Save */}
            <NavSaveBtn onClick={handleSave} disabled={!hasChanges} />
          </>
        ) : (
          <>
            {/* ‹ Dark context back — 20px icon, 44×44 circle */}
            <DarkNavBtn onClick={goBack} ariaLabel="Go back">
              <ChevronLeft size={20} strokeWidth={2.5} />
            </DarkNavBtn>

            {/* Client name */}
            <span style={{
              fontSize: '15px', fontWeight: 600, color: C.white, lineHeight: 1.4,
              position: 'absolute', left: '50%', transform: 'translateX(-50%)',
              maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {project.clientName}
            </span>

            {/* Right: delete + status */}
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {/* Trash — dark context, dimmed: opacity 0.45 rest / 0.75 hover */}
              <DarkNavBtn onClick={() => setShowDelete(true)} ariaLabel="Delete project" dimmed>
                <Trash2 size={16} />
              </DarkNavBtn>
              <div onClick={(e) => { e.stopPropagation(); setShowStatusSheet(true); }}>
                <StatusPill status={project.status} interactive onClick={() => setShowStatusSheet(true)} />
              </div>
            </div>
          </>
        )}
      </nav>

      {/* ── Scroll area ─────────────────────────────── */}
      <main style={{ flex: 1, padding: '12px 16px', paddingBottom: showBottom ? 88 : 32, overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* ── Project details card ─────────────────── */}
          <div style={{
            background: C.card,
            border: editMode ? `1.5px solid ${C.black}` : `1px solid ${C.border}`,
            borderRadius: '8px', padding: 16,
            transition: 'border-color 200ms',
          }}>
            {/* Section header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted }}>
                Project details
              </span>
              {overdue && (
                <span style={{ fontSize: '10px', fontWeight: 700, color: C.black, background: C.yellow, padding: '2px 8px', borderRadius: R.pill }}>
                  Overdue
                </span>
              )}
            </div>

            {/* Invoiced edit mode: yellow notice banner */}
            {editMode && project.status === 'invoiced' && (
              <div style={{
                background: C.yellowLight, border: `1px solid ${C.yellow}`,
                borderRadius: '8px', padding: '10px 14px', marginBottom: 14,
              }}>
                <p style={{ fontSize: T.pill.fontSize, fontWeight: 400, color: C.amberText, margin: 0, lineHeight: 1.5 }}>
                  Some fields are locked because an invoice has already been sent.
                </p>
              </div>
            )}

            {/* Cleared: green banner */}
            {project.status === 'cleared' && (
              <div style={{
                background: C.greenLight, border: `1px solid ${C.cleared}`,
                borderRadius: '8px', padding: '8px 14px', marginBottom: 12,
              }}>
                <p style={{ fontSize: T.xs.fontSize, fontWeight: 500, color: C.greenText, margin: 0 }}>
                  This project is cleared. The record is permanent.
                </p>
              </div>
            )}

            {/* ── Edit mode fields ──────────────────── */}
            {editMode ? (
              <>
                <EditableRow label="Client / company name" value={draft.clientName} onChange={setField('clientName')} />
                <EditableRow label="Primary contact email"  value={draft.clientEmail} type="email" onChange={setField('clientEmail')} />
                <EditableRow label="Primary contact person" value={draft.contactPerson} onChange={setField('contactPerson')} />

                {/* Additional contacts */}
                {draft.additionalContacts.map((c, i) => (
                  <div key={c.id} style={{ padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <label style={{ fontSize: '10px', fontWeight: 600, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                        Contact {i + 2}
                      </label>
                      <button
                        onClick={() => setDraft(prev => ({ ...prev, additionalContacts: prev.additionalContacts.filter((_, j) => j !== i) }))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 0, display: 'flex', alignItems: 'center', transition: 'color 150ms' }}
                        onMouseEnter={e => (e.currentTarget.style.color = C.danger)}
                        onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <input
                      value={c.name}
                      onChange={e => setDraft(prev => ({ ...prev, additionalContacts: prev.additionalContacts.map((ac, j) => j === i ? { ...ac, name: e.target.value } : ac) }))}
                      placeholder="Name"
                      style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${C.border}`, outline: 'none', fontSize: '13px', fontWeight: 500, color: C.black, padding: '2px 0', marginBottom: 6, boxSizing: 'border-box' as const, fontFamily: 'inherit' }}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = C.black)}
                      onBlur={e  => (e.currentTarget.style.borderBottomColor = C.border)}
                    />
                    <input
                      value={c.email || ''}
                      onChange={e => setDraft(prev => ({ ...prev, additionalContacts: prev.additionalContacts.map((ac, j) => j === i ? { ...ac, email: e.target.value } : ac) }))}
                      placeholder="Email (optional)"
                      type="email"
                      style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${C.border}`, outline: 'none', fontSize: '13px', fontWeight: 500, color: C.black, padding: '2px 0', boxSizing: 'border-box' as const, fontFamily: 'inherit' }}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = C.black)}
                      onBlur={e  => (e.currentTarget.style.borderBottomColor = C.border)}
                    />
                  </div>
                ))}

                {/* Add contact button — max 2 additional */}
                {draft.additionalContacts.length < 2 && (
                  <div style={{ padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                    <button
                      onClick={() => setDraft(prev => ({ ...prev, additionalContacts: [...prev.additionalContacts, { id: Date.now().toString(), name: '' }] }))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: C.muted, padding: 0, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4, transition: 'color 150ms' }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.black)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
                    >
                      + Add contact
                    </button>
                  </div>
                )}

                {/* Services */}
                <div style={{ padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                  <label style={{ fontSize: '10px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                    Services
                  </label>
                  <ServicesSection
                    services={draft.services}
                    onChange={setServices}
                    rateCard={invoiceDefaults.rateCard}
                    currencySymbol={currSym(draft.currency || project.currency)}
                    sentDoc={project.invoiceSentAt ? 'invoice' : project.sentAt ? 'quote' : undefined}
                    onAddToRateCard={(name, price) => {
                      const newItem = { id: `rc-${Date.now()}`, service: name, price };
                      updateInvoiceDefaults({ ...invoiceDefaults, rateCard: [...invoiceDefaults.rateCard, newItem] });
                    }}
                    onNavigateToRateCard={() => navigate('/settings/invoice-defaults')}
                  />
                </div>

                {/* Quoted amount */}
                {isLocked('amount') ? (
                  <LockedRow
                    label="Quoted amount"
                    value={`${currSym(project.currency)}${project.amount.toLocaleString()}`}
                    lockNote={getLockNote('amount')}
                  />
                ) : (() => {
                  const svcTotal = draft.services.reduce((sum, s) => sum + s.price, 0);
                  const currentAmt = parseFloat(draft.amount) || 0;
                  const showCustomNote = amountIsCustom && draft.services.length > 0 && currentAmt !== svcTotal;
                  return (
                    <AmountEditRow
                      label="Quoted amount"
                      value={draft.amount}
                      onChange={val => {
                        setField('amount')(val);
                        const total = draft.services.reduce((s, sv) => s + sv.price, 0);
                        setAmountIsCustom(draft.services.length > 0 && (parseFloat(val) || 0) !== total);
                      }}
                      prefix={sym}
                      footer={showCustomNote ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', paddingTop: 4 }}>
                          <span style={{ fontSize: T.xs.fontSize, color: C.amberText, lineHeight: 1.4 }}>
                            Custom amount — differs from service total ({sym}{svcTotal.toLocaleString()})
                          </span>
                          <button
                            onClick={() => { setField('amount')(String(svcTotal)); setAmountIsCustom(false); }}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              fontSize: T.xs.fontSize, color: C.muted, padding: 0,
                              fontFamily: 'inherit', textDecoration: 'underline',
                            }}
                          >
                            Reset to service total
                          </button>
                        </div>
                      ) : undefined}
                    />
                  );
                })()}

                {/* Currency */}
                {isLocked('currency') ? (
                  <LockedRow label="Currency" value={draft.currency} />
                ) : (
                  <EditableRow label="Currency" value={draft.currency} type="select" onChange={setField('currency')} />
                )}

                {/* Deposit */}
                {isLocked('depositAmount') ? (
                  <LockedRow
                    label="Deposit"
                    value={draft.depositAmount ? `${sym}${parseFloat(draft.depositAmount).toLocaleString()}` : '—'}
                  />
                ) : (
                  <EditableRow label="Deposit" value={draft.depositAmount} type="number" onChange={setField('depositAmount')} prefix={sym} />
                )}

                {/* Start date */}
                {isLocked('startDate') ? (
                  <LockedRow label="Start date" value={formatDate(draft.startDate)} lockNote={getLockNote('startDate')} />
                ) : (
                  <EditableRow label="Start date" value={draft.startDate} type="date" onChange={setField('startDate')} />
                )}

                {/* Due date */}
                {isLocked('dueDate') ? (
                  <LockedRow label="Due date" value={formatDate(draft.dueDate)} lockNote={getLockNote('dueDate')} />
                ) : (
                  <EditableRow label="Due date" value={draft.dueDate} type="date" onChange={setField('dueDate')} />
                )}

                <EditableRow label="Notes" value={draft.notes} type="textarea" onChange={setField('notes')} />
              </>
            ) : (
              /* ── Display mode fields ──────────────── */
              <>
                <DisplayRow label="Client"        value={project.clientName} />
                <DisplayRow label="Email"         value={project.clientEmail} />
                <DisplayRow label="Contact"       value={project.contactPerson} />

                {/* Additional contacts (2+) */}
                {(project.additionalContacts?.length ?? 0) > 0 && (
                  <div style={{ padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: '11px', color: C.muted, display: 'block', marginBottom: 6 }}>
                      Additional contacts
                    </span>
                    {project.additionalContacts!.map((c, i) => (
                      <div key={c.id} style={{
                        padding: '5px 0',
                        borderBottom: i < project.additionalContacts!.length - 1 ? `1px solid ${C.border}` : 'none',
                      }}>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: C.black }}>{c.name}</div>
                        {c.email && <div style={{ fontSize: '11px', color: C.muted, marginTop: 1 }}>{c.email}</div>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Services — always shown */}
                {(project.services?.length ?? 0) > 0 && (
                  <div style={{ padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: '11px', color: C.muted, display: 'block', marginBottom: 6 }}>
                      Services
                    </span>
                    {project.services!.map((svc, i) => (
                      <div key={svc.id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '5px 0',
                        borderBottom: i < project.services!.length - 1 ? `1px solid ${C.border}` : 'none',
                      }}>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: C.black }}>{svc.name}</span>
                        <span style={{ fontSize: '13px', color: C.muted }}>{currSym(project.currency)}{svc.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}

                <DisplayRow label="Quoted amount" value={formatAmount(project.amount, project.currency)} />
                <DisplayRow label="Currency"      value={project.currency} />
                {project.depositAmount ? (
                  <DisplayRow label="Deposit" value={`${currSym(project.currency)}${project.depositAmount.toLocaleString()}`} />
                ) : null}
                <DisplayRow label="Started"  value={formatDate(project.startDate)} />
                <DisplayRow label="Due date" value={project.dueDate ? formatDate(project.dueDate) : undefined} />
                {project.notes && (
                  <div style={{ padding: '8px 0' }}>
                    <span style={{ fontSize: '11px', color: C.muted, display: 'block', marginBottom: 4 }}>Notes</span>
                    <span style={{ fontSize: '13px', color: C.black, lineHeight: 1.6 }}>{project.notes}</span>
                  </div>
                )}
              </>
            )}

            {/* Edit project link — inside card, view mode only */}
            {!editMode && showEditBtn && (
              <>
                <div style={{ height: 1, background: C.border, margin: '8px 0 0' }} />
                <EditProjectBtn onClick={openEdit} />
              </>
            )}
          </div>

          {/* ── Invoice / Quote section (unchanged) ─── */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: '8px', padding: 16,
          }}>
            {/* ── Section label with state indicator ── */}
            {(() => {
              let label: string;
              let labelColor: string;
              let ctxLine: string | null  = null;
              let ctxColor: string        = C.muted;

              if (project.status === 'ready') {
                const today = new Date().toISOString().split('T')[0];
                const isExpired = !!(project.expiryDate && project.expiryDate < today);
                const isRevised = (project.quoteRevisions?.length ?? 0) > 0 && !project.sentAt;

                if (isRevised) {
                  const prevRef = project.quoteRevisions![project.quoteRevisions!.length - 1].quoteNumber;
                  label = 'QUOTE · REVISED'; labelColor = C.amberText;
                  ctxLine = `Revising ${prevRef} — send when ready`;
                  ctxColor = C.amberText;
                } else if (isExpired) {
                  label = 'QUOTE · EXPIRED'; labelColor = C.amberText;
                  ctxLine = `Sent ${formatDate(project.sentAt!, 'short')} · expired`;
                  ctxColor = C.amberText;
                } else if (!project.sentAt) {
                  label = 'QUOTE · DRAFT'; labelColor = C.muted;
                  ctxLine = "Your client hasn't seen this yet — edit freely before sending";
                } else if (!project.viewedAt) {
                  label = 'QUOTE · SENT'; labelColor = C.muted;
                  ctxLine = `Sent ${formatDate(project.sentAt, 'short')} · not viewed yet`;
                } else {
                  label = 'QUOTE · ACCEPTED'; labelColor = C.teal;
                  ctxLine = `Sent ${formatDate(project.sentAt, 'short')} · viewed ${timeAgo(project.viewedAt)}`;
                  ctxColor = C.teal;
                }
              } else if (project.status === 'cleared') {
                label = 'INVOICE · CLEARED'; labelColor = C.greenText;
                ctxLine = project.paidAt ? `Paid ${formatDate(project.paidAt, 'short')}` : 'Paid';
                ctxColor = C.greenText;
              } else if (!project.invoiceSentAt) {
                label = 'INVOICE · DRAFT'; labelColor = C.muted;
                ctxLine = "Your client hasn't seen this yet — edit freely before sending";
              } else if (overdue) {
                const days = Math.floor((Date.now() - new Date(project.dueDate!).getTime()) / 86_400_000);
                label = 'INVOICE · OVERDUE'; labelColor = C.amberText;
                ctxLine = `Sent ${formatDate(project.invoiceSentAt, 'short')} · ${days}d overdue`;
                ctxColor = C.amberText;
              } else if (!project.invoiceViewedAt) {
                label = 'INVOICE · SENT'; labelColor = C.muted;
                ctxLine = `Sent ${formatDate(project.invoiceSentAt, 'short')} · not viewed yet`;
              } else {
                label = 'INVOICE · SENT'; labelColor = C.teal;
                ctxLine = `Sent ${formatDate(project.invoiceSentAt, 'short')} · viewed ${timeAgo(project.invoiceViewedAt)}`;
                ctxColor = C.teal;
              }

              return (
                <>
                  <span style={{ ...T.label, color: labelColor, display: 'block', marginBottom: ctxLine ? 6 : 12 }}>
                    {label}
                  </span>
                  {ctxLine && (
                    <p style={{ fontSize: T.xs.fontSize, fontWeight: 400, color: ctxColor, margin: '0 0 12px', lineHeight: 1.5 }}>
                      {ctxLine}
                    </p>
                  )}
                </>
              );
            })()}

            {/* Version history — shown above QuoteSection when revisions exist */}
            {project.status === 'ready' && (project.quoteRevisions?.length ?? 0) > 0 && (
              <div style={{ marginBottom: 12 }}>
                <button
                  onClick={() => setShowVersionHistory(v => !v)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    fontSize: '11px', fontWeight: 400, color: C.muted,
                    display: 'flex', alignItems: 'center', gap: 4,
                    width: '100%', textAlign: 'left',
                  }}
                >
                  {project.quoteRevisions!.length + 1} versions · {project.quoteRevisions![project.quoteRevisions!.length - 1].quoteNumber} superseded
                  <span style={{ fontSize: '10px', marginLeft: 2 }}>{showVersionHistory ? '▲' : '▼'}</span>
                </button>

                {showVersionHistory && (
                  <div style={{ marginTop: 8, border: `1px solid ${C.border}`, borderRadius: R.md, overflow: 'hidden' }}>
                    {/* Current version row */}
                    <div style={{
                      height: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0 12px', borderBottom: `1px solid ${C.border}`,
                    }}>
                      <span style={{ fontSize: '12px', fontWeight: 500, color: C.black }}>
                        QUO-{String(project.quoteVersion ?? 1).padStart(3, '0')}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 400, color: C.muted }}>
                        {project.sentAt ? 'Sent (current)' : 'Draft (current)'}
                      </span>
                    </div>
                    {/* Superseded versions */}
                    {[...project.quoteRevisions!].reverse().map((rev, i, arr) => (
                      <div key={rev.quoteNumber} style={{
                        height: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0 12px',
                        borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none',
                      }}>
                        <span style={{ fontSize: '12px', fontWeight: 500, color: C.black }}>{rev.quoteNumber}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: '11px', fontWeight: 400, color: C.muted }}>
                            Superseded · Sent {formatDate(rev.sentAt, 'short')}
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: 500, color: C.muted }}>View →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {project.status === 'ready' ? (
              <QuoteSection project={project} onUpdate={(updates) => updateProject(project.id, updates)} />
            ) : (
              <InvoiceSection project={project} onUpdate={(updates) => updateProject(project.id, updates)} />
            )}
          </div>

        </div>
      </main>

      {/* ── Context-aware bottom action bar ─────────── */}
      <AnimatePresence>
        {showBottom && !editMode && (
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
                {/* Revise quote — only on QUOTE · SENT, not Draft/Accepted */}
                {project.sentAt && !project.viewedAt && (
                  <SecondaryBtn onClick={handleReviseQuote}>Revise quote →</SecondaryBtn>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  {!project.sentAt
                    ? <AccentBtn fill={C.quoting} onClick={handleSendQuote} flex><Send size={15} /> Send to client →</AccentBtn>
                    : <SecondaryBtn onClick={handleSendQuote} flex><Send size={15} /> Resend quote</SecondaryBtn>
                  }
                  {project.sentAt && (
                    <IconBtn onClick={() => copyLink('quote')} title="Copy quote link" ariaLabel="Copy quote link">
                      {copied === 'quote' ? <Check size={16} /> : <Link size={16} />}
                    </IconBtn>
                  )}
                </div>
                <PrimaryBtn onClick={handleMarkQuoteAccepted}>
                  <CheckCircle2 size={15} /> Mark quote accepted →
                </PrimaryBtn>
              </>
            )}

            {/* In progress stage */}
            {project.status === 'in-progress' && (
              <PrimaryBtn onClick={handleGenerateInvoice}>
                <FileText size={15} /> Generate invoice →
              </PrimaryBtn>
            )}

            {/* Invoiced stage */}
            {project.status === 'invoiced' && (
              <>
                {!project.invoiceSentAt ? (
                  <AccentBtn fill={C.invoiced} onClick={handleSendInvoice}>
                    <Send size={15} /> Send to client →
                  </AccentBtn>
                ) : (
                  <>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <SecondaryBtn onClick={handleSendInvoice} flex>
                        <Send size={15} /> Resend to client
                      </SecondaryBtn>
                      <IconBtn onClick={() => copyLink('invoice')} title="Copy invoice link" ariaLabel="Copy invoice link">
                        {copied === 'invoice' ? <Check size={16} /> : <Link size={16} />}
                      </IconBtn>
                    </div>
                    <AccentBtn fill={C.cleared} onClick={() => setShowClear(true)}>
                      <CheckCircle2 size={15} /> Mark as cleared →
                    </AccentBtn>
                  </>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete confirmation ──────────────────────── */}
      <DeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        clientName={project.clientName}
        body={
          project.status === 'cleared'
            ? "This is a cleared project with a paid invoice. Deleting it will permanently remove all records including documents your client may have bookmarked. This cannot be undone."
            : "Deleting now means losing the project, all quotes, and any invoices. This cannot be undone."
        }
        confirmLabel={project.status === 'cleared' ? 'Delete anyway' : 'Delete forever'}
        onDelete={handleDelete}
        onArchiveInstead={project.status === 'cleared' || project.status === 'archived' ? undefined : handleArchiveInstead}
      />

      {/* ── Clear confirmation ───────────────────────── */}
      <ConfirmModal
        open={showClear}
        onClose={() => setShowClear(false)}
        icon={<CheckCircle2 size={22} color={C.black} strokeWidth={2} />}
        iconBg={C.cleared}
        title="Mark as cleared?"
        description="This means the invoice has been paid and everything is wrapped up."
        confirmLabel="Mark as cleared →"
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

/* ── Button style helpers ──────────────────────────────────── */
function PrimaryBtn({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  const [prs, setPrs] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => { setHov(false); setPrs(false); }}
      onPointerDown={() => setPrs(true)} onPointerUp={() => setPrs(false)}
      style={{
        width: '100%', height: 48,
        background: prs ? '#111' : hov ? '#222' : C.black,
        color: C.white, border: `1.5px solid ${C.black}`, borderRadius: R.xl,
        cursor: 'pointer', fontSize: T.input.fontSize, fontWeight: 700,
        letterSpacing: '-0.01em', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 8,
        transform: prs ? 'scale(0.98)' : 'scale(1)',
        transition: 'background 120ms ease-in-out, transform 100ms ease-in-out',
      }}>{children}</button>
  );
}
function SecondaryBtn({ onClick, flex, children }: { onClick?: () => void; flex?: boolean; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  const [prs, setPrs] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => { setHov(false); setPrs(false); }}
      onPointerDown={() => setPrs(true)} onPointerUp={() => setPrs(false)}
      style={{
        width: '100%', height: 48,
        background: prs ? '#F0F0F0' : hov ? '#F8F8F8' : C.white,
        color: C.black, border: `1.5px solid ${C.black}`, borderRadius: R.xl,
        cursor: 'pointer', fontSize: T.input.fontSize, fontWeight: 700,
        letterSpacing: '-0.01em', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 8,
        flex: flex ? 1 : undefined,
        transform: prs ? 'scale(0.98)' : 'scale(1)',
        transition: 'background 120ms ease-in-out, transform 100ms ease-in-out',
      }}>{children}</button>
  );
}
function AccentBtn({ fill, onClick, flex, children }: { fill: string; onClick?: () => void; flex?: boolean; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  const [prs, setPrs] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => { setHov(false); setPrs(false); }}
      onPointerDown={() => setPrs(true)} onPointerUp={() => setPrs(false)}
      style={{
        width: '100%', height: 48,
        background: fill, color: C.black, border: `1.5px solid ${C.black}`, borderRadius: R.xl,
        cursor: 'pointer', fontSize: T.input.fontSize, fontWeight: 700,
        letterSpacing: '-0.01em', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 8,
        flex: flex ? 1 : undefined,
        filter: prs ? 'brightness(0.86)' : hov ? 'brightness(0.92)' : 'brightness(1)',
        transform: prs ? 'scale(0.98)' : 'scale(1)',
        transition: 'filter 120ms ease-in-out, transform 100ms ease-in-out',
      }}>{children}</button>
  );
}
function IconBtn({ onClick, title, ariaLabel, children }: { onClick?: () => void; title?: string; ariaLabel?: string; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  const [prs, setPrs] = useState(false);
  return (
    <button onClick={onClick} title={title} aria-label={ariaLabel}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => { setHov(false); setPrs(false); }}
      onPointerDown={() => setPrs(true)} onPointerUp={() => setPrs(false)}
      style={{
        width: 48, height: 48, flexShrink: 0,
        background: prs ? '#F0F0F0' : hov ? '#F8F8F8' : C.white,
        color: C.black, border: `1.5px solid ${C.black}`, borderRadius: R.xl,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        transform: prs ? 'scale(0.97)' : 'scale(1)',
        transition: 'background 120ms ease-in-out, transform 100ms ease-in-out',
      }}>{children}</button>
  );
}

function EditProjectBtn({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false);
  const [prs, setPrs] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => { setHov(false); setPrs(false); }}
      onPointerDown={() => setPrs(true)} onPointerUp={() => setPrs(false)}
      style={{
        width: '100%', background: prs ? 'rgba(0,0,0,0.06)' : hov ? 'rgba(0,0,0,0.03)' : 'transparent',
        border: 'none', cursor: 'pointer', padding: '14px 0',
        fontSize: '13px', fontWeight: 500, color: '#7A8099',
        textAlign: 'center',
        transition: 'background 150ms ease-in-out',
        borderRadius: '0 0 6px 6px',
      }}
    >Edit project</button>
  );
}
function NavCancelBtn({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: hov ? 'rgba(255,255,255,0.7)' : '#7A8099',
        minWidth: 44, minHeight: 44,
        display: 'flex', alignItems: 'center', padding: 0,
        fontSize: '13px', fontWeight: 400,
        transition: 'color 150ms ease-in-out',
      }}
    >Cancel</button>
  );
}
function NavSaveBtn({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: 'none', border: 'none',
        cursor: disabled ? 'default' : 'pointer',
        color: C.white, minWidth: 44, minHeight: 44,
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        padding: 0, fontSize: '13px', fontWeight: 600,
        opacity: disabled ? 0.3 : hov ? 0.65 : 1,
        transition: 'opacity 150ms ease-in-out',
      }}
    >Save</button>
  );
}