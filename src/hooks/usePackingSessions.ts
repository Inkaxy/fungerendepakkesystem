
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PackingSession } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { useRef } from 'react';

export const usePackingSessions = () => {
  return useQuery({
    queryKey: ['packing_sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('packing_sessions')
        .select('*')
        .order('session_date', { ascending: false });

      if (error) throw error;
      return data as PackingSession[];
    },
  });
};

export const usePackingSessionByDate = (date: string) => {
  return useQuery({
    queryKey: ['packing_session', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('packing_sessions')
        .select('*')
        .eq('session_date', date)
        .maybeSingle();

      if (error) throw error;
      return data as PackingSession | null;
    },
  });
};

export const useCreateOrUpdatePackingSession = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const lastCallTimeRef = useRef<number>(0);
  const DEBOUNCE_MS = 1000; // 1 second between calls

  return useMutation({
    mutationFn: async (session: Omit<PackingSession, 'id' | 'created_at' | 'updated_at'>) => {
      // Debounce: ignore calls coming faster than 1 second after previous
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTimeRef.current;
      
      if (timeSinceLastCall < DEBOUNCE_MS && lastCallTimeRef.current !== 0) {
        console.log('⏸️ Debouncing upsert call - too fast');
        throw new Error('Too many requests - please wait');
      }
      
      lastCallTimeRef.current = now;

      // Ensure we have a valid session before making the request
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication session expired. Please log in again.');
      }
      
      if (!currentSession?.user) {
        throw new Error('No authenticated user found. Please log in again.');
      }

      console.log('Authenticated user ID:', currentSession.user.id);
      console.log('💾 Upserting packing session:', session.session_date);

      const { data, error } = await supabase
        .from('packing_sessions')
        .upsert(session, { 
          onConflict: 'bakery_id,session_date',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Packing session upsert error:', error);
        throw error;
      }
      
      console.log('✅ Packing session upserted successfully:', data.id);
      return data;
    },
    retry: (failureCount, error) => {
      // Don't retry debounce errors
      if (error instanceof Error && error.message.includes('Too many requests')) {
        return false;
      }
      // Retry specific database errors with max 2 attempts
      if (error instanceof Error && error.message.includes('ON CONFLICT')) {
        return failureCount < 2;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packing_sessions'] });
      queryClient.invalidateQueries({ queryKey: ['packing_session'] });
      toast({
        title: "Suksess",
        description: "Pakkeøkt oppdatert",
      });
    },
    onError: (error) => {
      if (error instanceof Error && error.message.includes('Too many requests')) {
        toast({
          title: "For raskt",
          description: "Vennligst vent et øyeblikk før du prøver igjen",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Feil",
          description: `Kunne ikke oppdatere pakkeøkt: ${error.message}`,
          variant: "destructive",
        });
      }
    },
  });
};
