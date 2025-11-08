'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Camera, Code, User, Mail, Palette, Shield } from 'lucide-react';
import './TopNavbar.css';

interface NavItem {
  icon: React.ComponentType<{ size?: string | number; className?: string }>;
  label: string;
  href: string;
  ariaLabel?: string;
}

interface TopNavbarProps {
  items?: NavItem[];
}

export default function TopNavbar({ items }: TopNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const defaultItems: NavItem[] = [
    { icon: Home, label: 'Home', href: '/', ariaLabel: 'Navigate to home page' },
    { icon: Camera, label: 'Photography', href: '/photography', ariaLabel: 'Navigate to photography gallery' },
    { icon: Code, label: 'Development', href: '/development', ariaLabel: 'Navigate to development projects' },
    { icon: Palette, label: 'Renders', href: '/renders', ariaLabel: 'Navigate to renders gallery' },
    { icon: User, label: 'About', href: '/about', ariaLabel: 'Navigate to about page' },
    { icon: Mail, label: 'Contact', href: '/contact', ariaLabel: 'Navigate to contact page' },
  ];

  const navItems = items || defaultItems;

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="top-navbar" role="navigation" aria-label="Main navigation">
      <div className="top-navbar-container">
        <div className="top-navbar-items">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`top-navbar-item ${isActive ? 'active' : ''}`}
                aria-label={item.ariaLabel || item.label}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(item.href);
                }}
              >
                <Icon size={18} className="top-navbar-icon" />
                <span className="top-navbar-label">{item.label}</span>
              </a>
            );
          })}
        </div>
        <div className="top-navbar-auth">
          <button
            type="button"
            className="top-navbar-auth-button top-navbar-login"
            onClick={() => router.push('/admin/login')}
            aria-label="Admin login"
          >
            <Shield size={18} className="top-navbar-icon" />
            <span>Admin Login</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

