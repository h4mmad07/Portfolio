import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Certification } from '../../../types/portfolio';
import { Plus, Edit2, Trash2, Check, X, Award, ExternalLink, Eye, EyeOff, Upload, Image as ImageIcon, FileText, Play as PlayIcon } from 'lucide-react';

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
const isVideoUrl = (url: string): boolean => {
  const lower = url.toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lower.includes(ext));
};

export const CertificationsTab: React.FC = () => {
  const { data, addCertification, updateCertification, deleteCertification, uploadFile } = usePortfolio();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const badgeInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Omit<Certification, 'id'>>({
    title: '',
    issuer: '',
    issueDate: '2026',
    credentialId: '',
    credentialUrl: '',
    badgeUrl: '',
    description: '',
    skills: [],
    isVisible: true
  });

  const [skillsInput, setSkillsInput] = useState('');

  const handleBadgeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const res = await uploadFile(file, 'portfolio-media', 'certification-badges');
      if (res.url) {
        setForm((prev) => ({ ...prev, badgeUrl: res.url }));
      } else {
        setUploadError(res.error || 'Failed to upload badge.');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Upload error.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveBadge = () => {
    setForm((prev) => ({ ...prev, badgeUrl: '' }));
  };

  const handleStartEdit = (cert: Certification) => {
    setEditingId(cert.id);
    setIsCreating(false);
    setForm({
      title: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
      badgeUrl: cert.badgeUrl || '',
      description: cert.description || '',
      skills: [...(cert.skills || [])],
      isVisible: cert.isVisible ?? true
    });
    setSkillsInput((cert.skills || []).join(', '));
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setForm({
      title: '',
      issuer: '',
      issueDate: new Date().getFullYear().toString(),
      credentialId: '',
      credentialUrl: '',
      badgeUrl: '',
      description: '',
      skills: ['C++', 'Python'],
      isVisible: true
    });
    setSkillsInput('C++, Python');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSkills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);

    const payload = {
      ...form,
      skills: parsedSkills
    };

    if (isCreating) {
      await addCertification(payload);
      setIsCreating(false);
    } else if (editingId) {
      await updateCertification(editingId, payload);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h4 className="text-lg font-bold text-white font-display">Certifications & Honors</h4>
          <p className="text-xs text-muted font-mono">Manage verified credentials, accreditations, and verification links.</p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={handleStartCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Certification</span>
          </button>
        )}
      </div>

      {uploadError && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <span>{uploadError}</span>
        </div>
      )}

      {(isCreating || editingId) && (
        <form onSubmit={handleSave} className="p-5 sm:p-6 rounded-2xl bg-surface border border-white/15 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h5 className="font-bold text-white text-sm font-display flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>{isCreating ? 'Add Technical Certification' : `Editing: ${form.title}`}</span>
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
              <label className="block text-[11px] font-mono text-slate-300 mb-1">CERTIFICATION TITLE *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. CS50 AI Architecture"
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">ISSUING BODY / INSTITUTION *</label>
              <input
                type="text"
                required
                value={form.issuer}
                onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                placeholder="e.g. Harvard / University"
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">ISSUE DATE / YEAR</label>
              <input
                type="text"
                required
                value={form.issueDate}
                onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                placeholder="e.g. 2025"
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">CREDENTIAL ID</label>
              <input
                type="text"
                value={form.credentialId || ''}
                onChange={(e) => setForm({ ...form, credentialId: e.target.value })}
                placeholder="e.g. CERT-109283-XYZ"
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono text-slate-300 mb-1">VERIFICATION / BADGE URL</label>
              <input
                type="url"
                value={form.credentialUrl || ''}
                onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 p-4 rounded-xl bg-surface-light/60 border border-white/10 space-y-3">
              <span className="block text-xs font-mono text-cyan-300 font-bold">BADGE IMAGE / PDF</span>
              <input
                type="file"
                ref={badgeInputRef}
                accept="image/*,application/pdf"
                onChange={handleBadgeUpload}
                className="hidden"
              />
              <div className="flex items-center gap-2">
                {form.badgeUrl ? (
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-cyan-400">
                    {isVideoUrl(form.badgeUrl) ? (
                      <div className="relative w-full h-full bg-slate-900 overflow-hidden">
                        <video
                          src={form.badgeUrl}
                          className="w-full h-full object-cover opacity-40"
                          muted
                          playsInline
                          preload="none"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <PlayIcon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    ) : form.badgeUrl.toLowerCase().endsWith('.pdf') ? (
                      <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-cyan-400" />
                        <div className="absolute bottom-1 left-1 bg-black/60 text-[10px] font-mono text-white px-1.5 rounded">
                          PDF
                        </div>
                      </div>
                    ) : (
                      <img src={form.badgeUrl} alt="badge" className="w-full h-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={handleRemoveBadge}
                      className="absolute -right-1 -top-1 p-1 rounded-lg bg-red-500/90 text-white text-[10px]"
                      title="Remove Badge"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-14 rounded-lg bg-surface border border-white/10 flex items-center justify-center text-muted">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                )}
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => badgeInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-surface hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200"
                >
                  {form.badgeUrl ? 'Replace Badge' : 'Upload Badge Image/PDF'}
                </button>
                {form.badgeUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveBadge}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-mono transition-colors"
                    title="Remove Badge"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono text-slate-300 mb-1">DESCRIPTION</label>
              <textarea
                rows={2}
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono text-slate-300 mb-1">
                TOPICS & SKILLS (COMMA SEPARATED)
              </label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="Algorithms, Machine Learning, C++"
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="certVisible"
                checked={form.isVisible ?? true}
                onChange={(e) => setForm({ ...form, isVisible: e.target.checked })}
                className="rounded border-white/20 text-cyan-500 focus:ring-0"
              />
              <label htmlFor="certVisible" className="text-xs font-mono text-slate-300 cursor-pointer">
                Visible on public website
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
              <span>{isCreating ? 'Add Certification' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Certifications List */}
      <div className="space-y-3">
        {(data.certifications || []).map((cert) => (
          <div
            key={cert.id}
            className="p-4 rounded-2xl bg-surface border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition-all"
          >
            <div className="truncate flex-1">
              <div className="flex items-center gap-2">
                <h5 className="font-bold text-white text-sm truncate font-display">
                  {cert.title}
                </h5>
                {cert.isVisible === false && (
                  <span className="px-2 py-0.5 rounded-full bg-surface-light border border-white/10 text-slate-400 text-[10px] font-mono">
                    Hidden
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-cyan-400 mt-0.5">
                {cert.issuer} • {cert.issueDate}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => updateCertification(cert.id, { isVisible: !cert.isVisible })}
                className={`p-2 rounded-xl border text-xs font-mono transition-colors ${
                  cert.isVisible !== false
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-surface-light border-white/10 text-slate-400'
                }`}
                title={cert.isVisible !== false ? 'Visible (click to hide)' : 'Hidden (click to show)'}
              >
                {cert.isVisible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => handleStartEdit(cert)}
                className="p-2 rounded-xl bg-surface-light hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                title="Edit Certification"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  if (confirm(`Delete "${cert.title}"?`)) {
                    deleteCertification(cert.id);
                  }
                }}
                className="p-2 rounded-xl bg-surface-light hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 transition-colors"
                title="Delete Certification"
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
