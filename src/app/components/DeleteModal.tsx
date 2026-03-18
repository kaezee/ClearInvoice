import React from 'react';
import { Trash2 } from 'lucide-react';
import { Modal } from './Modal';
import { Btn } from './ui/Btn';
import { C, T } from '../tokens';

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  clientName: string;
  /** Body copy — varies by context */
  body: string;
  /** Primary CTA label. Defaults to "Delete forever" */
  confirmLabel?: string;
  onDelete: () => void;
  /** If provided, shows "Archive instead" secondary button */
  onArchiveInstead?: () => void;
}

export function DeleteModal({
  open, onClose, clientName, body,
  confirmLabel = 'Delete forever',
  onDelete, onArchiveInstead,
}: DeleteModalProps) {
  const displayName = clientName.length > 24 ? clientName.slice(0, 24) + '…' : clientName;

  return (
    <Modal open={open} onClose={onClose} contentPadding="4px 20px 20px">

      {/* Icon */}
      <div style={{
        width: 52, height: 52, borderRadius: '50%', background: C.dangerLight,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px',
      }}>
        <Trash2 size={22} color={C.danger} strokeWidth={2} />
      </div>

      {/* Title */}
      <p style={{
        fontSize: T.title.fontSize, fontWeight: 600,
        color: C.black, margin: '0 0 8px', lineHeight: 1.3,
      }}>
        Delete {displayName}?
      </p>

      {/* Body */}
      <p style={{
        fontSize: '13px', fontWeight: 400,
        color: C.muted, margin: '0 0 24px', lineHeight: 1.6,
      }}>
        {body}
      </p>

      {/* Primary — destructive */}
      <Btn variant="destructive" fullWidth onClick={() => { onDelete(); onClose(); }}>
        {confirmLabel}
      </Btn>

      {/* Archive instead — only when applicable */}
      {onArchiveInstead && (
        <div style={{ marginTop: 10 }}>
          <Btn variant="secondary" fullWidth onClick={() => { onArchiveInstead!(); onClose(); }}>
            Archive instead
          </Btn>
        </div>
      )}

      {/* Cancel */}
      <div style={{ marginTop: 4 }}>
        <Btn variant="ghost" fullWidth onClick={onClose}>
          Cancel
        </Btn>
      </div>

    </Modal>
  );
}