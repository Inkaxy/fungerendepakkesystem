
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import PackingProductHeader from '@/components/packing/PackingProductHeader';
import CustomerPackingTable from '@/components/packing/CustomerPackingTable';
import ProductCategoryBadge from '@/components/packing/ProductCategoryBadge';
import PackingTabsInterface from '@/components/packing/PackingTabsInterface';
import PackingReportDialog from '@/components/packing/PackingReportDialog';

const PackingProductDetail = () => {
  const { date, productId } = useParams<{ date: string; productId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const selectedProducts = location.state?.selectedProducts || [productId];
  const currentIndex = selectedProducts.indexOf(productId);
  const isMultiProductMode = selectedProducts.length > 1;
  
  const [packedItems, setPackedItems] = useState<Set<string>>(new Set());
  const [deviationItems, setDeviationItems] = useState<Set<string>>(new Set());
  const [deviationQuantities, setDeviationQuantities] = useState<Map<string, number>>(new Map());
  const [showReport, setShowReport] = useState(false);
  
  const { data: orders } = useOrders(date);
  const updateOrderStatus = useUpdateOrderStatus();

  // Prepare data for all selected products when in multi-product mode - using useMemo
  const allProductsData = useMemo(() => {
    if (!isMultiProductMode || !orders) return [];
    
    return selectedProducts.map(prodId => {
      const productData = orders.reduce((acc, order) => {
        order.order_products?.forEach(item => {
          if (item.product_id === prodId) {
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
            if (!acc.productCategory && item.product?.category) {
              acc.productCategory = item.product.category;
            }
          }
        });
        return acc;
      }, { items: [] as any[], productName: '', productNumber: '', productCategory: '' });

      return {
        id: prodId,
        name: productData?.productName || '',
        productNumber: productData?.productNumber || '',
        category: productData?.productCategory || 'Ingen kategori',
        items: productData?.items || []
      };
    });
  }, [isMultiProductMode, orders, selectedProducts]);

  // Find current product data for single product mode - using useMemo
  const currentProductData = useMemo(() => {
    if (!orders || isMultiProductMode) return null;
    
    return orders.reduce((acc, order) => {
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
          if (!acc.productCategory && item.product?.category) {
            acc.productCategory = item.product.category;
          }
        }
      });
      return acc;
    }, { items: [] as any[], productName: '', productNumber: '', productCategory: '' });
  }, [orders, productId, isMultiProductMode]);

  // Initialize packed items from database - with proper dependencies
  useEffect(() => {
    if (!orders) return;
    
    if (isMultiProductMode && allProductsData.length > 0) {
      const alreadyPacked = new Set<string>();
      allProductsData.forEach(product => {
        product.items.forEach(item => {
          if (item.packingStatus === 'packed' || item.packingStatus === 'completed') {
            alreadyPacked.add(item.key);
          }
        });
      });
      setPackedItems(alreadyPacked);
    } else if (!isMultiProductMode && currentProductData?.items) {
      const alreadyPacked = new Set(
        currentProductData.items
          .filter(item => item.packingStatus === 'packed' || item.packingStatus === 'completed')
          .map(item => item.key)
      );
      setPackedItems(alreadyPacked);
    }
  }, [orders, isMultiProductMode]); // Only depend on orders and isMultiProductMode

  const handleItemToggle = (itemKey: string, checked: boolean) => {
    const newPackedItems = new Set(packedItems);
    if (checked) {
      newPackedItems.add(itemKey);
      // Remove from deviation if it was marked as such
      const newDeviationItems = new Set(deviationItems);
      newDeviationItems.delete(itemKey);
      setDeviationItems(newDeviationItems);
      
      // Remove deviation quantity
      const newDeviationQuantities = new Map(deviationQuantities);
      newDeviationQuantities.delete(itemKey);
      setDeviationQuantities(newDeviationQuantities);
    } else {
      newPackedItems.delete(itemKey);
    }
    setPackedItems(newPackedItems);
  };

  const handleItemDeviation = (itemKey: string, hasDeviation: boolean, actualQuantity?: number) => {
    const newDeviationItems = new Set(deviationItems);
    const newDeviationQuantities = new Map(deviationQuantities);
    
    if (hasDeviation && actualQuantity !== undefined) {
      newDeviationItems.add(itemKey);
      newDeviationQuantities.set(itemKey, actualQuantity);
      
      // Remove from packed if it was marked as such
      const newPackedItems = new Set(packedItems);
      newPackedItems.delete(itemKey);
      setPackedItems(newPackedItems);
    } else {
      newDeviationItems.delete(itemKey);
      newDeviationQuantities.delete(itemKey);
    }
    
    setDeviationItems(newDeviationItems);
    setDeviationQuantities(newDeviationQuantities);
  };

  const handleMarkAllPacked = (productIdToMark: string) => {
    const product = allProductsData.find(p => p.id === productIdToMark);
    if (!product) return;

    const newPackedItems = new Set(packedItems);
    const newDeviationItems = new Set(deviationItems);
    const newDeviationQuantities = new Map(deviationQuantities);
    
    product.items.forEach(item => {
      newPackedItems.add(item.key);
      newDeviationItems.delete(item.key); // Remove any deviations
      newDeviationQuantities.delete(item.key); // Remove deviation quantities
    });
    
    setPackedItems(newPackedItems);
    setDeviationItems(newDeviationItems);
    setDeviationQuantities(newDeviationQuantities);
    
    toast({
      title: "Alle elementer markert som pakket",
      description: `${product.items.length} elementer for ${product.name} er automatisk lagret`,
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

  if (!date || !productId) {
    return <div>Ugyldig dato eller produkt</div>;
  }

  // Render multi-product tabbed interface
  if (isMultiProductMode) {
    return (
      <div className="space-y-6">
        <PackingProductHeader
          productName={`${selectedProducts.length} produkter`}
          productNumber=""
          date={date}
          currentIndex={0}
          totalProducts={selectedProducts.length}
          onBack={handleBack}
          onPrevious={() => {}}
          onNext={() => {}}
          canGoBack={false}
          isLastProduct={true}
        />

        <PackingTabsInterface
          products={allProductsData}
          packedItems={packedItems}
          deviationItems={deviationItems}
          onItemToggle={handleItemToggle}
          onItemDeviation={handleItemDeviation}
          onMarkAllPacked={handleMarkAllPacked}
        />
      </div>
    );
  }

  // Render single product interface (existing functionality)
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

      {currentProductData?.productCategory && (
        <div className="flex justify-center">
          <ProductCategoryBadge 
            category={currentProductData.productCategory} 
            className="text-sm"
          />
        </div>
      )}

      <CustomerPackingTable
        items={currentProductData?.items || []}
        packedItems={packedItems}
        onItemToggle={handleItemToggle}
      />
    </div>
  );
};

export default PackingProductDetail;
