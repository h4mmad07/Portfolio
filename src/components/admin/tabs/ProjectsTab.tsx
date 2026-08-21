import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Project } from '../../../data/portfolioData';
import { Plus, Edit2, Trash2, Check, X, Sparkles, Code } from 'lucide-react';

export const ProjectsTab: React.FC = () => {
  const { data, addProject, updateProject, deleteProject } = usePortfolio();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [form, setForm] = useState<Omit<Project, 'id'>>({
    title: '',
    year: '2026',
    category: 'Game Dev',
    description: '',
    technologies: [],
    githubUrl: '',
    liveUrl: '',
    featured: true,
    highlights: [],
    gradient: 'from-cyan-600/30 to-blue-600/20'
  });

  const [techInput, setTechInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');

  const handleStartEdit = (project: Project) => {
    setEditingId(project.id);
    setIsCreating(false);
    setForm({
      title: project.title,
      year: project.year,
      category: project.category,
      description: project.description,
      technologies: [...project.technologies],
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      featured: project.featured,
      highlights: [...project.highlights],
      gradient: project.gradient
    });
    setTechInput(project.technologies.join(', '));
    setHighlightInput(project.highlights.join('\n'));
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setForm({
      title: '',
      year: new Date().getFullYear().toString(),
      category: 'Game Dev',
      description: '',
      technologies: ['C++', 'Unity Engine'],
      githubUrl: '',
      liveUrl: '',
      featured: true,
      highlights: ['Key performance optimization', 'Responsive architecture'],
      gradient: 'from-cyan-600/30 to-blue-600/20'
    });
    setTechInput('C++, Unity Engine');
    setHighlightInput('Key performance optimization\nResponsive architecture');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTech = techInput.split(',').map((t) => t.trim()).filter(Boolean);
    const parsedHighlights = highlightInput.split('\n').map((h) => h.trim()).filter(Boolean);

    const projectPayload = {
      ...form,
      technologies: parsedTech,
      highlights: parsedHighlights
    };

    if (isCreating) {
      addProject(projectPayload);
      setIsCreating(false);
    } else if (editingId) {
      updateProject(editingId, projectPayload);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h4 className="text-lg font-bold text-white font-display">Projects & Systems CMS</h4>
          <p className="text-xs text-muted font-mono">Create, update, or remove portfolio projects.</p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={handleStartCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        )}
      </div>

      {/* Form (Creating or Editing) */}
      {(isCreating || editingId) && (
        <form onSubmit={handleSave} className="p-5 rounded-2xl bg-surface border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-cyan-400 text-sm font-mono">
              {isCreating ? '➕ Add New Project' : '✏️ Edit Project'}
            </h5>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
              }}
              className="p-1.5 rounded-lg bg-surface-light text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-slate-300 mb-1">PROJECT TITLE</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">YEAR</label>
              <input
                type="text"
                required
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">CATEGORY</label>
              <select
                value={form.category}
                onChange={(e: any) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
              >
                <option value="Game Dev">Game Dev</option>
                <option value="Desktop App">Desktop App</option>
                <option value="AI & ML">AI & ML</option>
                <option value="Database System">Database System</option>
                <option value="Software Arch">Software Arch</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">GITHUB URL</label>
              <input
                type="text"
                placeholder="https://github.com/..."
                value={form.githubUrl}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">SHORT DESCRIPTION</label>
            <textarea
              rows={2}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              TECHNOLOGIES (comma separated)
            </label>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="e.g. Unity Engine, C#, Shader Graph, 3D Sound"
              className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              KEY HIGHLIGHTS (one per line)
            </label>
            <textarea
              rows={3}
              value={highlightInput}
              onChange={(e) => setHighlightInput(e.target.value)}
              placeholder="Highlight 1&#10;Highlight 2&#10;Highlight 3"
              className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
              }}
              className="px-4 py-2 rounded-xl bg-surface-light text-slate-300 text-xs font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono"
            >
              Save Project
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      <div className="space-y-3">
        {data.projects.map((proj) => (
          <div
            key={proj.id}
            className="p-4 rounded-2xl bg-surface border border-white/10 flex items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-mono border border-cyan-500/20">
                  {proj.category}
                </span>
                <span className="text-xs font-mono text-muted">{proj.year}</span>
              </div>
              <h5 className="text-base font-bold text-white font-display mt-1">{proj.title}</h5>
              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{proj.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStartEdit(proj)}
                className="p-2 rounded-xl bg-surface-light hover:bg-white/10 text-cyan-400 border border-white/10 transition-colors"
                title="Edit Project"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${proj.title}"?`)) {
                    deleteProject(proj.id);
                  }
                }}
                className="p-2 rounded-xl bg-surface-light hover:bg-red-500/20 text-red-400 border border-white/10 transition-colors"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
