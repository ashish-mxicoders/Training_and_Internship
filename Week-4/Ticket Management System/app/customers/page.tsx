'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Building2, Search, Mail, Ticket, ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTickets } from '@/lib/ticket-context';

export default function CustomersPage() {
  const { tickets, setCategoryFilter } = useTickets();
  const [search, setSearch] = useState('');

  // Extract unique companies from tickets
  const companiesMap = new Map<string, {
    name: string;
    contactName: string;
    contactEmail: string;
    tickets: typeof tickets;
  }>();

  tickets.forEach((t) => {
    const comp = t.customer.company;
    if (!companiesMap.has(comp)) {
      companiesMap.set(comp, {
        name: comp,
        contactName: t.customer.name,
        contactEmail: t.customer.email,
        tickets: [t],
      });
    } else {
      companiesMap.get(comp)!.tickets.push(t);
    }
  });

  const companies = Array.from(companiesMap.values()).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.contactName.toLowerCase().includes(search.toLowerCase()) ||
    c.contactEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Customer Organizations
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Accounts, SLA contracts, and active support engagement
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organizations or contacts..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400/50"
          />
        </div>
      </div>

      {/* Grid of Company Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {companies.map((company, idx) => {
          const openTickets = company.tickets.filter((t) => t.status === 'open' || t.status === 'pending');
          const hasBreach = company.tickets.some((t) => t.health === 'breached');

          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold flex items-center justify-center text-sm">
                    {company.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                    {company.tickets.length} tickets
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-900 dark:text-white leading-tight">
                  {company.name}
                </h3>

                <div className="space-y-1.5 mt-3 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      {company.contactName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{company.contactEmail}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Info */}
              <div className="pt-4 mt-5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {openTickets.length} open
                  </span>
                  <span className="text-zinc-400">({company.tickets.length} total)</span>
                </div>

                {hasBreach ? (
                  <span className="text-[11px] font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md">
                    ● SLA Breached
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                    ● Health Good
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
