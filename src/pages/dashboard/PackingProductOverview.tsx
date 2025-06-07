
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
      
      if (!acc[productId]) {
        acc[productId] = {
          id: productId,
          name: productName,
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

      {/* Selection Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Valgte produkter ({selectedProducts.length}/3)</span>
            <Button 
              onClick={handleStartPacking}
              disabled={selectedProducts.length === 0 || createOrUpdateSession.isPending}
            >
              <Package className="w-4 h-4 mr-2" />
              Start pakking
            </Button>
          </CardTitle>
        </CardHeader>
        {selectedProducts.length > 0 && (
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedProducts.map(productId => {
                const product = productStats[productId];
                return (
                  <Badge key={productId} variant="default">
                    {product.name}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Product List */}
      <div className="grid gap-4">
        {productList.map((product: any) => {
          const isSelected = selectedProducts.includes(product.id);
          const canSelect = selectedProducts.length < 3 || isSelected;
          const progressPercentage = (product.packedQuantity / product.totalQuantity) * 100;

          return (
            <Card key={product.id} className={`transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleProductSelection(product.id, checked as boolean)}
                      disabled={!canSelect}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center">
                          <Package className="w-4 h-4 mr-1" />
                          {product.totalQuantity} stk totalt
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {product.customers.size} kunder
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {product.packedQuantity} / {product.totalQuantity} pakket
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full transition-all ${getProgressColor(product.packedQuantity, product.totalQuantity)}`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {Math.round(progressPercentage)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {productList.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Ingen produkter funnet for denne dagen</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PackingProductOverview;
