import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, Lock } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Navbar: React.FC = () => {
  const { data, setIsAdminOpen, isAuthenticated } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Journey', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ['hero', 'about', 'services', 'projects', 'skills', 'experience', 'contact'];
      const current = sections.find((section) => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 200 && rect.bottom >= 200;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'py-3.5 bg-surface/85 backdrop-blur-md border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo (Double click to open Admin Panel) */}
        <div
          onDoubleClick={() => setIsAdminOpen(true)}
          className="group flex items-center gap-3 cursor-pointer select-none"
          title="Double-click to open Admin Portal"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 p-[1.5px] shadow-[0_0_15px_rgba(0,242,254,0.3)] group-hover:shadow-[0_0_25px_rgba(0,242,254,0.6)] transition-all">
            <div className="w-full h-full bg-surface rounded-[10px] flex items-center justify-center font-mono font-bold text-sm text-cyan-300">
              MH
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight font-display text-white group-hover:text-cyan-300 transition-colors">
              {data.personal.fullName}
            </span>
            <span className="text-[11px] font-mono text-muted flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {data.personal.availability}
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 px-4 py-1.5 rounded-full bg-surface-light/60 border border-white/10 backdrop-blur-md shadow-inner">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.name}
                href={link.href}
                className={`relative px-4 py-1.5 text-xs font-medium transition-all rounded-full ${
                  isActive
                    ? 'text-cyan-300 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 rounded-full bg-cyan-500/20 border border-cyan-400/40"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Action Button & Stealth Admin */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setIsAdminOpen(true)}
            className={`p-2 rounded-xl border transition-all ${
              isAuthenticated
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-surface-light border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40'
            }`}
            title={isAuthenticated ? 'Admin Panel (Active)' : 'Admin Lock (Ctrl+Shift+A)'}
          >
            <Lock className="w-4 h-4" />
          </button>

          <a
            href="#contact"
            className="relative group px-4 py-2 rounded-xl text-xs font-semibold overflow-hidden transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:from-cyan-400 group-hover:to-blue-500 transition-all rounded-xl shadow-[0_0_20px_rgba(0,242,254,0.3)]" />
            <span className="relative z-10 flex items-center gap-1.5 text-slate-950 font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Let's Connect
            </span>
          </a>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setIsAdminOpen(true)}
            className="p-2 rounded-xl bg-surface-light border border-white/10 text-slate-400"
            title="Admin"
          >
            <Lock className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-surface-light border border-white/10 text-slate-300 hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface/95 backdrop-blur-xl border-b border-white/10 px-6 py-6"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-slate-200 hover:text-cyan-400 py-2 border-b border-white/5 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 text-center py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm"
              >
                Let's Connect
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
