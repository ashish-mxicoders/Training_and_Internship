// =====================================================================
// Next.js Server Component: /signup
// Page shell renders on server; signup form runs as isolated client component.
// =====================================================================

import React from 'react';
import { Metadata } from 'next';
import { SignupForm } from '@/components/auth/SignupForm';

export const metadata: Metadata = {
  title: 'Create Account | Ticket Management System',
  description: 'Select your role to access the Helpdesk & Workspace Support',
};

export default function SignupPage() {
  return <SignupForm />;
}
