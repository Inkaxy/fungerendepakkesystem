
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Customer, PackingSession } from '@/types/database';
import { DisplaySettings } from '@/types/displaySettings';
import { PackingCustomer } from './usePackingData';
import { format } from 'date-fns';

// Hook to get a customer by display URL without authentication
export const usePublicCustomerByDisplayUrl = (displayUrl: string) => {
  return useQuery({
    queryKey: ['public-customer', displayUrl],
    queryFn: async () => {
      console.log('Fetching public customer with display URL:', displayUrl);
      
      const { data, error } = await supabase
        .from('public_display_customers')
        .select('*')
        .eq('display_url', displayUrl)
        .maybeSingle();

      if (error) {
        console.error('Error fetching public customer:', error);
        throw error;
      }

      console.log('Found public customer:', data);
      return data as Customer;
    },
    refetchInterval: false, // Kun websockets
    staleTime: Infinity, // Cache er alltid fersk via websockets
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: (failureCount) => {
      if (failureCount < 3) return true;
      console.warn('Using cached customer data due to fetch failure');
      return false;
    },
  });
};

// Hook to get display settings for a bakery without authentication
export const usePublicDisplaySettings = (displayUrl: string) => {
  const { data: customer } = usePublicCustomerByDisplayUrl(displayUrl);
  
  return useQuery({
    queryKey: ['public-display-settings', customer?.bakery_id],
    queryFn: async () => {
      if (!customer?.bakery_id) {
        throw new Error('No bakery found for customer');
      }

      console.log('Fetching public display settings for bakery:', customer.bakery_id);

      const { data, error } = await supabase
        .from('display_settings')
        .select('*')
        .eq('bakery_id', customer.bakery_id)
        .eq('screen_type', 'shared')
        .maybeSingle();

      if (error) {
        console.error('Error fetching public display settings:', error);
        throw error;
      }

      // Map the data to DisplaySettings interface
      const mappedSettings: DisplaySettings = {
        ...data,
        screen_type: data.screen_type || 'shared',
        packing_status_ongoing_color: data.status_in_progress_color || '#3b82f6',
        packing_status_completed_color: data.status_completed_color || '#10b981'
      } as DisplaySettings;

      console.log('Found public display settings:', mappedSettings);
      return mappedSettings;
    },
    enabled: !!customer?.bakery_id,
    refetchInterval: false, // Kun websockets
    staleTime: Infinity, // Cache er alltid fersk via websockets
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: (failureCount) => {
      if (failureCount < 3) return true;
      console.warn('Using cached display settings due to fetch failure');
      return false;
    },
  });
};

// Hook to get active packing date without authentication
export const usePublicActivePackingDate = (bakeryId?: string) => {
  return useQuery({
    queryKey: ['public-active-packing-date', bakeryId],
    queryFn: async () => {
      if (!bakeryId) return null;

      console.log('Fetching public active packing date for bakery:', bakeryId);

      // First try to get the latest session_date from active_packing_products
      const { data: activeData, error: activeError } = await supabase
        .from('active_packing_products')
        .select('session_date')
        .eq('bakery_id', bakeryId)
        .order('session_date', { ascending: false })
        .limit(1);

      if (!activeError && activeData && activeData.length > 0) {
        console.log('Found active packing date from active_packing_products:', activeData[0].session_date);
        return activeData[0].session_date;
      }

      console.log('No active packing products found, checking packing_sessions...');

      // If no active products, fallback to packing_sessions
      const { data: sessionData, error: sessionError } = await supabase
        .from('packing_sessions')
        .select('session_date')
        .eq('bakery_id', bakeryId)
        .in('status', ['ready', 'in_progress'])
        .order('session_date', { ascending: false })
        .limit(1);

      if (sessionError || !sessionData || sessionData.length === 0) {
        console.log('No active packing session found');
        return null;
      }

      console.log('Found active packing date from packing_sessions:', sessionData[0].session_date);
      return sessionData[0].session_date;
    },
    enabled: !!bakeryId,
    refetchInterval: false, // Kun websockets
    staleTime: Infinity, // Cache er alltid fersk via websockets
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: (failureCount) => {
      if (failureCount < 3) return true;
      console.warn('Using cached packing date due to fetch failure');
      return false;
    },
  });
};

// Hook to get active packing products without authentication
export const usePublicActivePackingProducts = (bakeryId?: string, date?: string) => {
  return useQuery({
    queryKey: ['public-active-packing-products', bakeryId, date],
    queryFn: async () => {
      if (!bakeryId || !date) return [];

      console.log('Fetching public active packing products for:', { bakeryId, date });

      const { data, error } = await supabase
        .from('active_packing_products')
        .select('*')
        .eq('bakery_id', bakeryId)
        .eq('session_date', date);

      if (error) {
        console.error('Error fetching public active packing products:', error);
        throw error;
      }

      console.log('Found active packing products:', data);
      return data;
    },
    enabled: !!bakeryId && !!date,
    refetchInterval: false, // Kun websockets
    staleTime: 30000, // 30 sekunder - tillater re-fetch ved behov
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: (failureCount) => {
      if (failureCount < 3) return true;
      console.warn('Using cached active products due to fetch failure');
      return false;
    },
  });
};

// Hook to get packing data for a specific customer without authentication
export const usePublicPackingData = (customerId?: string, bakeryId?: string, date?: string) => {
  const targetDate = date || format(new Date(), 'yyyy-MM-dd');
  const { data: activeProducts, isLoading: activeProductsLoading } = usePublicActivePackingProducts(bakeryId, targetDate);

  return useQuery({
    queryKey: ['public-packing-data', customerId, bakeryId, targetDate, activeProducts?.map(ap => ap.product_id).sort().join(',') || 'none'],
    queryFn: async () => {
      if (!customerId || !bakeryId) return [];

      console.log('🔍 Fetching public packing data:', {
        customerId,
        bakeryId,
        targetDate,
        activeProductsCount: activeProducts?.length || 0,
        activeProductDetails: activeProducts?.map(ap => ({
          id: ap.product_id,
          name: ap.product_name
        })) || []
      });

      const { data: orders, error } = await supabase
        .from('public_display_orders')
        .select(`
          id,
          customer_id,
          customer:public_display_customers(id, name),
          order_products:public_display_order_products(
            id,
            product_id,
            quantity,
            packing_status,
            product:public_display_products(id, name, category, unit)
          )
        `)
        .eq('delivery_date', targetDate)
        .eq('customer_id', customerId);

      if (error) {
        console.error('❌ Error fetching public orders:', error);
        throw error;
      }

      console.log('📦 Public orders data:', orders);

      // Create active product IDs set
      const activeProductIds = new Set<string>();
      if (activeProducts && activeProducts.length > 0) {
        activeProducts.forEach(ap => {
          activeProductIds.add(ap.product_id);
        });
      }

      // Create product color map based on active products order
      const productColorMap = new Map<string, number>();
      if (activeProducts && activeProducts.length > 0) {
        activeProducts.forEach((ap, index) => {
          productColorMap.set(ap.product_id, index % 3); // 0, 1, or 2
        });
      }

      // Process orders data (similar to original usePackingData logic)
      const customerMap = new Map<string, PackingCustomer>();

      orders?.forEach(order => {
        if (!order.customer) return;

        const customerId = order.customer.id;
        let customer = customerMap.get(customerId);

        if (!customer) {
          customer = {
            id: customerId,
            name: order.customer.name,
            products: [],
            overall_status: 'ongoing',
            progress_percentage: 0,
            total_line_items: 0,
            packed_line_items: 0,
            total_line_items_all: 0,
            packed_line_items_all: 0,
          };
          customerMap.set(customerId, customer);
        }

        order.order_products?.forEach(op => {
          if (!op.product) return;

          // Count ALL line items
          customer!.total_line_items_all += 1;
          if (op.packing_status === 'packed' || op.packing_status === 'completed') {
            customer!.packed_line_items_all += 1;
          }

          // Only include active products
          const shouldIncludeProduct = activeProductIds.has(op.product_id);
          
          if (!shouldIncludeProduct) return;

          const existingProduct = customer!.products.find(p => p.product_id === op.product_id);
          
          if (existingProduct) {
            existingProduct.total_quantity += op.quantity;
            existingProduct.total_line_items += 1;
            if (op.packing_status === 'packed' || op.packing_status === 'completed') {
              existingProduct.packed_line_items += 1;
            }
          } else {
            const validPackingStatus = (['pending', 'in_progress', 'packed', 'completed'].includes(op.packing_status || '')) 
              ? op.packing_status as 'pending' | 'in_progress' | 'packed' | 'completed'
              : 'pending';

            const newProduct = {
              id: op.id,
              product_id: op.product_id,
              product_name: op.product.name,
              product_category: op.product.category || 'Ingen kategori',
              product_unit: op.product.unit || 'stk',
              total_quantity: op.quantity,
              total_line_items: 1,
              packed_line_items: (op.packing_status === 'packed' || op.packing_status === 'completed') ? 1 : 0,
              packing_status: validPackingStatus,
              colorIndex: productColorMap.get(op.product_id) ?? 0,
            };

            customer!.products.push(newProduct);
          }

          if (shouldIncludeProduct) {
            customer!.total_line_items += 1;
            if (op.packing_status === 'packed' || op.packing_status === 'completed') {
              customer!.packed_line_items += 1;
            }
          }
        });
      });

      // Calculate progress for each customer
      customerMap.forEach(customer => {
        customer.progress_percentage = customer.total_line_items_all > 0 
          ? Math.round((customer.packed_line_items_all / customer.total_line_items_all) * 100) 
          : 0;
        
        customer.overall_status = customer.progress_percentage >= 100 ? 'completed' : 'ongoing';
        
        customer.products.forEach(product => {
          if (product.packed_line_items >= product.total_line_items) {
            product.packing_status = 'completed';
          } else if (product.packed_line_items > 0) {
            product.packing_status = 'in_progress';
          } else {
            product.packing_status = 'pending';
          }
        });
      });

      const result = Array.from(customerMap.values());
      console.log('✅ Public packing data result:', result);
      return result;
    },
    enabled: !!customerId && !!bakeryId && !activeProductsLoading && activeProducts !== undefined,
    refetchInterval: false, // Kun websockets
    staleTime: 30000, // 30 sekunder - tillater re-fetch ved behov
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: (failureCount) => {
      if (failureCount < 3) return true;
      console.warn('Using cached packing data due to fetch failure');
      return false;
    },
  });
};

// Hook to get packing session by date without authentication
export const usePublicPackingSession = (bakeryId?: string, date?: string) => {
  return useQuery({
    queryKey: ['public-packing-session', bakeryId, date],
    queryFn: async () => {
      if (!bakeryId || !date) return null;

      console.log('Fetching public packing session for:', { bakeryId, date });

      const { data, error } = await supabase
        .from('packing_sessions')
        .select('*')
        .eq('bakery_id', bakeryId)
        .eq('session_date', date)
        .maybeSingle();

      if (error) {
        console.error('Error fetching public packing session:', error);
        throw error;
      }

      console.log('Found public packing session:', data);
      return data as PackingSession | null;
    },
    enabled: !!bakeryId && !!date,
    refetchInterval: false, // Kun websockets
    staleTime: Infinity, // Cache er alltid fersk via websockets
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: (failureCount) => {
      if (failureCount < 3) return true;
      console.warn('Using cached packing session due to fetch failure');
      return false;
    },
  });
};
