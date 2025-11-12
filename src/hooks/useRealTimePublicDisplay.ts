import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealTimePublicDisplay = (bakeryId?: string) => {
  const queryClient = useQueryClient();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');

  useEffect(() => {
    if (!bakeryId) return;

    console.log('🔄 WebSocket: Setting up real-time for bakery:', bakeryId);

    const channel = supabase
      .channel(`public-display-${bakeryId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_packing_products',
          filter: `bakery_id=eq.${bakeryId}`
        },
        (payload) => {
          const startTime = performance.now();
          console.log('⚡ WebSocket: Active products changed', payload.eventType);
          
          // Direct cache update - no refetch needed
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            queryClient.setQueryData(
              ['public-active-packing-products', bakeryId, (payload.new as any).session_date],
              (oldData: any[] | undefined) => {
                if (!oldData) return [payload.new];
                
                const index = oldData.findIndex(item => item.id === (payload.new as any).id);
                if (index >= 0) {
                  const newData = [...oldData];
                  newData[index] = payload.new;
                  return newData;
                }
                return [...oldData, payload.new];
              }
            );
          } else if (payload.eventType === 'DELETE') {
            queryClient.setQueryData(
              ['public-active-packing-products', bakeryId],
              (oldData: any[] | undefined) => 
                oldData?.filter(item => item.id !== (payload.old as any).id) || []
            );
          }
          
          // Only invalidate dependent queries (packing data needs recalculation)
          queryClient.invalidateQueries({ queryKey: ['public-packing-data'], exact: false });
          
          const endTime = performance.now();
          console.log(`⚡ Update completed in ${(endTime - startTime).toFixed(2)}ms`);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'order_products'
        },
        (payload) => {
          console.log('⚡ WebSocket: Order product status updated');
          
          // Direct packing data invalidation for status changes
          queryClient.invalidateQueries({ queryKey: ['public-packing-data'], exact: false });
        }
      )
      .subscribe((status) => {
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 
                           status === 'CHANNEL_ERROR' ? 'disconnected' : 'connecting');
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ WebSocket: Connected');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ WebSocket: Connection error');
        }
      });

    return () => {
      console.log('🧹 WebSocket: Cleaning up');
      supabase.removeChannel(channel);
    };
  }, [queryClient, bakeryId]);

  return { connectionStatus };
};
