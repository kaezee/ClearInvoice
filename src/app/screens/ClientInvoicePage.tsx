import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useApp } from '../store';
import { formatAmount, formatDate } from '../tokens';

type Template = 'classic' | 'branded' | 'minimal';

/* ─────────────────────────────────────────────────────────
   Client-facing Invoice Page  ·  Classic / Branded / Minimal
   Public route: /i/:id
   Template determined by branding.invoiceStyle
   (A floating switcher lets designers preview all templates)
───────────────────────────────────────────────────────── */

export default function ClientInvoicePage() {
  const { id } = useParams<{ id: string }>();
  const { projects, branding, invoiceDefaults } = useApp();
  const project = projects.find(p => p.id === id);

  const [template, setTemplate] = useState<Template>(branding.invoiceStyle as Template || 'classic');

  const businessName = branding.businessName || 'Your Studio';
  const initials = businessName
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  /* ── Not found ─────────────────────────────────────────── */
  if (!project) {
    return (
      <div style={PAGE_WRAP}>
        <div style={CARD_WRAP}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: 12, padding: 40, textAlign: 'center' }}>
            <span style={{ fontSize: 40 }}>🔗</span>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#0A0A0A', margin: 0 }}>This link is no longer available</p>
            <p style={{ fontSize: 13, color: '#7A8099', margin: 0 }}>The invoice may have been deleted or the link is invalid.</p>
          </div>
        </div>
      </div>
    );
  }

  const total = project.invoiceItems.reduce((s, i) => s + i.amount, 0);
  const invoiceRef = project.invoiceNumber;
  const today = new Date().toISOString().split('T')[0];
  const isOverdue = !!(project.dueDate && project.dueDate < today && project.status === 'invoiced');
  const isPaid = project.status === 'cleared';

  /* ── Header bg/text colour logic (Branded template) ────── */
  const brandColor = branding.brandColor || '#7C3AED';
  // Derive text colour from brand colour luminance
  const hex = brandColor.replace('#', '');
  const r = parseInt(hex.slice(0,2), 16) / 255;
  const g = parseInt(hex.slice(2,4), 16) / 255;
  const b = parseInt(hex.slice(4,6), 16) / 255;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  const onBrand = luminance > 0.5 ? '#0A0A0A' : '#FFFFFF';
  const onBrandMuted = luminance > 0.5 ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.55)';
  const logoBg = luminance > 0.5 ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)';

  /* ── Status bar ─────────────────────────────────────────── */
  const statusBarStyle: React.CSSProperties = isOverdue
    ? { background: '#FFFBE6', borderBottom: '1px solid #FFE24B' }
    : { background: '#E6FBFC', borderBottom: '1px solid #65F7FF' };

  const statusDotColor = isOverdue ? '#FFE24B' : '#65F7FF';
  const statusText = isOverdue
    ? `Invoice · ${Math.floor((Date.now() - new Date(project.dueDate!).getTime()) / 86_400_000)}d overdue`
    : project.dueDate
      ? `Invoice · due ${formatDate(project.dueDate, 'short')}`
      : 'Invoice';

  /* ── Header renderer per template ──────────────────────── */
  function renderHeader() {
    if (template === 'minimal') {
      return (
        <div style={{
          background: '#FFFFFF', padding: '20px 20px 16px',
          borderBottom: '3px solid #0A0A0A',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt={businessName} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
            ) : (
              <div style={{
                width: 40, height: 40, borderRadius: 8,
                background: '#F0F0F0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A' }}>{initials}</span>
              </div>
            )}
            <div style={{ fontSize: 13, color: '#7A8099', marginTop: 6 }}>{businessName}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A' }}>Invoice</div>
            <div style={{ fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.05em', color: '#7A8099' }}>#{invoiceRef}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#0A0A0A', marginTop: 8, letterSpacing: '-0.02em' }}>{formatAmount(total, project.currency)}</div>
            <div style={{ fontSize: 10, color: '#7A8099', marginTop: 2 }}>Total due</div>
          </div>
        </div>
      );
    }

    const headerBg = template === 'branded' ? brandColor : '#0A0A0A';
    const textColor = template === 'branded' ? onBrand : '#FFFFFF';
    const mutedColor = template === 'branded' ? onBrandMuted : 'rgba(255,255,255,0.55)';
    const logoBoxBg = template === 'branded' ? logoBg : 'rgba(255,255,255,0.15)';

    return (
      <div style={{
        background: headerBg, padding: 20,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <div>
          {branding.logoUrl ? (
            <img src={branding.logoUrl} alt={businessName} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: 40, height: 40, borderRadius: 8, background: logoBoxBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: textColor }}>{initials}</span>
            </div>
          )}
          <div style={{ fontSize: 13, color: mutedColor, marginTop: 6 }}>{businessName}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: mutedColor }}>Invoice</div>
          <div style={{ fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.05em', color: mutedColor, opacity: 0.75 }}>#{invoiceRef}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: textColor, marginTop: 8, letterSpacing: '-0.02em' }}>{formatAmount(total, project.currency)}</div>
          <div style={{ fontSize: 10, color: mutedColor, marginTop: 2 }}>Total due</div>
        </div>
      </div>
    );
  }

  return (
    <div style={PAGE_WRAP}>
      <div style={CARD_WRAP}>

        {/* ── Status bar ─────────────────────────────────── */}
        <div style={{ height: 36, ...statusBarStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusDotColor, border: '1px solid #0A0A0A' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#0A0A0A' }}>{statusText}</span>
        </div>

        {/* ── Paid banner ────────────────────────────────── */}
        {isPaid && (
          <div style={{ background: '#E6FBFC', borderBottom: '1px solid #65F7FF', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#004D52', textAlign: 'center' }}>
            ✓ This invoice has been paid
          </div>
        )}

        {/* ── Overdue banner ─────────────────────────────── */}
        {isOverdue && !isPaid && (
          <div style={{ background: '#FFFBE6', borderBottom: '1px solid #FFE24B', padding: '10px 16px', fontSize: 11, color: '#7A5000', lineHeight: 1.5 }}>
            Payment is overdue. Please contact {businessName} if you have any questions.
          </div>
        )}

        {/* ── Header (template-driven) ────────────────────── */}
        {renderHeader()}

        {/* ── Document body ───────────────────────────────── */}
        <div style={{ padding: 20, flex: 1 }}>

          {/* Bill to */}
          <div style={{ marginBottom: 16 }}>
            <div style={SECTION_LABEL}>Bill to</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#0A0A0A', marginTop: 4 }}>
              {project.clientName}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#E2E5EC' }} />

          {/* Line items */}
          {project.invoiceItems.map((item, idx) => (
            <div
              key={item.id}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                padding: '8px 0', gap: 16,
                borderBottom: idx < project.invoiceItems.length - 1 ? '1px solid #E2E5EC' : 'none',
              }}
            >
              <span style={{ fontSize: 13, color: '#0A0A0A', lineHeight: 1.5, flex: 1 }}>{item.description}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A', flexShrink: 0 }}>
                {formatAmount(item.amount, project.currency)}
              </span>
            </div>
          ))}

          {/* Total row */}
          <div style={{
            borderTop: '2px solid #0A0A0A', marginTop: 4, paddingTop: 12,
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A' }}>Total due</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em' }}>
              {formatAmount(total, project.currency)}
            </span>
          </div>

          {/* Due date block */}
          {project.dueDate && (
            <div style={{
              background: '#F5F6F8', borderRadius: 8, padding: '10px 14px', marginTop: 16,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 11, color: '#7A8099' }}>
                {isOverdue ? 'Was due' : 'Due date'}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: isOverdue ? '#7A5000' : '#0A0A0A' }}>
                {formatDate(project.dueDate, 'long')}
              </span>
            </div>
          )}

          {/* Payment details */}
          {invoiceDefaults.paymentNotes && (
            <div style={{ marginTop: 16 }}>
              <div style={SECTION_LABEL}>Payment details</div>
              <div style={{ fontSize: 13, color: '#0A0A0A', lineHeight: 1.6, marginTop: 6 }}>
                {invoiceDefaults.paymentNotes}
              </div>
            </div>
          )}

          {/* Custom fields (VAT, Company Reg, etc.) */}
          {invoiceDefaults.customFields.length > 0 && (
            <div style={{ marginTop: 16 }}>
              {invoiceDefaults.customFields.map((field, idx) => (
                <div
                  key={field.id}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '6px 0',
                    borderBottom: idx < invoiceDefaults.customFields.length - 1 ? '1px solid #E2E5EC' : 'none',
                  }}
                >
                  <span style={{ fontSize: 13, color: '#7A8099' }}>{field.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#0A0A0A' }}>{field.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Invoice notes */}
          {project.invoiceNotes && (
            <div style={{ marginTop: 16 }}>
              <div style={SECTION_LABEL}>Notes</div>
              <div style={{ fontSize: 13, color: '#0A0A0A', lineHeight: 1.6, marginTop: 6 }}>
                {project.invoiceNotes}
              </div>
            </div>
          )}

        </div>

        {/* ── Footer ──────────────────────────────────────── */}
        <div style={{ borderTop: '1px solid #E2E5EC', padding: 16, textAlign: 'center' }}>
          <span style={{ fontSize: 11, color: '#C4C4C4' }}>Sent with Clear</span>
        </div>

      </div>

      {/* ── Template switcher (designer preview) ───────────── */}
      <div style={{
        position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)',
        background: '#0A0A0A', borderRadius: 24, padding: '6px 8px',
        display: 'flex', gap: 4,
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        zIndex: 100,
      }}>
        {(['classic', 'branded', 'minimal'] as Template[]).map(t => (
          <button
            key={t}
            onClick={() => setTemplate(t)}
            style={{
              background: template === t ? '#FFFFFF' : 'transparent',
              color: template === t ? '#0A0A0A' : 'rgba(255,255,255,0.5)',
              border: 'none', borderRadius: 20,
              padding: '5px 12px', cursor: 'pointer',
              fontSize: 11, fontWeight: 600,
              textTransform: 'capitalize',
              letterSpacing: '0.01em',
              transition: 'all 150ms',
            }}
          >
            {t}
          </button>
        ))}
      </div>

    </div>
  );
}

/* ── Layout constants ────────────────────────────────────── */
const PAGE_WRAP: React.CSSProperties = {
  background: '#F5F6F8',
  minHeight: '100vh',
  fontFamily: 'DM Sans, sans-serif',
  display: 'flex',
  justifyContent: 'center',
  padding: '0 0 40px',
};

const CARD_WRAP: React.CSSProperties = {
  width: '100%',
  maxWidth: 480,
  minHeight: '100vh',
  background: '#FFFFFF',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 8px 40px rgba(0,0,0,0.08)',
};

const SECTION_LABEL: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#7A8099',
};
