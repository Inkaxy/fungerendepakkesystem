
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';
import { QUERY_KEYS } from '@/lib/queryKeys';

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
          
          if (!isMountedRef.current) return;
          
          // ✅ Invalidate both authenticated and public query keys
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DISPLAY_SETTINGS[0], profile.bakery_id] });
          
          if (!isMountedRef.current) return;
          
          // ✅ KRITISK FIX: Invalidate public display settings for live displays
          // (matches both shared/customer screen_type query keys)
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.PUBLIC_DISPLAY_SETTINGS[0], profile.bakery_id],
            exact: false,
          });
          
          if (!isMountedRef.current) return;
          
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PACKING_DATA[0], profile.bakery_id] });
          
          if (!isMountedRef.current) return;
          
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOMERS[0], profile.bakery_id] });
          
          if (!isMountedRef.current) return;
          
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS[0], profile.bakery_id] });

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
      isMountedRef.current = false; // FØRST - blokkerer alle callbacks
      console.log('Cleaning up display settings listener for bakery:', profile.bakery_id);
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast, profile?.bakery_id]);
};
