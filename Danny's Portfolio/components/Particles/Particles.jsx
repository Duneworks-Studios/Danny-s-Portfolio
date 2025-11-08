'use client';

import { useEffect, useRef, useState } from 'react';
import './Particles.css';

/**
 * Particles Component - Animated background particles
 * 
 * Props:
 * @param {number} particleCount - Number of particles (default: 200, auto-reduced on mobile)
 * @param {number} particleSpread - Spread radius in pixels (default: 10)
 * @param {number} speed - Animation speed multiplier (default: 0.12)
 * @param {Array<string>} particleColors - Array of color strings (default: ['#8AB4F8', '#FFD57E', '#C7B2FF'])
 * @param {boolean} enabled - Whether particles are enabled (default: true)
 */
export default function Particles({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.12,
  particleColors = ['#8AB4F8', '#FFD57E', '#C7B2FF'],
  enabled = true
}) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const [effectiveCount, setEffectiveCount] = useState(particleCount);
  const [isVisible, setIsVisible] = useState(true);

  // Performance detection and adaptive particle count
  useEffect(() => {
    if (!enabled) return;

    const detectPerformance = () => {
      const isMobile = window.innerWidth < 768;
      const deviceMemory = (navigator as any).deviceMemory || 4;
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      let count = particleCount;

      if (prefersReducedMotion) {
        count = Math.floor(count * 0.3);
      } else if (isMobile) {
        count = Math.min(count, 80);
      } else if (deviceMemory < 4 || hardwareConcurrency < 4) {
        count = Math.floor(count * 0.6);
      }

      setEffectiveCount(count);
    };

    detectPerformance();
    window.addEventListener('resize', detectPerformance);
    return () => window.removeEventListener('resize', detectPerformance);
  }, [particleCount, enabled]);

  // IntersectionObserver to pause when off-screen
  useEffect(() => {
    if (!canvasRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0 }
    );

    observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, []);

  // Initialize and animate particles
  useEffect(() => {
    if (!enabled || !canvasRef.current || !isVisible) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    particlesRef.current = Array.from({ length: effectiveCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      radius: Math.random() * 2 + 0.5,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const animate = () => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();

        // Draw connections to nearby particles
        particlesRef.current.forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < particleSpread) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = (particleSpread - distance) / particleSpread * 0.2;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [effectiveCount, speed, particleColors, particleSpread, enabled, isVisible]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="particles-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    />
  );
}

