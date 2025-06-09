
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOrderCounts = (customerIds?: string[]) => {
  return useQuery({
    queryKey: ['order-counts', customerIds],
    queryFn: async () => {
      if (!customerIds || customerIds.length === 0) return {};

      const { data, error } = await supabase
        .from('orders')
        .select('customer_id')
        .in('customer_id', customerIds);

      if (error) throw error;

      // Count orders by customer
      const counts: Record<string, number> = {};
      data.forEach(order => {
        counts[order.customer_id] = (counts[order.customer_id] || 0) + 1;
      });

      return counts;
    },
    enabled: !!customerIds && customerIds.length > 0,
  });
};
