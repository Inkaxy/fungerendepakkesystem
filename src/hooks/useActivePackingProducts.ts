
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
  color_index: number; // 0, 1, or 2 - stable color slot
  created_at: string;
  updated_at: string;
}

export const useActivePackingProducts = (sessionDate?: string) => {
  return useQuery({
    queryKey: ['active-packing-products', sessionDate],
    queryFn: async () => {
      if (!sessionDate) return [];

      console.log('🔍 Fetching active packing products for date:', sessionDate);

      try {
      const { data, error } = await supabase
          .from('active_packing_products')
          .select('*')
          .eq('session_date', sessionDate)
          .order('color_index'); // ✅ Sortér etter farge-slot for konsistens

        if (error) {
          console.error('❌ Error fetching active packing products:', error);
          throw error;
        }

        console.log('✅ Active packing products fetched:', data?.length || 0, 'products');
        return data as ActivePackingProduct[];
      } catch (error) {
        console.error('❌ Error in useActivePackingProducts:', error);
        throw error;
      }
    },
    enabled: !!sessionDate,
    refetchInterval: false,
    staleTime: 0, // ✅ Data er alltid stale - sikrer refetch ved behov
    retry: 3,
    retryDelay: 1000,
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
      console.log('💾 Setting active packing products with stable colors:', { sessionDate, products });

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
        // ✅ STEG 1: Hent eksisterende aktive produkter med color_index
        const { data: existingProducts } = await supabase
          .from('active_packing_products')
          .select('id, product_id, color_index')
          .eq('bakery_id', profile.bakery_id)
          .eq('session_date', sessionDate);

        // Bygg map: product_id -> { id, color_index }
        const existingMap = new Map<string, { id: string; color_index: number }>();
        existingProducts?.forEach(ep => {
          existingMap.set(ep.product_id, { id: ep.id, color_index: ep.color_index ?? 0 });
        });

        console.log('📊 Existing products map:', Object.fromEntries(existingMap));

        // ✅ STEG 2: Finn brukte color slots og tildel til nye produkter
        const newProductIds = new Set(products.map(p => p.id));
        const productsToKeep = products.filter(p => existingMap.has(p.id));
        const productsToAdd = products.filter(p => !existingMap.has(p.id));
        const productIdsToRemove = Array.from(existingMap.keys()).filter(id => !newProductIds.has(id));

        // Finn ledige slots fra 0, 1, 2
        const usedSlots = new Set(productsToKeep.map(p => existingMap.get(p.id)!.color_index));
        const availableSlots = [0, 1, 2].filter(s => !usedSlots.has(s));

        console.log('🎨 Color slot assignment:', {
          productsToKeep: productsToKeep.map(p => `${p.name}=${existingMap.get(p.id)?.color_index}`),
          productsToAdd: productsToAdd.map(p => p.name),
          availableSlots,
          productIdsToRemove: productIdsToRemove.length
        });

        // ✅ STEG 3: Slett produkter som ikke lenger er valgt
        if (productIdsToRemove.length > 0) {
          const idsToDelete = productIdsToRemove.map(pid => existingMap.get(pid)!.id);
          const { error: deleteError } = await supabase
            .from('active_packing_products')
            .delete()
            .in('id', idsToDelete);

          if (deleteError) {
            console.error('❌ Error deleting removed products:', deleteError);
            throw deleteError;
          }
          console.log('🗑️ Deleted', idsToDelete.length, 'products');
        }

        // ✅ STEG 4: Oppdater eksisterende produkter (quantity kan ha endret seg)
        for (const product of productsToKeep) {
          const existing = existingMap.get(product.id)!;
          const { error: updateError } = await supabase
            .from('active_packing_products')
            .update({ 
              total_quantity: product.totalQuantity,
              product_name: product.name,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);

          if (updateError) {
            console.error('❌ Error updating product:', updateError);
          }
        }

        // ✅ STEG 5: Sett inn nye produkter med neste ledige color_index
        if (productsToAdd.length > 0) {
          const newActiveProducts = productsToAdd.map((product, idx) => ({
            bakery_id: profile.bakery_id,
            session_date: sessionDate,
            product_id: product.id,
            product_name: product.name,
            total_quantity: product.totalQuantity,
            color_index: availableSlots[idx % availableSlots.length] ?? (idx % 3), // Fallback til modulo hvis slots er tomme
          }));

          console.log('➕ Inserting new products with colors:', newActiveProducts);
          const { error: insertError } = await supabase
            .from('active_packing_products')
            .insert(newActiveProducts);

          if (insertError) {
            console.error('❌ Error inserting new products:', insertError);
            throw insertError;
          }
        }

        console.log('✅ Active packing products set with stable colors');
        return products;
      } catch (error) {
        console.error('❌ Error in setActivePackingProducts:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      console.log('🎉 Active packing products mutation successful');
      
      // Comprehensive query invalidation and refetch
      const queriesToInvalidate = [
        ['active-packing-products', variables.sessionDate],
        ['active-packing-date'],
        ['packing-data'],
        ['orders'],
        ['packing-sessions']
      ];

      queriesToInvalidate.forEach(queryKey => {
        queryClient.invalidateQueries({ 
          queryKey,
          refetchType: 'none' // ✅ Marker stale, men IKKE refetch - WebSocket oppdaterer
        });
      });
      
      console.log('✅ Active products cache marked stale - WebSocket vil oppdatere');

      toast({
        title: "Aktive produkter oppdatert",
        description: `${variables.products.length} produkter er valgt for pakking`,
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
        queryClient.invalidateQueries({ 
          queryKey,
          refetchType: 'active' // ✅ Tvinger refetch
        });
      });
      
      console.log('✅ Active products cleared - cache invalidert og refetched');

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
