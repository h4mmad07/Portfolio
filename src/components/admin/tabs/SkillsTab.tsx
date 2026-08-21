import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Save, Plus, Trash2, Check, Sparkles } from 'lucide-react';

export const SkillsTab: React.FC = () => {
  const { data, updateSkillCategories, updateMarqueeSkills } = usePortfolio();
  const [categories, setCategories] = useState(data.skillCategories);
  const [marqueeInput, setMarqueeInput] = useState(data.marqueeSkills.join(', '));
  const [saved, setSaved] = useState(false);

  const handleLevelChange = (catIdx: number, skillIdx: number, newLevel: number) => {
    const updated = [...categories];
    updated[catIdx].skills[skillIdx].level = newLevel;
    setCategories(updated);
  };

  const handleAddSkill = (catIdx: number) => {
    const name = prompt('Enter new skill name:');
    if (!name) return;
    const updated = [...categories];
    updated[catIdx].skills.push({ name, level: 80, icon: 'Code2' });
    setCategories(updated);
  };

  const handleDeleteSkill = (catIdx: number, skillIdx: number) => {
    const updated = [...categories];
    updated[catIdx].skills.splice(skillIdx, 1);
    setCategories(updated);
  };

  const handleSave = () => {
    updateSkillCategories(categories);
    const parsedMarquee = marqueeInput.split(',').map((s) => s.trim()).filter(Boolean);
    updateMarqueeSkills(parsedMarquee);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h4 className="text-lg font-bold text-white font-display">Technical Skills & Ticker CMS</h4>
          <p className="text-xs text-muted font-mono">Adjust proficiency sliders, add skills, and update marquee tags.</p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Saved Changes!' : 'Save All Skills'}</span>
        </button>
      </div>

      {/* Marquee Banner Input */}
      <div className="p-4 rounded-2xl bg-surface border border-white/10 space-y-2">
        <label className="block text-xs font-mono text-cyan-300">
          INFINITE MARQUEE TICKER (comma separated tags)
        </label>
        <textarea
          rows={2}
          value={marqueeInput}
          onChange={(e) => setMarqueeInput(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none resize-none"
        />
      </div>

      {/* Skill Categories */}
      <div className="space-y-6">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="p-5 rounded-2xl bg-surface border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-white text-sm font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                {cat.title}
              </h5>
              <button
                onClick={() => handleAddSkill(catIdx)}
                className="px-3 py-1 rounded-lg bg-surface-light hover:bg-white/10 text-cyan-400 text-xs font-mono border border-white/10 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Skill
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cat.skills.map((skill, sIdx) => (
                <div
                  key={sIdx}
                  className="p-3 rounded-xl bg-surface-light/80 border border-white/5 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{skill.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-cyan-400 font-bold">
                        {skill.level}%
                      </span>
                      <button
                        onClick={() => handleDeleteSkill(catIdx, sIdx)}
                        className="text-red-400/80 hover:text-red-400"
                        title="Delete skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="range"
                    min={40}
                    max={100}
                    value={skill.level}
                    onChange={(e) => handleLevelChange(catIdx, sIdx, Number(e.target.value))}
                    className="w-full accent-cyan-400 h-1 bg-surface rounded-lg cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
