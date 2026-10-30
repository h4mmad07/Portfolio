import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Github, 
  ExternalLink, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Image as ImageIcon,
  Activity,
  Play,
  Film
} from 'lucide-react';
import { Project } from '../types/portfolio';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];

const isVideoUrl = (url: string): boolean => {
  const lower = url.toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lower.includes(ext));
};

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  if (!project) return null;

  const allMedia = [
    ...(project.thumbnailUrl ? [project.thumbnailUrl] : []),
    ...(project.screenshots || [])
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-surface border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" />

          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-surface-light border border-white/10 text-slate-300 hover:text-white transition-colors z-20"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto pr-1 flex-1 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
                  {project.category}
                </span>

                {project.status && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
                    <Activity className="w-3 h-3" />
                    {project.status}
                  </span>
                )}

                <span className="flex items-center gap-1 text-xs font-mono text-muted">
                  <Calendar className="w-3.5 h-3.5" />
                  {project.year}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                {project.title}
              </h3>
            </div>

            {/* Media Gallery / Screenshots & Videos */}
            {allMedia.length > 0 ? (
              <div className="space-y-3">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-slate-950 flex items-center justify-center">
                  {isVideoUrl(allMedia[activeMediaIndex]) ? (
                    <video
                      src={allMedia[activeMediaIndex]}
                      className="w-full h-full object-contain"
                      controls
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={allMedia[activeMediaIndex]}
                      alt={`${project.title} media ${activeMediaIndex + 1}`}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

                {allMedia.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {allMedia.map((media, i) => {
                      const isVideo = isVideoUrl(media);
                      return (
                        <button
                          key={i}
                          onClick={() => setActiveMediaIndex(i)}
                          className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                            activeMediaIndex === i ? 'border-cyan-400 scale-105' : 'border-white/10 opacity-70 hover:opacity-100'
                          }`}
                        >
                          {isVideo ? (
                            <div className="relative w-full h-full bg-slate-900 overflow-hidden">
                              <video
                                src={media}
                                className="w-full h-full object-cover opacity-40"
                                muted
                                playsInline
                                preload="none"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <Play className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          ) : (
                            <img src={media} alt="thumbnail" className="w-full h-full object-cover" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className={`h-36 rounded-2xl bg-gradient-to-br ${project.gradient} border border-white/10 flex items-center justify-center text-white/50 text-xs font-mono`}>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>3D Architectural Systems Spec</span>
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
              {project.description}
            </p>

            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-muted mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Key Features & Technical Highlights
                </h4>
                <div className="space-y-2">
                  {project.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-muted mb-3 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" /> Technologies & Tools
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-surface-light border border-white/10 text-xs font-mono text-cyan-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-light hover:bg-white/10 text-white border border-white/10 font-mono text-xs font-semibold transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>View Source Code</span>
                </a>
              )}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Live Demo</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
