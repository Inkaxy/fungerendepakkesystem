
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      // Fetch profiles with bakery info
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          bakery:bakeries(name)
        `)
        .order('name');

      if (profilesError) throw profilesError;

      // Fetch roles from user_roles table for all users
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        // Return profiles with existing role field if user_roles query fails
        return profiles;
      }

      // Create a map of user_id to role
      const roleMap = new Map(roles?.map(r => [r.user_id, r.role]) || []);

      // Merge roles into profiles
      const profilesWithRoles = profiles?.map(profile => ({
        ...profile,
        role: roleMap.get(profile.id) || profile.role, // Use user_roles role if available, fallback to profiles.role
      }));

      return profilesWithRoles;
    },
  });
};

// Re-export all the individual hooks for convenience
export { useCreateProfile } from './useCreateProfile';
export { useUpdateProfile } from './useUpdateProfile';
export { useDeleteProfile } from './useDeleteProfile';
export { useReactivateProfile } from './useReactivateProfile';
export { usePermanentDeleteProfile } from './usePermanentDeleteProfile';
