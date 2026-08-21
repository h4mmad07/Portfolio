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
  Code 
} from 'lucide-react';
import { SectionHeader } from './ui/SectionHeader';
import { Project } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectModal } from './ProjectModal';

export const Projects: React.FC = () => {
  const { data } = usePortfolio();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const categories = ['All', 'Game Dev', 'Desktop App', 'AI & ML', 'Database System', 'Software Arch'];

  const filteredProjects = selectedFilter === 'All'
    ? data.projects
    : data.projects.filter(p => p.category === selectedFilter);

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
          subtitle="Explore selected applications, 3D games, machine learning pipelines, and desktop architectures."
        />

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-3xl bg-surface-light/50 border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
            >
              <div className={`h-28 sm:h-32 bg-gradient-to-br ${project.gradient} relative p-6 flex flex-col justify-between`}>
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-xs font-mono text-white">
                    {getCategoryIcon(project.category)}
                    <span>{project.category}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-white/80">
                    {project.year}
                  </span>
                </div>
              </div>

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
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.technologies.slice(0, 4).map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-lg bg-surface border border-white/5 text-[11px] font-mono text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-1 rounded-lg bg-surface text-[10px] font-mono text-muted">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => setActiveModalProject(project)}
                      className="text-xs font-bold font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Details & Specs
                    </button>

                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-surface border border-white/10 text-slate-300 hover:text-white hover:border-white/30 transition-all"
                        title="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    ) : (
                      <span className="text-[11px] font-mono text-muted">Unity Build</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <ProjectModal
          project={activeModalProject}
          onClose={() => setActiveModalProject(null)}
        />

      </div>
    </section>
  );
};
