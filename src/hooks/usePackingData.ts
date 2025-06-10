
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useActivePackingProducts } from './useActivePackingProducts';

export interface PackingProduct {
  id: string;
  product_id: string;
  product_name: string;
  product_category: string;
  product_unit: string;
  total_quantity: number; // Total quantity from active_packing_products
  total_line_items: number;
  packed_line_items: number;
  packing_status: 'pending' | 'in_progress' | 'packed' | 'completed';
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
  const targetDate = date || format(new Date(), 'yyyy-MM-dd');
  const { data: activeProducts } = useActivePackingProducts(activeOnly ? targetDate : undefined);

  return useQuery({
    queryKey: ['packing-data', customerId, targetDate, activeOnly],
    queryFn: async () => {
      console.log('Fetching packing data for date:', targetDate, 'customer:', customerId, 'activeOnly:', activeOnly);
      
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
        query = query.eq('customer_id', customerId);
      }

      const { data: orders, error } = await query;

      if (error) {
        console.error('Error fetching packing data:', error);
        throw error;
      }

      console.log('Raw orders data:', orders);

      // Create a map of active products with their quantities
      const activeProductMap = new Map<string, { quantity: number; name: string }>();
      if (activeProducts) {
        activeProducts.forEach(ap => {
          activeProductMap.set(ap.product_id, {
            quantity: ap.total_quantity,
            name: ap.product_name
          });
        });
      }

      // Group by customer and aggregate products
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

        // Process all order products for total calculations
        order.order_products?.forEach(op => {
          if (!op.product) return;

          // Count ALL line items for correct percentage calculation
          customer!.total_line_items_all += 1;
          if (op.packing_status === 'packed' || op.packing_status === 'completed') {
            customer!.packed_line_items_all += 1;
          }

          // Only process active products for display
          const isActiveProduct = activeProductMap.has(op.product_id);
          if (activeOnly && !isActiveProduct) {
            return;
          }

          const existingProduct = customer!.products.find(p => p.product_id === op.product_id);
          
          if (existingProduct) {
            existingProduct.total_line_items += 1;
            if (op.packing_status === 'packed' || op.packing_status === 'completed') {
              existingProduct.packed_line_items += 1;
            }
          } else {
            // Get total quantity from active products or default to line item count
            const activeProductInfo = activeProductMap.get(op.product_id);
            const totalQuantity = activeProductInfo?.quantity || 1;

            const validPackingStatus = (['pending', 'in_progress', 'packed', 'completed'].includes(op.packing_status || '')) 
              ? op.packing_status as 'pending' | 'in_progress' | 'packed' | 'completed'
              : 'pending';

            customer!.products.push({
              id: op.id,
              product_id: op.product_id,
              product_name: op.product.name,
              product_category: op.product.category || 'Ingen kategori',
              product_unit: op.product.unit || 'stk',
              total_quantity: totalQuantity,
              total_line_items: 1,
              packed_line_items: (op.packing_status === 'packed' || op.packing_status === 'completed') ? 1 : 0,
              packing_status: validPackingStatus,
            });
          }

          // Update customer totals for active products only
          if (isActiveProduct) {
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
      });

      const result = Array.from(customerMap.values());
      console.log('Processed packing data:', result);
      
      return result;
    },
    refetchInterval: 10000, // Refetch every 10 seconds to ensure fresh data
  });
};
