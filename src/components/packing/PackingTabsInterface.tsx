
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import MultiProductPackingTable from './MultiProductPackingTable';
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
  const [deviationDialog, setDeviationDialog] = useState<{
    isOpen: boolean;
    item?: CustomerItem;
    productName?: string;
  }>({ isOpen: false });
  const { toast } = useToast();

  const handleItemDeviation = (itemKey: string, hasDeviation: boolean, actualQuantity?: number) => {
    if (hasDeviation && actualQuantity === undefined) {
      // Open deviation dialog to get actual quantity
      const item = products.flatMap(p => p.items).find(i => i.key === itemKey);
      const product = products.find(p => p.items.some(i => i.key === itemKey));
      
      if (item) {
        setDeviationDialog({
          isOpen: true,
          item,
          productName: product?.name || ''
        });
      }
    } else {
      // Process the deviation with actual quantity
      onItemDeviation(itemKey, hasDeviation, actualQuantity);
      
      if (hasDeviation) {
        toast({
          title: "Avvik registrert",
          description: "Avvik er registrert for denne varen",
        });
      }
    }
  };

  const handleDeviationConfirm = (actualQuantity: number) => {
    if (deviationDialog.item) {
      const hasDeviation = actualQuantity !== deviationDialog.item.quantity;
      onItemDeviation(deviationDialog.item.key, hasDeviation, actualQuantity);
      
      if (hasDeviation) {
        toast({
          title: "Avvik registrert",
          description: `Avvik for ${deviationDialog.item.customerName} er registrert`,
        });
      }
    }
    setDeviationDialog({ isOpen: false });
  };

  return (
    <div className="space-y-8">
      <MultiProductPackingTable
        products={products}
        packedItems={packedItems}
        deviationItems={deviationItems}
        onItemToggle={onItemToggle}
        onItemDeviation={handleItemDeviation}
        onMarkAllPacked={onMarkAllPacked}
      />

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
