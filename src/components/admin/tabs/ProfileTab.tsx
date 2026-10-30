import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { 
  Save, 
  Check, 
  User, 
  Upload, 
  Image as ImageIcon, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';

export const ProfileTab: React.FC = () => {
  const { data, updatePersonal, uploadFile } = usePortfolio();
  const [formData, setFormData] = useState(data.personal);
  const [saved, setSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const res = await uploadFile(file, 'portfolio-media', 'avatars');
      if (res.url) {
        setFormData((prev) => ({ ...prev, avatarImg: res.url }));
      } else {
        setUploadError(res.error || 'Failed to upload image.');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Error uploading file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const res = await uploadFile(file, 'portfolio-media', 'profile-photos');
      if (res.url) {
        setFormData((prev) => ({ ...prev, profilePhoto: res.url }));
      } else {
        setUploadError(res.error || 'Failed to upload photo.');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Error uploading file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePersonal(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h4 className="text-lg font-bold text-white font-display">Personal Profile & Bio</h4>
          <p className="text-xs text-muted font-mono">Manage identity, titles, contact information, and avatar assets.</p>
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Saved Successfully!' : 'Save Profile Changes'}</span>
        </button>
      </div>

      {uploadError && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Image Upload Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Avatar Card */}
        <div className="p-4 rounded-2xl bg-surface border border-white/10 flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-950 border border-cyan-400/30 flex-shrink-0">
            <img
              src={formData.avatarImg}
              alt="Avatar preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/avatar.png';
              }}
            />
          </div>
          <div className="flex-1">
            <span className="block text-xs font-mono text-cyan-300 font-bold">PRIMARY AVATAR</span>
            <span className="block text-[11px] text-muted mb-2">Used in hero greeting and about card</span>
            <input
              type="file"
              ref={avatarInputRef}
              accept="image/*"
              onChange={handleAvatarFile}
              className="hidden"
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => avatarInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-light hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>Upload New Avatar</span>
            </button>
          </div>
        </div>

        {/* Profile Photo Card */}
        <div className="p-4 rounded-2xl bg-surface border border-white/10 flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-950 border border-purple-400/30 flex-shrink-0">
            <img
              src={formData.profilePhoto}
              alt="Profile photo preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/profile-photo.jpg';
              }}
            />
          </div>
          <div className="flex-1">
            <span className="block text-xs font-mono text-purple-300 font-bold">PROFILE PHOTO</span>
            <span className="block text-[11px] text-muted mb-2">High-res portrait fallback</span>
            <input
              type="file"
              ref={photoInputRef}
              accept="image/*"
              onChange={handlePhotoFile}
              className="hidden"
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => photoInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-light hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>Upload Photo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5">FULL NAME</label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5">DISPLAY FIRST NAME</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5">PROFESSIONAL TITLE</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5">AVAILABILITY STATUS</label>
          <input
            type="text"
            value={formData.availability}
            onChange={(e) => handleChange('availability', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-mono text-slate-300 mb-1.5">HERO TAGLINE</label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) => handleChange('tagline', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5">EMAIL ADDRESS</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5">PHONE NUMBER</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5">LOCATION (CITY, COUNTRY)</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5">TIME ZONE</label>
          <input
            type="text"
            value={formData.timeZone}
            onChange={(e) => handleChange('timeZone', e.target.value)}
            placeholder="Asia/Karachi"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-mono text-slate-300 mb-1.5">FULL POSTAL ADDRESS</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-mono text-slate-300 mb-1.5">ABOUT SUMMARY & NARRATIVE BIO</label>
          <textarea
            rows={4}
            value={formData.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none resize-none leading-relaxed"
          />
        </div>
      </div>
    </form>
  );
};
