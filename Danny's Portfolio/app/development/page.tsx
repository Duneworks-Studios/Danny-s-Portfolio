'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Code, ExternalLink, Sparkles } from 'lucide-react';

interface AdminProject {
  id: string;
  name: string;
  description: string;
  tech: string[];
  demo: string;
  gradient: string;
  createdAt: string;
}

// Fallback projects
const fallbackProjects = [
  {
    id: 1,
    name: 'Mindvault',
    description: 'A powerful web platform designed for seamless knowledge management and collaborative workspace solutions.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Cloud Infrastructure'],
    demo: 'https://mindvault.elysiumstudio.xyz/',
    gradient: 'from-white to-gray-300',
  },
  {
    id: 2,
    name: 'Duneworks Core',
    description: 'A next-generation Discord security bot powered by an advanced AI algorithm for comprehensive server protection and moderation.',
    tech: ['Python', 'Discord.py', 'AI/ML', 'Advanced Security'],
    demo: 'https://discord.gg/duneworks',
    gradient: 'from-gray-300 to-white',
  },
];

export default function DevelopmentPage() {
  const [adminProjects, setAdminProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load projects
        const projectsResponse = await fetch('/api/projects');
        const adminProjectsData = await projectsResponse.json();
        setAdminProjects(adminProjectsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getCurrentProjects = () => {
    return adminProjects.length > 0 ? adminProjects : fallbackProjects.map(project => ({
      ...project,
      id: project.id.toString(),
      createdAt: new Date().toISOString()
    }));
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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
              <Code className="text-white" size={40} />
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
              Development
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
            Building innovative solutions with modern technologies
          </p>
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-white">Loading projects...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {getCurrentProjects().map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-0.5 bg-white/10 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
              
              {/* Card */}
              <div className="relative glass-strong rounded-3xl p-6 h-full flex flex-col transition-all duration-300 group-hover:border-white/30">
                {/* Header with gradient accent */}
                <div className="mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${project.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Sparkles className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-white transition-all">
                    {project.name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                  {project.tech.map((tech) => (
                    <motion.span
                      key={tech}
                      whileHover={{ scale: 1.1 }}
                      className="px-3 py-1 text-xs font-medium rounded-lg glass-light text-gray-300"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>

                {/* Link */}
                {project.demo && (
                  <div className="pt-4 border-t border-white/10">
                    <motion.a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-medium text-white transition-all border border-white/20 hover:border-white/30"
                    >
                      <ExternalLink size={18} />
                      View Project
                    </motion.a>
                  </div>
                )}

                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 rounded-3xl bg-white/5 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-300"
                />
              </div>
            </motion.div>
          ))}
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="glass-strong rounded-3xl p-12 max-w-3xl mx-auto">
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
                Want to collaborate?
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
            <p className="text-white text-base sm:text-lg mb-6 sm:mb-8 px-2">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/15 transition-all"
            >
              Get in Touch
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

