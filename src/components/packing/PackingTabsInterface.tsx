
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import PackingTabHeader from './PackingTabHeader';
import PackingProductCard from './PackingProductCard';
import DeviationDialog from './DeviationDialog';

interface CustomerItem {
  key: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerNumber: string;
  customerId: string;
  quantity: number;
  packingStatus: string;
  orderProductId: string;
}

interface ProductTabData {
  id: string;
  name: string;
  productNumber: string;
  category: string;
  items: CustomerItem[];
}

interface PackingTabsInterfaceProps {
  products: ProductTabData[];
  packedItems: Set<string>;
  deviationItems: Set<string>;
  onItemToggle: (itemKey: string, checked: boolean) => void;
  onItemDeviation: (itemKey: string, hasDeviation: boolean, actualQuantity?: number) => void;
  onMarkAllPacked: (productId: string) => void;
}

const PackingTabsInterface = ({
  products,
  packedItems,
  deviationItems,
  onItemToggle,
  onItemDeviation,
  onMarkAllPacked
}: PackingTabsInterfaceProps) => {
  const [activeTab, setActiveTab] = useState(products[0]?.id || '');
  const [deviationDialog, setDeviationDialog] = useState<{
    isOpen: boolean;
    item?: CustomerItem;
    productName?: string;
  }>({ isOpen: false });
  const { toast } = useToast();

  const getProductProgress = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return { packed: 0, total: 0, percentage: 0 };
    
    const packed = product.items.filter(item => packedItems.has(item.key)).length;
    const total = product.items.length;
    const percentage = total > 0 ? Math.round((packed / total) * 100) : 0;
    
    return { packed, total, percentage };
  };

  const handleDeviationClick = (item: CustomerItem) => {
    const product = products.find(p => p.items.some(i => i.key === item.key));
    setDeviationDialog({
      isOpen: true,
      item,
      productName: product?.name || ''
    });
  };

  const handleDeviationConfirm = (actualQuantity: number) => {
    if (deviationDialog.item) {
      const hasDeviation = actualQuantity !== deviationDialog.item.quantity;
      onItemDeviation(deviationDialog.item.key, hasDeviation, actualQuantity);
      
      // Auto-save feedback
      toast({
        title: "Avvik registrert",
        description: `Avvik for ${deviationDialog.item.customerName} er automatisk lagret`,
      });
    }
    setDeviationDialog({ isOpen: false });
  };

  const handleItemToggle = (itemKey: string, checked: boolean) => {
    onItemToggle(itemKey, checked);
    
    // Auto-save feedback
    const item = products
      .flatMap(p => p.items)
      .find(i => i.key === itemKey);
    
    if (item) {
      toast({
        title: checked ? "Element pakket" : "Pakking fjernet",
        description: `${item.customerName} - automatisk lagret`,
      });
    }
  };

  const handleMarkAllPacked = (productId: string) => {
    onMarkAllPacked(productId);
    
    // Auto-save feedback handled in parent component
  };

  const currentProduct = products.find(p => p.id === activeTab);

  return (
    <div className="space-y-8">
      <PackingTabHeader
        products={products}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        getProductProgress={getProductProgress}
      />

      {currentProduct && (
        <PackingProductCard
          product={currentProduct}
          progress={getProductProgress(currentProduct.id)}
          packedItems={packedItems}
          deviationItems={deviationItems}
          onItemToggle={handleItemToggle}
          onDeviationClick={handleDeviationClick}
          onMarkAllPacked={handleMarkAllPacked}
        />
      )}

      <DeviationDialog
        isOpen={deviationDialog.isOpen}
        onClose={() => setDeviationDialog({ isOpen: false })}
        onConfirm={handleDeviationConfirm}
        customerName={deviationDialog.item?.customerName || ''}
        productName={deviationDialog.productName || ''}
        orderedQuantity={deviationDialog.item?.quantity || 0}
      />
    </div>
  );
};

export default PackingTabsInterface;
