'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { TabItem } from './SegmentedTabs';

export interface UnderlineTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const UnderlineTabs: React.FC<UnderlineTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
}) => {
  return (
    <div className={cn('border-b border-zinc-800 flex items-center space-x-6', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 pb-3 pt-2 text-sm font-medium transition-colors border-b-2 -mb-px cursor-pointer',
              isActive
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-semibold',
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
