
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealTimeDisplaySettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up real-time listener for display settings');

    const channel = supabase
      .channel('display-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'display_settings'
        },
        (payload) => {
          console.log('Display settings changed:', payload);
          
          // Invalidate display settings cache to trigger refresh
          queryClient.invalidateQueries({ queryKey: ['display-settings'] });
          
          // Also invalidate other related queries that might be affected
          queryClient.invalidateQueries({ queryKey: ['packing-data'] });
          queryClient.invalidateQueries({ queryKey: ['customers'] });
          queryClient.invalidateQueries({ queryKey: ['orders'] });

          // Show a subtle notification that settings were updated
          toast({
            title: "Innstillinger oppdatert",
            description: "Displayet oppdateres automatisk med nye innstillinger",
            duration: 2000,
          });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up display settings real-time listener');
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);
};
