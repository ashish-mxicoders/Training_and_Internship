'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, AlertCircle, ChevronDown } from 'lucide-react';
import { useTickets } from '@/lib/ticket-context';
import { TicketCategory, TicketChannel, TicketPriority, TicketStatus, TicketHealth } from '@/types/ticket';
import { TEAM_MEMBERS } from '@/lib/mock-data';

export function NewTicketModal() {
  const {
    isNewTicketModalOpen,
    setIsNewTicketModalOpen,
    addTicket,
    initialModalStatus,
    categories,
  } = useTickets();

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TicketStatus | 'escalated'>('open');
  const [priority, setPriority] = useState<TicketPriority>('high');
  const [category, setCategory] = useState<string>('technical');
  const [channel, setChannel] = useState<TicketChannel>('email');
  const [health, setHealth] = useState<TicketHealth>('on_track');
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [isEscalated, setIsEscalated] = useState(false);
  const [error, setError] = useState('');

  // Whenever modal opens or initialModalStatus changes, preselect the clicked column status!
  useEffect(() => {
    if (isNewTicketModalOpen) {
      setStatus(initialModalStatus || 'open');
      if (initialModalStatus === 'open') {
        setIsEscalated(false);
      }
    }
  }, [isNewTicketModalOpen, initialModalStatus]);

  if (!isNewTicketModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setError('Please provide a subject title for the ticket');
      return;
    }

    const assignedMember = assigneeId
      ? Object.values(TEAM_MEMBERS).find((m) => m.id === assigneeId)
      : undefined;

    const shouldEscalate = isEscalated || status === 'escalated';

    addTicket({
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
        name: customerName.trim() || 'Client User',
        company: companyName.trim() || 'Acme Partner',
        email: customerEmail.trim() || 'contact@client.com',
      },
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      tags: [category.toUpperCase(), channel.toUpperCase()],
    });

    // Reset and close
    setSubject('');
    setDescription('');
    setCustomerName('');
    setCompanyName('');
    setCustomerEmail('');
    setAssigneeId('');
    setIsEscalated(false);
    setError('');
    setIsNewTicketModalOpen(false);
  };

  return (
    <div
      onClick={() => setIsNewTicketModalOpen(false)}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer touch-manipulation"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white dark:bg-[#141824] rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 cursor-auto"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50/50 dark:bg-[#121520]/50">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-400 text-black flex items-center justify-center font-bold text-sm">
              +
            </span>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Create New Support Ticket
            </h2>
          </div>
          <button
            onClick={() => setIsNewTicketModalOpen(false)}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Subject */}
          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Ticket Subject / Issue Summary *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. SSO SAML configuration failing on IdP callback"
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-hidden"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Description / Reproduction Steps
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide background, customer logs, or relevant details..."
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-hidden resize-none"
            />
          </div>

          {/* Grid Settings */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Priority
              </label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                  className="w-full appearance-none text-xs py-2 pl-3 pr-8 bg-white dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-200 focus:outline-hidden capitalize cursor-pointer"
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="todo">Todo</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none text-xs py-2 pl-3 pr-8 bg-white dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-200 focus:outline-hidden capitalize cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Channel
              </label>
              <div className="relative">
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as TicketChannel)}
                  className="w-full appearance-none text-xs py-2 pl-3 pr-8 bg-white dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-200 focus:outline-hidden capitalize cursor-pointer"
                >
                  <option value="email">Email</option>
                  <option value="chat">Chat</option>
                  <option value="slack">Slack</option>
                  <option value="web">Web</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Initial Status
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => {
                    const val = e.target.value as TicketStatus | 'escalated';
                    setStatus(val);
                    if (val === 'escalated') {
                      setIsEscalated(true);
                    }
                  }}
                  className="w-full appearance-none text-xs py-2 pl-3 pr-8 bg-white dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-200 focus:outline-hidden capitalize cursor-pointer"
                >
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="escalated">⚠️ Escalated</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Health SLA
              </label>
              <div className="relative">
                <select
                  value={health}
                  onChange={(e) => setHealth(e.target.value as TicketHealth)}
                  className="w-full appearance-none text-xs py-2 pl-3 pr-8 bg-white dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-200 focus:outline-hidden cursor-pointer"
                >
                  <option value="on_track">On Track</option>
                  <option value="warning">Warning</option>
                  <option value="breached">Breached</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Assignee (Optional)
              </label>
              <div className="relative">
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full appearance-none text-xs py-2 pl-3 pr-8 bg-white dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-200 focus:outline-hidden cursor-pointer"
                >
                  <option value="">Unassigned (None)</option>
                  {Object.values(TEAM_MEMBERS).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs py-2 px-2.5 bg-white dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-200 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 pt-5">
              <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">
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

          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Customer Contact Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Pine & Peak"
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setIsNewTicketModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-semibold text-xs rounded-xl shadow-xs transition-transform active:scale-95"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
