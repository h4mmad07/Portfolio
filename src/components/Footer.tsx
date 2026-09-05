import React from 'react';
import { ArrowUp, Lock, FileText } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface FooterProps {
  onOpenResume?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenResume }) => {
  const { data, setIsAdminOpen, isAuthenticated } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-12 bg-surface border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div 
              onDoubleClick={() => setIsAdminOpen(true)}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-[1.5px] cursor-pointer"
              title="Double-click for Admin"
            >
              <div className="w-full h-full bg-surface rounded-[6px] flex items-center justify-center font-mono font-bold text-xs text-cyan-300">
                MH
              </div>
            </div>
            <span className="font-bold text-sm text-white font-display">
              {data.personal.fullName}
            </span>
            <span className="text-xs text-muted font-mono">
              © {new Date().getFullYear()} All rights reserved.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
            <a href="#services" className="hover:text-cyan-400 transition-colors">Services</a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors">Projects</a>
            <a href="#skills" className="hover:text-cyan-400 transition-colors">Skills</a>
            {onOpenResume && (
              <button
                onClick={onOpenResume}
                className="hover:text-cyan-300 transition-colors flex items-center gap-1 text-cyan-400 font-medium"
              >
                <FileText className="w-3.5 h-3.5" />
                Resume PDF
              </button>
            )}
            <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminOpen(true)}
              className={`p-2.5 rounded-xl border transition-all text-xs font-mono flex items-center gap-1.5 ${
                isAuthenticated 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-surface-light border-white/10 text-muted hover:text-white'
              }`}
              title="Admin Portal (Ctrl+Shift+A)"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isAuthenticated ? 'Admin Active' : 'Admin'}</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-3 rounded-xl bg-surface-light border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all shadow-sm"
              aria-label="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
