'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Badge } from '@parabox/ui';
import { BlockType } from './CanvasContext';

export interface SlashMenuItem {
  type: BlockType;
  label: string;
  description: string;
  shortcut: string;
  iconText: string;
  badge?: string;
}

export const SLASH_MENU_ITEMS: SlashMenuItem[] = [
  {
    type: 'clause',
    label: 'Policy / Contract Clause',
    description: 'Editable clause statement with compliance validation badges',
    shortcut: '/clause',
    iconText: '📜',
    badge: 'Core',
  },
  {
    type: 'evidence',
    label: 'Evidence Artifact',
    description: 'Preview JSON payload, test output, or download traces',
    shortcut: '/evidence',
    iconText: '🔍',
  },
  {
    type: 'diff',
    label: 'Unified Diff',
    description: 'Compare code, YAML policies, and line-level changes',
    shortcut: '/diff',
    iconText: '⚡',
  },
  {
    type: 'finding',
    label: 'Diagnostic Finding',
    description: 'Flag vulnerabilities with severity rating & auto-fix buttons',
    shortcut: '/finding',
    iconText: '🛡️',
  },
  {
    type: 'gate',
    label: 'Quality Gate',
    description: 'Pass/fail checkpoint criteria for production deployments',
    shortcut: '/gate',
    iconText: '🚦',
    badge: 'Security',
  },
  {
    type: 'journey',
    label: 'User / Agent Journey',
    description: 'Step-by-step pipeline visualization and timeline',
    shortcut: '/journey',
    iconText: '🚀',
  },
];

export interface SlashMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: BlockType) => void;
  position?: { top: number; left: number };
}

export const SlashMenu: React.FC<SlashMenuProps> = ({
  isOpen,
  onClose,
  onSelect,
  position,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = SLASH_MENU_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.shortcut.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          onSelect(filteredItems[selectedIndex].type);
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onSelect, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 backdrop-blur-sm bg-black/40">
      <div
        ref={menuRef}
        className="w-full max-w-lg bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-100"
      >
        <div className="p-3 border-b border-zinc-800 flex items-center gap-2 bg-zinc-950/60">
          <span className="text-zinc-500 font-mono text-sm pl-2">/</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a block name (e.g. clause, diff, gate)..."
            className="w-full bg-transparent border-none text-zinc-100 placeholder:text-zinc-500 text-sm focus:outline-none"
          />
          <Badge variant="neutral" size="sm">
            ESC to close
          </Badge>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-4 text-center text-xs text-zinc-500">No matching blocks found.</div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.type}
                  onClick={() => {
                    onSelect(item.type);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                      : 'hover:bg-zinc-800/60 text-zinc-300'
                  }`}
                >
                  <div className="text-xl p-1 bg-zinc-950/60 rounded-lg border border-zinc-800 shrink-0">
                    {item.iconText}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-zinc-100">{item.label}</span>
                      {item.badge && <Badge variant="primary" size="sm">{item.badge}</Badge>}
                      <span className="font-mono text-[10px] text-zinc-500 ml-auto">{item.shortcut}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5 truncate">{item.description}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
