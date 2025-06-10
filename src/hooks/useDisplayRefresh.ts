
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface UseDisplayRefreshOptions {
  enabled?: boolean;
  interval?: number; // in milliseconds
}

export const useDisplayRefresh = ({ 
  enabled = true, 
  interval = 30000 // 30 seconds default
}: UseDisplayRefreshOptions = {}) => {
  const queryClient = useQueryClient();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!enabled) return;

    const refreshData = () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['packing-data'] });
      queryClient.invalidateQueries({ queryKey: ['display-settings'] });
      queryClient.invalidateQueries({ queryKey: ['active-packing-products'] });
    };

    intervalRef.current = setInterval(refreshData, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, queryClient]);

  const triggerRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    queryClient.invalidateQueries({ queryKey: ['customers'] });
    queryClient.invalidateQueries({ queryKey: ['packing-data'] });
    queryClient.invalidateQueries({ queryKey: ['display-settings'] });
    queryClient.invalidateQueries({ queryKey: ['active-packing-products'] });
  };

  return { triggerRefresh };
};
