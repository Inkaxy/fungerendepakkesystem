import { useEffect, useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';

/**
 * Konsolidert real-time hook for dashboard.
 * Erstatter useRealTimeDisplay, useRealTimeOrders, useRealTimeActivePackingProducts, og useRealTimePackingSessions.
 * Bruker én WebSocket-kanal med flere lyttere for bedre ytelse.
 */
export const useDashboardRealTime = () => {
  const queryClient = useQueryClient();
  const profile = useAuthStore((state) => state.profile);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    const bakeryId = profile?.bakery_id;
    
    if (!bakeryId) {
      console.log('⏸️ Dashboard RT: Ingen bakery_id, hopper over');
      return;
    }

    console.log('🔄 Dashboard RT: Setter opp konsolidert lytter for bakery:', bakeryId);

    const channel = supabase
      .channel(`dashboard-consolidated-${bakeryId}`)
      // Orders endringer
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `bakery_id=eq.${bakeryId}`
        },
        (payload) => {
          if (!isMountedRef.current) return;
          console.log('⚡ Dashboard RT: Order endret', payload.eventType);
          
          queryClient.invalidateQueries({ queryKey: ['orders', bakeryId] });
          queryClient.invalidateQueries({ queryKey: ['order-counts', bakeryId] });
        }
      )
      // Order products endringer
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'order_products',
          filter: `bakery_id=eq.${bakeryId}`
        },
        (payload) => {
          if (!isMountedRef.current) return;
          console.log('⚡ Dashboard RT: Order product oppdatert', payload.new);
          
          queryClient.invalidateQueries({ 
            queryKey: ['packing-data', bakeryId],
            exact: false 
          });
        }
      )
      // Packing sessions endringer
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'packing_sessions',
          filter: `bakery_id=eq.${bakeryId}`
        },
        (payload) => {
          if (!isMountedRef.current) return;
          console.log('⚡ Dashboard RT: Packing session endret', payload.eventType);
          
          queryClient.invalidateQueries({ queryKey: ['packing-sessions', bakeryId] });
          queryClient.invalidateQueries({ queryKey: ['active-packing-date', bakeryId] });
        }
      )
      // Active packing products endringer
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_packing_products',
          filter: `bakery_id=eq.${bakeryId}`
        },
        (payload) => {
          if (!isMountedRef.current) return;
          console.log('⚡ Dashboard RT: Active products endret', payload.eventType);
          
          const product = (payload.eventType === 'DELETE' ? payload.old : payload.new) as any;
          
          queryClient.invalidateQueries({ 
            queryKey: ['active-packing-products', product?.session_date || bakeryId],
            exact: false 
          });
          queryClient.invalidateQueries({ queryKey: ['active-packing-date'] });
        }
      )
      // Display settings endringer
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'display_settings',
          filter: `bakery_id=eq.${bakeryId}`
        },
        (payload) => {
          if (!isMountedRef.current) return;
          console.log('⚡ Dashboard RT: Display settings endret');
          
          queryClient.invalidateQueries({ queryKey: ['display-settings', bakeryId] });
        }
      )
      .subscribe((status) => {
        if (!isMountedRef.current) return;
        
        const newStatus = status === 'SUBSCRIBED' ? 'connected' : 
                         status === 'CHANNEL_ERROR' ? 'disconnected' : 'connecting';
        setConnectionStatus(newStatus);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Dashboard RT: Tilkoblet');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Dashboard RT: Tilkoblingsfeil');
        }
      });

    return () => {
      isMountedRef.current = false;
      console.log('🧹 Dashboard RT: Rydder opp');
      supabase.removeChannel(channel);
    };
  }, [profile?.bakery_id, queryClient]);

  return { connectionStatus };
};
