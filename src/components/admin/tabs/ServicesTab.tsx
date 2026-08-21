import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Service } from '../../../data/portfolioData';
import { Save, Check } from 'lucide-react';

export const ServicesTab: React.FC = () => {
  const { data, updateServices } = usePortfolio();
  const [services, setServices] = useState<Service[]>(data.services);
  const [saved, setSaved] = useState(false);

  const handleUpdateField = (index: number, field: keyof Service, value: any) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const handleSave = () => {
    updateServices(services);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h4 className="text-lg font-bold text-white font-display">Services & Expertise</h4>
          <p className="text-xs text-muted font-mono">Edit services displayed in the "What I Do" section.</p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Saved Changes!' : 'Save Services'}</span>
        </button>
      </div>

      <div className="space-y-5">
        {services.map((service, idx) => (
          <div key={service.id} className="p-5 rounded-2xl bg-surface border border-white/10 space-y-3">
            <span className="text-xs font-mono text-cyan-400 font-bold">SERVICE #{idx + 1}</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">TITLE</label>
                <input
                  type="text"
                  value={service.title}
                  onChange={(e) => handleUpdateField(idx, 'title', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">TECHNOLOGIES (comma separated)</label>
                <input
                  type="text"
                  value={service.technologies.join(', ')}
                  onChange={(e) => handleUpdateField(idx, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">DESCRIPTION</label>
              <textarea
                rows={2}
                value={service.description}
                onChange={(e) => handleUpdateField(idx, 'description', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none resize-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
