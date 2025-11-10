
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
          console.log('🔔 Active packing products changed for bakery:', profile.bakery_id);
          
          // Invalidate bakery-specific queries
          queryClient.invalidateQueries({ queryKey: ['active-packing-products', profile.bakery_id] });
          queryClient.invalidateQueries({ queryKey: ['active-packing-date', profile.bakery_id] });
          queryClient.invalidateQueries({ queryKey: ['packing-data', profile.bakery_id] });
          queryClient.invalidateQueries({ queryKey: ['orders', profile.bakery_id] });
          queryClient.invalidateQueries({ queryKey: ['packing-sessions', profile.bakery_id] });
          queryClient.invalidateQueries({ queryKey: ['public-active-packing-products'] });
          queryClient.invalidateQueries({ queryKey: ['public-active-packing-date'] });
          queryClient.invalidateQueries({ queryKey: ['public-packing-data'] });

          // Force immediate refetch
          queryClient.refetchQueries({ queryKey: ['active-packing-date', profile.bakery_id] });
          queryClient.refetchQueries({ queryKey: ['packing-data', profile.bakery_id] });

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
          
          // Retry connection after a delay
          setTimeout(() => {
            console.log('🔄 Retrying active packing products connection...');
            channel.unsubscribe();
            // The useEffect will re-run and create a new connection
          }, 5000);
        }
      });

    return () => {
      console.log('🧹 Cleaning up active packing products listener for bakery:', profile.bakery_id);
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast, profile?.bakery_id]);

  return { connectionStatus };
};
