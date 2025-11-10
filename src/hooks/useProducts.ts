
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';

export const useProducts = () => {
  const { profile } = useAuthStore();
  
  return useQuery({
    queryKey: ['products', profile?.bakery_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      const { profile } = useAuthStore.getState();
      queryClient.invalidateQueries({ queryKey: ['products', profile?.bakery_id] });
      toast({
        title: "Suksess",
        description: "Produkt opprettet",
      });
    },
    onError: (error) => {
      console.error('Product creation error:', error);
      toast({
        title: "Feil",
        description: `Kunne ikke opprette produkt: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Product> & { id: string }) => {
      const { data, error } = await supabase
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      const { profile } = useAuthStore.getState();
      queryClient.invalidateQueries({ queryKey: ['products', profile?.bakery_id] });
      toast({
        title: "Suksess",
        description: "Produkt oppdatert",
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke oppdatere produkt: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      const { profile } = useAuthStore.getState();
      queryClient.invalidateQueries({ queryKey: ['products', profile?.bakery_id] });
      toast({
        title: "Suksess",
        description: "Produkt slettet",
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke slette produkt: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteAllProducts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('products')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

      if (error) throw error;
    },
    onSuccess: () => {
      const { profile } = useAuthStore.getState();
      queryClient.invalidateQueries({ queryKey: ['products', profile?.bakery_id] });
      toast({
        title: "Suksess",
        description: "Alle produkter slettet",
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke slette alle produkter: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
