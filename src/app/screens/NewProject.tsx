import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { X, ChevronDown } from 'lucide-react';
import { DarkNavBtn } from '../components/ui/CircleIconBtn';
import { useApp } from '../store';
import { C, T, R } from '../tokens';
import { Btn } from '../components/ui/Btn';
import { NumberInput } from '../components/ui/NumberInput';
import { ServicesSection, ServiceItem } from '../components/ui/ServicesSection';
import { Contact } from '../types';

const CURRENCIES = ['GBP', 'USD', 'EUR', 'INR', 'AUD', 'CAD'];

const DUE_QUICK: { label: string; days: number }[] = [
  { label: '7 days',  days: 7  },
  { label: '14 days', days: 14 },
  { label: '30 days', days: 30 },
];

const currencySymbol = (c: string) =>
  c === 'GBP' ? '£' : c === 'USD' ? '$' : c === 'EUR' ? '€' : c === 'INR' ? '₹' : c;

/* ── Field wrapper ─────────────────────────────────────────── */
function Field({
  label, optional, helper, error, children,
}: { label: string; optional?: boolean; helper?: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
        <label style={{
          fontSize: '10px', fontWeight: 600, color: C.muted,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          {label}
        </label>
        {optional && (
          <span style={{ fontSize: '10px', color: C.hint, letterSpacing: '0.02em' }}>optional</span>
        )}
      </div>
      {children}
      {helper && !error && <p style={{ fontSize: '11px', color: C.muted, margin: '4px 0 0', lineHeight: 1.5 }}>{helper}</p>}
      {error && <p style={{ fontSize: '11px', color: C.danger, margin: '4px 0 0' }}>{error}</p>}
    </div>
  );
}

/* ── Form section card ─────────────────────────────────────── */
function FormSection({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: C.white, border: `1px solid ${C.border}`,
      borderRadius: R.xl, padding: '16px 16px',
      display: 'flex', flexDirection: 'column', gap: 18,
    }}>
      {children}
    </div>
  );
}

const baseInput: React.CSSProperties = {
  width: '100%', height: 44,
  background: C.white, border: `1px solid ${C.border}`,
  borderRadius: R.md, padding: '0 12px',
  fontSize: T.input.fontSize, outline: 'none', color: C.black,
  fontFamily: 'inherit', boxSizing: 'border-box',
  transition: 'border-color 150ms',
};

export default function NewProject() {
  const { addProject, invoiceDefaults, updateInvoiceDefaults } = useApp();
  const navigate = useNavigate();

  // ── Client ────────────────────────────────────────
  const [clientName, setClientName]         = useState('');
  const [primaryContactName, setPrimaryContactName] = useState('');
  const [primaryContactEmail, setPrimaryContactEmail] = useState('');
  const [additionalContacts, setAdditionalContacts] = useState<Contact[]>([]);

  // ── Services ──────────────────────────────────────
  const [services, setServices]       = useState<ServiceItem[]>([]);

  // ── Money ─────────────────────────────────────────
  const [amount, setAmount]           = useState('');
  const [amountIsCustom, setAmountIsCustom] = useState(false);
  const [currency, setCurrency]       = useState(invoiceDefaults.defaultCurrency || 'GBP');
  const [deposit, setDeposit]         = useState('');

  // ── Dates ─────────────────────────────────────────
  const [startDate, setStartDate]         = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate]             = useState('');
  const [activeDueDays, setActiveDueDays] = useState<number | null>(null);

  // ── Notes ─────────────────────────────────────────
  const [notes, setNotes]             = useState('');

  // ── Errors ────────────────────────────────────────
  const [errors, setErrors]           = useState<Record<string, string>>({});

  const isValid = clientName.trim().length > 0 && services.length > 0;
  const sym     = currencySymbol(currency);

  /* Derived: service total to compare against quoted amount */
  const serviceTotal = services.reduce((sum, s) => sum + s.price, 0);
  const amountDiffersFromServices =
    amountIsCustom &&
    services.length > 0 &&
    (parseFloat(amount) || 0) !== serviceTotal;

  const applyDays = (days: number) => {
    const d = new Date(startDate || Date.now());
    d.setDate(d.getDate() + days);
    setDueDate(d.toISOString().split('T')[0]);
    setActiveDueDays(days);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!clientName.trim()) e.clientName = 'Client name is required';
    if (!services.length)   e.services   = 'At least one service is required';
    if (amount.trim() && Number(amount) < 0) e.amount = 'Enter a valid amount';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAddToRateCard = (name: string, price: number) => {
    updateInvoiceDefaults({
      ...invoiceDefaults,
      rateCard: [...invoiceDefaults.rateCard, { id: `rc-${Date.now()}`, service: name, price }],
    });
  };

  const handleSave = () => {
    if (!validate()) return;
    const totalFromServices = services.reduce((sum, s) => sum + s.price, 0);
    const finalAmount = amount.trim() ? Number(amount) : totalFromServices;
    const id = addProject({
      clientName:    clientName.trim(),
      clientEmail:   primaryContactEmail.trim() || undefined,
      contactPerson: primaryContactName.trim() || undefined,
      additionalContacts: additionalContacts.filter(c => c.name.trim()).length > 0
        ? additionalContacts.filter(c => c.name.trim())
        : undefined,
      type:          services[0]?.name || '',
      services,
      amount:        finalAmount,
      depositAmount: deposit.trim() ? Number(deposit) : undefined,
      currency,
      startDate,
      dueDate:       dueDate || undefined,
      notes:         notes.trim() || undefined,
      status:        'ready',
    });
    navigate(`/projects/${id}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: C.surface }}>

      {/* ── Header ────────────────────────────────── */}
      <nav style={{
        background: C.black,
        padding: `calc(env(safe-area-inset-top, 0px) + 14px) 16px 12px`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, minHeight: 52,
      }}>
        <DarkNavBtn onClick={() => navigate('/projects')} ariaLabel="Close">
          <X size={20} strokeWidth={2} />
        </DarkNavBtn>

        <div style={{ flex: 1 }} />

        <button
          onClick={handleSave}
          disabled={!isValid}
          onMouseEnter={e => { if (isValid) e.currentTarget.style.opacity = '0.65'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          style={{
            background: 'none', border: 'none',
            color: isValid ? C.white : 'rgba(255,255,255,0.3)',
            minHeight: 44, padding: '0 4px',
            fontSize: '13px', fontWeight: 600,
            cursor: isValid ? 'pointer' : 'default',
            transition: 'color 150ms, opacity 150ms',
          }}
        >
          Save
        </button>
      </nav>

      {/* ── Form ──────────────────────────────────── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16 }}>

          {/* ── 1. CLIENT DETAILS ───────────────────── */}
          <FormSection>
            <Field label="Client name" error={errors.clientName}>
              <input
                className="ci"
                value={clientName}
                onChange={e => {
                  setClientName(e.target.value);
                  if (errors.clientName) setErrors(p => ({ ...p, clientName: '' }));
                }}
                placeholder="e.g. Acme Corp"
                style={{
                  ...baseInput,
                  fontSize: '18px', fontWeight: 600, letterSpacing: '-0.01em', height: 48,
                  border: `1px solid ${errors.clientName ? C.danger : C.border}`,
                }}
                autoFocus
                aria-invalid={!!errors.clientName}
              />
            </Field>

            {/* ── CONTACTS ─────────────────────────── */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
                <label style={{ fontSize: '10px', fontWeight: 600, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                  Contacts
                </label>
              </div>

              {/* Primary contact */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flex: 1 }}>
                  <input
                    className="ci"
                    value={primaryContactName}
                    onChange={e => setPrimaryContactName(e.target.value)}
                    placeholder="Contact name"
                    style={{ ...baseInput }}
                  />
                  <input
                    className="ci"
                    type="email"
                    value={primaryContactEmail}
                    onChange={e => setPrimaryContactEmail(e.target.value)}
                    placeholder="Contact email"
                    style={{ ...baseInput }}
                  />
                </div>
                {/* Spacer to match X button width on additional rows */}
                <div style={{ width: 28, flexShrink: 0 }} />
              </div>

              {/* Additional contacts */}
              {additionalContacts.map((contact, idx) => (
                <div key={contact.id} style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 8 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flex: 1 }}>
                    <input
                      className="ci"
                      value={contact.name}
                      onChange={e => {
                        const updated = [...additionalContacts];
                        updated[idx] = { ...contact, name: e.target.value };
                        setAdditionalContacts(updated);
                      }}
                      placeholder="Contact name"
                      style={{ ...baseInput }}
                    />
                    <input
                      className="ci"
                      type="email"
                      value={contact.email || ''}
                      onChange={e => {
                        const updated = [...additionalContacts];
                        updated[idx] = { ...contact, email: e.target.value };
                        setAdditionalContacts(updated);
                      }}
                      placeholder="Contact email"
                      style={{ ...baseInput }}
                    />
                  </div>
                  <div style={{ width: 28, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                    <button
                      onClick={() => setAdditionalContacts(additionalContacts.filter(c => c.id !== contact.id))}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: C.disabled, padding: 4, display: 'flex', alignItems: 'center',
                        transition: 'color 150ms',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.danger)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.disabled)}
                      aria-label="Remove contact"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add another contact (max 3 total = primary + 2) */}
              {additionalContacts.length < 2 ? (
                <button
                  onClick={() => setAdditionalContacts([...additionalContacts, { id: `c-${Date.now()}`, name: '', email: '' }])}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '13px', fontWeight: 500, color: C.muted,
                    padding: '4px 0', display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  + Add another contact
                </button>
              ) : (
                <p style={{ fontSize: '10px', color: C.disabled, margin: 0 }}>Max 3 contacts</p>
              )}
            </div>
          </FormSection>

          {/* ── 2. PROJECT ──────────────────────────── */}
          <FormSection>

            {/* Services */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                <label style={{
                  fontSize: '10px', fontWeight: 600, color: C.muted,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>
                  Services
                </label>
              </div>
              <p style={{ fontSize: T.xs.fontSize, color: C.muted, margin: '0 0 12px', lineHeight: 1.5 }}>
                Tap to add from your services
              </p>
              <ServicesSection
                services={services}
                onChange={svcs => {
                  setServices(svcs);
                  // Auto-recalculate quoted amount unless user has overridden it
                  if (!amountIsCustom) {
                    const total = svcs.reduce((sum, s) => sum + s.price, 0);
                    setAmount(total > 0 ? String(total) : '');
                  }
                  if (errors.services) setErrors(p => ({ ...p, services: '' }));
                }}
                rateCard={invoiceDefaults.rateCard}
                currencySymbol={sym}
                onAddToRateCard={handleAddToRateCard}
                onNavigateToRateCard={() => navigate('/settings/invoice-defaults')}
              />
              {errors.services && (
                <p style={{ fontSize: '11px', color: C.danger, margin: '6px 0 0' }}>
                  {errors.services}
                </p>
              )}
            </div>

            {/* Quoted amount + Currency */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <Field label="Quoted amount" optional error={errors.amount}>
                  <NumberInput
                    prefix={sym}
                    value={amount}
                    onChange={val => {
                      setAmount(val);
                      // Mark as custom if it differs from service total
                      const total = services.reduce((sum, s) => sum + s.price, 0);
                      setAmountIsCustom(services.length > 0 && (parseFloat(val) || 0) !== total);
                      if (errors.amount) setErrors(p => ({ ...p, amount: '' }));
                    }}
                    placeholder="0"
                    min={0}
                    style={{ height: 44, border: `1px solid ${errors.amount ? C.danger : C.border}` }}
                  />
                  {amountDiffersFromServices && (
                    <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: T.xs.fontSize, color: C.amberText, lineHeight: 1.4 }}>
                        Custom amount — differs from service total ({sym}{serviceTotal.toLocaleString()})
                      </span>
                      <button
                        onClick={() => { setAmount(String(serviceTotal)); setAmountIsCustom(false); }}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: T.xs.fontSize, color: C.muted, padding: 0,
                          fontFamily: 'inherit', textDecoration: 'underline',
                        }}
                      >
                        Reset to service total
                      </button>
                    </div>
                  )}
                </Field>
              </div>
              <div style={{ width: 88 }}>
                <label style={{
                  fontSize: '10px', fontWeight: 600, color: C.muted,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  display: 'block', marginBottom: 6,
                }}>
                  Currency
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    className="ci"
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    style={{ ...baseInput, paddingRight: 28, appearance: 'none', cursor: 'pointer' }}
                  >
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={14} style={{
                    position: 'absolute', right: 10, top: '50%',
                    transform: 'translateY(-50%)', pointerEvents: 'none', color: C.muted,
                  }} />
                </div>
              </div>
            </div>

            {/* Deposit */}
            <Field label="Deposit" optional helper="Shown on quote if applicable">
              <NumberInput
                prefix={sym}
                value={deposit}
                onChange={val => setDeposit(val)}
                placeholder="0"
                min={0}
                style={{ height: 44 }}
              />
            </Field>

            {/* Start date */}
            <Field label="Start date">
              <input
                className="ci"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                style={baseInput}
              />
            </Field>

            {/* Due date */}
            <Field label="Due date" optional>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                {DUE_QUICK.map(q => {
                  const isActive = activeDueDays === q.days;
                  return (
                    <button
                      key={q.label}
                      onClick={() => applyDays(q.days)}
                      style={{
                        padding: '4px 11px',
                        border: `1.5px solid ${isActive ? C.black : C.border}`,
                        borderRadius: R.xl,
                        background: isActive ? C.black : C.white,
                        cursor: 'pointer',
                        fontSize: '11px', fontWeight: 600,
                        color: isActive ? C.white : C.muted,
                        transition: 'border-color 120ms, color 120ms, background 120ms',
                      }}
                      onMouseEnter={e => {
                        if (!isActive) {
                          e.currentTarget.style.borderColor = C.black;
                          e.currentTarget.style.color = C.black;
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive) {
                          e.currentTarget.style.borderColor = C.border;
                          e.currentTarget.style.color = C.muted;
                        }
                      }}
                    >
                      {q.label}
                    </button>
                  );
                })}
              </div>
              <input
                className="ci"
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                style={baseInput}
              />
              <p style={{ fontSize: '11px', color: C.muted, margin: '4px 0 0' }}>
                Days after invoice is sent
              </p>
            </Field>

            {/* Notes */}
            <Field label="Notes" optional>
              <textarea
                className="ci"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Project scope, deliverables, important context..."
                rows={3}
                style={{
                  ...baseInput, height: 'auto',
                  padding: '10px 12px', resize: 'none', lineHeight: 1.6,
                } as React.CSSProperties}
              />
            </Field>

          </FormSection>

        </div>
      </main>

      {/* ── Create project button ─────────────────── */}
      <div style={{
        padding: `12px 16px calc(24px + env(safe-area-inset-bottom, 0px))`,
        background: C.white, borderTop: `1px solid ${C.border}`, flexShrink: 0,
      }}>
        <Btn
          variant="primary"
          fullWidth
          disabled={!isValid}
          onClick={handleSave}
          style={{ height: 50 }}
        >
          Create project →
        </Btn>
      </div>
    </div>
  );
}