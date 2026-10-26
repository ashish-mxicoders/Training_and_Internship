// =====================================================================
// Signup Page (/signup)
// Allows creating a new account with Role Selection: Customer or Admin.
// =====================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Ticket, Lock, Mail, User, Building, Shield, AlertCircle, ArrowRight } from 'lucide-react';
import { useTickets } from '@/lib/ticket-context';

export default function SignupPage() {
  const router = useRouter();
  const { loginUser } = useTickets();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          company: company.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create account.');
        setLoading(false);
        return;
      }

      // Update global context state
      loginUser(data.user);
      router.push('/tickets');
    } catch (err: any) {
      setError(err.message || 'Network error occurred during signup');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#141824] rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Logo and Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-zinc-950 font-bold flex items-center justify-center mx-auto shadow-md">
            <Ticket className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Create an Account
          </h1>
          <p className="text-xs text-zinc-500">
            Select your role to access the Helpdesk & Workspace Support
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection Tabs */}
          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
              Choose Account Role *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  role === 'customer'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/30'
                    : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <User className="w-4 h-4 text-sky-500" />
                <span>Customer</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  role === 'admin'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/30'
                    : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-500" />
                <span>Admin / Agent</span>
              </button>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              {role === 'customer'
                ? 'Customers can create tickets and track their status in real time.'
                : 'Admins have complete control over all customer tickets, SLAs, and assignments.'}
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-50 dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-amber-400/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Work Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-50 dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-amber-400/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Company / Organization
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Pine & Peak Inc."
                className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-50 dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-amber-400/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-50 dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-amber-400/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-zinc-950 font-semibold text-xs rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{loading ? 'Creating account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
