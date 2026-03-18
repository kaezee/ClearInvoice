import React, { useState } from 'react';
import { Pencil, Lock, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { Project, InvoiceItem } from '../types';
import { C, T, R, formatAmount, formatDate } from '../tokens';
import { useApp } from '../store';

interface InvoiceSectionProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

export function InvoiceSection({ project, onUpdate }: InvoiceSectionProps) {
  const { invoiceDefaults } = useApp();
  const navigate = useNavigate();

  // Locked until Invoiced or Cleared
  const isLocked = project.status === 'ready' || project.status === 'in-progress';
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(!project.hasSeenInvoiceHint);

  // Tax local state — seeded from project fields, fall back to defaults
  const [taxEnabled, setTaxEnabled] = useState<boolean>(
    project.taxEnabled !== undefined ? project.taxEnabled : (invoiceDefaults.taxEnabled ?? false)
  );
  const [taxLabel, setTaxLabel] = useState<string>(
    project.taxLabel || invoiceDefaults.taxLabel || 'VAT'
  );
  const [taxRate, setTaxRate] = useState<number>(
    project.taxRate !== undefined ? project.taxRate : (invoiceDefaults.taxRate ?? 20)
  );

  const updateTaxEnabled = (v: boolean) => {
    setTaxEnabled(v);
    onUpdate({ taxEnabled: v, taxLabel, taxRate });
  };

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

  const subtotal = project.invoiceItems.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = taxEnabled ? Math.round(subtotal * (taxRate / 100) * 100) / 100 : 0;
  const total = subtotal + taxAmount;

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
          <p style={{ fontSize: T.pill.fontSize, fontWeight: 600, color: C.muted, margin: 0 }}>
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

            {/* ── Tax toggle row ───────────────────────── */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 0', borderTop: `1px solid ${C.border}`,
            }}>
              <span style={{ fontSize: '12px', fontWeight: 500, color: C.muted }}>Add tax</span>
              {invoiceDefaults.taxEnabled || taxEnabled ? (
                <TaxToggle checked={taxEnabled} onChange={updateTaxEnabled} />
              ) : (
                <button
                  onClick={() => navigate('/settings/invoice-defaults')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    fontSize: '11px', color: C.muted, textDecoration: 'underline',
                    fontFamily: 'inherit',
                  }}
                >
                  Set up tax in Invoice setup first →
                </button>
              )}
            </div>

            {/* ── Subtotal / Tax / Total ───────────────── */}
            {taxEnabled && (
              <div style={{ padding: '6px 0', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 400, color: C.muted }}>Subtotal</span>
                <span style={{ fontSize: '13px', fontWeight: 400, color: C.muted }}>{formatAmount(subtotal, project.currency)}</span>
              </div>
            )}
            {taxEnabled && (
              <div style={{ padding: '6px 0', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 400, color: C.muted }}>{taxLabel} {taxRate}%</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: C.black }}>{formatAmount(taxAmount, project.currency)}</span>
              </div>
            )}

            {/* Total */}
            <div style={{
              borderTop: `2px solid ${C.black}`,
              marginTop: 6, paddingTop: 10,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: C.black }}>
                {taxEnabled ? `Total (inc. ${taxLabel})` : 'Total'}
              </span>
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
      )}
    </AnimatePresence>
  );
}

// ── Tax Toggle Component ──────────────────────────────────────────────────────
interface TaxToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}

function TaxToggle({ checked, onChange }: TaxToggleProps) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 40, height: 20, borderRadius: 10, background: checked ? C.black : C.border,
        display: 'flex', alignItems: 'center', cursor: 'pointer',
        transition: 'background 150ms',
      }}
    >
      <div
        style={{
          width: 16, height: 16, borderRadius: 8, background: C.white,
          transform: checked ? 'translateX(18px)' : 'translateX(2px)',
          transition: 'transform 150ms',
        }}
      />
    </div>
  );
}