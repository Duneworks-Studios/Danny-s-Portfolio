'use client';

import { motion } from 'framer-motion';
import { Mail, ExternalLink, Send, Sparkles, MessageCircle, Link as LinkIcon } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 rounded-full glass-strong flex items-center justify-center mx-auto">
              <Mail className="text-white" size={40} />
            </div>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-black mb-4 sm:mb-6 px-2 relative" style={{ color: '#e0e0e0' }}>
            <motion.span
              className="gradient-text relative z-10"
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
            >
              Get in Touch
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
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white max-w-2xl mx-auto px-2">
            Let's create something amazing together
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Email Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative group"
          >
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-white/10 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
            
            <div className="relative glass-strong rounded-3xl p-8 h-full flex flex-col border border-white/10 hover:border-white/30 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mail className="text-white" size={32} />
              </div>
              
              <h3 className="text-2xl font-bold mb-3">
                <span className="gradient-text">Email Me</span>
              </h3>
              
              <p className="text-white mb-6 flex-grow">
                Drop me a line for collaborations, inquiries, or just to say hello!
              </p>
              
              <motion.a
                href="mailto:Danielleebuckley@gmail.com"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between px-6 py-4 rounded-xl glass hover:glass-strong transition-all border border-white/20 hover:border-white/30 group/link"
              >
                <span className="text-white font-medium text-sm sm:text-base md:text-lg break-all">
                  Danielleebuckley@gmail.com
                </span>
                <Send className="text-white group-hover/link:translate-x-1 transition-transform" size={20} />
              </motion.a>
            </div>
          </motion.div>

          {/* Linktree Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative group"
          >
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-white/10 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
            
            <div className="relative glass-strong rounded-3xl p-8 h-full flex flex-col border border-white/10 hover:border-white/30 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <LinkIcon className="text-white" size={32} />
              </div>
              
              <h3 className="text-2xl font-bold mb-3">
                <span className="gradient-text">All My Links</span>
              </h3>
              
              <p className="text-white mb-6 flex-grow">
                Find all my social profiles, projects, and content in one place.
              </p>
              
              <motion.a
                href="https://linktr.ee/Volraiden"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between px-6 py-4 rounded-xl glass hover:glass-strong transition-all border border-white/20 hover:border-white/30 group/link"
              >
                <span className="text-white font-medium text-sm sm:text-base md:text-lg break-all">
                  linktr.ee/Volraiden
                </span>
                <ExternalLink className="text-white group-hover/link:translate-x-1 transition-transform" size={20} />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="glass-strong rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
        >
          {/* Animated background */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"
          />
          
          <div className="relative">
            <Sparkles className="text-white mx-auto mb-6 animate-float" size={50} />
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-2 relative" style={{ color: '#e0e0e0' }}>
              <motion.span
                className="gradient-text relative z-10"
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
              >
                Let's Work Together
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
            </h2>
            
            <p className="text-white text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
              Whether you need a photographer for your next automotive shoot, a developer to bring your 
              digital vision to life, or want to collaborate on something creative — I'd love to hear from you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="mailto:Danielleebuckley@gmail.com"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/15 transition-all flex items-center gap-2"
              >
                <Mail size={20} />
                Send Email
              </motion.a>

              <motion.a
                href="https://discord.gg/duneworks"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl glass border-2 border-white/20 hover:border-white/30 text-white font-semibold transition-all flex items-center gap-2"
              >
                <MessageCircle size={20} />
                Join Discord
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Response Time Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-white text-sm">
            ⚡ I typically respond within 24-48 hours
          </p>
        </motion.div>
      </div>
    </div>
  );
}

