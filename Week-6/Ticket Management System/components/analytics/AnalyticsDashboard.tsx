'use client';

// =====================================================================
// Isolated Client Component: Analytics Dashboard
// Real-time SLA compliance, response telemetry, and agent leaderboards.
// =====================================================================

import React from 'react';
import {
  Clock,
  CheckCircle,
  TrendingUp,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { useTickets } from '@/lib/ticket-context';
import { TEAM_MEMBERS } from '@/lib/mock-data';

export function AnalyticsDashboard() {
  const { tickets } = useTickets();

  // Metrics calculation
  const breachedCount = tickets.filter((t) => t.health === 'breached').length;
  const warningCount = tickets.filter((t) => t.health === 'warning').length;
  const onTrackCount = tickets.filter((t) => t.health === 'on_track').length;
  const slaCompliancePct = Math.round(((tickets.length - breachedCount) / (tickets.length || 1)) * 100);

  const channels = [
    { name: 'Email Support', count: tickets.filter((t) => t.channel === 'email').length, pct: 45, color: 'bg-blue-500' },
    { name: 'Live Web Chat', count: tickets.filter((t) => t.channel === 'chat').length, pct: 30, color: 'bg-amber-500' },
    { name: 'Slack Connect', count: tickets.filter((t) => t.channel === 'slack').length, pct: 20, color: 'bg-purple-500' },
    { name: 'API / Portal', count: tickets.filter((t) => t.channel === 'web').length, pct: 5, color: 'bg-emerald-500' },
  ];

  const agentStats = Object.values(TEAM_MEMBERS).map((member) => {
    const assignedTickets = tickets.filter((t) => t.assignee?.id === member.id);
    const resolved = assignedTickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;
    const active = assignedTickets.filter((t) => t.status === 'open' || t.status === 'pending').length;
    return {
      member,
      assigned: assignedTickets.length,
      resolved,
      active,
      slaAdherence: assignedTickets.length ? Math.round(((assignedTickets.length - assignedTickets.filter(t => t.health === 'breached').length) / assignedTickets.length) * 100) : 100,
      avgSpeed: '18 mins',
    };
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Performance & SLA Analytics
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time telemetry, response metrics, and resolution compliance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>SLA Standard: 99.2% Goal</span>
          </span>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <span>First Response Speed</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">14 mins</div>
          <div className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>-4.2 mins vs last week</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <span>Avg Resolution Time</span>
            <Zap className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">3.8 hrs</div>
          <div className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>12% faster turnaround</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <span>SLA Compliance</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">{slaCompliancePct}%</div>
          <div className="text-xs font-medium text-zinc-500 mt-2">
            <span>{breachedCount} breached of {tickets.length} total</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <span>Customer CSAT</span>
            <CheckCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">4.92 / 5</div>
          <div className="text-xs font-medium text-emerald-600 mt-2">
            <span>98.6% positive ratings</span>
          </div>
        </div>
      </div>

      {/* Middle Row: SLA Health Breakdown + Channel Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SLA Health Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            Active Health Status Distribution
          </h3>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-zinc-600 dark:text-zinc-400">● On Track (Safe)</span>
                <span className="font-semibold">{onTrackCount} tickets ({Math.round((onTrackCount / (tickets.length || 1)) * 100)}%)</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(onTrackCount / (tickets.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-amber-600 dark:text-amber-400">● Warning (Approaching SLA)</span>
                <span className="font-semibold">{warningCount} tickets ({Math.round((warningCount / (tickets.length || 1)) * 100)}%)</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${(warningCount / (tickets.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-rose-600 dark:text-rose-400">● Breached (Immediate Triage)</span>
                <span className="font-semibold">{breachedCount} tickets ({Math.round((breachedCount / (tickets.length || 1)) * 100)}%)</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${(breachedCount / (tickets.length || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Channel Volume Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            Incoming Volume by Ingestion Channel
          </h3>

          <div className="space-y-3 pt-2">
            {channels.map((ch, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-zinc-600 dark:text-zinc-400">{ch.name}</span>
                  <span className="font-semibold">{ch.count} tickets ({Math.round((ch.count / (tickets.length || 1)) * 100)}%)</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full ${ch.color} rounded-full`}
                    style={{ width: `${(ch.count / (tickets.length || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Performance Leaderboard Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
          Team Member Triage & SLA Leaderboard
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <tr>
                <th className="py-2.5 px-3">Team Member</th>
                <th className="py-2.5 px-3">Active Tickets</th>
                <th className="py-2.5 px-3">Resolved</th>
                <th className="py-2.5 px-3">SLA Adherence</th>
                <th className="py-2.5 px-3">Avg Response Speed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {agentStats.map(({ member, active, resolved, slaAdherence, avgSpeed }) => (
                <tr key={member.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 flex items-center justify-center">
                          {member.initials}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-zinc-900 dark:text-white">
                          {member.name}
                        </div>
                        <div className="text-[10px] text-zinc-400">{member.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium text-zinc-700 dark:text-zinc-300">{active}</td>
                  <td className="py-3 px-3 font-medium text-emerald-600">{resolved}</td>
                  <td className="py-3 px-3 font-semibold text-zinc-900 dark:text-white">{slaAdherence}%</td>
                  <td className="py-3 px-3 text-zinc-500">{avgSpeed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

