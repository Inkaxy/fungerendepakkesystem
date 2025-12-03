import { parseOrderFile } from '@/utils/fileParser';
import { IdMapping, UploadResults, UploadStatus } from './types';
import { UserProfile } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';

export const createOrderUploadHandler = (
  profile: UserProfile | null,
  toast: any,
  createOrder: any,
  setUploadStatus: React.Dispatch<React.SetStateAction<UploadStatus>>,
  setUploadResults: React.Dispatch<React.SetStateAction<UploadResults>>
) => {
  // Take mappings as direct parameters to avoid stale closure
  return async (file: File, productIdMapping: IdMapping, customerIdMapping: IdMapping): Promise<void> => {
    if (!profile?.bakery_id) {
      toast({
        title: "Feil",
        description: "Du må tilhøre et bakeri for å laste opp ordrer",
        variant: "destructive",
      });
      return;
    }

    // Check ID mappings directly
    if (Object.keys(productIdMapping).length === 0 || Object.keys(customerIdMapping).length === 0) {
      toast({
        title: "Mangler forutsetninger",
        description: "Du må laste opp produkter og kunder først",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadStatus(prev => ({ ...prev, orders: 'uploading' }));
      
      const text = await file.text();
      const orders = parseOrderFile(text, profile.bakery_id);
      
      console.log('Parsed orders count:', orders.length);
      console.log('Product ID mapping keys:', Object.keys(productIdMapping));
      console.log('Customer ID mapping keys:', Object.keys(customerIdMapping));
      
      const createdOrders = [];
      let failedOrders = 0;
      let skippedDuplicates = 0;
      
      for (const order of orders) {
        const customerUuid = customerIdMapping[order.customer_id];
        
        if (!customerUuid) {
          console.error(`No mapping found for customer ID: ${order.customer_id}`);
          failedOrders++;
          continue;
        }
        
        // Duplicate check
        const { data: existingOrders } = await supabase
          .from('orders')
          .select('id, order_number')
          .eq('bakery_id', profile.bakery_id)
          .eq('customer_id', customerUuid)
          .eq('delivery_date', order.delivery_date);
        
        if (existingOrders && existingOrders.length > 0) {
          skippedDuplicates++;
          continue;
        }
        
        const convertedOrderProducts = [];
        for (const orderProduct of order.order_products) {
          const productUuid = productIdMapping[orderProduct.product_original_id];
          
          if (!productUuid) {
            console.error(`No mapping found for product ID: ${orderProduct.product_original_id}`);
            continue;
          }
          
          convertedOrderProducts.push({
            product_id: productUuid,
            quantity: orderProduct.quantity,
            packing_status: orderProduct.packing_status
          });
        }
        
        if (convertedOrderProducts.length === 0) {
          failedOrders++;
          continue;
        }
        
        const orderToCreate = {
          order_number: order.order_number,
          delivery_date: order.delivery_date,
          status: order.status,
          customer_id: customerUuid,
          bakery_id: order.bakery_id,
          order_products: convertedOrderProducts
        };
        
        const createdOrder = await createOrder.mutateAsync(orderToCreate);
        createdOrders.push(createdOrder);
      }
      
      setUploadResults(prev => ({ ...prev, orders: createdOrders }));
      setUploadStatus(prev => ({ ...prev, orders: 'success' }));
      
      let description = `${createdOrders.length} ordrer ble importert`;
      if (skippedDuplicates > 0) {
        description += `, ${skippedDuplicates} duplikater hoppet over`;
      }
      if (failedOrders > 0) {
        description += `, ${failedOrders} ordrer feilet`;
      }
      
      toast({
        title: "Ordrer lastet opp",
        description,
      });
    } catch (error) {
      console.error('Order upload error:', error);
      setUploadStatus(prev => ({ ...prev, orders: 'error' }));
      toast({
        title: "Feil ved opplasting",
        description: `Kunne ikke laste opp ordrer: ${error.message}`,
        variant: "destructive",
      });
    }
  };
};
