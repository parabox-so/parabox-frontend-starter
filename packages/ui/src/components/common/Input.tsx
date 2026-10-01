'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, leftIcon, rightIcon, disabled, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-zinc-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder:text-zinc-500 text-sm px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon ? 'pl-9' : '',
              rightIcon ? 'pr-9' : '',
              error ? 'border-red-500/80 focus:ring-red-500/50 focus:border-red-500' : '',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-zinc-400 pointer-events-none flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
