
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';

export const useRealTimePackingSessions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { profile } = useAuthStore();

  useEffect(() => {
    if (!profile?.bakery_id) return;

    console.log('Setting up real-time listener for bakery:', profile.bakery_id);

    const channel = supabase
      .channel(`packing-sessions-${profile.bakery_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'packing_sessions',
          filter: `bakery_id=eq.${profile.bakery_id}`
        },
        (payload) => {
          console.log('⚡ Session changed:', payload.eventType);
          
          // Refetch only active queries immediately
          queryClient.refetchQueries({ 
            queryKey: ['packing-sessions', profile.bakery_id],
            type: 'active'
          });
          queryClient.refetchQueries({ 
            queryKey: ['active-packing-date', profile.bakery_id],
            type: 'active'
          });
          queryClient.refetchQueries({ 
            queryKey: ['packing-data', profile.bakery_id],
            type: 'active'
          });

          // Show notification for session status changes
          if (payload.eventType === 'UPDATE') {
            const newStatus = payload.new?.status;
            const oldStatus = payload.old?.status;
            
            if (oldStatus !== newStatus) {
              if (newStatus === 'in_progress') {
                toast({
                  title: "Pakking startet",
                  description: "Displays oppdatert",
                  duration: 2000,
                });
              } else if (newStatus === 'completed') {
                toast({
                  title: "Pakking fullført",
                  description: "Displays oppdatert",
                  duration: 2000,
                });
              }
            }
          }
          
          console.log('✅ Sessions refetched INSTANTLY');
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up packing sessions listener for bakery:', profile.bakery_id);
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast, profile?.bakery_id]);
};
