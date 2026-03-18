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
import { Modal } from '../components/Modal';
import { Btn } from '../components/ui/Btn';
import { DeleteModal } from '../components/DeleteModal';
import { Project } from '../types';

type Tab = 'active' | 'cleared';

/* ── Search helper ──────────────────────────────────────── */
function matchesSearch(q: string) {
  const lower = q.toLowerCase();
  return (p: Project) => {
    const serviceNames = (p.services ?? []).map(s => s.name.toLowerCase()).join(' ');
    return (
      p.clientName.toLowerCase().includes(lower) ||
      p.type.toLowerCase().includes(lower) ||
      serviceNames.includes(lower) ||
      p.amount.toString().includes(lower)
    );
  };
}

// Module-level mutable var used ONLY to pass a value between two lazy useState
// initialisers inside the same synchronous mount. Safe because React runs both
// initialisers back-to-back before any re-render.
let _pendingSheetView: 'menu' | 'archived' = 'menu';

export default function ProjectList() {
  const { projects, advanceStatus, updateProject, deleteProject, isOverdue, archiveProject, branding } = useApp();
  const navigate = useNavigate();

  const avatarInitial = (branding.freelancerName || branding.businessName || 'K')[0].toUpperCase();

  // Tab is persisted in sessionStorage so it survives the unmount/remount that
  // happens when navigating to ProjectDetail and back — with no history-stack pollution.
  const [tab, setTab] = useState<Tab>(() => {
    const saved = sessionStorage.getItem('clear_project_tab');
    return saved === 'cleared' ? 'cleared' : 'active';
  });

  // Always keep sessionStorage in sync so navigate(-1) from ProjectDetail
  // naturally restores the correct tab on remount.
  const handleTabChange = (next: Tab) => {
    setTab(next);
    sessionStorage.setItem('clear_project_tab', next);
  };
  const [searchQuery, setSearchQuery]         = useState('');
  const [searchFocused, setSearchFocused]     = useState(false);
  // Consume the sessionStorage flag written by AvatarSheet's ArchivedContent.
  // Both initialisers run before React processes any re-renders, so we read the
  // flag in the first one, delete it, and pass the result into the second via a
  // module-scoped variable that lives only for this mount.
  // Read the sessionStorage flag once on mount. If set, open the sheet immediately
  // on the Archived panel with no entrance animation (back-nav reopen).
  const [avatarOpen, setAvatarOpen] = useState<boolean>(() => {
    const flag = sessionStorage.getItem('clear_reopen_sheet');
    if (flag === 'archived') {
      sessionStorage.removeItem('clear_reopen_sheet');
      _pendingSheetView = 'archived';
      return true;
    }
    _pendingSheetView = 'menu';
    return false;
  });
  const [avatarInitialView, setAvatarInitialView] = useState<'menu' | 'archived'>(
    () => _pendingSheetView,
  );
  // True when the sheet was reopened via back-nav (skip entrance slide animation).
  const [avatarInstant, setAvatarInstant] = useState<boolean>(
    () => _pendingSheetView === 'archived',
  );
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
    archiveProject(id);
    setArchiveTargetId(null);
  };

  const handleConfirmClear = () => {
    if (!confirmClearId) return;
    advanceStatus(confirmClearId);
    setConfirmClearId(null);
    setTimeout(() => handleTabChange('cleared'), 320);
  };

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
            onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(0.88)')}
            onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: C.quoting,
              border: `1px solid ${C.black}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
              transition: 'filter 150ms',
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
                onClick={() => handleTabChange(key)}
                onMouseEnter={e => { if (!isActive) (e.currentTarget.querySelector('span') as HTMLElement | null)?.style && (e.currentTarget.style.opacity = '0.8'); }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                style={{
                  flex: 1, background: 'none',
                  borderTop: 'none', borderRight: 'none',
                  borderBottom: 'none', borderLeft: 'none',
                  cursor: 'pointer', padding: '10px 0 12px',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 6,
                  position: 'relative',
                  transition: 'opacity 150ms',
                }}
              >
                <span style={{
                  fontSize: T.sm.fontSize,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? C.white : 'rgba(255,255,255,0.4)',
                  transition: 'color 180ms',
                }}>
                  {label}
                </span>
                {count > 0 && (
                  <span style={{
                    fontSize: T.label.fontSize, fontWeight: 600,
                    color: isActive ? C.black : 'rgba(255,255,255,0.4)',
                    background: isActive
                      ? C.invoiced
                      : 'rgba(255,255,255,0.15)',
                    padding: '1px 6px', borderRadius: 20,
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
                      height: 3, background: C.invoiced, borderRadius: 2,
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

      {/* ── Tab content — only one pane in DOM at a time ────── */}
      <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'absolute', inset: 0,
              overflowY: 'auto', padding: '8px 16px 100px',
            }}
          >
            {tab === 'active' ? (
              activeProjects.length === 0 ? (
                <EmptyState
                  title={searchQuery ? 'No results' : 'No projects yet'}
                  subtitle={searchQuery ? 'Try a different search' : 'Add your first project to get started.'}
                  action={
                    !searchQuery
                      ? <button
                          onClick={() => navigate('/projects/new')}
                          style={emptyActionStyle}
                          onMouseEnter={e => (e.currentTarget.style.background = '#2A2A2A')}
                          onMouseLeave={e => (e.currentTarget.style.background = C.black)}
                        >New project →</button>
                      : undefined
                  }
                  showGuideCards={!searchQuery}
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
                          fromTab="active"
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )
            ) : (
              /* ── Cleared tab ── */
              <div style={{ opacity: 0.75 }}>
                {clearedProjects.length === 0 ? (
                  <EmptyState
                    title={searchQuery ? 'No results' : 'Nothing cleared yet'}
                    subtitle={searchQuery ? 'Try a different search' : 'Mark a project as cleared once payment arrives.'}
                  />
                ) : (
                  <div role="list" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {clearedProjects.map(p => (
                      <ProjectCard
                        key={p.id} project={p} isOverdue={false}
                        isReadOnly
                        onStatusTap={() => {}}
                        onAdvanceStatus={() => {}} onRequestClear={() => {}}
                        onDeleteRequest={() => {}}
                        onArchive={() => {}}
                        fromTab="cleared"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
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
          borderRadius: '8px', height: 48, padding: '0 32px',
          cursor: 'pointer', fontSize: T.input.fontSize, fontWeight: 700,
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
      <AvatarSheet
        open={avatarOpen}
        onClose={() => { setAvatarOpen(false); setAvatarInitialView('menu'); setAvatarInstant(false); }}
        initialView={avatarInitialView}
        instant={avatarInstant}
      />

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
        confirmIcon={<CheckCircle2 size={15} />}
        onConfirm={handleConfirmClear}
      />

      {/* ── Archive confirmation modal ───────────────────── */}
      <ArchiveModal
        open={!!archiveTargetId && !!archiveTarget}
        onClose={() => setArchiveTargetId(null)}
        clientName={archiveTarget?.clientName ?? ''}
        onConfirm={() => archiveTargetId && handleArchive(archiveTargetId)}
      />

      {/* ── Delete confirmation modal ────────────────────── */}
      <DeleteModal
        open={!!deleteTargetId && !!deleteTarget}
        onClose={() => setDeleteTargetId(null)}
        clientName={deleteTarget?.clientName ?? ''}
        body="This project and all its documents will be permanently deleted. This cannot be undone."
        onDelete={handleDelete}
        onArchiveInstead={() => {
          if (deleteTargetId) handleArchive(deleteTargetId);
          setDeleteTargetId(null);
        }}
      />

    </div>
  );
}

/* ── Archive confirmation modal ─────────────────────────────── */
function ArchiveModal({
  open, onClose, clientName, onConfirm,
}: {
  open: boolean; onClose: () => void; clientName: string; onConfirm: () => void;
}) {
  const displayName = clientName.length > 24 ? clientName.slice(0, 24) + '…' : clientName;

  return (
    <Modal open={open} onClose={onClose} contentPadding="4px 20px 20px">
      {/* Icon circle */}
      <div style={{
        width: 52, height: 52, borderRadius: '50%', background: C.surface,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px',
      }}>
        <Archive size={22} color="#4B5563" strokeWidth={2} />
      </div>

      {/* Title */}
      <p style={{ fontSize: T.title.fontSize, fontWeight: 600, color: C.black, margin: '0 0 8px', lineHeight: 1.3 }}>
        Archive {displayName}?
      </p>

      {/* Body */}
      <p style={{ fontSize: '13px', fontWeight: 400, color: C.muted, margin: '0 0 24px', lineHeight: 1.6 }}>
        Hidden from your active list. Restore it anytime from your profile.
      </p>

      {/* Archive button */}
      <Btn variant="primary" fullWidth onClick={() => { onConfirm(); onClose(); }}>
        Archive
      </Btn>

      {/* Cancel */}
      <div style={{ marginTop: 4 }}>
        <Btn variant="ghost" fullWidth onClick={onClose}>
          Cancel
        </Btn>
      </div>
    </Modal>
  );
}

/* ── Empty state ────────────────────────────────────────── */
function EmptyState({
  title, subtitle, action, showGuideCards,
}: {
  title: string; subtitle: string; action?: React.ReactNode; showGuideCards?: boolean;
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
      {showGuideCards && (
        <div style={{ display: 'flex', gap: 8, marginTop: 24, width: '100%' }}>
          {['1. Add a project', '2. Send a quote', '3. Get paid'].map(label => (
            <div key={label} style={{
              flex: 1,
              background: '#F5F6F8',
              border: '1px solid #E2E5EC',
              borderRadius: '8px',
              padding: '10px 10px',
              textAlign: 'center',
            }}>
              <span style={{
                fontSize: T.label.fontSize, fontWeight: 600, color: C.muted,
                display: 'block', lineHeight: 1.4,
              }}>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const emptyActionStyle: React.CSSProperties = {
  background: C.black, color: C.white, border: `1.5px solid ${C.black}`,
  borderRadius: R.xl, height: 48, padding: '0 24px',
  cursor: 'pointer', marginTop: 8, fontSize: T.input.fontSize, fontWeight: 700,
  letterSpacing: '-0.01em', transition: 'background 150ms',
};