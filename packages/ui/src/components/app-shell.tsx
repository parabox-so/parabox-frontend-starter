'use client';

import React, { useState } from 'react';
import { cn } from '../lib/utils';

export interface NavItem {
  label: string;
  href: string;
  icon?: string | React.ReactNode;
  badge?: string | number;
  active?: boolean;
}

export interface AppShellProps {
  appName?: string;
  appLogo?: React.ReactNode;
  navItems: NavItem[];
  workspaceSlot?: React.ReactNode;
  userSlot?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  appName = 'Parabox',
  appLogo,
  navItems,
  workspaceSlot,
  userSlot,
  breadcrumbs,
  actions,
  children,
  className,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={cn('min-h-screen flex bg-background text-foreground antialiased', className)}>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out lg:static',
          collapsed ? 'w-18' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-3 overflow-hidden">
            {appLogo || (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold shadow-sm">
                P
              </div>
            )}
            {!collapsed && (
              <span className="font-bold text-base tracking-tight text-foreground truncate">
                {appName}
              </span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={cn('h-4 w-4 transition-transform duration-200', collapsed && 'rotate-180')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Workspace Dropdown Slot */}
        {workspaceSlot && (
          <div className="p-3 border-b border-border">
            {collapsed ? (
              <div className="flex justify-center text-xs font-mono text-muted-foreground">WS</div>
            ) : (
              workspaceSlot
            )}
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {navItems.map((item, idx) => {
            return (
              <a
                key={idx}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors group',
                  item.active
                    ? 'bg-secondary text-secondary-foreground font-semibold border border-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
                title={collapsed ? item.label : undefined}
              >
                <span className="shrink-0 text-base">
                  {typeof item.icon === 'string' ? (
                    <span className="text-xs font-mono">{item.icon.slice(0, 2)}</span>
                  ) : (
                    item.icon || (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    )
                  )}
                </span>
                {!collapsed && <span className="truncate flex-1">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground font-semibold group-hover:text-foreground">
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* User Slot / Footer */}
        <div className="p-3 border-t border-border">
          {userSlot || (
            <div className={cn('flex items-center gap-3', collapsed ? 'justify-center' : '')}>
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center font-semibold text-xs text-foreground">
                PB
              </div>
              {!collapsed && (
                <div className="overflow-hidden">
                  <p className="text-xs font-medium text-foreground truncate">Parabox User</p>
                  <p className="text-[10px] text-muted-foreground truncate">user@parabox.so</p>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header & Breadcrumbs Strip */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 ? (
              <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                {breadcrumbs.map((bc, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="text-muted-foreground/60">/</span>}
                    {bc.href ? (
                      <a href={bc.href} className="hover:text-foreground transition-colors">
                        {bc.label}
                      </a>
                    ) : (
                      <span className="text-foreground font-medium">{bc.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            ) : (
              <div className="text-sm font-semibold text-foreground">{appName}</div>
            )}
          </div>

          {/* Action Slots */}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>

        {/* Workspace Canvas / Main View */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
