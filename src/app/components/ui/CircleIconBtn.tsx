import React, { useState } from 'react';
import { C } from '../../tokens';

/* ─────────────────────────────────────────────────────────────────
   DARK CONTEXT
   Use on black top bars (NewProject, ProjectDetail, Archived,
   Branding, Help, InvoiceDefaults and any dark nav surface).

   Spec:
   · 44×44 px circle tap target + circle bg
   · Icon via CSS currentColor → caller supplies icon without color prop
   · Resting   : transparent
   · Hover     : rgba(255,255,255,0.12)
   · Press     : rgba(255,255,255,0.18)
   · Transition: 150ms ease-in-out

   dimmed prop — for secondary icons on dark bars (e.g. trash):
   · Resting   : icon at opacity 0.45
   · Hover     : icon at opacity 0.75
   · Press     : icon at opacity 0.90
──────────────────────────────────────────────────────────────── */
interface DarkNavBtnProps {
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
  /** Dim the icon — for secondary actions (e.g. trash icon) on dark bars */
  dimmed?: boolean;
  style?: React.CSSProperties;
}

export function DarkNavBtn({
  onClick, children, ariaLabel = 'Button', dimmed, style,
}: DarkNavBtnProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const bg = pressed
    ? 'rgba(255,255,255,0.18)'
    : hovered
    ? 'rgba(255,255,255,0.12)'
    : 'transparent';

  const iconOpacity = dimmed
    ? pressed ? 0.90 : hovered ? 0.75 : 0.45
    : 1;

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => { setHovered(false); setPressed(false); }}
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: bg,
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        padding: 0,
        color: `rgba(255,255,255,${iconOpacity})`,
        transition: 'background 150ms ease-in-out, color 150ms ease-in-out',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────
   LIGHT CONTEXT
   Use on white/light surfaces — modals, bottom sheets, panels,
   sub-view headers inside AvatarSheet.

   Spec:
   · 44×44 px minimum tap target (outer button — transparent, no bg)
   · 36×36 px visible circle (inner div — bg appears on hover/press)
   · Icon via CSS currentColor → caller supplies icon without color prop
   · Resting   : transparent
   · Hover     : #F5F6F8
   · Press     : rgba(0,0,0,0.08)
   · Transition: 150ms ease-in-out
──────────────────────────────────────────────────────────────── */
interface LightModalBtnProps {
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
  /** Applied to the outer 44×44 tap-target button */
  style?: React.CSSProperties;
}

export function LightModalBtn({
  onClick, children, ariaLabel = 'Button', style,
}: LightModalBtnProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const circleBg = pressed
    ? 'rgba(0,0,0,0.08)'
    : hovered
    ? '#F5F6F8'
    : 'transparent';

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => { setHovered(false); setPressed(false); }}
      style={{
        width: 44,
        height: 44,
        background: 'none',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        padding: 0,
        color: '#0A0A0A',
        ...style,
      }}
    >
      {/* 36×36 visible circle — bg only appears on hover/press */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: circleBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 150ms ease-in-out',
        }}
      >
        {children}
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────
   InlineXBtn — list-item removal button (NOT a close/back button).
   Used for removing tags, service items, custom fields, etc.
   Red-tint on hover to signal destructive intent.
──────────────────────────────────────────────────────────────── */
interface InlineXBtnProps {
  onClick: () => void;
  danger?: boolean;   // true = already in danger/confirm state
  size?: number;
  style?: React.CSSProperties;
}

export function InlineXBtn({ onClick, danger = false, size = 14, style }: InlineXBtnProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const color = danger
    ? C.danger
    : pressed
    ? C.danger
    : hovered
    ? '#C44B4B'
    : C.borderStrong;

  return (
    <button
      onClick={onClick}
      aria-label="Remove"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => { setHovered(false); setPressed(false); }}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color,
        padding: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        borderRadius: 4,
        transition: 'color 120ms ease-in-out',
        ...style,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
}