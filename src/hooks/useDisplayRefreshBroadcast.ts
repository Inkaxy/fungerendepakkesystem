
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { QUERY_KEYS } from '@/lib/queryKeys';

export const useDisplayRefreshBroadcast = (bakeryId?: string, isDisplay = false) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMountedRef = useRef(true);

  // Lytt på refresh broadcasts (kun for displays)
  useEffect(() => {
    isMountedRef.current = true;
    
    if (!bakeryId || !isDisplay) return;

    console.log('📡 Setting up refresh broadcast listener for bakery:', bakeryId);

    const channel = supabase
      .channel(`display-refresh-${bakeryId}`)
      .on('broadcast', { event: 'force-refresh' }, (payload) => {
        if (!isMountedRef.current) {
          console.log('⏸️ WebSocket: Ignorer refresh broadcast, komponent er unmounted');
          return;
        }
        
        console.log('🔄 Refresh signal mottatt, invaliderer display-cacher...', payload);

        // Myk refresh: invalider relevante queries (ingen full reload → mindre flimring)
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PUBLIC_DISPLAY_SETTINGS[0], bakeryId],
          refetchType: 'active',
        });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_DATE[0], bakeryId],
          refetchType: 'active',
        });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_PRODUCTS[0], bakeryId],
          exact: false,
          refetchType: 'active',
        });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PUBLIC_PACKING_DATA[0]],
          exact: false,
          refetchType: 'active',
        });
      })
      .subscribe();

    return () => {
      isMountedRef.current = false; // FØRST - blokkerer alle callbacks
      supabase.removeChannel(channel);
    };
  }, [bakeryId, isDisplay, queryClient]);

  // Broadcast refresh funksjon (for admin)
  const broadcastRefresh = async () => {
    if (!bakeryId) {
      console.error('❌ Ingen bakeryId funnet');
      return;
    }

    console.log('📡 Sender refresh broadcast til bakery:', bakeryId);

    const channel = supabase.channel(`display-refresh-${bakeryId}`);

    // ✅ Viktig: supabase-js v2 sin subscribe() er ikke awaitable (returnerer channel).
    // Vi venter eksplisitt på SUBSCRIBED før vi sender, ellers kan meldingen droppes.
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        // Fallback: ikke blokker for alltid
        console.warn('⚠️ Broadcast subscribe timeout - forsøker å sende likevel');
        resolve();
      }, 2000);

      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          clearTimeout(timeout);
          resolve();
        }
        if (status === 'CHANNEL_ERROR') {
          clearTimeout(timeout);
          reject(new Error('CHANNEL_ERROR ved subscribe()'));
        }
      });
    });

    const sendResult = await channel.send({
      type: 'broadcast',
      event: 'force-refresh',
      payload: { timestamp: new Date().toISOString() },
    });

    console.log('📡 Broadcast send result:', sendResult);

    supabase.removeChannel(channel);

    toast({
      title: "Refresh sendt!",
      description: "Alle displays oppdateres nå automatisk",
      duration: 3000,
    });

    console.log('✅ Refresh broadcast sendt');
  };

  return { broadcastRefresh };
};
