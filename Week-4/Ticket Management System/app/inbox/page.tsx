import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Inbox, Sparkles, ArrowRight, MessageSquare, Mail, Bell } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Universal Inbox | Ticket Management System',
  description: 'A single collaborative mailbox unifying customer emails and live chat',
};

export default function InboxPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 pb-20">
      {/* Top Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-amber-500/10 via-zinc-50 to-white dark:from-amber-500/10 dark:via-[#151924] dark:to-[#121620] border border-amber-200/60 dark:border-amber-500/20 shadow-xs space-y-6 text-center">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center ring-8 ring-amber-400/10">
          <Inbox className="w-8 h-8 stroke-[2.2]" />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-zinc-950">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Coming Soon</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Universal Inbox & Live Triage
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            A single collaborative mailbox unifying customer emails, live chats, and direct Slack threads into a real-time conversation queue.
          </p>
        </div>

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left max-w-2xl mx-auto">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#181D2A] border border-zinc-200/80 dark:border-zinc-800 space-y-2">
            <Mail className="w-5 h-5 text-amber-500" />
            <h3 className="text-xs font-bold text-zinc-900 dark:text-white">Omnichannel Sync</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Consolidate inquiries from Outlook, Gmail, and helpdesk domains.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#181D2A] border border-zinc-200/80 dark:border-zinc-800 space-y-2">
            <MessageSquare className="w-5 h-5 text-sky-500" />
            <h3 className="text-xs font-bold text-zinc-900 dark:text-white">Live Team Chat</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Tag engineers and resolve escalated customer blockers together.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#181D2A] border border-zinc-200/80 dark:border-zinc-800 space-y-2">
            <Bell className="w-5 h-5 text-emerald-500" />
            <h3 className="text-xs font-bold text-zinc-900 dark:text-white">Real-time Push</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Instant desktop notifications for SLA breached tickets.
            </p>
          </div>
        </div>

        <div className="pt-4">
          <Link
            href="/tickets"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-zinc-950 text-xs font-semibold rounded-xl shadow-xs transition-transform active:scale-95"
          >
            <span>Back to Tickets Board</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
