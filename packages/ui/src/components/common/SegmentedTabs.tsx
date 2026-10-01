'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface SegmentedTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  size = 'md',
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg font-medium transition-all cursor-pointer',
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm',
              isActive
                ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.2 text-[10px]',
                  isActive
                    ? 'bg-indigo-500/20 text-indigo-300'
                    : 'bg-zinc-800 text-zinc-400'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
