// =====================================================================
// Next.js Server Component: /login
// Page shell renders on server; login form runs as isolated client component.
// =====================================================================

import React from 'react';
import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In | Ticket Management System',
  description: 'Sign in to your Helpdesk & Workspace Support account',
};

export default function LoginPage() {
  return <LoginForm />;
}
