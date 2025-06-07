
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import PackingProductHeader from '@/components/packing/PackingProductHeader';
import PackingProgressCard from '@/components/packing/PackingProgressCard';
import CustomerPackingTable from '@/components/packing/CustomerPackingTable';

const PackingProductDetail = () => {
  const { date, productId } = useParams<{ date: string; productId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const selectedProducts = location.state?.selectedProducts || [productId];
  const currentIndex = selectedProducts.indexOf(productId);
  
  const [packedItems, setPackedItems] = useState<Set<string>>(new Set());
  
  const { data: orders } = useOrders(date);
  const updateOrderStatus = useUpdateOrderStatus();

  // Find current product data
  const currentProductData = orders?.reduce((acc, order) => {
    order.order_products?.forEach(item => {
      if (item.product_id === productId) {
        const key = `${order.id}-${item.id}`;
        acc.items.push({
          key,
          orderId: order.id,
          orderNumber: order.order_number,
          customerName: order.customer?.name || 'Ukjent kunde',
          customerNumber: order.customer?.customer_number || '',
          customerId: order.customer_id,
          quantity: item.quantity,
          packingStatus: item.packing_status,
          orderProductId: item.id
        });
        
        if (!acc.productName && item.product?.name) {
          acc.productName = item.product.name;
        }
        if (!acc.productNumber && item.product?.product_number) {
          acc.productNumber = item.product.product_number;
        }
      }
    });
    return acc;
  }, { items: [] as any[], productName: '', productNumber: '' });

  // Initialize packed items from database
  useEffect(() => {
    if (currentProductData?.items) {
      const alreadyPacked = new Set(
        currentProductData.items
          .filter(item => item.packingStatus === 'packed' || item.packingStatus === 'completed')
          .map(item => item.key)
      );
      setPackedItems(alreadyPacked);
    }
  }, [currentProductData]);

  const handleItemToggle = (itemKey: string, checked: boolean) => {
    const newPackedItems = new Set(packedItems);
    if (checked) {
      newPackedItems.add(itemKey);
    } else {
      newPackedItems.delete(itemKey);
    }
    setPackedItems(newPackedItems);
  };

  const handleSaveProgress = async () => {
    toast({
      title: "Fremgang lagret",
      description: `${packedItems.size} elementer markert som pakket`,
    });
  };

  const handleNextProduct = () => {
    if (currentIndex < selectedProducts.length - 1) {
      const nextProductId = selectedProducts[currentIndex + 1];
      navigate(`/dashboard/orders/packing/${date}/${nextProductId}`, {
        state: { selectedProducts }
      });
    } else {
      navigate(`/dashboard/orders/packing/${date}`);
    }
  };

  const handlePreviousProduct = () => {
    if (currentIndex > 0) {
      const prevProductId = selectedProducts[currentIndex - 1];
      navigate(`/dashboard/orders/packing/${date}/${prevProductId}`, {
        state: { selectedProducts }
      });
    }
  };

  const handleBack = () => {
    navigate(`/dashboard/orders/packing/${date}`);
  };

  const totalItems = currentProductData?.items.length || 0;
  const packedCount = packedItems.size;

  if (!date || !productId) {
    return <div>Ugyldig dato eller produkt</div>;
  }

  return (
    <div className="space-y-6">
      <PackingProductHeader
        productName={currentProductData?.productName || ''}
        productNumber={currentProductData?.productNumber || ''}
        date={date}
        currentIndex={currentIndex}
        totalProducts={selectedProducts.length}
        onBack={handleBack}
        onPrevious={handlePreviousProduct}
        onNext={handleNextProduct}
        canGoBack={currentIndex > 0}
        isLastProduct={currentIndex >= selectedProducts.length - 1}
      />

      <PackingProgressCard
        packedCount={packedCount}
        totalItems={totalItems}
        onSaveProgress={handleSaveProgress}
      />

      <CustomerPackingTable
        items={currentProductData?.items || []}
        packedItems={packedItems}
        onItemToggle={handleItemToggle}
      />
    </div>
  );
};

export default PackingProductDetail;
