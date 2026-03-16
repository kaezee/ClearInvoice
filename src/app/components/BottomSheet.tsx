import React from 'react';
import { Modal } from './Modal';
import { ProjectStatus } from '../types';
import { C, T, R } from '../tokens';
import { StatusPill } from './StatusPill';

const STATUS_OPTIONS: ProjectStatus[] = ['ready', 'in-progress', 'invoiced', 'cleared'];

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  currentStatus: ProjectStatus;
  onSelectStatus: (status: ProjectStatus) => void;
}

export function BottomSheet({ open, onClose, title, currentStatus, onSelectStatus }: BottomSheetProps) {
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
                if (status !== currentStatus) onSelectStatus(status);
                onClose();
              }}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', gap: 12,
                minHeight: 52,
                background: isActive ? C.surface : 'transparent',
                border: 'none',
                borderBottom: idx < STATUS_OPTIONS.length - 1
                  ? `1px solid ${C.border}` : 'none',
                cursor: 'pointer',
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