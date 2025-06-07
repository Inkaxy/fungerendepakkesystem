
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  productNumber: string;
  totalQuantity: number;
  customers: Set<string>;
  packedQuantity: number;
}

interface SelectedProductsCardProps {
  selectedProducts: string[];
  productStats: Record<string, Product>;
  onStartPacking: () => void;
  isLoading: boolean;
}

const SelectedProductsCard = ({ 
  selectedProducts, 
  productStats, 
  onStartPacking, 
  isLoading 
}: SelectedProductsCardProps) => {
  const getProgressColor = (packed: number, total: number) => {
    const percentage = (packed / total) * 100;
    if (percentage === 100) return 'bg-green-500';
    if (percentage > 0) return 'bg-orange-500';
    return 'bg-gray-300';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valgte produkter ({selectedProducts.length}/3)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Varenummer</TableHead>
              <TableHead>Produktnavn</TableHead>
              <TableHead>Totalt antall</TableHead>
              <TableHead>Antall kunder</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedProducts.map(productId => {
              const product = productStats[productId];
              const progressPercentage = (product.packedQuantity / product.totalQuantity) * 100;
              return (
                <TableRow key={productId}>
                  <TableCell className="font-medium">
                    {product.productNumber || '-'}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.totalQuantity} stk</TableCell>
                  <TableCell>{product.customers.size} kunder</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${getProgressColor(product.packedQuantity, product.totalQuantity)}`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <span className="text-xs">{Math.round(progressPercentage)}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="mt-4">
          <Button 
            onClick={onStartPacking}
            disabled={selectedProducts.length === 0 || isLoading}
            className="w-full"
          >
            <Package className="w-4 h-4 mr-2" />
            Start pakking
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectedProductsCard;
