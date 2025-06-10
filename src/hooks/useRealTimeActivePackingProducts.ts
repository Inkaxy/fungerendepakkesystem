
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealTimeActivePackingProducts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up real-time listener for active packing products');

    const channel = supabase
      .channel('active-packing-products-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'active_packing_products'
        },
        (payload) => {
          console.log('Active packing products changed:', payload);
          
          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ['active-packing-products'] });
          queryClient.invalidateQueries({ queryKey: ['packing-data'] });
          queryClient.invalidateQueries({ queryKey: ['orders'] });

          // Show notification for product selection changes
          if (payload.eventType === 'INSERT' || payload.eventType === 'DELETE') {
            toast({
              title: "Produktvalg oppdatert",
              description: "Displayet oppdateres med nye valgte produkter",
              duration: 2000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up active packing products real-time listener');
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);
};
