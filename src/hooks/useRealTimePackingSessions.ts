
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealTimePackingSessions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up real-time listener for packing sessions');

    const channel = supabase
      .channel('packing-sessions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'packing_sessions'
        },
        (payload) => {
          console.log('Packing session changed:', payload);
          
          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ['packing-sessions'] });
          queryClient.invalidateQueries({ queryKey: ['active-packing-date'] });
          queryClient.invalidateQueries({ queryKey: ['packing-data'] });
          queryClient.invalidateQueries({ queryKey: ['orders'] });

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
      console.log('Cleaning up packing sessions real-time listener');
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);
};
