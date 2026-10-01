import type { Metadata } from 'next';
import './globals.css';
import { ParaboxAuthProvider, WorkspaceSwitcher } from '@parabox/auth';
import { AppShell, PageModalHost } from '@parabox/ui';

export const metadata: Metadata = {
  title: 'Parabox Studio | Next-Gen AI Workflow Frontend',
  description: 'Enterprise block canvas, agent streaming telemetry, and RBAC governance foundation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { label: 'Overview', href: '/', icon: '📊' },
    { label: 'Canvas Editor', href: '/canvas', icon: '📝', badge: 'v3' },
    { label: 'Agent Streams', href: '/agents', icon: '⚡', badge: 'Live' },
    { label: 'Billing & Plans', href: '/billing', icon: '💳' },
  ];

  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen">
        <ParaboxAuthProvider>
          <AppShell
            appName="Parabox Studio"
            navItems={navItems}
            workspaceSlot={<WorkspaceSwitcher />}
            breadcrumbs={[{ label: 'Parabox', href: '/' }, { label: 'Studio Workspace' }]}
          >
            {children}
          </AppShell>
          <PageModalHost />
        </ParaboxAuthProvider>
      </body>
    </html>
  );
}
