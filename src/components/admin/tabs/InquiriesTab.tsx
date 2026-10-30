import React from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Mail, Check, Trash2, Calendar, Reply, User, RefreshCw, Inbox } from 'lucide-react';

export const InquiriesTab: React.FC = () => {
  const { inquiries, refreshInquiries, markInquiryRead, deleteInquiry } = usePortfolio();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h4 className="text-lg font-bold text-white font-display">Contact Messages & Inquiries</h4>
          <p className="text-xs text-muted font-mono">
            Direct collaboration inquiries and messages submitted through the public website.
          </p>
        </div>
        <button
          onClick={refreshInquiries}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-light hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Inbox</span>
        </button>
      </div>

      {inquiries.length === 0 ? (
        <div className="p-12 rounded-3xl bg-surface border border-white/10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
          <h5 className="font-bold text-white text-base font-display">No inquiries yet</h5>
          <p className="text-xs text-muted max-w-sm mx-auto font-sans">
            Messages sent from the public "Get in Touch" form will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className={`p-5 rounded-2xl border transition-all ${
                inq.isRead
                  ? 'bg-surface/70 border-white/5 opacity-80'
                  : 'bg-surface border-cyan-500/40 shadow-lg'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-surface-light border border-white/10 text-cyan-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm font-display flex items-center gap-2">
                      <span>{inq.name}</span>
                      {!inq.isRead && (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono">
                          NEW
                        </span>
                      )}
                    </h5>
                    <a
                      href={`mailto:${inq.email}`}
                      className="text-xs font-mono text-cyan-400 hover:underline"
                    >
                      {inq.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-muted">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {inq.subject && (
                <div className="text-xs font-mono text-slate-300 font-semibold mb-2">
                  Subject: {inq.subject}
                </div>
              )}

              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed bg-surface-light/50 p-3.5 rounded-xl border border-white/5 whitespace-pre-wrap">
                {inq.message}
              </p>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <a
                  href={`mailto:${inq.email}?subject=${encodeURIComponent(`Re: ${inq.subject || 'Portfolio Inquiry'}`)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-colors"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>

                <div className="flex items-center gap-2">
                  {!inq.isRead && (
                    <button
                      onClick={() => markInquiryRead(inq.id)}
                      className="p-1.5 rounded-lg bg-surface-light hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="hidden sm:inline">Mark read</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (confirm('Delete this message?')) {
                        deleteInquiry(inq.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-surface-light hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10"
                    title="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
