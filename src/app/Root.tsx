import React from 'react';
import { Outlet } from 'react-router';
import { C } from './tokens';

export default function Root() {
  return (
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
      }}>
        <Outlet />
      </div>
    </div>
  );
}