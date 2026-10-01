import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'md',
  dot = false,
  children,
  ...props
}) => {
  const variants = {
    primary: 'bg-indigo-950/80 text-indigo-300 border-indigo-700/50',
    secondary: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    success: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50',
    warning: 'bg-amber-950/80 text-amber-300 border-amber-700/50',
    danger: 'bg-red-950/80 text-red-300 border-red-700/50',
    info: 'bg-sky-950/80 text-sky-300 border-sky-700/50',
    neutral: 'bg-zinc-900 text-zinc-400 border-zinc-800',
  };

  const dotColors = {
    primary: 'bg-indigo-400',
    secondary: 'bg-zinc-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-red-400',
    info: 'bg-sky-400',
    neutral: 'bg-zinc-500',
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5 font-medium tracking-wide uppercase',
    md: 'text-xs px-2 py-0.5 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border tracking-wide select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
};
