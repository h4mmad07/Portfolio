import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { KeyRound, Download, Upload, RefreshCw, Copy, Check, ShieldCheck, AlertTriangle } from 'lucide-react';

export const SecurityTab: React.FC = () => {
  const { 
    changePasscode, 
    exportJSON, 
    importJSON, 
    generateTypeScriptCode, 
    resetToDefaults 
  } = usePortfolio();

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [copiedCode, setCopiedCode] = useState(false);
  const [importStr, setImportStr] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleChangePass = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    if (newPass !== confirmPass) {
      setPassMsg({ type: 'error', text: 'New passcode and confirmation do not match.' });
      return;
    }
    if (newPass.length < 4) {
      setPassMsg({ type: 'error', text: 'New passcode must be at least 4 characters long.' });
      return;
    }

    try {
      await changePasscode(currentPass, newPass);
      setPassMsg({ type: 'success', text: 'Master passcode successfully updated & encrypted!' });
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } catch (err: any) {
      setPassMsg({ type: 'error', text: err.message || 'Failed to update passcode.' });
    }
  };

  const handleCopyTS = () => {
    const code = generateTypeScriptCode();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadJSON = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importStr.trim()) return;
    const ok = importJSON(importStr);
    if (ok) {
      setImportStatus('Backup restored successfully!');
      setImportStr('');
    } else {
      setImportStatus('Invalid JSON format.');
    }
    setTimeout(() => setImportStatus(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Change Passcode */}
      <div className="p-5 rounded-2xl bg-surface border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-cyan-400">
          <KeyRound className="w-5 h-5" />
          <h4 className="font-bold text-white text-base font-display">Change Admin Master Passcode</h4>
        </div>
        <p className="text-xs text-muted font-mono">
          Update the secret passcode used to access this panel.
        </p>

        <form onSubmit={handleChangePass} className="space-y-3 max-w-md">
          <div>
            <label className="block text-[11px] font-mono text-slate-300 mb-1">CURRENT PASSCODE</label>
            <input
              type="password"
              required
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">NEW PASSCODE</label>
              <input
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">CONFIRM NEW</label>
              <input
                type="password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {passMsg && (
            <div className={`p-2.5 rounded-xl text-xs font-mono ${passMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
              {passMsg.text}
            </div>
          )}

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono shadow-md"
          >
            Update Passcode
          </button>
        </form>
      </div>

      {/* Code Export & Backup */}
      <div className="p-5 rounded-2xl bg-surface border border-white/10 space-y-4">
        <h4 className="font-bold text-white text-base font-display flex items-center gap-2">
          <Download className="w-4 h-4 text-cyan-400" />
          Export & Backup Data
        </h4>
        <p className="text-xs text-muted font-mono">
          Download JSON backup or copy the TypeScript schema code to commit to your GitHub repository.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCopyTS}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-light hover:bg-white/10 border border-white/15 text-xs font-mono text-cyan-300 transition-colors"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied TypeScript!' : 'Copy portfolioData.ts Code'}</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-light hover:bg-white/10 border border-white/15 text-xs font-mono text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON Backup</span>
          </button>
        </div>

        {/* Restore Backup */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <label className="block text-[11px] font-mono text-slate-400">
            RESTORE FROM JSON STRING
          </label>
          <textarea
            rows={2}
            value={importStr}
            onChange={(e) => setImportStr(e.target.value)}
            placeholder="Paste JSON backup string here..."
            className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none resize-none"
          />
          <button
            onClick={handleImport}
            className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono"
          >
            Restore Backup
          </button>
          {importStatus && <span className="text-xs font-mono text-cyan-400 block">{importStatus}</span>}
        </div>
      </div>

      {/* Factory Reset */}
      <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-3">
        <div className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="w-4 h-4" />
          <h4 className="font-bold text-sm">Reset to Initial Defaults</h4>
        </div>
        <p className="text-xs text-slate-400">
          Clear all custom modifications from localStorage and restore the original portfolio data.
        </p>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all portfolio changes back to initial state?')) {
              resetToDefaults();
            }
          }}
          className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-mono"
        >
          Reset All to Default
        </button>
      </div>
    </div>
  );
};
