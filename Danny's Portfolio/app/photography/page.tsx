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

