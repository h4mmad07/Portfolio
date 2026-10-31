import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Download, Upload, RefreshCw, Copy, Check, ShieldCheck, AlertTriangle, Github, Plus, X, Eye, List } from 'lucide-react';

export const SecurityTab: React.FC = () => {
  const { 
    exportJSON, 
    importJSON, 
    generateTypeScriptCode, 
    resetToDefaults,
    syncFromGitHub,
    syncMultipleRepos
  } = usePortfolio();


  const [copiedCode, setCopiedCode] = useState(false);
  const [importStr, setImportStr] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // GitHub Sync state
  const [syncRepos, setSyncRepos] = useState('');
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [syncMessages, setSyncMessages] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // GitHub repo fetch state
  const [reposFromGitHub, setReposFromGitHub] = useState<Array<{ full_name: string; fork: boolean }>>([]);
  const [isFetchingRepos, setIsFetchingRepos] = useState(false);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [autoPublishOnSync, setAutoPublishOnSync] = useState(true);

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

  // GitHub Sync Handlers
  const handleSyncSingle = async () => {
    const repo = syncRepos.trim();
    if (!repo) {
      setSyncStatus({ type: 'error', text: 'Please enter a repository name (e.g. h4mmad07/repo-name)' });
      return;
    }

    setIsSyncing(true);
    setSyncStatus(null);
    setSyncMessages([]);

    try {
      const result = await syncFromGitHub(repo);
      if (result.success) {
        setSyncStatus({ type: 'success', text: result.message });
      } else {
        setSyncStatus({ type: 'error', text: result.message });
      }
    } catch (err: any) {
      setSyncStatus({ type: 'error', text: err.message || 'Sync failed.' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncMultiple = async () => {
    const repos = syncRepos
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    if (repos.length === 0) {
      setSyncStatus({ type: 'error', text: 'Please enter repository names separated by commas.' });
      return;
    }

    setIsSyncing(true);
    setSyncStatus(null);
    setSyncMessages([]);

    try {
      const result = await syncMultipleRepos(repos, autoPublishOnSync);
      setSyncMessages(result.messages);
      setSyncStatus({
        type: result.failed > 0 ? 'error' : 'success',
        text: `${result.success} synced, ${result.failed} failed`
      });
    } catch (err: any) {
      setSyncStatus({ type: 'error', text: err.message || 'Batch sync failed.' });
    } finally {
      setIsSyncing(false);
    }
  };

  // Fetch repos from GitHub API
  const handleFetchRepos = async () => {
    setIsFetchingRepos(true);
    setSyncStatus(null);
    setReposFromGitHub([]);

    try {
      const res = await fetch('https://api.github.com/users/h4mmad07/repos?per_page=100&sort=updated', {
        headers: {
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'h4mmad07-portfolio-sync'
        }
      });

      if (!res.ok) {
        setSyncStatus({ type: 'error', text: 'Failed to fetch repos from GitHub.' });
        return;
      }

      const repos = await res.json();
      const formatted = repos.map((r: any) => ({
        full_name: r.full_name,
        fork: r.fork || false
      }));

      setReposFromGitHub(formatted);
      setSyncStatus({ type: 'success', text: `Loaded ${formatted.length} repositories.` });
    } catch (err: any) {
      setSyncStatus({ type: 'error', text: err.message || 'Failed to load repos.' });
    } finally {
      setIsFetchingRepos(false);
    }
  };

  // Toggle repo selection
  const handleRepoSelect = (fullName: string) => {
    setSelectedRepos((prev) =>
      prev.includes(fullName) ? prev.filter((r) => r !== fullName) : [...prev, fullName]
    );
  };

  // Sync selected repos
  const handleSyncSelected = async () => {
    if (selectedRepos.length === 0) return;

    setIsSyncing(true);
    setSyncStatus(null);
    setSyncMessages([]);

    try {
      const result = await syncMultipleRepos(selectedRepos, autoPublishOnSync);
      setSyncMessages(result.messages);
      setSyncStatus({
        type: result.failed > 0 ? 'error' : 'success',
        text: `${result.success} synced, ${result.failed} failed`
      });
    } catch (err: any) {
      setSyncStatus({ type: 'error', text: err.message || 'Sync failed.' });
    } finally {
      setIsSyncing(false);
    }
  };

  // Sync all fetched repos
  const handleSyncAll = async () => {
    if (reposFromGitHub.length === 0) return;

    const allRepos = reposFromGitHub.map((r) => r.full_name);

    setIsSyncing(true);
    setSyncStatus(null);
    setSyncMessages([]);

    try {
      const result = await syncMultipleRepos(allRepos, autoPublishOnSync);
      setSyncMessages(result.messages);
      setSyncStatus({
        type: result.failed > 0 ? 'error' : 'success',
        text: `${result.success} synced, ${result.failed} failed`
      });
    } catch (err: any) {
      setSyncStatus({ type: 'error', text: err.message || 'Sync failed.' });
    } finally {
      setIsSyncing(false);
    }
  };

  // Toggle auto-publish on sync
  const handleAutoPublishToggle = () => {
    setAutoPublishOnSync((prev) => !prev);
  };

  return (
    <div className="space-y-8">
      <div className="p-5 rounded-2xl bg-surface border border-white/10 space-y-2">
        <h4 className="font-bold text-white text-base font-display">Account security</h4>
        <p className="text-xs text-muted font-mono">Admin access uses the verified owner account. Change its password through the secure recovery flow on the sign-in screen.</p>
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

      {/* GitHub Auto-Sync */}
      <div className="p-5 rounded-2xl bg-surface border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-cyan-400">
          <Github className="w-5 h-5" />
          <h4 className="font-bold text-white text-base font-display">GitHub Auto-Sync</h4>
        </div>
        <p className="text-xs text-muted font-mono">
          Sync your GitHub repositories to the portfolio. Choose which repos to publish.
        </p>

        <div className="space-y-3">
          {/* Fetch repos button */}
          <div className="flex gap-2">
            <button
              onClick={handleFetchRepos}
              disabled={isFetchingRepos}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200 transition-all disabled:opacity-60"
            >
              {isFetchingRepos ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <List className="w-3.5 h-3.5" />
                  <span>Load My GitHub Repos</span>
                </>
              )}
            </button>

            <button
              onClick={handleAutoPublishToggle}
              className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-mono transition-colors ${
                autoPublishOnSync
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-surface-light border-white/10 text-slate-300'
              }`}
            >
              {autoPublishOnSync ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              <span>Auto-publish synced repos</span>
            </button>
          </div>

          {/* Manual text input (fallback) */}
          <div>
            <label className="block text-[10px] font-mono text-slate-300 mb-1">OR ENTER MANUALLY</label>
            <input
              type="text"
              value={syncRepos}
              onChange={(e) => setSyncRepos(e.target.value)}
              placeholder="e.g. h4mmad07/portfolio, h4mmad07/game-project"
              className="w-full px-3 py-2 rounded-xl bg-surface-light border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
            <p className="text-[9px] text-slate-400 mt-1 font-mono">
              Separate multiple repos with commas. Format: username/repo-name
            </p>
          </div>

          {/* Repo list with checkboxes */}
          {reposFromGitHub.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto border border-white/10 rounded-xl bg-surface-light/50 p-2">
              <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-[10px] font-mono text-slate-400">Repository</span>
                <span className="text-[10px] font-mono text-slate-400">Publish</span>
              </div>
              {reposFromGitHub.map((repo) => (
                <div
                  key={repo.full_name}
                  className="flex items-center gap-2 px-2 py-1.5 border-b border-white/5 hover:bg-white/5"
                >
                  <input
                    type="checkbox"
                    checked={selectedRepos.includes(repo.full_name)}
                    onChange={() => handleRepoSelect(repo.full_name)}
                    className="rounded border-white/20 text-cyan-500 focus:ring-0"
                  />
                  <span className="text-xs font-mono text-slate-200 truncate flex-1">
                    {repo.full_name}
                  </span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                    repo.fork ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {repo.fork ? 'Fork' : 'Owned'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Sync buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSyncSelected}
              disabled={isSyncing || selectedRepos.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all disabled:opacity-60"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync Selected ({selectedRepos.length})</span>
                </>
              )}
            </button>

            <button
              onClick={handleSyncAll}
              disabled={isSyncing || reposFromGitHub.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200 transition-all disabled:opacity-60"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync All ({reposFromGitHub.length})</span>
                </>
              )}
            </button>
          </div>

          {syncStatus && (
            <div className={`p-3 rounded-xl text-xs font-mono ${
              syncStatus.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : syncStatus.type === 'error'
                ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
            }`}>
              {syncStatus.text}
            </div>
          )}

          {syncMessages.length > 0 && (
            <div className="mt-2 space-y-1">
              <span className="block text-[10px] font-mono text-slate-400 mb-1">Results:</span>
              {syncMessages.map((msg, idx) => (
                <div key={idx} className="text-xs font-mono p-1 rounded bg-surface-light/50 border border-white/5">
                  {msg}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
