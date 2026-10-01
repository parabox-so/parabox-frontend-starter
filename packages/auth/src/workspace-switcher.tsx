'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParaboxAuth } from './hooks';
import { Badge, modalBus } from '@parabox/ui';

export interface WorkspaceSwitcherProps {
  className?: string;
}

export const WorkspaceSwitcher: React.FC<WorkspaceSwitcherProps> = ({ className }) => {
  const { currentTenant, workspaces, switchWorkspace } = useParaboxAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPlanBadge = (plan?: string) => {
    switch (plan) {
      case 'enterprise':
        return <Badge variant="primary" size="sm">Enterprise</Badge>;
      case 'pro':
        return <Badge variant="info" size="sm">Pro</Badge>;
      case 'starter':
        return <Badge variant="success" size="sm">Starter</Badge>;
      default:
        return <Badge variant="neutral" size="sm">Free</Badge>;
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${className || ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 rounded-xl bg-zinc-950/70 hover:bg-zinc-800/80 border border-zinc-800 transition-colors text-left group cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-7 w-7 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
            {currentTenant?.name.slice(0, 1) || 'W'}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-xs text-zinc-200 truncate group-hover:text-white">
              {currentTenant?.name || 'Select Workspace'}
            </div>
            <div className="text-[10px] text-zinc-500 capitalize">{currentTenant?.role}</div>
          </div>
        </div>

        <svg
          className={`h-4 w-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-64 rounded-xl bg-zinc-900 border border-zinc-750 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Workspaces
          </div>

          <div className="space-y-1">
            {workspaces.map((ws) => {
              const isActive = ws.id === currentTenant?.id;
              return (
                <button
                  key={ws.id}
                  onClick={() => {
                    switchWorkspace(ws.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600/15 border border-indigo-500/30 text-white'
                      : 'hover:bg-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-medium text-xs truncate">{ws.name}</span>
                  </div>
                  {getPlanBadge(ws.plan)}
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-zinc-800/80">
            <button
              onClick={() => {
                setIsOpen(false);
                modalBus.emit('CREATE_WORKSPACE', {});
              }}
              className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-indigo-400 hover:bg-indigo-950/40 transition-colors cursor-pointer"
            >
              <span>+</span> Create New Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
