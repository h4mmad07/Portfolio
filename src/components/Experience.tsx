import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, CheckCircle2, Video } from 'lucide-react';
import { SectionHeader } from './ui/SectionHeader';
import { usePortfolio } from '../context/PortfolioContext';

export const Experience: React.FC = () => {
  const { data } = usePortfolio();

  return (
    <section id="experience" className="relative py-24 bg-surface/30 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          badge="EXPERIENCE & ROLES"
          title="Professional Journey & Leadership"
          subtitle="Real-world leadership in creative visual production, workflow management, and institutional branding."
        />

        <div className="max-w-4xl mx-auto space-y-8">
          {data.experience.map((exp, idx) => (
            <motion.div
              key={exp.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-6 sm:p-8 rounded-3xl bg-surface-light/70 border border-white/10 backdrop-blur-xl shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-cyan-400 to-blue-600" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
                    <Video className="w-3.5 h-3.5" /> Creative Leadership
                  </div>
                  <h3 className="text-2xl font-bold text-white font-display">
                    {exp.role}
                  </h3>
                  <p className="text-base text-cyan-300 font-medium mt-0.5">
                    {exp.company}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-1.5 text-xs font-mono text-muted">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-white/10 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    {exp.period}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {exp.location}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {exp.responsibilities.map((resp, rIdx) => (
                  <div key={rIdx} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2">
                {exp.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-3 py-1 rounded-lg bg-surface border border-white/10 text-xs font-mono text-cyan-300"
                  >
                    {tag}
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
