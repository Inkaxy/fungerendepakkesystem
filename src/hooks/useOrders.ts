
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useOrders = (date?: string) => {
  return useQuery({
    queryKey: ['orders', date],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select(`
          *,
          customer:customers(*),
          order_products(*, product:products(*))
        `)
        .order('delivery_date', { ascending: true });

      if (date) {
        query = query.eq('delivery_date', date);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Order[];
    },
  });
};

export const useOrdersByDateRange = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['orders', 'dateRange', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(*),
          order_products(*, product:products(*))
        `)
        .gte('delivery_date', startDate)
        .lte('delivery_date', endDate)
        .order('delivery_date', { ascending: true });

      if (error) throw error;
      return data as Order[];
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Order['status'] }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Suksess",
        description: "Ordrestatus oppdatert",
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke oppdatere ordrestatus: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
