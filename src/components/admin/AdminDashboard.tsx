import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  LogOut, 
  User, 
  Layers, 
  Sparkles, 
  Briefcase, 
  ShieldCheck, 
  Cpu, 
  FolderKanban 
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ProfileTab } from './tabs/ProfileTab';
import { ProjectsTab } from './tabs/ProjectsTab';
import { SkillsTab } from './tabs/SkillsTab';
import { ServicesTab } from './tabs/ServicesTab';
import { ExperienceTab } from './tabs/ExperienceTab';
import { SecurityTab } from './tabs/SecurityTab';

export const AdminDashboard: React.FC = () => {
  const { isAdminOpen, setIsAdminOpen, isAuthenticated, logout } = usePortfolio();
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'skills' | 'services' | 'experience' | 'security'>('profile');

  if (!isAdminOpen || !isAuthenticated) return null;

  const navTabs = [
    { id: 'profile', label: 'Profile & Bio', icon: <User className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects CMS', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills & Marquee', icon: <Cpu className="w-4 h-4" /> },
    { id: 'services', label: 'Services', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'experience', label: 'Journey & Edu', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'security', label: 'Security & Export', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAdminOpen(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Dashboard Shell */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-6xl h-[92vh] bg-surface-light border border-white/15 rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden"
        >
          {/* Top Bar */}
          <div className="px-6 py-4 bg-surface border-b border-white/10 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-mono font-bold text-xs text-slate-950">
                ADM
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  Portfolio Control Center
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                    LIVE SYNC
                  </span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-xl bg-surface-light hover:bg-red-500/20 text-red-400 border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-colors"
                title="Lock and Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>

              <button
                onClick={() => setIsAdminOpen(false)}
                className="p-2 rounded-xl bg-surface-light hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                title="Close Dashboard"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Layout */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-60 bg-surface/90 border-r border-white/10 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto flex-shrink-0">
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-medium transition-all text-left whitespace-nowrap md:whitespace-normal ${
                    activeTab === tab.id
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-surface-light/50">
              {activeTab === 'profile' && <ProfileTab />}
              {activeTab === 'projects' && <ProjectsTab />}
              {activeTab === 'skills' && <SkillsTab />}
              {activeTab === 'services' && <ServicesTab />}
              {activeTab === 'experience' && <ExperienceTab />}
              {activeTab === 'security' && <SecurityTab />}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
