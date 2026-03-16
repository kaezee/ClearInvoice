import React, { useState } from 'react';
import { Pencil, Lock, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, InvoiceItem } from '../types';
import { C, T, R, formatAmount, formatDate } from '../tokens';

interface InvoiceSectionProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

export function InvoiceSection({ project, onUpdate }: InvoiceSectionProps) {
  // Locked until Invoiced or Cleared
  const isLocked = project.status === 'ready' || project.status === 'in-progress';
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(!project.hasSeenInvoiceHint);

  const dismissHint = () => {
    setShowHint(false);
    onUpdate({ hasSeenInvoiceHint: true });
  };

  const updateItemField = (id: string, field: 'description' | 'amount', value: string | number) => {
    const updated = project.invoiceItems.map(item =>
      item.id === id ? { ...item, [field]: field === 'amount' ? Number(value) : value } : item
    );
    onUpdate({ invoiceItems: updated, hasSeenInvoiceHint: true });
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
    <AnimatePresence mode="wait">
      {isLocked ? (
        /* ── Locked state ─────────────────────────── */
        <motion.div
          key="locked"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            border: `1.5px dashed ${C.border}`,
            background: C.white,
            borderRadius: R.xl,
            padding: '24px 16px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div style={{
            width: 40, height: 40, background: C.surface, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Lock size={18} color={C.muted} />
          </div>
          <p style={{ fontSize: '12px', fontWeight: 600, color: C.muted, margin: 0 }}>
            Invoice unlocked when work is complete
          </p>
          <p style={{ ...T.xs, color: C.hint, margin: 0 }}>
            Advance to Invoiced stage to unlock
          </p>
        </motion.div>
      ) : (
        /* ── Unlocked state ───────────────────────── */
        <motion.div
          key="unlocked"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          role="region"
          aria-label="Invoice"
          style={{
            border: `1.5px solid ${C.black}`,
            borderRadius: R.xl,
            overflow: 'hidden',
          }}
        >
          {/* Header strip */}
          <div style={{
            background: C.black,
            padding: '10px 16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: C.white, flexShrink: 0 }}>Invoice</span>
            <span style={{
              fontSize: '11px', color: C.invoiced, fontFamily: 'monospace', letterSpacing: '0.05em',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              maxWidth: '60%', textAlign: 'right',
            }}>
              {project.invoiceNumber}
            </span>
          </div>

          {/* Body */}
          <div style={{ background: C.white, padding: '14px 16px' }}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: C.black }}>{project.clientName}</div>
              <div style={{ ...T.xs, color: C.muted, marginTop: 2 }}>
                Due: {formatDate(project.dueDate)}
              </div>
            </div>

            {/* Line items */}
            {project.invoiceItems.map((item, idx) => (
              <div key={item.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
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
                      display: 'inline-block', paddingBottom: 1,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}
                  >
                    {item.description}
                  </span>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {editingField === `amt-${item.id}` ? (
                    <input
                      autoFocus
                      type="number"
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
                      }}
                    >
                      {formatAmount(item.amount, project.currency)}
                    </span>
                  )}

                  {project.invoiceItems.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: C.borderStrong, padding: 2, lineHeight: 1,
                        fontSize: '14px', display: 'flex', alignItems: 'center',
                      }}
                      aria-label="Remove line item"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Add line item */}
            <button
              onClick={addItem}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: 500, color: C.muted,
                padding: '8px 0', display: 'flex', alignItems: 'center', gap: 4,
                width: '100%', textAlign: 'left',
              }}
            >
              <Plus size={14} /> Add line item
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

            {/* Notes */}
            <div style={{ marginTop: 10 }}>
              {editingField === 'notes' ? (
                <textarea
                  autoFocus
                  defaultValue={project.invoiceNotes || ''}
                  rows={3}
                  onBlur={(e) => {
                    onUpdate({ invoiceNotes: e.target.value, hasSeenInvoiceHint: true });
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
                    color: project.invoiceNotes ? C.muted : C.hint,
                    cursor: 'text',
                    borderBottom: `1px dashed ${C.muted}`,
                    display: 'block', paddingBottom: 1, lineHeight: 1.6,
                  }}
                >
                  {project.invoiceNotes || 'Add payment notes...'}
                </span>
              )}
            </div>

            {/* Edit hint */}
            {showHint && (
              <button
                onClick={dismissHint}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  marginTop: 10, background: 'none', border: 'none',
                  cursor: 'pointer', padding: 0,
                  fontSize: '11px', color: C.muted,
                }}
              >
                <Pencil size={10} />
                Tap underlined fields to edit
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
