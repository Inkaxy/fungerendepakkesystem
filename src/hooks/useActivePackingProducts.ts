
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

      console.log('⚡ INSTANT fetch active packing products for date:', sessionDate);

      try {
        const { data, error } = await supabase
          .from('active_packing_products')
          .select('*')
          .eq('session_date', sessionDate)
          .order('product_name');

        if (error) {
          console.error('❌ Error fetching active packing products:', error);
          throw error;
        }

        console.log('✅ Active packing products fetched INSTANTLY:', data?.length || 0, 'products');
        return data as ActivePackingProduct[];
      } catch (error) {
        console.error('❌ Error in useActivePackingProducts:', error);
        throw error;
      }
    },
    enabled: !!sessionDate,
    staleTime: 0, // INSTANT: Always consider data fresh for immediate updates
    refetchInterval: 2000, // FASTER: More frequent polling as backup
    retry: 2, // FASTER: Reduce retry attempts for speed
    retryDelay: 500, // FASTER: Quick retry on failure
    refetchOnWindowFocus: true, // INSTANT: Refetch on focus
    refetchOnMount: true, // INSTANT: Always refetch on mount
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
      console.log('💾 Setting active packing products:', { sessionDate, products });

      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error('User not authenticated');

      // Get user's bakery_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('bakery_id')
        .eq('id', user.user.id)
        .single();

      if (!profile?.bakery_id) throw new Error('No bakery found for user');

      try {
        // Clear existing active products for this session
        console.log('🧹 Clearing existing active products...');
        const { error: deleteError } = await supabase
          .from('active_packing_products')
          .delete()
          .eq('bakery_id', profile.bakery_id)
          .eq('session_date', sessionDate);

        if (deleteError) {
          console.error('❌ Error clearing active products:', deleteError);
          throw deleteError;
        }

        // Insert new active products
        if (products.length > 0) {
          const activeProducts = products.map(product => ({
            bakery_id: profile.bakery_id,
            session_date: sessionDate,
            product_id: product.id,
            product_name: product.name,
            total_quantity: product.totalQuantity,
          }));

          console.log('➕ Inserting new active products:', activeProducts);
          const { error: insertError } = await supabase
            .from('active_packing_products')
            .insert(activeProducts);

          if (insertError) {
            console.error('❌ Error inserting active products:', insertError);
            throw insertError;
          }
        }

        console.log('✅ Active packing products set successfully');
        return products;
      } catch (error) {
        console.error('❌ Error in setActivePackingProducts:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      console.log('⚡ INSTANT active packing products mutation successful');
      
      // OPTIMISTIC IMMEDIATE UPDATE - Set cache directly for instant UI response
      queryClient.setQueryData(['active-packing-products', variables.sessionDate], variables.products);
      
      // MINIMAL invalidation for speed - only critical queries
      const criticalQueries = [
        ['active-packing-products', variables.sessionDate],
        ['packing-data']
      ];

      criticalQueries.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });

      // INSTANT REFETCH of critical data
      queryClient.refetchQueries({ 
        queryKey: ['active-packing-products'], 
        exact: false 
      });

      toast({
        title: "⚡ Produkter aktivert øyeblikkelig",
        description: `${variables.products.length} produkter valgt for pakking`,
        duration: 1500,
      });
    },
    onError: (error) => {
      console.error('❌ Error setting active packing products:', error);
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
      console.log('🧹 Clearing active packing products for date:', sessionDate);

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
      
      console.log('✅ Active packing products cleared successfully');
    },
    onSuccess: (_, sessionDate) => {
      console.log('🎉 Clear active packing products mutation successful');
      
      // Comprehensive query invalidation
      const queriesToInvalidate = [
        ['active-packing-products', sessionDate],
        ['active-packing-date'],
        ['packing-data'],
        ['orders'],
        ['packing-sessions']
      ];

      queriesToInvalidate.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
        queryClient.refetchQueries({ queryKey });
      });

      toast({
        title: "Pakking avsluttet",
        description: "Aktive produkter er fjernet",
      });
    },
    onError: (error) => {
      console.error('❌ Error clearing active packing products:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke avslutte pakking",
        variant: "destructive",
      });
    },
  });
};
