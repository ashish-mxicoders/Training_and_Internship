// =====================================================================
// Next.js Server Component: /analytics
// Page shell renders on server; analytics dashboard runs as client component.
// =====================================================================

import React from 'react';
import { Metadata } from 'next';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

export const metadata: Metadata = {
  title: 'Performance & SLA Analytics | Ticket Management System',
  description: 'Real-time telemetry, response metrics, and resolution compliance',
};

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
