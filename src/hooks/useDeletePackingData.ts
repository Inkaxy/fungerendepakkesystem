import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDeletePackingSessions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ startDate, endDate }: { startDate: string; endDate: string }) => {
      console.log('🗑️ Deleting packing sessions for range:', startDate, 'to', endDate);
      
      // Step 1: Delete active_packing_products for date range
      const { error: activeProductsError } = await supabase
        .from('active_packing_products')
        .delete()
        .gte('session_date', startDate)
        .lte('session_date', endDate);

      if (activeProductsError) throw activeProductsError;

      // Step 2: Delete packing_sessions for date range
      const { error: sessionsError } = await supabase
        .from('packing_sessions')
        .delete()
        .gte('session_date', startDate)
        .lte('session_date', endDate);

      if (sessionsError) throw sessionsError;

      console.log('✅ Packing sessions deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packing-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['packing-deviations'] });
      queryClient.invalidateQueries({ queryKey: ['active-packing-sessions'] });
      
      toast({
        title: "Suksess",
        description: "Pakkesessjoner er slettet",
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke slette pakkesesjoner: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useDeletePackingDataWithOrders = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ startDate, endDate }: { startDate: string; endDate: string }) => {
      console.log('🗑️ Deleting ALL packing data + orders for range:', startDate, 'to', endDate);
      
      // Step 1: Get all orders in date range
      const { data: ordersInRange, error: fetchError } = await supabase
        .from('orders')
        .select('id')
        .gte('delivery_date', startDate)
        .lte('delivery_date', endDate);

      if (fetchError) throw fetchError;

      const orderIds = ordersInRange?.map(o => o.id) || [];

      // Step 2: Delete order_products for these orders
      if (orderIds.length > 0) {
        const { error: orderProductsError } = await supabase
          .from('order_products')
          .delete()
          .in('order_id', orderIds);

        if (orderProductsError) throw orderProductsError;
      }

      // Step 3: Delete orders
      const { error: ordersError } = await supabase
        .from('orders')
        .delete()
        .gte('delivery_date', startDate)
        .lte('delivery_date', endDate);

      if (ordersError) throw ordersError;

      // Step 4: Delete active_packing_products
      const { error: activeProductsError } = await supabase
        .from('active_packing_products')
        .delete()
        .gte('session_date', startDate)
        .lte('session_date', endDate);

      if (activeProductsError) throw activeProductsError;

      // Step 5: Delete packing_sessions
      const { error: sessionsError } = await supabase
        .from('packing_sessions')
        .delete()
        .gte('session_date', startDate)
        .lte('session_date', endDate);

      if (sessionsError) throw sessionsError;

      console.log('✅ All packing data deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['packing-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['packing-deviations'] });
      queryClient.invalidateQueries({ queryKey: ['packing-data'] });
      
      toast({
        title: "Suksess",
        description: "All pakkedata og ordre er slettet",
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke slette pakkedata: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
