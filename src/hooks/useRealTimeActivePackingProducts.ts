
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
          console.log('⚡ WebSocket: Active packing products changed');
          
          // ONLY invalidate queries that need updating
          const queriesToInvalidate = [
            ['active-packing-products', profile.bakery_id],
            ['packing-data', profile.bakery_id]
          ];

          queriesToInvalidate.forEach(queryKey => {
            queryClient.invalidateQueries({ queryKey, exact: false });
          });

          // Toast notifications
          if (payload.eventType === 'INSERT') {
            const product = payload.new as any;
            toast({
              title: "Produkt aktivert",
              description: `${product.product_name} valgt for pakking`,
              duration: 2000,
            });
          } else if (payload.eventType === 'DELETE') {
            toast({
              title: "Produktvalg oppdatert",
              description: "Aktive produkter endret",
              duration: 1500,
            });
          }
        }
      )
      .subscribe((status) => {
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 
                           status === 'CHANNEL_ERROR' ? 'disconnected' : 'connecting');
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ WebSocket: Auth connection established');
        }
      });

    return () => {
      console.log('🧹 Cleaning up active packing products listener for bakery:', profile.bakery_id);
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast, profile?.bakery_id]);

  return { connectionStatus };
};
