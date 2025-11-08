'use client';

import React, { useState, useEffect } from 'react';

export default function AnimationToggle() {
  const [enabled, setEnabled] = useState(() => {
    try {
      const pref = localStorage.getItem('ui_animations');
      if (pref !== null) return pref === '1';
    } catch (e) {}
    return !window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ui_animations', enabled ? '1' : '0');
    } catch (e) {}
    document.documentElement.setAttribute('data-animations', enabled ? 'on' : 'off');
  }, [enabled]);

  return (
    <button
      aria-pressed={!enabled}
      onClick={() => setEnabled(s => !s)}
      title="Toggle animations"
      className="animation-toggle"
      style={{
        padding: '8px 12px',
        borderRadius: 8,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.04)',
        color: '#eaf2ff',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
      }}
    >
      {enabled ? 'Animations: On' : 'Animations: Off'}
    </button>
  );
}

