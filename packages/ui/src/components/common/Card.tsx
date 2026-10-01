import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'outline' | 'glass';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-sm',
      subtle: 'bg-zinc-950/60 border border-zinc-850 text-zinc-200',
      outline: 'bg-transparent border border-zinc-800 text-zinc-200',
      glass: 'bg-zinc-900/70 backdrop-blur-md border border-zinc-800/80 text-zinc-100',
    };

    return (
      <div
        ref={ref}
        className={cn('rounded-xl overflow-hidden', variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
