import { useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';

// Broadcast payload type for packing updates
export interface PackingUpdatePayload {
  type: 'ITEM_PACKED' | 'ITEM_UNPACKED' | 'ALL_PACKED' | 'PRODUCTS_SELECTED' | 'PRODUCTS_CLEARED';
  bakeryId: string;
  customerId?: string;
  productId?: string;
  orderProductId?: string;
  newStatus?: 'packed' | 'pending';
  quantity?: number;
  timestamp: number;
  // For bulk updates
  orderProductIds?: string[];
  productIds?: string[];
  sessionDate?: string;
}

// Channel name for packing updates
const getChannelName = (bakeryId: string) => `packing-updates-${bakeryId}`;

/**
 * Hook for broadcasting packing updates to displays.
 * Used by the dashboard/admin side to push updates immediately.
 */
export const usePackingBroadcast = () => {
  const profile = useAuthStore((state) => state.profile);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const broadcastPackingUpdate = useCallback(async (payload: Omit<PackingUpdatePayload, 'bakeryId' | 'timestamp'>) => {
    const bakeryId = profile?.bakery_id;
    if (!bakeryId) {
      console.warn('⚠️ usePackingBroadcast: No bakery_id found');
      return;
    }

    const fullPayload: PackingUpdatePayload = {
      ...payload,
      bakeryId,
      timestamp: Date.now(),
    };

    try {
      // Create a temporary channel for sending
      const channelName = getChannelName(bakeryId);
      const channel = supabase.channel(channelName);
      
      await channel.subscribe();
      
      await channel.send({
        type: 'broadcast',
        event: 'packing-update',
        payload: fullPayload,
      });

      console.log('📡 Broadcast sent:', fullPayload.type, fullPayload);

      // Clean up channel
      await supabase.removeChannel(channel);
    } catch (error) {
      console.error('❌ Broadcast failed:', error);
    }
  }, [profile?.bakery_id]);

  // Convenience methods for common operations
  const broadcastItemPacked = useCallback((
    orderProductId: string,
    customerId: string,
    productId: string,
    quantity: number
  ) => {
    return broadcastPackingUpdate({
      type: 'ITEM_PACKED',
      orderProductId,
      customerId,
      productId,
      quantity,
      newStatus: 'packed',
    });
  }, [broadcastPackingUpdate]);

  const broadcastItemUnpacked = useCallback((
    orderProductId: string,
    customerId: string,
    productId: string,
    quantity: number
  ) => {
    return broadcastPackingUpdate({
      type: 'ITEM_UNPACKED',
      orderProductId,
      customerId,
      productId,
      quantity,
      newStatus: 'pending',
    });
  }, [broadcastPackingUpdate]);

  const broadcastAllPacked = useCallback((
    orderProductIds: string[],
    productId: string
  ) => {
    return broadcastPackingUpdate({
      type: 'ALL_PACKED',
      orderProductIds,
      productId,
      newStatus: 'packed',
    });
  }, [broadcastPackingUpdate]);

  const broadcastProductsSelected = useCallback((
    productIds: string[],
    sessionDate: string
  ) => {
    return broadcastPackingUpdate({
      type: 'PRODUCTS_SELECTED',
      productIds,
      sessionDate,
    });
  }, [broadcastPackingUpdate]);

  const broadcastProductsCleared = useCallback((
    sessionDate: string
  ) => {
    return broadcastPackingUpdate({
      type: 'PRODUCTS_CLEARED',
      sessionDate,
    });
  }, [broadcastPackingUpdate]);

  return {
    broadcastPackingUpdate,
    broadcastItemPacked,
    broadcastItemUnpacked,
    broadcastAllPacked,
    broadcastProductsSelected,
    broadcastProductsCleared,
  };
};
