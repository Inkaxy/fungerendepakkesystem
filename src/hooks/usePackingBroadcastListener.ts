import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { QUERY_KEYS } from '@/lib/queryKeys';
import type { PackingUpdatePayload } from './usePackingBroadcast';

// Channel name for packing updates
const getChannelName = (bakeryId: string) => `packing-updates-${bakeryId}`;

interface PackingCustomer {
  id: string;
  name: string;
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    packed_quantity: number;
    status: 'pending' | 'packed';
    order_product_id: string;
  }>;
  overall_status: string;
  progress_percentage: number;
  total_products: number;
  packed_products: number;
  total_line_items_all: number;
  packed_line_items_all: number;
}

/**
 * Hook for listening to packing broadcast updates on displays.
 * Applies optimistic updates directly to the cache without database queries.
 */
export const usePackingBroadcastListener = (bakeryId?: string) => {
  const queryClient = useQueryClient();
  const isMountedRef = useRef(true);
  const lastUpdateRef = useRef<number>(0);

  // Apply a packing update directly to cache
  const applyPackingUpdate = useCallback((payload: PackingUpdatePayload) => {
    if (!isMountedRef.current) return;

    console.log('🔄 Applying broadcast update:', payload.type);

    switch (payload.type) {
      case 'ITEM_PACKED':
      case 'ITEM_UNPACKED': {
        // Update the specific order product in all relevant caches
        const newStatus = payload.type === 'ITEM_PACKED' ? 'packed' : 'pending';
        
        // Update PUBLIC_PACKING_DATA cache
        queryClient.setQueriesData(
          { queryKey: [QUERY_KEYS.PUBLIC_PACKING_DATA[0]], exact: false },
          (oldData: PackingCustomer[] | undefined) => {
            if (!oldData) return oldData;
            
            return oldData.map(customer => {
              if (customer.id !== payload.customerId) return customer;
              
              let packedDelta = payload.type === 'ITEM_PACKED' ? 1 : -1;
              let newPackedProducts = customer.packed_products + packedDelta;
              let newPackedLineItems = customer.packed_line_items_all + packedDelta;
              
              // Ensure values don't go below 0
              newPackedProducts = Math.max(0, Math.min(newPackedProducts, customer.total_products));
              newPackedLineItems = Math.max(0, Math.min(newPackedLineItems, customer.total_line_items_all));
              
              const newProgress = customer.total_products > 0 
                ? Math.round((newPackedProducts / customer.total_products) * 100)
                : 0;

              return {
                ...customer,
                packed_products: newPackedProducts,
                packed_line_items_all: newPackedLineItems,
                progress_percentage: newProgress,
                overall_status: newProgress >= 100 ? 'completed' : 'ongoing',
                products: customer.products.map(product => {
                  if (product.order_product_id !== payload.orderProductId) return product;
                  return {
                    ...product,
                    status: newStatus,
                    packed_quantity: newStatus === 'packed' ? product.quantity : 0,
                  };
                }),
              };
            });
          }
        );
        break;
      }

      case 'ALL_PACKED': {
        // Mark all items as packed for a product
        queryClient.setQueriesData(
          { queryKey: [QUERY_KEYS.PUBLIC_PACKING_DATA[0]], exact: false },
          (oldData: PackingCustomer[] | undefined) => {
            if (!oldData || !payload.orderProductIds) return oldData;
            
            const orderProductIdSet = new Set(payload.orderProductIds);
            
            return oldData.map(customer => {
              const affectedProducts = customer.products.filter(
                p => orderProductIdSet.has(p.order_product_id)
              );
              
              if (affectedProducts.length === 0) return customer;
              
              const newPackedProducts = customer.packed_products + affectedProducts.filter(p => p.status !== 'packed').length;
              const newProgress = customer.total_products > 0 
                ? Math.round((newPackedProducts / customer.total_products) * 100)
                : 0;

              return {
                ...customer,
                packed_products: Math.min(newPackedProducts, customer.total_products),
                progress_percentage: newProgress,
                overall_status: newProgress >= 100 ? 'completed' : 'ongoing',
                products: customer.products.map(product => {
                  if (!orderProductIdSet.has(product.order_product_id)) return product;
                  return {
                    ...product,
                    status: 'packed' as const,
                    packed_quantity: product.quantity,
                  };
                }),
              };
            });
          }
        );
        break;
      }

      case 'PRODUCTS_SELECTED':
      case 'PRODUCTS_CLEARED': {
        // ✅ OPTIMALISERT: Invalidate uten å tvinge loading-spinner
        // La React Query håndtere background refetch
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_PRODUCTS[0]],
          exact: false,
          refetchType: 'none', // Ikke tving refetch - la cache oppdateres i bakgrunnen
        });
        
        // Background refetch av packing data
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PUBLIC_PACKING_DATA[0]],
          exact: false,
          refetchType: 'none',
        });
        
        // ✅ NY: Invalidate batch cache også
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PUBLIC_ALL_CUSTOMERS_PACKING[0]],
          exact: false,
          refetchType: 'none',
        });
        
        // Trigger soft refetch etter kort delay for å unngå loading-spinner
        setTimeout(() => {
          queryClient.refetchQueries({
            queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_PRODUCTS[0]],
            exact: false,
          });
          queryClient.refetchQueries({
            queryKey: [QUERY_KEYS.PUBLIC_ALL_CUSTOMERS_PACKING[0]],
            exact: false,
          });
        }, 50);
        break;
      }
    }

    lastUpdateRef.current = payload.timestamp;
  }, [queryClient]);

  useEffect(() => {
    if (!bakeryId) return;

    isMountedRef.current = true;
    const channelName = getChannelName(bakeryId);

    console.log('📡 Setting up broadcast listener for:', channelName);

    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'packing-update' }, ({ payload }) => {
        if (!isMountedRef.current) {
          console.log('⏸️ Ignoring broadcast, component unmounted');
          return;
        }

        const update = payload as PackingUpdatePayload;
        
        // Ignore outdated updates
        if (update.timestamp < lastUpdateRef.current) {
          console.log('⏭️ Skipping outdated broadcast');
          return;
        }

        applyPackingUpdate(update);
      })
      .subscribe((status) => {
        console.log('📡 Broadcast channel status:', status);
      });

    return () => {
      isMountedRef.current = false;
      supabase.removeChannel(channel);
      console.log('📡 Broadcast listener cleaned up');
    };
  }, [bakeryId, applyPackingUpdate]);

  return {
    lastUpdate: lastUpdateRef.current,
  };
};
