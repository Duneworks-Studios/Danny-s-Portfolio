'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Camera, Code, User, Mail, Shield, LogOut, Check, Palette } from 'lucide-react';
import { useState, useEffect } from 'react';

const navItems = [
  { name: 'Home', path: '/', icon: null },
  { name: 'Photography', path: '/photography', icon: Camera },
  { name: 'Development', path: '/development', icon: Code },
  { name: 'Renders', path: '/renders', icon: Palette },
  { name: 'About', path: '/about', icon: User },
  { name: 'Contact', path: '/contact', icon: Mail },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if we're on an admin route
  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    const checkAuth = async () => {
      if (isCheckingAuth) return; // Prevent duplicate requests
      
      setIsCheckingAuth(true);
      try {
        const response = await fetch('/api/auth/verify');
        if (!response.ok) {
          throw new Error('Auth check failed');
        }
        const data = await response.json();
        setIsAuthenticated(data.authenticated || false);
        if (data.authenticated && data.email) {
          const name = data.email.split('@')[0];
          setUserEmail(name.charAt(0).toUpperCase() + name.slice(1));
        } else {
          setUserEmail('');
        }
      } catch (error) {
        console.log('Auth check failed, user not authenticated');
        setIsAuthenticated(false);
        setUserEmail('');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []); // Only run once on mount

  // Close mobile menu when clicking outside or on route change
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (mobileMenuOpen && !target.closest('nav')) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/login', { method: 'DELETE' });
      setIsAuthenticated(false);
      setUserEmail('');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDashboardClick = () => {
    // Verify authentication before navigating
    if (isAuthenticated) {
      router.push('/admin/dashboard');
    } else {
      router.push('/admin/login');
    }
  };

  // Function to refresh auth state (can be called from login page)
  const refreshAuthState = async () => {
    if (isCheckingAuth) return; // Prevent duplicate requests
    
    setIsCheckingAuth(true);
    try {
      const response = await fetch('/api/auth/verify');
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
      if (data.authenticated && data.email) {
        const name = data.email.split('@')[0];
        setUserEmail(name.charAt(0).toUpperCase() + name.slice(1));
      } else {
        setUserEmail('');
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUserEmail('');
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Expose refresh function globally for login page to use
  useEffect(() => {
    (window as any).refreshNavbarAuth = refreshAuthState;
    return () => {
      delete (window as any).refreshNavbarAuth;
    };
  }, []);

  // Admin navbar (slim)
  if (isAdminRoute) {
    return (
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="admin-navbar"
      >
              {/* Logo */}
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer"
                >
                  <Image
                    src="https://cdn.discordapp.com/guilds/1346430701792395315/users/909102922246275152/avatars/36fe0eeea8578b0dd4032fe8b2de8c7d.webp?size=1024"
                    alt="Duneworks Studios Logo"
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                </motion.div>
              </Link>

        {/* Admin User Info */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg overflow-hidden">
                  <Image
                    src="https://cdn.discordapp.com/guilds/1346430701792395315/users/909102922246275152/avatars/36fe0eeea8578b0dd4032fe8b2de8c7d.webp?size=1024"
                    alt="Duneworks Studios Logo"
                    width={24}
                    height={24}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm text-white">
                  Logged in as <span className="text-white font-medium">{userEmail}</span>
                </span>
              </div>
              <motion.button
                onClick={handleDashboardClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="logged-in-button logged-in-button-with-hover flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-white"
              >
                <Check size={16} />
                <span className="font-medium">Logged In</span>
                <div className="hover-text">Logged in as {userEmail}</div>
              </motion.button>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button flex items-center gap-1 px-3 py-1.5 rounded-lg text-red-400 hover:text-red-300 hover:border-red-400/50 text-sm"
              >
                <LogOut size={16} />
                <span className="font-medium">Logout</span>
              </motion.button>
            </>
          ) : (
            <Link href="/admin/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-white"
              >
                <Shield size={16} />
                <span className="font-medium">Login</span>
              </motion.button>
            </Link>
          )}
        </div>
      </motion.nav>
    );
  }

  // Regular navbar (public pages)
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 sm:py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass-navbar rounded-2xl px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
                  {/* Logo */}
                  <Link href="/">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer"
                    >
                      <Image
                        src="https://cdn.discordapp.com/guilds/1346430701792395315/users/909102922246275152/avatars/36fe0eeea8578b0dd4032fe8b2de8c7d.webp?size=1024"
                        alt="Duneworks Studios Logo"
                        width={40}
                        height={40}
                        className="rounded-lg"
                      />
                    </motion.div>
                  </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Link key={item.path} href={item.path}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative px-4 py-2 rounded-xl cursor-pointer flex items-center gap-2 ${
                        isActive 
                          ? 'bg-white/10 text-white' 
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {Icon && <Icon size={18} />}
                      <span className="font-medium">{item.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 border-2 border-white/30 rounded-xl"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Admin Login Button */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-lg overflow-hidden">
                      <Image
                        src="https://cdn.discordapp.com/guilds/1346430701792395315/users/909102922246275152/avatars/36fe0eeea8578b0dd4032fe8b2de8c7d.webp?size=1024"
                        alt="Duneworks Studios Logo"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm text-white">
                      Logged in as <span className="text-white font-medium">{userEmail}</span>
                    </span>
                  </div>
                  <motion.button
                    onClick={handleDashboardClick}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="logged-in-button logged-in-button-with-hover flex items-center gap-2 px-4 py-2 rounded-xl text-white"
                  >
                    <Check size={18} />
                    <span className="font-medium">Logged In</span>
                    <div className="hover-text">Logged in as {userEmail}</div>
                  </motion.button>
                  <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass-button flex items-center gap-2 px-4 py-2 rounded-xl text-red-400 hover:text-red-300 hover:border-red-400/50"
                  >
                    <LogOut size={18} />
                    <span className="font-medium">Logout</span>
                  </motion.button>
                </>
              ) : (
                <Link href="/admin/login">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass-button flex items-center gap-2 px-4 py-2 rounded-xl text-white"
                  >
                    <Shield size={18} />
                    <span className="font-medium">Login</span>
                  </motion.button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg glass-light text-white"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Nav Links */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 space-y-2"
            >
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              
              return (
                  <Link key={item.path} href={item.path} onClick={() => setMobileMenuOpen(false)}>
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                        isActive 
                          ? 'bg-white/10 text-white border border-white/30' 
                          : 'text-gray-300 glass-light'
                      }`}
                    >
                      {Icon && <Icon size={18} />}
                      <span className="font-medium">{item.name}</span>
                    </motion.div>
                  </Link>
              );
            })}
            
            {/* Mobile Admin Section */}
            {isAuthenticated ? (
              <>
                <div className="px-4 py-3 rounded-xl glass-card flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden">
                    <Image
                      src="https://cdn.discordapp.com/guilds/1346430701792395315/users/909102922246275152/avatars/36fe0eeea8578b0dd4032fe8b2de8c7d.webp?size=1024"
                      alt="Duneworks Studios Logo"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm text-white">
                    Logged in as <span className="text-white font-medium">{userEmail}</span>
                  </span>
                </div>
                <motion.div
                  onClick={() => {
                    handleDashboardClick();
                    setMobileMenuOpen(false);
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-3 rounded-xl flex items-center gap-2 logged-in-button logged-in-button-with-hover cursor-pointer"
                >
                  <Check size={18} />
                  <span className="font-medium">Logged In</span>
                  <div className="hover-text">Logged in as {userEmail}</div>
                </motion.div>
                <motion.div
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-3 rounded-xl flex items-center gap-2 glass-button text-white hover:text-white cursor-pointer"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Logout</span>
                </motion.div>
              </>
            ) : (
              <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)}>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-3 rounded-xl flex items-center gap-2 glass-button text-white"
                >
                  <Shield size={18} />
                  <span className="font-medium">Admin Login</span>
                </motion.div>
              </Link>
            )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
