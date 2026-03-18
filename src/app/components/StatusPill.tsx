import React from 'react';
import { ProjectStatus } from '../types';
import { C, STATUS_FILL, T } from '../tokens';

export const STATUS_CONFIG: Record<ProjectStatus, { label: string; bg: string }> = {
  'ready':       { label: 'Quoting',     bg: STATUS_FILL['ready']       },
  'in-progress': { label: 'In progress', bg: STATUS_FILL['in-progress'] },
  'invoiced':    { label: 'Invoiced',    bg: STATUS_FILL['invoiced']    },
  'cleared':     { label: 'Cleared',     bg: STATUS_FILL['cleared']     },
  'archived':    { label: 'Archived',    bg: STATUS_FILL['archived']    },
};

interface StatusPillProps {
  status: ProjectStatus;
  interactive?: boolean;
  onClick?: () => void;
}

const pillStyle = (bg: string): React.CSSProperties => ({
  display:        'inline-flex',
  alignItems:     'center',
  justifyContent: 'center',
  backgroundColor: bg,
  color:          C.black,
  border:         `1.5px solid ${C.black}`,
  borderRadius:   '8px',
  padding:        '0 12px',
  height:         '27px',
  fontSize:       T.pill.fontSize,
  fontWeight:     700,
  letterSpacing:  '0',
  whiteSpace:     'nowrap',
  userSelect:     'none',
  lineHeight:     1,
});

export function StatusPill({ status, interactive, onClick }: StatusPillProps) {
  const { label, bg } = STATUS_CONFIG[status];

  if (interactive && onClick) {
    return (
      <button
        onClick={onClick}
        role="status"
        aria-label={`Status: ${label}. Tap to change.`}
        style={{
          display:        'inline-flex',
          alignItems:     'center',
          justifyContent: 'center',
          minHeight:      44,
          minWidth:       44,
          background:     'none',
          border:         'none',
          padding:        '0 2px',
          cursor:         'pointer',
          borderRadius:   '8px',
        }}
      >
        <span style={pillStyle(bg)}>{label}</span>
      </button>
    );
  }

  return (
    <span role="status" aria-label={`Status: ${label}`} style={pillStyle(bg)}>
      {label}
    </span>
  );
}