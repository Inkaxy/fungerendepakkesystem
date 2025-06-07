
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useReactivateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Attempting to reactivate user with ID:', id);
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('User reactivation error:', error);
        throw error;
      }
      
      console.log('User reactivated successfully');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Suksess",
        description: "Bruker reaktivert",
      });
    },
    onError: (error) => {
      console.error('Reactivate user error:', error);
      toast({
        title: "Feil",
        description: `Kunne ikke reaktivere bruker: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
