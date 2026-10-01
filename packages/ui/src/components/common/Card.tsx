import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'outline' | 'glass';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-card border border-border text-card-foreground shadow-sm',
      subtle: 'bg-muted/50 border border-border text-foreground',
      outline: 'bg-transparent border border-border text-foreground',
      glass: 'bg-card/80 backdrop-blur-md border border-border text-card-foreground',
    };

    return (
      <div
        ref={ref}
        className={cn('rounded-lg overflow-hidden', variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
