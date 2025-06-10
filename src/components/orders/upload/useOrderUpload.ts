
import { useToast } from '@/hooks/use-toast';
import { useCreateOrder } from '@/hooks/useCreateOrder';
import { parseOrderFile } from '@/utils/fileParser';
import { IdMapping, UploadResults, UploadStatus } from './types';
import { UserProfile } from '@/stores/authStore';

export const useOrderUpload = (
  profile: UserProfile | null,
  uploadStatus: UploadStatus,
  productIdMapping: IdMapping,
  customerIdMapping: IdMapping,
  setUploadStatus: React.Dispatch<React.SetStateAction<UploadStatus>>,
  setUploadResults: React.Dispatch<React.SetStateAction<UploadResults>>
) => {
  const { toast } = useToast();
  const createOrder = useCreateOrder();

  const handleOrderUpload = async (file: File) => {
    if (!profile?.bakery_id) {
      toast({
        title: "Feil",
        description: "Du må tilhøre et bakeri for å laste opp ordrer",
        variant: "destructive",
      });
      return;
    }

    if (uploadStatus.products !== 'success' || uploadStatus.customers !== 'success') {
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
      
      console.log('=== ORDER UPLOAD DEBUG ===');
      console.log('Parsed orders count:', orders.length);
      console.log('Sample parsed order:', orders[0]);
      console.log('Product ID mapping keys:', Object.keys(productIdMapping));
      console.log('Customer ID mapping keys:', Object.keys(customerIdMapping));
      console.log('Customer ID mapping:', customerIdMapping);
      console.log('=== END ORDER UPLOAD DEBUG ===');
      
      const createdOrders = [];
      let failedOrders = 0;
      
      for (const order of orders) {
        console.log(`\n=== Processing order ${order.order_number} ===`);
        console.log(`Looking for customer ID: "${order.customer_id}"`); // Updated field name
        console.log(`Available customer mapping keys:`, Object.keys(customerIdMapping));
        
        const customerUuid = customerIdMapping[order.customer_id]; // Updated field name
        console.log(`Customer mapping result: ${order.customer_id} -> ${customerUuid}`);
        
        if (!customerUuid) {
          console.error(`❌ No mapping found for customer ID: ${order.customer_id}`);
          console.error(`Available mappings:`, customerIdMapping);
          failedOrders++;
          toast({
            title: "Feil ved ordreopprettelse",
            description: `Kunde med ID ${order.customer_id} ikke funnet. Sørg for at kunder er lastet opp først.`,
            variant: "destructive",
          });
          continue;
        }
        
        console.log(`✓ Customer found: ${order.customer_id} -> ${customerUuid}`);
        
        const convertedOrderProducts = [];
        for (const orderProduct of order.order_products) {
          console.log(`Looking for product ID: "${orderProduct.product_original_id}"`);
          const productUuid = productIdMapping[orderProduct.product_original_id];
          console.log(`Product mapping result: ${orderProduct.product_original_id} -> ${productUuid}`);
          
          if (!productUuid) {
            console.error(`❌ No mapping found for product ID: ${orderProduct.product_original_id}`);
            toast({
              title: "Feil ved ordreopprettelse",
              description: `Produkt med ID ${orderProduct.product_original_id} ikke funnet. Sørg for at produkter er lastet opp først.`,
              variant: "destructive",
            });
            continue;
          }
          
          console.log(`✓ Product found: ${orderProduct.product_original_id} -> ${productUuid}`);
          
          convertedOrderProducts.push({
            product_id: productUuid,
            quantity: orderProduct.quantity,
            packing_status: orderProduct.packing_status
          });
        }
        
        if (convertedOrderProducts.length === 0) {
          console.warn(`⚠️ Skipping order ${order.order_number} - no valid products found`);
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
        
        console.log('✓ Creating order:', orderToCreate);
        const createdOrder = await createOrder.mutateAsync(orderToCreate);
        createdOrders.push(createdOrder);
        console.log(`✓ Order ${order.order_number} created successfully`);
      }
      
      setUploadResults(prev => ({ ...prev, orders: createdOrders }));
      setUploadStatus(prev => ({ ...prev, orders: 'success' }));
      
      let description = `${createdOrders.length} ordrer ble importert`;
      if (failedOrders > 0) {
        description += ` (${failedOrders} ordrer feilet)`;
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

  return { handleOrderUpload };
};
