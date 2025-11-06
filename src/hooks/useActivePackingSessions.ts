import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PackingSession } from '@/types/database';

export const useActivePackingSessions = () => {
  return useQuery({
    queryKey: ['active-packing-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('packing_sessions')
        .select('*')
        .eq('status', 'in_progress')
        .order('session_date', { ascending: false });
      
      if (error) throw error;
      return data as PackingSession[];
    }
  });
};
