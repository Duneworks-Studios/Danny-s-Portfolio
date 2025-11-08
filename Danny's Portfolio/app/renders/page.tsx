'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Sparkles, Palette, Calendar, Eye } from 'lucide-react';

interface Render {
  id: string;
  sceneName: string;
  imageUrl: string;
  createdAt: string;
}

export default function RendersPage() {
  const [renders, setRenders] = useState<Render[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRender, setSelectedRender] = useState<Render | null>(null);

  useEffect(() => {
    const loadRenders = async () => {
      try {
        const response = await fetch('/api/renders');
        const rendersData = await response.json();
        
        // If the API returns just URLs (old format), convert to Render objects
        if (rendersData.length > 0 && typeof rendersData[0] === 'string') {
          const convertedRenders: Render[] = rendersData.map((url: string, index: number) => ({
            id: `render-${index}`,
            sceneName: `Render ${index + 1}`,
            imageUrl: url,
            createdAt: new Date().toISOString()
          }));
          setRenders(convertedRenders);
        } else {
          setRenders(rendersData);
        }
      } catch (error) {
        console.error('Error loading renders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRenders();
  }, []);

  const openModal = (render: Render) => {
    setSelectedRender(render);
  };

  const closeModal = () => {
    setSelectedRender(null);
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
              <Palette className="text-white" size={40} />
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
              3D Renders
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
            High-quality 3D visualizations and photorealistic renders showcasing creative vision and technical expertise
          </p>
        </motion.div>

        {/* Renders Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-white">Loading renders...</p>
          </div>
        ) : renders.length === 0 ? (
          <div className="glass-strong rounded-3xl p-8 text-center max-w-md mx-auto">
            <Sparkles className="text-white mx-auto mb-4" size={50} />
            <h3 className="text-xl font-bold mb-3">No Renders Yet</h3>
            <p className="text-white text-sm">
              Add your renders through the admin panel
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {renders.map((render, index) => (
              <motion.div
                key={render.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group cursor-pointer border border-white/10 hover:border-white/30 transition-all duration-300"
                onClick={() => openModal(render)}
              >
                <div className="glass-strong rounded-3xl overflow-hidden aspect-square">
                  <img
                    src={render.imageUrl}
                    alt={render.sceneName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-semibold">{render.sceneName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar size={12} className="text-gray-300" />
                      <span className="text-gray-300 text-xs">
                        {new Date(render.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 rounded-full glass-light flex items-center justify-center">
                      <Eye size={16} className="text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedRender && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass-strong rounded-3xl overflow-hidden">
                <div className="relative">
                  <img
                    src={selectedRender.imageUrl}
                    alt={selectedRender.sceneName}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full glass-light flex items-center justify-center hover:bg-red-500/20 transition-colors"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedRender.sceneName}</h3>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={16} />
                    <span>Created: {new Date(selectedRender.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
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
                Interested in 3D work?
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
              I'm passionate about creating stunning 3D visualizations and renders. Let's discuss your project and bring your vision to life.
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
