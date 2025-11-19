
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';

export const useRealTimeOrders = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { profile } = useAuthStore();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');

  useEffect(() => {
    if (!profile?.bakery_id) return;

    console.log('Setting up real-time listener for bakery:', profile.bakery_id);

    const channel = supabase
      .channel(`orders-changes-${profile.bakery_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `bakery_id=eq.${profile.bakery_id}`
        },
        (payload) => {
          console.log('⚡ Order changed:', payload.eventType);
          
          // Refetch only active queries immediately
          queryClient.refetchQueries({ 
            queryKey: ['orders', profile.bakery_id],
            type: 'active'
          });
          queryClient.refetchQueries({ 
            queryKey: ['order-counts', profile.bakery_id],
            type: 'active'
          });
          queryClient.refetchQueries({ 
            queryKey: ['packing-data', profile.bakery_id],
            type: 'active'
          });
          
          console.log('✅ Orders refetched INSTANTLY');
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_products'
        },
        (payload) => {
          const updatedProduct = payload.new as any;
          console.log('⚡ Order product changed', {
            id: updatedProduct.id,
            status: updatedProduct.packing_status
          });
          
          // Optimistic cache update for packing data
          queryClient.setQueriesData(
            { queryKey: ['packing-data', profile.bakery_id], exact: false },
            (oldData: any) => {
              if (!oldData) return oldData;
              return oldData.map((customer: any) => ({
                ...customer,
                products: customer.products?.map((product: any) => {
                  const updatedOrderItems = product.order_items?.map((item: any) => 
                    item.order_product_id === updatedProduct.id
                      ? { ...item, packing_status: updatedProduct.packing_status }
                      : item
                  );
                  
                  if (updatedOrderItems !== product.order_items) {
                    const allPacked = updatedOrderItems?.every((item: any) => 
                      item.packing_status === 'packed' || item.packing_status === 'completed'
                    );
                    return {
                      ...product,
                      order_items: updatedOrderItems,
                      packing_status: allPacked ? 'packed' : 'in_progress'
                    };
                  }
                  return product;
                })
              }));
            }
          );
          
          // Force refetch of active queries only
          queryClient.refetchQueries({ 
            queryKey: ['orders', profile.bakery_id],
            type: 'active'
          });

          // Toast for packed items
          if (payload.eventType === 'UPDATE' && payload.new?.packing_status === 'packed') {
            toast({
              title: "Vare pakket",
              description: "Oppdatering sendt til displays",
              duration: 1500,
            });
          }
          
          console.log('✅ Cache updated INSTANTLY');
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'packing_sessions',
          filter: `bakery_id=eq.${profile.bakery_id}`
        },
        (payload) => {
          console.log('⚡ Packing session changed:', payload.eventType);
          
          // Refetch only active queries immediately
          queryClient.refetchQueries({ 
            queryKey: ['packing-data', profile.bakery_id],
            type: 'active'
          });
          queryClient.refetchQueries({ 
            queryKey: ['orders', profile.bakery_id],
            type: 'active'
          });
          
          console.log('✅ Session data refetched INSTANTLY');
        }
      )
      .subscribe((status) => {
        console.log('Real-time connection status:', status);
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 
                           status === 'CHANNEL_ERROR' ? 'disconnected' : 'connecting');
        
        if (status === 'SUBSCRIBED') {
          console.log('Real-time connection established');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Real-time connection error');
          toast({
            title: "Forbindelsesfeil",
            description: "Real-time oppdateringer er midlertidig utilgjengelig",
            variant: "destructive",
            duration: 5000,
          });
        }
      });

    return () => {
      console.log('Cleaning up orders listener for bakery:', profile.bakery_id);
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast, profile?.bakery_id]);

  return { connectionStatus };
};
