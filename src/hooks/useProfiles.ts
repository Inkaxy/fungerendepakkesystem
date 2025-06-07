
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          bakery:bakeries(name)
        `)
        .order('name');

      if (error) throw error;
      return data;
    },
  });
};

// Re-export all the individual hooks for convenience
export { useCreateProfile } from './useCreateProfile';
export { useUpdateProfile } from './useUpdateProfile';
export { useDeleteProfile } from './useDeleteProfile';
export { useReactivateProfile } from './useReactivateProfile';
export { usePermanentDeleteProfile } from './usePermanentDeleteProfile';
