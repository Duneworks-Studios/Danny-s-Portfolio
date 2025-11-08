'use client';

import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import './Supernova.css';

type SupernovaVariant = 'cool' | 'warm';

interface SupernovaProps {
  size?: number;
  variant?: SupernovaVariant;
  className?: string;
  intensity?: number;
}

const RAY_COUNT = 12;
const PARTICLE_COUNT = 18;

export default function Supernova({
  size = 360,
  variant = 'cool',
  className,
  intensity = 1,
}: SupernovaProps) {
  const rootStyle = {
    '--sn-size': `${size}px`,
    '--sn-intensity': intensity,
  } as CSSProperties;

  const classNames = ['supernova', `supernova--${variant}`];
  if (className) classNames.push(className);

  return (
    <div
      className={classNames.join(' ')}
      style={rootStyle}
      aria-hidden="true"
    >
      <motion.div
        className="supernova-core"
        animate={{ scale: [0.7, 1.12, 0.82, 0.7], opacity: [0.7, 1, 0.9, 0.7] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="supernova-halo"
        animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0.9, 0.4], filter: ['blur(40px)', 'blur(18px)', 'blur(40px)'] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="supernova-shockwave"
        animate={{ scale: [0.5, 1.8, 2.2], opacity: [0.8, 0.35, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeOut' }}
      />

      <motion.div
        className="supernova-accretion"
        animate={{ rotate: [0, 360], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />

      <div className="supernova-rays">
        {Array.from({ length: RAY_COUNT }).map((_, index) => (
          <motion.span
            key={index}
            className="supernova-ray"
            style={{ rotate: `${(360 / RAY_COUNT) * index}deg` }}
            animate={{ scale: [0.2, 1, 0.2], opacity: [0, 0.9, 0], filter: ['blur(18px)', 'blur(6px)', 'blur(18px)'] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.18 }}
          />
        ))}
      </div>

      <div className="supernova-particles">
        {Array.from({ length: PARTICLE_COUNT }).map((_, index) => {
          const delay = (index / PARTICLE_COUNT) * 1.8;
          const radius = 0.6 + (index % 6) * 0.08;
          return (
            <motion.span
              key={index}
              className="supernova-particle"
              style={{ rotate: `${(360 / PARTICLE_COUNT) * index}deg` }}
              animate={{
                translateX: ['0%', `${radius * 100}%`],
                scale: [0.3, 1, 0.3],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2.8 + (index % 4) * 0.2,
                repeat: Infinity,
                ease: 'easeOut',
                delay,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

