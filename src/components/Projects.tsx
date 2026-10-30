import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Github, 
  ArrowUpRight, 
  Sparkles, 
  Gamepad2, 
  Brain, 
  Monitor, 
  Database, 
  Code,
  Activity,
  Image as ImageIcon,
  Play,
  Film
} from 'lucide-react';
import { SectionHeader } from './ui/SectionHeader';
import { Project } from '../types/portfolio';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectModal } from './ProjectModal';

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];

const isVideoUrl = (url: string): boolean => {
  const lower = url.toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lower.includes(ext));
};

export const Projects: React.FC = () => {
  const { data } = usePortfolio();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  if (!data.settings?.sectionsVisibility?.projects) return null;

  // Filter only published projects
  const publishedProjects = (data.projects || []).filter((p) => p.isPublished !== false);

  // Extract unique categories dynamically
  const categories = ['All', ...Array.from(new Set(publishedProjects.map((p) => p.category)))];

  const filteredProjects = selectedFilter === 'All'
    ? publishedProjects
    : publishedProjects.filter((p) => p.category === selectedFilter);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Game Dev': return <Gamepad2 className="w-4 h-4 text-emerald-400" />;
      case 'AI & ML': return <Brain className="w-4 h-4 text-purple-400" />;
      case 'Desktop App': return <Monitor className="w-4 h-4 text-cyan-400" />;
      case 'Database System': return <Database className="w-4 h-4 text-blue-400" />;
      default: return <Code className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <section id="projects" className="relative py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          badge="FEATURED WORK"
          title="Engineered Projects & Systems"
          subtitle="Explore selected applications, 3D interactive games, machine learning pipelines, and desktop architectures."
        />

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                selectedFilter === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(0,242,254,0.3)]'
                  : 'bg-surface-light text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => setActiveModalProject(project)}
              className="group relative rounded-3xl bg-surface-light/50 border border-white/10 hover:border-cyan-500/50 backdrop-blur-xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] cursor-pointer"
            >
              {/* Card Image Banner */}
              {project.thumbnailUrl ? (
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-950">
                  {isVideoUrl(project.thumbnailUrl) ? (
                    <div className="relative w-full h-full overflow-hidden">
                      <video
                        src={project.thumbnailUrl}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        muted
                        playsInline
                        preload="none"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-all">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/30" />
                  
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-mono text-white">
                      {getCategoryIcon(project.category)}
                      <span>{project.category}</span>
                    </div>
                    {project.status && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-emerald-400/30 text-emerald-400 text-[10px] font-mono">
                        <Activity className="w-2.5 h-2.5" />
                        {project.status}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className={`h-28 sm:h-32 bg-gradient-to-br ${project.gradient} relative p-6 flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-xs font-mono text-white">
                      {getCategoryIcon(project.category)}
                      <span>{project.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.status && (
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-black/40 border border-emerald-500/30 text-emerald-400">
                          {project.status}
                        </span>
                      )}
                      <span className="font-mono text-xs font-bold text-white/80">
                        {project.year}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white font-display mb-3 group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                    <span>{project.title}</span>
                    <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </h3>

                  <p className="text-sm text-slate-300 font-sans leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.technologies.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-surface border border-white/5 text-xs font-mono text-slate-300 group-hover:border-white/10 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-1 rounded-lg bg-surface text-xs font-mono text-cyan-400">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Card Action Footers */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-muted">
                    <span className="text-cyan-400 group-hover:underline flex items-center gap-1">
                      Deep-dive architecture →
                    </span>

                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-white transition-colors"
                          title="GitHub Repository"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Project Details Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
};
