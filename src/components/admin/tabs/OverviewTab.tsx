import React from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { 
  FolderKanban, 
  Cpu, 
  Award, 
  Briefcase, 
  Mail, 
  FileText, 
  ExternalLink, 
  Sparkles,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';

interface OverviewTabProps {
  onSelectTab: (tabId: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onSelectTab }) => {
  const { data, inquiries, isConfigured } = usePortfolio();

  const publishedProjects = (data.projects || []).filter((p) => p.isPublished !== false).length;
  const totalSkills = (data.skillCategories || []).reduce((acc, cat) => acc + (cat.skills?.length || 0), 0);
  const totalCerts = (data.certifications || []).length;
  const unreadMessages = inquiries.filter((m) => !m.isRead).length;

  const statCards = [
    {
      title: 'Projects',
      count: data.projects.length,
      sub: `${publishedProjects} Published`,
      icon: <FolderKanban className="w-5 h-5 text-cyan-400" />,
      tab: 'projects',
      border: 'hover:border-cyan-500/50'
    },
    {
      title: 'Certifications',
      count: totalCerts,
      sub: 'Verified Credentials',
      icon: <Award className="w-5 h-5 text-purple-400" />,
      tab: 'certifications',
      border: 'hover:border-purple-500/50'
    },
    {
      title: 'Tech Skills',
      count: totalSkills,
      sub: `${data.marqueeSkills?.length || 0} in Marquee`,
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
      tab: 'skills',
      border: 'hover:border-emerald-500/50'
    },
    {
      title: 'Inquiries',
      count: inquiries.length,
      sub: `${unreadMessages} Unread Messages`,
      icon: <Mail className="w-5 h-5 text-amber-400" />,
      tab: 'inquiries',
      border: 'hover:border-amber-500/50'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-900/30 via-surface to-purple-900/20 border border-white/10 relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PORTFOLIO MISSION CONTROL</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Welcome back, {data.personal.firstName}!
          </h3>
          <p className="mt-2 text-sm text-slate-300 font-sans leading-relaxed">
            Manage your personal portfolio, upload project showcases and screenshots, replace your authentic PDF CV, and monitor incoming visitor messages with real-time cloud synchronization.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => onSelectTab(card.tab)}
            className={`p-5 rounded-2xl bg-surface border border-white/10 transition-all cursor-pointer hover:-translate-y-1 ${card.border}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-muted uppercase">{card.title}</span>
              <div className="p-2 rounded-xl bg-surface-light border border-white/5">
                {card.icon}
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-display">
              {card.count}
            </div>
            <div className="text-xs font-mono text-cyan-400/90 mt-1 flex items-center justify-between">
              <span>{card.sub}</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & System Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Launch */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-surface border border-white/10 space-y-4">
          <h4 className="font-bold text-white text-base font-display flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Quick Management Shortcuts</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => onSelectTab('projects')}
              className="p-3.5 rounded-xl bg-surface-light hover:bg-white/10 border border-white/10 text-left transition-colors"
            >
              <span className="block text-xs font-mono text-white font-bold">Add New Project</span>
              <span className="block text-[11px] text-muted">Upload screenshots and live links</span>
            </button>

            <button
              onClick={() => onSelectTab('media')}
              className="p-3.5 rounded-xl bg-surface-light hover:bg-white/10 border border-white/10 text-left transition-colors"
            >
              <span className="block text-xs font-mono text-white font-bold">Upload / Replace CV</span>
              <span className="block text-[11px] text-muted">Deploy your latest master PDF resume</span>
            </button>

            <button
              onClick={() => onSelectTab('profile')}
              className="p-3.5 rounded-xl bg-surface-light hover:bg-white/10 border border-white/10 text-left transition-colors"
            >
              <span className="block text-xs font-mono text-white font-bold">Update Profile & Avatar</span>
              <span className="block text-[11px] text-muted">Change hero bio and photo</span>
            </button>

            <button
              onClick={() => onSelectTab('settings')}
              className="p-3.5 rounded-xl bg-surface-light hover:bg-white/10 border border-white/10 text-left transition-colors"
            >
              <span className="block text-xs font-mono text-white font-bold">Section Visibility</span>
              <span className="block text-[11px] text-muted">Enable or disable site sections</span>
            </button>
          </div>
        </div>

        {/* Sync Info */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-surface border border-white/10 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-white text-base font-display flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Cloud State</span>
            </h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Every save action synchronizes automatically with Supabase PostgreSQL and Object Storage.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-surface-light border border-white/5 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-muted">Database Engine:</span>
                <span className="text-white">PostgreSQL (Supabase)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Row Level Security:</span>
                <span className="text-emerald-400">Strict Enforced</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Media CDN:</span>
                <span className="text-cyan-400">Public Object Storage</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-bold"
            >
              <span>Open Public Website in new tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
