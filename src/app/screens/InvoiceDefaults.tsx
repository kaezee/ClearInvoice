import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Plus, X, ChevronDown, ImageIcon, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../store';
import { C, T, R, CURRENCIES, currSym, PAYMENT_TERMS } from '../tokens';
import { InvoiceDefaultsType, RateCardItem, CustomField } from '../types';
import { NumberInput } from '../components/ui/NumberInput';
import { DarkNavBtn, LightModalBtn } from '../components/ui/CircleIconBtn';



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
                <p style={{ fontSize: T.title.fontSize, fontWeight: 700, color: C.black, margin: 0, letterSpacing: '-0.02em' }}>{title}</p>
                {/* × Light context close — 16px icon, 36×36 circle, 44×44 tap target */}
                <LightModalBtn onClick={onClose} ariaLabel="Close" style={{ marginRight: -4 }}>
                  <X size={16} strokeWidth={2.5} />
                </LightModalBtn>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {fields.map(field => (
                  <div key={field.key}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: C.black, display: 'block', marginBottom: 8 }}>
                      {field.label}
                    </label>
                    {field.key === 'price' ? (
                      <NumberInput
                        placeholder={field.placeholder}
                        value={values[field.key] || ''}
                        onChange={val => setValues(prev => ({ ...prev, [field.key]: val }))}
                        style={{ height: 52 }}
                      />
                    ) : (
                      <input
                        placeholder={field.placeholder}
                        value={values[field.key] || ''}
                        onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                        type="text"
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
                    )}
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

/* ── Simple toggle switch ──────────────────────────────── */
function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: checked ? C.black : C.border,
        border: 'none', cursor: 'pointer', padding: 0,
        position: 'relative', flexShrink: 0,
        transition: 'background 200ms',
      }}
      aria-checked={checked}
      role="switch"
    >
      <div style={{
        width: 18, height: 18, borderRadius: 9, background: C.white,
        position: 'absolute', top: 3,
        left: checked ? 23 : 3,
        transition: 'left 200ms',
      }} />
    </button>
  );
}

export default function InvoiceDefaults() {
  const { invoiceDefaults, updateInvoiceDefaults, branding, updateBranding } = useApp();
  const navigate = useNavigate();
  const [defaults, setDefaults]       = useState<InvoiceDefaultsType>(() => ({
    ...invoiceDefaults,
    fullName:     invoiceDefaults.fullName || branding.freelancerName || '',
    businessName: invoiceDefaults.businessName || branding.businessName || '',
    taxEnabled:   invoiceDefaults.taxEnabled ?? false,
    taxLabel:     invoiceDefaults.taxLabel ?? '',
    taxRate:      invoiceDefaults.taxRate ?? 20,
  }));
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
    // keep branding name/businessName in sync
    updateBranding({ ...branding, freelancerName: defaults.fullName, businessName: defaults.businessName });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputBase: React.CSSProperties = {
    background: C.white, border: `1px solid ${C.border}`, borderRadius: R.md,
    padding: '0 12px', fontSize: '13px', outline: 'none', fontFamily: 'inherit',
    height: 44, width: '100%', boxSizing: 'border-box',
    transition: 'border-color 150ms',
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
        <DarkNavBtn
          onClick={() => navigate('/projects', { state: { openProfile: true } })}
          ariaLabel="Go back"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </DarkNavBtn>
        <span style={{ fontSize: T.title.fontSize, fontWeight: 600, color: C.white, letterSpacing: '-0.01em' }}>Invoice defaults</span>
        <div style={{ minWidth: 44 }} />
      </nav>

      <main style={{ flex: 1, padding: '12px 16px 32px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* ── Your business ────────────────────────── */}
          <SectionCard title="YOUR BUSINESS">
            <p style={{ fontSize: '13px', color: C.muted, margin: '0 0 16px', lineHeight: 1.5 }}>
              This information appears on every invoice and quote you send.
            </p>

            {/* Name + Business name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Your name
                </label>
                <input
                  value={defaults.fullName}
                  onChange={e => update({ fullName: e.target.value })}
                  placeholder="Kiran Das"
                  style={inputBase}
                  onFocus={e => (e.currentTarget.style.borderColor = C.black)}
                  onBlur={e  => (e.currentTarget.style.borderColor = C.border)}
                />
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Business name
                </label>
                <input
                  value={defaults.businessName}
                  onChange={e => update({ businessName: e.target.value })}
                  placeholder="KD Studio"
                  style={inputBase}
                  onFocus={e => (e.currentTarget.style.borderColor = C.black)}
                  onBlur={e  => (e.currentTarget.style.borderColor = C.border)}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: '10px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Email
              </label>
              <input
                value={defaults.businessEmail}
                onChange={e => update({ businessEmail: e.target.value })}
                placeholder="kiran@kdstudio.co"
                type="email"
                style={inputBase}
                onFocus={e => (e.currentTarget.style.borderColor = C.black)}
                onBlur={e  => (e.currentTarget.style.borderColor = C.border)}
              />
            </div>

            {/* Address line 1 */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: '10px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Address line 1
              </label>
              <input
                value={defaults.addressLine1}
                onChange={e => update({ addressLine1: e.target.value })}
                placeholder="14 Clerkenwell Road"
                style={inputBase}
                onFocus={e => (e.currentTarget.style.borderColor = C.black)}
                onBlur={e  => (e.currentTarget.style.borderColor = C.border)}
              />
            </div>

            {/* Address line 2 */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: '10px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Address line 2 <span style={{ fontWeight: 400, opacity: 0.55 }}>optional</span>
              </label>
              <input
                value={defaults.addressLine2}
                onChange={e => update({ addressLine2: e.target.value })}
                placeholder="Floor, suite, unit..."
                style={inputBase}
                onFocus={e => (e.currentTarget.style.borderColor = C.black)}
                onBlur={e  => (e.currentTarget.style.borderColor = C.border)}
              />
            </div>

            {/* City + Postcode row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  City
                </label>
                <input
                  value={defaults.city}
                  onChange={e => update({ city: e.target.value })}
                  placeholder="London"
                  style={inputBase}
                  onFocus={e => (e.currentTarget.style.borderColor = C.black)}
                  onBlur={e  => (e.currentTarget.style.borderColor = C.border)}
                />
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Postcode
                </label>
                <input
                  value={defaults.postcode}
                  onChange={e => update({ postcode: e.target.value })}
                  placeholder="EC1M 5RF"
                  style={inputBase}
                  onFocus={e => (e.currentTarget.style.borderColor = C.black)}
                  onBlur={e  => (e.currentTarget.style.borderColor = C.border)}
                />
              </div>
            </div>

            {/* Phone + VAT row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Phone <span style={{ fontWeight: 400, opacity: 0.55 }}>optional</span>
                </label>
                <input
                  value={defaults.phone}
                  onChange={e => update({ phone: e.target.value })}
                  placeholder="+44 7700 900000"
                  type="tel"
                  style={inputBase}
                  onFocus={e => (e.currentTarget.style.borderColor = C.black)}
                  onBlur={e  => (e.currentTarget.style.borderColor = C.border)}
                />
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  VAT / Reg no <span style={{ fontWeight: 400, opacity: 0.55 }}>optional</span>
                </label>
                <input
                  value={defaults.regNumber}
                  onChange={e => update({ regNumber: e.target.value })}
                  placeholder="GB123456789"
                  style={inputBase}
                  onFocus={e => (e.currentTarget.style.borderColor = C.black)}
                  onBlur={e  => (e.currentTarget.style.borderColor = C.border)}
                />
              </div>
            </div>
          </SectionCard>

          {/* ── Numbering ────────────────────────────── */}
          <SectionCard title="NUMBERING">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Invoice prefix
                </label>
                <input
                  value={defaults.invoicePrefix}
                  onChange={e => update({ invoicePrefix: e.target.value })}
                  placeholder="INV"
                  style={inputBase}
                  onFocus={e => (e.currentTarget.style.borderColor = C.black)}
                  onBlur={e  => (e.currentTarget.style.borderColor = C.border)}
                />
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Quote prefix
                </label>
                <input
                  value={defaults.quotePrefix}
                  onChange={e => update({ quotePrefix: e.target.value })}
                  placeholder="QUO"
                  style={inputBase}
                  onFocus={e => (e.currentTarget.style.borderColor = C.black)}
                  onBlur={e  => (e.currentTarget.style.borderColor = C.border)}
                />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '10px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Starting number
              </label>
              <NumberInput
                min={1}
                value={defaults.startingNumber ?? 1}
                onChange={val => update({ startingNumber: Math.max(1, Number(val)) })}
                style={{ height: 44 }}
              />
            </div>
          </SectionCard>

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
                        fontSize: T.pill.fontSize, fontWeight: 600, color: C.black,
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
                        fontSize: T.pill.fontSize, fontWeight: 600, color: C.danger,
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

          {/* ── Services ────────────────────────────── */}
          <SectionCard title="Services">
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
                    {currSym(defaults.defaultCurrency ?? 'GBP')}{item.price.toLocaleString()}
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
                {PAYMENT_TERMS.map(t => {
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

          {/* ── Tax ──────────────────────────────────── */}
          <SectionCard title="TAX">
            {/* Toggle row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: defaults.taxEnabled ? 16 : 0 }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: C.black }}>Add tax to invoices</label>
              <ToggleSwitch checked={!!defaults.taxEnabled} onChange={(v) => update({ taxEnabled: v })} />
            </div>

            {defaults.taxEnabled && (
              <>
                {/* Tax name + rate side-by-side */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 10, marginBottom: 10 }}>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Tax name
                    </label>
                    <input
                      value={defaults.taxLabel ?? ''}
                      onChange={e => update({ taxLabel: e.target.value })}
                      placeholder="e.g. VAT, GST, Tax"
                      style={inputBase}
                      onFocus={e => (e.currentTarget.style.borderColor = C.black)}
                      onBlur={e  => (e.currentTarget.style.borderColor = C.border)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Rate
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={defaults.taxRate ?? 20}
                        onChange={e => update({ taxRate: Number(e.target.value) })}
                        placeholder="0"
                        style={{ ...inputBase, paddingRight: 28 }}
                        onFocus={e => (e.currentTarget.style.borderColor = C.black)}
                        onBlur={e  => (e.currentTarget.style.borderColor = C.border)}
                      />
                      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: C.muted, pointerEvents: 'none' }}>%</span>
                    </div>
                  </div>
                </div>

                {/* Helper: "Shown on invoice as: VAT 20%" */}
                {defaults.taxLabel && (
                  <p style={{ fontSize: '11px', color: C.muted, margin: '0 0 10px', lineHeight: 1.5 }}>
                    Shown on invoice as: <strong style={{ color: C.black }}>{defaults.taxLabel} {defaults.taxRate ?? 0}%</strong>
                  </p>
                )}
              </>
            )}
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
            cursor: 'pointer', fontSize: T.input.fontSize, fontWeight: 700,
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