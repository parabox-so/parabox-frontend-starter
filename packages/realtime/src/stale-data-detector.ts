'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface StaleDataDetectorOptions {
  staleThresholdMs?: number; // e.g. 15000 (15 seconds)
  checkIntervalMs?: number;  // e.g. 2000
  onStaleStateChange?: (isStale: boolean) => void;
}

export function useStaleDataDetector(options?: StaleDataDetectorOptions) {
  const staleThresholdMs = options?.staleThresholdMs ?? 15000;
  const checkIntervalMs = options?.checkIntervalMs ?? 2000;
  const onStaleStateChange = options?.onStaleStateChange;

  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [isStale, setIsStale] = useState<boolean>(false);
  const isStaleRef = useRef(isStale);

  const markActivity = useCallback(() => {
    const now = Date.now();
    setLastActivity(now);
    if (isStaleRef.current) {
      isStaleRef.current = false;
      setIsStale(false);
      onStaleStateChange?.(false);
    }
  }, [onStaleStateChange]);

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Date.now() - lastActivity;
      const newlyStale = elapsed > staleThresholdMs;

      if (newlyStale !== isStaleRef.current) {
        isStaleRef.current = newlyStale;
        setIsStale(newlyStale);
        onStaleStateChange?.(newlyStale);
      }
    }, checkIntervalMs);

    return () => clearInterval(timer);
  }, [lastActivity, staleThresholdMs, checkIntervalMs, onStaleStateChange]);

  return {
    isStale,
    lastActivity,
    markActivity,
    secondsSinceLastActivity: Math.floor((Date.now() - lastActivity) / 1000),
  };
}
