import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard,
  User, 
  FolderKanban, 
  Award, 
  Cpu, 
  Sparkles, 
  Briefcase, 
  FileText, 
  Mail, 
  Settings as SettingsIcon, 
  ShieldCheck, 
  LogOut, 
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  Database,
  CheckCircle2
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

// Tabs
import { OverviewTab } from './tabs/OverviewTab';
import { ProfileTab } from './tabs/ProfileTab';
import { ProjectsTab } from './tabs/ProjectsTab';
import { CertificationsTab } from './tabs/CertificationsTab';
import { SkillsTab } from './tabs/SkillsTab';
import { ServicesTab } from './tabs/ServicesTab';
import { ExperienceTab } from './tabs/ExperienceTab';
import { MediaTab } from './tabs/MediaTab';
import { InquiriesTab } from './tabs/InquiriesTab';
import { SettingsTab } from './tabs/SettingsTab';
import { SecurityTab } from './tabs/SecurityTab';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, adminUserEmail, logout, isConfigured, inquiries } = usePortfolio();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'profile' | 'projects' | 'certifications' | 'skills' | 'services' | 'experience' | 'media' | 'inquiries' | 'settings' | 'security'
  >('overview');

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to login if unauthenticated
  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const unreadCount = inquiries.filter((m) => !m.isRead).length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile & Bio', icon: <User className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects CMS', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'certifications', label: 'Certifications', icon: <Award className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills & Marquee', icon: <Cpu className="w-4 h-4" /> },
    { id: 'services', label: 'Services', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'experience', label: 'Journey & Edu', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'media', label: 'Resume & Media', icon: <FileText className="w-4 h-4" /> },
    { 
      id: 'inquiries', 
      label: 'Inquiries Inbox', 
      icon: <Mail className="w-4 h-4" />,
      badge: unreadCount > 0 ? unreadCount : undefined 
    },
    { id: 'settings', label: 'Website Settings', icon: <SettingsIcon className="w-4 h-4" /> },
    { id: 'security', label: 'Security & Backup', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <header className="h-16 px-4 sm:px-6 bg-surface/90 border-b border-white/10 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-xl bg-surface-light border border-white/10 text-slate-300"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-mono font-bold text-xs text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
            ADM
          </div>

          <div className="hidden sm:block">
            <h2 className="text-sm font-bold text-white font-display flex items-center gap-2">
              Portfolio Control Center
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                isConfigured
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {isConfigured ? 'CLOUD SYNC' : 'LOCAL CACHE'}
              </span>
            </h2>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-2.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-light hover:bg-white/10 text-slate-200 text-xs font-mono border border-white/10 transition-colors"
            title="Open live public portfolio in a new tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>View Live Site</span>
          </a>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-light hover:bg-red-500/20 text-red-400 border border-white/10 text-xs font-mono transition-colors"
            title="Log Out & Lock Portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-surface/70 border-r border-white/10 p-4 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-mono uppercase text-muted tracking-wider">
            Management Suite
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-semibold shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px] font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Mobile Drawer Menu */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-30 bg-black/80 backdrop-blur-md flex flex-col p-4 pt-20">
            <div className="flex-1 overflow-y-auto space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-background/50">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'overview' && <OverviewTab onSelectTab={(t) => setActiveTab(t as any)} />}
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'projects' && <ProjectsTab />}
            {activeTab === 'certifications' && <CertificationsTab />}
            {activeTab === 'skills' && <SkillsTab />}
            {activeTab === 'services' && <ServicesTab />}
            {activeTab === 'experience' && <ExperienceTab />}
            {activeTab === 'media' && <MediaTab />}
            {activeTab === 'inquiries' && <InquiriesTab />}
            {activeTab === 'settings' && <SettingsTab />}
            {activeTab === 'security' && <SecurityTab />}
          </div>
        </main>
      </div>
    </div>
  );
};
