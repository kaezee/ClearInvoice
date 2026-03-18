import { ChevronLeft, RotateCcw } from 'lucide-react';
import { Modal } from './Modal';
import { ProjectStatus } from '../types';
import { C, T, R } from '../tokens';
import { StatusPill, STATUS_CONFIG } from './StatusPill';
import { LightModalBtn } from './ui/CircleIconBtn';
import { Btn } from './ui/Btn';
import { useState as useLocalState, useEffect } from 'react';

const STATUS_OPTIONS: ProjectStatus[] = ['ready', 'in-progress', 'invoiced', 'cleared'];
const STATUS_ORDER: ProjectStatus[]   = ['ready', 'in-progress', 'invoiced', 'cleared'];

/* ── Confirmation config per transition ──────────────────── */
type BtnVariant = 'primary' | 'secondary' | 'accent-green';

interface ConfirmConfig {
  title: string;
  body: string;
  confirmLabel: string;
  confirmVariant: BtnVariant;
  cancelLabel: string;
}

function getConfirmConfig(from: ProjectStatus, to: ProjectStatus): ConfirmConfig {
  const fromIdx = STATUS_ORDER.indexOf(from);
  const toIdx   = STATUS_ORDER.indexOf(to);
  const toLabel = STATUS_CONFIG[to]?.label ?? to;

  // ── Key forward transitions ───────────────────────────
  if (from === 'ready' && to === 'in-progress') {
    return {
      title: 'Move to In progress?',
      body: 'This means the client approved your quote and work has begun.',
      confirmLabel: 'Confirm →',
      confirmVariant: 'primary',
      cancelLabel: 'Go back',
    };
  }
  if (from === 'in-progress' && to === 'invoiced') {
    return {
      title: 'Move to Invoiced?',
      body: 'This means the work is complete and the invoice has been sent.',
      confirmLabel: 'Confirm →',
      confirmVariant: 'primary',
      cancelLabel: 'Go back',
    };
  }
  if (from === 'invoiced' && to === 'cleared') {
    return {
      title: 'Mark as cleared?',
      body: 'Only confirm this once payment has arrived in your account.',
      confirmLabel: 'Payment received →',
      confirmVariant: 'accent-green',
      cancelLabel: 'Not yet',
    };
  }

  // ── Archived → restore ────────────────────────────────
  if (from === 'archived') {
    return {
      title: `Restore to ${toLabel}?`,
      body: 'This will restore the project and return it to your active list.',
      confirmLabel: 'Restore project',
      confirmVariant: 'secondary',
      cancelLabel: 'Cancel',
    };
  }

  // ── Backward transitions ──────────────────────────────
  if (fromIdx > toIdx) {
    return {
      title: `Move back to ${toLabel}?`,
      body: 'This will undo the current progress stage.',
      confirmLabel: 'Move back',
      confirmVariant: 'secondary',
      cancelLabel: 'Cancel',
    };
  }

  // ── Any other forward jump (e.g. ready → invoiced) ────
  return {
    title: `Move to ${toLabel}?`,
    body: 'This will update the project status.',
    confirmLabel: 'Confirm →',
    confirmVariant: 'primary',
    cancelLabel: 'Go back',
  };
}

/* ── Props ───────────────────────────────────────────────── */
interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  currentStatus: ProjectStatus;
  onSelectStatus: (status: ProjectStatus) => void;
}

/* ── Component ───────────────────────────────────────────── */
export function BottomSheet({ open, onClose, title, currentStatus, onSelectStatus }: BottomSheetProps) {
  // null = State 1 (selection), set = State 2 (confirmation)
  const [pending, setPending] = useLocalState<ProjectStatus | null>(null);

  // Reset to State 1 whenever the modal closes or reopens
  useEffect(() => {
    if (!open) setPending(null);
  }, [open]);

  const handleBack  = () => setPending(null);
  const handleConfirm = () => {
    if (pending) onSelectStatus(pending);
    onClose();
  };

  /* ── State 2 — Confirmation ──────────────────────────── */
  if (pending !== null) {
    const cfg = getConfirmConfig(currentStatus, pending);
    const isGreen = cfg.confirmVariant === 'accent-green';
    const isRestore = currentStatus === 'archived';

    /* ── Restore layout — mirrors DeleteModal structure ── */
    if (isRestore) {
      return (
        <Modal open={open} onClose={onClose} maxWidth={340} contentPadding="4px 20px 20px">
          {/* Centred icon circle */}
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: C.quoting,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <RotateCcw size={22} color={C.black} strokeWidth={2} />
          </div>

          {/* Title — left-aligned */}
          <p style={{
            fontSize: T.title.fontSize, fontWeight: 600,
            color: C.black, margin: '0 0 8px', lineHeight: 1.3,
          }}>
            {cfg.title}
          </p>

          {/* Body — left-aligned */}
          <p style={{
            fontSize: '13px', fontWeight: 400,
            color: C.muted, margin: '0 0 24px', lineHeight: 1.6,
          }}>
            {cfg.body}
          </p>

          {/* Primary action */}
          <Btn variant="primary" fullWidth onClick={handleConfirm}>
            {cfg.confirmLabel}
          </Btn>

          {/* Ghost cancel */}
          <div style={{ marginTop: 4 }}>
            <Btn variant="ghost" fullWidth onClick={onClose}>
              {cfg.cancelLabel}
            </Btn>
          </div>
        </Modal>
      );
    }

    /* ── All other confirmations — existing centred layout ── */
    return (
      <Modal
        open={open}
        onClose={onClose}
        maxWidth={340}
        contentPadding="24px 20px 20px"
        customHeader={<></>}
      >
        {/* Title row: back chevron left, title centred, spacer right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '44px 1fr 44px',
          alignItems: 'center',
          marginBottom: 12,
        }}>
          {/* ‹ Light context back — 18px icon, 36×36 circle, 44×44 tap target */}
          <LightModalBtn onClick={handleBack} ariaLabel="Back">
            <ChevronLeft size={18} strokeWidth={2.5} />
          </LightModalBtn>

          <span style={{
            fontSize: T.title.fontSize,
            fontWeight: 600,
            color: C.black,
            textAlign: 'center',
            letterSpacing: '-0.01em',
          }}>
            {cfg.title}
          </span>
          <div />
        </div>

        {/* Body */}
        <p style={{
          fontSize: T.input.fontSize,
          fontWeight: 400,
          color: C.muted,
          textAlign: 'center',
          lineHeight: 1.6,
          margin: '0 auto',
          maxWidth: 240,
        }}>
          {cfg.body}
        </p>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          onMouseEnter={e => (e.currentTarget.style.background = isGreen ? '#33E07A' : '#2A2A2A')}
          onMouseLeave={e => (e.currentTarget.style.background = isGreen ? C.cleared : C.black)}
          style={{
            display: 'block', width: '100%', height: 44,
            background: isGreen ? C.cleared : C.black,
            color: isGreen ? C.black : C.white,
            border: 'none', borderRadius: '12px',
            fontSize: T.input.fontSize, fontWeight: 600,
            letterSpacing: '-0.01em', fontFamily: 'inherit',
            cursor: 'pointer', marginTop: 20,
            transition: 'background 150ms',
          }}
        >
          {cfg.confirmLabel}
        </button>

        {/* Cancel — plain text */}
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <span
            onClick={handleBack}
            style={{
              fontSize: '13px',
              fontWeight: 400,
              color: C.muted,
              cursor: 'pointer',
              display: 'inline-block',
              padding: '4px 0',
            }}
          >
            {cfg.cancelLabel}
          </span>
        </div>
      </Modal>
    );
  }

  /* ── State 1 — Selection (original behaviour) ────────── */
  return (
    <Modal open={open} onClose={onClose} maxWidth={340} contentPadding="4px 20px 20px">
      {/* Header */}
      <p style={{ ...T.sm, fontWeight: 500, color: C.muted, margin: '0 0 14px' }}>
        {title} —{' '}
        <span style={{ fontStyle: 'italic' }}>
          {currentStatus === 'archived' ? 'restore to...' : 'move to...'}
        </span>
      </p>

      {/* Status option list */}
      <div style={{
        border: `1px solid ${C.border}`,
        borderRadius: R.md,
        overflow: 'hidden',
      }}>
        {STATUS_OPTIONS.map((status, idx) => {
          const isActive = status === currentStatus;
          return (
            <button
              key={status}
              onClick={() => {
                if (status !== currentStatus) setPending(status);
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = C.surface; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', gap: 12,
                minHeight: 52,
                background: isActive ? C.surface : 'transparent',
                border: 'none',
                borderBottom: idx < STATUS_OPTIONS.length - 1
                  ? `1px solid ${C.border}` : 'none',
                cursor: isActive ? 'default' : 'pointer',
                padding: '0 14px',
                textAlign: 'left',
                transition: 'background 120ms',
              }}
            >
              {/* Radio indicator */}
              <div style={{
                width: 18, height: 18, borderRadius: R.pill, flexShrink: 0,
                border: `1.5px solid ${isActive ? C.black : C.borderStrong}`,
                background: isActive ? C.black : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isActive && (
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.white }} />
                )}
              </div>

              <StatusPill status={status} />
            </button>
          );
        })}
      </div>
    </Modal>
  );
}