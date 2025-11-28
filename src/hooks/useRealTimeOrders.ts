
import { useEffect, useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';

export const useRealTimeOrders = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { profile } = useAuthStore();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
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
          if (!isMountedRef.current) {
            console.log('⏸️ WebSocket: Ignorer order oppdatering, komponent er unmounted');
            return;
          }
          
          const updatedOrder = payload.new as any;
          console.log('⚡ Order changed:', payload.eventType, updatedOrder?.id);
          
          // Direct cache update for orders
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            queryClient.setQueryData(['orders', profile.bakery_id], (oldOrders: any[] | undefined) => {
              if (!oldOrders) return [updatedOrder];
              const exists = oldOrders.find(o => o.id === updatedOrder.id);
              if (exists) {
                return oldOrders.map(o => o.id === updatedOrder.id ? updatedOrder : o);
              }
              return [...oldOrders, updatedOrder];
            });
          } else if (payload.eventType === 'DELETE') {
            queryClient.setQueryData(['orders', profile.bakery_id], (oldOrders: any[] | undefined) =>
              oldOrders?.filter(o => o.id !== (payload.old as any)?.id) || []
            );
          }
          
          // Recalculate order counts from cache
          const orders = queryClient.getQueryData(['orders', profile.bakery_id]) as any[];
          if (orders) {
            queryClient.setQueryData(['order-counts', profile.bakery_id], {
              total: orders.length,
              pending: orders.filter(o => o.status === 'pending').length,
              packed: orders.filter(o => o.status === 'packed').length,
              completed: orders.filter(o => o.status === 'completed').length,
            });
          }
          
          console.log('✅ Orders updated from WebSocket - 0ms delay');
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_products',
          filter: `order_id=in.(select id from orders where bakery_id='${profile.bakery_id}')`
        },
        (payload) => {
          if (!isMountedRef.current) {
            console.log('⏸️ WebSocket: Ignorer order_products oppdatering, komponent er unmounted');
            return;
          }
          
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
          
          // ✅ KRITISK: Tving React Query til å re-render komponenter
          queryClient.invalidateQueries({
            queryKey: ['packing-data', profile.bakery_id],
            exact: false,
            refetchType: 'none' // Ikke refetch, kun re-render med oppdatert cache
          });
          
          console.log('✅ Cache updated INSTANTLY - tvunget re-render');

          // Toast for packed items
          if (payload.eventType === 'UPDATE' && payload.new?.packing_status === 'packed') {
            toast({
              title: "Vare pakket",
              description: "Oppdatering sendt til displays",
              duration: 1500,
            });
          }
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
          if (!isMountedRef.current) {
            console.log('⏸️ WebSocket: Ignorer packing_sessions oppdatering, komponent er unmounted');
            return;
          }
          
          const updatedSession = payload.new as any;
          console.log('⚡ Packing session changed:', payload.eventType, updatedSession?.id);
          
          // Direct cache update for packing sessions
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            queryClient.setQueryData(['packing-sessions', profile.bakery_id], (old: any[] | undefined) => {
              if (!old) return [updatedSession];
              const exists = old.find(s => s.id === updatedSession.id);
              if (exists) {
                return old.map(s => s.id === updatedSession.id ? updatedSession : s);
              }
              return [...old, updatedSession];
            });
          }
          
          // Update active packing date if status is in_progress
          if (updatedSession?.status === 'in_progress') {
            queryClient.setQueryData(['active-packing-date', profile.bakery_id], 
              updatedSession.session_date
            );
          }
          
          console.log('✅ Session updated from WebSocket - 0ms delay');
        }
      )
      .subscribe((status) => {
        if (!isMountedRef.current) return;
        
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
      isMountedRef.current = false; // FØRST - blokkerer alle callbacks
      console.log('Cleaning up orders listener for bakery:', profile.bakery_id);
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast, profile?.bakery_id]);

  return { connectionStatus };
};
