import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Plus, X, ChevronDown, ImageIcon, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../store';
import { C, T, R } from '../tokens';
import { InvoiceDefaultsType, RateCardItem, CustomField, PaymentTerms } from '../types';

const CURRENCIES = ['GBP', 'USD', 'EUR', 'INR', 'AUD', 'CAD'];
const TERMS: { key: PaymentTerms; label: string }[] = [
  { key: 'net7',   label: '7 days'  },
  { key: 'net14',  label: '14 days' },
  { key: 'net30',  label: '30 days' },
  { key: 'custom', label: 'Custom'  },
];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: R.xl, padding: 16 }}>
      <p style={{ ...T.label, color: C.muted, margin: '0 0 14px' }}>{title}</p>
      {children}
    </div>
  );
}

function AddRowButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, paddingTop: 10,
        background: 'none', border: 'none', cursor: 'pointer', minHeight: 44, width: '100%',
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: R.pill, background: C.surface,
        border: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Plus size={13} color={C.black} />
      </div>
      <span style={{ fontSize: '13px', fontWeight: 500, color: C.black }}>{label}</span>
    </button>
  );
}

interface AddFieldSheetProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: Record<string, string>) => void;
  title: string;
  fields: { key: string; label: string; placeholder: string }[];
}

function AddSheet({ open, onClose, onAdd, title, fields }: AddFieldSheetProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleAdd = () => {
    const allFilled = fields.every(f => values[f.key]?.trim());
    if (!allFilled) return;
    onAdd(values);
    setValues({});
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 50 }}
          />
          {/* Centering wrapper — flex does the centering, Motion only handles scale/fade */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 16px',
            zIndex: 51,
            pointerEvents: 'none',
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: '100%',
                background: C.white,
                borderRadius: R.lg,
                padding: '20px 16px 20px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
                pointerEvents: 'auto',
              }}
            >
              {/* Drag pill */}
              <div style={{ width: 32, height: 3, background: C.border, borderRadius: R.pill, margin: '0 auto 20px' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <p style={{ fontSize: '17px', fontWeight: 700, color: C.black, margin: 0, letterSpacing: '-0.02em' }}>{title}</p>
                <button
                  onClick={onClose}
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: C.surface, border: `1px solid ${C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0,
                  }}
                  aria-label="Close"
                >
                  <X size={15} color={C.black} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {fields.map(field => (
                  <div key={field.key}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: C.black, display: 'block', marginBottom: 8 }}>
                      {field.label}
                    </label>
                    <input
                      placeholder={field.placeholder}
                      value={values[field.key] || ''}
                      onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                      type={field.key === 'price' ? 'number' : 'text'}
                      style={{
                        width: '100%', height: 52, background: C.surface,
                        border: `1px solid ${C.border}`, borderRadius: R.md,
                        padding: '0 14px', fontSize: '15px', outline: 'none',
                        fontFamily: 'inherit', boxSizing: 'border-box',
                        color: C.black,
                        transition: 'border-color 150ms',
                      }}
                      onFocus={e  => e.currentTarget.style.borderColor = C.black}
                      onBlur={e   => e.currentTarget.style.borderColor = C.border}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={handleAdd}
                style={{
                  width: '100%', height: 52, background: C.black,
                  color: C.white, border: 'none', borderRadius: R.xl,
                  cursor: 'pointer', fontSize: '15px', fontWeight: 700,
                  letterSpacing: '-0.01em',
                  marginTop: 24,
                }}
              >
                Add
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function InvoiceDefaults() {
  const { invoiceDefaults, updateInvoiceDefaults, branding, updateBranding } = useApp();
  const navigate = useNavigate();
  const [defaults, setDefaults]       = useState<InvoiceDefaultsType>({ ...invoiceDefaults });
  const [showAddField, setShowAddField]   = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [shakingId, setShakingId]     = useState<string | null>(null);
  const [saved, setSaved]             = useState(false);
  const [logoDragging, setLogoDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (partial: Partial<InvoiceDefaultsType>) => {
    setDefaults(prev => ({ ...prev, ...partial }));
  };

  const handleLogoFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      updateBranding({ ...branding, logoUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleLogoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleLogoFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setLogoDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleLogoFile(file);
  };

  const removeLogo = () => updateBranding({ ...branding, logoUrl: undefined });

  const removeCustomField = (id: string) =>
    update({ customFields: defaults.customFields.filter(f => f.id !== id) });

  const removeRateItem = (id: string) => {
    if (shakingId === id) {
      update({ rateCard: defaults.rateCard.filter(r => r.id !== id) });
      setShakingId(null);
    } else {
      setShakingId(id);
      setTimeout(() => setShakingId(null), 600);
    }
  };

  const handleSave = () => {
    updateInvoiceDefaults(defaults);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputBase: React.CSSProperties = {
    background: C.white, border: `1px solid ${C.border}`, borderRadius: R.md,
    padding: '0 12px', fontSize: '13px', outline: 'none', fontFamily: 'inherit',
    height: 44, width: '100%', boxSizing: 'border-box',
    transition: 'border-color 150ms',
  };

  const currencySymbol =
    defaults.defaultCurrency === 'GBP' ? '£' :
    defaults.defaultCurrency === 'USD' ? '$' :
    defaults.defaultCurrency === 'EUR' ? '€' :
    defaults.defaultCurrency === 'INR' ? '₹' :
    defaults.defaultCurrency;

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
          onClick={() => navigate('/projects', { state: { openProfile: true } })}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.white, minWidth: 44, minHeight: 44,
            display: 'flex', alignItems: 'center', padding: 0,
          }}
          aria-label="Go back"
        >
          <ChevronLeft size={24} />
        </button>
        <span style={{ fontSize: '17px', fontWeight: 600, color: C.white, letterSpacing: '-0.01em' }}>Invoice defaults</span>
        <div style={{ minWidth: 44 }} />
      </nav>

      <main style={{ flex: 1, padding: '12px 16px 32px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* ── Logo upload ─────────────────────────── */}
          <SectionCard title="Business logo">
            <input
              ref={fileInputRef}
              type="file" accept="image/*"
              onChange={handleLogoInputChange}
              style={{ display: 'none' }}
            />
            {branding.logoUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: R.md,
                  border: `1px solid ${C.border}`, overflow: 'hidden', flexShrink: 0,
                  background: C.surface,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <img src={branding.logoUrl} alt="Business logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: C.black, margin: '0 0 4px' }}>Logo uploaded</p>
                  <p style={{ fontSize: '11px', color: C.muted, margin: '0 0 12px' }}>Shown on all invoices</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        height: 32, padding: '0 12px',
                        background: C.surface, border: `1px solid ${C.border}`,
                        borderRadius: R.md, cursor: 'pointer',
                        fontSize: '12px', fontWeight: 600, color: C.black,
                        display: 'flex', alignItems: 'center', gap: 5,
                      }}
                    >
                      Replace
                    </button>
                    <button
                      onClick={removeLogo}
                      style={{
                        height: 32, padding: '0 12px',
                        background: C.dangerLight, border: `1px solid rgba(220,38,38,0.2)`,
                        borderRadius: R.md, cursor: 'pointer',
                        fontSize: '12px', fontWeight: 600, color: C.danger,
                        display: 'flex', alignItems: 'center', gap: 5,
                      }}
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setLogoDragging(true); }}
                onDragLeave={() => setLogoDragging(false)}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${logoDragging ? C.black : C.borderStrong}`,
                  borderRadius: R.lg,
                  padding: '28px 16px',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 10,
                  cursor: 'pointer',
                  background: logoDragging ? C.surface : 'transparent',
                  transition: 'all 150ms',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: C.surface, border: `1px solid ${C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 150ms',
                }}>
                  <ImageIcon size={20} color={C.muted} strokeWidth={1.5} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: C.black, margin: '0 0 3px' }}>
                    {logoDragging ? 'Drop to upload' : 'Add your logo'}
                  </p>
                  <p style={{ fontSize: '11px', color: C.muted, margin: 0 }}>
                    Click to browse or drag & drop · PNG, JPG, SVG
                  </p>
                </div>
              </div>
            )}
          </SectionCard>

          {/* ── Custom fields ────────────────────────── */}
          <SectionCard title="Custom fields">
            {defaults.customFields.map((field, idx) => (
              <div key={field.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0', gap: 8,
                borderBottom: idx < defaults.customFields.length - 1 ? `1px solid ${C.border}` : 'none',
              }}>
                <span style={{ fontSize: '13px', color: C.muted, flexShrink: 0, maxWidth: '40%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{field.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: C.black, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>{field.value}</span>
                  <button
                    onClick={() => removeCustomField(field.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: C.borderStrong, padding: 2, display: 'flex', alignItems: 'center',
                      flexShrink: 0,
                    }}
                    aria-label={`Remove ${field.label}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
            <AddRowButton label="Add custom field" onClick={() => setShowAddField(true)} />
          </SectionCard>

          {/* ── Rate card ────────────────────────────── */}
          <SectionCard title="Rate card">
            {defaults.rateCard.map((item, idx) => (
              <motion.div
                key={item.id}
                animate={shakingId === item.id ? { x: [0, -4, 4, -4, 4, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', gap: 8,
                  borderBottom: idx < defaults.rateCard.length - 1 ? `1px solid ${C.border}` : 'none',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 500, color: C.black, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 8 }}>{item.service}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: C.black }}>
                    {currencySymbol}{item.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => removeRateItem(item.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: shakingId === item.id ? C.danger : C.borderStrong,
                      padding: 2, display: 'flex', alignItems: 'center',
                      transition: 'color 150ms',
                    }}
                    aria-label={shakingId === item.id ? 'Confirm remove' : `Remove ${item.service}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
            <AddRowButton label="Add service" onClick={() => setShowAddService(true)} />
          </SectionCard>

          {/* ── Payment defaults ─────────────────────── */}
          <SectionCard title="Payment defaults">
            {/* Due terms */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: C.black, display: 'block', marginBottom: 8 }}>
                Default due terms
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                {TERMS.map(t => {
                  const active = defaults.defaultTerms === t.key;
                  return (
                    <button
                      key={t.key}
                      onClick={() => update({ defaultTerms: t.key })}
                      style={{
                        flex: 1, padding: '7px 0',
                        border: `1.5px solid ${active ? C.black : C.border}`,
                        borderRadius: R.xl,
                        background: active ? C.black : C.white,
                        cursor: 'pointer', fontSize: '11px', fontWeight: 700,
                        color: active ? C.white : C.muted,
                        transition: 'all 120ms',
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Default currency */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: C.black, display: 'block', marginBottom: 6 }}>
                Default currency
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={defaults.defaultCurrency}
                  onChange={e => update({ defaultCurrency: e.target.value })}
                  style={{ ...inputBase, paddingRight: 32, appearance: 'none', cursor: 'pointer' }}
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: C.muted }} />
              </div>
            </div>

            {/* Payment notes */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: C.black, display: 'block', marginBottom: 6 }}>
                Default payment notes
              </label>
              <textarea
                value={defaults.paymentNotes}
                onChange={e => update({ paymentNotes: e.target.value })}
                rows={4}
                placeholder="Bank details, preferred payment method..."
                style={{
                  ...inputBase, height: 'auto', padding: '10px 12px',
                  resize: 'none', lineHeight: 1.6,
                }}
                onFocus={e  => e.currentTarget.style.borderColor = C.black}
                onBlur={e   => e.currentTarget.style.borderColor = C.border}
              />
              <p style={{ fontSize: '11px', color: C.muted, margin: '4px 0 0' }}>
                Shown on every invoice by default
              </p>
            </div>
          </SectionCard>

        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          style={{
            width: '100%', height: 48, marginTop: 16,
            background: saved ? C.cleared : C.black,
            color: saved ? C.black : C.white,
            border: `1.5px solid ${C.black}`,
            borderRadius: R.xl,
            cursor: 'pointer', fontSize: '14px', fontWeight: 700,
            letterSpacing: '-0.01em',
            transition: 'background 200ms, color 200ms',
          }}
        >
          {saved ? 'Saved ✓' : 'Save changes'}
        </button>
      </main>

      {/* Add custom field sheet */}
      <AddSheet
        open={showAddField}
        onClose={() => setShowAddField(false)}
        title="Add custom field"
        fields={[
          { key: 'label', label: 'Field name', placeholder: 'e.g. VAT Number' },
          { key: 'value', label: 'Value',       placeholder: 'e.g. GB123456789' },
        ]}
        onAdd={(data) => {
          const newField: CustomField = { id: Date.now().toString(), label: data.label, value: data.value };
          update({ customFields: [...defaults.customFields, newField] });
        }}
      />

      {/* Add service sheet */}
      <AddSheet
        open={showAddService}
        onClose={() => setShowAddService(false)}
        title="Add service"
        fields={[
          { key: 'service', label: 'Service name', placeholder: 'e.g. Illustration' },
          { key: 'price',   label: 'Price',         placeholder: '0' },
        ]}
        onAdd={(data) => {
          const newItem: RateCardItem = { id: Date.now().toString(), service: data.service, price: Number(data.price) };
          update({ rateCard: [...defaults.rateCard, newItem] });
        }}
      />
    </div>
  );
}