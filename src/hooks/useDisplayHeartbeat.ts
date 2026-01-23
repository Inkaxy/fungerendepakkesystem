import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/queryKeys';

interface UseDisplayHeartbeatOptions {
  bakeryId?: string;
  enabled?: boolean;
  interval?: number; // in milliseconds, default 60000 (60s)
}

/**
 * Konsolidert heartbeat-hook for displays.
 * Invaliderer cacher med jevne mellomrom som ultimate fallback
 * for å fange opp eventuelle tapte WebSocket/Broadcast-meldinger.
 */
export const useDisplayHeartbeat = ({
  bakeryId,
  enabled = true,
  interval = 60000, // 60 sekunder default
}: UseDisplayHeartbeatOptions = {}) => {
  const queryClient = useQueryClient();

  const syncCaches = useCallback(() => {
    if (document.hidden) {
      console.log('💓 Heartbeat: Hopper over (tab skjult)');
      return;
    }

    console.log('💓 Heartbeat: Synkroniserer...');
    
    // Invaliderer kun aktive queries for displays
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_DATE[0]],
      exact: false,
      refetchType: 'active',
    });
    
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_PRODUCTS[0]],
      exact: false,
      refetchType: 'active',
    });
    
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.PUBLIC_PACKING_DATA[0]],
      exact: false,
      refetchType: 'active',
    });
  }, [queryClient]);

  useEffect(() => {
    if (!enabled || !bakeryId) return;

    console.log(`💓 Heartbeat aktivert (${interval / 1000}s intervall - broadcast er primær)`);

    const heartbeatInterval = setInterval(syncCaches, interval);

    return () => {
      clearInterval(heartbeatInterval);
      console.log('💓 Heartbeat stoppet');
    };
  }, [bakeryId, enabled, interval, syncCaches]);

  return { syncCaches };
};
