'use client';

import { motion } from 'framer-motion';
import Supernova from '@/components/Supernova/Supernova';

export default function PhotographyPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center pt-28 pb-24 px-6 overflow-hidden">
      <Supernova
        size={520}
        intensity={1.2}
        variant="cool"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80"
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        animate={{ opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle at 20% 30%, rgba(120, 160, 255, 0.18), transparent 60%), radial-gradient(circle at 80% 70%, rgba(40, 60, 120, 0.25), transparent 62%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-3xl rounded-[32px] border border-white/15 bg-black/45 px-8 py-14 sm:px-12 sm:py-16 text-center backdrop-blur-2xl shadow-[0_40px_120px_rgba(20,30,60,0.65)]"
      >
        <motion.span
          className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-2 text-[0.7rem] uppercase tracking-[0.45em] text-white/70"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Photography Universe
        </motion.span>

        <motion.h1
          className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-[0_0_35px_rgba(160,190,255,0.45)]"
          animate={{ textShadow: ['0 0 25px rgba(150, 180, 255, 0.4)', '0 0 45px rgba(160, 200, 255, 0.7)', '0 0 25px rgba(150, 180, 255, 0.4)'] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Photography Gallery
        </motion.h1>

        <motion.h2
          className="mt-3 text-2xl sm:text-3xl font-semibold text-[#d9e7ff]"
          animate={{ letterSpacing: ['0.3em', '0.35em', '0.3em'] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          Coming Soon
        </motion.h2>

        <p className="mt-6 text-base sm:text-lg text-white/80 leading-relaxed">
          Cosmic-grade photo stories, high-speed automotive captures, and cinematic portraits are in the lab.
          The full light show arrives with the complete release.
        </p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/70"
          initial="initial"
          animate="animate"
          variants={{
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0, transition: { delay: 0.4, staggerChildren: 0.12 } },
          }}
        >
          <motion.span
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5"
            variants={{ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }}
          >
            📸 Curated automotive shoots
          </motion.span>
          <motion.span
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5"
            variants={{ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }}
          >
            🌌 Immersive storytelling sets
          </motion.span>
          <motion.span
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5"
            variants={{ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }}
          >
            🚀 Ultra high-res galleries
          </motion.span>
        </motion.div>

        <motion.div
          className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white"
          animate={{ boxShadow: ['0 0 0 rgba(120,160,255,0.4)', '0 0 30px rgba(140,180,255,0.55)', '0 0 0 rgba(120,160,255,0.4)'] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="inline-flex h-2 w-2 rounded-full bg-white animate-pulse" />
          Thank you for exploring the LITE version — the full photographic odyssey is warming up.
        </motion.div>
      </motion.div>
    </div>
  );
}

