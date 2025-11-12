
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useActivePackingProducts } from './useActivePackingProducts';
import { useAuthStore } from '@/stores/authStore';

export interface PackingProduct {
  id: string;
  product_id: string;
  product_name: string;
  product_category: string;
  product_unit: string;
  total_quantity: number; // Customer-specific quantity sum, not from active_packing_products
  total_line_items: number;
  packed_line_items: number;
  packing_status: 'pending' | 'in_progress' | 'packed' | 'completed';
  colorIndex?: number;
}

export interface PackingCustomer {
  id: string;
  name: string;
  products: PackingProduct[];
  overall_status: 'ongoing' | 'completed';
  progress_percentage: number;
  total_line_items: number;
  packed_line_items: number;
  total_line_items_all: number; // Total including non-active products
  packed_line_items_all: number; // Packed including non-active products
}

export const usePackingData = (customerId?: string, date?: string, activeOnly: boolean = false) => {
  const { profile } = useAuthStore();
  const targetDate = date || format(new Date(), 'yyyy-MM-dd');
  const { data: activeProducts, isLoading: activeProductsLoading } = useActivePackingProducts(activeOnly ? targetDate : undefined);

  return useQuery({
    queryKey: ['packing-data', profile?.bakery_id, customerId, targetDate, activeOnly, activeProducts?.map(ap => ap.product_id).sort().join(',') || 'none'],
    queryFn: async () => {
      console.log('🔍 Starting packing data fetch:', {
        customerId,
        targetDate,
        activeOnly,
        activeProductsCount: activeProducts?.length || 0
      });
      
      let query = supabase
        .from('orders')
        .select(`
          id,
          customer_id,
          customer:customers(id, name),
          order_products(
            id,
            product_id,
            quantity,
            packing_status,
            product:products(id, name, category, unit)
          )
        `)
        .eq('delivery_date', targetDate)
        .in('status', ['pending', 'in_progress', 'packed']);

      if (customerId) {
        console.log('🎯 Filtering by customer ID:', customerId);
        query = query.eq('customer_id', customerId);
      }

      const { data: orders, error } = await query;

      if (error) {
        console.error('❌ Error fetching orders:', error);
        throw error;
      }

      console.log('📦 Raw orders data:', {
        ordersCount: orders?.length || 0,
        orders: orders?.map(o => ({
          id: o.id,
          customer: o.customer?.name,
          productsCount: o.order_products?.length || 0
        }))
      });

      // Create a set of active product IDs for filtering
      const activeProductIds = new Set<string>();
      
      // Always populate active product IDs if we have them, regardless of activeOnly flag
      if (activeProducts && activeProducts.length > 0) {
        activeProducts.forEach(ap => {
          activeProductIds.add(ap.product_id);
        });
        console.log('🎨 Active product IDs:', Array.from(activeProductIds));
      }

      // Create product color map based on active products order
      const productColorMap = new Map<string, number>();
      if (activeProducts && activeProducts.length > 0) {
        activeProducts.forEach((ap, index) => {
          productColorMap.set(ap.product_id, index % 3); // 0, 1, or 2
        });
      }

      // Group by customer and aggregate products
      const customerMap = new Map<string, PackingCustomer>();

      orders?.forEach(order => {
        if (!order.customer) {
          console.warn('⚠️ Order missing customer:', order.id);
          return;
        }

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
          console.log('👤 Created new customer entry:', customer.name);
        }

        // Process all order products for total calculations
        order.order_products?.forEach(op => {
          if (!op.product) {
            console.warn('⚠️ Order product missing product info:', op.id);
            return;
          }

          // Count ALL line items for correct percentage calculation
          customer!.total_line_items_all += 1;
          if (op.packing_status === 'packed' || op.packing_status === 'completed') {
            customer!.packed_line_items_all += 1;
          }

          // Check if this product is active (if we have active products, only show those)
          const shouldIncludeProduct = !activeOnly || activeProductIds.has(op.product_id);
          
          console.log('📋 Processing product:', {
            productName: op.product.name,
            productId: op.product_id,
            shouldIncludeProduct,
            activeOnly,
            hasActiveProducts: activeProductIds.size > 0,
            packingStatus: op.packing_status
          });

          if (!shouldIncludeProduct) {
            console.log('⏭️ Skipping non-active product:', op.product.name);
            return;
          }

          const existingProduct = customer!.products.find(p => p.product_id === op.product_id);
          
          if (existingProduct) {
            // Sum up the customer's actual quantity for this product
            existingProduct.total_quantity += op.quantity;
            existingProduct.total_line_items += 1;
            if (op.packing_status === 'packed' || op.packing_status === 'completed') {
              existingProduct.packed_line_items += 1;
            }
            console.log('➕ Updated existing product:', {
              productName: existingProduct.product_name,
              totalQuantity: existingProduct.total_quantity,
              lineItems: `${existingProduct.packed_line_items}/${existingProduct.total_line_items}`
            });
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
              total_quantity: op.quantity, // Start with this order's quantity
              total_line_items: 1,
              packed_line_items: (op.packing_status === 'packed' || op.packing_status === 'completed') ? 1 : 0,
              packing_status: validPackingStatus,
              colorIndex: productColorMap.get(op.product_id) ?? 0,
            };

            customer!.products.push(newProduct);
            console.log('🆕 Added new product:', {
              productName: newProduct.product_name,
              quantity: newProduct.total_quantity,
              status: newProduct.packing_status
            });
          }

          // Update customer totals for displayed products only
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
        // Use ALL line items for percentage calculation (not just active)
        customer.progress_percentage = customer.total_line_items_all > 0 
          ? Math.round((customer.packed_line_items_all / customer.total_line_items_all) * 100) 
          : 0;
        
        // Customer is completed only when ALL line items are packed
        customer.overall_status = customer.progress_percentage >= 100 ? 'completed' : 'ongoing';
        
        // Update product packing status based on line items
        customer.products.forEach(product => {
          if (product.packed_line_items >= product.total_line_items) {
            product.packing_status = 'completed';
          } else if (product.packed_line_items > 0) {
            product.packing_status = 'in_progress';
          } else {
            product.packing_status = 'pending';
          }
        });

        // When activeOnly is false, limit to 3 products prioritizing unpacked items
        if (!activeOnly) {
          customer.products = customer.products
            .sort((a, b) => {
              if (a.packing_status === 'completed' && b.packing_status !== 'completed') return 1;
              if (b.packing_status === 'completed' && a.packing_status !== 'completed') return -1;
              return 0;
            })
            .slice(0, 3);
        }

        console.log('📊 Customer summary:', {
          name: customer.name,
          productsCount: customer.products.length,
          progress: `${customer.progress_percentage}%`,
          status: customer.overall_status
        });
      });

      const result = Array.from(customerMap.values());
      console.log('✅ Final packing data result:', {
        customersCount: result.length,
        totalActiveProducts: result.reduce((sum, c) => sum + c.products.length, 0)
      });
      
      return result;
    },
    enabled: !activeOnly || !activeProductsLoading,
    refetchInterval: false, // Kun websockets
    staleTime: Infinity, // Cache er alltid fersk via websockets
  });
};
