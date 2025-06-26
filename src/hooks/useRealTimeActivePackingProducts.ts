
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealTimeActivePackingProducts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');

  useEffect(() => {
    console.log('🔄 Setting up enhanced real-time listener for active packing products');

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
          console.log('🔔 Active packing products changed:', payload);
          
          // Invalidate all relevant queries immediately
          queryClient.invalidateQueries({ queryKey: ['active-packing-products'] });
          queryClient.invalidateQueries({ queryKey: ['active-packing-date'] });
          queryClient.invalidateQueries({ queryKey: ['packing-data'] });
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          queryClient.invalidateQueries({ queryKey: ['packing-sessions'] });

          // Force refetch of critical queries
          queryClient.refetchQueries({ queryKey: ['packing-data'] });

          // Enhanced notifications for product selection changes
          if (payload.eventType === 'INSERT') {
            const product = payload.new as any;
            console.log('➕ Product activated for packing:', product.product_name);
            toast({
              title: "Produkt aktivert for pakking",
              description: `${product.product_name} er nå valgt for pakking`,
              duration: 3000,
            });
          } else if (payload.eventType === 'DELETE') {
            console.log('➖ Active packing products cleared');
            toast({
              title: "Produktvalg oppdatert",
              description: "Aktive produkter for pakking er endret",
              duration: 2000,
            });
          } else if (payload.eventType === 'UPDATE') {
            const product = payload.new as any;
            console.log('🔄 Active packing product updated:', product.product_name);
            toast({
              title: "Produktinformasjon oppdatert",
              description: `${product.product_name} informasjon er oppdatert`,
              duration: 2000,
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('🔗 Active packing products connection status:', status);
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 
                           status === 'CHANNEL_ERROR' ? 'disconnected' : 'connecting');
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Active packing products real-time connection established');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Active packing products real-time connection error');
        }
      });

    return () => {
      console.log('🧹 Cleaning up enhanced active packing products real-time listener');
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  return { connectionStatus };
};
