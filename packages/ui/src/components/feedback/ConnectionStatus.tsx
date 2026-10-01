import React from 'react';
import { cn } from '../../lib/utils';

export type ConnectionState = 'connected' | 'connecting' | 'reconnecting' | 'disconnected' | 'stale' | 'error';

export interface ConnectionStatusProps {
  state: ConnectionState;
  showText?: boolean;
  className?: string;
  lastEventTimestamp?: Date | number;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  state,
  showText = true,
  className,
  lastEventTimestamp,
}) => {
  const configs: Record<
    ConnectionState,
    { label: string; dot: string; pulse?: boolean; textCol: string }
  > = {
    connected: {
      label: 'Live',
      dot: 'bg-emerald-500',
      textCol: 'text-emerald-400',
    },
    connecting: {
      label: 'Connecting...',
      dot: 'bg-amber-400',
      pulse: true,
      textCol: 'text-amber-300',
    },
    reconnecting: {
      label: 'Reconnecting...',
      dot: 'bg-amber-500',
      pulse: true,
      textCol: 'text-amber-400',
    },
    disconnected: {
      label: 'Offline',
      dot: 'bg-zinc-500',
      textCol: 'text-zinc-400',
    },
    stale: {
      label: 'Feed Stale',
      dot: 'bg-orange-500',
      pulse: true,
      textCol: 'text-orange-400',
    },
    error: {
      label: 'Connection Error',
      dot: 'bg-red-500',
      textCol: 'text-red-400',
    },
  };

  const config = configs[state] || configs.disconnected;

  return (
    <div className={cn('inline-flex items-center gap-2 text-xs font-mono select-none', className)}>
      <span className="relative flex h-2 w-2">
        {config.pulse && (
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              config.dot
            )}
          />
        )}
        <span className={cn('relative inline-flex rounded-full h-2 w-2', config.dot)} />
      </span>
      {showText && <span className={config.textCol}>{config.label}</span>}
    </div>
  );
};
