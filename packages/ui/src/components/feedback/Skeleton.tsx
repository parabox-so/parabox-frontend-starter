import React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'rounded';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rounded',
  ...props
}) => {
  const variants = {
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    rounded: 'rounded-lg',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-zinc-800/80',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
