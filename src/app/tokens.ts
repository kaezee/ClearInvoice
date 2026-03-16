/* ── Base palette ──────────────────────────────────────── */
export const C = {
  black:        '#0A0A0A',
  white:        '#FFFFFF',
  surface:      '#F5F6F8',   // cool off-white, slight blue undertone
  card:         '#FFFFFF',
  border:       '#E2E5EC',   // card borders, dividers, inputs
  borderStrong: '#B0B8C8',
  muted:        '#7A8099',   // secondary text (cool blue-grey, AA on white)
  hint:         '#7A8099',
  danger:       '#DC2626',
  dangerLight:  '#FEF2F2',
  dangerText:   '#991B1B',

  /* CMY status palette — all with 1.5px #0A0A0A stroke on pills */
  quoting:      '#FFE24B',   // Quoting / "Ready" stage
  inProgress:   '#FF659C',   // In progress
  invoiced:     '#65F7FF',   // Invoiced
  cleared:      '#4DFF91',   // Cleared
  archived:     '#E8E8E8',   // Archived (neutral)

  /* Semantic shorthands still used in a few places */
  green:        '#16A34A',
  greenLight:   '#DCFCE7',
  greenText:    '#166534',
  yellow:       '#FFE24B',   // same as quoting — overdue accent
  yellowText:   '#B45309',
  yellowLight:  '#FFFBEB',

  /* Kept for any remaining violet usages (branding swatch, etc.) */
  violet:       '#7C3AED',
  violetLight:  '#EDE9FE',
  violetText:   '#5B21B6',
} as const;

/* ── Status colour lookup (CMY fills) ─────────────────── */
export const STATUS_FILL: Record<string, string> = {
  'ready':       C.quoting,
  'in-progress': C.inProgress,
  'invoiced':    C.invoiced,
  'cleared':     C.cleared,
  'archived':    C.archived,
};

/* ── Typography ───────────────────────────────────────── */
export const T = {
  xs:    { fontSize: '11px', lineHeight: 1.5,  letterSpacing: '0.02em' },
  sm:    { fontSize: '13px', lineHeight: 1.6,  letterSpacing: '0.01em' },
  base:  { fontSize: '15px', lineHeight: 1.6,  letterSpacing: '0' },
  lg:    { fontSize: '18px', lineHeight: 1.4,  letterSpacing: '-0.01em' },
  xl:    { fontSize: '24px', lineHeight: 1.2,  letterSpacing: '-0.02em' },
  xl2:   { fontSize: '32px', lineHeight: 1.1,  letterSpacing: '-0.03em' },
  label: { fontSize: '10px', fontWeight: 600 as const, letterSpacing: '0.08em', textTransform: 'uppercase' as const, lineHeight: 1.5 },
} as const;

/* ── Border radius ────────────────────────────────────── */
export const R = {
  sm:   '4px',    // small chips, inline tags
  md:   '8px',    // inputs, section cards, small buttons
  lg:   '12px',   // bottom sheets, modals
  xl:   '16px',   // status pills, main buttons, project cards
  pill: '20px',
} as const;

/* ── Helpers ──────────────────────────────────────────── */
export const formatAmount = (amount: number, currency: string): string => {
  const symbols: Record<string, string> = { GBP: '£', USD: '$', EUR: '€', INR: '₹' };
  const symbol = symbols[currency] || currency;
  return `${symbol}${amount.toLocaleString()}`;
};

export const formatDate = (date?: string, style: 'short' | 'long' = 'long'): string => {
  if (!date) return 'Not set';
  const d = new Date(date);
  if (style === 'short') return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};
