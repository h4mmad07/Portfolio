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
  ArrowUpRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SectionHeader } from './ui/SectionHeader';
import { usePortfolio } from '../context/PortfolioContext';

export const Contact: React.FC = () => {
  const { data } = usePortfolio();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
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
              <span className="text-xs font-mono text-muted uppercase">Phone / WhatsApp</span>
              <a
                href={`https://wa.me/${data.personal.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mt-1 font-mono"
              >
                <span>{data.personal.phone}</span>
                <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-emerald-400" />
              </a>
            </div>

            <div className="p-6 rounded-3xl bg-surface-light/80 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono text-muted uppercase block">Location & Address</span>
                  <h4 className="text-base font-bold text-white font-display">
                    {data.personal.location}
                  </h4>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-mono leading-relaxed pl-1">
                {data.personal.address}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-surface-light/80 border border-white/10 backdrop-blur-xl shadow-2xl relative"
          >
            {formSubmitted ? (
              <div className="py-16 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white font-display">
                  Message Dispatched!
                </h3>
                <p className="text-slate-300 text-sm max-w-md mt-2">
                  Thank you for reaching out, {data.personal.fullName} has received your message and will respond shortly.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-surface border border-white/15 text-xs font-mono text-cyan-400 hover:bg-white/5 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-2">
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-2">
                      YOUR EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-2">
                    SUBJECT
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Project Inquiry / Job Opportunity / Collaboration"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-2">
                    MESSAGE *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(0,242,254,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Message</span>
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
};
