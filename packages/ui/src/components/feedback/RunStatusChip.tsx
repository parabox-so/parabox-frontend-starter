import React from 'react';
import { cn } from '../../lib/utils';

export type RunStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled' | 'paused';

export interface RunStatusChipProps {
  status: RunStatus;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const RunStatusChip: React.FC<RunStatusChipProps> = ({
  status,
  label,
  className,
  size = 'md',
}) => {
  const statusConfigs: Record<
    RunStatus,
    { text: string; bg: string; textCol: string; border: string; dot: string; pulse?: boolean }
  > = {
    queued: {
      text: 'Queued',
      bg: 'bg-zinc-900',
      textCol: 'text-zinc-400',
      border: 'border-zinc-800',
      dot: 'bg-zinc-500',
    },
    running: {
      text: 'Running',
      bg: 'bg-blue-950/70',
      textCol: 'text-blue-300',
      border: 'border-blue-800/50',
      dot: 'bg-blue-400',
      pulse: true,
    },
    completed: {
      text: 'Completed',
      bg: 'bg-emerald-950/70',
      textCol: 'text-emerald-300',
      border: 'border-emerald-800/50',
      dot: 'bg-emerald-400',
    },
    failed: {
      text: 'Failed',
      bg: 'bg-red-950/70',
      textCol: 'text-red-300',
      border: 'border-red-800/50',
      dot: 'bg-red-400',
    },
    cancelled: {
      text: 'Cancelled',
      bg: 'bg-zinc-900/80',
      textCol: 'text-zinc-400',
      border: 'border-zinc-800',
      dot: 'bg-zinc-500',
    },
    paused: {
      text: 'Paused',
      bg: 'bg-amber-950/70',
      textCol: 'text-amber-300',
      border: 'border-amber-800/50',
      dot: 'bg-amber-400',
    },
  };

  const config = statusConfigs[status] || statusConfigs.queued;
  const displayText = label || config.text;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border select-none',
        config.bg,
        config.textCol,
        config.border,
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs',
        className
      )}
    >
      <span
        className={cn(
          'rounded-full',
          size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2',
          config.dot,
          config.pulse ? 'animate-ping duration-1000' : ''
        )}
      />
      {displayText}
    </span>
  );
};
