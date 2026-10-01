import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'neutral' | 'outline' | 'success' | 'warning' | 'destructive' | 'danger' | 'info';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'sm', dot = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-primary text-primary-foreground border-transparent',
      primary: 'bg-primary text-primary-foreground border-transparent',
      secondary: 'bg-secondary text-secondary-foreground border-transparent',
      neutral: 'bg-secondary text-secondary-foreground border-transparent',
      outline: 'bg-transparent text-foreground border-border',
      success: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
      warning: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
      destructive: 'bg-destructive/15 text-destructive border-destructive/30',
      danger: 'bg-destructive/15 text-destructive border-destructive/30',
      info: 'bg-sky-500/15 text-sky-500 border-sky-500/30',
    };

    const sizes = {
      sm: 'text-[11px] px-2 py-0.5 gap-1.5 font-medium',
      md: 'text-xs px-2.5 py-1 gap-2 font-medium',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border transition-colors select-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn('w-1.5 h-1.5 rounded-full', {
              'bg-primary-foreground': variant === 'default',
              'bg-secondary-foreground': variant === 'secondary',
              'bg-foreground': variant === 'outline',
              'bg-emerald-500': variant === 'success',
              'bg-amber-500': variant === 'warning',
              'bg-destructive': variant === 'destructive',
              'bg-sky-500': variant === 'info',
            })}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
