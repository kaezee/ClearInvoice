import React, { useState } from 'react';

/* ─── Variant definitions ────────────────────────────────────
   Spec: everything darkens on hover, nothing inverts
   (except destructive fills red, and magenta switches text to white)
   ────────────────────────────────────────────────────────── */

type BtnVariant =
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'accent-cyan'
  | 'accent-yellow'
  | 'accent-green'
  | 'accent-magenta';

type BtnSize = 'md' | 'sm';

interface VariantState {
  background: string;
  color: string;
  border: string;
  transform?: string;
}

const VARIANTS: Record<BtnVariant, {
  default: VariantState;
  hover: VariantState;
  active: VariantState;
  disabled: Partial<VariantState> & { opacity: number; cursor: string };
}> = {
  primary: {
    default:  { background: '#0A0A0A', color: '#FFFFFF', border: '1.5px solid #0A0A0A' },
    hover:    { background: '#2A2A2A', color: '#FFFFFF', border: '1.5px solid #2A2A2A' },
    active:   { background: '#3A3A3A', color: '#FFFFFF', border: '1.5px solid #3A3A3A', transform: 'scale(0.98)' },
    disabled: { background: '#0A0A0A', color: '#FFFFFF', border: '1.5px solid #0A0A0A', opacity: 0.3, cursor: 'not-allowed' },
  },
  secondary: {
    default:  { background: '#F0F0F0', color: '#0A0A0A', border: '1.5px solid #0A0A0A' },
    hover:    { background: '#D4D4D4', color: '#0A0A0A', border: '1.5px solid #0A0A0A' },
    active:   { background: '#BEBEBE', color: '#0A0A0A', border: '1.5px solid #0A0A0A', transform: 'scale(0.98)' },
    disabled: { background: '#F0F0F0', color: '#0A0A0A', border: '1.5px solid #0A0A0A', opacity: 0.3, cursor: 'not-allowed' },
  },
  destructive: {
    default:  { background: '#F0F0F0', color: '#DC2626', border: '1.5px solid #0A0A0A' },
    hover:    { background: '#DC2626', color: '#FFFFFF', border: '1.5px solid #DC2626' },
    active:   { background: '#B91C1C', color: '#FFFFFF', border: '1.5px solid #B91C1C', transform: 'scale(0.98)' },
    disabled: { opacity: 0.3, cursor: 'not-allowed' },
  },
  'accent-cyan': {
    default:  { background: '#65F7FF', color: '#0A0A0A', border: '1.5px solid #0A0A0A' },
    hover:    { background: '#00C2CC', color: '#0A0A0A', border: '1.5px solid #0A0A0A' },
    active:   { background: '#009BA3', color: '#0A0A0A', border: '1.5px solid #0A0A0A', transform: 'scale(0.98)' },
    disabled: { background: '#65F7FF', color: '#0A0A0A', border: '1.5px solid #0A0A0A', opacity: 0.3, cursor: 'not-allowed' },
  },
  'accent-yellow': {
    default:  { background: '#FFE24B', color: '#0A0A0A', border: '1.5px solid #0A0A0A' },
    hover:    { background: '#F5CB00', color: '#0A0A0A', border: '1.5px solid #0A0A0A' },
    active:   { background: '#D4AE00', color: '#0A0A0A', border: '1.5px solid #0A0A0A', transform: 'scale(0.98)' },
    disabled: { background: '#FFE24B', color: '#0A0A0A', border: '1.5px solid #0A0A0A', opacity: 0.3, cursor: 'not-allowed' },
  },
  'accent-green': {
    default:  { background: '#4DFF91', color: '#0A0A0A', border: '1.5px solid #0A0A0A' },
    hover:    { background: '#00D15A', color: '#0A0A0A', border: '1.5px solid #0A0A0A' },
    active:   { background: '#00A847', color: '#0A0A0A', border: '1.5px solid #0A0A0A', transform: 'scale(0.98)' },
    disabled: { background: '#4DFF91', color: '#0A0A0A', border: '1.5px solid #0A0A0A', opacity: 0.3, cursor: 'not-allowed' },
  },
  'accent-magenta': {
    default:  { background: '#FF659C', color: '#0A0A0A', border: '1.5px solid #0A0A0A' },
    hover:    { background: '#E8005A', color: '#FFFFFF', border: '1.5px solid #E8005A' },
    active:   { background: '#C40049', color: '#FFFFFF', border: '1.5px solid #C40049', transform: 'scale(0.98)' },
    disabled: { background: '#FF659C', color: '#0A0A0A', border: '1.5px solid #0A0A0A', opacity: 0.3, cursor: 'not-allowed' },
  },
};

const SIZE: Record<BtnSize, React.CSSProperties> = {
  md: { height: 48, padding: '0 20px', fontSize: '15px', fontWeight: 700, borderRadius: '16px' },
  sm: { height: 36, padding: '0 16px', fontSize: '12px', fontWeight: 700, borderRadius: '12px' },
};

/* ─── Component ─────────────────────────────────────────── */

export interface BtnProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  variant?: BtnVariant;
  size?: BtnSize;
  fullWidth?: boolean;
  /** Pass a saved/confirmed state to flip to accent-green */
  saved?: boolean;
  savedLabel?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function Btn({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  saved = false,
  savedLabel,
  disabled = false,
  children,
  style,
  onClick,
  ...rest
}: BtnProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  // If saved, override variant temporarily
  const effectiveVariant: BtnVariant = saved ? 'accent-green' : variant;
  const v = VARIANTS[effectiveVariant];
  const s = SIZE[size];

  const stateStyle = disabled
    ? v.disabled
    : pressed
    ? v.active
    : hovered
    ? v.hover
    : v.default;

  return (
    <button
      {...rest}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => { if (!disabled) setHovered(true); }}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => { if (!disabled) setPressed(true); }}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => { if (!disabled) setPressed(true); }}
      onTouchEnd={() => { setPressed(false); }}
      style={{
        ...s,
        ...stateStyle,
        width: fullWidth ? '100%' : undefined,
        fontFamily: 'inherit',
        letterSpacing: '-0.01em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 150ms ease-in-out, color 150ms ease-in-out, border-color 150ms ease-in-out, transform 150ms ease-in-out',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        flexShrink: 0,
        lineHeight: 1,
        ...style,
      }}
    >
      {saved && savedLabel ? savedLabel : children}
    </button>
  );
}
