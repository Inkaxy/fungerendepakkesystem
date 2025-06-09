
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  productNumber: string;
  category: string;
  totalQuantity: number;
  customers: Set<string>;
  packedQuantity: number;
}

interface ProductsTableProps {
  products: Product[];
  selectedProducts: string[];
  onProductSelection: (productId: string, checked: boolean) => void;
}

type SortField = 'name' | 'category' | 'totalQuantity' | 'customers' | 'progress';
type SortDirection = 'asc' | 'desc';

const ProductsTable = ({ products, selectedProducts, onProductSelection }: ProductsTableProps) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4 text-blue-600" /> : 
      <ArrowDown className="w-4 h-4 text-blue-600" />;
  };

  const sortedProducts = [...products].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'category':
        aValue = a.category.toLowerCase();
        bValue = b.category.toLowerCase();
        break;
      case 'totalQuantity':
        aValue = a.totalQuantity;
        bValue = b.totalQuantity;
        break;
      case 'customers':
        aValue = a.customers.size;
        bValue = b.customers.size;
        break;
      case 'progress':
        aValue = (a.packedQuantity / a.totalQuantity) * 100;
        bValue = (b.packedQuantity / b.totalQuantity) * 100;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

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
                <TableHead>
                  <button
                    className="flex items-center space-x-1 hover:text-blue-600"
                    onClick={() => handleSort('name')}
                  >
                    <span>Produktnavn</span>
                    {getSortIcon('name')}
                  </button>
                </TableHead>
                <TableHead>Varenummer</TableHead>
                <TableHead>
                  <button
                    className="flex items-center space-x-1 hover:text-blue-600"
                    onClick={() => handleSort('category')}
                  >
                    <span>Kategori</span>
                    {getSortIcon('category')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center space-x-1 hover:text-blue-600"
                    onClick={() => handleSort('totalQuantity')}
                  >
                    <span>Totalt antall</span>
                    {getSortIcon('totalQuantity')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center space-x-1 hover:text-blue-600"
                    onClick={() => handleSort('customers')}
                  >
                    <span>Antall kunder</span>
                    {getSortIcon('customers')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center space-x-1 hover:text-blue-600"
                    onClick={() => handleSort('progress')}
                  >
                    <span>Fremgang</span>
                    {getSortIcon('progress')}
                  </button>
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.map((product) => {
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
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="font-medium">
                      {product.productNumber || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {product.category || 'Ingen kategori'}
                      </Badge>
                    </TableCell>
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
