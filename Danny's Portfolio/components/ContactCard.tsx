'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, MessageCircle, User, Briefcase } from 'lucide-react';

interface ContactData {
  profilePicture: string;
  name: string;
  title: string;
  email: string;
  bio: string;
  socialLinks: {
    discord?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  skills: string[];
  updatedAt: string;
}

export default function ContactCard() {
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContactData = async () => {
      try {
        const response = await fetch('/api/contact');
        const data = await response.json();
        setContactData(data);
      } catch (error) {
        console.error('Error loading contact data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContactData();
  }, []);

  if (loading) {
    return (
      <div className="glass-strong rounded-3xl p-8 max-w-md mx-auto">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-white text-center">Loading contact info...</p>
      </div>
    );
  }

  if (!contactData) {
    return null;
  }

  const socialIcons = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    discord: MessageCircle,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.8 }}
      className="glass-strong rounded-3xl p-6 sm:p-8 max-w-md mx-auto w-full"
    >
      {/* Profile Picture */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.6, type: 'spring', stiffness: 200 }}
        className="relative mb-6"
      >
        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white/30">
          <img
            src={contactData.profilePicture}
            alt={contactData.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
      </motion.div>

      {/* Name and Title */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.5)' }}>{contactData.name}</h3>
        <div className="flex items-center justify-center gap-2 text-white">
          <Briefcase size={16} />
          <span className="text-sm font-medium">{contactData.title}</span>
        </div>
      </div>

      {/* Bio */}
      <p className="text-white text-sm text-center mb-6 leading-relaxed">
        {contactData.bio}
      </p>

      {/* Contact Info */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-white">
          <Mail size={16} className="text-white" />
          <span className="text-sm">{contactData.email}</span>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white mb-3">Skills & Expertise</h4>
        <div className="flex flex-wrap gap-2">
          {contactData.skills.filter(skill => skill.trim() !== '').map((skill, index) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8 + index * 0.1 }}
              className="px-3 py-1 text-xs font-medium rounded-full glass-light text-white"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="flex justify-center gap-4">
        {Object.entries(contactData.socialLinks).map(([platform, url]) => {
          if (!url) return null;
          const Icon = socialIcons[platform as keyof typeof socialIcons];
          if (!Icon) return null;

          return (
            <motion.a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2 + Math.random() * 0.5 }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full glass-light flex items-center justify-center text-white hover:text-white transition-colors"
            >
              <Icon size={18} />
            </motion.a>
          );
        })}
      </div>

      {/* Contact Button */}
      <motion.a
        href="/contact"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="block mt-6 w-full py-3 px-4 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-center hover:bg-white/15 transition-all"
      >
        Get In Touch
      </motion.a>
    </motion.div>
  );
}
