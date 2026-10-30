import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { 
  Settings, 
  Save, 
  Check, 
  Sliders, 
  Globe, 
  ShieldCheck, 
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Database
} from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const { data, updateSettings, toggleSectionVisibility, isConfigured } = usePortfolio();
  const [form, setForm] = useState(data.settings);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sectionsList: Array<{ key: keyof typeof data.settings.sectionsVisibility; label: string; desc: string }> = [
    { key: 'hero', label: 'Hero 3D Section', desc: 'Main title, interactive 3D canvas, metrics & resume CTA' },
    { key: 'about', label: 'About & Biography', desc: 'Narrative summary, personal details, and live time clock' },
    { key: 'services', label: 'Services / What I Do', desc: 'Engineering pillars & capability cards' },
    { key: 'skills', label: 'Tech Stack & Skills', desc: 'Categorized proficiency meters and scrolling marquee' },
    { key: 'projects', label: 'Projects Showcase', desc: 'Featured applications, games, and system architecture deep-dives' },
    { key: 'certifications', label: 'Certifications', desc: 'Verified technical badges, CS/AI credentials, and honors' },
    { key: 'experience', label: 'Experience & Education', desc: 'Work history timeline, leadership roles, and academic degrees' },
    { key: 'contact', label: 'Contact Form', desc: 'Direct message submission form and contact metadata' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-lg font-bold text-white font-display">Website Settings & SEO</h4>
          <p className="text-xs text-muted font-mono">
            Control brand tokens, global metadata, and toggle section visibility across the entire portfolio.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Saved Settings!' : 'Save Website Settings'}</span>
        </button>
      </div>

      {/* Cloud Status Banner */}
      <div className="p-5 rounded-2xl bg-surface border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl border ${
            isConfigured ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}>
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h5 className="font-bold text-white text-sm font-display flex items-center gap-2">
              Cloud Database & Storage Status
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                isConfigured
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {isConfigured ? 'CONNECTED' : 'LOCAL CACHE MODE'}
              </span>
            </h5>
            <p className="text-xs text-muted font-mono mt-0.5">
              {isConfigured
                ? 'Changes are committed live to Supabase PostgreSQL & Realtime Channel.'
                : 'Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel to activate cloud sync.'}
            </p>
          </div>
        </div>
      </div>

      {/* Section Visibility Controls */}
      <div className="p-6 rounded-3xl bg-surface border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-cyan-400">
          <Sliders className="w-5 h-5" />
          <h5 className="font-bold text-white text-base font-display">Section Visibility Controls</h5>
        </div>
        <p className="text-xs text-muted font-mono">
          Enable or disable sections on the public site without touching source code.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {sectionsList.map((sec) => {
            const isVisible = data.settings?.sectionsVisibility?.[sec.key] !== false;
            return (
              <div
                key={sec.key}
                onClick={() => toggleSectionVisibility(sec.key)}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all select-none ${
                  isVisible
                    ? 'bg-surface-light border-cyan-500/40 hover:border-cyan-400'
                    : 'bg-surface/50 border-white/5 opacity-60 hover:opacity-100'
                }`}
              >
                <div>
                  <h6 className="font-bold text-white text-xs font-display flex items-center gap-2">
                    <span>{sec.label}</span>
                    <span className={`w-2 h-2 rounded-full ${isVisible ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  </h6>
                  <p className="text-[11px] text-muted font-sans mt-0.5">{sec.desc}</p>
                </div>

                <div className="text-cyan-400 flex-shrink-0 ml-3">
                  {isVisible ? <ToggleRight className="w-6 h-6 text-cyan-400" /> : <ToggleLeft className="w-6 h-6 text-slate-500" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEO & Brand Tokens */}
      <form onSubmit={handleSave} className="p-6 rounded-3xl bg-surface border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-purple-400">
          <Globe className="w-5 h-5" />
          <h5 className="font-bold text-white text-base font-display">Brand & Search Engine Optimization (SEO)</h5>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-[11px] font-mono text-slate-300 mb-1">BRAND / LOGO MONOGRAM</label>
            <input
              type="text"
              value={form.logoText || 'MH'}
              onChange={(e) => setForm({ ...form, logoText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-300 mb-1">THEME ACCENT</label>
            <input
              type="text"
              value={form.themeAccent || 'cyan'}
              onChange={(e) => setForm({ ...form, themeAccent: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-mono text-slate-300 mb-1">GLOBAL PAGE TITLE (BROWSER TAB)</label>
            <input
              type="text"
              value={form.siteTitle || ''}
              onChange={(e) => setForm({ ...form, siteTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-mono text-slate-300 mb-1">META DESCRIPTION (GOOGLE / SOCIAL CARDS)</label>
            <textarea
              rows={3}
              value={form.metaDescription || ''}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
