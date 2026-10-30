import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Check, 
  Loader2, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  FolderOpen
} from 'lucide-react';

export const MediaTab: React.FC = () => {
  const { data, updatePersonal, uploadFile } = usePortfolio();
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeUploadSuccess, setResumeUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const resumeInputRef = useRef<HTMLInputElement>(null);

  const handleResumeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF documents are allowed for the master resume/CV.');
      return;
    }

    setIsUploadingResume(true);
    setUploadError('');
    setResumeUploadSuccess(false);

    try {
      const res = await uploadFile(file, 'portfolio-documents', 'resumes');
      if (res.url) {
        await updatePersonal({ resumeUrl: res.url });
        setResumeUploadSuccess(true);
        setTimeout(() => setResumeUploadSuccess(false), 3000);
      } else {
        setUploadError(res.error || 'Failed to upload resume PDF.');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Error uploading resume.');
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleRemoveResume = async () => {
    if (confirm('Remove master PDF resume URL from portfolio?')) {
      await updatePersonal({ resumeUrl: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/10">
        <h4 className="text-lg font-bold text-white font-display">Resume & Document Management</h4>
        <p className="text-xs text-muted font-mono">
          Upload and replace your authentic master PDF CV. Synced automatically to cloud storage.
        </p>
      </div>

      {uploadError && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {resumeUploadSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>Master CV successfully uploaded and synchronized to cloud storage!</span>
        </div>
      )}

      {/* CV Box */}
      <div className="p-6 rounded-3xl bg-surface border border-white/10 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-base font-display">Master PDF Resume / CV</h5>
              <p className="text-xs text-muted font-mono">
                {data.personal.resumeUrl ? 'Active Cloud PDF connected' : 'No custom PDF uploaded (ATS generator used by default)'}
              </p>
            </div>
          </div>

          <input
            type="file"
            ref={resumeInputRef}
            accept="application/pdf"
            onChange={handleResumeFile}
            className="hidden"
          />

          <button
            type="button"
            disabled={isUploadingResume}
            onClick={() => resumeInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
          >
            {isUploadingResume ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Uploading to Cloud...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>{data.personal.resumeUrl ? 'Replace Resume PDF' : 'Upload Resume PDF'}</span>
              </>
            )}
          </button>
        </div>

        {data.personal.resumeUrl ? (
          <div className="p-4 rounded-2xl bg-surface-light border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="truncate">
              <span className="block text-[10px] font-mono text-muted uppercase">ACTIVE FILE LINK</span>
              <a
                href={data.personal.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-cyan-300 hover:underline truncate block"
              >
                {data.personal.resumeUrl}
              </a>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href={data.personal.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-white/10 text-xs font-mono text-slate-200 hover:text-white"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Preview / Test</span>
              </a>

              <button
                type="button"
                onClick={handleRemoveResume}
                className="p-2 rounded-xl bg-surface hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 transition-colors"
                title="Remove PDF"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-surface-light/40 border border-dashed border-white/15 text-center text-xs font-mono text-muted">
            Upload your master resume PDF (max 10MB). When uploaded, public visitors clicking "Download Resume" will receive your authentic PDF file directly.
          </div>
        )}
      </div>

      {/* Cloud Object Storage Info */}
      <div className="p-5 rounded-2xl bg-surface border border-white/10 space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Storage Bucket Configuration</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          Files uploaded in the admin dashboard are dispatched to Supabase Object Storage buckets:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-surface-light border border-white/5">
            <span className="text-cyan-300 font-bold block mb-1">portfolio-media</span>
            <span className="text-muted block text-[11px]">Avatar pictures, project thumbnails, screenshot galleries, certificate badges</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-light border border-white/5">
            <span className="text-purple-300 font-bold block mb-1">portfolio-documents</span>
            <span className="text-muted block text-[11px]">Master PDF resume and downloadable curriculum vitae documents</span>
          </div>
        </div>
      </div>
    </div>
  );
};
