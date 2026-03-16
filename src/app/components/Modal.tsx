import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { C, R } from '../tokens';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Padding for the content area below the close-button row. Default: '4px 24px 24px' */
  contentPadding?: string;
  maxWidth?: number;
}

export function Modal({
  open, onClose, children,
  contentPadding = '4px 24px 24px',
  maxWidth = 360,
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
              /* No outer padding — header row + content area handle spacing */
            }}
          >
            {/* ── Close button row ───────────────────── */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '10px 10px 0',
            }}>
              <button
                onClick={onClose}
                aria-label="Close"
                style={{
                  width: 28, height: 28,
                  background: C.surface,
                  border: 'none',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <X size={13} color={C.muted} strokeWidth={2.5} />
              </button>
            </div>

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