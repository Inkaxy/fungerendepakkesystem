
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Attempting to deactivate user with ID:', id);
      
      // Instead of deleting, we'll deactivate the user
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('User deactivation error:', error);
        throw error;
      }
      
      console.log('User deactivated successfully');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Suksess",
        description: "Bruker deaktivert",
      });
    },
    onError: (error) => {
      console.error('Deactivate user error:', error);
      toast({
        title: "Feil",
        description: `Kunne ikke deaktivere bruker: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
