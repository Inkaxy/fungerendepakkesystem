
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealTimeActivePackingProducts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
  const [productChangeActive, setProductChangeActive] = useState(false);

  const triggerProductChangeAnimation = () => {
    setProductChangeActive(true);
  };

  const completeProductChangeAnimation = () => {
    setProductChangeActive(false);
  };

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
          
          // INSTANT OPTIMISTIC UPDATE - Zero delay
          const sessionDate = (payload.new as any)?.session_date || (payload.old as any)?.session_date;
          
          if (payload.eventType === 'INSERT') {
            queryClient.setQueryData(['active-packing-products', sessionDate], (old: any) => {
              return [...(old || []), payload.new];
            });
          } else if (payload.eventType === 'DELETE') {
            queryClient.setQueryData(['active-packing-products', sessionDate], (old: any) => {
              return (old || []).filter((item: any) => item.id !== payload.old.id);
            });
          }

          // MINIMAL invalidation for maximum speed
          const criticalQueries = ['active-packing-products', 'packing-data'];
          criticalQueries.forEach(queryKey => {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
          });

          // INSTANT refetch without waiting
          queryClient.refetchQueries({ queryKey: ['active-packing-products'], exact: false });

          // Enhanced notifications for product selection changes
          if (payload.eventType === 'INSERT') {
            const product = payload.new as any;
            console.log('➕ Product activated for packing:', product.product_name);
            
            // Trigger product change animation
            triggerProductChangeAnimation();
            
            toast({
              title: "⚡ Produkt aktivert øyeblikkelig",
              description: `${product.product_name} er valgt for pakking`,
              duration: 1500,
            });
          } else if (payload.eventType === 'DELETE') {
            console.log('➖ Active packing products cleared');
            
            // Trigger product change animation
            triggerProductChangeAnimation();
            
            toast({
              title: "⚡ Produktvalg oppdatert øyeblikkelig",
              description: "Aktive produkter endret",
              duration: 1000,
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
          
          // INSTANT RETRY - No delay for critical updates
          setTimeout(() => {
            console.log('⚡ INSTANT retry active packing products connection...');
            channel.unsubscribe();
            // The useEffect will re-run and create a new connection
          }, 500);
        }
      });

    return () => {
      console.log('🧹 Cleaning up enhanced active packing products real-time listener');
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  return { 
    connectionStatus, 
    productChangeActive, 
    completeProductChangeAnimation 
  };
};
