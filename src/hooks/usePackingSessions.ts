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

export const useActivePackingSessions = () => {
  return useQuery({
    queryKey: ['active_packing_sessions'],
    queryFn: async () => {
      // Get user's bakery_id first
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) return [];

      const { data: profile } = await supabase
        .from('profiles')
        .select('bakery_id')
        .eq('id', user.user.id)
        .single();

      if (!profile?.bakery_id) return [];

      const { data, error } = await supabase
        .from('packing_sessions')
        .select('*')
        .eq('bakery_id', profile.bakery_id)
        .in('status', ['ready', 'in_progress'])
        .order('session_date', { ascending: false });

      if (error) throw error;
      return data as PackingSession[];
    },
  });
};

export const useCreateOrUpdatePackingSession = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: {
      session: Omit<PackingSession, 'id' | 'created_at' | 'updated_at'>;
      completeOtherActive?: boolean;
    }) => {
      const { session, completeOtherActive = false } = params;

      // If requested, complete other active sessions first
      if (completeOtherActive) {
        const { data: user } = await supabase.auth.getUser();
        if (user.user?.id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('bakery_id')
            .eq('id', user.user.id)
            .single();

          if (profile?.bakery_id) {
            // Complete other active sessions
            await supabase
              .from('packing_sessions')
              .update({ status: 'completed' })
              .eq('bakery_id', profile.bakery_id)
              .in('status', ['ready', 'in_progress'])
              .neq('session_date', session.session_date);

            // Clear active packing products for completed sessions
            await supabase
              .from('active_packing_products')
              .delete()
              .eq('bakery_id', profile.bakery_id)
              .neq('session_date', session.session_date);
          }
        }
      }

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
      queryClient.invalidateQueries({ queryKey: ['active_packing_sessions'] });
      queryClient.invalidateQueries({ queryKey: ['active-packing-date'] });
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