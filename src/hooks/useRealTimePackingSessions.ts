
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
          queryClient.invalidateQueries({ queryKey: ['packing_sessions'] });
          queryClient.invalidateQueries({ queryKey: ['packing_session'] });
          queryClient.invalidateQueries({ queryKey: ['packing-data'] });

          // Show notifications based on event type
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const session = payload.new as any;
            
            if (session.status === 'in_progress') {
              toast({
                title: "Pakking startet",
                description: `Pakkeøkt for ${session.session_date} er nå aktiv`,
                duration: 3000,
              });
            } else if (session.status === 'completed') {
              toast({
                title: "Pakking fullført",
                description: `All pakking for ${session.session_date} er ferdig`,
                duration: 5000,
              });
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
