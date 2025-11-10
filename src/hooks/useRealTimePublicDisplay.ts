import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealTimePublicDisplay = (bakeryId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!bakeryId) return;

    console.log('🔄 Setting up PUBLIC real-time listener for bakery:', bakeryId);

    // Listen to active_packing_products changes
    const productsChannel = supabase
      .channel(`public-active-products-${bakeryId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_packing_products',
          filter: `bakery_id=eq.${bakeryId}`
        },
        (payload) => {
          console.log('🔔 PUBLIC: Active packing products changed!', payload.eventType);
          
          // Invalidate and immediately refetch all relevant public queries
          queryClient.invalidateQueries({ queryKey: ['public-active-packing-products'] });
          queryClient.invalidateQueries({ queryKey: ['public-active-packing-date'] });
          queryClient.invalidateQueries({ queryKey: ['public-packing-data'] });
          
          // Force immediate refetch
          queryClient.refetchQueries({ queryKey: ['public-active-packing-products'] });
          queryClient.refetchQueries({ queryKey: ['public-packing-data'] });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ PUBLIC real-time connection established');
        }
      });

    // Listen to order_products changes (packing status updates)
    const orderProductsChannel = supabase
      .channel(`public-order-products-${bakeryId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'order_products'
        },
        (payload) => {
          console.log('🔔 PUBLIC: Order product updated (packing status)');
          
          // Invalidate packing data to show updated status
          queryClient.invalidateQueries({ queryKey: ['public-packing-data'] });
          queryClient.refetchQueries({ queryKey: ['public-packing-data'] });
        }
      )
      .subscribe();

    return () => {
      console.log('🧹 Cleaning up PUBLIC real-time listeners');
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(orderProductsChannel);
    };
  }, [queryClient, bakeryId]);
};
