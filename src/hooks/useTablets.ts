import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { Tablet } from '@/types/tablet';

export const useTablets = () => {
  const { profile } = useAuthStore();

  return useQuery({
    queryKey: ['tablets', profile?.bakery_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tablets')
        .select(`
          *,
          customer:customers(id, name, customer_number)
        `)
        .order('name');

      if (error) throw error;
      return data as Tablet[];
    },
    enabled: !!profile?.bakery_id
  });
};

export const useTabletsByCustomer = (customerId: string | null) => {
  const { profile } = useAuthStore();

  return useQuery({
    queryKey: ['tablets', 'customer', customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tablets')
        .select('*')
        .eq('customer_id', customerId)
        .order('name');

      if (error) throw error;
      return data as Tablet[];
    },
    enabled: !!profile?.bakery_id && !!customerId
  });
};
