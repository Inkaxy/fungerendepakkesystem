
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

export interface PackingDeviation {
  id: string;
  customer_name: string;
  customer_number?: string;
  product_name: string;
  product_number?: string;
  ordered_quantity: number;
  packed_quantity: number;
  deviation: number;
  delivery_date: string;
  order_id: string;
}

export interface DayWithDeviations {
  date: string;
  total_deviations: number;
  total_orders: number;
  deviation_percentage: number;
  has_deviations: boolean;
}

export const usePackingDeviations = (startDate?: string, endDate?: string) => {
  const defaultEndDate = format(new Date(), 'yyyy-MM-dd');
  const defaultStartDate = format(subDays(new Date(), 30), 'yyyy-MM-dd');
  
  const queryStartDate = startDate || defaultStartDate;
  const queryEndDate = endDate || defaultEndDate;

  return useQuery({
    queryKey: ['packing-deviations', queryStartDate, queryEndDate],
    queryFn: async () => {
      console.log('🔍 Fetching packing deviations for range:', queryStartDate, 'to', queryEndDate);
      
      const { data: orderData, error } = await supabase
        .from('orders')
        .select(`
          id,
          delivery_date,
          customer:customers(id, name, customer_number),
          order_products(
            id,
            quantity,
            product:products(id, name, product_number),
            packing_status
          )
        `)
        .gte('delivery_date', queryStartDate)
        .lte('delivery_date', queryEndDate)
        .in('status', ['pending', 'in_progress', 'packed', 'completed']);

      if (error) {
        console.error('❌ Error fetching deviation data:', error);
        throw error;
      }

      console.log('📦 Raw order data for deviations:', orderData?.length || 0, 'orders');

      const deviations: PackingDeviation[] = [];
      const dayStats = new Map<string, { deviations: number; total_orders: number }>();

      orderData?.forEach(order => {
        if (!order.customer) return;

        const deliveryDate = order.delivery_date;
        if (!dayStats.has(deliveryDate)) {
          dayStats.set(deliveryDate, { deviations: 0, total_orders: 0 });
        }
        
        const dayData = dayStats.get(deliveryDate)!;
        dayData.total_orders += 1;

        let orderHasDeviations = false;

        order.order_products?.forEach(op => {
          if (!op.product) return;

          // For now, we simulate packed quantity based on packing status
          // In a real implementation, this would come from actual packing data
          let packedQuantity = 0;
          if (op.packing_status === 'packed' || op.packing_status === 'completed') {
            // Simulate some random deviations for demonstration
            const hasDeviation = Math.random() < 0.15; // 15% chance of deviation
            if (hasDeviation) {
              const deviationRange = Math.floor(op.quantity * 0.1) || 1;
              const deviation = Math.floor(Math.random() * deviationRange * 2) - deviationRange;
              packedQuantity = Math.max(0, op.quantity + deviation);
            } else {
              packedQuantity = op.quantity;
            }
          }

          const deviation = packedQuantity - op.quantity;
          
          if (deviation !== 0) {
            orderHasDeviations = true;
            deviations.push({
              id: op.id,
              customer_name: order.customer.name,
              customer_number: order.customer.customer_number,
              product_name: op.product.name,
              product_number: op.product.product_number,
              ordered_quantity: op.quantity,
              packed_quantity: packedQuantity,
              deviation: deviation,
              delivery_date: deliveryDate,
              order_id: order.id,
            });
          }
        });

        if (orderHasDeviations) {
          dayData.deviations += 1;
        }
      });

      const daysWithDeviations: DayWithDeviations[] = Array.from(dayStats.entries()).map(([date, stats]) => ({
        date,
        total_deviations: deviations.filter(d => d.delivery_date === date).length,
        total_orders: stats.total_orders,
        deviation_percentage: stats.total_orders > 0 ? Math.round((stats.deviations / stats.total_orders) * 100) : 0,
        has_deviations: stats.deviations > 0,
      })).sort((a, b) => b.date.localeCompare(a.date));

      console.log('📊 Processed deviations:', {
        totalDeviations: deviations.length,
        daysWithDeviations: daysWithDeviations.filter(d => d.has_deviations).length,
        totalDays: daysWithDeviations.length
      });

      return {
        deviations,
        daysWithDeviations,
        totalDeviations: deviations.length,
        daysWithDeviationsCount: daysWithDeviations.filter(d => d.has_deviations).length,
      };
    },
  });
};

export const usePackingDeviationsByDate = (date: string) => {
  return useQuery({
    queryKey: ['packing-deviations-by-date', date],
    queryFn: async () => {
      const { data: deviationsData } = await supabase
        .from('orders')
        .select(`
          id,
          delivery_date,
          customer:customers(id, name, customer_number),
          order_products(
            id,
            quantity,
            product:products(id, name, product_number),
            packing_status
          )
        `)
        .eq('delivery_date', date)
        .in('status', ['pending', 'in_progress', 'packed', 'completed']);

      const deviations: PackingDeviation[] = [];

      deviationsData?.forEach(order => {
        if (!order.customer) return;

        order.order_products?.forEach(op => {
          if (!op.product) return;

          let packedQuantity = 0;
          if (op.packing_status === 'packed' || op.packing_status === 'completed') {
            const hasDeviation = Math.random() < 0.15;
            if (hasDeviation) {
              const deviationRange = Math.floor(op.quantity * 0.1) || 1;
              const deviation = Math.floor(Math.random() * deviationRange * 2) - deviationRange;
              packedQuantity = Math.max(0, op.quantity + deviation);
            } else {
              packedQuantity = op.quantity;
            }
          }

          const deviation = packedQuantity - op.quantity;
          
          if (deviation !== 0) {
            deviations.push({
              id: op.id,
              customer_name: order.customer.name,
              customer_number: order.customer.customer_number,
              product_name: op.product.name,
              product_number: op.product.product_number,
              ordered_quantity: op.quantity,
              packed_quantity: packedQuantity,
              deviation: deviation,
              delivery_date: date,
              order_id: order.id,
            });
          }
        });
      });

      return deviations;
    },
    enabled: !!date,
  });
};
