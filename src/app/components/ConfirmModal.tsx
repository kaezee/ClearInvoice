import React from 'react';
import { Modal } from './Modal';
import { Btn } from './ui/Btn';
import { C, R } from '../tokens';

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
  confirmTextColor?: string;
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
        width: 48, height: 48, borderRadius: '50%',
        background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 14,
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

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <Btn variant="secondary" style={{ flex: 1 }} onClick={onClose}>
          {cancelLabel}
        </Btn>
        <Btn
          variant={confirmVariant}
          style={{ flex: 1 }}
          onClick={() => { onConfirm(); onClose(); }}
        >
          {confirmIcon}
          {confirmLabel}
        </Btn>
      </div>
    </Modal>
  );
}