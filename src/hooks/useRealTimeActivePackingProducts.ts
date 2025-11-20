
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';

export const useRealTimeActivePackingProducts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { profile } = useAuthStore();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');

  useEffect(() => {
    if (!profile?.bakery_id) return;

    console.log('🔄 Setting up real-time listener for bakery:', profile.bakery_id);

    const channel = supabase
      .channel(`active-packing-products-${profile.bakery_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_packing_products',
          filter: `bakery_id=eq.${profile.bakery_id}`
        },
        (payload) => {
          const eventTime = performance.now();
          console.log('⚡ Active products changed:', {
            eventType: payload.eventType,
            timestamp: eventTime.toFixed(2),
            data: payload.eventType === 'DELETE' ? payload.old : payload.new
          });
          
          // Direct cache update for active products
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            queryClient.setQueryData(
              ['active-packing-products', profile.bakery_id, (payload.new as any).session_date],
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
            const deletedItem = payload.old as any;
            console.log('🗑️ Deleting active product from cache:', {
              id: deletedItem.id,
              session_date: deletedItem.session_date,
              product_name: deletedItem.product_name
            });
            
            queryClient.setQueryData(
              ['active-packing-products', deletedItem.session_date],
              (oldData: any[] | undefined) => 
                oldData?.filter(item => item.id !== deletedItem.id) || []
            );
          }
          
          // Mark packing-data as stale to trigger re-computation from cache
          queryClient.invalidateQueries({ 
            queryKey: ['packing-data', profile.bakery_id],
            refetchType: 'none'
          });

          // Invalider også public cache for konsistens
          queryClient.invalidateQueries({
            queryKey: ['public-packing-data-v2'],
            exact: false,
            refetchType: 'none'
          });

          console.log('🔄 Invalidated both authenticated and public packing caches');

          // Toast notifications (shortened duration)
          if (payload.eventType === 'INSERT') {
            toast({
              title: "Produkt aktivert",
              description: `Sendt til displays`,
              duration: 1500,
            });
          }
          
          console.log('✅ Products updated INSTANTLY');
        }
      )
      .subscribe((status) => {
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 
                           status === 'CHANNEL_ERROR' ? 'disconnected' : 'connecting');
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ WebSocket: Auth connection established');
        }
      });

    return () => {
      console.log('🧹 Cleaning up active packing products listener for bakery:', profile.bakery_id);
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast, profile?.bakery_id]);

  return { connectionStatus };
};
