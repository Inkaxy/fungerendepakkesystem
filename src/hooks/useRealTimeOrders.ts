
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
          console.log('Order changed for bakery:', profile.bakery_id);
          
          // Invalidate bakery-specific queries
          queryClient.invalidateQueries({ queryKey: ['orders', profile.bakery_id] });
          queryClient.invalidateQueries({ queryKey: ['order-counts', profile.bakery_id] });
          queryClient.invalidateQueries({ queryKey: ['packing-data', profile.bakery_id] });
          queryClient.invalidateQueries({ queryKey: ['public-display-orders'] });
          queryClient.invalidateQueries({ queryKey: ['public-packing-data'] });
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
          console.log('Order product changed for bakery:', profile.bakery_id);
          
          // Invalidate bakery-specific queries
          queryClient.invalidateQueries({ queryKey: ['orders', profile.bakery_id] });
          queryClient.invalidateQueries({ queryKey: ['packing-data', profile.bakery_id] });
          queryClient.invalidateQueries({ queryKey: ['public-display-orders'] });
          queryClient.invalidateQueries({ queryKey: ['public-packing-data'] });

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
          table: 'packing_sessions',
          filter: `bakery_id=eq.${profile.bakery_id}`
        },
        () => {
          // Invalidate bakery-specific queries
          queryClient.invalidateQueries({ queryKey: ['packing-data', profile.bakery_id] });
          queryClient.invalidateQueries({ queryKey: ['orders', profile.bakery_id] });
          queryClient.invalidateQueries({ queryKey: ['public-packing-data'] });
          queryClient.invalidateQueries({ queryKey: ['public-active-packing-date'] });
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
