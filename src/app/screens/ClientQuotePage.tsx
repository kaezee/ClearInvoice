import React from 'react';
import { useParams } from 'react-router';
import { useApp } from '../store';
import { formatAmount, formatDate } from '../tokens';

/* ─────────────────────────────────────────────────────────
   Client-facing Quote Page  ·  Classic template
   Public route: /q/:id
───────────────────────────────────────────────────────── */

export default function ClientQuotePage() {
  const { id } = useParams<{ id: string }>();
  const { projects, branding } = useApp();
  const project = projects.find(p => p.id === id);

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
            <p style={{ fontSize: 13, color: '#7A8099', margin: 0 }}>The quote may have been deleted or the link is invalid.</p>
          </div>
        </div>
      </div>
    );
  }

  const total = project.invoiceItems.reduce((s, i) => s + i.amount, 0);
  const version = project.quoteVersion ?? 1;
  const quoteRef = `QUO-${String(version).padStart(3, '0')}`;
  const today = new Date().toISOString().split('T')[0];
  const isExpired = !!(project.expiryDate && project.expiryDate < today);

  /* ── Status bar content ────────────────────────────────── */
  const statusText = project.expiryDate
    ? `Quote · expires ${formatDate(project.expiryDate, 'short')}`
    : 'Quote';

  return (
    <div style={PAGE_WRAP}>
      <div style={CARD_WRAP}>

        {/* ── Status bar ───────────────────────────────────── */}
        <div style={{
          height: 36,
          background: isExpired ? '#FFF3E0' : '#FFFBE6',
          borderBottom: `1px solid ${isExpired ? '#FFB74D' : '#FFE24B'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: isExpired ? '#FFB74D' : '#FFE24B',
            border: '1px solid #0A0A0A',
          }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#0A0A0A' }}>
            {isExpired
              ? `Quote · expired ${formatDate(project.expiryDate!, 'short')}`
              : statusText}
          </span>
        </div>

        {/* ── Expired banner ───────────────────────────────── */}
        {isExpired && (
          <div style={{
            background: '#FFF3E0', borderBottom: '1px solid #FFB74D',
            padding: '10px 16px', fontSize: 11, color: '#7A5000', lineHeight: 1.5,
          }}>
            This quote has expired. Please contact {businessName} to request an updated quote.
          </div>
        )}

        {/* ── Classic header (black) ────────────────────────── */}
        <div style={{
          background: '#0A0A0A', padding: 20,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          {/* Left: logo + business name */}
          <div>
            {branding.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={businessName}
                style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: 40, height: 40, borderRadius: 8,
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>{initials}</span>
              </div>
            )}
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>{businessName}</div>
          </div>

          {/* Right: label + ref + total */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>Quote</div>
            <div style={{ fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)' }}>
              #{quoteRef}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#FFFFFF', marginTop: 8, letterSpacing: '-0.02em' }}>
              {formatAmount(total, project.currency)}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Total</div>
          </div>
        </div>

        {/* ── Document body ─────────────────────────────────── */}
        <div style={{ padding: 20 }}>

          {/* Prepared for */}
          <div style={{ marginBottom: 16 }}>
            <div style={SECTION_LABEL}>Prepared for</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#0A0A0A', marginTop: 4 }}>
              {project.clientName}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#E2E5EC', marginBottom: 0 }} />

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
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A' }}>Total</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em' }}>
              {formatAmount(total, project.currency)}
            </span>
          </div>

          {/* Expiry block */}
          {project.expiryDate && (
            <div style={{
              background: '#F5F6F8', borderRadius: 8,
              padding: '10px 14px', marginTop: 16,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 11, color: '#7A8099' }}>
                {isExpired ? 'Expired' : 'Expires'}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: isExpired ? '#7A5000' : '#0A0A0A' }}>
                {formatDate(project.expiryDate, 'long')}
              </span>
            </div>
          )}

          {/* To proceed block */}
          <div style={{ marginTop: 16 }}>
            <div style={SECTION_LABEL}>To proceed</div>
            <div style={{ fontSize: 13, color: '#0A0A0A', lineHeight: 1.6, marginTop: 6 }}>
              {project.quoteNotes ?? project.invoiceNotes ?? 'Reply to confirm and work begins immediately.'}
            </div>
          </div>

          {/* Custom fields (VAT number etc.) from invoice notes — shows project notes if any */}
          {project.notes && (
            <div style={{ marginTop: 16 }}>
              <div style={SECTION_LABEL}>Notes</div>
              <div style={{ fontSize: 13, color: '#0A0A0A', lineHeight: 1.6, marginTop: 6 }}>
                {project.notes}
              </div>
            </div>
          )}

        </div>

        {/* ── Footer ────────────────────────────────────────── */}
        <div style={{
          borderTop: '1px solid #E2E5EC', padding: 16,
          textAlign: 'center', marginTop: 8,
        }}>
          <span style={{ fontSize: 11, color: '#C4C4C4' }}>Sent with Clear</span>
        </div>

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
  // Desktop: card with border
  boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 8px 40px rgba(0,0,0,0.08)',
};

const SECTION_LABEL: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#7A8099',
};
