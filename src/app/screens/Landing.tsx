import React from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../store';
import { C, R } from '../tokens';
import { useEffect } from 'react';

export default function Landing() {
  const { hasLaunched, setHasLaunched } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (hasLaunched) navigate('/projects', { replace: true });
  }, [hasLaunched, navigate]);

  const handleStart = () => {
    setHasLaunched(true);
    navigate('/projects');
  };

  return (
    <main style={{
      background: C.black,
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 16px',
      paddingTop: 'calc(env(safe-area-inset-top, 0px) + 64px)',
      paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 40px)',
      overflowX: 'hidden',
      boxSizing: 'border-box',
    }}>
      {/* Wordmark */}
      <div>
        <span style={{ fontSize: '28px', fontWeight: 700, color: C.white, letterSpacing: '-0.03em' }}>
          Clear<span style={{ color: C.invoiced }}>.</span>
        </span>
      </div>

      {/* Hero block */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0 }}>
        <p style={{
          fontSize: '13px', fontWeight: 400, lineHeight: 1.6,
          color: 'rgba(255,255,255,0.5)', margin: '0 0 16px',
        }}>
          For freelancers who hate chasing invoices
        </p>
        <h1 style={{
          fontSize: '32px', fontWeight: 700, lineHeight: 1.1,
          letterSpacing: '-0.03em', color: C.white,
          margin: '0 0 12px', whiteSpace: 'pre-line',
        }}>
          {'Project in.\nPayment cleared.'}
        </h1>
        <p style={{
          fontSize: '15px', fontWeight: 400, lineHeight: 1.6,
          color: 'rgba(255,255,255,0.5)', margin: '0 0 40px',
        }}>
          Track projects, send quotes, get paid.
        </p>

        {/* CTA — white fill on dark bg per spec */}
        <button
          onClick={handleStart}
          style={{
            background: C.white,
            color: C.black,
            border: `1.5px solid ${C.white}`,
            borderRadius: R.xl,
            height: 48,
            padding: '0 24px',
            width: '100%',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            transition: 'opacity 150ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Get started — it's free
        </button>
      </div>

      <p style={{
        fontSize: '11px', fontWeight: 400, lineHeight: 1.5,
        color: 'rgba(255,255,255,0.3)', textAlign: 'center', margin: 0,
      }}>
        No account needed to start
      </p>
    </main>
  );
}
