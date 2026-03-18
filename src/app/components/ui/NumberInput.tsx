import React, { useState, useRef } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { C, R, T } from '../../tokens';

interface NumberInputProps {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  /** Extra styles applied to the outer wrapper */
  style?: React.CSSProperties;
  /** Styles forwarded to the inner <input> element */
  inputStyle?: React.CSSProperties;
  /** Left prefix node (e.g. currency symbol) */
  prefix?: React.ReactNode;
  autoFocus?: boolean;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/* ── Stepper button — up or down ────────────────────────── */
function StepBtn({
  direction, onClick, borderBottom,
}: {
  direction: 'up' | 'down';
  onClick: () => void;
  borderBottom?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Default = white (same as input bg), hover = light grey, press = darker */
  const bg = pressed ? C.borderStrong : hovered ? C.surface : C.white;

  const startRepeat = () => {
    onClick();
    intervalRef.current = setInterval(onClick, 120);
  };
  const stopRepeat = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  return (
    <button
      tabIndex={-1}
      aria-label={direction === 'up' ? 'Increase' : 'Decrease'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); stopRepeat(); }}
      onMouseDown={(e) => { e.preventDefault(); setPressed(true); startRepeat(); }}
      onMouseUp={() => { setPressed(false); stopRepeat(); }}
      onTouchStart={(e) => { e.preventDefault(); setPressed(true); startRepeat(); }}
      onTouchEnd={() => { setPressed(false); stopRepeat(); }}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bg,
        border: 'none',
        borderBottom: borderBottom ? `1px solid ${C.border}` : 'none',
        cursor: 'pointer',
        padding: 0,
        transition: 'background 100ms ease-in-out',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {direction === 'up'
        ? <ChevronUp  size={12} color={C.muted} strokeWidth={2.5} />
        : <ChevronDown size={12} color={C.muted} strokeWidth={2.5} />
      }
    </button>
  );
}

/* ── Main component ─────────────────────────────────────── */
export function NumberInput({
  value, onChange, placeholder, min, max, step = 1,
  style, inputStyle, prefix, autoFocus, onFocus, onBlur,
}: NumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const numVal = () => parseFloat(String(value)) || 0;

  const step_ = (dir: 1 | -1) => {
    const next = numVal() + dir * step;
    const clamped = min !== undefined ? Math.max(min, next) : next;
    const final   = max !== undefined ? Math.min(max, clamped) : clamped;
    onChange(String(final));
  };

  /* Border colour mirrors the .ci class behaviour */
  const borderColor = focused ? C.black : C.border;
  const borderWidth = focused ? '1.5px' : '1px';

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'stretch',
        background: C.white,
        border: `${borderWidth} solid ${borderColor}`,
        borderRadius: R.md,
        transition: 'border-color 150ms, border-width 150ms',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Optional left prefix (e.g. £ $ €) */}
      {prefix && (
        <span style={{
          display: 'flex', alignItems: 'center',
          paddingLeft: 12,
          fontSize: T.base.fontSize,
          color: C.muted,
          flexShrink: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          {prefix}
        </span>
      )}

      {/* Number input — native spinners suppressed globally in clear.css */}
      <input
        ref={inputRef}
        type="number"
        autoFocus={autoFocus}
        placeholder={placeholder}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={e => onChange(e.target.value)}
        onFocus={e => { setFocused(true); onFocus?.(e); }}
        onBlur={e  => { setFocused(false); onBlur?.(e); }}
        style={{
          flex: 1,
          minWidth: 0,
          height: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          padding: prefix ? '0 8px' : '0 12px',
          fontSize: '15px',
          fontFamily: 'inherit',
          color: C.black,
          ...inputStyle,
        }}
      />

      {/* Custom stepper — right panel; white at rest, surface on hover */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: 36,
        flexShrink: 0,
        borderLeft: `1px solid ${C.border}`,
        background: C.white,
      }}>
        <StepBtn direction="up"   onClick={() => step_(1)}  borderBottom />
        <StepBtn direction="down" onClick={() => step_(-1)} />
      </div>
    </div>
  );
}