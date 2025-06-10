
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ActivePackingProduct {
  id: string;
  bakery_id: string;
  session_date: string;
  product_id: string;
  product_name: string;
  total_quantity: number;
  created_at: string;
  updated_at: string;
}

export const useActivePackingProducts = (sessionDate?: string) => {
  return useQuery({
    queryKey: ['active-packing-products', sessionDate],
    queryFn: async () => {
      if (!sessionDate) return [];

      const { data, error } = await supabase
        .from('active_packing_products')
        .select('*')
        .eq('session_date', sessionDate)
        .order('product_name');

      if (error) {
        console.error('Error fetching active packing products:', error);
        throw error;
      }

      return data as ActivePackingProduct[];
    },
    enabled: !!sessionDate,
  });
};

export const useSetActivePackingProducts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ sessionDate, products }: {
      sessionDate: string;
      products: { id: string; name: string; totalQuantity: number }[];
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error('User not authenticated');

      // Get user's bakery_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('bakery_id')
        .eq('id', user.user.id)
        .single();

      if (!profile?.bakery_id) throw new Error('No bakery found for user');

      // Clear existing active products for this session
      await supabase
        .from('active_packing_products')
        .delete()
        .eq('bakery_id', profile.bakery_id)
        .eq('session_date', sessionDate);

      // Insert new active products
      if (products.length > 0) {
        const activeProducts = products.map(product => ({
          bakery_id: profile.bakery_id,
          session_date: sessionDate,
          product_id: product.id,
          product_name: product.name,
          total_quantity: product.totalQuantity,
        }));

        const { error } = await supabase
          .from('active_packing_products')
          .insert(activeProducts);

        if (error) throw error;
      }

      return products;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['active-packing-products', variables.sessionDate] });
      toast({
        title: "Aktive produkter oppdatert",
        description: `${variables.products.length} produkter er valgt for pakking`,
      });
    },
    onError: (error) => {
      console.error('Error setting active packing products:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke lagre valgte produkter",
        variant: "destructive",
      });
    },
  });
};

export const useClearActivePackingProducts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (sessionDate: string) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error('User not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('bakery_id')
        .eq('id', user.user.id)
        .single();

      if (!profile?.bakery_id) throw new Error('No bakery found for user');

      const { error } = await supabase
        .from('active_packing_products')
        .delete()
        .eq('bakery_id', profile.bakery_id)
        .eq('session_date', sessionDate);

      if (error) throw error;
    },
    onSuccess: (_, sessionDate) => {
      queryClient.invalidateQueries({ queryKey: ['active-packing-products', sessionDate] });
      toast({
        title: "Pakking avsluttet",
        description: "Aktive produkter er fjernet",
      });
    },
    onError: (error) => {
      console.error('Error clearing active packing products:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke avslutte pakking",
        variant: "destructive",
      });
    },
  });
};
