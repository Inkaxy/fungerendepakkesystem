
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PackingSession } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const usePackingSessions = () => {
  return useQuery({
    queryKey: ['packing_sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('packing_sessions')
        .select('*')
        .order('session_date', { ascending: false });

      if (error) throw error;
      return data as PackingSession[];
    },
  });
};

export const usePackingSessionByDate = (date: string) => {
  return useQuery({
    queryKey: ['packing_session', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('packing_sessions')
        .select('*')
        .eq('session_date', date)
        .maybeSingle();

      if (error) throw error;
      return data as PackingSession | null;
    },
  });
};

export const useCreateOrUpdatePackingSession = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (session: Omit<PackingSession, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('packing_sessions')
        .upsert(session, { onConflict: 'bakery_id,session_date' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packing_sessions'] });
      queryClient.invalidateQueries({ queryKey: ['packing_session'] });
      toast({
        title: "Suksess",
        description: "Pakkeøkt oppdatert",
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke oppdatere pakkeøkt: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
