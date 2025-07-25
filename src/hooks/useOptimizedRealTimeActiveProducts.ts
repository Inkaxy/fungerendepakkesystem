import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useOptimizedRealTimeActiveProducts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);

  useEffect(() => {
    console.log('🚀 Setting up OPTIMIZED real-time listener for active packing products');

    const channel = supabase
      .channel('active-packing-products-optimized')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_packing_products'
        },
        (payload) => {
          const updateStart = performance.now();
          console.log('⚡ Active packing products changed - INSTANT UPDATE:', payload);
          
          // INSTANT OPTIMISTIC UPDATES - No waiting for network
          const sessionDate = (payload.new as any)?.session_date || (payload.old as any)?.session_date;
          
          if (payload.eventType === 'INSERT') {
            // Optimistically add the new product to the cache
            queryClient.setQueryData(['active-packing-products', sessionDate], (old: any) => {
              const existing = old || [];
              return [...existing, payload.new];
            });
            
            toast({
              title: "⚡ Produkt aktivert",
              description: `${payload.new.product_name} er valgt for pakking`,
              duration: 1500,
            });
          } else if (payload.eventType === 'DELETE') {
            // Optimistically remove from cache
            queryClient.setQueryData(['active-packing-products', sessionDate], (old: any) => {
              if (!old) return [];
              return old.filter((item: any) => item.id !== payload.old.id);
            });
            
            toast({
              title: "⚡ Produktvalg oppdatert", 
              description: "Aktive produkter endret",
              duration: 1000,
            });
          }

          // CRITICAL QUERIES ONLY - Minimal invalidation for speed
          const criticalQueries = ['active-packing-products', 'packing-data'];
          criticalQueries.forEach(queryKey => {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
          });

          // IMMEDIATE REFETCH for critical data only
          queryClient.refetchQueries({ 
            queryKey: ['active-packing-products'], 
            exact: false 
          });

          const updateEnd = performance.now();
          const updateTime = updateEnd - updateStart;
          setLastUpdateTime(updateTime);
          
          if (updateTime > 100) {
            console.warn(`⚠️ Display update took ${updateTime.toFixed(2)}ms - targeting <50ms`);
          } else {
            console.log(`✅ Display updated in ${updateTime.toFixed(2)}ms`);
          }
        }
      )
      .subscribe((status) => {
        console.log('🔗 Optimized active products connection:', status);
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 
                           status === 'CHANNEL_ERROR' ? 'disconnected' : 'connecting');
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ OPTIMIZED real-time connection established');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Real-time connection error - attempting immediate reconnect');
          
          // INSTANT RECONNECT - No 5 second delay
          setTimeout(() => {
            console.log('🔄 Immediate reconnect attempt...');
            channel.unsubscribe();
          }, 500);
        }
      });

    return () => {
      console.log('🧹 Cleaning up optimized active products listener');
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  return { 
    connectionStatus, 
    lastUpdateTime 
  };
};