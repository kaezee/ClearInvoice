import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowRight, Trash2, Archive, RotateCcw } from 'lucide-react';
import { Project } from '../types';
import { C, T, R, STATUS_FILL, formatAmount, formatDate } from '../tokens';
import { StatusPill, STATUS_CONFIG } from './StatusPill';
import { ProjectStatus } from '../types';

const STATUS_ORDER: ProjectStatus[] = ['ready', 'in-progress', 'invoiced', 'cleared'];

// How far left to drag before the action buttons snap open (% of card width)
const LEFT_THRESHOLD_PCT = 0.15;
// Width of the revealed action area (% of card width) — 20% per button × 2
const REVEAL_PCT = 0.40;

interface ProjectCardProps {
  project: Project;
  isOverdue: boolean;
  onStatusTap: () => void;
  onAdvanceStatus: () => void;
  onRequestClear: () => void;  // called instead of onAdvanceStatus when next status = cleared
  onDeleteRequest: () => void;
  onArchive: () => void;
  onRestore?: () => void; // If provided: show Restore instead of Archive
  isReadOnly?: boolean;  // Cleared tab: no swipe, no actions
  /** Which tab the card lives in — passed through to ProjectDetail so back works correctly */
  fromTab?: 'active' | 'cleared';
  /** Override card-tap navigation entirely (used by ArchivedContent inside AvatarSheet) */
  onCardClick?: (id: string) => void;
}

export function ProjectCard({
  project, isOverdue, onStatusTap, onAdvanceStatus, onRequestClear,
  onDeleteRequest, onArchive, onRestore, isReadOnly, fromTab, onCardClick,
}: ProjectCardProps) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const cardRef   = useRef<HTMLDivElement>(null);

  const [offsetX, setOffsetX]           = useState(0);
  const [revealed, setRevealed]         = useState(false);
  const [snapping, setSnapping]         = useState(false);
  const [dragging, setDragging]         = useState(false);
  const [justAdvanced, setJustAdvanced] = useState(false);
  // Instant visual feedback on tap — works even for isReadOnly (cleared) cards
  const [pressed, setPressed]           = useState(false);

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
  const getRevealW        = () => (cardRef.current?.offsetWidth ?? 320) * REVEAL_PCT;
  const getLeftThreshold  = () => (cardRef.current?.offsetWidth ?? 320) * LEFT_THRESHOLD_PCT;

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
    setPressed(true);                                          // instant feedback for all cards
    if (isReadOnly) return;                                    // cleared: no swipe at all
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

    const revealW = getRevealW();

    if (revealedRef.current) {
      const next = Math.min(0, Math.max(-revealW + dx, -revealW));
      offsetXRef.current = next;
      setOffsetX(next);
      return;
    }

    if (dx > 0 && !isTerminal) {
      const val = Math.min(dx, getRightThreshold() + 24);
      offsetXRef.current = val;
      setOffsetX(val);
    } else if (dx < 0) {
      const val = Math.max(dx, -revealW);
      offsetXRef.current = val;
      setOffsetX(val);
    }
  };

  const handlePointerUp = () => {
    setPressed(false);
    if (startX.current === null) return;
    startX.current = null;

    const cur        = offsetXRef.current;
    const revealW    = getRevealW();
    const leftThresh = getLeftThreshold();
    const rightThreshold = getRightThreshold();

    if (revealedRef.current) {
      if (didDrag.current) {
        cur > -leftThresh ? collapse() : snapTo(-revealW);
      }
      return;
    }

    if (cur >= rightThreshold) {
      snapTo(0);
      if (nextStatus === 'cleared') {
        onRequestClear();
      } else {
        onAdvanceStatus();
        setJustAdvanced(true);
        setTimeout(() => setJustAdvanced(false), 600);
      }
    } else if (cur <= -leftThresh) {
      snapTo(-revealW);
      revealedRef.current = true;
      setRevealed(true);
    } else {
      snapTo(0);
    }
  };

  const handlePointerCancel = () => {
    setPressed(false);
    startX.current = null;
    snapTo(revealedRef.current ? -getRevealW() : 0);
  };

  /* ─── click (tap, not drag) ──────────────────────────── */
  const handleClick = (e: React.MouseEvent) => {
    if (revealedRef.current) {
      if (!didDrag.current) collapse();
      return;
    }
    if (didDrag.current) return;
    if (onCardClick) {
      onCardClick(project.id);
    } else {
      navigate(`/projects/${project.id}`, {
        state: {
          from: location.pathname,
          ...(fromTab ? { tab: fromTab } : {}),
        },
      });
    }
  };

  /* ─── derived visual state ───────────────────────────── */
  const swipingRight   = offsetX > 0;
  const swipingLeft    = offsetX < 0;
  const cardWidth      = cardRef.current?.offsetWidth ?? 400;
  const revealW        = cardWidth * REVEAL_PCT;
  const rightThreshold = cardWidth * 0.8;
  const rightProgress  = Math.min(offsetX / rightThreshold, 1);

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
        borderRadius: '8px',
        overflow: 'hidden',
        userSelect: 'none',
        touchAction: 'manipulation',  // eliminates 300ms tap-delay on all cards
        background: C.card,
      }}
    >
      {/* ── Right reveal: destination-status CMY colour ──── */}
      {!isTerminal && !isReadOnly && (
        <div style={{
          position: 'absolute', inset: 0,
          background: revealBg,
          borderRadius: '8px',
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
              {nextLabel}
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
      {!isReadOnly && (
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0,
          width: revealW,
          display: 'flex',
          borderRadius: '0 8px 8px 0',
          overflow: 'hidden',
          opacity: swipingLeft || revealed ? 1 : 0,
          transition: 'opacity 60ms',
        }}>
          <RevealButton
            icon={onRestore ? <RotateCcw size={20} strokeWidth={2} /> : <Archive size={20} strokeWidth={2} />}
            label={onRestore ? 'Restore' : 'Archive'}
            iconColor={C.muted}
            hoverBg={C.surface}
            activeBg={C.border}
            dividerRight
            onPointerDownCapture={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); collapse(); onRestore ? onRestore() : onArchive(); }}
          />
          <RevealButton
            icon={<Trash2 size={20} strokeWidth={2} />}
            label="Delete"
            iconColor={C.danger}
            hoverBg={C.dangerLight}
            activeBg={C.dangerLight}
            onPointerDownCapture={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); collapse(); onDeleteRequest(); }}
          />
        </div>
      )}

      {/* ── Main card ─────────────────────────────────────── */}
      <div
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: pressed && isReadOnly ? 'background 60ms' : transition,
          background: justAdvanced ? C.greenLight : pressed && isReadOnly ? C.border : C.card,
          borderTop:    `1px solid ${justAdvanced ? C.green : revealed ? C.borderStrong : C.border}`,
          borderRight:  `1px solid ${justAdvanced ? C.green : revealed ? C.borderStrong : C.border}`,
          borderBottom: `1px solid ${justAdvanced ? C.green : revealed ? C.borderStrong : C.border}`,
          borderLeft:   isOverdue && !justAdvanced
            ? `3px solid ${C.yellow}`
            : `1px solid ${justAdvanced ? C.green : revealed ? C.borderStrong : C.border}`,
          borderRadius: '8px',
          padding: isReadOnly ? '10px 16px' : '16px',
          cursor: dragging ? 'grabbing' : 'pointer',
          position: 'relative',
          zIndex: 1,
          touchAction: 'pan-y',
        }}
      >
        {/* ── Three-row card layout ─────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isReadOnly ? 6 : 8 }}>

          {/* Row 1: Client name (left) + Modifier text (right) */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
            <span style={{
              fontSize: '15px', fontWeight: 600, color: C.black,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              flex: 1, minWidth: 0,
            }}>
              {project.clientName}
            </span>
            <ModifierText project={project} isOverdue={isOverdue} />
          </div>

          {/* Row 2: Status pill only */}
          <div onClick={(e) => e.stopPropagation()}>
            <StatusPill status={project.status} interactive onClick={onStatusTap} />
          </div>

          {/* Row 3: Category text (left) + Amount (right) */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
            <span style={{
              fontSize: T.pill.fontSize, fontWeight: 400, color: C.muted,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              flex: 1, minWidth: 0,
            }}>
              {(() => {
                let all: string[];
                if (project.services?.length) {
                  all = project.services.map(s => s.name);
                } else if (project.categories?.length) {
                  all = project.categories;
                } else if (project.type) {
                  all = [project.type];
                } else {
                  all = [];
                }
                const visible = all.slice(0, 2);
                const overflow = all.length - visible.length;
                return overflow > 0
                  ? `${visible.join(', ')} +${overflow} more`
                  : visible.join(', ');
              })()}
            </span>
            <span style={{ fontSize: T.lg.fontSize, fontWeight: 600, color: C.black, flexShrink: 0 }}>
              {formatAmount(project.amount, project.currency)}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Modifier text — Row 1 right, time-sensitive info ──────── */
function ModifierText({ project, isOverdue }: { project: Project; isOverdue: boolean }) {
  const s: React.CSSProperties = { fontSize: T.pill.fontSize, fontWeight: 400, flexShrink: 0, whiteSpace: 'nowrap' };

  // ── CLEARED ───────────────────────────────────────────────
  if (project.status === 'cleared') {
    const date = project.paidAt
      ? formatDate(project.paidAt, 'short')
      : null;
    return (
      <span style={{ ...s, color: C.greenText }}>
        {date ? `Paid ${date}` : 'Paid'}
      </span>
    );
  }

  // ── QUOTING ───────────────────────────────────────────────
  if (project.status === 'ready') {
    const today = new Date().toISOString().split('T')[0];
    const isExpired = !!(project.expiryDate && project.expiryDate < today);
    const isRevised = (project.quoteRevisions?.length ?? 0) > 0 && !project.sentAt;

    if (isRevised) {
      return <span style={{ ...s, color: C.amberText }}>Quote revised · not sent</span>;
    }
    if (!project.sentAt) {
      return <span style={{ ...s, color: C.muted }}>Draft · not sent</span>;
    }
    if (isExpired) {
      const days = Math.floor((Date.now() - new Date(project.expiryDate!).getTime()) / 86_400_000);
      return <span style={{ ...s, color: C.amberText }}>Expired {days}d ago</span>;
    }
    if (project.viewedAt) {
      const ms = Date.now() - new Date(project.viewedAt).getTime();
      const hours = Math.floor(ms / 3_600_000);
      if (hours < 1)  return <span style={{ ...s, color: C.teal }}>Viewed just now</span>;
      if (hours < 24) return <span style={{ ...s, color: C.teal }}>Viewed {hours}h ago</span>;
      return <span style={{ ...s, color: C.teal }}>Viewed {Math.floor(hours / 24)}d ago</span>;
    }
    return <span style={{ ...s, color: C.muted }}>Sent · not viewed</span>;
  }

  // ── INVOICED ──────────────────────────────────────────────
  if (project.status === 'invoiced') {
    if (project.remindedAt) {
      const days = Math.floor((Date.now() - new Date(project.remindedAt).getTime()) / 86_400_000);
      const label = days < 1 ? 'Reminder sent today' : `Reminder sent ${days}d ago`;
      return <span style={{ ...s, color: C.muted }}>{label}</span>;
    }
    if (isOverdue) {
      const days = Math.floor((Date.now() - new Date(project.dueDate!).getTime()) / 86_400_000);
      return project.invoiceViewedAt
        ? <span style={{ ...s, color: C.amberText }}>Viewed · {days}d overdue</span>
        : <span style={{ ...s, color: C.amberText }}>Not viewed · {days}d overdue</span>;
    }
    if (!project.invoiceSentAt) {
      return <span style={{ ...s, color: C.muted }}>Draft · not sent</span>;
    }
    if (project.invoiceViewedAt) {
      const ms = Date.now() - new Date(project.invoiceViewedAt).getTime();
      const hours = Math.floor(ms / 3_600_000);
      if (hours < 1)  return <span style={{ ...s, color: C.teal }}>Viewed just now</span>;
      if (hours < 24) return <span style={{ ...s, color: C.teal }}>Viewed {hours}h ago</span>;
      return <span style={{ ...s, color: C.teal }}>Viewed {Math.floor(hours / 24)}d ago</span>;
    }
    return <span style={{ ...s, color: C.muted }}>Sent · not viewed</span>;
  }

  // ── IN PROGRESS ───────────────────────────────────────────
  if (project.status === 'in-progress' && project.dueDate) {
    return <span style={{ ...s, color: C.muted }}>Due {formatDate(project.dueDate, 'short')}</span>;
  }

  return null;
}

/* ── Reveal button ──────────────────────────────────────── */
function RevealButton({
  icon, label, subLabel, iconColor, subLabelColor, hoverBg, activeBg, dividerRight,
  onPointerDownCapture, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  subLabel?: string;
  iconColor: string;
  subLabelColor?: string;
  hoverBg: string;
  activeBg: string;
  dividerRight?: boolean;
  onPointerDownCapture?: (e: React.PointerEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const bg = pressed ? activeBg : hovered ? hoverBg : '#FFFFFF';

  return (
    <button
      onPointerDownCapture={onPointerDownCapture}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => { setHovered(false); setPressed(false); }}
      onPointerDown={e => { e.stopPropagation(); setPressed(true); }}
      onPointerUp={() => setPressed(false)}
      style={{
        flex: 1,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        borderLeft: 'none',
        borderRight: dividerRight ? `1px solid ${C.border}` : 'none',
        cursor: 'pointer',
        background: bg,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 6,
        padding: '0 12px',
        color: iconColor,
        transform: pressed ? 'scale(0.93)' : 'scale(1)',
        transition: 'background 120ms ease-in-out, transform 120ms ease-in-out',
      }}
    >
      {icon}
      <span style={{ fontSize: T.xs.fontSize, fontWeight: 600, letterSpacing: '0.02em' }}>
        {label}
      </span>
      {subLabel && (
        <span style={{ fontSize: '9px', fontWeight: 400, color: subLabelColor ?? C.muted, letterSpacing: '0.01em' }}>
          {subLabel}
        </span>
      )}
    </button>
  );
}