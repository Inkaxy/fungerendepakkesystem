
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Package, Check, AlertTriangle, Clock, Users } from 'lucide-react';
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

  const getProductProgress = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return { packed: 0, total: 0, percentage: 0 };
    
    const packed = product.items.filter(item => packedItems.has(item.key)).length;
    const total = product.items.length;
    const percentage = total > 0 ? Math.round((packed / total) * 100) : 0;
    
    return { packed, total, percentage };
  };

  const handleDeviationClick = (item: CustomerItem, productName: string) => {
    setDeviationDialog({
      isOpen: true,
      item,
      productName
    });
  };

  const handleDeviationConfirm = (actualQuantity: number) => {
    if (deviationDialog.item) {
      const hasDeviation = actualQuantity !== deviationDialog.item.quantity;
      onItemDeviation(deviationDialog.item.key, hasDeviation, actualQuantity);
    }
    setDeviationDialog({ isOpen: false });
  };

  return (
    <div className="space-y-6">
      {/* Product Tabs Header */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {products.map((product) => {
            const progress = getProductProgress(product.id);
            return (
              <button
                key={product.id}
                onClick={() => setActiveTab(product.id)}
                className={`px-4 py-3 rounded-md text-sm font-medium transition-colors relative ${
                  activeTab === product.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="text-center">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-xs mt-1 opacity-75">
                    {progress.packed}/{progress.total}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Product Content */}
      {products.map((product) => {
        if (product.id !== activeTab) return null;
        
        const progress = getProductProgress(product.id);
        
        return (
          <Card key={product.id}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    {product.productNumber && (
                      <p className="text-sm text-muted-foreground">#{product.productNumber}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {product.category}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {progress.packed}/{progress.total}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {progress.percentage}% ferdig
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => onMarkAllPacked(product.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Merk alle som pakket ({product.items.length})
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                {product.items.map((item) => {
                  const isPacked = packedItems.has(item.key);
                  const hasDeviation = deviationItems.has(item.key);
                  
                  return (
                    <div
                      key={item.key}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        isPacked 
                          ? 'bg-green-50 border-green-200' 
                          : hasDeviation 
                          ? 'bg-orange-50 border-orange-200' 
                          : 'bg-background border-border hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{item.customerName}</span>
                            {item.customerNumber && (
                              <Badge variant="outline" className="text-xs">
                                #{item.customerNumber}
                              </Badge>
                            )}
                          </div>
                          <div className="mt-1">
                            <span className="text-xs text-muted-foreground">
                              Antall: {item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground mr-2">Venter</span>
                        
                        <Button
                          size="sm"
                          variant={isPacked ? "default" : "outline"}
                          onClick={() => onItemToggle(item.key, !isPacked)}
                          className={isPacked ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Pakket
                        </Button>
                        
                        <Button
                          size="sm"
                          variant={hasDeviation ? "destructive" : "outline"}
                          onClick={() => handleDeviationClick(item, product.name)}
                        >
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Avvik
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

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
