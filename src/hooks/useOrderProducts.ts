
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
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
      const updates = orderProductIds.map(id => ({
        id,
        packing_status: packingStatus,
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('order_products')
        .upsert(updates)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
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
