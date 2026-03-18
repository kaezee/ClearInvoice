import type React from 'react';

/* ─────────────────────────────────────────────────────────
   Shared layout constants for client-facing pages.
   Used by ClientQuotePage and ClientInvoicePage.
───────────────────────────────────────────────────────── */

export const PAGE_WRAP: React.CSSProperties = {
  background: '#F5F6F8',
  minHeight: '100vh',
  fontFamily: 'DM Sans, sans-serif',
  display: 'flex',
  justifyContent: 'center',
  padding: '0 0 40px',
};

export const CARD_WRAP: React.CSSProperties = {
  width: '100%',
  maxWidth: 480,
  minHeight: '100vh',
  background: '#FFFFFF',
  display: 'flex',
  flexDirection: 'column',
  // Desktop: card with border
  boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 8px 40px rgba(0,0,0,0.08)',
};

export const SECTION_LABEL: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#7A8099',
};
