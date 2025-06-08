
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DisplayStation } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useDisplayStations = () => {
  return useQuery({
    queryKey: ['displayStations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('display_stations')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as DisplayStation[];
    },
  });
};

export const useCreateDisplayStation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (displayStation: Omit<DisplayStation, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('display_stations')
        .insert(displayStation)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['displayStations'] });
      toast({
        title: "Suksess",
        description: "Display-stasjon opprettet",
      });
    },
    onError: (error) => {
      console.error('Display station creation error:', error);
      toast({
        title: "Feil",
        description: `Kunne ikke opprette display-stasjon: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateDisplayStation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DisplayStation> & { id: string }) => {
      const { data, error } = await supabase
        .from('display_stations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['displayStations'] });
      toast({
        title: "Suksess",
        description: "Display-stasjon oppdatert",
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke oppdatere display-stasjon: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteDisplayStation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('display_stations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['displayStations'] });
      toast({
        title: "Suksess",
        description: "Display-stasjon slettet",
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke slette display-stasjon: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
