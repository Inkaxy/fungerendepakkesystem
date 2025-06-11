
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealTimeOrders = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');

  useEffect(() => {
    console.log('Setting up enhanced real-time listener for orders');

    const channel = supabase
      .channel('orders-changes-enhanced')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order changed:', payload);
          
          // Invalidate and refetch orders data
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          queryClient.invalidateQueries({ queryKey: ['order-counts'] });
          queryClient.invalidateQueries({ queryKey: ['packing-data'] });
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
          console.log('Order product changed:', payload);
          
          // Invalidate orders when products change
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          queryClient.invalidateQueries({ queryKey: ['packing-data'] });

          // Show notification for packing status changes
          if (payload.eventType === 'UPDATE') {
            const oldStatus = payload.old?.packing_status;
            const newStatus = payload.new?.packing_status;
            
            if (oldStatus !== newStatus && newStatus === 'packed') {
              toast({
                title: "Vare pakket",
                description: "En vare er markert som pakket",
                duration: 2000,
              });
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'packing_sessions'
        },
        () => {
          // Invalidate packing data when sessions change
          queryClient.invalidateQueries({ queryKey: ['packing-data'] });
          queryClient.invalidateQueries({ queryKey: ['orders'] });
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
      console.log('Cleaning up enhanced orders real-time listener');
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  return { connectionStatus };
};
