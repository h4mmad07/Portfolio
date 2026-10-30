import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Project } from '../../../types/portfolio';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  Loader2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Activity,
  Layers,
  Play,
  Film
} from 'lucide-react';

export const ProjectsTab: React.FC = () => {
  const { data, addProject, updateProject, deleteProject, reorderProjects, uploadFile } = usePortfolio();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
  const isVideoUrl = (url: string): boolean => {
    const lower = url.toLowerCase();
    return VIDEO_EXTENSIONS.some((ext) => lower.includes(ext));
  };

  const thumbInputRef = useRef<HTMLInputElement>(null);
  const screenshotsInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Omit<Project, 'id'>>({
    title: '',
    year: '2026',
    category: 'Game Dev',
    description: '',
    technologies: [],
    githubUrl: '',
    liveUrl: '',
    thumbnailUrl: '',
    screenshots: [],
    status: 'Completed',
    featured: true,
    highlights: [],
    gradient: 'from-cyan-600/30 to-blue-600/20',
    isPublished: true,
    displayOrder: 1
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
      thumbnailUrl: project.thumbnailUrl || '',
      screenshots: [...(project.screenshots || [])],
      status: project.status || 'Completed',
      featured: project.featured,
      highlights: [...project.highlights],
      gradient: project.gradient,
      isPublished: project.isPublished ?? true,
      displayOrder: project.displayOrder ?? 1
    });
    setTechInput(project.technologies.join(', '));
    setHighlightInput(project.highlights.join('\n'));
    setUploadError('');
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setForm({
      title: '',
      year: new Date().getFullYear().toString(),
      category: 'Game Dev',
      description: '',
      technologies: ['C++', 'Unity 3D'],
      githubUrl: '',
      liveUrl: '',
      thumbnailUrl: '',
      screenshots: [],
      status: 'Completed',
      featured: true,
      highlights: ['High-performance system architecture', 'Responsive interaction pipeline'],
      gradient: 'from-cyan-600/30 to-blue-600/20',
      isPublished: true,
      displayOrder: (data.projects.length + 1)
    });
    setTechInput('C++, Unity 3D');
    setHighlightInput('High-performance system architecture\nResponsive interaction pipeline');
    setUploadError('');
  };

  // Thumbnail file upload
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const res = await uploadFile(file, 'portfolio-media', 'project-thumbnails');
      if (res.url) {
        setForm((prev) => ({ ...prev, thumbnailUrl: res.url }));
      } else {
        setUploadError(res.error || 'Failed to upload thumbnail.');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Upload error.');
    } finally {
      setIsUploading(false);
    }
  };

  // Multiple screenshots upload
  const handleScreenshotsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const res = await uploadFile(files[i], 'portfolio-media', 'project-gallery');
        if (res.url) {
          uploadedUrls.push(res.url);
        }
      }
      setForm((prev) => ({
        ...prev,
        screenshots: [...(prev.screenshots || []), ...uploadedUrls]
      }));
    } catch (err: any) {
      setUploadError(err.message || 'Error uploading screenshots.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeScreenshot = (index: number) => {
    setForm((prev) => ({
      ...prev,
      screenshots: (prev.screenshots || []).filter((_, i) => i !== index)
    }));
  };

  const handleRemoveThumbnail = () => {
    setForm((prev) => ({ ...prev, thumbnailUrl: '' }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTech = techInput.split(',').map((t) => t.trim()).filter(Boolean);
    const parsedHighlights = highlightInput.split('\n').map((h) => h.trim()).filter(Boolean);

    const projectPayload = {
      ...form,
      technologies: parsedTech,
      highlights: parsedHighlights
    };

    if (isCreating) {
      await addProject(projectPayload);
      setIsCreating(false);
    } else if (editingId) {
      await updateProject(editingId, projectPayload);
      setEditingId(null);
    }
  };

  // Move project up/down in ordering
  const moveProject = async (index: number, direction: 'up' | 'down') => {
    const newProjects = [...data.projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newProjects.length) return;

    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    await reorderProjects(newProjects);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h4 className="text-lg font-bold text-white font-display">Projects & Systems CMS</h4>
          <p className="text-xs text-muted font-mono">Create, publish, reorder, and attach media to engineering projects.</p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={handleStartCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        )}
      </div>

      {uploadError && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <span>{uploadError}</span>
        </div>
      )}

      {/* Editor Modal / Form */}
      {(isCreating || editingId) && (
        <form onSubmit={handleSave} className="p-5 sm:p-6 rounded-2xl bg-surface border border-white/15 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h5 className="font-bold text-white text-sm font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{isCreating ? 'Create New Engineering Project' : `Editing: ${form.title}`}</span>
            </h5>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
              }}
              className="p-1.5 rounded-lg bg-surface-light hover:bg-white/10 text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">PROJECT TITLE *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. 3D Game Physics Engine"
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">YEAR</label>
              <input
                type="text"
                required
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">CATEGORY</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              >
                <option value="Game Dev">Game Dev</option>
                <option value="Desktop App">Desktop App</option>
                <option value="AI & ML">AI & ML</option>
                <option value="Database System">Database System</option>
                <option value="Software Arch">Software Arch</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">PROJECT STATUS</label>
              <select
                value={form.status || 'Completed'}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              >
                <option value="Completed">Completed</option>
                <option value="Production">Production</option>
                <option value="In Progress">In Progress</option>
                <option value="Prototype">Prototype</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono text-slate-300 mb-1">OVERVIEW DESCRIPTION</label>
              <textarea
                rows={3}
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">GITHUB REPO URL</label>
              <input
                type="url"
                value={form.githubUrl || ''}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                placeholder="https://github.com/h4mmad07/..."
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">LIVE DEMO URL</label>
              <input
                type="url"
                value={form.liveUrl || ''}
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                placeholder="https://yourdemo.app"
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Media Uploads */}
            <div className="sm:col-span-2 p-4 rounded-xl bg-surface-light/60 border border-white/10 space-y-3">
              <span className="block text-xs font-mono text-cyan-300 font-bold">PROJECT MEDIA & SCREENSHOTS</span>
              
              <div className="flex flex-wrap items-center gap-4">
                {/* Thumbnail */}
                <div>
                  <span className="block text-[10px] font-mono text-muted mb-1">CARD THUMBNAIL</span>
                  <input
                    type="file"
                    ref={thumbInputRef}
                    accept="image/*,video/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    {form.thumbnailUrl ? (
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-cyan-400">
                        {isVideoUrl(form.thumbnailUrl) ? (
                          <div className="relative w-full h-full bg-slate-900 overflow-hidden">
                            <video
                              src={form.thumbnailUrl}
                              className="w-full h-full object-cover opacity-40"
                              muted
                              playsInline
                              preload="none"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <Play className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        ) : (
                          <img src={form.thumbnailUrl} alt="thumb" className="w-full h-full object-cover" />
                        )}
                      </div>
                    ) : (
                      <div className="w-16 h-12 rounded-lg bg-surface border border-white/10 flex items-center justify-center text-muted">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => thumbInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-surface hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200"
                    >
                      {form.thumbnailUrl ? 'Replace Thumbnail' : 'Upload Thumbnail'}
                    </button>
                    {form.thumbnailUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveThumbnail}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-mono transition-colors"
                        title="Remove Thumbnail"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Screenshots */}
                <div>
                  <span className="block text-[10px] font-mono text-muted mb-1">ADD SCREENSHOTS & VIDEOS (GALLERY)</span>
                  <input
                    type="file"
                    multiple
                    ref={screenshotsInputRef}
                    accept="image/*,video/*"
                    onChange={handleScreenshotsUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => screenshotsInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Media</span>
                  </button>
                </div>
              </div>

              {/* Uploaded Gallery Thumbnails */}
              {form.screenshots && form.screenshots.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {form.screenshots.map((shot, sIdx) => {
                    const isVideo = isVideoUrl(shot);
                    return (
                      <div key={sIdx} className="relative w-20 h-14 rounded-lg overflow-hidden border border-white/15 group">
                        {isVideo ? (
                          <div className="relative w-full h-full bg-slate-900 overflow-hidden">
                            <video
                              src={shot}
                              className="w-full h-full object-cover opacity-40"
                              muted
                              playsInline
                              preload="none"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Play className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        ) : (
                          <img src={shot} alt="shot" className="w-full h-full object-cover" />
                        )}
                        <button
                          type="button"
                          onClick={() => removeScreenshot(sIdx)}
                          className="absolute inset-0 bg-red-950/80 text-red-300 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono text-slate-300 mb-1">
                TECHNOLOGIES (COMMA SEPARATED)
              </label>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="C++, Unity, OpenGL, Shaders"
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono text-slate-300 mb-1">
                TECHNICAL HIGHLIGHTS (ONE PER LINE)
              </label>
              <textarea
                rows={3}
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                placeholder="Implemented custom spatial partitioning for 60fps physics&#10;Integrated zero-garbage-collection memory management"
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none resize-none"
              />
            </div>

            <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded border-white/20 text-cyan-500 focus:ring-0"
                />
                <span className="text-xs font-mono text-slate-300">Featured Project (Highlighted)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublished ?? true}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="rounded border-white/20 text-emerald-500 focus:ring-0"
                />
                <span className="text-xs font-mono text-slate-300">Published (Visible to Visitors)</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
              }}
              className="px-4 py-2 rounded-xl bg-surface-light hover:bg-white/10 text-slate-300 text-xs font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{isCreating ? 'Create & Publish Project' : 'Save Project Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      <div className="space-y-3">
        {data.projects.map((proj, idx) => (
          <div
            key={proj.id}
            className="p-4 rounded-2xl bg-surface border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition-all"
          >
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              {/* Order buttons */}
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveProject(idx, 'up')}
                  className="p-1 rounded bg-surface-light hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  disabled={idx === data.projects.length - 1}
                  onClick={() => moveProject(idx, 'down')}
                  className="p-1 rounded bg-surface-light hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>

              {/* Thumbnail preview */}
              <div className="w-14 h-11 rounded-lg overflow-hidden bg-slate-950 border border-white/10 flex-shrink-0 flex items-center justify-center">
                {proj.thumbnailUrl ? (
                  <img src={proj.thumbnailUrl} alt={proj.title} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${proj.gradient}`} />
                )}
              </div>

              <div className="truncate">
                <div className="flex items-center gap-2">
                  <h5 className="font-bold text-white text-sm truncate font-display">
                    {proj.title}
                  </h5>
                  {proj.featured && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono">
                      Featured
                    </span>
                  )}
                  {proj.isPublished === false && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono">
                      Draft
                    </span>
                  )}
                  {proj.id.startsWith('gh-') && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-900/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono">
                      GitHub Sync
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-muted mt-0.5">
                  <span>{proj.category}</span>
                  <span>•</span>
                  <span>{proj.year}</span>
                  {proj.status && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-400">{proj.status}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => updateProject(proj.id, { isPublished: !proj.isPublished })}
                className={`p-2 rounded-xl border text-xs font-mono transition-colors ${
                  proj.isPublished !== false
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-surface-light border-white/10 text-slate-400'
                }`}
                title={proj.isPublished !== false ? 'Published (click to unpublish)' : 'Draft (click to publish)'}
              >
                {proj.isPublished !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => handleStartEdit(proj)}
                className="p-2 rounded-xl bg-surface-light hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                title="Edit Project"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${proj.title}"?`)) {
                    deleteProject(proj.id);
                  }
                }}
                className="p-2 rounded-xl bg-surface-light hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 transition-colors"
                title="Delete Project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
