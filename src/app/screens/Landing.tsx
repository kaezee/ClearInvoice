import React from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../store';
import { C, T } from '../tokens';
import { useEffect } from 'react';

const ClearLogo = ({ height = 26 }: { height?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400.54 111.02" height={height} fill="#FFFFFF" style={{ display: 'block' }}>
    <path d="m32.05,18.71c5.21-3.37,11.45-5.06,18.71-5.06,8.18,0,14.62,1.89,19.32,5.67,4.7,3.78,7.82,8.84,9.35,15.18h17.02c-2.05-10.94-7.03-19.42-14.95-25.46C73.58,3.02,63.38,0,50.91,0c-10.43,0-19.47,2.33-27.14,6.98-7.67,4.65-13.55,11.17-17.63,19.55C2.04,34.91,0,44.57,0,55.51s2.04,20.73,6.13,29.06c4.09,8.33,9.97,14.82,17.63,19.48,7.67,4.65,16.71,6.98,27.14,6.98,12.47,0,22.67-2.99,30.59-8.97,7.92-5.98,12.91-14.28,14.95-24.92h-17.02c-1.53,6.24-4.65,11.17-9.35,14.8-4.7,3.63-11.14,5.44-19.32,5.44-7.26,0-13.49-1.66-18.71-4.98-5.21-3.32-9.25-8.13-12.11-14.41-2.86-6.29-4.29-13.78-4.29-22.47s1.43-16.15,4.29-22.39c2.86-6.23,6.9-11.04,12.11-14.41Z"/>
    <polygon fill="#00c2cc" points="205.28 2.96 120.82 83.76 121.6 42.78 106.27 31.41 107.18 109.18 117.11 109.18 223.02 1.87 205.28 2.96"/>
    <path d="m251.18,35.12c-5.42-3.37-11.91-5.06-19.48-5.06s-14.24,1.71-20.01,5.14c-5.78,3.43-10.22,8.18-13.34,14.26-3.12,6.08-4.68,13.16-4.68,21.24s1.61,15.13,4.83,21.16c3.22,6.03,7.67,10.73,13.34,14.11,5.67,3.37,12.19,5.06,19.55,5.06,6.13,0,11.5-1.07,16.1-3.22,4.6-2.15,8.48-5.08,11.66-8.82,3.17-3.73,5.42-7.95,6.75-12.65h-15.33c-1.43,3.68-3.76,6.59-6.98,8.74-3.22,2.15-7.28,3.22-12.19,3.22-4.19,0-8-1.02-11.42-3.07-3.43-2.04-6.16-5.01-8.2-8.89-1.78-3.38-2.74-7.5-2.97-12.27h58.94c.2-1.33.31-2.61.31-3.83v-3.37c0-6.75-1.46-12.88-4.37-18.4-2.91-5.52-7.08-9.97-12.5-13.34Zm-42.23,28.22c.41-3.64,1.34-6.79,2.82-9.43,2.04-3.63,4.8-6.39,8.28-8.28,3.47-1.89,7.31-2.84,11.5-2.84,5.93,0,10.89,1.84,14.87,5.52,3.99,3.68,6.13,8.69,6.44,15.03h-43.92Z"/>
    <path d="m331.38,33.89c-4.91-2.55-10.99-3.83-18.25-3.83-5.52,0-10.73,1.02-15.64,3.07-4.91,2.05-8.92,5.01-12.04,8.89-3.12,3.89-4.98,8.59-5.6,14.11h15.33c.82-4.5,2.86-7.85,6.13-10.04,3.27-2.2,7.21-3.3,11.81-3.3,3.99,0,7.28.77,9.89,2.3,2.61,1.53,4.57,3.78,5.9,6.75,1.33,2.97,1.99,6.7,1.99,11.19h-19.94c-6.95,0-12.88.97-17.79,2.91-4.91,1.94-8.69,4.73-11.35,8.36-2.66,3.63-3.99,7.95-3.99,12.96,0,4.29,1.02,8.26,3.07,11.88,2.04,3.63,5.16,6.52,9.35,8.66,4.19,2.15,9.45,3.22,15.79,3.22,3.37,0,6.39-.38,9.05-1.15,2.66-.77,5.03-1.81,7.13-3.14,2.09-1.33,3.93-2.91,5.52-4.75,1.58-1.84,2.89-3.78,3.91-5.83l1.23,13.03h13.34v-47.84c0-6.44-1.25-11.99-3.76-16.64-2.51-4.65-6.21-8.25-11.12-10.81Zm-.61,40.33c-.1,3.17-.67,6.19-1.69,9.05-1.02,2.86-2.48,5.47-4.37,7.82-1.89,2.35-4.17,4.19-6.82,5.52-2.66,1.33-5.62,1.99-8.89,1.99-3.07,0-5.75-.51-8.05-1.53-2.3-1.02-4.04-2.45-5.21-4.29-1.18-1.84-1.76-3.99-1.76-6.44s.61-4.62,1.84-6.52c1.23-1.89,3.19-3.35,5.9-4.37,2.71-1.02,6.31-1.53,10.81-1.53h18.25v.31Z"/>
    <path d="m387.74,32.05c-3.83,1.33-7.11,3.2-9.81,5.6-2.71,2.4-4.98,5.34-6.82,8.82l-1.23-14.57h-13.8v77.29h15.34v-38.49c0-4.8.64-8.76,1.92-11.88,1.28-3.12,2.99-5.6,5.14-7.44,2.15-1.84,4.65-3.17,7.51-3.99,2.86-.82,5.88-1.23,9.05-1.23h5.52v-16.1c-4.7,0-8.97.67-12.8,1.99Z"/>
    <rect fill="#ffd600" x="381.03" y="94.88" width="14.3" height="14.3"/>
  </svg>
);

export default function Landing() {
  const { hasLaunched, setHasLaunched } = useApp();
  const navigate = useNavigate();

  // No auto-redirect — landing is always visible so the onboarding flow
  // is reachable. "Sign in" link takes returning users straight to projects.

  const handleStart = () => {
    navigate('/onboarding/1');
  };

  return (
    <main style={{
      background: '#0A0A0A',
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 24px',
      paddingTop: 'calc(env(safe-area-inset-top, 0px) + 20px)',
      paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 48px)',
      overflowX: 'hidden',
      boxSizing: 'border-box',
    }}>

      {/* Top spacer — pushes logo toward vertical centre */}
      <div style={{ flex: 1 }} />

      {/* Logo + tagline — centred, commanding presence */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <ClearLogo height={34} />
        <p style={{
          fontSize: '13px', fontWeight: 400,
          color: 'rgba(255,255,255,0.5)',
          margin: 0,
          letterSpacing: '0.02em',
          textAlign: 'center',
        }}>
          From quote to cleared.
        </p>
      </div>

      {/* Gap between logo and hero copy */}
      <div style={{ flex: 1.4 }} />

      {/* Hero block — anchored toward bottom */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
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

        {/* CTA */}
        <button
          onClick={handleStart}
          style={{
            background: C.white,
            color: '#0A0A0A',
            border: '1.5px solid #0A0A0A',
            borderRadius: '16px',
            height: 48,
            width: '100%',
            cursor: 'pointer',
            fontSize: T.input.fontSize,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            transition: 'opacity 150ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Get started →
        </button>

        {/* Sign in link */}
        <p style={{
          fontSize: T.pill.fontSize, fontWeight: 400, lineHeight: 1.5,
          color: 'rgba(255,255,255,0.4)', textAlign: 'center',
          margin: '16px 0 0',
        }}>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/projects')}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            style={{ textDecoration: 'underline', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', transition: 'color 150ms' }}
          >
            Sign in
          </span>
        </p>
      </div>
    </main>
  );
}