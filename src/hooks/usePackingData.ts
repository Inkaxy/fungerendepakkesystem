
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export interface PackingProduct {
  id: string;
  product_id: string;
  product_name: string;
  product_category: string;
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
}

export const usePackingData = (customerId?: string, date?: string) => {
  return useQuery({
    queryKey: ['packing-data', customerId, date],
    queryFn: async () => {
      const targetDate = date || format(new Date(), 'yyyy-MM-dd');
      
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
            product:products(id, name, category)
          )
        `)
        .eq('delivery_date', targetDate)
        .in('status', ['pending', 'in_progress', 'packed']);

      if (customerId) {
        query = query.eq('customer_id', customerId);
      }

      const { data: orders, error } = await query;

      if (error) throw error;

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
          };
          customerMap.set(customerId, customer);
        }

        // Count line items (order_products) not products themselves
        order.order_products?.forEach(op => {
          if (!op.product) return;

          const existingProduct = customer!.products.find(p => p.product_id === op.product_id);
          
          if (existingProduct) {
            existingProduct.total_line_items += 1;
            if (op.packing_status === 'packed' || op.packing_status === 'completed') {
              existingProduct.packed_line_items += 1;
            }
          } else {
            // Ensure packing_status is a valid enum value
            const validPackingStatus = (['pending', 'in_progress', 'packed', 'completed'].includes(op.packing_status || '')) 
              ? op.packing_status as 'pending' | 'in_progress' | 'packed' | 'completed'
              : 'pending';

            customer!.products.push({
              id: op.id,
              product_id: op.product_id,
              product_name: op.product.name,
              product_category: op.product.category || 'Ingen kategori',
              total_line_items: 1,
              packed_line_items: (op.packing_status === 'packed' || op.packing_status === 'completed') ? 1 : 0,
              packing_status: validPackingStatus,
            });
          }

          // Update customer totals
          customer!.total_line_items += 1;
          if (op.packing_status === 'packed' || op.packing_status === 'completed') {
            customer!.packed_line_items += 1;
          }
        });
      });

      // Calculate progress for each customer
      customerMap.forEach(customer => {
        customer.progress_percentage = customer.total_line_items > 0 
          ? Math.round((customer.packed_line_items / customer.total_line_items) * 100) 
          : 0;
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

        // Limit to 3 products for display, prioritize unpacked items
        customer.products = customer.products
          .sort((a, b) => {
            if (a.packing_status === 'completed' && b.packing_status !== 'completed') return 1;
            if (b.packing_status === 'completed' && a.packing_status !== 'completed') return -1;
            return 0;
          })
          .slice(0, 3);
      });

      return Array.from(customerMap.values());
    },
  });
};
