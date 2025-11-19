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
          
          // Force immediate refetch of active queries (no invalidation delay)
          queryClient.refetchQueries({ 
            queryKey: ['public-packing-data-v2'], 
            exact: false,
            type: 'active'
          });
          
          console.log('✅ Active products cache updated, display refreshing...');
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
          const updatedProduct = payload.new as any;
          console.log('⚡ WebSocket: Order product status updated', {
            order_product_id: updatedProduct.id,
            new_status: updatedProduct.packing_status,
            product_id: updatedProduct.product_id
          });
          
          // Optimistic cache update - update display data directly from WebSocket
          queryClient.setQueriesData(
            { queryKey: ['public-packing-data-v2'], exact: false },
            (oldData: any) => {
              if (!oldData) return oldData;
              
              // oldData is the array of customer packing data
              return oldData.map((customer: any) => ({
                ...customer,
                products: customer.products?.map((product: any) => {
                  // Find if this product has order items that match the updated order_product
                  const updatedOrderItems = product.order_items?.map((item: any) => {
                    if (item.order_product_id === updatedProduct.id) {
                      return {
                        ...item,
                        packing_status: updatedProduct.packing_status
                      };
                    }
                    return item;
                  });
                  
                  // Recalculate product-level status if any items changed
                  if (updatedOrderItems !== product.order_items) {
                    const allPacked = updatedOrderItems?.every((item: any) => 
                      item.packing_status === 'packed' || item.packing_status === 'completed'
                    );
                    const somePacked = updatedOrderItems?.some((item: any) => 
                      item.packing_status === 'packed' || item.packing_status === 'completed'
                    );
                    
                    return {
                      ...product,
                      order_items: updatedOrderItems,
                      packing_status: allPacked ? 'packed' : somePacked ? 'in_progress' : 'pending'
                    };
                  }
                  
                  return product;
                })
              }));
            }
          );
          
          console.log('✅ Status oppdatert i cache UMIDDELBART');
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
