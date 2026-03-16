import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { X, ChevronDown } from 'lucide-react';
import { useApp } from '../store';
import { C, T, R } from '../tokens';
import { Btn } from '../components/ui/Btn';

const CURRENCIES = ['GBP', 'USD', 'EUR', 'INR', 'AUD', 'CAD'];

const DUE_QUICK: { label: string; days: number }[] = [
  { label: '7 days',  days: 7  },
  { label: '14 days', days: 14 },
  { label: '30 days', days: 30 },
];

const CATEGORIES = [
  'Branding', 'Web', 'App', 'Motion', 'UI/UX',
  'Illustration', 'Strategy', 'Print', 'Copy', 'Photo',
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
  fontSize: '14px', outline: 'none', color: C.black,
  fontFamily: 'inherit', boxSizing: 'border-box',
  transition: 'border-color 150ms',
};

export default function NewProject() {
  const { addProject, invoiceDefaults } = useApp();
  const navigate = useNavigate();

  // ── Client ────────────────────────────────────────
  const [clientName, setClientName]     = useState('');
  const [clientEmail, setClientEmail]   = useState('');
  const [contactPerson, setContact]     = useState('');

  // ── Project ───────────────────────────────────────
  const [type, setType]                 = useState('');
  const [categories, setCategories]     = useState<string[]>([]);
  const [showRateCard, setShowRateCard] = useState(false);

  // ── Money ─────────────────────────────────────────
  const [amount, setAmount]             = useState('');
  const [currency, setCurrency]         = useState(invoiceDefaults.defaultCurrency || 'GBP');
  const [deposit, setDeposit]           = useState('');

  // ── Dates ─────────────────────────────────────────
  const [startDate, setStartDate]       = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate]           = useState('');

  // ── Notes ─────────────────────────────────────────
  const [notes, setNotes]               = useState('');

  // ── UI state ──────────────────────────────────────
  const [errors, setErrors]             = useState<Record<string, string>>({});

  const isValid = clientName.trim() && type.trim();
  const sym     = currencySymbol(currency);

  const applyDays = (days: number) => {
    const d = new Date(startDate || Date.now());
    d.setDate(d.getDate() + days);
    setDueDate(d.toISOString().split('T')[0]);
  };

  const toggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      setCategories(prev => prev.filter(c => c !== cat));
    } else if (categories.length < 5) {
      setCategories(prev => [...prev, cat]);
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!clientName.trim()) e.clientName = 'Client name is required';
    if (!type.trim())       e.type       = 'Project type is required';
    if (amount.trim() && Number(amount) < 0) e.amount = 'Enter a valid amount';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const id = addProject({
      clientName:    clientName.trim(),
      clientEmail:   clientEmail.trim() || undefined,
      contactPerson: contactPerson.trim() || undefined,
      type:          type.trim(),
      categories:    categories.length ? categories : undefined,
      amount:        amount.trim() ? Number(amount) : 0,
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
        <button
          onClick={() => navigate('/projects')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.white, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', padding: 0 }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div style={{ flex: 1 }} />

        <button
          onClick={handleSave}
          disabled={!isValid}
          style={{
            background: 'none', border: 'none',
            color: isValid ? C.white : 'rgba(255,255,255,0.3)',
            minHeight: 44, padding: '0 4px',
            fontSize: '13px', fontWeight: 600,
            cursor: isValid ? 'pointer' : 'default',
            letterSpacing: '0',
            transition: 'color 150ms',
          }}
        >
          Save
        </button>
      </nav>

      {/* ── Form ──────────────────────────────────── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16 }}>

          {/* ── CLIENT ──────────────────────────────── */}
          <FormSection>
            {/* Client name — hero */}
            <Field label="Client name" error={errors.clientName}>
              <input
                className="ci"
                value={clientName}
                onChange={e => { setClientName(e.target.value); if (errors.clientName) setErrors(p => ({ ...p, clientName: '' })); }}
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

            <Field label="Client email" optional helper="Used to pre-fill share sheet when sending quotes and invoices">
              <input
                className="ci"
                type="email"
                value={clientEmail}
                onChange={e => setClientEmail(e.target.value)}
                placeholder="e.g. hello@acmecorp.com"
                style={{ ...baseInput }}
              />
            </Field>

            <Field label="Contact person" optional helper="If client is a company">
              <input
                className="ci"
                value={contactPerson}
                onChange={e => setContact(e.target.value)}
                placeholder="e.g. Sarah Johnson"
                style={{ ...baseInput }}
              />
            </Field>
          </FormSection>

          {/* ── PROJECT ─────────────────────────────── */}
          <FormSection>
            <Field label="Project type" error={errors.type}>
              <div style={{ position: 'relative' }}>
                <input
                  className="ci"
                  value={type}
                  onChange={e => { setType(e.target.value); if (errors.type) setErrors(p => ({ ...p, type: '' })); }}
                  placeholder="e.g. Brand identity"
                  onFocus={() => setShowRateCard(true)}
                  onBlur={() => setTimeout(() => setShowRateCard(false), 200)}
                  style={{ ...baseInput, border: `1px solid ${errors.type ? C.danger : C.border}` }}
                  aria-invalid={!!errors.type}
                />
                {showRateCard && invoiceDefaults.rateCard.length > 0 && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
                    background: C.white, border: `1px solid ${C.border}`,
                    borderRadius: R.md, boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    overflow: 'hidden', zIndex: 10,
                  }}>
                    {invoiceDefaults.rateCard.map(item => (
                      <button
                        key={item.id}
                        onMouseDown={() => {
                          setType(item.service);
                          setAmount(String(item.price));
                          setShowRateCard(false);
                          setErrors(p => ({ ...p, type: '', amount: '' }));
                        }}
                        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', minHeight: 44, border: 'none', borderBottom: `1px solid ${C.border}`, background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
                        onMouseEnter={e => e.currentTarget.style.background = C.surface}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ fontSize: '13px', fontWeight: 500, color: C.black }}>{item.service}</span>
                        <span style={{ fontSize: '13px', color: C.muted }}>{sym}{item.price.toLocaleString()}</span>
                      </button>
                    ))}
                    <button
                      onMouseDown={() => setShowRateCard(false)}
                      style={{ width: '100%', padding: '10px 12px', minHeight: 40, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', fontSize: '13px', color: C.muted }}
                    >
                      None of these
                    </button>
                  </div>
                )}
              </div>
            </Field>

            {/* Categories */}
            <Field label="Categories" optional helper={`Max 5 · tap to remove${categories.length >= 5 ? ' · limit reached' : ''}`}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {CATEGORIES.map(cat => {
                  const active = categories.includes(cat);
                  const atMax = categories.length >= 5 && !active;
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      disabled={atMax}
                      style={{
                        padding: '4px 12px',
                        border: `1.5px solid ${active ? C.black : '#C4C4C4'}`,
                        borderRadius: 16,
                        background: active ? C.black : '#F0F0F0',
                        color: active ? C.white : '#6B6B6B',
                        cursor: atMax ? 'not-allowed' : 'pointer',
                        fontSize: '11px', fontWeight: 600,
                        transition: 'all 120ms',
                        opacity: atMax ? 0.4 : 1,
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </Field>
          </FormSection>

          {/* ── MONEY ───────────────────────────────── */}
          <FormSection>
            {/* Quoted amount + Currency */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <Field label="Quoted amount" error={errors.amount}>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: C.muted, pointerEvents: 'none' }}>{sym}</span>
                    <input
                      className="ci"
                      type="number" value={amount}
                      onChange={e => { setAmount(e.target.value); if (errors.amount) setErrors(p => ({ ...p, amount: '' })); }}
                      placeholder="0"
                      style={{ ...baseInput, paddingLeft: 26, border: `1px solid ${errors.amount ? C.danger : C.border}` }}
                    />
                  </div>
                </Field>
              </div>
              <div style={{ width: 88 }}>
                <label style={{ fontSize: '10px', fontWeight: 600, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Currency</label>
                <div style={{ position: 'relative' }}>
                  <select
                    className="ci"
                    value={currency} onChange={e => setCurrency(e.target.value)}
                    style={{ ...baseInput, paddingRight: 28, appearance: 'none', cursor: 'pointer' }}>
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: C.muted }} />
                </div>
              </div>
            </div>

            {/* Deposit */}
            <Field label="Deposit required" optional helper="Shown on quote if applicable">
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: C.muted, pointerEvents: 'none' }}>{sym}</span>
                <input
                  className="ci"
                  type="number" value={deposit}
                  onChange={e => setDeposit(e.target.value)}
                  placeholder="e.g. 50%"
                  style={{ ...baseInput, paddingLeft: 26 }}
                />
              </div>
            </Field>
          </FormSection>

          {/* ── DATES ───────────────────────────────── */}
          <FormSection>
            <Field label="Start date">
              <input
                className="ci"
                type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                style={baseInput} />
            </Field>

            <Field label="Due date" optional>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                {DUE_QUICK.map(q => (
                  <button key={q.label} onClick={() => applyDays(q.days)}
                    style={{ padding: '4px 11px', border: `1.5px solid ${C.black}`, borderRadius: R.xl, background: C.white, cursor: 'pointer', fontSize: '11px', fontWeight: 700, color: C.black, transition: 'background 120ms' }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.surface; }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.white; }}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
              <input
                className="ci"
                type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                style={baseInput} />
              <p style={{ fontSize: '11px', color: C.muted, margin: '4px 0 0' }}>Days after invoice is sent</p>
            </Field>
          </FormSection>

          {/* ── NOTES ───────────────────────────────── */}
          <FormSection>
            <Field label="Notes" optional>
              <textarea
                className="ci"
                value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Project scope, deliverables, important context..."
                rows={3}
                style={{ ...baseInput, height: 'auto', padding: '10px 12px', resize: 'none', lineHeight: 1.6 } as React.CSSProperties}
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
          Create project
        </Btn>
      </div>
    </div>
  );
}