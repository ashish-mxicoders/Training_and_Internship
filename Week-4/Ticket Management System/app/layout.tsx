import type { Metadata } from 'next';
import './globals.css';
import { TicketProvider } from '@/lib/ticket-context';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'Tickets • Helpdesk & Workspace Support',
  description: 'Enterprise Ticket Management & Workflow Orchestration System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-amber-400 selection:text-black">
        <TicketProvider>
          <AppShell>{children}</AppShell>
        </TicketProvider>
      </body>
    </html>
  );
}
