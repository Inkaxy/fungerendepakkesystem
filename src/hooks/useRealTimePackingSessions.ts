
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
          console.log('Packing session changed for bakery:', profile.bakery_id);
          
          // Invalidate bakery-specific queries
          queryClient.invalidateQueries({ queryKey: ['packing-sessions', profile.bakery_id] });
          queryClient.invalidateQueries({ queryKey: ['active-packing-date', profile.bakery_id] });
          queryClient.invalidateQueries({ queryKey: ['packing-data', profile.bakery_id] });
          queryClient.invalidateQueries({ queryKey: ['orders', profile.bakery_id] });

          // Show notification for session status changes
          if (payload.eventType === 'UPDATE') {
            const newStatus = payload.new?.status;
            const oldStatus = payload.old?.status;
            
            if (oldStatus !== newStatus) {
              if (newStatus === 'in_progress') {
                toast({
                  title: "Pakking startet",
                  description: "Pakkesession er nå aktiv",
                  duration: 3000,
                });
              } else if (newStatus === 'completed') {
                // Check if this was an auto-close (status changed from in_progress to completed)
                if (oldStatus === 'in_progress') {
                  const sessionDate = payload.old?.session_date;
                  toast({
                    title: "Pakkesesjon avsluttet",
                    description: sessionDate 
                      ? `Sesjonen for ${new Date(sessionDate).toLocaleDateString('nb-NO')} ble automatisk avsluttet`
                      : "En aktiv pakkesesjon ble automatisk avsluttet",
                    duration: 5000,
                  });
                } else {
                  toast({
                    title: "Pakking fullført",
                    description: "Pakkesession er ferdigstilt",
                    duration: 3000,
                  });
                }
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up packing sessions listener for bakery:', profile.bakery_id);
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast, profile?.bakery_id]);
};
