import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { DarkNavBtn } from '../components/ui/CircleIconBtn';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useApp } from '../store';
import { C, T } from '../tokens';
import { ProjectCard } from '../components/ProjectCard';
import { DeleteModal } from '../components/DeleteModal';

export default function Archived() {
  const navigate = useNavigate();
  const { projects, deleteProject, restoreProject } = useApp();

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const archivedProjects = projects.filter(p => p.status === 'archived');
  const deleteTarget     = projects.find(p => p.id === deleteTargetId);

  // One-tap restore: returns the project to its pre-archive status (no picker).
  const handleRestore = (id: string) => {
    restoreProject(id);
    toast.success('Restored');
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
        <DarkNavBtn onClick={() => navigate(-1)} ariaLabel="Back">
          <ChevronLeft size={20} strokeWidth={2.5} />
        </DarkNavBtn>

        <span style={{
          flex: 1, fontSize: T.title.fontSize, fontWeight: 600,
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
                    onStatusTap={() => {}}
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

      {/* ── Delete confirmation modal ─────────────────── */}
      <DeleteModal
        open={!!deleteTargetId && !!deleteTarget}
        onClose={() => setDeleteTargetId(null)}
        clientName={deleteTarget?.clientName ?? ''}
        body="There's no way to get it back."
        onDelete={handleDelete}
      />

    </div>
  );
}
