import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { QUERY_KEYS } from '@/lib/queryKeys';

// ✅ TypeScript interfaces for better type safety
interface OrderProductUpdate {
  id: string;
  product_id: string;
  order_id: string;
  quantity: number;
  packing_status: 'pending' | 'in_progress' | 'packed' | 'completed';
  bakery_id: string;
}

interface ActivePackingProduct {
  id: string;
  product_id: string;
  session_date: string;
  bakery_id: string;
  product_name?: string;
}

export const useRealTimePublicDisplay = (bakeryId?: string) => {
  const queryClient = useQueryClient();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 5;

  // ✅ WebSocket retry-logikk med exponential backoff
  useEffect(() => {
    if (connectionStatus === 'disconnected' && retryCount < maxRetries) {
      const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
      console.log(`🔄 WebSocket reconnect scheduled in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
      
      const timer = setTimeout(() => {
        console.log(`🔄 Attempting reconnect... (${retryCount + 1}/${maxRetries})`);
        setRetryCount(prev => prev + 1);
        setConnectionStatus('connecting');
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [connectionStatus, retryCount]);

  // ✅ Reset retry count ved successful connection
  useEffect(() => {
    if (connectionStatus === 'connected') {
      setRetryCount(0);
      console.log('✅ WebSocket connected - retry count reset');
    }
  }, [connectionStatus]);

  useEffect(() => {
    if (!bakeryId) {
      console.log('⏸️ WebSocket: Ingen bakeryId, hopper over tilkobling');
      return;
    }

    console.log('🔄 WebSocket: Setting up real-time for bakery:', bakeryId);

    const channel = supabase
      .channel(`public-display-${bakeryId}`)
      // ✅ NY: Lytt på display_settings for innstillingsendringer
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'display_settings',
          filter: `bakery_id=eq.${bakeryId}`
        },
        (payload) => {
          console.log('⚡ WebSocket: display_settings changed', payload.eventType);
          
          // Invalidate display settings cache - dette oppdaterer produktfarger osv.
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.PUBLIC_DISPLAY_SETTINGS[0], bakeryId],
            refetchType: 'active'
          });
          
          console.log('✅ Display settings endret - innstillinger cache invalidert');
        }
      )
      // ✅ Lytt på packing_sessions for sesjonsskifte
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'packing_sessions',
          filter: `bakery_id=eq.${bakeryId}`
        },
        (payload) => {
          console.log('⚡ WebSocket: packing_sessions changed', payload.eventType, payload.new);
          
          // Invalidate date og products cache ved sesjonsskifte
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_DATE[0], bakeryId],
            refetchType: 'active'
          });
          
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_PRODUCTS[0], bakeryId],
            exact: false,
            refetchType: 'active'
          });
          
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.PUBLIC_PACKING_DATA[0]],
            exact: false,
            refetchType: 'active'
          });
          
          console.log('✅ Packing session endret - alle display cacher invalidert');
        }
      )
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
          
          // ✅ FIX: Kun invalidate - ingen removeQueries (forhindrer race condition)
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const newProduct = payload.new as ActivePackingProduct;
            
            queryClient.setQueryData(
              [QUERY_KEYS.PUBLIC_ACTIVE_PRODUCTS[0], bakeryId, newProduct.session_date],
              (oldData: ActivePackingProduct[] | undefined) => {
                if (!oldData) return [newProduct];
                
                const index = oldData.findIndex(item => item.id === newProduct.id);
                if (index >= 0) {
                  const newData = [...oldData];
                  newData[index] = newProduct;
                  return newData;
                }
                return [...oldData, newProduct];
              }
            );
            
            if (payload.eventType === 'INSERT') {
              console.log('🧹 INSERT detected - invaliderer alle relaterte cacher (ingen removeQueries)');
              
              // ✅ Kun invalidate med refetch - la React Query håndtere cachen
              queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_DATE[0], bakeryId],
                refetchType: 'active'
              });
              
              queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.PUBLIC_PACKING_DATA[0]],
                exact: false,
                refetchType: 'active'
              });
            }
          } else if (payload.eventType === 'DELETE') {
            const deletedProduct = payload.old as ActivePackingProduct | undefined;
            console.log('🗑️ WebSocket DELETE: Invaliderer alle cacher (ingen removeQueries)', {
              payload_old: deletedProduct,
              has_data: !!deletedProduct?.id
            });
            
            // ✅ Kun invalidate med refetch - ikke removeQueries
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_PRODUCTS[0], bakeryId],
              exact: false,
              refetchType: 'active'
            });
            
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.PUBLIC_PACKING_DATA[0]],
              exact: false,
              refetchType: 'active'
            });
            
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_DATE[0], bakeryId],
              refetchType: 'active'
            });
            
            console.log('🧹 Invaliderte ALLE cacher - React Query håndterer refetch');
          }
          
          // Always invalidate packing data for consistency
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
          const updatedProduct = payload.new as OrderProductUpdate;
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
