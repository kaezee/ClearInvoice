import React, { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Trash2, Archive, RotateCcw } from 'lucide-react';
import { Project } from '../types';
import { C, T, R, STATUS_FILL, formatAmount, formatDate } from '../tokens';
import { StatusPill, STATUS_CONFIG } from './StatusPill';
import { ProjectStatus } from '../types';

const STATUS_ORDER: ProjectStatus[] = ['ready', 'in-progress', 'invoiced', 'cleared'];

// How far left to drag before the action buttons snap open
const LEFT_THRESHOLD  = 64;
// Width of the revealed action area
const REVEAL_W        = 136;

interface ProjectCardProps {
  project: Project;
  isOverdue: boolean;
  onStatusTap: () => void;
  onAdvanceStatus: () => void;
  onRequestClear: () => void;  // called instead of onAdvanceStatus when next status = cleared
  onDeleteRequest: () => void;
  onArchive: () => void;
  onRestore?: () => void; // If provided: show Restore instead of Archive
}

export function ProjectCard({
  project, isOverdue, onStatusTap, onAdvanceStatus, onRequestClear,
  onDeleteRequest, onArchive, onRestore,
}: ProjectCardProps) {
  const navigate  = useNavigate();
  const cardRef   = useRef<HTMLDivElement>(null);

  const [offsetX, setOffsetX]           = useState(0);
  const [revealed, setRevealed]         = useState(false);
  const [snapping, setSnapping]         = useState(false);
  const [dragging, setDragging]         = useState(false);
  const [justAdvanced, setJustAdvanced] = useState(false);

  // Ref mirrors for values that must be read reliably inside event handlers
  // (React state is stale in pointer handlers during rapid gesture sequences)
  const offsetXRef  = useRef(0);
  const revealedRef = useRef(false);

  const startX    = useRef<number | null>(null);
  const startY    = useRef<number | null>(null);
  const didDrag   = useRef(false);

  const isTerminal = project.status === 'cleared' || project.status === 'archived';

  // next status in the pipeline
  const currentIdx = STATUS_ORDER.indexOf(project.status as ProjectStatus);
  const nextStatus = !isTerminal ? STATUS_ORDER[currentIdx + 1] : null;
  const nextLabel  = nextStatus ? STATUS_CONFIG[nextStatus]?.label : null;

  // 80% of card width is the commit threshold for advancing status
  const getRightThreshold = () => (cardRef.current?.offsetWidth ?? 400) * 0.8;

  /* ─── snap helpers ───────────────────────────────────── */
  const snapTo = useCallback((x: number) => {
    offsetXRef.current = x;
    setSnapping(true);
    setDragging(false);
    setOffsetX(x);
  }, []);

  const collapse = useCallback(() => {
    revealedRef.current = false;
    snapTo(0);
    setRevealed(false);
  }, [snapTo]);

  /* ─── pointer handlers ────────────────────────────────── */
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if ((e.target as HTMLElement).closest('button')) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    startX.current  = e.clientX;
    startY.current  = e.clientY;
    didDrag.current = false;
    setSnapping(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (startX.current === null) return;

    const dx = e.clientX - startX.current;
    const dy = e.clientY - (startY.current ?? 0);

    if (!didDrag.current && Math.abs(dy) > Math.abs(dx) && Math.abs(dx) < 6) return;
    if (Math.abs(dx) > 5) {
      didDrag.current = true;
      setDragging(true);
    }
    if (!didDrag.current) return;

    if (revealedRef.current) {
      // While revealed: right drag collapses, left is clamped at REVEAL_W
      const next = Math.min(0, Math.max(-REVEAL_W + dx, -REVEAL_W));
      offsetXRef.current = next;
      setOffsetX(next);
      return;
    }

    if (dx > 0 && !isTerminal) {
      const val = Math.min(dx, getRightThreshold() + 24);
      offsetXRef.current = val;
      setOffsetX(val);
    } else if (dx < 0) {
      const val = Math.max(dx, -REVEAL_W);
      offsetXRef.current = val;
      setOffsetX(val);
    }
  };

  const handlePointerUp = () => {
    if (startX.current === null) return;
    startX.current = null;

    const cur = offsetXRef.current; // always current, never stale

    if (revealedRef.current) {
      if (didDrag.current) {
        // Dragged right far enough → collapse; otherwise snap back open
        cur > -LEFT_THRESHOLD ? collapse() : snapTo(-REVEAL_W);
      }
      // Pure tap while revealed → let handleClick decide (collapse on tap)
      return;
    }

    const rightThreshold = getRightThreshold();

    if (cur >= rightThreshold) {
      snapTo(0);
      if (nextStatus === 'cleared') {
        onRequestClear();
      } else {
        onAdvanceStatus();
        setJustAdvanced(true);
        setTimeout(() => setJustAdvanced(false), 600);
      }
    } else if (cur <= -LEFT_THRESHOLD) {
      // Lock open — stays until user taps a button or swipes back right
      snapTo(-REVEAL_W);
      revealedRef.current = true;
      setRevealed(true);
    } else {
      snapTo(0);
    }
  };

  const handlePointerCancel = () => {
    startX.current = null;
    snapTo(revealedRef.current ? -REVEAL_W : 0);
  };

  /* ─── click (tap, not drag) ──────────────────────────── */
  const handleClick = (e: React.MouseEvent) => {
    if (revealedRef.current) {
      // Pure tap on card body while revealed → close
      if (!didDrag.current) collapse();
      return;
    }
    if (didDrag.current) return;
    navigate(`/projects/${project.id}`);
  };

  /* ─── derived visual state ───────────────────────────── */
  const swipingRight   = offsetX > 0;
  const swipingLeft    = offsetX < 0;
  const cardWidth      = cardRef.current?.offsetWidth ?? 400;
  const rightThreshold = cardWidth * 0.8;
  const rightProgress  = Math.min(offsetX / rightThreshold, 1);
  const leftProgress   = Math.min(-offsetX / LEFT_THRESHOLD, 1);

  // CMY colour of the destination status
  const revealBg = nextStatus ? STATUS_FILL[nextStatus] : C.cleared;

  const transition = snapping
    ? 'transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1)'
    : 'none';

  return (
    <div
      ref={cardRef}
      role="listitem"
      aria-label={`${project.clientName}, ${project.type}, ${formatAmount(project.amount, project.currency)}, ${project.status}`}
      style={{
        position: 'relative',
        borderRadius: R.xl,
        overflow: 'hidden',
        userSelect: 'none',
        background: C.card,
      }}
    >
      {/* ── Right reveal: destination-status CMY colour ──── */}
      {!isTerminal && (
        <div style={{
          position: 'absolute', inset: 0,
          background: revealBg,
          borderRadius: R.xl,
          display: 'flex', alignItems: 'center',
          paddingLeft: 20, gap: 10,
          opacity: swipingRight ? 1 : 0,
          transition: 'opacity 60ms',
          pointerEvents: 'none',
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: `rgba(10,10,10,${0.06 + rightProgress * 0.12})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: `scale(${0.75 + rightProgress * 0.3})`,
            transition: 'transform 60ms',
          }}>
            <ArrowRight size={18} color={C.black} strokeWidth={2.5} />
          </div>
          {nextLabel && (
            <span style={{
              fontSize: '11px', fontWeight: 700, color: C.black,
              opacity: rightProgress > 0.6 ? (rightProgress - 0.6) * 2.5 : 0,
              letterSpacing: '0.02em',
            }}>
              → {nextLabel}
            </span>
          )}
          {/* Progress track */}
          <div style={{
            position: 'absolute', bottom: 6, left: 20, right: 20,
            height: 2, borderRadius: 1, background: 'rgba(10,10,10,0.12)',
          }}>
            <div style={{
              height: '100%', borderRadius: 1,
              background: C.black,
              width: `${Math.min(rightProgress * 100, 100)}%`,
              transition: 'width 40ms linear',
            }} />
          </div>
        </div>
      )}

      {/* ── Left reveal: archive/restore + delete buttons ─── */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: REVEAL_W,
        display: 'flex',
        borderRadius: `0 ${R.xl} ${R.xl} 0`,
        overflow: 'hidden',
        opacity: swipingLeft || revealed ? 1 : 0,
        transition: 'opacity 60ms',
      }}>
        <button
          onPointerDown={e => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); collapse(); onRestore ? onRestore() : onArchive(); }}
          style={{
            flex: 1, minWidth: 72, border: 'none', cursor: 'pointer',
            background: '#FFFFFF',
            borderTop: '1px solid #E2E5EC',
            borderBottom: '1px solid #E2E5EC',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 5,
            color: '#4B5563',
            transition: 'background 150ms ease-in-out, transform 150ms ease-in-out',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F0F0F0'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.transform = 'scale(1)'; }}
          onPointerUp={e => { e.currentTarget.style.background = '#F0F0F0'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {onRestore
            ? <RotateCcw size={20} strokeWidth={2} />
            : <Archive size={20} strokeWidth={2} />}
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.02em' }}>
            {onRestore ? 'Restore' : 'Archive'}
          </span>
        </button>

        <button
          onPointerDown={e => { e.stopPropagation(); e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.transform = 'scale(0.98)'; }}
          onClick={(e) => { e.stopPropagation(); collapse(); onDeleteRequest(); }}
          style={{
            flex: 1, minWidth: 72, border: 'none', cursor: 'pointer',
            background: '#FFFFFF',
            borderTop: '1px solid #E2E5EC',
            borderBottom: '1px solid #E2E5EC',
            borderLeft: '1px solid #E2E5EC',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 5,
            color: '#DC2626',
            transition: 'background 150ms ease-in-out, transform 150ms ease-in-out',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.transform = 'scale(1)'; }}
          onPointerUp={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Trash2 size={20} strokeWidth={2} />
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.02em' }}>Delete</span>
        </button>
      </div>

      {/* ── Main card ─────────────────────────────────────── */}
      <div
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition,
          background: justAdvanced ? '#f0fdf4' : C.card,
          borderTop:    `1px solid ${justAdvanced ? C.green : revealed ? C.borderStrong : C.border}`,
          borderRight:  `1px solid ${justAdvanced ? C.green : revealed ? C.borderStrong : C.border}`,
          borderBottom: `1px solid ${justAdvanced ? C.green : revealed ? C.borderStrong : C.border}`,
          borderLeft:   isOverdue && !justAdvanced
            ? `3px solid ${C.yellow}`
            : `1px solid ${justAdvanced ? C.green : revealed ? C.borderStrong : C.border}`,
          borderRadius: R.xl,
          padding: '20px 20px 20px 20px',
          cursor: dragging ? 'grabbing' : 'pointer',
          position: 'relative',
          zIndex: 1,
          touchAction: 'pan-y',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>

          {/* ── Left column: Name / Status / Category ─── */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {/* Client name */}
            <span style={{
              ...T.base, fontWeight: 600, color: C.black,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {project.clientName}
            </span>

            {/* Status pill */}
            <div onClick={(e) => e.stopPropagation()}>
              <StatusPill status={project.status} interactive onClick={onStatusTap} />
            </div>

            {/* Category tags — locked spec, max 3 visible + "+N" overflow */}
            {(() => {
              const tags = project.categories?.length
                ? project.categories
                : project.type
                ? [project.type]
                : [];
              const visible = tags.slice(0, 3);
              const overflow = tags.length - visible.length;
              return (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {visible.map(tag => (
                    <span key={tag} style={{
                      display: 'inline-block',
                      background: '#F0F0F0',
                      border: '1.5px solid #C4C4C4',
                      borderRadius: 16,
                      padding: '4px 12px',
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#6B6B6B',
                      whiteSpace: 'nowrap',
                    }}>
                      {tag}
                    </span>
                  ))}
                  {overflow > 0 && (
                    <span style={{
                      display: 'inline-block',
                      background: '#F0F0F0',
                      border: '1.5px solid #C4C4C4',
                      borderRadius: 16,
                      padding: '4px 12px',
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#7A8099',
                      whiteSpace: 'nowrap',
                    }}>
                      +{overflow}
                    </span>
                  )}
                </div>
              );
            })()}
          </div>

          {/* ── Right column: Modifier badge / Due text / Amount ── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
            {/* Modifier badge (Overdue) or spacer */}
            {isOverdue ? (
              <span style={{
                fontSize: '10px', fontWeight: 700, color: C.black,
                background: C.yellow, padding: '3px 10px', borderRadius: R.pill,
                letterSpacing: '0.01em',
              }}>
                Overdue
              </span>
            ) : (
              <span style={{ height: 22 }} />
            )}

            {/* Modifier text / due date */}
            <OverdueLine project={project} isOverdue={isOverdue} />

            {/* Amount */}
            <span style={{ ...T.base, fontSize: '18px', fontWeight: 600, color: C.black, marginTop: 4 }}>
              {formatAmount(project.amount, project.currency)}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Helper: right-column date line ──────────────────────── */
function OverdueLine({ project, isOverdue }: { project: Project; isOverdue: boolean }) {

  // ── QUOTING stage modifier ────────────────────────────────
  if (project.status === 'ready') {
    const today = new Date().toISOString().split('T')[0];
    const isExpired = !!(project.expiryDate && project.expiryDate < today);

    if (!project.sentAt) {
      return <span style={{ fontSize: '12px', fontWeight: 500, color: '#7A8099' }}>Draft · not sent</span>;
    }
    if (isExpired) {
      const days = Math.floor((Date.now() - new Date(project.expiryDate!).getTime()) / 86_400_000);
      return <span style={{ fontSize: '12px', fontWeight: 500, color: '#7A5000' }}>Expired {days}d ago</span>;
    }
    if (project.viewedAt) {
      const ms = Date.now() - new Date(project.viewedAt).getTime();
      const hours = Math.floor(ms / 3_600_000);
      if (hours < 1) return <span style={{ fontSize: '12px', fontWeight: 500, color: '#00A3B5' }}>Viewed just now</span>;
      if (hours < 24) return <span style={{ fontSize: '12px', fontWeight: 500, color: '#00A3B5' }}>Viewed {hours}h ago</span>;
      return <span style={{ fontSize: '12px', fontWeight: 500, color: '#00A3B5' }}>Viewed {Math.floor(hours/24)}d ago</span>;
    }
    return <span style={{ fontSize: '12px', fontWeight: 500, color: '#7A8099' }}>Sent · not viewed</span>;
  }

  // ── INVOICED stage modifier ───────────────────────────────
  if (project.status === 'invoiced') {
    // Reminder takes priority over overdue for the text label
    if (project.remindedAt) {
      const days = Math.floor((Date.now() - new Date(project.remindedAt).getTime()) / 86_400_000);
      const label = days < 1 ? 'Reminder sent today' : `Reminder sent ${days}d ago`;
      return <span style={{ fontSize: '12px', fontWeight: 500, color: '#7A8099' }}>{label}</span>;
    }
    if (isOverdue) {
      const days = Math.floor((Date.now() - new Date(project.dueDate!).getTime()) / 86_400_000);
      if (project.invoiceViewedAt) {
        return <span style={{ fontSize: '12px', fontWeight: 500, color: '#7A5000' }}>Viewed · {days}d overdue</span>;
      }
      return <span style={{ fontSize: '12px', fontWeight: 500, color: '#7A5000' }}>Not viewed · {days}d overdue</span>;
    }
    if (!project.invoiceSentAt) {
      return <span style={{ fontSize: '12px', fontWeight: 500, color: '#7A8099' }}>Draft · not sent</span>;
    }
    if (project.invoiceViewedAt) {
      const ms = Date.now() - new Date(project.invoiceViewedAt).getTime();
      const hours = Math.floor(ms / 3_600_000);
      if (hours < 1) return <span style={{ fontSize: '12px', fontWeight: 500, color: '#00A3B5' }}>Viewed just now</span>;
      if (hours < 24) return <span style={{ fontSize: '12px', fontWeight: 500, color: '#00A3B5' }}>Viewed {hours}h ago</span>;
      return <span style={{ fontSize: '12px', fontWeight: 500, color: '#00A3B5' }}>Viewed {Math.floor(hours/24)}d ago</span>;
    }
    return <span style={{ fontSize: '12px', fontWeight: 500, color: '#7A8099' }}>Sent · not viewed</span>;
  }

  // ── IN PROGRESS — show due date ───────────────────────────
  if (project.status === 'in-progress' && project.dueDate) {
    return (
      <span style={{ fontSize: '12px', color: C.muted, fontWeight: 400 }}>
        Due {formatDate(project.dueDate, 'short')}
      </span>
    );
  }

  return null;
}