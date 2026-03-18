import React from 'react';
import { Modal } from './Modal';
import { Btn } from './ui/Btn';
import { C } from '../tokens';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: React.ReactNode;
  cancelLabel?: string;
  confirmLabel: string;
  /** Pass C.danger for destructive, C.cleared for positive, or C.black for primary */
  confirmBg: string;
  confirmIcon?: React.ReactNode;
  onConfirm: () => void;
}

export function ConfirmModal({
  open, onClose, icon, iconBg,
  title, description,
  cancelLabel = 'Cancel',
  confirmLabel, confirmBg, confirmIcon,
  onConfirm,
}: ConfirmModalProps) {
  // Map confirmBg to Btn variant
  const confirmVariant =
    confirmBg === C.danger   ? 'destructive' :
    confirmBg === C.cleared  ? 'accent-green' :
    confirmBg === C.invoiced ? 'accent-cyan' :
    confirmBg === C.quoting  ? 'accent-yellow' :
    'primary';

  return (
    <Modal open={open} onClose={onClose} contentPadding="4px 24px 24px">
      {/* Icon circle */}
      <div style={{
        width: 52, height: 52, borderRadius: '50%',
        background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 14,
        margin: '0 auto 14px',
      }}>
        {icon}
      </div>

      {/* Title */}
      <p style={{ fontSize: '15px', fontWeight: 700, color: C.black, margin: '0 0 8px', lineHeight: 1.4 }}>
        {title}
      </p>

      {/* Description */}
      <p style={{ fontSize: '13px', color: C.muted, margin: '0 0 24px', lineHeight: 1.6 }}>
        {description}
      </p>

      {/* Confirm button — full width */}
      <Btn
        variant={confirmVariant}
        fullWidth
        onClick={() => { onConfirm(); onClose(); }}
      >
        {confirmIcon}
        {confirmLabel}
      </Btn>

      {/* Cancel — full width secondary button below */}
      <div style={{ marginTop: 10 }}>
        <Btn variant="secondary" fullWidth onClick={onClose}>
          {cancelLabel}
        </Btn>
      </div>
    </Modal>
  );
}