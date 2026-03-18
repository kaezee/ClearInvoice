import React, { useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { motion } from 'motion/react';
import { Project, InvoiceItem } from '../types';
import { C, T, R, formatAmount, formatDate } from '../tokens';

interface QuoteSectionProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

export function QuoteSection({ project, onUpdate }: QuoteSectionProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(true);

  const quoteRef = (() => {
    const v = project.quoteVersion ?? 1;
    return `QUO-${String(v).padStart(3, '0')}`;
  })();

  const updateItemField = (id: string, field: 'description' | 'amount', value: string | number) => {
    const updated = project.invoiceItems.map(item =>
      item.id === id ? { ...item, [field]: field === 'amount' ? Number(value) : value } : item
    );
    onUpdate({ invoiceItems: updated });
    setShowHint(false);
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: 'New line item',
      amount: 0,
    };
    onUpdate({ invoiceItems: [...project.invoiceItems, newItem] });
  };

  const removeItem = (id: string) => {
    if (project.invoiceItems.length <= 1) return;
    onUpdate({ invoiceItems: project.invoiceItems.filter(i => i.id !== id) });
  };

  const total = project.invoiceItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <motion.div
      key="quote"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      role="region"
      aria-label="Quote"
      style={{
        border: `1.5px solid ${C.black}`,
        borderRadius: R.xl,
        overflow: 'hidden',
      }}
    >
      {/* ── Header strip (yellow) ───────────────────────── */}
      <div style={{
        background: C.quoting,
        padding: '10px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: C.black }}>
            Quote
          </span>
          {project.sentAt && (
            <span style={{
              fontSize: '10px', fontWeight: 700, color: C.black,
              background: 'rgba(10,10,10,0.12)', borderRadius: '20px',
              padding: '2px 8px', letterSpacing: '0.03em',
            }}>
              Sent {formatDate(project.sentAt, 'short')}
            </span>
          )}
        </div>
        <span style={{
          fontSize: '11px', color: C.black, fontFamily: 'monospace', letterSpacing: '0.05em',
          opacity: 0.7,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          maxWidth: '50%', textAlign: 'right',
        }}>
          {quoteRef}
        </span>
      </div>

      {/* ── Body ─────────────────────────────────────────── */}
      <div style={{ background: C.white, padding: '14px 16px' }}>

        {/* Client + date */}
        <div style={{ marginBottom: 14 }}>
          <div style={{
            fontSize: '13px', fontWeight: 600, color: C.black,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%',
          }}>
            {project.clientName}
          </div>
          <div style={{ ...T.xs, color: C.muted, marginTop: 2 }}>
            {project.dueDate
              ? `Quoted until: ${formatDate(project.dueDate)}`
              : `Prepared: ${formatDate(project.startDate)}`}
          </div>
        </div>

        {/* Line items */}
        {project.invoiceItems.map((item) => (
          <div key={item.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            padding: '6px 0', borderBottom: `1px solid ${C.border}`,
            gap: 8, minWidth: 0,
          }}>
            {editingField === `desc-${item.id}` ? (
              <input
                autoFocus
                defaultValue={item.description}
                onBlur={(e) => { updateItemField(item.id, 'description', e.target.value); setEditingField(null); }}
                style={{
                  flex: 1, minWidth: 0, fontSize: '13px', lineHeight: 1.6,
                  border: `1px solid ${C.black}`, borderRadius: R.md,
                  padding: '2px 8px', outline: 'none',
                }}
              />
            ) : (
              <span
                onClick={() => setEditingField(`desc-${item.id}`)}
                style={{
                  fontSize: '13px', color: C.black, cursor: 'text', flex: 1, minWidth: 0,
                  borderBottom: `1px dashed ${C.black}`,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical' as const,
                  overflow: 'hidden',
                  paddingBottom: 1,
                }}
              >
                {item.description}
              </span>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {editingField === `amt-${item.id}` ? (
                <input
                  autoFocus
                  type="text"
                  inputMode="decimal"
                  defaultValue={item.amount}
                  onBlur={(e) => { updateItemField(item.id, 'amount', e.target.value); setEditingField(null); }}
                  style={{
                    width: 80, fontSize: '13px', fontWeight: 600, textAlign: 'right',
                    border: `1px solid ${C.black}`, borderRadius: R.md,
                    padding: '2px 6px', outline: 'none',
                  }}
                />
              ) : (
                <span
                  onClick={() => setEditingField(`amt-${item.id}`)}
                  style={{
                    fontSize: '13px', fontWeight: 600, color: C.black, cursor: 'text',
                    borderBottom: `1px dashed ${C.black}`,
                    paddingBottom: 1,
                    whiteSpace: 'nowrap' as const,
                  }}
                >
                  {formatAmount(item.amount, project.currency)}
                </span>
              )}

              {project.invoiceItems.length > 1 && (
                <button
                  onClick={() => removeItem(item.id)}
                  onMouseEnter={e => (e.currentTarget.style.color = C.danger)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.borderStrong)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: C.borderStrong, padding: 2, lineHeight: 1,
                    fontSize: T.input.fontSize, display: 'flex', alignItems: 'center',
                    transition: 'color 150ms',
                  }}
                  aria-label="Remove line item"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add extra charge or note */}
        <button
          onClick={addItem}
          onMouseEnter={e => (e.currentTarget.style.color = C.black)}
          onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: 500, color: C.muted,
            padding: '8px 0', display: 'flex', alignItems: 'center', gap: 4,
            width: '100%', textAlign: 'left', transition: 'color 150ms',
          }}
        >
          <Plus size={14} /> Add extra charge or note
        </button>

        {/* Total */}
        <div style={{
          borderTop: `2px solid ${C.black}`,
          marginTop: 6, paddingTop: 10,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: C.black }}>Total</span>
          <span style={{ fontSize: '18px', fontWeight: 700, color: C.black }}>
            {formatAmount(total, project.currency)}
          </span>
        </div>

        {/* Quote notes */}
        <div style={{ marginTop: 10 }}>
          {editingField === 'notes' ? (
            <textarea
              autoFocus
              defaultValue={project.quoteNotes ?? project.invoiceNotes ?? ''}
              rows={3}
              onBlur={(e) => {
                onUpdate({ quoteNotes: e.target.value });
                setEditingField(null);
                setShowHint(false);
              }}
              style={{
                width: '100%', fontSize: '11px', lineHeight: 1.6,
                color: C.black, border: `1px solid ${C.black}`,
                borderRadius: R.md, padding: '6px 8px', outline: 'none',
                resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
          ) : (
            <span
              onClick={() => setEditingField('notes')}
              style={{
                ...T.xs,
                color: (project.quoteNotes ?? project.invoiceNotes) ? C.muted : C.hint,
                cursor: 'text',
                borderBottom: `1px dashed ${C.muted}`,
                display: 'block', paddingBottom: 1, lineHeight: 1.6,
              }}
            >
              {project.quoteNotes ?? project.invoiceNotes ?? 'Add quote notes or terms...'}
            </span>
          )}
        </div>

        {/* Edit hint */}
        {showHint && (
          <button
            onClick={() => setShowHint(false)}
            onMouseEnter={e => (e.currentTarget.style.color = C.black)}
            onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              marginTop: 10, background: 'none', border: 'none',
              cursor: 'pointer', padding: 0,
              fontSize: '11px', color: C.muted, transition: 'color 150ms',
            }}
          >
            <Pencil size={10} />
            Tap underlined fields to edit
          </button>
        )}
      </div>
    </motion.div>
  );
}