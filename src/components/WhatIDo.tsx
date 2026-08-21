import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Brain, 
  Gamepad2, 
  Database, 
  Film 
} from 'lucide-react';
import { SectionHeader } from './ui/SectionHeader';
import { usePortfolio } from '../context/PortfolioContext';

export const WhatIDo: React.FC = () => {
  const { data } = usePortfolio();

  const getIcon = (id: string) => {
    switch (id) {
      case 'software-eng': return <Code2 className="w-7 h-7 text-cyan-400" />;
      case 'ai-ml': return <Brain className="w-7 h-7 text-purple-400" />;
      case 'game-dev': return <Gamepad2 className="w-7 h-7 text-emerald-400" />;
      case 'database-systems': return <Database className="w-7 h-7 text-blue-400" />;
      case 'creative-media': return <Film className="w-7 h-7 text-amber-400" />;
      default: return <Code2 className="w-7 h-7 text-cyan-400" />;
    }
  };

  return (
    <section id="services" className="relative py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          badge="AREAS OF EXPERTISE"
          title="What I Bring to the Table"
          subtitle="Specialized capabilities across modern software architecture, AI algorithms, 3D game physics, and media."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`group relative p-8 rounded-3xl bg-surface-light/40 border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden flex flex-col justify-between hover:-translate-y-1.5 shadow-xl hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] ${service.borderColor}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3.5 rounded-2xl bg-surface border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    {getIcon(service.id)}
                  </div>
                  <span className="font-mono text-xs font-bold text-muted/60 group-hover:text-cyan-400 transition-colors">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 font-display group-hover:text-cyan-300 transition-colors">
                  {service.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed font-sans mb-6">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex flex-wrap gap-2">
                {service.technologies.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded-lg bg-surface/80 border border-white/5 text-[11px] font-mono text-slate-300 group-hover:border-white/15 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
