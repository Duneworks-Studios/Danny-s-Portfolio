'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import './Dock.css';

/**
 * Dock Component - Bottom navigation dock
 * 
 * Props:
 * @param {Array} items - Array of dock items with { icon, label, onClick, href, ariaLabel }
 * @param {boolean} mobileCollapsible - Whether dock collapses on mobile (default: true)
 * @param {string} className - Additional CSS classes
 */
export default function Dock({ 
  items = [], 
  mobileCollapsible = true,
  className = '' 
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (!mobileCollapsible) {
        setIsCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mobileCollapsible]);

  const handleItemClick = (item) => {
    if (item.onClick) {
      item.onClick();
    }
    if (isMobile && mobileCollapsible) {
      setIsCollapsed(true);
    }
  };

  const handleKeyDown = (e, item) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleItemClick(item);
    }
  };

  return (
    <motion.nav
      className={`dock-container ${className}`}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={`dock ${isCollapsed ? 'dock-collapsed' : ''}`}>
        {items.map((item, index) => {
          const Icon = item.icon;
          const content = (
            <motion.button
              key={index}
              className="dock-item"
              onClick={() => handleItemClick(item)}
              onKeyDown={(e) => handleKeyDown(e, item)}
              whileHover={{ scale: 1.1, y: -8 }}
              whileTap={{ scale: 0.95 }}
              whileFocus={{ scale: 1.05, y: -4 }}
              aria-label={item.ariaLabel || item.label}
              role="button"
              tabIndex={0}
            >
              {Icon && <Icon size={24} className="dock-icon" />}
              {!isCollapsed && (
                <span className="dock-label">{item.label}</span>
              )}
            </motion.button>
          );

          if (item.href) {
            return (
              <a
                key={index}
                href={item.href}
                className="dock-link"
                aria-label={item.ariaLabel || item.label}
              >
                {content}
              </a>
            );
          }

          return content;
        })}
      </div>

      {isMobile && mobileCollapsible && (
        <motion.button
          className="dock-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          whileTap={{ scale: 0.9 }}
        >
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </motion.button>
      )}
    </motion.nav>
  );
}

