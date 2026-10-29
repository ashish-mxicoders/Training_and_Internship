// =====================================================================
// Next.js Server Component: /settings
// Page shell renders on server; settings controls run as client component.
// =====================================================================

import React from 'react';
import { Metadata } from 'next';
import { SettingsView } from '@/components/settings/SettingsView';

export const metadata: Metadata = {
  title: 'Workspace Settings | Ticket Management System',
  description: 'Manage personal profile, theme mode, team directory, and database data',
};

export default function SettingsPage() {
  return <SettingsView />;
}
