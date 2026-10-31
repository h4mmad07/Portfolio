import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle2,
  Send,
  AtSign
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
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [resetStep, setResetStep] = useState<'email' | 'otp' | 'new-password' | null>(null);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [recoveryToken, setRecoveryToken] = useState('');
  const [maskedResetEmail, setMaskedResetEmail] = useState('');
  const [resendSeconds, setResendSeconds] = useState(0);
  const [codeSecondsLeft, setCodeSecondsLeft] = useState(0);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const recoveryCodeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (resetStep !== 'otp') return;
    const timer = window.setInterval(() => {
      setResendSeconds((seconds) => Math.max(0, seconds - 1));
      setCodeSecondsLeft((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resetStep]);

  useEffect(() => {
    if (resetStep === 'otp') recoveryCodeRef.current?.focus();
  }, [resetStep]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg('Please enter your admin credentials.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setIsSuccessMessage(false);

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

  const handleResetSendCode = async () => {
    if (!resetEmail.trim()) {
      setErrorMsg('Please enter your admin email.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    setIsSuccessMessage(false);
    try {
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail.trim() }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not send a verification code.');
      setMaskedResetEmail(result.email_masked || 'your email');
      setResendSeconds(60);
      setCodeSecondsLeft(600);
      setResetCode('');
      setErrorMsg('If this is the admin account, a verification code has been sent.');
      setIsSuccessMessage(true);
      setResetStep('otp');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
    setErrorMsg('');
    setIsSuccessMessage(false);
    try {
      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail.trim(), code: resetCode.trim() }),
      });
      const result = await response.json();
      if (!response.ok || !result.recoveryToken) throw new Error(result.error || 'Invalid or expired code.');
      setRecoveryToken(result.recoveryToken);
      setResetStep('new-password');
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not verify the code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match.');
      setIsSuccessMessage(false);
      return;
    }
    if (newPassword.length < 12) {
      setErrorMsg('Use a password with at least 12 characters.');
      setIsSuccessMessage(false);
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    setIsSuccessMessage(false);
    try {
      const response = await fetch('/api/otp/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recoveryToken, newPassword }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not update the password.');
      setResetStep(null);
      setRecoveryToken('');
      setResetCode('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMsg('Password updated. You can now sign in.');
      setIsSuccessMessage(true);
      setTimeout(() => navigate('/admin/login'), 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update password.');
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
              {isConfigured ? 'Secure owner sign-in' : 'Admin sign-in unavailable'}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div role={isSuccessMessage ? 'status' : 'alert'} aria-live={isSuccessMessage ? 'polite' : 'assertive'} className={`mb-5 p-3.5 rounded-xl text-xs flex items-center gap-2 ${isSuccessMessage ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
            {!isSuccessMessage && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Reset Password: Email Step */}
        {resetStep === 'email' && (
          <form onSubmit={(e) => { e.preventDefault(); handleResetSendCode(); }} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                ADMIN EMAIL
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="mh9456605@gmail.com"
                />
                <Mail className="w-4 h-4 text-muted absolute left-3.5 top-3" />
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Sending Code...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send 6-Digit Code</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Reset Password: Verify Code Step */}
        {resetStep === 'otp' && (
          <form onSubmit={(e) => { e.preventDefault(); handleVerifyCode(); }} className="space-y-4">
            <label htmlFor="recovery-code" className="block text-xs font-mono text-slate-300 mb-1.5">6-DIGIT EMAIL CODE</label>
            <input ref={recoveryCodeRef} id="recovery-code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={resetCode} onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))} className="w-full px-4 py-3 rounded-xl bg-surface-light border border-white/10 text-white text-center text-xl tracking-[0.5em] font-mono focus:border-cyan-400 focus:outline-none" aria-describedby="recovery-code-help" />
            <p id="recovery-code-help" className="text-xs text-slate-400">Enter the code sent to {maskedResetEmail || 'your email'}. Code expires in {Math.floor(codeSecondsLeft / 60)}:{String(codeSecondsLeft % 60).padStart(2, '0')}.</p>
            <button type="submit" disabled={isLoading || resetCode.length !== 6 || codeSecondsLeft === 0} className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs disabled:opacity-60">{isLoading ? 'Verifying...' : 'Verify Code'}</button>
            <button type="button" disabled={isLoading || resendSeconds > 0} onClick={handleResetSendCode} className="w-full text-xs text-cyan-300 disabled:text-slate-500">{resendSeconds > 0 ? `Resend code in ${resendSeconds}s` : 'Resend code'}</button>
          </form>
        )}

        {/* Reset Password: New Password Step */}
        {resetStep === 'new-password' && (
          <form onSubmit={(e) => { e.preventDefault(); handleResetUpdatePassword(); }} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                NEW PASSWORD
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none transition-colors"
                  minLength={12}
                  autoComplete="new-password"
                  placeholder="At least 12 characters"
                />
                <KeyRound className="w-4 h-4 text-muted absolute left-3.5 top-3" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none transition-colors"
                  minLength={12}
                  autoComplete="new-password"
                  placeholder="At least 12 characters"
                />
                <KeyRound className="w-4 h-4 text-muted absolute left-3.5 top-3" />
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Normal Login Form */}
        {resetStep === null && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                ADMIN EMAIL
              </label>
              <div className="relative">
                <input
                  type="email"
                  autoComplete="username"
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
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your owner account password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none transition-colors"
                />
                <KeyRound className="w-4 h-4 text-muted absolute left-3.5 top-3" />
              </div>
              <div className="flex items-center justify-between mt-1">
                <button
                  type="button"
                  onClick={() => setResetStep('email')}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300"
                >
                  Forgot Password?
                </button>
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
        )}

        <div className="mt-6 pt-5 border-t border-white/10 text-center text-[11px] font-mono text-muted">
          Private portfolio management system — strictly authorized owner access only.
        </div>
      </motion.div>
    </div>
  );
};
