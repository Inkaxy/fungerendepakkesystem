import { useEffect, useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealTimePublicDisplay = (bakeryId?: string) => {
  const queryClient = useQueryClient();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (!bakeryId) {
      console.log('⏸️ WebSocket: Ingen bakeryId, hopper over tilkobling');
      return;
    }

    console.log('🔄 WebSocket: Setting up real-time for bakery:', bakeryId);

    const channel = supabase
      .channel(`public-display-${bakeryId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_packing_products',
          filter: `bakery_id=eq.${bakeryId}`
        },
        (payload) => {
          if (!isMountedRef.current) {
            console.log('⏸️ WebSocket: Ignorer active_packing_products oppdatering, komponent er unmounted');
            return;
          }
          
          console.log('⚡ WebSocket: Active products changed', payload.eventType);
          
          // Direct cache update - no refetch needed
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            if (!isMountedRef.current) return;
            
            queryClient.setQueryData(
              ['public-active-packing-products', bakeryId, (payload.new as any).session_date],
              (oldData: any[] | undefined) => {
                if (!oldData) return [payload.new];
                
                const index = oldData.findIndex(item => item.id === (payload.new as any).id);
                if (index >= 0) {
                  const newData = [...oldData];
                  newData[index] = payload.new;
                  return newData;
                }
                return [...oldData, payload.new];
              }
            );
            
            // ✅ KRITISK: Ved INSERT - fjern ALLE gamle packing-data cacher
            if (payload.eventType === 'INSERT') {
              if (!isMountedRef.current) return;
              
              console.log('🧹 INSERT detected - fjerner ALLE gamle packing-data cacher');
              queryClient.removeQueries({
                queryKey: ['public-packing-data-v2'],
                exact: false
              });
            }
          } else if (payload.eventType === 'DELETE') {
            const deletedProduct = payload.old as any;
            console.log('🗑️ WebSocket DELETE: Fjerner produkt fra cache', {
              product_id: deletedProduct.product_id,
              product_name: deletedProduct.product_name,
              session_date: deletedProduct.session_date,
              cache_key: ['public-active-packing-products', bakeryId, deletedProduct.session_date]
            });
            
            if (!isMountedRef.current) return;
            
            queryClient.setQueryData(
              ['public-active-packing-products', bakeryId, deletedProduct.session_date],
              (oldData: any[] | undefined) => {
                const filtered = oldData?.filter(item => item.id !== deletedProduct.id) || [];
                console.log('✅ Cache etter DELETE:', {
                  before: oldData?.length || 0,
                  after: filtered.length,
                  removed: deletedProduct.product_name
                });
                return filtered;
              }
            );
            
            if (!isMountedRef.current) return;
            
            // ✅ KRITISK FIX: Fjern ALLE gamle packing-data cacher når active products endres
            // Dette tvinger komponenter til å refetch med oppdatert activeProducts-liste
            queryClient.removeQueries({
              queryKey: ['public-packing-data-v2'],
              exact: false
            });
            
            if (!isMountedRef.current) return;
            
            // ✅ KRITISK: Invalider active-packing-products for å trigge refetch
            queryClient.invalidateQueries({
              queryKey: ['public-active-packing-products', bakeryId, deletedProduct.session_date],
              refetchType: 'active' // Force refetch av aktive queries
            });
            
            console.log('🧹 Fjernet alle gamle packing-data cacher + invalidert active products');
          }
          
          if (!isMountedRef.current) return;
          
          // Mark public-packing-data as stale and force refetch for INSERT/UPDATE
          queryClient.invalidateQueries({
            queryKey: ['public-packing-data-v2'],
            exact: false,
            refetchType: 'active' // ✅ Force refetch for active queries
          });
          
          console.log('✅ Active products cache updated, forcing display refetch...');
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'order_products',
          filter: `bakery_id=eq.${bakeryId}` // ✅ FIKSET: Enkelt filter som Realtime støtter
        },
        (payload) => {
          if (!isMountedRef.current) {
            console.log('⏸️ WebSocket: Ignorer order_products oppdatering, komponent er unmounted');
            return;
          }
          
          const wsReceiveTime = performance.now();
          const updatedProduct = payload.new as any;
          console.log('⚡ WebSocket RECEIVED: order_products UPDATE at', wsReceiveTime.toFixed(2), 'ms', {
            order_product_id: updatedProduct.id,
            new_status: updatedProduct.packing_status,
            product_id: updatedProduct.product_id,
            bakery_id: updatedProduct.bakery_id // ✅ Vis bakery_id for debugging
          });
          
          // Optimistic cache update - update ALL matching caches instantly
          const allCaches = queryClient.getQueryCache().findAll({ 
            queryKey: ['public-packing-data-v2'], 
            exact: false 
          });

          console.log(`🔄 Fant ${allCaches.length} cache(s) å oppdatere for order_product ${updatedProduct.id}`);

          allCaches.forEach(query => {
            if (!isMountedRef.current) return;
            
            const oldData = query.state.data as any;
            if (!oldData) return;
            
            const newData = oldData.map((customer: any) => ({
              ...customer,
              products: customer.products?.map((product: any) => {
                const updatedOrderItems = product.order_items?.map((item: any) => {
                  if (item.order_product_id === updatedProduct.id) {
                    console.log(`✅ Oppdaterer order_product ${updatedProduct.id} status til ${updatedProduct.packing_status}`);
                    return {
                      ...item,
                      packing_status: updatedProduct.packing_status
                    };
                  }
                  return item;
                });
                
                // Recalculate product-level status if any items changed
                if (updatedOrderItems && updatedOrderItems !== product.order_items) {
                  const allPacked = updatedOrderItems.every((item: any) => 
                    item.packing_status === 'packed' || item.packing_status === 'completed'
                  );
                  const somePacked = updatedOrderItems.some((item: any) => 
                    item.packing_status === 'packed' || item.packing_status === 'completed'
                  );
                  
                  return {
                    ...product,
                    order_items: updatedOrderItems,
                    packing_status: allPacked ? 'packed' : somePacked ? 'in_progress' : 'pending'
                  };
                }
                
                return product;
              })
            }));
            
            if (!isMountedRef.current) return;
            
            queryClient.setQueryData(query.queryKey, newData);
          });

          const cacheUpdateTime = performance.now();
          console.log('✅ Alle cacher oppdatert - Total tid:', (cacheUpdateTime - wsReceiveTime).toFixed(2), 'ms');

          if (!isMountedRef.current) return;

          // ✅ Tving React Query til å re-render komponenter UMIDDELBART
          queryClient.invalidateQueries({
            queryKey: ['public-packing-data-v2'],
            exact: false,
            refetchType: 'none' // Ikke refetch, kun re-render med oppdatert cache
          });
          
          console.log('🔄 Tvunget re-render av display etter statusendring');
        }
      )
      .subscribe((status) => {
        if (!isMountedRef.current) return;
        
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 
                           status === 'CHANNEL_ERROR' ? 'disconnected' : 'connecting');
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ WebSocket: Connected');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ WebSocket: Connection error');
        }
      });

    return () => {
      isMountedRef.current = false; // FØRST - blokkerer alle callbacks
      console.log('🧹 WebSocket: Cleaning up');
      supabase.removeChannel(channel);
    };
  }, [bakeryId]); // queryClient er stabilt, trenger ikke være dependency

  return { connectionStatus };
};
