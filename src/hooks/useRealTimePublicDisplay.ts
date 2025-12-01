import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { QUERY_KEYS } from '@/lib/queryKeys';

export const useRealTimePublicDisplay = (bakeryId?: string) => {
  const queryClient = useQueryClient();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');

  useEffect(() => {
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
          console.log('⚡ WebSocket: Active products changed', payload.eventType);
          
          // Direct cache update - no refetch needed
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            queryClient.setQueryData(
              [QUERY_KEYS.PUBLIC_ACTIVE_PRODUCTS[0], bakeryId, (payload.new as any).session_date],
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
            
            // ✅ KRITISK: Ved INSERT - fjern ALLE gamle packing-data cacher OG invalidér datoen
            if (payload.eventType === 'INSERT') {
              console.log('🧹 INSERT detected - fjerner ALLE gamle packing-data cacher og invaliderer aktiv dato');
              
              // Invalidér aktiv pakkingsdato slik at displayet henter ny dato
              queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_DATE[0], bakeryId],
                refetchType: 'active'
              });
              
              queryClient.removeQueries({
                queryKey: [QUERY_KEYS.PUBLIC_PACKING_DATA[0]],
                exact: false
              });
            }
          } else if (payload.eventType === 'DELETE') {
            const deletedProduct = payload.old as any;
            console.log('🗑️ WebSocket DELETE: Fjerner ALLE cacher', {
              payload_old: deletedProduct,
              has_data: !!deletedProduct?.id
            });
            
            // Fjern ALLE cacher uavhengig av payload.old data
            queryClient.removeQueries({
              queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_PRODUCTS[0], bakeryId],
              exact: false
            });
            
            queryClient.removeQueries({
              queryKey: [QUERY_KEYS.PUBLIC_PACKING_DATA[0]],
              exact: false
            });
            
            // Invalidér aktiv pakkingsdato når produkter slettes
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_DATE[0], bakeryId],
              refetchType: 'active'
            });
            
            // Force invalidation med refetch for å hente ferske data
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_PRODUCTS[0], bakeryId],
              exact: false,
              refetchType: 'active'
            });
            
            console.log('🧹 Fjernet ALLE cacher - tvinger fresh fetch fra database');
          }
          
          // Mark public-packing-data as stale and force refetch for INSERT/UPDATE
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.PUBLIC_PACKING_DATA[0]],
            exact: false,
            refetchType: 'active'
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
          filter: `bakery_id=eq.${bakeryId}`
        },
        (payload) => {
          const wsReceiveTime = performance.now();
          const updatedProduct = payload.new as any;
          console.log('⚡ WebSocket RECEIVED: order_products UPDATE at', wsReceiveTime.toFixed(2), 'ms', {
            order_product_id: updatedProduct.id,
            new_status: updatedProduct.packing_status,
            product_id: updatedProduct.product_id,
            bakery_id: updatedProduct.bakery_id
          });
          
          // Optimistic cache update - update ALL matching caches instantly
          const allCaches = queryClient.getQueryCache().findAll({ 
            queryKey: [QUERY_KEYS.PUBLIC_PACKING_DATA[0]], 
            exact: false 
          });

          console.log(`🔄 Fant ${allCaches.length} cache(s) å oppdatere for product_id ${updatedProduct.product_id}`);

          console.log('🔍 Leter etter product_id:', updatedProduct.product_id, 'order_product_id:', updatedProduct.id);
          
          allCaches.forEach(query => {
            const oldData = query.state.data as any;
            if (!oldData) return;

            console.log('📦 Produkter i cache:', oldData?.flatMap((c: any) => 
              c.products?.map((p: any) => ({ 
                order_product_id: p.id, 
                product_id: p.product_id, 
                name: p.product_name 
              }))
            ));
            
            const newData = oldData.map((customer: any) => {
              const updatedProducts = customer.products?.map((product: any) => {
                if (product.product_id === updatedProduct.product_id) {
                  const isPacked = updatedProduct.packing_status === 'packed' || 
                                   updatedProduct.packing_status === 'completed';
                  const wasPending = product.packing_status === 'pending';
                  
                  console.log(`✅ MATCH! Oppdaterer ${product.product_name} - match på product_id ${product.product_id}`);
                  
                  let newPackedCount = product.packed_line_items || 0;
                  if (isPacked && wasPending) {
                    newPackedCount = Math.min(product.packed_line_items + 1, product.total_line_items);
                    console.log(`📈 Øker packed_line_items: ${product.packed_line_items} → ${newPackedCount}`);
                  }
                  
                  const newStatus = newPackedCount >= product.total_line_items ? 'completed' : 
                                    newPackedCount > 0 ? 'in_progress' : 'pending';
                  
                  return {
                    ...product,
                    packed_line_items: newPackedCount,
                    packing_status: newStatus
                  };
                }
                return product;
              });

              if (updatedProducts !== customer.products) {
                const totalLines = updatedProducts.reduce((sum: number, product: any) => 
                  sum + (product.total_line_items || 0), 0);
                const packedLines = updatedProducts.reduce((sum: number, product: any) => 
                  sum + (product.packed_line_items || 0), 0);
                const progress = totalLines > 0 ? Math.round((packedLines / totalLines) * 100) : 0;
                
                return {
                  ...customer,
                  products: updatedProducts,
                  packed_line_items: packedLines,
                  progress_percentage: progress,
                  overall_status: progress >= 100 ? 'completed' : 'ongoing'
                };
              }

              return customer;
            });
            
            queryClient.setQueryData(query.queryKey, newData);
          });

          const cacheUpdateTime = performance.now();
          console.log('✅ Alle cacher oppdatert - Total tid:', (cacheUpdateTime - wsReceiveTime).toFixed(2), 'ms');

          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.PUBLIC_PACKING_DATA[0]],
            exact: false,
            refetchType: 'active'
          });
          
          console.log('🔄 Cache oppdatert optimistisk + tvinger refetch for nøyaktig telling');
        }
      )
      .subscribe((status) => {
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 
                           status === 'CHANNEL_ERROR' ? 'disconnected' : 'connecting');
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ WebSocket: Connected');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ WebSocket: Connection error');
        }
      });

    return () => {
      console.log('🧹 WebSocket: Cleaning up');
      supabase.removeChannel(channel);
    };
  }, [bakeryId]);

  return { connectionStatus };
};
