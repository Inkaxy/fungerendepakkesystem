import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useInstantDisplayUpdates = (screenType: 'small' | 'large' | 'shared' = 'shared') => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log(`🚀 Setting up INSTANT display updates for ${screenType} screen`);

    // Single optimized channel for all critical display data
    const channel = supabase
      .channel(`instant-display-${screenType}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_packing_products'
        },
        (payload) => {
          console.log(`⚡ INSTANT ${screenType} screen update:`, payload.eventType);
          
          // ZERO-DELAY OPTIMISTIC UPDATES
          const sessionDate = (payload.new as any)?.session_date || (payload.old as any)?.session_date;
          
          // Update cache immediately without waiting for network
          if (payload.eventType === 'INSERT' || payload.eventType === 'DELETE') {
            queryClient.setQueryData(['active-packing-products', sessionDate], (old: any) => {
              if (payload.eventType === 'INSERT') {
                return [...(old || []), payload.new];
              } else {
                return (old || []).filter((item: any) => item.id !== payload.old.id);
              }
            });
          }

          // Screen-specific optimization
          if (screenType === 'large') {
            // Large screens: Minimal animations, focus on content
            queryClient.refetchQueries({ 
              queryKey: ['packing-data'],
              exact: false 
            });
          } else {
            // Small screens: Detailed updates
            queryClient.refetchQueries({ 
              queryKey: ['active-packing-products'],
              exact: false 
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'order_products',
          filter: 'packing_status=neq.pending'
        },
        (payload) => {
          console.log(`⚡ INSTANT order status update for ${screenType}:`, payload.new?.packing_status);
          
          // Optimistic status update
          queryClient.setQueryData(['orders'], (old: any) => {
            if (!old) return old;
            
            return old.map((order: any) => ({
              ...order,
              order_products: order.order_products?.map((product: any) => 
                product.id === payload.new.id 
                  ? { ...product, packing_status: payload.new.packing_status }
                  : product
              )
            }));
          });

          // Immediate refetch without stale time
          queryClient.refetchQueries({ 
            queryKey: ['orders'],
            exact: false
          });
        }
      )
      .subscribe();

    return () => {
      console.log(`🧹 Cleaning up instant ${screenType} display updates`);
      supabase.removeChannel(channel);
    };
  }, [queryClient, screenType]);
};