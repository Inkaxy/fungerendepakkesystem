
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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

interface ProductsTableProps {
  products: Product[];
  selectedProducts: string[];
  onProductSelection: (productId: string, checked: boolean) => void;
}

const ProductsTable = ({ products, selectedProducts, onProductSelection }: ProductsTableProps) => {
  const getProgressColor = (packed: number, total: number) => {
    const percentage = (packed / total) * 100;
    if (percentage === 100) return 'bg-green-500';
    if (percentage > 0) return 'bg-orange-500';
    return 'bg-gray-300';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produkter</CardTitle>
      </CardHeader>
      <CardContent>
        {products.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Velg</TableHead>
                <TableHead>Varenummer</TableHead>
                <TableHead>Produktnavn</TableHead>
                <TableHead>Totalt antall</TableHead>
                <TableHead>Antall kunder</TableHead>
                <TableHead>Fremgang</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const isSelected = selectedProducts.includes(product.id);
                const canSelect = selectedProducts.length < 3 || isSelected;
                const progressPercentage = (product.packedQuantity / product.totalQuantity) * 100;

                return (
                  <TableRow key={product.id} className={isSelected ? 'bg-blue-50' : ''}>
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => onProductSelection(product.id, checked as boolean)}
                        disabled={!canSelect}
                      />
                    </TableCell>
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
                    <TableCell>
                      <Badge variant={progressPercentage === 100 ? "default" : "outline"}>
                        {progressPercentage === 100 ? "Ferdig" : "Venter"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Ingen produkter funnet for denne dagen</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductsTable;
