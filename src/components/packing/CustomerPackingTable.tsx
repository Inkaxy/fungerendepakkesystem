
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, Users, CheckCircle } from 'lucide-react';

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

interface CustomerPackingTableProps {
  items: CustomerItem[];
  packedItems: Set<string>;
  deviationItems?: Set<string>;
  onItemToggle: (itemKey: string, checked: boolean) => void;
  onMarkAllPacked?: () => void;
  productName?: string;
}

const CustomerPackingTable = ({ 
  items, 
  packedItems, 
  deviationItems = new Set(),
  onItemToggle, 
  onMarkAllPacked,
  productName 
}: CustomerPackingTableProps) => {
  const packedCount = items.filter(item => packedItems.has(item.key)).length;
  const totalCount = items.length;
  const allPacked = packedCount === totalCount;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Kunder</span>
            {totalCount > 0 && (
              <Badge variant="outline" className="ml-2">
                {packedCount}/{totalCount} pakket
              </Badge>
            )}
          </CardTitle>
          {onMarkAllPacked && totalCount > 0 && !allPacked && (
            <Button
              onClick={onMarkAllPacked}
              size="sm"
              className="flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Merk alle som pakket</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Pakket</TableHead>
                <TableHead>Kundenummer</TableHead>
                <TableHead>Kunde</TableHead>
                <TableHead className="w-24 text-center font-semibold">Antall</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const isChecked = packedItems.has(item.key);
                const hasDeviation = deviationItems.has(item.key);
                return (
                  <TableRow key={item.key} className={isChecked ? 'bg-green-50' : hasDeviation ? 'bg-yellow-50' : ''}>
                    <TableCell>
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => onItemToggle(item.key, checked as boolean)}
                        disabled={hasDeviation}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.customerNumber || '-'}
                    </TableCell>
                    <TableCell className="font-medium">{item.customerName}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-bold text-base px-3 py-1">
                        {item.quantity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={isChecked ? "default" : hasDeviation ? "destructive" : "outline"}
                        className={isChecked ? "bg-green-500" : hasDeviation ? "bg-yellow-500" : ""}
                      >
                        {isChecked ? "Pakket" : hasDeviation ? "Avvik" : "Venter"}
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
            <p className="text-muted-foreground">Ingen ordrer funnet for dette produktet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerPackingTable;
