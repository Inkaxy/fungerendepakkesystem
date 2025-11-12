
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDisplayRefreshBroadcast = (bakeryId?: string, isDisplay = false) => {
  const { toast } = useToast();

  // Lytt på refresh broadcasts (kun for displays)
  useEffect(() => {
    if (!bakeryId || !isDisplay) return;

    console.log('📡 Setting up refresh broadcast listener for bakery:', bakeryId);

    const channel = supabase
      .channel(`display-refresh-${bakeryId}`)
      .on('broadcast', { event: 'force-refresh' }, (payload) => {
        console.log('🔄 Refresh signal mottatt, reloader display...');
        
        // Vent kort så logger går gjennom, deretter reload
        setTimeout(() => {
          window.location.reload();
        }, 100);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bakeryId, isDisplay]);

  // Broadcast refresh funksjon (for admin)
  const broadcastRefresh = async () => {
    if (!bakeryId) {
      console.error('❌ Ingen bakeryId funnet');
      return;
    }

    console.log('📡 Sender refresh broadcast til bakery:', bakeryId);

    const channel = supabase.channel(`display-refresh-${bakeryId}`);
    
    await channel.subscribe();
    
    await channel.send({
      type: 'broadcast',
      event: 'force-refresh',
      payload: { timestamp: new Date().toISOString() }
    });

    await supabase.removeChannel(channel);

    toast({
      title: "Refresh sendt!",
      description: "Alle displays oppdateres nå automatisk",
      duration: 3000,
    });

    console.log('✅ Refresh broadcast sendt');
  };

  return { broadcastRefresh };
};
