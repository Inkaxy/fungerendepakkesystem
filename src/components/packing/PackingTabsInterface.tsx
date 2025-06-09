
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, Users, Check, AlertTriangle } from 'lucide-react';
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
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${products.length}, 1fr)` }}>
          {products.map((product) => {
            const progress = getProductProgress(product.id);
            return (
              <TabsTrigger key={product.id} value={product.id} className="flex flex-col items-center p-3">
                <div className="font-medium text-sm truncate max-w-full">{product.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {progress.packed}/{progress.total}
                </div>
                <Badge 
                  variant={progress.percentage === 100 ? "default" : "outline"}
                  className="mt-1 text-xs"
                >
                  {progress.percentage}% ferdig
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {products.map((product) => (
          <TabsContent key={product.id} value={product.id} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5" />
                    <CardTitle>{product.name}</CardTitle>
                    {product.productNumber && (
                      <Badge variant="outline">{product.productNumber}</Badge>
                    )}
                    <Badge variant="outline">{product.category}</Badge>
                  </div>
                  <Button
                    onClick={() => onMarkAllPacked(product.id)}
                    className="flex items-center space-x-2"
                    variant="default"
                  >
                    <Check className="w-4 h-4" />
                    <span>Merk alle som pakket ({product.items.length})</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">Kunder ({product.items.length})</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getProductProgress(product.id).packed} av {getProductProgress(product.id).total} pakket
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Pakket</TableHead>
                        <TableHead>Kundenummer</TableHead>
                        <TableHead>Kunde</TableHead>
                        <TableHead>Antall</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Handlinger</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {product.items.map((item) => {
                        const isChecked = packedItems.has(item.key);
                        const hasDeviation = deviationItems.has(item.key);
                        
                        return (
                          <TableRow 
                            key={item.key} 
                            className={`
                              ${isChecked ? 'bg-green-50' : ''} 
                              ${hasDeviation ? 'bg-orange-50' : ''}
                            `}
                          >
                            <TableCell>
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={(checked) => onItemToggle(item.key, checked as boolean)}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {item.customerNumber || '-'}
                            </TableCell>
                            <TableCell className="font-medium">{item.customerName}</TableCell>
                            <TableCell>{item.quantity} stk</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Badge 
                                  variant={isChecked ? "default" : hasDeviation ? "destructive" : "outline"}
                                  className={isChecked ? "bg-green-500" : hasDeviation ? "bg-orange-500" : ""}
                                >
                                  {isChecked ? "Pakket" : hasDeviation ? "Avvik" : "Venter"}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant={isChecked ? "default" : "outline"}
                                  onClick={() => onItemToggle(item.key, !isChecked)}
                                  className="flex items-center space-x-1"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Pakket</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant={hasDeviation ? "destructive" : "outline"}
                                  onClick={() => handleDeviationClick(item, product.name)}
                                  className="flex items-center space-x-1"
                                >
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>Avvik</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

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
