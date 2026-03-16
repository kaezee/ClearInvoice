import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../store';
import { C, T, R } from '../tokens';
import { ProjectCard } from '../components/ProjectCard';
import { BottomSheet } from '../components/BottomSheet';
import { ConfirmModal } from '../components/ConfirmModal';

export default function Archived() {
  const navigate = useNavigate();
  const { projects, updateProject, deleteProject } = useApp();

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [bottomSheetId, setBottomSheetId]   = useState<string | null>(null);

  const archivedProjects = projects.filter(p => p.status === 'archived');
  const deleteTarget     = projects.find(p => p.id === deleteTargetId);
  const selectedProject  = projects.find(p => p.id === bottomSheetId);

  const handleRestore = (id: string) => {
    // Quick-restore via swipe button → open status picker so user chooses destination
    setBottomSheetId(id);
  };

  const handleDelete = () => {
    if (!deleteTargetId) return;
    deleteProject(deleteTargetId);
    setDeleteTargetId(null);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100dvh', background: C.surface,
      position: 'relative',
    }}>

      {/* ── Top bar ─────────────────────────────────────── */}
      <nav style={{
        background: C.black,
        padding: `calc(env(safe-area-inset-top, 0px) + 14px) 16px 14px`,
        display: 'flex', alignItems: 'center', gap: 4,
        flexShrink: 0,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.white, display: 'flex', alignItems: 'center',
            padding: '4px 8px 4px 0', minHeight: 44, marginLeft: -4,
          }}
          aria-label="Back"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>

        <span style={{
          flex: 1, fontSize: '17px', fontWeight: 600,
          color: C.white, letterSpacing: '-0.01em',
        }}>
          Archived
        </span>

        <span style={{ fontSize: '13px', color: C.muted }}>
          {archivedProjects.length} project{archivedProjects.length !== 1 ? 's' : ''}
        </span>
      </nav>

      {/* ── Content ─────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 40px' }}>
        {archivedProjects.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', paddingTop: 80, gap: 8, textAlign: 'center',
          }}>
            <p style={{ ...T.base, fontWeight: 500, color: C.muted, margin: 0 }}>
              No archived projects
            </p>
            <p style={{ ...T.sm, color: C.hint, margin: 0 }}>
              Swipe left on a project and tap Archive
            </p>
          </div>
        ) : (
          <div role="list" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <AnimatePresence initial={false}>
              {archivedProjects.map(p => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 48, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProjectCard
                    project={p}
                    isOverdue={false}
                    onStatusTap={() => setBottomSheetId(p.id)}
                    onAdvanceStatus={() => {}}
                    onRequestClear={() => {}}
                    onDeleteRequest={() => setDeleteTargetId(p.id)}
                    onArchive={() => {}}
                    onRestore={() => handleRestore(p.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Status / restore bottom sheet ────────────────── */}
      {selectedProject && (
        <BottomSheet
          open={!!bottomSheetId}
          onClose={() => setBottomSheetId(null)}
          title={selectedProject.clientName}
          currentStatus={selectedProject.status}
          onSelectStatus={(status) => {
            updateProject(selectedProject.id, { status });
            setBottomSheetId(null);
          }}
        />
      )}

      {/* ── Delete confirmation modal ─────────────────── */}
      <ConfirmModal
        open={!!deleteTargetId && !!deleteTarget}
        onClose={() => setDeleteTargetId(null)}
        icon={<Trash2 size={22} color={C.danger} strokeWidth={2} />}
        iconBg={C.dangerLight}
        title="Delete project?"
        description={
          <>
            <strong style={{ color: C.black }}>{deleteTarget?.clientName}</strong>
            {' — '}{deleteTarget?.type} will be permanently removed. This can't be undone.
          </>
        }
        confirmLabel="Delete"
        confirmBg={C.danger}
        confirmIcon={<Trash2 size={15} />}
        onConfirm={handleDelete}
      />

    </div>
  );
}