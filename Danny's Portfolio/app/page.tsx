'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Camera, Code, Crown, MessageCircle, Sparkles } from 'lucide-react';
import ContactCard from '../components/ContactCard';

const roles = [
  { text: '📸 Motor Photographer', icon: Camera },
  { text: '💻 Software Developer', icon: Code },
  { text: '🎨 Render Engineer', icon: Sparkles },
  { text: '👑 CEO of Duneworks Studios', icon: Crown },
];

export default function Home() {
  const [currentRole, setCurrentRole] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center overflow-hidden" style={{ padding: 0, margin: 0 }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full blur-3xl"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block"
          >
            <span className="text-lg sm:text-xl md:text-2xl font-medium text-white">
              Hi, I'm
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-display font-black px-2 relative"
            style={{ color: '#e0e0e0' }}
          >
            <motion.span
              animate={{
                textShadow: [
                  '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(200, 200, 255, 0.2), 0 0 30px rgba(150, 150, 200, 0.1)',
                  '0 0 15px rgba(255, 255, 255, 0.4), 0 0 25px rgba(200, 200, 255, 0.3), 0 0 35px rgba(150, 150, 200, 0.2)',
                  '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(200, 200, 255, 0.2), 0 0 30px rgba(150, 150, 200, 0.1)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative z-10"
            >
              Daniel Buckley
            </motion.span>
            {/* Space glow effect */}
            <motion.div
              className="absolute inset-0 blur-3xl opacity-30"
              animate={{
                background: [
                  'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                  'radial-gradient(circle at 50% 50%, rgba(200, 200, 255, 0.15) 0%, transparent 70%)',
                  'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                ],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ zIndex: 0 }}
            />
          </motion.h1>

          {/* Animated roles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="h-16 sm:h-20 md:h-24 flex items-center justify-center px-2"
          >
            <motion.div
              key={currentRole}
              initial={{ opacity: 0, y: 20, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -20, rotateX: 90 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-display font-bold text-white text-center px-2"
              style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.5)' }}
            >
              <span className="emoji-gray">{roles[currentRole].text}</span>
            </motion.div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-base sm:text-lg md:text-xl text-white max-w-2xl mx-auto px-4"
          >
            Capturing moments on the road and crafting experiences in code.
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            Welcome to my creative journey.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="pt-6 sm:pt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
          >
            <Link href="/photography" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white rounded-2xl overflow-hidden"
              >
                {/* Glass background */}
                <div className="absolute inset-0 glass-strong border-2 border-white/20 rounded-2xl" />
                
                {/* Gradient glow on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white to-gray-300 opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl"
                />
                
                {/* Content */}
                <span className="relative flex items-center gap-2">
                  View My Work
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </span>
              </motion.button>
            </Link>

            <motion.a
              href="https://discord.gg/duneworks"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white rounded-2xl overflow-hidden"
            >
              {/* Glass background */}
              <div className="absolute inset-0 glass border-2 border-white/20 rounded-2xl" />
              
              {/* Gradient glow on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-300 to-white opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl"
              />
              
              {/* Content */}
              <span className="relative flex items-center gap-2">
                <MessageCircle className="group-hover:scale-110 transition-transform" size={20} />
                Join Duneworks Discord
              </span>
            </motion.a>
          </motion.div>

          {/* Floating badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center px-4"
          >
            {[
              { label: 'Photography', icon: Camera },
              { label: 'Development', icon: Code },
              { label: 'Render Engineer', icon: Sparkles },
              { label: 'Duneworks Studios', icon: Crown },
            ].map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="glass-light px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full flex items-center gap-1.5 sm:gap-2 cursor-default"
              >
                <badge.icon size={16} className="sm:w-5 sm:h-5 text-white flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">{badge.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Card */}
          <div className="px-4">
            <ContactCard />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
