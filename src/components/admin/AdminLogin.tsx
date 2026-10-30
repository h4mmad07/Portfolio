import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Lock, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  ArrowLeft,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const AdminLogin: React.FC = () => {
  const { login, isConfigured, isAuthenticated } = usePortfolio();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const [email, setEmail] = useState('mh9456605@gmail.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg('Please enter your admin credentials.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const result = await login(password, email);
      if (result.success) {
        navigate('/admin');
      } else {
        setErrorMsg(result.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-surface border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-xl"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-t-3xl" />

        {/* Back Link */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Website</span>
        </button>

        {/* Brand & Title */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1.5px] shadow-[0_0_20px_rgba(0,242,254,0.3)]">
            <div className="w-full h-full bg-surface rounded-[14px] flex items-center justify-center font-mono font-bold text-base text-cyan-300">
              <Lock className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-display">
              Admin Portal
            </h2>
            <p className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {isConfigured ? 'Supabase Cloud Connected' : 'Local Standalone Mode'}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              ADMIN EMAIL
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="mh9456605@gmail.com"
              />
              <Mail className="w-4 h-4 text-muted absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              PASSWORD / PASSCODE
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password or passcode"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none transition-colors"
              />
              <KeyRound className="w-4 h-4 text-muted absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all duration-300 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/10 text-center text-[11px] font-mono text-muted">
          Private portfolio management system — strictly authorized owner access only.
        </div>
      </motion.div>
    </div>
  );
};
