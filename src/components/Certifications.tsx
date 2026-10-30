import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, CheckCircle2, ShieldCheck, Image as ImageIcon, FileText } from 'lucide-react';
import { SectionHeader } from './ui/SectionHeader';
import { usePortfolio } from '../context/PortfolioContext';

const isPdfUrl = (url: string): boolean => url.toLowerCase().endsWith('.pdf');

export const Certifications: React.FC = () => {
  const { data } = usePortfolio();

  if (!data.settings?.sectionsVisibility?.certifications) return null;

  const visibleCerts = (data.certifications || []).filter((c) => c.isVisible !== false);
  if (visibleCerts.length === 0) return null;

  return (
    <section id="certifications" className="relative py-24 bg-surface/40 border-t border-white/5">
      <div className="absolute top-1/3 left-10 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="HONORS & CREDENTIALS"
          title="Certifications & Accreditations"
          subtitle="Verified technical credentials and recognized training across software engineering, systems, and game development."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {visibleCerts.map((cert, idx) => (
            <motion.div
              key={cert.id || idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-3xl bg-surface-light/60 border border-white/10 hover:border-cyan-500/50 backdrop-blur-xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-[0_20px_35px_rgba(0,0,0,0.4)]"
            >
              <div>
                {/* Badge Thumbnail */}
                {cert.badgeUrl && (
                  <div className="relative h-32 sm:h-36 w-full rounded-2xl overflow-hidden border border-white/10 bg-slate-950 mb-4 flex items-center justify-center">
                    {isPdfUrl(cert.badgeUrl) ? (
                      <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
                        <FileText className="w-10 h-10 text-cyan-400" />
                        <div className="absolute bottom-1 left-1 bg-black/60 text-[10px] font-mono text-white px-1.5 rounded">
                          PDF
                        </div>
                      </div>
                    ) : (
                      <img
                        src={cert.badgeUrl}
                        alt={`${cert.title} badge`}
                        className="w-full h-full object-contain p-2"
                      />
                    )}
                  </div>
                )}

                {/* Header Badge */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-105 transition-transform">
                    <Award className="w-6 h-6" />
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-white/10 text-xs font-mono text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    {cert.issueDate}
                  </span>
                </div>

                {/* Title & Issuer */}
                <h3 className="text-xl font-bold text-white font-display mb-1.5 group-hover:text-cyan-300 transition-colors">
                  {cert.title}
                </h3>
                <p className="text-sm font-medium text-cyan-400/90 mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  {cert.issuer}
                </p>

                {cert.description && (
                  <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed mb-4">
                    {cert.description}
                  </p>
                )}

                {/* Skills tags */}
                {cert.skills && cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {cert.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-0.5 rounded-lg bg-surface border border-white/5 text-[11px] font-mono text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer / Credential link */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                {cert.credentialId ? (
                  <span className="text-[11px] font-mono text-muted truncate max-w-[150px]">
                    ID: {cert.credentialId}
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                )}

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-colors"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
