import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Plus, Trash2, Check, X, Briefcase, GraduationCap } from 'lucide-react';
import { Experience, Education } from '../../../types/portfolio';

export const ExperienceTab: React.FC = () => {
  const { 
    data, 
    addExperience, 
    deleteExperience,
    addEducation,
    deleteEducation
  } = usePortfolio();

  const [isAddingExp, setIsAddingExp] = useState(false);
  const [isAddingEdu, setIsAddingEdu] = useState(false);

  const [expForm, setExpForm] = useState({
    role: '',
    company: '',
    period: '2025 – Present',
    location: 'Multan, Pakistan',
    responsibilitiesText: '',
    tagsText: ''
  });

  const [eduForm, setEduForm] = useState({
    degree: '',
    institution: '',
    period: '2023 – 2027',
    location: 'Multan, Pakistan',
    badge: 'In Progress',
    description: ''
  });

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    const responsibilities = expForm.responsibilitiesText.split('\n').map((s) => s.trim()).filter(Boolean);
    const tags = expForm.tagsText.split(',').map((s) => s.trim()).filter(Boolean);

    await addExperience({
      role: expForm.role,
      company: expForm.company,
      period: expForm.period,
      location: expForm.location,
      responsibilities,
      tags
    });

    setIsAddingExp(false);
    setExpForm({ role: '', company: '', period: '', location: '', responsibilitiesText: '', tagsText: '' });
  };

  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    await addEducation({
      degree: eduForm.degree,
      institution: eduForm.institution,
      period: eduForm.period,
      location: eduForm.location,
      badge: eduForm.badge,
      description: eduForm.description
    });

    setIsAddingEdu(false);
    setEduForm({ degree: '', institution: '', period: '', location: '', badge: '', description: '' });
  };

  return (
    <div className="space-y-8">
      {/* Experience Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              Professional Experience & Leadership
            </h4>
            <p className="text-xs text-muted font-mono">Manage job roles, responsibilities, and leadership credentials.</p>
          </div>
          {!isAddingExp && (
            <button
              onClick={() => setIsAddingExp(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Role</span>
            </button>
          )}
        </div>

        {isAddingExp && (
          <form onSubmit={handleSaveExp} className="p-5 rounded-2xl bg-surface border border-white/15 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-white text-xs font-mono uppercase text-cyan-300">New Experience Role</h5>
              <button type="button" onClick={() => setIsAddingExp(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">JOB ROLE / TITLE *</label>
                <input
                  type="text"
                  required
                  value={expForm.role}
                  onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                  placeholder="e.g. Lead Software Engineer"
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">ORGANIZATION / COMPANY *</label>
                <input
                  type="text"
                  required
                  value={expForm.company}
                  onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                  placeholder="e.g. Tech Studio / MNSUAM"
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">PERIOD / DURATION *</label>
                <input
                  type="text"
                  required
                  value={expForm.period}
                  onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                  placeholder="e.g. 2025 – Present"
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">LOCATION</label>
                <input
                  type="text"
                  value={expForm.location}
                  onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                  placeholder="e.g. Multan, Pakistan"
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono text-slate-300 mb-1">KEY RESPONSIBILITIES (ONE PER LINE)</label>
                <textarea
                  rows={3}
                  required
                  value={expForm.responsibilitiesText}
                  onChange={(e) => setExpForm({ ...expForm, responsibilitiesText: e.target.value })}
                  placeholder="Architecting modular software systems&#10;Leading multimedia production workflows"
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono text-slate-300 mb-1">SKILL TAGS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={expForm.tagsText}
                  onChange={(e) => setExpForm({ ...expForm, tagsText: e.target.value })}
                  placeholder="C++, Software Design, Video Production"
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingExp(false)}
                className="px-3 py-1.5 rounded-lg bg-surface-light hover:bg-white/10 text-xs font-mono text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Experience</span>
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {data.experience.map((exp) => (
            <div key={exp.id} className="p-4 rounded-2xl bg-surface border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-white text-sm">{exp.role}</h5>
                  <p className="text-xs text-cyan-400 font-mono">{exp.company} • {exp.period}</p>
                </div>
                <button
                  onClick={() => {
                    if (confirm(`Delete role "${exp.role}"?`)) {
                      deleteExperience(exp.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-surface-light hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                {exp.responsibilities.map((r, rIdx) => (
                  <li key={rIdx}>{r}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              Academic Education
            </h4>
            <p className="text-xs text-muted font-mono">University degree and academic curriculum credentials.</p>
          </div>
          {!isAddingEdu && (
            <button
              onClick={() => setIsAddingEdu(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs shadow transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Degree</span>
            </button>
          )}
        </div>

        {isAddingEdu && (
          <form onSubmit={handleSaveEdu} className="p-5 rounded-2xl bg-surface border border-white/15 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-white text-xs font-mono uppercase text-purple-300">New Degree Entry</h5>
              <button type="button" onClick={() => setIsAddingEdu(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">DEGREE PROGRAM *</label>
                <input
                  type="text"
                  required
                  value={eduForm.degree}
                  onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  placeholder="e.g. BS in Computer Science"
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">INSTITUTION / UNIVERSITY *</label>
                <input
                  type="text"
                  required
                  value={eduForm.institution}
                  onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                  placeholder="e.g. MNSUAM"
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">PERIOD *</label>
                <input
                  type="text"
                  required
                  value={eduForm.period}
                  onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                  placeholder="e.g. 2023 – 2027"
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">BADGE / STATUS</label>
                <input
                  type="text"
                  value={eduForm.badge}
                  onChange={(e) => setEduForm({ ...eduForm, badge: e.target.value })}
                  placeholder="e.g. In Progress / Completed"
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono text-slate-300 mb-1">CURRICULUM DESCRIPTION</label>
                <textarea
                  rows={2}
                  value={eduForm.description}
                  onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })}
                  placeholder="Data Structures, Algorithms, AI, Distributed Databases..."
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingEdu(false)}
                className="px-3 py-1.5 rounded-lg bg-surface-light hover:bg-white/10 text-xs font-mono text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs shadow"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Education</span>
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {data.education.map((edu) => (
            <div key={edu.id} className="p-4 rounded-2xl bg-surface border border-white/10 space-y-1">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-white text-sm">{edu.degree}</h5>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-mono">
                    {edu.period}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm(`Delete degree "${edu.degree}"?`)) {
                        deleteEducation(edu.id);
                      }
                    }}
                    className="p-1 rounded bg-surface-light hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-300 font-medium">{edu.institution}</p>
              {edu.description && <p className="text-[11px] text-muted">{edu.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
