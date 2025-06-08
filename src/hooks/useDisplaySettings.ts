
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DisplaySettings } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useDisplaySettings = (displayStationId?: string, customerId?: string) => {
  return useQuery({
    queryKey: ['displaySettings', displayStationId, customerId],
    queryFn: async () => {
      let query = supabase
        .from('display_settings')
        .select('*');

      if (displayStationId) {
        query = query.eq('display_station_id', displayStationId);
      }

      if (customerId) {
        query = query.eq('customer_id', customerId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as DisplaySettings[];
    },
    enabled: !!displayStationId,
  });
};

export const useCreateDisplaySettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (settings: Omit<DisplaySettings, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('display_settings')
        .insert(settings)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['displaySettings'] });
      toast({
        title: "Suksess",
        description: "Display-innstillinger opprettet",
      });
    },
    onError: (error) => {
      console.error('Display settings creation error:', error);
      toast({
        title: "Feil",
        description: `Kunne ikke opprette display-innstillinger: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateDisplaySettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DisplaySettings> & { id: string }) => {
      const { data, error } = await supabase
        .from('display_settings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['displaySettings'] });
      toast({
        title: "Suksess",
        description: "Display-innstillinger oppdatert",
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke oppdatere display-innstillinger: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
