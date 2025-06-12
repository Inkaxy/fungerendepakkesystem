
import React from 'react';
import { Check, AlertTriangle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

interface MultiProductPackingTableProps {
  products: ProductTabData[];
  packedItems: Set<string>;
  deviationItems: Set<string>;
  onItemToggle: (itemKey: string, checked: boolean) => void;
  onItemDeviation: (itemKey: string, hasDeviation: boolean, actualQuantity?: number) => void;
  onMarkAllPacked: (productId: string) => void;
}

const MultiProductPackingTable = ({
  products,
  packedItems,
  deviationItems,
  onItemToggle,
  onItemDeviation,
  onMarkAllPacked
}: MultiProductPackingTableProps) => {
  if (products.length === 0) return null;

  const getProductProgress = (product: ProductTabData) => {
    const packedCount = product.items.filter(item => packedItems.has(item.key)).length;
    const totalCount = product.items.length;
    const percentage = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;
    return { packed: packedCount, total: totalCount, percentage };
  };

  const getStatusBadge = (item: CustomerItem) => {
    const isPacked = packedItems.has(item.key);
    const hasDeviation = deviationItems.has(item.key);
    
    if (hasDeviation) {
      return <Badge variant="destructive" className="text-xs">Avvik</Badge>;
    }
    if (isPacked) {
      return <Badge variant="default" className="bg-green-500 text-xs">Pakket</Badge>;
    }
    return <Badge variant="secondary" className="text-xs">Venter</Badge>;
  };

  const handlePackToggle = (item: CustomerItem) => {
    const isPacked = packedItems.has(item.key);
    onItemToggle(item.key, !isPacked);
  };

  const getSortedItems = (items: CustomerItem[]) => {
    return [...items].sort((a, b) => {
      const aIsPacked = packedItems.has(a.key);
      const bIsPacked = packedItems.has(b.key);
      
      if (aIsPacked && !bIsPacked) return 1;
      if (!aIsPacked && bIsPacked) return -1;
      
      return a.customerName.localeCompare(b.customerName);
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={products[0]?.id} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          {products.map((product) => {
            const progress = getProductProgress(product);
            return (
              <TabsTrigger key={product.id} value={product.id} className="flex flex-col gap-1 py-3">
                <div className="font-medium text-sm">{product.name}</div>
                <div className="text-xs text-muted-foreground">
                  {progress.packed}/{progress.total} ({progress.percentage}%)
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {products.map((product) => {
          const progress = getProductProgress(product);
          const sortedItems = getSortedItems(product.items);
          const remainingCount = progress.total - progress.packed;

          return (
            <TabsContent key={product.id} value={product.id} className="space-y-6">
              {/* Product Header with Summary */}
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <Package className="h-6 w-6 text-primary" />
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight">{product.name}</h2>
                        {product.productNumber && (
                          <p className="text-sm text-muted-foreground">Varenummer: {product.productNumber}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{progress.packed}</div>
                      <div className="text-sm text-muted-foreground">Pakket</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{remainingCount}</div>
                      <div className="text-sm text-muted-foreground">Gjenstår</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{progress.total}</div>
                      <div className="text-sm text-muted-foreground">Totalt</div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Fremdrift</span>
                    <span className="font-medium">{progress.percentage}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>

                {remainingCount > 0 && (
                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={() => onMarkAllPacked(product.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Merk alle som pakket ({remainingCount})
                    </Button>
                  </div>
                )}
              </Card>

              {/* Packing Table */}
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2">
                      <TableHead className="font-semibold text-foreground">Kunde</TableHead>
                      <TableHead className="font-semibold text-foreground text-center">Antall</TableHead>
                      <TableHead className="font-semibold text-foreground text-center">Status</TableHead>
                      <TableHead className="font-semibold text-foreground text-center">Handling</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedItems.map((item) => {
                      const isPacked = packedItems.has(item.key);
                      const hasDeviation = deviationItems.has(item.key);
                      
                      return (
                        <TableRow 
                          key={item.key}
                          className={`
                            transition-all duration-200
                            ${isPacked ? 'opacity-60 bg-green-50' : 'hover:bg-muted/50'}
                            ${hasDeviation ? 'bg-red-50' : ''}
                          `}
                        >
                          <TableCell className="py-4">
                            <div className="space-y-1">
                              <div className="font-medium">{item.customerName}</div>
                              {item.customerNumber && (
                                <div className="text-sm text-muted-foreground">
                                  Kundenr: {item.customerNumber}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          
                          <TableCell className="text-center py-4">
                            <div className="text-lg font-semibold">
                              {item.quantity} stk
                            </div>
                          </TableCell>
                          
                          <TableCell className="text-center py-4">
                            {getStatusBadge(item)}
                          </TableCell>
                          
                          <TableCell className="text-center py-4">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant={isPacked ? "secondary" : "default"}
                                size="sm"
                                onClick={() => handlePackToggle(item)}
                                className={isPacked ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                              >
                                {isPacked ? (
                                  <>
                                    <Check className="w-4 h-4 mr-1" />
                                    Pakket
                                  </>
                                ) : (
                                  <>
                                    <Package className="w-4 h-4 mr-1" />
                                    Pakk
                                  </>
                                )}
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onItemDeviation(item.key, !hasDeviation)}
                                className={hasDeviation ? "border-red-500 text-red-600" : ""}
                              >
                                <AlertTriangle className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>

              {progress.packed === progress.total && (
                <Card className="p-6 bg-green-50 border-green-200">
                  <div className="flex items-center justify-center gap-3 text-green-800">
                    <Check className="w-6 h-6" />
                    <span className="text-lg font-semibold">
                      Alle varer for {product.name} er pakket! 🎉
                    </span>
                  </div>
                </Card>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default MultiProductPackingTable;
