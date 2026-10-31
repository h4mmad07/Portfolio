import React, { useState, useRef, useEffect } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Plus, Trash2, Check, X, Briefcase, GraduationCap, Edit2, Save, Calendar, Globe, Building2, Award, CheckCircle2 } from 'lucide-react';
import { Experience, Education } from '../../../types/portfolio';

export const ExperienceTab: React.FC = () => {
  const { 
    data, 
    addExperience, 
    deleteExperience,
    addEducation,
    deleteEducation,
    updateExperience,
    updateEducation
  } = usePortfolio();

  const [isAddingExp, setIsAddingExp] = useState(false);
  const [isAddingEdu, setIsAddingEdu] = useState(false);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [editingEduId, setEditingEduId] = useState<string | null>(null);

  const expFormRef = useRef<HTMLFormElement>(null);
  const eduFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isAddingExp && expFormRef.current) {
      expFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isAddingExp]);

  useEffect(() => {
    if ((isAddingEdu || editingEduId) && eduFormRef.current) {
      eduFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isAddingEdu, editingEduId]);

  const [expForm, setExpForm] = useState({
    role: '',
    company: '',
    period: '2025 – Present',
    location: 'Multan, Pakistan',
    responsibilitiesText: '',
    tagsText: '',
    employmentType: 'Full-time',
    companyLogo: '',
    companyWebsite: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    displayOrder: (data?.experience?.length || 0) + 1,
    isVisible: true
  });

  const [eduForm, setEduForm] = useState({
    degree: '',
    institution: '',
    period: '2023 – 2027',
    location: 'Multan, Pakistan',
    badge: 'In Progress',
    description: '',
    qualification: '',
    boardUniversity: '',
    gradeCgpa: '',
    totalMarksScale: '',
    achievements: '',
    institutionWebsite: '',
    displayOrder: (data?.education?.length || 0) + 1,
    isVisible: true
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
      tags,
      employmentType: expForm.employmentType,
      companyLogo: expForm.companyLogo,
      companyWebsite: expForm.companyWebsite,
      startDate: expForm.startDate,
      endDate: expForm.endDate,
      currentlyWorking: expForm.currentlyWorking,
      displayOrder: expForm.displayOrder,
      isVisible: expForm.isVisible
    });

    setIsAddingExp(false);
    setExpForm({ role: '', company: '', period: '', location: '', responsibilitiesText: '', tagsText: '', employmentType: 'Full-time', companyLogo: '', companyWebsite: '', startDate: '', endDate: '', currentlyWorking: false, displayOrder: (data?.experience?.length || 0) + 1, isVisible: true });
  };

  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    await addEducation({
      degree: eduForm.degree,
      institution: eduForm.institution,
      period: eduForm.period,
      location: eduForm.location,
      badge: eduForm.badge,
      description: eduForm.description,
      qualification: eduForm.qualification,
      boardUniversity: eduForm.boardUniversity,
      gradeCgpa: eduForm.gradeCgpa,
      totalMarksScale: eduForm.totalMarksScale,
      achievements: eduForm.achievements,
      institutionWebsite: eduForm.institutionWebsite,
      displayOrder: eduForm.displayOrder,
      isVisible: eduForm.isVisible
    });

    setIsAddingEdu(false);
    setEduForm({ degree: '', institution: '', period: '', location: '', badge: '', description: '', qualification: '', boardUniversity: '', gradeCgpa: '', totalMarksScale: '', achievements: '', institutionWebsite: '', displayOrder: (data?.education?.length || 0) + 1, isVisible: true });
  };

  const handleEditExp = (exp: Experience) => {
    setEditingExpId(exp.id);
    setIsAddingExp(false);
    setExpForm({
      role: exp.role,
      company: exp.company,
      period: exp.period,
      location: exp.location,
      responsibilitiesText: exp.responsibilities.join('\n'),
      tagsText: exp.tags.join(', '),
      employmentType: exp.employmentType || 'Full-time',
      companyLogo: exp.companyLogo || '',
      companyWebsite: exp.companyWebsite || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      currentlyWorking: exp.currentlyWorking || false,
      displayOrder: exp.displayOrder || (data?.experience?.length || 0) + 1,
      isVisible: exp.isVisible ?? true
    });
  };

  const handleEditEdu = (edu: Education) => {
    setEditingEduId(edu.id);
    setIsAddingEdu(false);
    setEduForm({
      degree: edu.degree,
      institution: edu.institution,
      period: edu.period,
      location: edu.location,
      badge: edu.badge,
      description: edu.description || '',
      qualification: edu.qualification || '',
      boardUniversity: edu.boardUniversity || '',
      gradeCgpa: edu.gradeCgpa || '',
      totalMarksScale: edu.totalMarksScale || '',
      achievements: edu.achievements || '',
      institutionWebsite: edu.institutionWebsite || '',
      displayOrder: edu.displayOrder || (data?.education?.length || 0) + 1,
      isVisible: edu.isVisible ?? true
    });
  };

  const handleUpdateExp = async (e: React.FormEvent) => {
    e.preventDefault();
    const responsibilities = expForm.responsibilitiesText.split('\n').map((s) => s.trim()).filter(Boolean);
    const tags = expForm.tagsText.split(',').map((s) => s.trim()).filter(Boolean);

    if (!editingExpId) return;

    await updateExperience(editingExpId, {
      role: expForm.role,
      company: expForm.company,
      period: expForm.period,
      location: expForm.location,
      responsibilities,
      tags,
      employmentType: expForm.employmentType,
      companyLogo: expForm.companyLogo,
      companyWebsite: expForm.companyWebsite,
      startDate: expForm.startDate,
      endDate: expForm.endDate,
      currentlyWorking: expForm.currentlyWorking,
      displayOrder: expForm.displayOrder,
      isVisible: expForm.isVisible
    });

    setEditingExpId(null);
    setExpForm({ role: '', company: '', period: '', location: '', responsibilitiesText: '', tagsText: '', employmentType: 'Full-time', companyLogo: '', companyWebsite: '', startDate: '', endDate: '', currentlyWorking: false, displayOrder: (data?.experience?.length || 0) + 1, isVisible: true });
  };

  const handleUpdateEdu = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingEduId) return;

    await updateEducation(editingEduId, {
      degree: eduForm.degree,
      institution: eduForm.institution,
      period: eduForm.period,
      location: eduForm.location,
      badge: eduForm.badge,
      description: eduForm.description,
      qualification: eduForm.qualification,
      boardUniversity: eduForm.boardUniversity,
      gradeCgpa: eduForm.gradeCgpa,
      totalMarksScale: eduForm.totalMarksScale,
      achievements: eduForm.achievements,
      institutionWebsite: eduForm.institutionWebsite,
      displayOrder: eduForm.displayOrder,
      isVisible: eduForm.isVisible
    });

    setEditingEduId(null);
    setEduForm({ degree: '', institution: '', period: '', location: '', badge: '', description: '', qualification: '', boardUniversity: '', gradeCgpa: '', totalMarksScale: '', achievements: '', institutionWebsite: '', displayOrder: (data?.education?.length || 0) + 1, isVisible: true });
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
              onClick={() => {
                setIsAddingExp(true);
                setEditingExpId(null);
                setEditingEduId(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Role</span>
            </button>
          )}
        </div>

        {(isAddingExp || editingExpId) && (
          <form ref={expFormRef} onSubmit={editingExpId ? handleUpdateExp : handleSaveExp} className="p-5 rounded-2xl bg-surface border border-white/15 space-y-3 ring-2 ring-cyan-500/30">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-white text-xs font-mono uppercase text-cyan-300">
                {editingExpId ? 'Edit Experience Role' : 'New Experience Role'}
              </h5>
              <button type="button" onClick={() => {
                setIsAddingExp(false);
                setEditingExpId(null);
              }} className="text-slate-400 hover:text-white">
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

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">EMPLOYMENT TYPE</label>
                <select
                  value={expForm.employmentType}
                  onChange={(e) => setExpForm({ ...expForm, employmentType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Volunteer">Volunteer</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">COMPANY LOGO URL</label>
                <input
                  type="url"
                  value={expForm.companyLogo}
                  onChange={(e) => setExpForm({ ...expForm, companyLogo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">COMPANY WEBSITE</label>
                <input
                  type="url"
                  value={expForm.companyWebsite}
                  onChange={(e) => setExpForm({ ...expForm, companyWebsite: e.target.value })}
                  placeholder="https://company.com"
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">START DATE</label>
                <input
                  type="date"
                  value={expForm.startDate}
                  onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">END DATE</label>
                <input
                  type="date"
                  value={expForm.endDate}
                  onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex items-end gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="currentlyWorking"
                    checked={expForm.currentlyWorking}
                    onChange={(e) => setExpForm({ ...expForm, currentlyWorking: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 bg-surface-light text-cyan-500 focus:ring-cyan-500"
                  />
                  <label htmlFor="currentlyWorking" className="text-xs font-mono text-slate-300 cursor-pointer">
                    Currently Working Here
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isVisibleExp"
                    checked={expForm.isVisible}
                    onChange={(e) => setExpForm({ ...expForm, isVisible: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 bg-surface-light text-cyan-500 focus:ring-cyan-500"
                  />
                  <label htmlFor="isVisibleExp" className="text-xs font-mono text-slate-300 cursor-pointer">
                    Visible on Site
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">DISPLAY ORDER</label>
                <input
                  type="number"
                  min="1"
                  value={expForm.displayOrder}
                  onChange={(e) => setExpForm({ ...expForm, displayOrder: parseInt(e.target.value) || 1 })}
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
                {editingExpId ? (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Update Experience</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Experience</span>
                  </>
                )}
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
                    <div className="flex flex-wrap gap-2 mt-1 text-[10px] font-mono">
                      {exp.employmentType && <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{exp.employmentType}</span>}
                      {exp.currentlyWorking && <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Currently Working</span>}
                      {!exp.isVisible && <span className="px-2 py-0.5 rounded bg-slate-500/10 text-slate-400">Hidden</span>}
                      {exp.location && <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 flex items-center gap-1"><Building2 className="w-2.5 h-2.5" />{exp.location}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditExp(exp)}
                      className="p-1.5 rounded-lg bg-surface-light hover:bg-white/10 text-slate-300 hover:text-white"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
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
                </div>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                {exp.responsibilities.map((r, rIdx) => (
                  <li key={rIdx}>{r}</li>
                ))}
              </ul>
              {exp.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {exp.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-slate-300">{tag}</span>
                  ))}
                </div>
              )}
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
              onClick={() => {
                setIsAddingEdu(true);
                setEditingExpId(null);
                setEditingEduId(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs shadow transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Degree</span>
            </button>
          )}
        </div>

        {(isAddingEdu || editingEduId) && (
          <form ref={eduFormRef} onSubmit={editingEduId ? handleUpdateEdu : handleSaveEdu} className="p-5 rounded-2xl bg-surface border border-white/15 space-y-3 ring-2 ring-purple-500/30">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-white text-xs font-mono uppercase text-purple-300">
                {editingEduId ? 'Edit Degree Entry' : 'New Degree Entry'}
              </h5>
              <button type="button" onClick={() => {
                setIsAddingEdu(false);
                setEditingEduId(null);
              }} className="text-slate-400 hover:text-white">
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

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">LOCATION</label>
                <input
                  type="text"
                  value={eduForm.location}
                  onChange={(e) => setEduForm({ ...eduForm, location: e.target.value })}
                  placeholder="e.g. Multan, Punjab, Pakistan"
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">QUALIFICATION LEVEL</label>
                <input
                  type="text"
                  value={eduForm.qualification}
                  onChange={(e) => setEduForm({ ...eduForm, qualification: e.target.value })}
                  placeholder="e.g. Bachelor's / Master's / PhD"
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">BOARD / UNIVERSITY</label>
                <input
                  type="text"
                  value={eduForm.boardUniversity}
                  onChange={(e) => setEduForm({ ...eduForm, boardUniversity: e.target.value })}
                  placeholder="e.g. HEC / Punjab Board"
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">GRADE / CGPA</label>
                <input
                  type="text"
                  value={eduForm.gradeCgpa}
                  onChange={(e) => setEduForm({ ...eduForm, gradeCgpa: e.target.value })}
                  placeholder="e.g. 3.8 / 4.0 or A+"
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">TOTAL MARKS / SCALE</label>
                <input
                  type="text"
                  value={eduForm.totalMarksScale}
                  onChange={(e) => setEduForm({ ...eduForm, totalMarksScale: e.target.value })}
                  placeholder="e.g. 3600 / 4000"
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono text-slate-300 mb-1">ACHIEVEMENTS / HONORS</label>
                <textarea
                  rows={2}
                  value={eduForm.achievements}
                  onChange={(e) => setEduForm({ ...eduForm, achievements: e.target.value })}
                  placeholder="Dean's List, Gold Medal, Research Publications..."
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">INSTITUTION WEBSITE</label>
                <input
                  type="url"
                  value={eduForm.institutionWebsite}
                  onChange={(e) => setEduForm({ ...eduForm, institutionWebsite: e.target.value })}
                  placeholder="https://university.edu"
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex items-end gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isVisibleEdu"
                    checked={eduForm.isVisible}
                    onChange={(e) => setEduForm({ ...eduForm, isVisible: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 bg-surface-light text-purple-500 focus:ring-purple-500"
                  />
                  <label htmlFor="isVisibleEdu" className="text-xs font-mono text-slate-300 cursor-pointer">
                    Visible on Site
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">DISPLAY ORDER</label>
                <input
                  type="number"
                  min="1"
                  value={eduForm.displayOrder}
                  onChange={(e) => setEduForm({ ...eduForm, displayOrder: parseInt(e.target.value) || 1 })}
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
                {editingEduId ? (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Update Education</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Education</span>
                  </>
                )}
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
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-mono">
                      {edu.badge}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-mono">
                      {edu.period}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditEdu(edu)}
                        className="p-1 rounded bg-surface-light hover:bg-white/10 text-slate-300 hover:text-white"
                        title="Edit"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete degree "${edu.degree}"?`)) {
                            deleteEducation(edu.id);
                          }
                        }}
                        className="p-1 rounded bg-surface-light hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
              </div>
              <p className="text-xs text-slate-300 font-medium">{edu.institution}</p>
              {edu.location && <p className="text-[11px] text-muted flex items-center gap-1"><Building2 className="w-3 h-3" />{edu.location}</p>}
              {edu.qualification && <p className="text-[11px] text-muted flex items-center gap-1"><Award className="w-3 h-3" />{edu.qualification}</p>}
              {edu.gradeCgpa && <p className="text-[11px] text-muted flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />CGPA/Grade: {edu.gradeCgpa}</p>}
              {edu.description && <p className="text-[11px] text-muted">{edu.description}</p>}
              {edu.achievements && <p className="text-[11px] text-emerald-400 font-medium">🏆 {edu.achievements}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
