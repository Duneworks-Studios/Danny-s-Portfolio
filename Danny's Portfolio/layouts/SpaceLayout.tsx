'use client';

import { ReactNode, useState, useEffect } from 'react';
import Particles from '@/components/Particles/Particles';
import SolarSystem from '@/components/SolarSystem/SolarSystem';
import Dock from '@/components/Dock/Dock';
import { Home, Camera, Code, User, Mail, Palette } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface SpaceLayoutProps {
  children: ReactNode;
  particleCount?: number;
  particleSpread?: number;
  particleSpeed?: number;
  particleColors?: string[];
  solarSystemEnabled?: boolean;
  dockItems?: Array<{
    icon?: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    onClick?: () => void;
    href?: string;
    ariaLabel?: string;
  }>;
}

/**
 * SpaceLayout Component - Main layout wrapper with Particles, SolarSystem, and Dock
 * 
 * Props:
 * @param {ReactNode} children - Page content
 * @param {number} particleCount - Number of particles (default: 200)
 * @param {number} particleSpread - Particle spread radius (default: 10)
 * @param {number} particleSpeed - Particle speed (default: 0.12)
 * @param {string[]} particleColors - Particle colors array
 * @param {boolean} solarSystemEnabled - Whether solar system is enabled (default: true)
 * @param {Array} dockItems - Custom dock items (default: auto-generated from routes)
 */
export default function SpaceLayout({
  children,
  particleCount = 200,
  particleSpread = 10,
  particleSpeed = 0.12,
  particleColors = ['#8AB4F8', '#FFD57E', '#C7B2FF'],
  solarSystemEnabled = true,
  dockItems,
}: SpaceLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [performanceMode, setPerformanceMode] = useState<'low' | 'medium' | 'high'>('high');

  // Detect performance mode
  useEffect(() => {
    const detectPerformance = () => {
      const deviceMemory = (navigator as any).deviceMemory || 4;
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        setAnimationsEnabled(false);
        setPerformanceMode('low');
      } else if (deviceMemory < 4 || hardwareConcurrency < 4) {
        setPerformanceMode('medium');
      } else {
        setPerformanceMode('high');
      }
    };

    detectPerformance();
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', detectPerformance);
    return () => mediaQuery.removeEventListener('change', detectPerformance);
  }, []);

  // Default dock items based on routes
  const defaultDockItems = dockItems || [
    {
      icon: Home,
      label: 'Home',
      onClick: () => router.push('/'),
      href: '/',
      ariaLabel: 'Navigate to home page',
    },
    {
      icon: Camera,
      label: 'Photography',
      onClick: () => router.push('/photography'),
      href: '/photography',
      ariaLabel: 'Navigate to photography gallery',
    },
    {
      icon: Code,
      label: 'Development',
      onClick: () => router.push('/development'),
      href: '/development',
      ariaLabel: 'Navigate to development projects',
    },
    {
      icon: Palette,
      label: 'Renders',
      onClick: () => router.push('/renders'),
      href: '/renders',
      ariaLabel: 'Navigate to renders gallery',
    },
    {
      icon: User,
      label: 'About',
      onClick: () => router.push('/about'),
      href: '/about',
      ariaLabel: 'Navigate to about page',
    },
    {
      icon: Mail,
      label: 'Contact',
      onClick: () => router.push('/contact'),
      href: '/contact',
      ariaLabel: 'Navigate to contact page',
    },
  ];

  return (
    <div data-performance-mode={performanceMode}>
      {/* Background Particles */}
      <Particles
        particleCount={particleCount}
        particleSpread={particleSpread}
        speed={particleSpeed}
        particleColors={particleColors}
        enabled={animationsEnabled}
      />

      {/* Solar System Animation */}
      {solarSystemEnabled && (
        <SolarSystem
          enabled={animationsEnabled}
          showMoons={performanceMode === 'high'}
          showRings={performanceMode === 'high'}
        />
      )}

      {/* Main Content */}
      <div className="space-content" style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>

      {/* Bottom Dock Navigation */}
      {!pathname.startsWith('/admin') && (
        <Dock
          items={defaultDockItems}
          mobileCollapsible={true}
        />
      )}

      {/* Reduce Motion Toggle (for testing) */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={() => setAnimationsEnabled(!animationsEnabled)}
          className="fixed top-4 right-4 z-50 px-3 py-2 bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg text-white text-xs hover:bg-black/70 transition-colors"
          aria-label="Toggle animations"
        >
          {animationsEnabled ? 'Disable Animations' : 'Enable Animations'}
        </button>
      )}
    </div>
  );
}

