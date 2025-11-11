import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useOrders } from '@/hooks/useOrders';
import { useUpdateOrderProductPackingStatus, useUpdateMultipleOrderProductsPackingStatus } from '@/hooks/useOrderProducts';
import { useClearActivePackingProducts } from '@/hooks/useActivePackingProducts';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import PackingProductHeader from '@/components/packing/PackingProductHeader';
import ProductCategoryBadge from '@/components/packing/ProductCategoryBadge';
import PackingTabsInterface from '@/components/packing/PackingTabsInterface';
import PackingReportDialog from '@/components/packing/PackingReportDialog';
import ProductPackingTable from '@/components/packing/ProductPackingTable';
import DeviationDialog from '@/components/packing/DeviationDialog';

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
  const [showDeviationDialog, setShowDeviationDialog] = useState<{
    isOpen: boolean;
    item?: any;
  }>({ isOpen: false });
  
  const { data: orders } = useOrders(date);
  const updateOrderProductStatus = useUpdateOrderProductPackingStatus();
  const updateMultipleOrderProductsStatus = useUpdateMultipleOrderProductsPackingStatus();
  const clearActivePackingProducts = useClearActivePackingProducts();

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
  }, [orders, isMultiProductMode, selectedProducts, allProductsData, currentProductData]);

  // Reset deviation states when selectedProducts change
  useEffect(() => {
    setDeviationItems(new Set());
    setDeviationQuantities(new Map());
  }, [selectedProducts]);

  const handleItemToggle = async (itemKey: string, checked: boolean) => {
    // Find the item to get its orderProductId
    let targetItem;
    if (isMultiProductMode) {
      for (const product of allProductsData) {
        targetItem = product.items.find(item => item.key === itemKey);
        if (targetItem) break;
      }
    } else {
      targetItem = currentProductData?.items.find(item => item.key === itemKey);
    }

    if (!targetItem) return;

    // Update local state immediately for better UX
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

    // Save to database
    try {
      await updateOrderProductStatus.mutateAsync({
        orderProductId: targetItem.orderProductId,
        packingStatus: checked ? 'packed' : 'pending'
      });

      toast({
        title: checked ? "Element pakket" : "Pakking fjernet",
        description: `${targetItem.customerName} - lagret i database`,
      });
    } catch (error) {
      // Revert local state on error
      setPackedItems(packedItems);
      console.error('Failed to update packing status:', error);
    }
  };

  const handleItemDeviation = (itemKey: string, hasDeviation: boolean, actualQuantity?: number) => {
    if (hasDeviation && actualQuantity === undefined) {
      // Open deviation dialog for single product mode
      if (!isMultiProductMode && currentProductData) {
        const item = currentProductData.items.find(i => i.key === itemKey);
        if (item) {
          setShowDeviationDialog({
            isOpen: true,
            item
          });
          return;
        }
      }
    }

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

  const handleDeviationConfirm = (actualQuantity: number) => {
    if (showDeviationDialog.item) {
      const hasDeviation = actualQuantity !== showDeviationDialog.item.quantity;
      handleItemDeviation(showDeviationDialog.item.key, hasDeviation, actualQuantity);
      
      if (hasDeviation) {
        toast({
          title: "Avvik registrert",
          description: `Avvik for ${showDeviationDialog.item.customerName} er registrert`,
        });
      }
    }
    setShowDeviationDialog({ isOpen: false });
  };

  const handleMarkAllPacked = async (productIdToMark?: string) => {
    let itemsToProcess;
    let productName = '';

    if (isMultiProductMode && productIdToMark) {
      // Multi-product mode: mark all items for specific product
      const product = allProductsData.find(p => p.id === productIdToMark);
      if (!product) return;
      itemsToProcess = product.items;
      productName = product.name;
    } else if (!isMultiProductMode && currentProductData) {
      // Single product mode: mark all items for current product
      itemsToProcess = currentProductData.items;
      productName = currentProductData.productName;
    } else {
      return;
    }

    // Filter out items that already have deviations - don't override them
    const itemsToMark = itemsToProcess.filter(item => !deviationItems.has(item.key));
    
    if (itemsToMark.length === 0) {
      toast({
        title: "Ingen elementer å markere",
        description: "Alle elementer er enten allerede pakket eller har registrerte avvik",
      });
      return;
    }

    // Update local state immediately
    const newPackedItems = new Set(packedItems);
    itemsToMark.forEach(item => {
      newPackedItems.add(item.key);
    });
    setPackedItems(newPackedItems);

    // Save to database
    try {
      const orderProductIds = itemsToMark.map(item => item.orderProductId);
      await updateMultipleOrderProductsStatus.mutateAsync({
        orderProductIds,
        packingStatus: 'packed'
      });

      toast({
        title: "Elementer markert som pakket",
        description: `${itemsToMark.length} elementer for ${productName} er lagret i database`,
      });
    } catch (error) {
      // Revert local state on error
      setPackedItems(packedItems);
      console.error('Failed to update multiple packing statuses:', error);
    }
  };

  const handleNextProduct = () => {
    if (currentIndex < selectedProducts.length - 1) {
      const nextProductId = selectedProducts[currentIndex + 1];
      navigate(`/dashboard/orders/packing/${date}/${nextProductId}`, {
        state: { selectedProducts }
      });
    } else {
      handleFinishPacking();
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
    handleFinishPacking();
  };

  const handleFinishPacking = async () => {
    try {
      if (date) {
        await clearActivePackingProducts.mutateAsync(date);
      }
      navigate(`/dashboard/orders/packing/${date}`);
    } catch (error) {
      console.error('Error finishing packing:', error);
      navigate(`/dashboard/orders/packing/${date}`);
    }
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

  // Render single product interface with new table
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

      <ProductPackingTable
        productName={currentProductData?.productName || ''}
        productNumber={currentProductData?.productNumber || ''}
        items={currentProductData?.items || []}
        packedItems={packedItems}
        deviationItems={deviationItems}
        onItemToggle={handleItemToggle}
        onItemDeviation={handleItemDeviation}
        onMarkAllPacked={() => handleMarkAllPacked()}
      />

      <DeviationDialog
        isOpen={showDeviationDialog.isOpen}
        onClose={() => setShowDeviationDialog({ isOpen: false })}
        onConfirm={handleDeviationConfirm}
        customerName={showDeviationDialog.item?.customerName || ''}
        productName={currentProductData?.productName || ''}
        orderedQuantity={showDeviationDialog.item?.quantity || 0}
      />
    </div>
  );
};

export default PackingProductDetail;
