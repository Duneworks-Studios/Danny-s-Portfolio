'use client';

import { motion } from 'framer-motion';
import { User, Camera, Code, Crown, MessageCircle, Sparkles } from 'lucide-react';
import Image from 'next/image';

const skills = [
  { name: 'Photography', icon: Camera, color: 'from-white to-gray-300' },
  { name: 'Software Development', icon: Code, color: 'from-gray-300 to-white' },
  { name: 'Render Engineering', icon: Sparkles, color: 'from-white to-gray-400' },
  { name: 'Leadership', icon: Crown, color: 'from-gray-400 to-white' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-14"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-3"
          >
            <div className="w-20 h-20 rounded-full glass-strong flex items-center justify-center mx-auto">
              <User className="text-white" size={36} />
            </div>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black mb-3 px-2 relative" style={{ color: '#e0e0e0' }}>
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
              About Me
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
            Creator, innovator, and storyteller
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-7 md:gap-10 mb-12 sm:mb-14 md:mb-16">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            <div className="glass-strong rounded-3xl p-8 h-full border border-white/10 hover:border-white/30 transition-all duration-300">
              {/* Gradient accent */}
              <div className="absolute -top-2 -left-2 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
              
              <div className="relative">
                <div className="w-32 h-32 rounded-full glass mb-6 flex items-center justify-center mx-auto border-4 border-white/30">
                  <User className="text-white" size={60} />
                </div>
                
                <h2 className="text-3xl font-bold text-center mb-4" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.5)' }}>
                  <span className="gradient-text">Daniel Buckley</span>
                </h2>
                
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  <span className="px-4 py-2 rounded-full glass-light text-sm font-medium emoji-gray">
                    📸 Photographer
                  </span>
                  <span className="px-4 py-2 rounded-full glass-light text-sm font-medium emoji-gray">
                    💻 Developer
                  </span>
                  <span className="px-4 py-2 rounded-full glass-light text-sm font-medium emoji-gray">
                    👑 CEO
                  </span>
                </div>

                <div className="space-y-4 text-white text-center">
                  <p className="leading-relaxed">
                    Passionate about capturing the beauty of motion and building innovative digital experiences.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bio Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-6"
          >
            <div className="glass-strong rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.4)' }}>
                <Crown className="text-white" size={28} />
                <span className="gradient-text">CEO of Duneworks Studios</span>
              </h3>
              <p className="text-white leading-relaxed mb-4">
                As the founder and CEO of Duneworks Studios, I lead a creative team dedicated to pushing 
                the boundaries of digital innovation and visual storytelling. We specialize in creating 
                compelling experiences that blend technology with artistry.
              </p>
              <p className="text-white leading-relaxed">
                Our studio focuses on delivering high-quality software solutions and creative content 
                that help brands stand out in the digital landscape.
              </p>
            </div>

            <div className="glass-strong rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.4)' }}>
                <Camera className="text-white" size={28} />
                Motor Photography
              </h3>
              <p className="text-white leading-relaxed">
                My passion for automotive photography stems from a deep appreciation for design, 
                engineering, and the raw emotion that vehicles can evoke. Every shoot is an opportunity 
                to tell a unique story through light, composition, and motion.
              </p>
            </div>

            <div className="glass-strong rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.4)' }}>
                <Code className="text-white" size={28} />
                Software Development
              </h3>
              <p className="text-white leading-relaxed">
                With expertise in modern web technologies, I build scalable and performant applications 
                that prioritize user experience. From concept to deployment, I focus on creating solutions 
                that are both beautiful and functional.
              </p>
            </div>

            <div className="glass-strong rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.4)' }}>
                <Sparkles className="text-white" size={28} />
                Render Engineering
              </h3>
              <p className="text-white leading-relaxed">
                As a render engineer, I create stunning 3D visualizations and high-quality renders that 
                bring concepts to life. Combining technical expertise with artistic vision, I deliver 
                photorealistic renders for various applications.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 px-2 relative" style={{ color: '#e0e0e0' }}>
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
              Core Skills
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
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-strong rounded-2xl p-6 text-center group cursor-default border border-white/10 hover:border-white/30 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${skill.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <skill.icon className="text-white" size={32} />
                </div>
                <p className="font-semibold text-white">{skill.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Discord CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="text-center"
        >
          <div className="glass-strong rounded-3xl p-12 max-w-3xl mx-auto relative overflow-hidden">
            {/* Animated background */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-white/10"
            />
            
            <div className="relative">
              <MessageCircle className="text-white mx-auto mb-6 animate-float" size={60} />
              <h2 className="text-3xl md:text-4xl font-bold mb-4 relative" style={{ color: '#e0e0e0' }}>
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
                  Join Duneworks Studios
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
              <p className="text-white text-lg mb-8">
                Connect with our creative community on Discord. Share ideas, collaborate on projects, 
                and stay updated with the latest from Duneworks Studios.
              </p>
              <motion.a
                href="https://discord.gg/duneworks"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/15 transition-all"
              >
                <MessageCircle size={24} />
                Join Discord Server
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

