
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';

export const useRealTimeDisplaySettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { profile } = useAuthStore();
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (!profile?.bakery_id) return;

    console.log('Setting up real-time listener for bakery:', profile.bakery_id);

    const channel = supabase
      .channel(`display-settings-${profile.bakery_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'display_settings',
          filter: `bakery_id=eq.${profile.bakery_id}`
        },
        (payload) => {
          if (!isMountedRef.current) {
            console.log('⏸️ WebSocket: Ignorer display_settings oppdatering, komponent er unmounted');
            return;
          }
          
          console.log('Display settings changed for bakery:', profile.bakery_id);
          
          // Invalidate bakery-specific queries
          queryClient.invalidateQueries({ queryKey: ['display-settings', profile.bakery_id] });
          queryClient.invalidateQueries({ queryKey: ['packing-data', profile.bakery_id] });
          queryClient.invalidateQueries({ queryKey: ['customers', profile.bakery_id] });
          queryClient.invalidateQueries({ queryKey: ['orders', profile.bakery_id] });

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
      console.log('Cleaning up display settings listener for bakery:', profile.bakery_id);
      isMountedRef.current = false;
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast, profile?.bakery_id]);
};
