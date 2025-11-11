
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
        <TabsList className="flex flex-wrap gap-2 mb-4 bg-transparent p-0 h-auto sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-3 border-b">
          {products.map((product) => {
            const progress = getProductProgress(product);
            const circumference = 2 * Math.PI * 14;
            const strokeDashoffset = circumference * (1 - progress.percentage / 100);
            
            return (
              <TabsTrigger 
                key={product.id} 
                value={product.id} 
                className="relative px-4 py-2 rounded-full border transition-all duration-200 
                           data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md
                           data-[state=inactive]:bg-card data-[state=inactive]:hover:bg-accent
                           flex items-center gap-2"
              >
                {/* Circular progress indicator */}
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <svg className="w-8 h-8 -rotate-90">
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      opacity="0.2"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold">{progress.percentage}%</span>
                </div>
                
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-sm">{product.name}</span>
                  <span className="text-xs opacity-75">{progress.packed}/{progress.total}</span>
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
            <TabsContent key={product.id} value={product.id} className="space-y-4">
              {/* Compact Product Header */}
              <div className="flex items-center justify-between py-3 px-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    {product.productNumber && (
                      <p className="text-xs text-muted-foreground">Varenr: {product.productNumber}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  {/* Inline stats badges */}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Check className="w-3 h-3 mr-1" />
                      {progress.packed} pakket
                    </Badge>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      {remainingCount} gjenstår
                    </Badge>
                  </div>
                  
                  {/* Compact mark all button */}
                  {remainingCount > 0 && (
                    <Button 
                      size="sm"
                      onClick={() => onMarkAllPacked(product.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Alle ({remainingCount})
                    </Button>
                  )}
                </div>
              </div>

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
