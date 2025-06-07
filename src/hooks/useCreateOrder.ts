
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateOrderData {
  order_number: string;
  delivery_date: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'packed' | 'delivered' | 'cancelled';
  customer_id: string;
  bakery_id: string;
  order_products: {
    product_id: string;
    quantity: number;
    packing_status: 'pending' | 'in_progress' | 'packed' | 'completed';
  }[];
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (orderData: CreateOrderData) => {
      // First create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderData.order_number,
          delivery_date: orderData.delivery_date,
          status: orderData.status,
          customer_id: orderData.customer_id,
          bakery_id: orderData.bakery_id,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Then create the order products
      const orderProducts = orderData.order_products.map(product => ({
        order_id: order.id,
        product_id: product.product_id,
        quantity: product.quantity,
        packing_status: product.packing_status,
      }));

      const { error: productsError } = await supabase
        .from('order_products')
        .insert(orderProducts);

      if (productsError) throw productsError;

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      console.error('Order creation error:', error);
      throw error;
    },
  });
};
