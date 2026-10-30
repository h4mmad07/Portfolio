import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  AlertCircle,
  Loader2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SectionHeader } from './ui/SectionHeader';
import { usePortfolio } from '../context/PortfolioContext';

export const Contact: React.FC = () => {
  const { data, submitContact } = usePortfolio();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  if (!data.settings?.sectionsVisibility?.contact) return null;

  const handleCopy = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await submitContact(formData);
      if (result.success) {
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        setErrorMessage(result.error || 'Failed to dispatch message. Please try again or reach out directly.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 bg-background overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeader
          badge="GET IN TOUCH"
          title="Let's Build Something Impactful"
          subtitle="Have a project in mind, an opportunity to discuss, or just want to connect? My inbox is always open."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col gap-5"
          >
            <div className="p-6 rounded-3xl bg-surface-light/80 border border-white/10 backdrop-blur-xl group hover:border-cyan-500/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Mail className="w-6 h-6" />
                </div>
                <button
                  onClick={() => handleCopy(data.personal.email, 'email')}
                  className="px-3 py-1.5 rounded-xl bg-surface border border-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <span className="text-xs font-mono text-muted uppercase">Direct Email</span>
              <a
                href={`mailto:${data.personal.email}`}
                className="block text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mt-1 font-mono break-all"
              >
                {data.personal.email}
              </a>
            </div>

            <div className="p-6 rounded-3xl bg-surface-light/80 border border-white/10 backdrop-blur-xl group hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Phone className="w-6 h-6" />
                </div>
                <button
                  onClick={() => handleCopy(data.personal.phone, 'phone')}
                  className="px-3 py-1.5 rounded-xl bg-surface border border-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPhone ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <span className="text-xs font-mono text-muted uppercase">WhatsApp & Phone</span>
              <a
                href={`https://wa.me/${data.personal.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mt-1 font-mono"
              >
                {data.personal.phone}
              </a>
            </div>

            <div className="p-6 rounded-3xl bg-surface-light/80 border border-white/10 backdrop-blur-xl group hover:border-purple-500/40 transition-all">
              <div className="flex items-center gap-3 mb-2 text-purple-400">
                <MapPin className="w-5 h-5" />
                <span className="text-xs font-mono text-muted uppercase">Location</span>
              </div>
              <p className="text-base font-semibold text-white">
                {data.personal.location}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {data.personal.address}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="p-6 sm:p-8 rounded-3xl bg-surface-light/80 border border-white/10 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <h3 className="text-2xl font-bold text-white font-display mb-2">
                Send a Direct Message
              </h3>
              <p className="text-sm text-slate-300 mb-6">
                Your message is stored securely and delivered to my notification inbox.
              </p>

              {submitSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 mx-auto flex items-center justify-center text-emerald-400">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg text-white font-display">Message Delivered!</h4>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                    Thank you for reaching out, Muhammad Hammad will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-3 px-4 py-2 rounded-xl bg-surface border border-white/10 text-xs font-mono text-slate-300 hover:text-white"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        YOUR NAME <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        YOUR EMAIL <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      SUBJECT
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Project Collaboration / Opportunity"
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      MESSAGE <span className="text-cyan-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your project, timeline, or inquiry..."
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] transition-all duration-300 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
