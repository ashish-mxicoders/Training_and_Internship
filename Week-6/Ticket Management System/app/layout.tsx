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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('tms_theme_preference');
                  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased selection:bg-amber-400 selection:text-black">
        <TicketProvider>
          <AppShell>{children}</AppShell>
        </TicketProvider>
      </body>
    </html>
  );
}
