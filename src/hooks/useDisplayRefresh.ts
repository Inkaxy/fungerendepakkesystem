
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
      console.log('🔄 Display refresh triggered');
      
      // Comprehensive refresh of all display-related queries
      const queriesToRefresh = [
        'orders',
        'customers', 
        'packing-data',
        'display-settings',
        'active-packing-products',
        'active-packing-date',
        'public-active-packing-products',
        'public-active-packing-date',
        'public-packing-data',
        'public-display-settings',
        'public-customer'
      ];

      queriesToRefresh.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        queryClient.refetchQueries({ queryKey: [queryKey] });
      });
    };

    intervalRef.current = setInterval(refreshData, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, queryClient]);

  const triggerRefresh = () => {
    console.log('🔄 Manual display refresh triggered');
    
    const queriesToRefresh = [
      'orders',
      'customers',
      'packing-data', 
      'display-settings',
      'active-packing-products',
      'active-packing-date',
      'public-active-packing-products',
      'public-active-packing-date',
      'public-packing-data',
      'public-display-settings',
      'public-customer'
    ];

    queriesToRefresh.forEach(queryKey => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.refetchQueries({ queryKey: [queryKey] });
    });
  };

  return { triggerRefresh };
};
