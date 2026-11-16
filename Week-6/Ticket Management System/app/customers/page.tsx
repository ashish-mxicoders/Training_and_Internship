// =====================================================================
// Next.js Server Component: /customers
// Page shell renders on server; directory view runs as client component.
// =====================================================================

import React from 'react';
import { Metadata } from 'next';
import { CustomersView } from '@/components/customers/CustomersView';

export const metadata: Metadata = {
  title: 'Customer Organizations | Ticket Management System',
  description: 'Accounts, SLA contracts, and active support engagement',
};

export default function CustomersPage() {
  return <CustomersView />;
}
