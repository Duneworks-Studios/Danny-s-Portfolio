'use client';

import { ReactNode } from 'react';
import './space-theme.css';

interface SpaceThemeProps {
  children: ReactNode;
  animationsEnabled?: boolean;
}

/**
 * SpaceTheme Component - Wraps the app with space theme CSS variables and global styles
 * 
 * Props:
 * @param {ReactNode} children - Child components
 * @param {boolean} animationsEnabled - Whether animations are enabled (default: true)
 */
export default function SpaceTheme({ children, animationsEnabled = true }: SpaceThemeProps) {
  return (
    <div 
      className={`space-theme ${animationsEnabled ? 'animations-enabled' : 'animations-disabled'}`}
      data-theme="space"
    >
      {children}
    </div>
  );
}

