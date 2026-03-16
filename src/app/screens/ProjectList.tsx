import { useNavigate } from 'react-router';
import React, { useState, useMemo } from 'react';
import { Plus, Trash2, CheckCircle2, Archive, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../store';
import { C, T, R } from '../tokens';
import { ProjectCard } from '../components/ProjectCard';
import { BottomSheet } from '../components/BottomSheet';
import { AvatarSheet } from '../components/AvatarSheet';
import { ConfirmModal } from '../components/ConfirmModal';
import { Project } from '../types';

type Tab = 'active' | 'cleared';
const TAB_INDEX: Record<Tab, number> = { active: 0, cleared: 1 };

/* ── Search helper ──────────────────────────────────────── */
function matchesSearch(q: string) {
  const lower = q.toLowerCase();
  return (p: Project) =>
    p.clientName.toLowerCase().includes(lower) ||
    p.type.toLowerCase().includes(lower) ||
    p.amount.toString().includes(lower);
}

export default function ProjectList() {
  const { projects, advanceStatus, updateProject, deleteProject, isOverdue } = useApp();
  const navigate = useNavigate();

  const { branding } = useApp();
  const avatarInitial = (branding.freelancerName || branding.businessName || 'K')[0].toUpperCase();

  const [tab, setTab]                         = useState<Tab>('active');
  const [searchQuery, setSearchQuery]         = useState('');
  const [searchFocused, setSearchFocused]     = useState(false);
  const [avatarOpen, setAvatarOpen]           = useState(false);
  const [bottomSheetId, setBottomSheetId]     = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId]   = useState<string | null>(null);
  const [confirmClearId, setConfirmClearId]   = useState<string | null>(null);
  const [archiveTargetId, setArchiveTargetId] = useState<string | null>(null);

  /* ── Derived lists ──────────────────────────────────────── */
  const activeProjects = useMemo(() => {
    let base = projects.filter(p => p.status !== 'cleared' && p.status !== 'archived');
    if (searchQuery.trim()) base = base.filter(matchesSearch(searchQuery));
    return base;
  }, [projects, searchQuery]);

  const clearedProjects = useMemo(() => {
    let base = projects.filter(p => p.status === 'cleared');
    if (searchQuery.trim()) base = base.filter(matchesSearch(searchQuery));
    return base;
  }, [projects, searchQuery]);

  const activeCount  = projects.filter(p => p.status !== 'cleared' && p.status !== 'archived').length;
  const clearedCount = projects.filter(p => p.status === 'cleared').length;

  /* ── Lookups ────────────────────────────────────────────── */
  const selectedProject     = projects.find(p => p.id === bottomSheetId);
  const deleteTarget        = projects.find(p => p.id === deleteTargetId);
  const confirmClearProject = projects.find(p => p.id === confirmClearId);
  const archiveTarget       = projects.find(p => p.id === archiveTargetId);

  /* ── Actions ────────────────────────────────────────────── */
  const handleDelete = () => {
    if (!deleteTargetId) return;
    deleteProject(deleteTargetId);
    setDeleteTargetId(null);
  };

  const handleArchive = (id: string) => {
    updateProject(id, { status: 'archived' });
    setArchiveTargetId(null);
  };

  const handleConfirmClear = () => {
    if (!confirmClearId) return;
    advanceStatus(confirmClearId);
    setConfirmClearId(null);
    setTimeout(() => setTab('cleared'), 320);
  };

  /* ── Pane translate: -50% per tab of 200%-wide container ── */
  const xPct = `${-TAB_INDEX[tab] * 50}%`;

  /* ── Tab definitions ────────────────────────────────────── */
  const TABS: { key: Tab; label: string; count: number }[] = [
    { key: 'active',  label: 'Active',  count: activeCount  },
    { key: 'cleared', label: 'Cleared', count: clearedCount },
  ];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100dvh', background: C.surface,
      overflowX: 'hidden', position: 'relative',
    }}>

      {/* ── Top nav ─────────────────────────────────────── */}
      <nav style={{
        background: C.black,
        padding: `calc(env(safe-area-inset-top, 0px) + 14px) 16px 0`,
        position: 'sticky', top: 0, zIndex: 10, flexShrink: 0,
      }}>

        {/* Title row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', paddingBottom: 12,
        }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 400.54 111.02"
            height="22"
            fill="#FFFFFF"
            style={{ flexShrink: 0, display: 'block' }}
          >
            <path d="m32.05,18.71c5.21-3.37,11.45-5.06,18.71-5.06,8.18,0,14.62,1.89,19.32,5.67,4.7,3.78,7.82,8.84,9.35,15.18h17.02c-2.05-10.94-7.03-19.42-14.95-25.46C73.58,3.02,63.38,0,50.91,0c-10.43,0-19.47,2.33-27.14,6.98-7.67,4.65-13.55,11.17-17.63,19.55C2.04,34.91,0,44.57,0,55.51s2.04,20.73,6.13,29.06c4.09,8.33,9.97,14.82,17.63,19.48,7.67,4.65,16.71,6.98,27.14,6.98,12.47,0,22.67-2.99,30.59-8.97,7.92-5.98,12.91-14.28,14.95-24.92h-17.02c-1.53,6.24-4.65,11.17-9.35,14.8-4.7,3.63-11.14,5.44-19.32,5.44-7.26,0-13.49-1.66-18.71-4.98-5.21-3.32-9.25-8.13-12.11-14.41-2.86-6.29-4.29-13.78-4.29-22.47s1.43-16.15,4.29-22.39c2.86-6.23,6.9-11.04,12.11-14.41Z"/>
            <polygon fill="#00c2cc" points="205.28 2.96 120.82 83.76 121.6 42.78 106.27 31.41 107.18 109.18 117.11 109.18 223.02 1.87 205.28 2.96"/>
            <path d="m251.18,35.12c-5.42-3.37-11.91-5.06-19.48-5.06s-14.24,1.71-20.01,5.14c-5.78,3.43-10.22,8.18-13.34,14.26-3.12,6.08-4.68,13.16-4.68,21.24s1.61,15.13,4.83,21.16c3.22,6.03,7.67,10.73,13.34,14.11,5.67,3.37,12.19,5.06,19.55,5.06,6.13,0,11.5-1.07,16.1-3.22,4.6-2.15,8.48-5.08,11.66-8.82,3.17-3.73,5.42-7.95,6.75-12.65h-15.33c-1.43,3.68-3.76,6.59-6.98,8.74-3.22,2.15-7.28,3.22-12.19,3.22-4.19,0-8-1.02-11.42-3.07-3.43-2.04-6.16-5.01-8.2-8.89-1.78-3.38-2.74-7.5-2.97-12.27h58.94c.2-1.33.31-2.61.31-3.83v-3.37c0-6.75-1.46-12.88-4.37-18.4-2.91-5.52-7.08-9.97-12.5-13.34Zm-42.23,28.22c.41-3.64,1.34-6.79,2.82-9.43,2.04-3.63,4.8-6.39,8.28-8.28,3.47-1.89,7.31-2.84,11.5-2.84,5.93,0,10.89,1.84,14.87,5.52,3.99,3.68,6.13,8.69,6.44,15.03h-43.92Z"/>
            <path d="m331.38,33.89c-4.91-2.55-10.99-3.83-18.25-3.83-5.52,0-10.73,1.02-15.64,3.07-4.91,2.05-8.92,5.01-12.04,8.89-3.12,3.89-4.98,8.59-5.6,14.11h15.33c.82-4.5,2.86-7.85,6.13-10.04,3.27-2.2,7.21-3.3,11.81-3.3,3.99,0,7.28.77,9.89,2.3,2.61,1.53,4.57,3.78,5.9,6.75,1.33,2.97,1.99,6.7,1.99,11.19h-19.94c-6.95,0-12.88.97-17.79,2.91-4.91,1.94-8.69,4.73-11.35,8.36-2.66,3.63-3.99,7.95-3.99,12.96,0,4.29,1.02,8.26,3.07,11.88,2.04,3.63,5.16,6.52,9.35,8.66,4.19,2.15,9.45,3.22,15.79,3.22,3.37,0,6.39-.38,9.05-1.15,2.66-.77,5.03-1.81,7.13-3.14,2.09-1.33,3.93-2.91,5.52-4.75,1.58-1.84,2.89-3.78,3.91-5.83l1.23,13.03h13.34v-47.84c0-6.44-1.25-11.99-3.76-16.64-2.51-4.65-6.21-8.25-11.12-10.81Zm-.61,40.33c-.1,3.17-.67,6.19-1.69,9.05-1.02,2.86-2.48,5.47-4.37,7.82-1.89,2.35-4.17,4.19-6.82,5.52-2.66,1.33-5.62,1.99-8.89,1.99-3.07,0-5.75-.51-8.05-1.53-2.3-1.02-4.04-2.45-5.21-4.29-1.18-1.84-1.76-3.99-1.76-6.44s.61-4.62,1.84-6.52c1.23-1.89,3.19-3.35,5.9-4.37,2.71-1.02,6.31-1.53,10.81-1.53h18.25v.31Z"/>
            <path d="m387.74,32.05c-3.83,1.33-7.11,3.2-9.81,5.6-2.71,2.4-4.98,5.34-6.82,8.82l-1.23-14.57h-13.8v77.29h15.34v-38.49c0-4.8.64-8.76,1.92-11.88,1.28-3.12,2.99-5.6,5.14-7.44,2.15-1.84,4.65-3.17,7.51-3.99,2.86-.82,5.88-1.23,9.05-1.23h5.52v-16.1c-4.7,0-8.97.67-12.8,1.99Z"/>
            <rect fill="#ffd600" x="381.03" y="94.88" width="14.3" height="14.3"/>
          </svg>

          {/* Avatar circle */}
          <button
            onClick={() => setAvatarOpen(true)}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: C.quoting,
              border: `1px solid ${C.black}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 700, color: C.black }}>
              {avatarInitial}
            </span>
          </button>
        </div>

        {/* ── Two-tab bar ──────────────────────────────── */}
        <div style={{ display: 'flex' }}>
          {TABS.map(({ key, label, count }) => {
            const isActive = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  flex: 1, background: 'none',
                  borderTop: 'none', borderRight: 'none',
                  borderBottom: 'none', borderLeft: 'none',
                  cursor: 'pointer', padding: '10px 0 12px',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 6,
                  position: 'relative',
                }}
              >
                <span style={{
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? C.white : 'rgba(255,255,255,0.45)',
                  transition: 'color 180ms',
                }}>
                  {label}
                </span>
                {count > 0 && (
                  <span style={{
                    fontSize: '10px', fontWeight: 700,
                    color: isActive ? C.white : 'rgba(255,255,255,0.45)',
                    background: isActive
                      ? 'rgba(255,255,255,0.15)'
                      : 'rgba(255,255,255,0.08)',
                    padding: '2px 6px', borderRadius: R.pill,
                    transition: 'all 180ms',
                  }}>
                    {count}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      height: 2, background: C.white, borderRadius: 2,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Search bar — sticky below nav ───────────────── */}
      <div style={{
        flexShrink: 0, background: C.surface,
        padding: '10px 16px',
        zIndex: 9,
      }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            color={C.hint}
            style={{
              position: 'absolute', left: 12,
              top: '50%', transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search projects..."
            style={{
              width: '100%', height: 40,
              background: C.white,
              border: `1px solid ${searchFocused ? C.black : C.border}`,
              borderRadius: '8px',
              padding: '0 12px 0 36px',
              fontSize: '13px', color: C.black,
              outline: 'none',
              boxShadow: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 150ms',
            }}
          />
        </div>
      </div>

      {/* ── 2-pane sliding content ───────────────────────── */}
      <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <motion.div
          style={{ display: 'flex', width: '200%', height: '100%' }}
          animate={{ x: xPct }}
          transition={{ type: 'spring', stiffness: 380, damping: 38, mass: 0.8 }}
        >

          {/* Pane 1 — Active */}
          <div style={{ width: '50%', overflowY: 'auto', padding: '8px 16px 100px' }}>
            {activeProjects.length === 0 ? (
              <EmptyState
                title={searchQuery ? 'No results' : 'No active projects'}
                subtitle={searchQuery ? 'Try a different search' : 'Add a project to get started'}
                action={
                  !searchQuery
                    ? <button onClick={() => navigate('/projects/new')} style={emptyActionStyle}>+ New project</button>
                    : undefined
                }
              />
            ) : (
              <div role="list" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <AnimatePresence initial={false}>
                  {activeProjects.map(p => (
                    <motion.div
                      key={p.id} layout
                      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 48, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ProjectCard
                        project={p} isOverdue={isOverdue(p)}
                        onStatusTap={() => setBottomSheetId(p.id)}
                        onAdvanceStatus={() => advanceStatus(p.id)}
                        onRequestClear={() => setConfirmClearId(p.id)}
                        onDeleteRequest={() => setDeleteTargetId(p.id)}
                        onArchive={() => setArchiveTargetId(p.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Pane 2 — Cleared */}
          <div style={{ width: '50%', overflowY: 'auto', padding: '8px 16px 100px', opacity: 0.75 }}>
            {clearedProjects.length === 0 ? (
              <EmptyState
                title={searchQuery ? 'No results' : 'No cleared projects yet'}
                subtitle={searchQuery ? 'Try a different search' : 'Projects move here once fully cleared'}
              />
            ) : (
              <div role="list" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {clearedProjects.map(p => (
                  <ProjectCard
                    key={p.id} project={p} isOverdue={false}
                    onStatusTap={() => {}}
                    onAdvanceStatus={() => {}} onRequestClear={() => {}}
                    onDeleteRequest={() => setDeleteTargetId(p.id)}
                    onArchive={() => {}}
                  />
                ))}
              </div>
            )}
          </div>

        </motion.div>
      </main>

      {/* ── FAB ─────────────────────────────────────────── */}
      <button
        onClick={() => navigate('/projects/new')}
        style={{
          position: 'fixed',
          bottom: `calc(24px + env(safe-area-inset-bottom, 0px))`,
          left: '50%', transform: 'translateX(-50%)',
          background: C.black, color: C.white,
          border: `1.5px solid ${C.black}`,
          borderRadius: R.xl, height: 48, padding: '0 32px',
          cursor: 'pointer', fontSize: '14px', fontWeight: 700,
          letterSpacing: '-0.01em',
          boxShadow: '0 4px 20px rgba(10,10,10,0.18)',
          zIndex: 20, whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#2A2A2A')}
        onMouseLeave={e => (e.currentTarget.style.background = C.black)}
      >
        + New project
      </button>

      {/* ── Avatar bottom sheet ──────────────────────────── */}
      <AvatarSheet open={avatarOpen} onClose={() => setAvatarOpen(false)} />

      {/* ── Status picker modal ──────────────────────────── */}
      {selectedProject && (
        <BottomSheet
          open={!!bottomSheetId}
          onClose={() => setBottomSheetId(null)}
          title={selectedProject.clientName}
          currentStatus={selectedProject.status}
          onSelectStatus={(status) => {
            updateProject(selectedProject.id, { status });
          }}
        />
      )}

      {/* ── Confirm Clear modal ──────────────────────────── */}
      <ConfirmModal
        open={!!confirmClearId && !!confirmClearProject}
        onClose={() => setConfirmClearId(null)}
        icon={<CheckCircle2 size={22} color={C.black} strokeWidth={2} />}
        iconBg={C.cleared}
        title="Mark as cleared?"
        description="This means the invoice has been paid and everything is wrapped up."
        confirmLabel="Yes, clear it"
        confirmBg={C.cleared}
        confirmTextColor={C.black}
        confirmIcon={<CheckCircle2 size={15} />}
        onConfirm={handleConfirmClear}
      />

      {/* ── Archive confirmation modal ───────────────────── */}
      <ConfirmModal
        open={!!archiveTargetId && !!archiveTarget}
        onClose={() => setArchiveTargetId(null)}
        icon={<Archive size={22} color="#475569" strokeWidth={2} />}
        iconBg="#f1f5f9"
        title="Archive this project?"
        description={
          <>
            <strong style={{ color: C.black }}>{archiveTarget?.clientName}</strong>
            {' — '}{archiveTarget?.type} will be moved to your archive.
          </>
        }
        confirmLabel="Archive"
        confirmBg="#475569"
        confirmIcon={<Archive size={15} />}
        onConfirm={() => archiveTargetId && handleArchive(archiveTargetId)}
      />

      {/* ── Delete confirmation modal ────────────────────── */}
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

/* ── Empty state ────────────────────────────────────────── */
function EmptyState({
  title, subtitle, action,
}: {
  title: string; subtitle: string; action?: React.ReactNode;
}) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', paddingTop: 64, gap: 12, textAlign: 'center',
    }}>
      <div style={{ width: 72, height: 72, position: 'relative', marginBottom: 8 }}>
        <div style={{
          width: 48, height: 60, background: C.borderStrong,
          borderRadius: R.md, position: 'absolute', top: 0, left: 0,
        }} />
        <div style={{
          width: 48, height: 60, background: C.surface,
          border: `1px solid ${C.border}`, borderRadius: R.md,
          position: 'absolute', top: 8, left: 14,
        }} />
      </div>
      <p style={{ ...T.base, fontWeight: 500, color: C.muted, margin: 0 }}>{title}</p>
      <p style={{ ...T.sm, color: C.hint, margin: 0 }}>{subtitle}</p>
      {action}
    </div>
  );
}

const emptyActionStyle: React.CSSProperties = {
  background: C.black, color: C.white, border: `1.5px solid ${C.black}`,
  borderRadius: R.xl, height: 48, padding: '0 24px',
  cursor: 'pointer', marginTop: 8, fontSize: '14px', fontWeight: 700,
  letterSpacing: '-0.01em',
};