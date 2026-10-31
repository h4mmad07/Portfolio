import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Github, 
  FileText,
  Download,
  Sparkles
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { getPortfolioStats } from '../utils/portfolioStats';

const Hero3DCanvas = lazy(() => import('./3d/Hero3DCanvas').then((module) => ({ default: module.Hero3DCanvas })));

interface HeroProps {
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume }) => {
  const { data } = usePortfolio();
  const stats = getPortfolioStats(data);

  if (!data.settings?.sectionsVisibility?.hero) return null;

  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center justify-center overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-light border border-white/10 mb-6 shadow-inner">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono text-slate-300">
                {data.personal.availability}
              </span>
            </div>

            {/* Avatar Greeting Snippet */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.4)] bg-slate-900">
                <img
                  src={data.personal.avatarImg}
                  alt={data.personal.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = data.personal.profilePhoto || '/images/avatar.png';
                  }}
                />
              </div>
              <div>
                <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                  HELLO WORLD, I'M
                </p>
                <h3 className="text-sm font-semibold text-slate-300">
                  {data.personal.fullName}
                </h3>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight font-display leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              {data.personal.title}
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl font-sans leading-relaxed">
              {data.personal.tagline}
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <a
                href="#projects"
                className="group flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(0,242,254,0.35)] hover:shadow-[0_0_35px_rgba(0,242,254,0.6)] transition-all duration-300"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              {data.personal.resumeUrl ? (
                <a
                  href={data.personal.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-semibold text-sm transition-all duration-300 shadow-[0_0_15px_rgba(0,242,254,0.15)]"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Download CV (PDF)</span>
                </a>
              ) : (
                <button
                  onClick={onOpenResume}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-semibold text-sm transition-all duration-300 shadow-[0_0_15px_rgba(0,242,254,0.15)]"
                >
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>View Resume</span>
                </button>
              )}
            </div>

            {/* Metric Counters Banner */}
            <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 w-full">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                      {stat.value}
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-medium">
                      {stat.suffix}
                    </span>
                  </div>
                  <span className="text-xs text-muted font-sans mt-0.5">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: 3D Visualizer Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-5 h-[420px] sm:h-[480px] lg:h-[520px] w-full relative flex items-center justify-center"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500/15 via-transparent to-purple-500/15 border border-white/10 backdrop-blur-sm overflow-hidden shadow-2xl">
              <Suspense fallback={<div className="w-full h-full" aria-hidden="true" />}>
                <Hero3DCanvas />
              </Suspense>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
