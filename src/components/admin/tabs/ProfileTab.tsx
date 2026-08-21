import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Save, Check, User, Mail, Phone, MapPin, Tag } from 'lucide-react';

export const ProfileTab: React.FC = () => {
  const { data, updatePersonal } = usePortfolio();
  const [formData, setFormData] = useState(data.personal);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePersonal(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h4 className="text-lg font-bold text-white font-display">Personal Information & Bio</h4>
          <p className="text-xs text-muted font-mono">Edit hero title, bio narrative, contact info, and availability.</p>
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Saved Changes!' : 'Save Profile'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-cyan-300 mb-1.5">FULL NAME</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-cyan-300 mb-1.5">FIRST / DISPLAY NAME</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-cyan-300 mb-1.5">PROFESSIONAL TITLE</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-cyan-300 mb-1.5">AVAILABILITY STATUS</label>
          <input
            type="text"
            value={formData.availability}
            onChange={(e) => handleChange('availability', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-mono text-cyan-300 mb-1.5">HERO TAGLINE</label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) => handleChange('tagline', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-cyan-300 mb-1.5">EMAIL ADDRESS</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-cyan-300 mb-1.5">PHONE NUMBER</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-cyan-300 mb-1.5">LOCATION (CITY, COUNTRY)</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-cyan-300 mb-1.5">FULL POSTAL ADDRESS</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-mono text-cyan-300 mb-1.5">AVATAR IMAGE URL / PATH</label>
          <input
            type="text"
            value={formData.avatarImg}
            onChange={(e) => handleChange('avatarImg', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-mono text-cyan-300 mb-1.5">ABOUT SUMMARY & BIO</label>
          <textarea
            rows={4}
            value={formData.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none resize-none"
          />
        </div>
      </div>
    </form>
  );
};
