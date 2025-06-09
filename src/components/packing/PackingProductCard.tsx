
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Check } from 'lucide-react';
import PackingProductItem from './PackingProductItem';

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

interface PackingProductCardProps {
  product: ProductTabData;
  progress: { packed: number; total: number; percentage: number };
  packedItems: Set<string>;
  deviationItems: Set<string>;
  onItemToggle: (itemKey: string, checked: boolean) => void;
  onDeviationClick: (item: CustomerItem) => void;
  onMarkAllPacked: (productId: string) => void;
}

const PackingProductCard = ({
  product,
  progress,
  packedItems,
  deviationItems,
  onItemToggle,
  onDeviationClick,
  onMarkAllPacked
}: PackingProductCardProps) => {
  return (
    <Card>
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
              <PackingProductItem
                key={item.key}
                item={item}
                isPacked={isPacked}
                hasDeviation={hasDeviation}
                onItemToggle={onItemToggle}
                onDeviationClick={onDeviationClick}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PackingProductCard;
