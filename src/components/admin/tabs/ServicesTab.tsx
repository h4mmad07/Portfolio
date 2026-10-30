import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Service } from '../../../data/portfolioData';
import { Save, Check, Plus, Trash2 } from 'lucide-react';

export const ServicesTab: React.FC = () => {
  const { data, updateServices } = usePortfolio();
  const [services, setServices] = useState<Service[]>(data.services);
  const [saved, setSaved] = useState(false);

  const handleUpdateField = (index: number, field: keyof Service, value: any) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const handleAddService = () => {
    const newService: Service = {
      id: `service-${Date.now()}`,
      title: 'New Service',
      description: 'Describe your service here.',
      technologies: [],
      gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
      borderColor: 'group-hover:border-cyan-500/50',
      displayOrder: services.length + 1,
      isVisible: true
    };
    setServices([...services, newService]);
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
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
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddService}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Saved Changes!' : 'Save Services'}</span>
          </button>
        </div>
      </div>

      {services.length === 0 && (
        <div className="p-4 rounded-xl bg-surface-light/50 border border-white/10 text-center text-muted text-xs font-mono">
          No services yet. Click "Add Service" to create one.
        </div>
      )}

      <div className="space-y-5">
        {services.map((service, idx) => (
          <div key={service.id} className="p-5 rounded-2xl bg-surface border border-white/10 space-y-3 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-cyan-400 font-bold">SERVICE #{idx + 1}</span>
              <button
                onClick={() => handleRemoveService(idx)}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                title="Remove Service"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
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
                  onChange={(e) => handleUpdateField(idx, 'technologies', e.target.value.split(',').map((t: string) => t.trim()))}
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
