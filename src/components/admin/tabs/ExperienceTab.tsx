import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Plus, Trash2, Edit2, Check, X, Briefcase, GraduationCap } from 'lucide-react';
import { Experience, Education } from '../../../data/portfolioData';

export const ExperienceTab: React.FC = () => {
  const { 
    data, 
    addExperience, 
    updateExperience, 
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation
  } = usePortfolio();

  return (
    <div className="space-y-8">
      {/* Experience Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              Professional Experience & Leadership
            </h4>
          </div>
        </div>

        <div className="space-y-3">
          {data.experience.map((exp, idx) => (
            <div key={exp.id || idx} className="p-4 rounded-2xl bg-surface border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-white text-sm">{exp.role}</h5>
                  <p className="text-xs text-cyan-400 font-mono">{exp.company} • {exp.period}</p>
                </div>
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
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              Academic Education
            </h4>
          </div>
        </div>

        <div className="space-y-3">
          {data.education.map((edu, idx) => (
            <div key={edu.id || idx} className="p-4 rounded-2xl bg-surface border border-white/10 space-y-1">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-white text-sm">{edu.degree}</h5>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-mono">
                  {edu.period}
                </span>
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
