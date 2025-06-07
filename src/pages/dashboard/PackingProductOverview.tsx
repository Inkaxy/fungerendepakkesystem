
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, ArrowLeft, Users } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useOrders } from '@/hooks/useOrders';
import { useCreateOrUpdatePackingSession } from '@/hooks/usePackingSessions';

const PackingProductOverview = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  const { data: orders } = useOrders(date);
  const createOrUpdateSession = useCreateOrUpdatePackingSession();

  // Calculate product statistics
  const productStats = orders?.reduce((acc, order) => {
    order.order_products?.forEach(item => {
      const productId = item.product_id;
      const productName = item.product?.name || `Produkt ID: ${productId}`;
      const productNumber = item.product?.product_number || '';
      
      if (!acc[productId]) {
        acc[productId] = {
          id: productId,
          name: productName,
          productNumber: productNumber,
          totalQuantity: 0,
          packedQuantity: 0,
          customers: new Set<string>(),
          orders: []
        };
      }
      
      acc[productId].totalQuantity += item.quantity;
      if (item.packing_status === 'packed' || item.packing_status === 'completed') {
        acc[productId].packedQuantity += item.quantity;
      }
      acc[productId].customers.add(order.customer_id);
      acc[productId].orders.push({
        orderId: order.id,
        orderNumber: order.order_number,
        customerName: order.customer?.name || 'Ukjent kunde',
        quantity: item.quantity,
        packingStatus: item.packing_status
      });
    });
    return acc;
  }, {} as Record<string, any>) || {};

  const productList = Object.values(productStats).sort((a: any, b: any) => 
    b.totalQuantity - a.totalQuantity
  );

  const handleProductSelection = (productId: string, checked: boolean) => {
    if (checked && selectedProducts.length < 3) {
      setSelectedProducts([...selectedProducts, productId]);
    } else if (!checked) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleStartPacking = async () => {
    if (selectedProducts.length === 0) return;
    
    try {
      await createOrUpdateSession.mutateAsync({
        bakery_id: orders?.[0]?.bakery_id || '',
        session_date: date || '',
        total_orders: orders?.length || 0,
        unique_customers: new Set(orders?.map(o => o.customer_id)).size,
        product_types: productList.length,
        files_uploaded: 0,
        status: 'in_progress'
      });

      // Navigate to first selected product
      navigate(`/dashboard/orders/packing/${date}/${selectedProducts[0]}`, {
        state: { selectedProducts }
      });
    } catch (error) {
      console.error('Failed to start packing session:', error);
    }
  };

  const getProgressColor = (packed: number, total: number) => {
    const percentage = (packed / total) * 100;
    if (percentage === 100) return 'bg-green-500';
    if (percentage > 0) return 'bg-orange-500';
    return 'bg-gray-300';
  };

  if (!date) {
    return <div>Ugyldig dato</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/orders')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tilbake til ordrer</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pakking for {format(new Date(date), 'dd. MMMM yyyy', { locale: nb })}</h1>
          <p className="text-muted-foreground">
            Velg opptil 3 produkter for pakking
          </p>
        </div>
      </div>

      {/* Valgte produkter */}
      {selectedProducts.length > 0 && (
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
                onClick={handleStartPacking}
                disabled={selectedProducts.length === 0 || createOrUpdateSession.isPending}
                className="w-full"
              >
                <Package className="w-4 h-4 mr-2" />
                Start pakking
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Produkter */}
      <Card>
        <CardHeader>
          <CardTitle>Produkter</CardTitle>
        </CardHeader>
        <CardContent>
          {productList.length > 0 ? (
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
                {productList.map((product: any) => {
                  const isSelected = selectedProducts.includes(product.id);
                  const canSelect = selectedProducts.length < 3 || isSelected;
                  const progressPercentage = (product.packedQuantity / product.totalQuantity) * 100;

                  return (
                    <TableRow key={product.id} className={isSelected ? 'bg-blue-50' : ''}>
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleProductSelection(product.id, checked as boolean)}
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
    </div>
  );
};

export default PackingProductOverview;
