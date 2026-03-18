import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DarkNavBtn } from '../components/ui/CircleIconBtn';
import { C } from '../tokens';

const FAQS: { q: string; a: string }[] = [
  {
    q: 'How do I send a quote?',
    a: 'Open a project and scroll to the Quote section. Tap Generate quote, review the details, then tap Send quote to copy a shareable link.',
  },
  {
    q: 'How do I mark a project as cleared?',
    a: 'Once payment arrives, open the project and tap Mark as cleared. The project moves to your Cleared tab permanently.',
  },
  {
    q: 'How do I add my bank details?',
    a: 'Tap your avatar → Invoice defaults → Payment defaults. Add your details in Default payment notes. They appear on every invoice automatically.',
  },
];

export default function Help() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div style={{
      minHeight: '100dvh',
      background: C.surface,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    }}>
      {/* Top bar */}
      <nav style={{
        background: C.black,
        padding: `calc(env(safe-area-inset-top, 0px) + 14px) 16px 12px`,
        display: 'flex', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 10, flexShrink: 0,
      }}>
        {/* ‹ Dark context back — 20px icon, 44×44 circle */}
        <DarkNavBtn onClick={() => navigate(-1)} ariaLabel="Go back">
          <ChevronLeft size={20} strokeWidth={2.5} />
        </DarkNavBtn>
        <span style={{
          fontSize: '15px', fontWeight: 600, color: C.white,
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        }}>
          Help
        </span>
      </nav>

      {/* FAQ list */}
      <div style={{ padding: '16px 16px 40px' }}>
        <div style={{
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          {FAQS.map((faq, i) => {
            const open = expanded === i;
            const isLast = i === FAQS.length - 1;
            return (
              <div key={i} style={{ borderBottom: isLast ? 'none' : `1px solid ${C.border}` }}>
                {/* Question row */}
                <button
                  onClick={() => setExpanded(open ? null : i)}
                  style={{
                    width: '100%', minHeight: 52,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 16px', gap: 12,
                    background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#0A0A0A', lineHeight: 1.5 }}>
                    {faq.q}
                  </span>
                  <ChevronRight
                    size={16}
                    color={C.muted}
                    strokeWidth={2}
                    style={{
                      flexShrink: 0,
                      transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 200ms ease-in-out',
                    }}
                  />
                </button>

                {/* Answer */}
                <div style={{
                  maxHeight: open ? 200 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 220ms ease-in-out',
                }}>
                  <div style={{
                    padding: '12px 16px',
                    borderTop: `1px solid ${C.border}`,
                  }}>
                    <p style={{
                      fontSize: '13px', fontWeight: 400, color: '#7A8099',
                      lineHeight: 1.6, margin: 0,
                    }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
