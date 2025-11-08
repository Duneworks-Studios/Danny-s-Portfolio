'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import './SolarSystem.css';

interface SolarSystemProps {
  enabled?: boolean;
  showMoons?: boolean;
  showRings?: boolean;
}

/**
 * SolarSystem Component - Scroll-driven solar system animation
 * 
 * Props:
 * @param {boolean} enabled - Whether the solar system is enabled (default: true)
 * @param {boolean} showMoons - Whether to show moons (default: true on desktop)
 * @param {boolean} showRings - Whether to show planet rings (default: true on desktop)
 */
export default function SolarSystem({ 
  enabled = true, 
  showMoons = true,
  showRings = true 
}: SolarSystemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Smooth scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Performance detection
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
      setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      mediaQuery.removeEventListener('change', checkDevice);
    };
  }, []);

  // IntersectionObserver to pause when off-screen
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Transform scroll progress to camera movement
  const cameraY = useTransform(smoothProgress, [0, 1], [0, -window.innerHeight * 2]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.2, 0.8]);

  // Planet data
  const planets = [
    { name: 'Mercury', size: 8, distance: 60, color: '#8C7853', orbitSpeed: 0.5, angle: 0 },
    { name: 'Venus', size: 12, distance: 90, color: '#FFC649', orbitSpeed: 0.4, angle: 45 },
    { name: 'Earth', size: 14, distance: 120, color: '#4A90E2', orbitSpeed: 0.3, angle: 90 },
    { name: 'Mars', size: 10, distance: 150, color: '#CD5C5C', orbitSpeed: 0.25, angle: 135 },
    { name: 'Jupiter', size: 24, distance: 200, color: '#D8CA9D', orbitSpeed: 0.15, angle: 180 },
    { name: 'Saturn', size: 22, distance: 250, color: '#FAD5A5', orbitSpeed: 0.12, angle: 225 },
  ];

  if (!enabled || reduceMotion) {
    return (
      <div ref={containerRef} className="solar-system-container solar-system-static">
        <div className="solar-system">
          <div className="sun" />
          {planets.map((planet, i) => (
            <div
              key={planet.name}
              className="planet-static"
              style={{
                left: `calc(50% + ${Math.cos((planet.angle * Math.PI) / 180) * planet.distance}px)`,
                top: `calc(50% + ${Math.sin((planet.angle * Math.PI) / 180) * planet.distance}px)`,
                width: `${planet.size}px`,
                height: `${planet.size}px`,
                backgroundColor: planet.color,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  const effectiveShowMoons = showMoons && !isMobile;
  const effectiveShowRings = showRings && !isMobile;

  return (
    <div ref={containerRef} className="solar-system-container">
      <motion.div
        className="solar-system"
        style={{
          y: isVisible ? cameraY : 0,
          scale: isVisible ? scale : 1,
        }}
      >
        {/* Sun */}
        <motion.div
          className="sun"
          animate={isVisible ? {
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 20px rgba(255, 215, 126, 0.6)',
              '0 0 40px rgba(255, 215, 126, 0.8)',
              '0 0 20px rgba(255, 215, 126, 0.6)',
            ],
          } : {}}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Planets */}
        {planets.map((planet, index) => {
          const orbitRotation = useTransform(
            smoothProgress,
            [0, 1],
            [planet.angle, planet.angle + 360 * planet.orbitSpeed]
          );

          return (
            <motion.div
              key={planet.name}
              className="planet-orbit"
              style={{
                width: `${planet.distance * 2}px`,
                height: `${planet.distance * 2}px`,
                rotate: isVisible ? orbitRotation : planet.angle,
              }}
            >
              {effectiveShowRings && planet.name === 'Saturn' && (
                <div className="planet-rings" style={{ borderColor: planet.color }} />
              )}
              <motion.div
                className="planet"
                style={{
                  width: `${planet.size}px`,
                  height: `${planet.size}px`,
                  backgroundColor: planet.color,
                  boxShadow: `0 0 ${planet.size}px ${planet.color}`,
                }}
                animate={isVisible ? {
                  scale: [1, 1.05, 1],
                } : {}}
                transition={{
                  duration: 2 + index * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {effectiveShowMoons && planet.name === 'Earth' && (
                  <motion.div
                    className="moon"
                    animate={isVisible ? {
                      rotate: 360,
                    } : {}}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                )}
              </motion.div>
            </motion.div>
          );
        })}

        {/* Stars background */}
        {!isMobile && (
          <div className="stars">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="star"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

