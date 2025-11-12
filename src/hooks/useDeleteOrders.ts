import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';
import { format } from 'date-fns';

export const useDeleteOrdersForDate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (date: string) => {
      // Hent alle ordre-ID-er for datoen
      const { data: ordersForDate, error: fetchError } = await supabase
        .from('orders')
        .select('id')
        .eq('delivery_date', date);
      
      if (fetchError) throw fetchError;
      const orderIds = ordersForDate?.map(o => o.id) || [];
      
      // Slett order_products først (foreign key)
      if (orderIds.length > 0) {
        const { error: orderProductsError } = await supabase
          .from('order_products')
          .delete()
          .in('order_id', orderIds);
        
        if (orderProductsError) throw orderProductsError;
      }
      
      // Slett ordre
      const { error: ordersError } = await supabase
        .from('orders')
        .delete()
        .eq('delivery_date', date);
      
      if (ordersError) throw ordersError;
      
      return { deletedCount: orderIds.length };
    },
    onSuccess: (data) => {
      const { profile } = useAuthStore.getState();
      queryClient.invalidateQueries({ queryKey: ['orders', profile?.bakery_id] });
      queryClient.invalidateQueries({ queryKey: ['packing-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['packing-data'] });
      
      toast({
        title: "Suksess",
        description: `${data.deletedCount} ordre(r) ble slettet`,
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke slette ordre: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteOldOrders = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Hent alle gamle ordre-ID-er
      const { data: oldOrders, error: fetchError } = await supabase
        .from('orders')
        .select('id')
        .lt('delivery_date', today);
      
      if (fetchError) throw fetchError;
      const orderIds = oldOrders?.map(o => o.id) || [];
      
      // Slett order_products først (foreign key)
      if (orderIds.length > 0) {
        const { error: orderProductsError } = await supabase
          .from('order_products')
          .delete()
          .in('order_id', orderIds);
        
        if (orderProductsError) throw orderProductsError;
      }
      
      // Slett ordre
      const { error: ordersError } = await supabase
        .from('orders')
        .delete()
        .lt('delivery_date', today);
      
      if (ordersError) throw ordersError;
      
      return { deletedCount: orderIds.length };
    },
    onSuccess: (data) => {
      const { profile } = useAuthStore.getState();
      queryClient.invalidateQueries({ queryKey: ['orders', profile?.bakery_id] });
      queryClient.invalidateQueries({ queryKey: ['packing-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['packing-data'] });
      
      toast({
        title: "Suksess",
        description: `${data.deletedCount} gamle ordre(r) ble slettet`,
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke slette gamle ordre: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
