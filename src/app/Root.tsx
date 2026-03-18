import React from 'react';
import { Outlet } from 'react-router';
import { Toaster } from 'sonner';
import { C } from './tokens';
import { AppProvider } from './store';

export default function Root() {
  return (
    <AppProvider>
      <div style={{
        background: C.surface,
        minHeight: '100dvh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 430,
          minHeight: '100dvh',
          background: C.white,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 8px 40px rgba(0,0,0,0.10)',
        }}
          id="app-root"
        >
          <Outlet />
        </div>
      </div>
      <Toaster
        position="bottom-center"
        offset={24}
        toastOptions={{
          style: {
            background: C.black,
            color: C.white,
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 500,
            padding: '10px 16px',
          },
        }}
      />
    </AppProvider>
  );
}