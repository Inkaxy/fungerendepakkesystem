
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealTimeActivePackingProducts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');

  useEffect(() => {
    console.log('Setting up enhanced real-time listener for active packing products');

    const channel = supabase
      .channel('active-packing-products-enhanced')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_packing_products'
        },
        (payload) => {
          console.log('Active packing products changed:', payload);
          
          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ['active-packing-products'] });
          queryClient.invalidateQueries({ queryKey: ['packing-data'] });
          queryClient.invalidateQueries({ queryKey: ['orders'] });

          // Enhanced notifications for product selection changes
          if (payload.eventType === 'INSERT') {
            const product = payload.new as any;
            toast({
              title: "Produkt aktivert for pakking",
              description: `${product.product_name} er nå valgt for pakking`,
              duration: 3000,
            });
          } else if (payload.eventType === 'DELETE') {
            toast({
              title: "Produktvalg oppdatert",
              description: "Aktive produkter for pakking er endret",
              duration: 2000,
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('Active packing products connection status:', status);
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 
                           status === 'CHANNEL_ERROR' ? 'disconnected' : 'connecting');
      });

    return () => {
      console.log('Cleaning up enhanced active packing products real-time listener');
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  return { connectionStatus };
};
