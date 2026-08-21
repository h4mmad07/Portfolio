import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Terminal, 
  Database, 
  Cpu, 
  Layout, 
  Layers, 
  Workflow, 
  Zap, 
  Boxes, 
  FolderArchive, 
  Server, 
  Gamepad2, 
  Sparkles, 
  Brain, 
  Video, 
  Camera, 
  Palette, 
  Film 
} from 'lucide-react';
import { SectionHeader } from './ui/SectionHeader';
import { usePortfolio } from '../context/PortfolioContext';

export const TechStack: React.FC = () => {
  const { data } = usePortfolio();
  const [activeTab, setActiveTab] = useState(0);

  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2': return <Code2 className="w-5 h-5 text-cyan-400" />;
      case 'Terminal': return <Terminal className="w-5 h-5 text-emerald-400" />;
      case 'Database': return <Database className="w-5 h-5 text-blue-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-purple-400" />;
      case 'Layout': return <Layout className="w-5 h-5 text-yellow-400" />;
      case 'Layers': return <Layers className="w-5 h-5 text-indigo-400" />;
      case 'Workflow': return <Workflow className="w-5 h-5 text-teal-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Boxes': return <Boxes className="w-5 h-5 text-cyan-300" />;
      case 'FolderArchive': return <FolderArchive className="w-5 h-5 text-rose-400" />;
      case 'Server': return <Server className="w-5 h-5 text-blue-300" />;
      case 'Gamepad2': return <Gamepad2 className="w-5 h-5 text-emerald-300" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-pink-400" />;
      case 'Brain': return <Brain className="w-5 h-5 text-purple-300" />;
      case 'Video': return <Video className="w-5 h-5 text-red-400" />;
      case 'Camera': return <Camera className="w-5 h-5 text-amber-300" />;
      case 'Palette': return <Palette className="w-5 h-5 text-orange-400" />;
      case 'Film': return <Film className="w-5 h-5 text-cyan-400" />;
      default: return <Code2 className="w-5 h-5 text-cyan-400" />;
    }
  };

  const activeCategory = data.skillCategories[activeTab] || data.skillCategories[0];

  return (
    <section id="skills" className="relative py-24 bg-surface/30 border-t border-white/5 overflow-hidden">
      
      {/* Infinite Marquee Skills Band */}
      <div className="mb-20 -mx-4 overflow-hidden py-4 bg-surface-light/40 border-y border-white/10 backdrop-blur-md">
        <div className="flex w-max animate-marquee space-x-8">
          {[...data.marqueeSkills, ...data.marqueeSkills].map((skill, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 px-4 py-2 rounded-full bg-surface border border-white/10 text-xs sm:text-sm font-mono text-slate-200 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>{skill}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="SKILLS & PROFICIENCY"
          title="Technical Competencies & Toolset"
          subtitle="Systematic breakdown of technologies, frameworks, algorithms, and media tools I use to build robust software."
        />

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {data.skillCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                activeTab === idx
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(0,242,254,0.4)]'
                  : 'bg-surface-light/80 text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Active Category Skills Grid */}
        {activeCategory && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeCategory.skills.map((skill, sIdx) => (
              <motion.div
                key={sIdx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: sIdx * 0.05 }}
                className="p-5 rounded-2xl bg-surface-light/70 border border-white/10 hover:border-cyan-500/40 backdrop-blur-md transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-surface border border-white/10 group-hover:scale-110 transition-transform">
                      {getSkillIcon(skill.icon)}
                    </div>
                    <span className="font-bold text-white font-display text-sm sm:text-base">
                      {skill.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    {skill.level}%
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-surface overflow-hidden border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
