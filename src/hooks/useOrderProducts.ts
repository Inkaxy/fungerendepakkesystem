
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUpdateOrderProductPackingStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ orderProductId, packingStatus }: { orderProductId: string; packingStatus: string }) => {
      const { data, error } = await supabase
        .from('order_products')
        .update({ 
          packing_status: packingStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderProductId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // ✅ WebSocket håndterer cache-oppdatering automatisk via useRealTimeOrders
      console.log('✅ Order product status updated - WebSocket vil oppdatere cache', data);
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke oppdatere pakking status: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateMultipleOrderProductsPackingStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ orderProductIds, packingStatus }: { orderProductIds: string[]; packingStatus: string }) => {
      // Use Promise.all to update multiple records individually
      const updatePromises = orderProductIds.map(id => 
        supabase
          .from('order_products')
          .update({ 
            packing_status: packingStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single()
      );

      const results = await Promise.all(updatePromises);
      
      // Check for any errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error(`Failed to update ${errors.length} records`);
      }

      return results.map(result => result.data);
    },
    onSuccess: (data) => {
      // ✅ WebSocket håndterer cache-oppdatering automatisk via useRealTimeOrders
      console.log('✅ Multiple order products updated - WebSocket vil oppdatere cache', { count: data.length });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke oppdatere pakking status: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
