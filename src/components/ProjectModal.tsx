import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Calendar, Sparkles, CheckCircle2, Layers } from 'lucide-react';
import { Project } from '../data/portfolioData';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-surface border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" />

          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-surface-light border border-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
              {project.category}
            </span>
            <span className="flex items-center gap-1 text-xs font-mono text-muted">
              <Calendar className="w-3.5 h-3.5" />
              {project.year}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display mb-4">
            {project.title}
          </h3>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-sans">
            {project.description}
          </p>

          <div className="mb-6">
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

          <div className="mb-8">
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

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-end gap-3">
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-light hover:bg-white/10 border border-white/15 text-white font-medium text-xs transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>View GitHub Repository</span>
              </a>
            ) : (
              <span className="text-xs font-mono text-muted italic">
                (Repository in active private development)
              </span>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
