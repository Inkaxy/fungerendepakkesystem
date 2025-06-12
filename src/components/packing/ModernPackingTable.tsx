
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Download
} from 'lucide-react';
import { useUpdateMultipleOrderProductsPackingStatus } from '@/hooks/useOrderProducts';
import { Order } from '@/types/database';

interface PackingTableRow {
  id: string;
  customerName: string;
  customerNumber: string;
  productName: string;
  productNumber: string;
  productCategory: string;
  orderedQuantity: number;
  packedQuantity: number;
  packingStatus: 'pending' | 'in_progress' | 'packed' | 'completed';
  orderProductIds: string[];
  orderId: string;
}

interface ModernPackingTableProps {
  orders: Order[];
  selectedProducts: string[];
  onStartPacking: () => void;
  isStartPackingLoading: boolean;
}

const ModernPackingTable = ({ 
  orders, 
  selectedProducts, 
  onStartPacking, 
  isStartPackingLoading 
}: ModernPackingTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const updatePackingStatus = useUpdateMultipleOrderProductsPackingStatus();

  // Transform orders data into table rows
  const tableData = useMemo(() => {
    const rows: PackingTableRow[] = [];
    
    orders?.forEach(order => {
      order.order_products?.forEach(item => {
        if (!item.product) return;
        
        const existingRow = rows.find(row => 
          row.customerName === order.customer?.name &&
          row.productName === item.product?.name
        );

        if (existingRow) {
          // Aggregate quantities for same customer+product combination
          existingRow.orderedQuantity += item.quantity;
          if (item.packing_status === 'packed' || item.packing_status === 'completed') {
            existingRow.packedQuantity += item.quantity;
          }
          existingRow.orderProductIds.push(item.id);
          
          // Update status to most advanced
          if (existingRow.packingStatus === 'pending' && item.packing_status !== 'pending') {
            existingRow.packingStatus = item.packing_status as any;
          }
        } else {
          rows.push({
            id: `${order.customer_id}_${item.product_id}`,
            customerName: order.customer?.name || 'Ukjent kunde',
            customerNumber: order.customer?.customer_number || '',
            productName: item.product.name,
            productNumber: item.product.product_number || '',
            productCategory: item.product.category || 'Ingen kategori',
            orderedQuantity: item.quantity,
            packedQuantity: (item.packing_status === 'packed' || item.packing_status === 'completed') ? item.quantity : 0,
            packingStatus: item.packing_status as any || 'pending',
            orderProductIds: [item.id],
            orderId: order.id
          });
        }
      });
    });

    return rows.sort((a, b) => {
      // Sort by status (pending first), then by customer name
      if (a.packingStatus !== b.packingStatus) {
        const statusOrder = { pending: 0, in_progress: 1, packed: 2, completed: 3 };
        return statusOrder[a.packingStatus] - statusOrder[b.packingStatus];
      }
      return a.customerName.localeCompare(b.customerName);
    });
  }, [orders]);

  // Filter data based on search and status
  const filteredData = useMemo(() => {
    return tableData.filter(row => {
      const matchesSearch = searchTerm === '' || 
        row.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.customerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.productNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || row.packingStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [tableData, searchTerm, statusFilter]);

  const getStatusBadge = (status: string, packed: number, ordered: number) => {
    const progress = ordered > 0 ? (packed / ordered) * 100 : 0;
    
    if (progress >= 100) {
      return <Badge variant="default" className="bg-green-500 text-white">Ferdig</Badge>;
    } else if (progress > 0) {
      return <Badge variant="default" className="bg-blue-500 text-white">Pågår</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-yellow-500 text-white">Venter</Badge>;
    }
  };

  const handleMarkAsPacked = async (row: PackingTableRow) => {
    try {
      await updatePackingStatus.mutateAsync({
        orderProductIds: row.orderProductIds,
        packingStatus: 'packed'
      });
    } catch (error) {
      console.error('Failed to update packing status:', error);
    }
  };

  const getProgressColor = (packed: number, ordered: number) => {
    const progress = ordered > 0 ? (packed / ordered) * 100 : 0;
    if (progress >= 100) return 'bg-green-500';
    if (progress > 0) return 'bg-blue-500';
    return 'bg-gray-300';
  };

  // Calculate summary statistics
  const totalItems = filteredData.length;
  const completedItems = filteredData.filter(row => 
    row.orderedQuantity > 0 && row.packedQuantity >= row.orderedQuantity
  ).length;
  const overallProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header with controls */}
      <div className="flex-shrink-0 p-6 border-b bg-card">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Søk kunde eller produkt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm bg-background"
            >
              <option value="all">Alle statuser</option>
              <option value="pending">Venter</option>
              <option value="in_progress">Pågår</option>
              <option value="packed">Ferdig</option>
            </select>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Eksporter
            </Button>
          </div>
        </div>

        {/* Summary stats */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-background p-4 rounded-lg border">
            <div className="text-2xl font-bold">{totalItems}</div>
            <div className="text-sm text-muted-foreground">Totalt linjer</div>
          </div>
          <div className="bg-background p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">{completedItems}</div>
            <div className="text-sm text-muted-foreground">Ferdig pakket</div>
          </div>
          <div className="bg-background p-4 rounded-lg border">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
              <Progress value={overallProgress} className="flex-1" />
            </div>
            <div className="text-sm text-muted-foreground">Samlet progresjon</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="min-w-[200px]">Kunde</TableHead>
              <TableHead className="min-w-[200px]">Produkt</TableHead>
              <TableHead className="w-[100px] text-center">Kategori</TableHead>
              <TableHead className="w-[120px] text-center">Antall</TableHead>
              <TableHead className="w-[150px] text-center">Progresjon</TableHead>
              <TableHead className="w-[100px] text-center">Status</TableHead>
              <TableHead className="w-[120px] text-center">Handling</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row) => {
              const progress = row.orderedQuantity > 0 ? (row.packedQuantity / row.orderedQuantity) * 100 : 0;
              const isCompleted = progress >= 100;
              
              return (
                <TableRow 
                  key={row.id}
                  className={`${isCompleted ? 'bg-green-50' : ''} hover:bg-muted/50`}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{row.customerName}</div>
                      {row.customerNumber && (
                        <div className="text-sm text-muted-foreground">
                          Nr: {row.customerNumber}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <div className="font-medium">{row.productName}</div>
                      {row.productNumber && (
                        <div className="text-sm text-muted-foreground">
                          {row.productNumber}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-xs">
                      {row.productCategory}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <div className="font-mono">
                      <span className={isCompleted ? 'text-green-600 font-bold' : ''}>
                        {row.packedQuantity}
                      </span>
                      <span className="text-muted-foreground mx-1">/</span>
                      <span>{row.orderedQuantity}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <div className="space-y-1">
                      <Progress 
                        value={progress} 
                        className="w-full h-2"
                      />
                      <div className="text-xs text-muted-foreground">
                        {Math.round(progress)}%
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    {getStatusBadge(row.packingStatus, row.packedQuantity, row.orderedQuantity)}
                  </TableCell>
                  
                  <TableCell className="text-center">
                    {!isCompleted && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsPacked(row)}
                        disabled={updatePackingStatus.isPending}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Pakk
                      </Button>
                    )}
                    {isCompleted && (
                      <div className="text-green-600 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredData.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Ingen pakke-linjer funnet</p>
            <p className="text-sm">Prøv å justere søk eller filter</p>
          </div>
        )}
      </div>

      {/* Footer with action button */}
      {selectedProducts.length > 0 && (
        <div className="flex-shrink-0 p-4 border-t bg-card">
          <Button 
            onClick={onStartPacking}
            disabled={isStartPackingLoading}
            className="w-full sm:w-auto"
          >
            <Package className="h-4 w-4 mr-2" />
            Start pakking ({selectedProducts.length} produkter valgt)
          </Button>
        </div>
      )}
    </div>
  );
};

export default ModernPackingTable;
