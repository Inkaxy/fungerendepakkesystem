
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Bakery {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export const useBakeries = () => {
  return useQuery({
    queryKey: ['bakeries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bakeries')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Bakery[];
    },
  });
};

export const useCreateBakery = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (bakery: Omit<Bakery, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('bakeries')
        .insert(bakery)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bakeries'] });
      toast({
        title: "Suksess",
        description: "Bakeri opprettet",
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke opprette bakeri: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
