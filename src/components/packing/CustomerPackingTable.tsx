
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, Users } from 'lucide-react';

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
  onItemToggle: (itemKey: string, checked: boolean) => void;
}

const CustomerPackingTable = ({ items, packedItems, onItemToggle }: CustomerPackingTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Kunder</span>
        </CardTitle>
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
                return (
                  <TableRow key={item.key} className={isChecked ? 'bg-green-50' : ''}>
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
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-bold text-base px-3 py-1">
                        {item.quantity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={isChecked ? "default" : "outline"}
                        className={isChecked ? "bg-green-500" : ""}
                      >
                        {isChecked ? "Pakket" : "Venter"}
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
