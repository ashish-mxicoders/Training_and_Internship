'use client';

// =====================================================================
// Isolated Client Component: Login Form
// Interactive credentials inputs, 1-click demo buttons, and Server Action trigger.
// =====================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Ticket, Lock, Mail, Shield, User, AlertCircle, ArrowRight } from 'lucide-react';
import { useTickets } from '@/lib/ticket-context';
import { loginAction } from '@/app/actions/auth';

export function LoginForm() {
  const router = useRouter();
  const { loginUser } = useTickets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick Demo Login helper
  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('123456');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await loginAction({ email: email.trim(), password });

      if (!result.success || !result.data) {
        setError(result.error || 'Login failed. Please check credentials.');
        setLoading(false);
        return;
      }

      loginUser(result.data);
      router.push('/tickets');
    } catch (err: any) {
      setError(err.message || 'Network error occurred during login');
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
            Welcome Back
          </h1>
          <p className="text-xs text-zinc-500">
            Sign in to your Helpdesk & Workspace Support account
          </p>
        </div>

        {/* Quick Demo Credentials Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-2">
          <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider block">
            1-Click Demo Logins (Password: 123456)
          </span>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@acme.io')}
              className="py-1.5 px-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 border border-amber-200 dark:border-amber-900/60 text-zinc-800 dark:text-zinc-200 hover:bg-amber-100 dark:hover:bg-amber-900/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin Role</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('customer@client.com')}
              className="py-1.5 px-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 border border-amber-200 dark:border-amber-900/60 text-zinc-800 dark:text-zinc-200 hover:bg-amber-100 dark:hover:bg-amber-900/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-sky-500" />
              <span>Customer Role</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-zinc-50 dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-amber-400/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-zinc-50 dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-amber-400/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-zinc-950 font-semibold text-xs rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        {/* Footer Link to Signup */}
        <div className="text-center pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

