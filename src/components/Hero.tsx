import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Mail, 
  Phone, 
  Github, 
  Layers, 
  Cpu, 
  Code2 
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Hero3DCanvas } from './3d/Hero3DCanvas';

export const Hero: React.FC = () => {
  const { data } = usePortfolio();

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
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.4)]">
                <img
                  src={data.personal.avatarImg}
                  alt={data.personal.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = data.personal.profilePhoto;
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
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white font-display leading-[1.1]">
              Engineering{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                Intelligent
              </span>{' '}
              Software & 3D Realities.
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl font-sans leading-relaxed">
              {data.personal.tagline}. Undergrad at MNSUAM specializing in C++, Python, C#, Unity, and AI-driven architectures.
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

              <a
                href="#contact"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-surface-light hover:bg-white/10 border border-white/15 text-white font-semibold text-sm transition-all duration-300"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Contact {data.personal.firstName}</span>
              </a>
            </div>

            {/* Social & Contact Bar */}
            <div className="mt-10 flex items-center gap-6 pt-6 border-t border-white/10 w-full">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">
                Direct Channels:
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${data.personal.email}`}
                  className="p-2.5 rounded-xl bg-surface-light border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all shadow-sm"
                  title="Send Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/${data.personal.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-surface-light border border-white/10 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-all shadow-sm"
                  title="WhatsApp Chat"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-surface-light border border-white/10 text-slate-300 hover:text-white hover:border-white/40 transition-all shadow-sm"
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Column: 3D Scene Viewport */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col gap-4"
          >
            <Hero3DCanvas />

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-surface-light/70 border border-white/10 backdrop-blur-md flex flex-col items-center text-center">
                <Code2 className="w-5 h-5 text-cyan-400 mb-1" />
                <span className="text-xs font-bold text-white font-mono">C++ & Python</span>
                <span className="text-[10px] text-muted">Core Languages</span>
              </div>
              <div className="p-3 rounded-2xl bg-surface-light/70 border border-white/10 backdrop-blur-md flex flex-col items-center text-center">
                <Cpu className="w-5 h-5 text-purple-400 mb-1" />
                <span className="text-xs font-bold text-white font-mono">AI & ML</span>
                <span className="text-[10px] text-muted">Intelligent Models</span>
              </div>
              <div className="p-3 rounded-2xl bg-surface-light/70 border border-white/10 backdrop-blur-md flex flex-col items-center text-center">
                <Layers className="w-5 h-5 text-emerald-400 mb-1" />
                <span className="text-xs font-bold text-white font-mono">Unity 3D</span>
                <span className="text-[10px] text-muted">Game Physics</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
