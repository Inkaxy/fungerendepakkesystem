
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDeleteAllData = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      console.log('Starting deletion of all data...');
      
      // Step 1: Delete order_products first (has foreign keys to both orders and products)
      console.log('Deleting order_products...');
      const { error: orderProductsError } = await supabase
        .from('order_products')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (orderProductsError) {
        console.error('Error deleting order_products:', orderProductsError);
        throw new Error(`Kunne ikke slette ordreprodukter: ${orderProductsError.message}`);
      }

      // Step 2: Delete orders (has foreign key to customers)
      console.log('Deleting orders...');
      const { error: ordersError } = await supabase
        .from('orders')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (ordersError) {
        console.error('Error deleting orders:', ordersError);
        throw new Error(`Kunne ikke slette ordrer: ${ordersError.message}`);
      }

      // Step 3: Delete packing_sessions (standalone table)
      console.log('Deleting packing_sessions...');
      const { error: packingSessionsError } = await supabase
        .from('packing_sessions')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (packingSessionsError) {
        console.error('Error deleting packing_sessions:', packingSessionsError);
        throw new Error(`Kunne ikke slette pakkesesjoner: ${packingSessionsError.message}`);
      }

      // Step 4: Delete products (no dependencies left)
      console.log('Deleting products...');
      const { error: productsError } = await supabase
        .from('products')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (productsError) {
        console.error('Error deleting products:', productsError);
        throw new Error(`Kunne ikke slette produkter: ${productsError.message}`);
      }

      // Step 5: Delete customers (no dependencies left)
      console.log('Deleting customers...');
      const { error: customersError } = await supabase
        .from('customers')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (customersError) {
        console.error('Error deleting customers:', customersError);
        throw new Error(`Kunne ikke slette kunder: ${customersError.message}`);
      }

      console.log('All data deleted successfully');
    },
    onSuccess: () => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['order-counts'] });
      queryClient.invalidateQueries({ queryKey: ['packing-data'] });
      queryClient.invalidateQueries({ queryKey: ['packing-sessions'] });
      
      toast({
        title: "Suksess",
        description: "All data er slettet fra databasen",
      });
    },
    onError: (error) => {
      console.error('Delete all data error:', error);
      toast({
        title: "Feil",
        description: `Kunne ikke slette all data: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
