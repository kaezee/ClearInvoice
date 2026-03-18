import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../store';
import { C, T } from '../tokens';

/* ── Clear logo SVG ─────────────────────────────────────── */
const ClearLogo = ({ height = 26, dark = false }: { height?: number; dark?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400.54 111.02" height={height} fill={dark ? '#0A0A0A' : '#FFFFFF'} style={{ display: 'block' }}>
    <path d="m32.05,18.71c5.21-3.37,11.45-5.06,18.71-5.06,8.18,0,14.62,1.89,19.32,5.67,4.7,3.78,7.82,8.84,9.35,15.18h17.02c-2.05-10.94-7.03-19.42-14.95-25.46C73.58,3.02,63.38,0,50.91,0c-10.43,0-19.47,2.33-27.14,6.98-7.67,4.65-13.55,11.17-17.63,19.55C2.04,34.91,0,44.57,0,55.51s2.04,20.73,6.13,29.06c4.09,8.33,9.97,14.82,17.63,19.48,7.67,4.65,16.71,6.98,27.14,6.98,12.47,0,22.67-2.99,30.59-8.97,7.92-5.98,12.91-14.28,14.95-24.92h-17.02c-1.53,6.24-4.65,11.17-9.35,14.8-4.7,3.63-11.14,5.44-19.32,5.44-7.26,0-13.49-1.66-18.71-4.98-5.21-3.32-9.25-8.13-12.11-14.41-2.86-6.29-4.29-13.78-4.29-22.47s1.43-16.15,4.29-22.39c2.86-6.23,6.9-11.04,12.11-14.41Z"/>
    <polygon fill="#00c2cc" points="205.28 2.96 120.82 83.76 121.6 42.78 106.27 31.41 107.18 109.18 117.11 109.18 223.02 1.87 205.28 2.96"/>
    <path d="m251.18,35.12c-5.42-3.37-11.91-5.06-19.48-5.06s-14.24,1.71-20.01,5.14c-5.78,3.43-10.22,8.18-13.34,14.26-3.12,6.08-4.68,13.16-4.68,21.24s1.61,15.13,4.83,21.16c3.22,6.03,7.67,10.73,13.34,14.11,5.67,3.37,12.19,5.06,19.55,5.06,6.13,0,11.5-1.07,16.1-3.22,4.6-2.15,8.48-5.08,11.66-8.82,3.17-3.73,5.42-7.95,6.75-12.65h-15.33c-1.43,3.68-3.76,6.59-6.98,8.74-3.22,2.15-7.28,3.22-12.19,3.22-4.19,0-8-1.02-11.42-3.07-3.43-2.04-6.16-5.01-8.2-8.89-1.78-3.38-2.74-7.5-2.97-12.27h58.94c.2-1.33.31-2.61.31-3.83v-3.37c0-6.75-1.46-12.88-4.37-18.4-2.91-5.52-7.08-9.97-12.5-13.34Zm-42.23,28.22c.41-3.64,1.34-6.79,2.82-9.43,2.04-3.63,4.8-6.39,8.28-8.28,3.47-1.89,7.31-2.84,11.5-2.84,5.93,0,10.89,1.84,14.87,5.52,3.99,3.68,6.13,8.69,6.44,15.03h-43.92Z"/>
    <path d="m331.38,33.89c-4.91-2.55-10.99-3.83-18.25-3.83-5.52,0-10.73,1.02-15.64,3.07-4.91,2.05-8.92,5.01-12.04,8.89-3.12,3.89-4.98,8.59-5.6,14.11h15.33c.82-4.5,2.86-7.85,6.13-10.04,3.27-2.2,7.21-3.3,11.81-3.3,3.99,0,7.28.77,9.89,2.3,2.61,1.53,4.57,3.78,5.9,6.75,1.33,2.97,1.99,6.7,1.99,11.19h-19.94c-6.95,0-12.88.97-17.79,2.91-4.91,1.94-8.69,4.73-11.35,8.36-2.66,3.63-3.99,7.95-3.99,12.96,0,4.29,1.02,8.26,3.07,11.88,2.04,3.63,5.16,6.52,9.35,8.66,4.19,2.15,9.45,3.22,15.79,3.22,3.37,0,6.39-.38,9.05-1.15,2.66-.77,5.03-1.81,7.13-3.14,2.09-1.33,3.93-2.91,5.52-4.75,1.58-1.84,2.89-3.78,3.91-5.83l1.23,13.03h13.34v-47.84c0-6.44-1.25-11.99-3.76-16.64-2.51-4.65-6.21-8.25-11.12-10.81Zm-.61,40.33c-.1,3.17-.67,6.19-1.69,9.05-1.02,2.86-2.48,5.47-4.37,7.82-1.89,2.35-4.17,4.19-6.82,5.52-2.66,1.33-5.62,1.99-8.89,1.99-3.07,0-5.75-.51-8.05-1.53-2.3-1.02-4.04-2.45-5.21-4.29-1.18-1.84-1.76-3.99-1.76-6.44s.61-4.62,1.84-6.52c1.23-1.89,3.19-3.35,5.9-4.37,2.71-1.02,6.31-1.53,10.81-1.53h18.25v.31Z"/>
    <path d="m387.74,32.05c-3.83,1.33-7.11,3.2-9.81,5.6-2.71,2.4-4.98,5.34-6.82,8.82l-1.23-14.57h-13.8v77.29h15.34v-38.49c0-4.8.64-8.76,1.92-11.88,1.28-3.12,2.99-5.6,5.14-7.44,2.15-1.84,4.65-3.17,7.51-3.99,2.86-.82,5.88-1.23,9.05-1.23h5.52v-16.1c-4.7,0-8.97.67-12.8,1.99Z"/>
    <rect fill="#ffd600" x="381.03" y="94.88" width="14.3" height="14.3"/>
  </svg>
);

/* ── Progress dots ──────────────────────────────────────── */
function ProgressDots({ total, active, dark }: { total: number; active: number; dark?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: '50%',
          background: i === active - 1
            ? (dark ? '#0A0A0A' : '#FFFFFF')
            : (dark ? '#E2E5EC' : 'rgba(255,255,255,0.3)'),
          transition: 'background 200ms',
        }} />
      ))}
    </div>
  );
}

/* ── Small logo header row ──────────────────────────────── */
function LogoRow({ dark = false, showTagline = false }: { dark?: boolean; showTagline?: boolean }) {
  return (
    <div style={{ paddingLeft: 24, paddingRight: 24, marginBottom: 0 }}>
      <ClearLogo height={28} dark={dark} />
      {showTagline && (
        <p style={{
          fontSize: T.pill.fontSize, fontWeight: 400,
          color: 'rgba(255,255,255,0.45)',
          margin: '6px 0 0',
          letterSpacing: '0.01em',
        }}>
          From quote to cleared.
        </p>
      )}
    </div>
  );
}

/* ── Primary CTA button ─────────────────────────────────── */
function CtaButton({ label, onClick, dark = false, disabled = false }: {
  label: string; onClick: () => void; dark?: boolean; disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%', height: 48,
        background: dark ? '#0A0A0A' : '#FFFFFF',
        color: dark ? '#FFFFFF' : '#0A0A0A',
        border: 'none', borderRadius: '16px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: T.input.fontSize, fontWeight: 700, letterSpacing: '-0.01em',
        opacity: disabled ? 0.3 : 1,
        transition: 'opacity 150ms',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '0.88'; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = '1'; }}
    >
      {label}
    </button>
  );
}

/* ── Currency options with symbols ─────────────────────── */
const CURRENCIES = [
  { code: 'GBP', symbol: '£', label: '£  GBP — British Pound' },
  { code: 'USD', symbol: '$', label: '$  USD — US Dollar' },
  { code: 'EUR', symbol: '€', label: '€  EUR — Euro' },
  { code: 'INR', symbol: '₹', label: '₹  INR — Indian Rupee' },
  { code: 'AUD', symbol: 'A$', label: 'A$  AUD — Australian Dollar' },
  { code: 'CAD', symbol: 'C$', label: 'C$  CAD — Canadian Dollar' },
];

/* ── O1: Welcome (dark, big logo hero) ──────────────────── */
function O1Welcome() {
  const navigate = useNavigate();
  return (
    <div style={darkScreen}>
      <LogoRow showTagline />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 0 }}>
        {/* Big hero logo */}
        <div style={{ marginBottom: 40 }}>
          <ClearLogo height={52} />
        </div>
        <ProgressDots total={5} active={1} />
        <div style={{ height: 40 }} />
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF', textAlign: 'center', letterSpacing: '-0.02em', margin: '0 0 14px' }}>
          Welcome.
        </h1>
        <p style={{ fontSize: '15px', fontWeight: 400, color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 1.6, maxWidth: 280, margin: 0 }}>
          Your freelance work, from first quote to final payment.
        </p>
      </div>
      <div style={{ padding: '0 24px 40px' }}>
        <CtaButton label="Next →" onClick={() => navigate('/onboarding/2')} />
      </div>
    </div>
  );
}

/* ── Google icon ────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );
}

/* ── O2: Sign in (dark) ─────────────────────────────────── */
function O2SignIn() {
  const navigate = useNavigate();
  const goNext = () => navigate('/onboarding/3');
  return (
    <div style={darkScreen}>
      <LogoRow showTagline />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
        <ProgressDots total={5} active={2} />
        <div style={{ height: 40 }} />
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#FFFFFF', textAlign: 'center', letterSpacing: '-0.02em', margin: '0 0 10px' }}>
          Sign in to save your work
        </h1>
        <p style={{ fontSize: T.input.fontSize, fontWeight: 400, color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 1.6, margin: '0 0 40px', maxWidth: 280 }}>
          Projects, quotes and invoices — all in one place.
        </p>
        {/* Google */}
        <button onClick={goNext} style={{
          width: '100%', height: 52,
          background: '#FFFFFF', color: '#0A0A0A',
          border: '1.5px solid #0A0A0A', borderRadius: '16px',
          cursor: 'pointer', fontSize: T.input.fontSize, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          marginBottom: 10,
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <GoogleIcon /> Continue with Google →
        </button>
        {/* Apple */}
        <button style={{
          width: '100%', height: 52,
          background: '#F0F0F0', color: '#7A8099',
          border: '1.5px solid #0A0A0A', borderRadius: '16px',
          cursor: 'not-allowed', fontSize: T.input.fontSize, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          opacity: 0.55,
        }}>
          <svg width="16" height="18" viewBox="0 0 814 1000" fill="currentColor"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 376.8 0 228.5 0 168.1c0-79.4 52.1-121.6 101.7-121.6 38.5 0 70.7 27.1 94.4 27.1 23.7 0 60.8-28.5 99.4-28.5h.5c27.4 0 119.7 11 168.1 84.4zm-62.1-108.2c25.3-30.5 43.1-72.8 43.1-115.1 0-5.8-.5-11.7-1.5-16.7-40.8 1.5-89.1 27.2-118.1 57.6-22.8 24.4-44 63.8-44 102.3 0 6.3.6 12.1 1.6 18.2 4.1.5 8.2 1 12.3 1 37.4 0 83.1-23.8 106.6-47.3z"/></svg>
          Continue with Apple · Coming soon
        </button>
        <p onClick={goNext} style={{
          fontSize: T.pill.fontSize, color: 'rgba(255,255,255,0.4)',
          textAlign: 'center', marginTop: 20, cursor: 'pointer',
          textDecoration: 'underline',
        }}>
          Skip for now
        </p>
      </div>
    </div>
  );
}

/* ── O3: Persona (light) ────────────────────────────────── */
const PERSONAS = ['Designer', 'Developer', 'Consultant', 'Other'] as const;
type Persona = typeof PERSONAS[number];

function O3Persona() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Persona | null>(null);
  return (
    <div style={lightScreen}>
      <div style={{ flex: 1, padding: '0 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <ProgressDots total={5} active={3} dark />
        <div style={{ height: 36 }} />
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#0A0A0A', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          What do you do?
        </h1>
        <p style={{ fontSize: T.input.fontSize, fontWeight: 400, color: '#7A8099', margin: '0 0 28px' }}>
          We'll tailor Clear to fit your work.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PERSONAS.map(p => {
            const active = selected === p;
            return (
              <button key={p} onClick={() => setSelected(p)}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#F5F5F5'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = '#FFFFFF'; }}
                style={{
                  width: '100%', height: 64,
                  background: active ? '#0A0A0A' : '#FFFFFF',
                  color: active ? '#FFFFFF' : '#0A0A0A',
                  border: `1.5px solid ${active ? '#0A0A0A' : '#E2E5EC'}`,
                  borderRadius: '12px', cursor: 'pointer',
                  fontSize: '15px', fontWeight: 500,
                  padding: '0 20px', textAlign: 'left',
                  transition: 'background 150ms, color 150ms, border-color 150ms',
                }}>
                {p}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ padding: '0 24px 40px' }}>
        <CtaButton label="Next →" onClick={() => navigate('/onboarding/4')} dark disabled={!selected} />
      </div>
    </div>
  );
}

/* ── O4: Basic details (light) ──────────────────────────── */
function O4Details() {
  const navigate = useNavigate();
  const { updateBranding, branding, updateInvoiceDefaults, invoiceDefaults } = useApp();
  const [name, setName]         = useState('');
  const [business, setBusiness] = useState('');
  const [currency, setCurrency] = useState('GBP');

  const ready = name.trim().length > 0 && business.trim().length > 0;

  const handleGo = () => {
    updateBranding({ ...branding, freelancerName: name.trim(), businessName: business.trim() });
    updateInvoiceDefaults({
      ...invoiceDefaults,
      defaultCurrency: currency,
      fullName:     name.trim(),
      businessName: business.trim(),
    });
    navigate('/onboarding/5');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 48,
    background: '#FFFFFF', border: '1.5px solid #E2E5EC',
    borderRadius: '12px', padding: '0 16px',
    fontSize: '15px', color: '#0A0A0A',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 150ms',
  };

  return (
    <div style={lightScreen}>
      <div style={{ flex: 1, padding: '0 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <ProgressDots total={5} active={4} dark />
        <div style={{ height: 36 }} />
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#0A0A0A', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          A few quick details
        </h1>
        <p style={{ fontSize: T.input.fontSize, fontWeight: 400, color: '#7A8099', margin: '0 0 28px' }}>
          These appear on every invoice and quote you send.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelSt}>Your name <span style={{ color: C.danger }}>*</span></label>
            <input
              value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. John Doe"
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
              onBlur={e => (e.currentTarget.style.borderColor = '#E2E5EC')}
            />
          </div>
          <div>
            <label style={labelSt}>Business name <span style={{ color: C.danger }}>*</span></label>
            <input
              value={business} onChange={e => setBusiness(e.target.value)}
              placeholder="e.g. JD Studio"
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
              onBlur={e => (e.currentTarget.style.borderColor = '#E2E5EC')}
            />
          </div>
          <div>
            <label style={labelSt}>Default currency</label>
            <select
              value={currency} onChange={e => setCurrency(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' as any }}
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div style={{ padding: '0 24px 40px' }}>
        <CtaButton label="Let's go →" onClick={handleGo} dark disabled={!ready} />
      </div>
    </div>
  );
}

/* ── O5: Ready (dark) ───────────────────────────────────── */
function O5Ready() {
  const navigate = useNavigate();
  const { setHasLaunched } = useApp();

  const handleGo = () => {
    setHasLaunched(true);
    navigate('/projects');
  };

  return (
    <div style={darkScreen}>
      <LogoRow showTagline />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
        <ProgressDots total={5} active={5} />
        <div style={{ height: 40 }} />
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF', textAlign: 'center', letterSpacing: '-0.02em', margin: '0 0 12px' }}>
          You're all set.
        </h1>
        <p style={{ fontSize: '15px', fontWeight: 400, color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
          Add your first project to get started.
        </p>
      </div>
      <div style={{ padding: '0 24px 40px' }}>
        <CtaButton label="Go to projects →" onClick={handleGo} />
      </div>
    </div>
  );
}

/* ── Router ─────────────────────────────────────────────── */
export default function Onboarding() {
  const { step } = useParams<{ step: string }>();
  switch (step) {
    case '1': return <O1Welcome />;
    case '2': return <O2SignIn />;
    case '3': return <O3Persona />;
    case '4': return <O4Details />;
    case '5': return <O5Ready />;
    default:  return <O1Welcome />;
  }
}

/* ── Screen shells ──────────────────────────────────────── */
const darkScreen: React.CSSProperties = {
  minHeight: '100dvh',
  background: '#0A0A0A',
  display: 'flex', flexDirection: 'column',
  paddingTop: 'calc(env(safe-area-inset-top, 0px) + 20px)',
  boxSizing: 'border-box',
};

const lightScreen: React.CSSProperties = {
  minHeight: '100dvh',
  background: '#FFFFFF',
  display: 'flex', flexDirection: 'column',
  paddingTop: 'calc(env(safe-area-inset-top, 0px) + 20px)',
  boxSizing: 'border-box',
};

const labelSt: React.CSSProperties = {
  display: 'block',
  fontSize: T.pill.fontSize, fontWeight: 600, color: '#7A8099',
  marginBottom: 6, letterSpacing: '0.04em',
};