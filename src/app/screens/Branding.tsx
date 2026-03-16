import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Upload } from 'lucide-react';
import { useApp } from '../store';
import { C, T, R } from '../tokens';
import { BrandingSettings, InvoiceStyle } from '../types';

// Spec: 6 swatches — #FF659C #FFE24B #65F7FF #4DFF91 #0A0A0A #7C3AED
const PRESET_COLORS = ['#FF659C', '#FFE24B', '#65F7FF', '#4DFF91', '#0A0A0A', '#7C3AED'];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: R.xl, padding: 16 }}>
      <p style={{ ...T.label, color: C.muted, margin: '0 0 14px' }}>{title}</p>
      {children}
    </div>
  );
}

function TemplateThumbnail({
  style, label, active, brandColor, onClick,
}: { style: InvoiceStyle; label: string; active: boolean; brandColor: string; onClick: () => void }) {
  const headerBg     = style === 'classic' ? C.black : style === 'branded' ? brandColor : C.white;
  const headerBorder = style === 'minimal' ? `1px solid ${C.border}` : 'none';

  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        border: `1.5px solid ${active ? C.black : C.border}`,
        borderRadius: R.md, overflow: 'hidden', cursor: 'pointer',
        background: 'transparent', padding: 0, transition: 'border-color 150ms',
      }}
      aria-pressed={active}
      aria-label={`${label} invoice style`}
    >
      {/* Preview */}
      <div style={{ height: 60, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          height: 18, background: headerBg, flexShrink: 0,
          border: headerBorder, borderBottom: `1px solid ${C.border}`,
        }} />
        <div style={{ flex: 1, background: C.white, padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[70, 50, 85].map((w, i) => (
            <div key={i} style={{ height: 3, background: C.border, borderRadius: 2, width: `${w}%` }} />
          ))}
        </div>
      </div>
      {/* Label */}
      <div style={{
        background: C.surface, borderTop: `1px solid ${C.border}`,
        padding: '5px 8px', textAlign: 'center',
        fontSize: '10px', fontWeight: 600,
        color: active ? C.black : C.muted,
        letterSpacing: '0.04em',
      }}>
        {label}
      </div>
    </button>
  );
}

export default function Branding() {
  const { branding, updateBranding } = useApp();
  const navigate = useNavigate();

  const [settings, setSettings] = useState<BrandingSettings>({ ...branding });
  const [hexInput, setHexInput] = useState(branding.brandColor);
  const [saved, setSaved]       = useState(false);

  const update = (partial: Partial<BrandingSettings>) => {
    const next = { ...settings, ...partial };
    setSettings(next);
    if (partial.brandColor) setHexInput(partial.brandColor);
  };

  const handleHexBlur = () => {
    const clean = hexInput.startsWith('#') ? hexInput : `#${hexInput}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(clean)) {
      update({ brandColor: clean });
    } else {
      setHexInput(settings.brandColor);
    }
  };

  const handleSave = () => {
    updateBranding(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: C.surface, overflowX: 'hidden' }}>

      {/* ── Top bar ─────────────────────────────────── */}
      <nav style={{
        background: C.black,
        padding: `calc(env(safe-area-inset-top, 0px) + 14px) 16px 12px`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10, flexShrink: 0, minHeight: 52,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.white, minWidth: 44, minHeight: 44,
            display: 'flex', alignItems: 'center', padding: 0,
          }}
          aria-label="Go back"
        >
          <ChevronLeft size={24} />
        </button>
        <span style={{ fontSize: '17px', fontWeight: 600, color: C.white, letterSpacing: '-0.01em' }}>Branding</span>
        <div style={{ width: 44 }} />
      </nav>

      <main style={{ flex: 1, padding: '12px 16px 48px', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* ── Logo ───────────────────────────────────── */}
          <SectionCard title="Your logo">
            {settings.logoUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src={settings.logoUrl} alt="Logo"
                  style={{ width: 48, height: 48, borderRadius: R.md, objectFit: 'contain', background: C.surface }}
                />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: C.black, margin: '0 0 4px' }}>Logo uploaded</p>
                  <button
                    onClick={() => update({ logoUrl: undefined })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: '13px', fontWeight: 500, padding: 0 }}
                  >
                    Replace
                  </button>
                </div>
              </div>
            ) : (
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 8, padding: '20px 16px',
                border: `1.5px dashed ${C.border}`, borderRadius: R.lg, cursor: 'pointer',
              }}>
                <input
                  type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) update({ logoUrl: URL.createObjectURL(file) });
                  }}
                />
                <div style={{
                  width: 48, height: 48, background: C.surface, borderRadius: R.md,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Upload size={20} color={C.muted} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: C.black, display: 'block' }}>Upload logo</span>
                  <span style={{ fontSize: '11px', color: C.hint }}>PNG or SVG · shown on all invoices and quotes</span>
                </div>
              </label>
            )}
          </SectionCard>

          {/* ── Brand colour ───────────────────────────── */}
          <SectionCard title="Brand colour">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => update({ brandColor: color })}
                  aria-label={`Select colour ${color}`}
                  style={{
                    width: 28, height: 28, borderRadius: R.md,
                    background: color,
                    border: `1.5px solid ${C.black}`,
                    cursor: 'pointer', flexShrink: 0,
                    outline: settings.brandColor === color ? `2px solid ${C.black}` : 'none',
                    outlineOffset: 2,
                    transition: 'outline 120ms',
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 24, height: 24, borderRadius: R.sm,
                background: settings.brandColor, border: `1px solid ${C.border}`, flexShrink: 0,
              }} />
              <input
                value={hexInput}
                onChange={e => setHexInput(e.target.value)}
                onBlur={handleHexBlur}
                maxLength={7}
                style={{
                  width: 90, height: 36,
                  border: `1px solid ${C.border}`, borderRadius: R.md,
                  padding: '0 10px', fontSize: '13px',
                  fontFamily: 'monospace', outline: 'none', color: C.black,
                }}
                aria-label="Hex colour value"
              />
              <span style={{ fontSize: '11px', color: C.hint }}>Hex value</span>
            </div>

            {/* Live preview */}
            <div style={{ marginTop: 14, background: C.surface, borderRadius: R.md, padding: 12 }}>
              <p style={{ ...T.xs, color: C.muted, margin: '0 0 8px' }}>Preview</p>
              <div style={{
                border: `1.5px solid ${C.black}`,
                borderRadius: R.sm, overflow: 'hidden', maxWidth: 160,
              }}>
                <div style={{ height: 16, background: C.black, padding: '0 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '7px', color: C.white, fontWeight: 600 }}>Invoice</span>
                  <span style={{ fontSize: '7px', color: settings.brandColor, fontFamily: 'monospace' }}>INV-001</span>
                </div>
                <div style={{ background: C.white, padding: 8 }}>
                  {[80, 60, 100].map((w, i) => (
                    <div key={i} style={{ height: 3, background: i === 2 ? settings.brandColor : C.border, borderRadius: 2, width: `${w}%`, marginBottom: 4 }} />
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ── Invoice style ───────────────────────────── */}
          <SectionCard title="Invoice style">
            <div style={{ display: 'flex', gap: 8 }}>
              {([
                { style: 'classic' as const, label: 'Classic' },
                { style: 'branded' as const, label: 'Branded' },
                { style: 'minimal' as const, label: 'Minimal' },
              ]).map(({ style, label }) => (
                <TemplateThumbnail
                  key={style}
                  style={style}
                  label={label}
                  active={settings.invoiceStyle === style}
                  brandColor={settings.brandColor}
                  onClick={() => update({ invoiceStyle: style })}
                />
              ))}
            </div>
          </SectionCard>

        </div>
      </main>

      {/* ── Save ─────────────────────────────────────── */}
      <div style={{
        padding: `12px 16px calc(24px + env(safe-area-inset-bottom, 0px))`,
        background: C.white, borderTop: `1px solid ${C.border}`, flexShrink: 0,
      }}>
        <button
          onClick={handleSave}
          style={{
            width: '100%', height: 48,
            background: saved ? C.cleared : C.black,
            color: saved ? C.black : C.white,
            border: `1.5px solid ${C.black}`,
            borderRadius: R.xl,
            cursor: 'pointer', fontSize: '14px', fontWeight: 700,
            letterSpacing: '-0.01em',
            transition: 'background 200ms, color 200ms',
          }}
        >
          {saved ? 'Saved ✓' : 'Save branding'}
        </button>
      </div>
    </div>
  );
}