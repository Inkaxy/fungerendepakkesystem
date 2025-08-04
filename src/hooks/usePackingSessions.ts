
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
      // Ensure we have a valid session before making the request
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication session expired. Please log in again.');
      }
      
      if (!currentSession?.user) {
        throw new Error('No authenticated user found. Please log in again.');
      }

      console.log('Authenticated user ID:', currentSession.user.id);
      console.log('Attempting to create packing session with bakery_id:', session.bakery_id);

      const { data, error } = await supabase
        .from('packing_sessions')
        .upsert(session, { onConflict: 'bakery_id,session_date' })
        .select()
        .single();

      if (error) {
        console.error('Packing session upsert error:', error);
        throw error;
      }
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
