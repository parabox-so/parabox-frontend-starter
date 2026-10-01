'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Button, Badge } from '@parabox/ui';

export interface LogEntry {
  id?: string;
  timestamp?: number | string;
  message: string;
  level?: 'info' | 'warn' | 'error' | 'debug';
  source?: string;
}

export interface VirtualLogStreamProps {
  logs: (string | LogEntry)[];
  maxLogs?: number;
  showSearch?: boolean;
  autoScroll?: boolean;
  height?: string;
  title?: string;
  className?: string;
  onClear?: () => void;
}

// Convert ANSI escape codes to basic HTML colored spans
function parseAnsi(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Regex to match ANSI 16/256 color codes: \u001b[...m
  const regex = /\u001b\[([0-9;]+)m/g;
  let lastIndex = 0;
  let currentColorClass = '';
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const chunk = text.slice(lastIndex, match.index);
      parts.push(
        <span key={lastIndex} className={currentColorClass}>
          {chunk}
        </span>
      );
    }

    const code = match[1];
    if (code === '0' || code === '39') {
      currentColorClass = '';
    } else if (code === '31' || code === '91') {
      currentColorClass = 'text-red-400 font-semibold';
    } else if (code === '32' || code === '92') {
      currentColorClass = 'text-emerald-400';
    } else if (code === '33' || code === '93') {
      currentColorClass = 'text-amber-400';
    } else if (code === '34' || code === '94') {
      currentColorClass = 'text-blue-400';
    } else if (code === '35' || code === '95') {
      currentColorClass = 'text-purple-400';
    } else if (code === '36' || code === '96') {
      currentColorClass = 'text-cyan-400';
    } else if (code === '1') {
      currentColorClass += ' font-bold';
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(
      <span key={lastIndex} className={currentColorClass}>
        {text.slice(lastIndex)}
      </span>
    );
  }

  return parts.length > 0 ? parts : [text];
}

export const VirtualLogStream: React.FC<VirtualLogStreamProps> = ({
  logs,
  maxLogs = 2000,
  showSearch = true,
  autoScroll: initialAutoScroll = true,
  height = '420px',
  title = 'Console Stream',
  className,
  onClear,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [autoScroll, setAutoScroll] = useState(initialAutoScroll);
  const [copied, setCopied] = useState(false);
  const streamContainerRef = useRef<HTMLDivElement>(null);

  // Normalize logs to LogEntry shape
  const normalizedLogs = useMemo(() => {
    const raw = logs.slice(-maxLogs);
    return raw.map((item, index) => {
      if (typeof item === 'string') {
        let level: LogEntry['level'] = 'info';
        if (/error|fatal|exception/i.test(item)) level = 'error';
        else if (/warn/i.test(item)) level = 'warn';
        else if (/debug|trace/i.test(item)) level = 'debug';

        return {
          id: `log-${index}`,
          message: item,
          level,
          timestamp: Date.now(),
        };
      }
      return {
        ...item,
        id: item.id || `log-${index}`,
      };
    });
  }, [logs, maxLogs]);

  // Filter logs by search
  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return normalizedLogs;
    const q = searchQuery.toLowerCase();
    return normalizedLogs.filter((l) => l.message.toLowerCase().includes(q));
  }, [normalizedLogs, searchQuery]);

  // Auto-scroll handler
  useEffect(() => {
    if (autoScroll && streamContainerRef.current) {
      streamContainerRef.current.scrollTop = streamContainerRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll]);

  const handleCopyAll = () => {
    const text = filteredLogs.map((l) => l.message).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getLevelColor = (level?: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return 'text-red-400 bg-red-950/60 border-red-800/50';
      case 'warn':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/50';
      case 'debug':
        return 'text-zinc-500 bg-zinc-900 border-zinc-800';
      default:
        return 'text-indigo-400 bg-indigo-950/60 border-indigo-800/50';
    }
  };

  return (
    <Card className={`flex flex-col border border-zinc-800 bg-zinc-950 rounded-xl overflow-hidden font-mono shadow-2xl ${className || ''}`}>
      {/* Stream Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-zinc-900 border-b border-zinc-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-green-500/80 inline-block" />
          </div>
          <span className="font-semibold text-zinc-200">{title}</span>
          <Badge variant="neutral" size="sm">
            {filteredLogs.length} events
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {showSearch && (
            <input
              type="text"
              placeholder="Filter logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder:text-zinc-600 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-indigo-500 w-36 lg:w-48"
            />
          )}

          <Button
            size="xs"
            variant={autoScroll ? 'primary' : 'outline'}
            onClick={() => setAutoScroll(!autoScroll)}
          >
            {autoScroll ? 'Auto-Scroll: ON' : 'Auto-Scroll: OFF'}
          </Button>

          <Button size="xs" variant="outline" onClick={handleCopyAll}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>

          {onClear && (
            <Button size="xs" variant="ghost" onClick={onClear}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Log Container */}
      <div
        ref={streamContainerRef}
        style={{ height }}
        className="overflow-y-auto p-4 space-y-1 text-xs select-text bg-zinc-950 text-zinc-300 scrollbar-thin scrollbar-thumb-zinc-800"
      >
        {filteredLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-600">
            {searchQuery ? 'No matching log lines' : 'Waiting for telemetry output...'}
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div
              key={log.id || index}
              className="flex items-start gap-3 py-0.5 hover:bg-zinc-900/50 rounded px-1 group"
            >
              {/* Line Index */}
              <span className="text-zinc-600 select-none text-[11px] w-8 text-right shrink-0">
                {index + 1}
              </span>

              {/* Level Badge */}
              {log.level && (
                <span
                  className={`text-[9px] font-bold uppercase px-1 rounded border shrink-0 ${getLevelColor(
                    log.level
                  )}`}
                >
                  {log.level}
                </span>
              )}

              {/* Timestamp if available */}
              {log.timestamp && (
                <span className="text-zinc-500 text-[10px] shrink-0 select-none">
                  {typeof log.timestamp === 'number'
                    ? new Date(log.timestamp).toISOString().slice(11, 19)
                    : log.timestamp}
                </span>
              )}

              {/* Message Payload */}
              <div className="flex-1 break-all whitespace-pre-wrap leading-relaxed">
                {parseAnsi(log.message)}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
