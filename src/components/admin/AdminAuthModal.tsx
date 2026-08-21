import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  ArrowRight, 
  X, 
  Mail, 
  KeyRound, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles,
  Send,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const AdminAuthModal: React.FC = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    isAuthenticated, 
    login, 
    requestEmailVerificationCode, 
    resetPasscodeWithOTP,
    ownerEmail 
  } = usePortfolio();

  const [view, setView] = useState<'login' | 'request-otp' | 'verify-otp'>('login');
  
  // Login State
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Recovery State
  const [otpCode, setOtpCode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [recoverySuccessMsg, setRecoverySuccessMsg] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Cooldown Countdown Timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  if (!isAdminOpen || isAuthenticated) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setErrorMsg('Please enter your master passcode.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      const success = await login(passcode);
      if (!success) {
        setErrorMsg('Invalid passcode. Access denied.');
      } else {
        setPasscode('');
      }
    } catch (err: any) {
      setErrorMsg('Authentication error. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOTP = async () => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      await requestEmailVerificationCode();
      setCooldown(60);
      setView('verify-otp');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (otpCode.trim().length !== 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      return;
    }
    if (newPasscode !== confirmPasscode) {
      setErrorMsg('New passcode and confirmation do not match.');
      return;
    }
    if (newPasscode.length < 4) {
      setErrorMsg('New passcode must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPasscodeWithOTP(otpCode, newPasscode);
      setRecoverySuccessMsg('Passcode verified and updated! Opening control center...');
      setTimeout(() => {
        setIsAdminOpen(true);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid or expired verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAdminOpen(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-surface border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,242,254,0.15)] z-10 overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600" />

          <button
            onClick={() => setIsAdminOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-xl bg-surface-light border border-white/10 text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          {/* VIEW 1: Standard Login */}
          {view === 'login' && (
            <div>
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(0,242,254,0.2)]">
                <Lock className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-bold text-white font-display">
                Restricted Admin Portal
              </h3>
              <p className="text-xs text-slate-400 mt-1 mb-6 font-mono">
                Enter your secret master passcode to modify portfolio data.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-mono text-cyan-300">
                      MASTER PASSCODE
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setView('request-otp');
                        setErrorMsg('');
                      }}
                      className="text-[11px] font-mono text-cyan-400 hover:underline"
                    >
                      Forgot Passcode?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPasscode ? 'text' : 'password'}
                      autoFocus
                      placeholder="Enter passcode..."
                      value={passcode}
                      onChange={(e) => {
                        setPasscode(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      className="w-full px-4 py-3.5 pr-12 rounded-xl bg-surface-light border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 font-mono tracking-widest transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasscode(!showPasscode)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono"
                  >
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <span>Verifying...</span> : <><span>Authenticate & Unlock</span><ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <span className="text-[11px] font-mono text-muted/80">
                  Default master key: <code className="text-cyan-400">hammad2026</code>
                </span>
              </div>
            </div>
          )}

          {/* VIEW 2: Request Secure OTP to Strictly mh9456605@gmail.com */}
          {view === 'request-otp' && (
            <div>
              <button
                onClick={() => {
                  setView('login');
                  setErrorMsg('');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:underline mb-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </button>

              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-bold text-white font-display">
                Authorized Email Recovery
              </h3>
              <p className="text-xs text-slate-400 mt-1 mb-5 font-mono leading-relaxed">
                A secure 6-digit verification code will be sent strictly to your registered address:
              </p>

              {/* Locked Verified Email Card */}
              <div className="p-3.5 rounded-2xl bg-surface-light border border-cyan-500/30 flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] font-mono text-muted uppercase block">
                    Verified Destination Only
                  </span>
                  <span className="text-sm font-mono font-bold text-cyan-300">
                    {ownerEmail}
                  </span>
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono mb-4">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleRequestOTP}
                disabled={isLoading || cooldown > 0}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(138,43,226,0.3)] transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isLoading 
                    ? 'Dispatching PIN...' 
                    : cooldown > 0 
                      ? `Resend in ${cooldown}s` 
                      : 'Send Verification Code to Email'}
                </span>
              </button>
            </div>
          )}

          {/* VIEW 3: Verify 6-Digit PIN & Reset Passcode */}
          {view === 'verify-otp' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => {
                    setView('request-otp');
                    setErrorMsg('');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Resend Code
                </button>

                {cooldown > 0 && (
                  <span className="text-[11px] font-mono text-muted">
                    Cooldown: {cooldown}s
                  </span>
                )}
              </div>

              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                <KeyRound className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-white font-display">
                Enter Verification Code
              </h3>
              <p className="text-xs text-slate-400 mt-1 mb-4 font-mono">
                Check your inbox at <span className="text-cyan-400 font-bold">{ownerEmail}</span> for the 6-digit PIN.
              </p>

              <form onSubmit={handleVerifyAndReset} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-mono text-cyan-300 mb-1">
                    6-DIGIT VERIFICATION PIN
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    placeholder="• • • • • •"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-light border border-white/15 text-white placeholder-slate-500 text-center font-mono text-xl tracking-[0.5em] focus:outline-none focus:border-cyan-400"
                  />
                  <span className="text-[10px] font-mono text-muted block mt-1">
                    Valid for 10 minutes • Max 3 attempts
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-mono text-cyan-300 mb-1">
                      NEW PASSCODE
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="New passcode"
                      value={newPasscode}
                      onChange={(e) => setNewPasscode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-cyan-300 mb-1">
                      CONFIRM NEW
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Confirm"
                      value={confirmPasscode}
                      onChange={(e) => setConfirmPasscode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {recoverySuccessMsg && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{recoverySuccessMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isLoading ? 'Verifying...' : 'Verify Code & Set New Passcode'}</span>
                </button>
              </form>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
