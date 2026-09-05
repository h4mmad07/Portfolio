import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Printer, FileText, Check, Loader2, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

// @ts-ignore
import html2pdf from 'html2pdf.js';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { data } = usePortfolio();
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    setIsGenerating(true);
    setDownloadSuccess(false);

    try {
      // Ensure web fonts (Plus Jakarta Sans) are fully loaded
      if (document.fonts) {
        await document.fonts.ready;
      }

      const element = resumeRef.current;
      const fileName = `${data.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
      const marginTuple: [number, number, number, number] = [10, 10, 10, 10];

      // Configure html2pdf with native DOM pagebreak avoidance
      const opt = {
        margin: marginTuple,
        filename: fileName,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2.5,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 800,
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy'],
          avoid: ['.resume-section', '.resume-item', 'li', 'p', 'h1', 'h2', 'h3', 'div']
        }
      };

      await html2pdf().set(opt).from(element).save();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Error generating PDF with html2pdf:', err);
      alert('Failed to generate PDF. You can also use the Print button to Save as PDF!');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="resume-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
        
        {/* Backdrop Click to Close */}
        <div className="fixed inset-0 print-hidden" onClick={onClose} />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="resume-modal-container relative w-full max-w-4xl bg-surface border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col z-10"
        >
          {/* Header Bar */}
          <div className="resume-modal-header flex items-center justify-between px-5 py-4 border-b border-white/10 bg-surface-light/80 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white font-display">
                  Resume Preview (ATS Compliant)
                </h3>
                <p className="text-xs text-slate-400 hidden sm:block font-mono">
                  Clean single-column layout formatted for corporate ATS screeners
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-light border border-white/15 hover:border-white/30 text-slate-200 text-xs font-semibold transition-all"
                title="Print or Save as PDF via Browser"
              >
                <Printer className="w-4 h-4 text-cyan-400" />
                <span>Print / Save PDF</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold transition-all shadow-[0_0_20px_rgba(0,242,254,0.3)] disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-surface-light border border-white/10 text-slate-400 hover:text-white transition-all ml-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body: Scrollable Document View */}
          <div className="overflow-y-auto p-4 sm:p-8 bg-slate-900/60 print:bg-white print:p-0">
            
            {/* Paper Document Representation */}
            <div
              ref={resumeRef}
              id="ats-resume-document"
              className="mx-auto w-full max-w-[800px] bg-white text-slate-900 p-8 sm:p-12 shadow-xl border border-slate-200 rounded-sm"
              style={{ 
                color: '#0f172a',
                fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" 
              }}
            >
              
              {/* ATS Header */}
              <header className="border-b-2 border-slate-800 pb-3 mb-5 text-center sm:text-left">
                <h1 
                  className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight uppercase"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {data.personal.fullName}
                </h1>
                <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1 uppercase tracking-wider">
                  {data.personal.title}
                </p>

                {/* Contact Bar */}
                <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-1.5 text-xs text-slate-700 font-medium">
                  {data.personal.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-600 print-hidden" />
                      <a href={`mailto:${data.personal.email}`} className="hover:underline">
                        {data.personal.email}
                      </a>
                    </span>
                  )}
                  {data.personal.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-600 print-hidden" />
                      <span>{data.personal.phone}</span>
                    </span>
                  )}
                  {data.personal.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-600 print-hidden" />
                      <span>{data.personal.location}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-slate-600 print-hidden" />
                    <span>github.com/h4mmad07</span>
                  </span>
                </div>
              </header>

              {/* PROFESSIONAL SUMMARY */}
              {data.personal.summary && (
                <section className="resume-section mb-5" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-2 font-mono">
                    Professional Summary
                  </h2>
                  <p className="text-slate-800 leading-relaxed text-xs sm:text-sm text-justify">
                    {data.personal.summary}
                  </p>
                </section>
              )}

              {/* EDUCATION */}
              {data.education && data.education.length > 0 && (
                <section className="resume-section mb-5">
                  <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-2 font-mono">
                    Education
                  </h2>
                  <div className="space-y-3">
                    {data.education.map((edu, idx) => (
                      <div key={edu.id || idx} className="resume-item" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                        <div className="flex justify-between items-baseline font-bold text-slate-950 text-xs sm:text-sm">
                          <span>{edu.degree}</span>
                          <span className="font-mono text-xs text-slate-600 font-semibold">{edu.period}</span>
                        </div>
                        <div className="flex justify-between items-baseline text-slate-700 text-xs italic">
                          <span>{edu.institution}</span>
                          <span>{edu.location}</span>
                        </div>
                        {edu.description && (
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* TECHNICAL SKILLS */}
              {data.skillCategories && data.skillCategories.length > 0 && (
                <section className="resume-section mb-5">
                  <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-2 font-mono">
                    Technical Skills
                  </h2>
                  <div className="space-y-1.5 text-xs sm:text-sm">
                    {data.skillCategories.map((cat, idx) => (
                      <div key={idx} className="resume-item flex flex-wrap sm:flex-nowrap gap-1" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                        <span className="font-bold text-slate-950 min-w-[160px]">
                          {cat.title}:
                        </span>
                        <span className="text-slate-800">
                          {cat.skills.map((s) => s.name).join(', ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* WORK EXPERIENCE */}
              {data.experience && data.experience.length > 0 && (
                <section className="resume-section mb-5">
                  <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-2 font-mono">
                    Work Experience
                  </h2>
                  <div className="space-y-3">
                    {data.experience.map((exp, idx) => (
                      <div key={exp.id || idx} className="resume-item" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                        <div className="flex justify-between items-baseline font-bold text-slate-950 text-xs sm:text-sm">
                          <span>{exp.role}</span>
                          <span className="font-mono text-xs text-slate-600 font-semibold">{exp.period}</span>
                        </div>
                        <div className="flex justify-between items-baseline text-slate-700 text-xs italic mb-1.5">
                          <span>{exp.company}</span>
                          <span>{exp.location}</span>
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-800">
                          {exp.responsibilities.map((resp, rIdx) => (
                            <li key={rIdx} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>{resp}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* KEY PROJECTS */}
              {data.projects && data.projects.length > 0 && (
                <section className="resume-section mb-4">
                  <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-2 font-mono">
                    Core Technical Projects
                  </h2>
                  <div className="space-y-3">
                    {data.projects.map((proj, idx) => (
                      <div key={proj.id || idx} className="resume-item" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                        <div className="flex justify-between items-baseline font-bold text-slate-950 text-xs sm:text-sm">
                          <span className="flex items-center gap-1.5">
                            {proj.title}
                            <span className="font-normal text-xs text-slate-600 italic">
                              ({proj.category})
                            </span>
                          </span>
                          <span className="font-mono text-xs text-slate-600 font-semibold">{proj.year}</span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium mb-1">
                          <strong className="text-slate-900">Technologies:</strong> {proj.technologies.join(', ')}
                        </p>
                        <p className="text-xs text-slate-800 leading-relaxed mb-1">
                          {proj.description}
                        </p>
                        {proj.highlights && proj.highlights.length > 0 && (
                          <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-slate-700">
                            {proj.highlights.map((high, hIdx) => (
                              <li key={hIdx} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>{high}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
