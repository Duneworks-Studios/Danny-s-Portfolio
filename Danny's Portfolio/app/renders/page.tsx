'use client';

import { motion } from 'framer-motion';
import Supernova from '@/components/Supernova/Supernova';

export default function RendersPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center pt-28 pb-24 px-6 overflow-hidden">
      <Supernova
        size={540}
        intensity={1.25}
        variant="warm"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-85"
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        animate={{ opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle at 18% 24%, rgba(255, 190, 120, 0.25), transparent 60%), radial-gradient(circle at 78% 76%, rgba(140, 40, 10, 0.22), transparent 65%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-3xl rounded-[32px] border border-white/15 bg-black/50 px-8 py-14 sm:px-12 sm:py-16 text-center backdrop-blur-2xl shadow-[0_50px_150px_rgba(80,30,10,0.65)]"
      >
        <motion.span
          className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-2 text-[0.68rem] uppercase tracking-[0.45em] text-white/70"
          animate={{ opacity: [0.5, 0.95, 0.5] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Render Lab
        </motion.span>

        <motion.h1
          className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#ffe7d0] drop-shadow-[0_0_35px_rgba(255,160,90,0.5)]"
          animate={{ textShadow: ['0 0 20px rgba(255, 150, 80, 0.4)', '0 0 48px rgba(255, 180, 120, 0.7)', '0 0 20px rgba(255, 150, 80, 0.4)'] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          3D Render Vault
        </motion.h1>

        <motion.h2
          className="mt-3 text-2xl sm:text-3xl font-semibold text-[#ffe0be]"
          animate={{ letterSpacing: ['0.28em', '0.34em', '0.28em'] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          Coming Soon
        </motion.h2>

        <p className="mt-6 text-base sm:text-lg text-white/80 leading-relaxed">
          High-octane CGI machines, cinematic lighting rigs, and full environment renders are on the way.
          The full collection deploys with the complete experience.
        </p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/75"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 14 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { delay: 0.45, staggerChildren: 0.14, ease: 'easeOut' },
            },
          }}
        >
          <motion.span
            className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/6 px-5 py-2.5"
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          >
            🛰️ Procedural hero assets
          </motion.span>
          <motion.span
            className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/6 px-5 py-2.5"
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          >
            🔥 Volumetric lighting suites
          </motion.span>
          <motion.span
            className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/6 px-5 py-2.5"
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          >
            🧪 Unreal & Blender pipelines
          </motion.span>
        </motion.div>

        <motion.div
          className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/12 px-6 py-3 text-sm font-medium text-white"
          animate={{ boxShadow: ['0 0 0 rgba(255,180,120,0.45)', '0 0 32px rgba(255,140,80,0.6)', '0 0 0 rgba(255,180,120,0.45)'] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="inline-flex h-2 w-2 rounded-full bg-white animate-pulse" />
          The LITE build is just the teaser — the render lab opens with the full launch.
        </motion.div>
      </motion.div>
    </div>
  );
}
