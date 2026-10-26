'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTickets } from '@/lib/ticket-context';
import { TicketCategory, TicketChannel, TicketPriority, TicketStatus, TicketHealth } from '@/types/ticket';
import { TEAM_MEMBERS } from '@/lib/mock-data';

export default function NewTicketPage() {
  const router = useRouter();
  const { addTicket } = useTickets();

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TicketStatus | 'escalated'>('open');
  const [priority, setPriority] = useState<TicketPriority>('high');
  const [category, setCategory] = useState<TicketCategory>('technical');
  const [channel, setChannel] = useState<TicketChannel>('email');
  const [health, setHealth] = useState<TicketHealth>('on_track');
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [isEscalated, setIsEscalated] = useState(false);
  const [tagsInput, setTagsInput] = useState('Enterprise, Onboarding');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setError('Please provide a subject title for the ticket');
      return;
    }

    const assignedMember = assigneeId
      ? Object.values(TEAM_MEMBERS).find((m) => m.id === assigneeId)
      : undefined;

    const shouldEscalate = isEscalated || status === 'escalated';

    const created = await addTicket({
      subject: subject.trim(),
      description: description.trim() || 'No additional details provided.',
      status: status === 'escalated' ? 'open' : status,
      priority,
      category,
      channel,
      health,
      assignee: assignedMember,
      isEscalated: shouldEscalate,
      customer: {
        name: customerName.trim() || 'Enterprise Client',
        company: companyName.trim() || 'Acme Partner',
        email: customerEmail.trim() || 'contact@client.com',
        tier: 'Enterprise',
      },
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });

    router.push(`/tickets/${created.id.replace('#-', '')}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <Link
          href="/tickets"
          className="p-2 rounded-xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Create Support Ticket
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Log an issue, customer incident, or internal engineering request
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-6">
        <div>
          <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-1.5">
            Ticket Title / Subject *
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Low activation in week-one onboarding cohort for Pine & Peak"
            className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-1.5">
            Detailed Description & Error Logs
          </label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue, user impact, reproducible steps, or system error codes..."
            className="w-full p-4 text-sm bg-zinc-50 dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-hidden resize-none leading-relaxed"
          />
        </div>

        {/* Property Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-1.5">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TicketPriority)}
              className="w-full text-xs py-2.5 px-3 bg-zinc-50 dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-200 focus:outline-hidden capitalize"
            >
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="todo">Todo</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TicketCategory)}
              className="w-full text-xs py-2.5 px-3 bg-zinc-50 dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-200 focus:outline-hidden capitalize"
            >
              <option value="technical">Technical Issue</option>
              <option value="billing">Billing</option>
              <option value="account">Account & Login</option>
              <option value="subscription">Subscription</option>
              <option value="access">Access</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-1.5">
              Source Channel
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as TicketChannel)}
              className="w-full text-xs py-2.5 px-3 bg-zinc-50 dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-200 focus:outline-hidden capitalize"
            >
              <option value="email">Email</option>
              <option value="chat">Chat</option>
              <option value="slack">Slack</option>
              <option value="web">Web</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-1.5">
              Initial Status
            </label>
            <select
              value={status}
              onChange={(e) => {
                const val = e.target.value as TicketStatus | 'escalated';
                setStatus(val);
                if (val === 'escalated') {
                  setIsEscalated(true);
                }
              }}
              className="w-full text-xs py-2.5 px-3 bg-zinc-50 dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-200 focus:outline-hidden capitalize"
            >
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="escalated">⚠️ Escalated</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-1.5">
              Health SLA
            </label>
            <select
              value={health}
              onChange={(e) => setHealth(e.target.value as TicketHealth)}
              className="w-full text-xs py-2.5 px-3 bg-zinc-50 dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-200 focus:outline-hidden"
            >
              <option value="on_track">On Track</option>
              <option value="warning">Warning</option>
              <option value="breached">Breached</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-1.5">
              Assignee (Optional)
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full text-xs py-2.5 px-3 bg-zinc-50 dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-200 focus:outline-hidden"
            >
              <option value="">Unassigned (None)</option>
              {Object.values(TEAM_MEMBERS).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full text-xs py-2.5 px-3 bg-zinc-50 dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-200 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 pt-6">
            <label className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isEscalated}
                onChange={(e) => setIsEscalated(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
              />
              <span>Mark as Escalated</span>
            </label>
          </div>
        </div>

        {/* Customer Information */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Customer / Requester Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Pine & Peak"
                className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="sarah@pinepeak.com"
                className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. Enterprise, Onboarding, IdP"
            className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <Link
            href="/tickets"
            className="px-5 py-2.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-semibold text-xs rounded-xl shadow-xs transition-transform active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Support Ticket</span>
          </button>
        </div>
      </form>
    </div>
  );
}
