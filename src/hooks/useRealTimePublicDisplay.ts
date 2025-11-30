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
            
            // ✅ KRITISK: Ved INSERT - fjern ALLE gamle packing-data cacher OG invalidér datoen
            if (payload.eventType === 'INSERT') {
              if (!isMountedRef.current) return;
              
              console.log('🧹 INSERT detected - fjerner ALLE gamle packing-data cacher og invaliderer aktiv dato');
              
              // Invalidér aktiv pakkingsdato slik at displayet henter ny dato
              queryClient.invalidateQueries({
                queryKey: ['public-active-packing-date', bakeryId],
                refetchType: 'active'
              });
              
              queryClient.removeQueries({
                queryKey: ['public-packing-data-v3'],
                exact: false
              });
            }
          } else if (payload.eventType === 'DELETE') {
            const deletedProduct = payload.old as any;
            console.log('🗑️ WebSocket DELETE: Fjerner ALLE cacher (payload.old kan være tom)', {
              payload_old: deletedProduct,
              has_data: !!deletedProduct?.id
            });
            
            if (!isMountedRef.current) return;
            
            // ✅ KRITISK FIX: Fjern ALLE cacher uavhengig av payload.old data
            // Dette sikrer at displayet alltid refetcher fra databasen ved DELETE
            queryClient.removeQueries({
              queryKey: ['public-active-packing-products', bakeryId],
              exact: false  // Matcher alle datoer
            });
            
            if (!isMountedRef.current) return;
            
            // Fjern ALLE packing-data cacher
            queryClient.removeQueries({
              queryKey: ['public-packing-data-v3'],
              exact: false
            });
            
            if (!isMountedRef.current) return;
            
            // ✅ Invalidér aktiv pakkingsdato når produkter slettes
            queryClient.invalidateQueries({
              queryKey: ['public-active-packing-date', bakeryId],
              refetchType: 'active'
            });
            
            // ✅ Force invalidation med refetch for å hente ferske data
            queryClient.invalidateQueries({
              queryKey: ['public-active-packing-products', bakeryId],
              exact: false,
              refetchType: 'active' // Force refetch av aktive queries
            });
            
            console.log('🧹 Fjernet ALLE cacher - tvinger fresh fetch fra database');
          }
          
          if (!isMountedRef.current) return;
          
          // Mark public-packing-data as stale and force refetch for INSERT/UPDATE
          queryClient.invalidateQueries({
            queryKey: ['public-packing-data-v3'],
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
            queryKey: ['public-packing-data-v3'], 
            exact: false 
          });

          console.log(`🔄 Fant ${allCaches.length} cache(s) å oppdatere for product_id ${updatedProduct.product_id}`);

          console.log('🔍 Leter etter product_id:', updatedProduct.product_id, 'order_product_id:', updatedProduct.id);
          
          allCaches.forEach(query => {
            if (!isMountedRef.current) return;
            
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
              // ✅ KRITISK FIX: Match på product_id, ikke order_product_id
              // Siden cachen aggregerer flere order_products til én rad
              const updatedProducts = customer.products?.map((product: any) => {
                if (product.product_id === updatedProduct.product_id) {
                  const isPacked = updatedProduct.packing_status === 'packed' || 
                                   updatedProduct.packing_status === 'completed';
                  const wasPending = product.packing_status === 'pending';
                  
                  console.log(`✅ MATCH! Oppdaterer ${product.product_name} - match på product_id ${product.product_id}`);
                  
                  // Optimistisk oppdatering: +1 til packed_line_items hvis status endres til packed
                  let newPackedCount = product.packed_line_items || 0;
                  if (isPacked && wasPending) {
                    newPackedCount = Math.min(product.packed_line_items + 1, product.total_line_items);
                    console.log(`📈 Øker packed_line_items: ${product.packed_line_items} → ${newPackedCount}`);
                  }
                  
                  // Beregn ny status basert på tellingen
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

              // Recalculate customer progress if products were updated
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
            
            if (!isMountedRef.current) return;
            
            queryClient.setQueryData(query.queryKey, newData);
          });

          const cacheUpdateTime = performance.now();
          console.log('✅ Alle cacher oppdatert - Total tid:', (cacheUpdateTime - wsReceiveTime).toFixed(2), 'ms');

          if (!isMountedRef.current) return;

          // ✅ HYBRID TILNÆRMING: Først optimistisk oppdatering, deretter refetch for nøyaktighet
          queryClient.invalidateQueries({
            queryKey: ['public-packing-data-v3'],
            exact: false,
            refetchType: 'active' // ✅ KRITISK: Force refetch for å få nøyaktig packed_line_items telling
          });
          
          console.log('🔄 Cache oppdatert optimistisk + tvinger refetch for nøyaktig telling');
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
