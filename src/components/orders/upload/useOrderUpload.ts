
import { useToast } from '@/hooks/use-toast';
import { useCreateOrder } from '@/hooks/useCreateOrder';
import { parseOrderFile } from '@/utils/fileParser';
import { IdMapping, UploadResults, UploadStatus } from './types';
import { Profile } from '@/types/profile';

export const useOrderUpload = (
  profile: Profile | null,
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
      
      console.log('Parsed orders:', orders);
      console.log('Product ID mapping:', productIdMapping);
      console.log('Customer ID mapping:', customerIdMapping);
      
      const createdOrders = [];
      
      for (const order of orders) {
        const customerUuid = customerIdMapping[order.customer_original_id];
        if (!customerUuid) {
          console.error(`No mapping found for customer ID: ${order.customer_original_id}`);
          toast({
            title: "Feil ved ordreopprettelse",
            description: `Kunde med ID ${order.customer_original_id} ikke funnet. Sørg for at kunder er lastet opp først.`,
            variant: "destructive",
          });
          continue;
        }
        
        const convertedOrderProducts = [];
        for (const orderProduct of order.order_products) {
          const productUuid = productIdMapping[orderProduct.product_original_id];
          if (!productUuid) {
            console.error(`No mapping found for product ID: ${orderProduct.product_original_id}`);
            toast({
              title: "Feil ved ordreopprettelse",
              description: `Produkt med ID ${orderProduct.product_original_id} ikke funnet. Sørg for at produkter er lastet opp først.`,
              variant: "destructive",
            });
            continue;
          }
          
          convertedOrderProducts.push({
            product_id: productUuid,
            quantity: orderProduct.quantity,
            packing_status: orderProduct.packing_status
          });
        }
        
        if (convertedOrderProducts.length === 0) {
          console.warn(`Skipping order ${order.order_number} - no valid products found`);
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
        
        console.log('Creating order:', orderToCreate);
        const createdOrder = await createOrder.mutateAsync(orderToCreate);
        createdOrders.push(createdOrder);
      }
      
      setUploadResults(prev => ({ ...prev, orders: createdOrders }));
      setUploadStatus(prev => ({ ...prev, orders: 'success' }));
      
      toast({
        title: "Ordrer lastet opp",
        description: `${createdOrders.length} ordrer ble importert`,
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
