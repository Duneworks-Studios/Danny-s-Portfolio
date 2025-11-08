'use client';

import React, { useEffect, useRef } from 'react';
import './Stars.css';

interface StarsProps {
  starCount?: number;
  parallaxStrength?: number;
  twinkle?: boolean;
  className?: string;
}

export default function Stars({
  starCount = 300,
  parallaxStrength = 0.06,
  twinkle = true,
  className = ''
}: StarsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const starsRef = useRef<any[]>([]);
  const mouse = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const lastMouse = useRef({ x: 0, y: 0, t: 0 });
  const rafRef = useRef<number | null>(null);

  const deviceLowPower = typeof navigator !== 'undefined' && 
    ((navigator as any).deviceMemory && (navigator as any).deviceMemory < 1.5);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const containerEl = container;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.className = 'stars-canvas';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = containerEl.clientWidth;
      const h = containerEl.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
    };

    function initStars() {
      const amount = deviceLowPower ? Math.min(120, starCount) : starCount;
      starsRef.current = new Array(amount).fill(0).map(() => {
        const r = Math.random();
        return {
          x: Math.random() * containerEl.clientWidth,
          y: Math.random() * containerEl.clientHeight,
          z: 0.1 + Math.random() * 1.5,
          size: 0.6 + r * 2.4,
          alpha: 0.5 + Math.random() * 0.5,
          twinkleSpeed: 0.001 + Math.random() * 0.006
        };
      });
    }

    const handleMove = (e: MouseEvent) => {
      const rect = containerEl.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      const now = performance.now();
      const last = lastMouse.current;
      const dt = Math.max(16, now - last.t);
      mouse.current.vx = (x - last.x) / dt;
      mouse.current.vy = (y - last.y) / dt;
      mouse.current.x = x;
      mouse.current.y = y;
      lastMouse.current = { x, y, t: now };
    };

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) containerEl.addEventListener('mousemove', handleMove);

    let last = performance.now();

    const render = (t: number) => {
      rafRef.current = requestAnimationFrame(render);
      const now = t || performance.now();
      const dt = Math.min(32, now - last);
      last = now;

      ctx.clearRect(0, 0, containerEl.clientWidth, containerEl.clientHeight);

      const mx = mouse.current.x * parallaxStrength * containerEl.clientWidth;
      const my = mouse.current.y * parallaxStrength * containerEl.clientHeight;

      for (let s of starsRef.current) {
        // parallax offset
        const px = (s.z - 0.1) * mx * 0.6;
        const py = (s.z - 0.1) * my * 0.6;

        // twinkle
        if (twinkle) {
          s.alpha += Math.sin(now * s.twinkleSpeed + s.z * 10) * 0.005;
          s.alpha = Math.max(0.2, Math.min(1, s.alpha));
        }

        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x + px, s.y + py, s.size * s.z, 0, Math.PI * 2);
        ctx.fillStyle = '#fff'; // Monochrome white
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    resize();
    window.addEventListener('resize', resize);
    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('resize', resize);
      if (!reduceMotion) containerEl.removeEventListener('mousemove', handleMove);
      if (containerEl.contains(canvas)) containerEl.removeChild(canvas);
    };
  }, [starCount, parallaxStrength, twinkle, deviceLowPower]);

  return <div ref={ref} className={`stars-root ${className}`} aria-hidden="true" />;
}

