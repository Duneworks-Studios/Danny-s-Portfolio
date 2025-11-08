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
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { fallbackGallery } from '@/data/galleryFallback';

// Categories for filtering
const categories = ['All', 'Automotive', 'Cinematic', 'Street', 'Portrait'];

interface GalleryPhoto {
  id: string;
  title: string;
  description?: string;
  category: string;
  imageUrl: string;
}

export default function PhotographyPage() {
  const [adminPhotos, setAdminPhotos] = useState<GalleryPhoto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadPhotos = async () => {
      try {
        const response = await fetch('/api/photos', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const photosData = await response.json();
        if (!cancelled) {
          const validPhotos = Array.isArray(photosData) && photosData.length > 0
            ? photosData
            : fallbackGallery;
          setAdminPhotos(validPhotos);
        }
      } catch (error) {
        console.error('Error loading photos:', error);
        if (!cancelled) {
          setAdminPhotos(fallbackGallery);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPhotos();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredPhotos = useMemo(() => {
    if (selectedCategory === 'All') return adminPhotos;
    return adminPhotos.filter((photo) => photo.category === selectedCategory);
  }, [adminPhotos, selectedCategory]);

  const openLightbox = (index: number) => {
    setSelectedPhoto(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'auto';
  };

  const nextPhoto = () => {
    if (selectedPhoto !== null && filteredPhotos.length > 0) {
      setSelectedPhoto((selectedPhoto + 1) % filteredPhotos.length);
    }
  };

  const prevPhoto = () => {
    if (selectedPhoto !== null && filteredPhotos.length > 0) {
      setSelectedPhoto((selectedPhoto - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhoto === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, filteredPhotos.length]);

  return (
    <div className="min-h-screen pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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
              <Camera className="text-white" size={36} />
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
              Photography
            </motion.span>
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
            Capturing the beauty of motion, speed, and automotive artistry
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-6 sm:mb-8 px-2"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl text-sm sm:text-base font-medium transition-all ${
                selectedCategory === category
                  ? 'glass-strong border-2 border-white/30 text-white'
                  : 'glass-light text-white hover:text-white'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto"
            />
            <p className="mt-4 text-white">Loading gallery...</p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="glass-strong rounded-3xl p-12 max-w-2xl mx-auto">
              <Camera className="text-white mx-auto mb-4" size={60} />
              <h3 className="text-2xl font-bold mb-4">No Photos Yet</h3>
              <p className="text-white mb-6">
                Try a different category or check back soon.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
          >
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.05, duration: 0.5 }}
                whileHover={{ scale: 1.03, y: -8 }}
                className="relative aspect-square rounded-2xl overflow-hidden glass cursor-pointer group border border-white/10 hover:border-white/30 transition-all duration-300"
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={photo.imageUrl}
                  alt={photo.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={85}
                  priority={index < 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-semibold">{photo.title}</p>
                  {photo.description && (
                    <p className="text-white text-sm">{photo.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {selectedPhoto !== null && filteredPhotos[selectedPhoto] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
              onClick={closeLightbox}
            >
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeLightbox}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-strong flex items-center justify-center text-white hover:text-white transition-colors"
              >
                <X size={24} />
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  prevPhoto();
                }}
                className="absolute left-4 sm:left-6 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-strong flex items-center justify-center text-white hover:text-white transition-colors"
              >
                <ChevronLeft size={24} />
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                className="absolute right-4 sm:right-6 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-strong flex items-center justify-center text-white hover:text-white transition-colors"
              >
                <ChevronRight size={24} />
              </motion.button>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-7xl max-h-[90vh] w-full h-full mx-2 sm:mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={filteredPhotos[selectedPhoto].imageUrl}
                  alt={filteredPhotos[selectedPhoto].title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  quality={90}
                  priority
                />
              </motion.div>

              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 glass-strong px-6 py-3 rounded-full text-center">
                <p className="text-white text-sm font-medium">
                  {selectedPhoto + 1} / {filteredPhotos.length}
                </p>
                <p className="text-gray-300 text-xs mt-1">
                  {filteredPhotos[selectedPhoto].title}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

