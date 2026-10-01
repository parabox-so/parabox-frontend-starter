'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../common/Button';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6 text-center">
          <h3 className="text-base font-semibold text-red-400">Something went wrong</h3>
          <p className="mt-2 text-xs text-red-300 font-mono bg-red-950/40 p-3 rounded-lg border border-red-900/30 overflow-x-auto">
            {this.state.error?.message || 'An unexpected runtime error occurred.'}
          </p>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => this.setState({ hasError: false, error: undefined })}
            >
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
