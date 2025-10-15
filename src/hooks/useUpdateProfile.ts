
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/types/profile';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, role, ...updates }: Partial<Profile> & { id: string }) => {
      // Update profile data (excluding role)
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;

      // If role is provided, update it in user_roles table
      if (role) {
        // Delete existing roles for this user
        const { error: deleteError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', id);

        if (deleteError) throw deleteError;

        // Insert new role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: id,
            role: role,
          });

        if (roleError) throw roleError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Suksess",
        description: "Bruker oppdatert",
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke oppdatere bruker: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
