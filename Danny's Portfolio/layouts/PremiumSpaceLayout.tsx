'use client';

import React, { ReactNode } from 'react';
import TopNavbar from '@/components/TopNavbar/TopNavbar';
import Stars from '@/components/Stars/Stars';
import SolarSystem from '@/components/SolarSystem/SolarSystem';
import Particles from '@/components/Particles/Particles';
import './PremiumSpaceLayout.css';

interface PremiumSpaceLayoutProps {
  children: ReactNode;
}

export default function PremiumSpaceLayout({ children }: PremiumSpaceLayoutProps) {
  return (
    <div className="premium-root">
      <TopNavbar />
      <Stars starCount={400} parallaxStrength={0.04} twinkle className="stars-monochrome" />
      <Particles
        particleCount={80}
        particleSpread={8}
        speed={0.06}
        particleColors={['#ffffff', '#cccccc', '#999999']}
        enabled
      />
      <SolarSystem />
      <div className="content-area" style={{ marginTop: 0 }}>
        {children}
      </div>
    </div>
  );
}

