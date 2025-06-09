
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Check, AlertTriangle } from 'lucide-react';

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

interface PackingProductItemProps {
  item: CustomerItem;
  isPacked: boolean;
  hasDeviation: boolean;
  onItemToggle: (itemKey: string, checked: boolean) => void;
  onDeviationClick: (item: CustomerItem) => void;
}

const PackingProductItem = ({
  item,
  isPacked,
  hasDeviation,
  onItemToggle,
  onDeviationClick
}: PackingProductItemProps) => {
  return (
    <div
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
            <Badge variant="secondary" className="font-semibold text-sm">
              {item.quantity} stk
            </Badge>
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
          onClick={() => onDeviationClick(item)}
        >
          <AlertTriangle className="w-3 h-3 mr-1" />
          Avvik
        </Button>
      </div>
    </div>
  );
};

export default PackingProductItem;
