import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  MapPin, 
  Clock, 
  Sparkles 
} from 'lucide-react';
import { SectionHeader } from './ui/SectionHeader';
import { usePortfolio } from '../context/PortfolioContext';

export const About: React.FC = () => {
  const { data } = usePortfolio();
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: data.personal.timeZone || 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setTime(new Intl.DateTimeFormat([], options).format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [data.personal.timeZone]);

  return (
    <section id="about" className="relative py-24 bg-surface/50 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          badge="ABOUT & BIOGRAPHY"
          title="Passion for Engineering, Driven by Curiosity."
          subtitle="A deeper look into my background, academic journey, and approach to software development and AI."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Avatar & Personal Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <div className="relative p-6 sm:p-8 rounded-3xl bg-surface-light/80 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/30 transition-all" />

              <div className="relative mx-auto w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-2 border-cyan-400/40 p-1.5 bg-gradient-to-b from-cyan-400/20 to-transparent shadow-[0_0_30px_rgba(0,242,254,0.2)] mb-6">
                <img
                  src={data.personal.avatarImg}
                  alt={data.personal.fullName}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = data.personal.profilePhoto;
                  }}
                />
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-white font-display">
                  {data.personal.fullName}
                </h3>
                <p className="text-sm font-mono text-cyan-400 mt-1">
                  {data.personal.title}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-surface border border-white/5 text-slate-300">
                  <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] text-muted block">Location</span>
                    <span className="font-medium">{data.personal.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-surface border border-white/5 text-slate-300">
                  <Clock className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted block">Local Time (PKT)</span>
                    <span className="font-mono font-medium text-purple-300">{time || '10:00:00 PM'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {data.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-surface-light/60 border border-white/10 backdrop-blur-md"
                >
                  <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-display">
                    {stat.value}
                  </span>
                  <p className="text-xs text-slate-300 font-medium mt-1">
                    {stat.label}
                  </p>
                  <span className="text-[10px] font-mono text-muted">
                    {stat.suffix}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Bio & Education Pathway */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <div className="p-6 sm:p-8 rounded-3xl bg-surface-light/60 border border-white/10 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-display">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Professional Summary & Ambition
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base mb-4 font-sans">
                {data.personal.summary}
              </p>
              <p className="text-slate-400 leading-relaxed text-sm">
                Whether it is building multi-threaded C++ database engines, crafting realistic 3D game physics in Unity, training predictive machine learning models, or producing creative media narratives, I bring dedication and attention to detail to every endeavor.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-surface-light/60 border border-white/10 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 font-display">
                <GraduationCap className="w-5 h-5 text-cyan-400" />
                Academic Background
              </h3>

              <div className="space-y-6">
                {data.education.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    className="relative pl-6 border-l-2 border-cyan-500/30 hover:border-cyan-400 transition-colors group"
                  >
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-surface border-2 border-cyan-400 group-hover:scale-125 transition-transform shadow-[0_0_10px_#00f2fe]" />

                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {edu.degree}
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
                        {edu.period}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-slate-300">
                      {edu.institution}
                    </p>

                    {edu.description && (
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
