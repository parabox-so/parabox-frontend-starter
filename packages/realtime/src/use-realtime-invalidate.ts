'use client';

import { useEffect } from 'react';
import type { QueryClient, QueryKey } from '@tanstack/react-query';
import { wsManager } from './ws-manager';

export interface UseRealtimeInvalidateOptions {
  channel: string;
  events?: string[];
  queryKeys: QueryKey[];
  queryClient: QueryClient;
  enabled?: boolean;
}

export function useRealtimeInvalidate({
  channel,
  events = ['*'],
  queryKeys,
  queryClient,
  enabled = true,
}: UseRealtimeInvalidateOptions) {
  useEffect(() => {
    if (!enabled || !channel || !queryClient) return;

    const unsubscribe = wsManager.subscribe(channel, (_data, incomingEvent) => {
      const match = events.includes('*') || events.includes(incomingEvent);
      if (match) {
        queryKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [channel, JSON.stringify(events), queryKeys, queryClient, enabled]);
}
