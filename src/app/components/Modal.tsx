import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { C, R } from '../tokens';
import { LightModalBtn } from './ui/CircleIconBtn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Padding for the content area below the header row. Default: '4px 24px 24px' */
  contentPadding?: string;
  maxWidth?: number;
  /** Replace the default close-button row with a custom header element */
  customHeader?: React.ReactNode;
}

export function Modal({
  open, onClose, children,
  contentPadding = '4px 24px 24px',
  maxWidth = 360,
  customHeader,
}: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 20px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth,
              background: C.white,
              borderRadius: R.lg,
              boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
              maxHeight: 'calc(100dvh - 80px)',
              overflowY: 'auto',
            }}
          >
            {customHeader ?? (
              /* ── Default close button row ───────────────────── */
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '4px 4px 0',
              }}>
                <LightModalBtn onClick={onClose} ariaLabel="Close">
                  <X size={16} strokeWidth={2.5} />
                </LightModalBtn>
              </div>
            )}

            {/* ── Content ────────────────────────────── */}
            <div style={{ padding: contentPadding }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
