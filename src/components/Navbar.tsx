import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Menu, X, Moon, Sun, User, LogOut, Settings, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/theme/ThemeProvider';
import { logoutUser } from '@/services/auth';
import { glass } from '@/theme/tokens';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const navLinks = [
    { to: '/vehicles', label: 'Browse' },
    { to: '/how-it-works', label: 'How it Works' },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 ${glass.nav}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div whileHover={{ rotate: 15 }} className="text-blue-400">
            <Car size={28} />
          </motion.div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            ready2Wheel
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className="text-white/70 hover:text-white transition-colors text-sm font-medium"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggle}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(o => !o)}
                className="flex items-center gap-2 py-1.5 px-3 rounded-xl hover:bg-white/10 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                  {user?.displayName?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <span className="text-sm text-white/80">{user?.displayName?.split(' ')[0]}</span>
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className={`absolute right-0 mt-2 w-48 ${glass.modal} py-1`}
                  >
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User size={15} /> Dashboard
                    </Link>
                    <Link
                      to="/wishlist"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Heart size={15} /> Wishlist
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Settings size={15} /> Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-white/10" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm text-white/70 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-sm bg-blue-600/80 hover:bg-blue-500 border border-blue-400/30 text-white px-4 py-1.5 rounded-xl transition-all font-medium"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => setMenuOpen(o => !o)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-black/40 backdrop-blur-2xl"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-white/80 hover:text-white py-2 text-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-white/80 py-2 text-sm" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-red-400 py-2 text-sm text-left">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/signup" className="bg-blue-600 text-white py-2.5 px-4 rounded-xl text-center text-sm font-medium" onClick={() => setMenuOpen(false)}>
                  Get Started
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
