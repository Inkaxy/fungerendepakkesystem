
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export interface PackingProduct {
  id: string;
  product_id: string;
  product_name: string;
  quantity_ordered: number;
  quantity_packed: number;
  packing_status: 'pending' | 'in_progress' | 'packed' | 'completed';
}

export interface PackingCustomer {
  id: string;
  name: string;
  products: PackingProduct[];
  overall_status: 'ongoing' | 'completed';
  progress_percentage: number;
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
            product:products(id, name)
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
          };
          customerMap.set(customerId, customer);
        }

        // Aggregate products
        order.order_products?.forEach(op => {
          if (!op.product) return;

          const existingProduct = customer!.products.find(p => p.product_id === op.product_id);
          
          if (existingProduct) {
            existingProduct.quantity_ordered += op.quantity;
            // quantity_packed would come from actual packing tracking
            existingProduct.quantity_packed = existingProduct.quantity_packed || 0;
          } else {
            customer!.products.push({
              id: op.id,
              product_id: op.product_id,
              product_name: op.product.name,
              quantity_ordered: op.quantity,
              quantity_packed: 0, // This would be tracked separately
              packing_status: op.packing_status || 'pending',
            });
          }
        });
      });

      // Calculate progress for each customer
      customerMap.forEach(customer => {
        const totalOrdered = customer.products.reduce((sum, p) => sum + p.quantity_ordered, 0);
        const totalPacked = customer.products.reduce((sum, p) => sum + p.quantity_packed, 0);
        
        customer.progress_percentage = totalOrdered > 0 ? Math.round((totalPacked / totalOrdered) * 100) : 0;
        customer.overall_status = customer.progress_percentage >= 100 ? 'completed' : 'ongoing';
        
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
