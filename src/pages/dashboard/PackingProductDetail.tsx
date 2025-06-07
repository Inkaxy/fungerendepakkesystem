
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, ArrowLeft, ArrowRight, Check, Users } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';

const PackingProductDetail = () => {
  const { date, productId } = useParams<{ date: string; productId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const selectedProducts = location.state?.selectedProducts || [productId];
  const currentIndex = selectedProducts.indexOf(productId);
  
  const [packedItems, setPackedItems] = useState<Set<string>>(new Set());
  
  const { data: orders } = useOrders(date);
  const updateOrderStatus = useUpdateOrderStatus();

  // Find current product data
  const currentProductData = orders?.reduce((acc, order) => {
    order.order_products?.forEach(item => {
      if (item.product_id === productId) {
        const key = `${order.id}-${item.id}`;
        acc.items.push({
          key,
          orderId: order.id,
          orderNumber: order.order_number,
          customerName: order.customer?.name || 'Ukjent kunde',
          customerId: order.customer_id,
          quantity: item.quantity,
          packingStatus: item.packing_status,
          orderProductId: item.id
        });
        
        if (!acc.productName && item.product?.name) {
          acc.productName = item.product.name;
        }
      }
    });
    return acc;
  }, { items: [] as any[], productName: '' });

  // Initialize packed items from database
  useEffect(() => {
    if (currentProductData?.items) {
      const alreadyPacked = new Set(
        currentProductData.items
          .filter(item => item.packingStatus === 'packed' || item.packingStatus === 'completed')
          .map(item => item.key)
      );
      setPackedItems(alreadyPacked);
    }
  }, [currentProductData]);

  const handleItemToggle = (itemKey: string, checked: boolean) => {
    const newPackedItems = new Set(packedItems);
    if (checked) {
      newPackedItems.add(itemKey);
    } else {
      newPackedItems.delete(itemKey);
    }
    setPackedItems(newPackedItems);
  };

  const handleSaveProgress = async () => {
    toast({
      title: "Fremgang lagret",
      description: `${packedItems.size} elementer markert som pakket`,
    });
  };

  const handleNextProduct = () => {
    if (currentIndex < selectedProducts.length - 1) {
      const nextProductId = selectedProducts[currentIndex + 1];
      navigate(`/dashboard/orders/packing/${date}/${nextProductId}`, {
        state: { selectedProducts }
      });
    } else {
      navigate(`/dashboard/orders/packing/${date}`);
    }
  };

  const handlePreviousProduct = () => {
    if (currentIndex > 0) {
      const prevProductId = selectedProducts[currentIndex - 1];
      navigate(`/dashboard/orders/packing/${date}/${prevProductId}`, {
        state: { selectedProducts }
      });
    }
  };

  const totalItems = currentProductData?.items.length || 0;
  const packedCount = packedItems.size;
  const progressPercentage = totalItems > 0 ? (packedCount / totalItems) * 100 : 0;

  if (!date || !productId) {
    return <div>Ugyldig dato eller produkt</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/dashboard/orders/packing/${date}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tilbake til oversikt
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{currentProductData?.productName}</h1>
            <p className="text-muted-foreground">
              {format(new Date(date), 'dd. MMMM yyyy', { locale: nb })} • 
              Produkt {currentIndex + 1} av {selectedProducts.length}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={handlePreviousProduct}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            onClick={handleNextProduct}
          >
            {currentIndex < selectedProducts.length - 1 ? (
              <>
                Neste <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Ferdig <Check className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Pakking fremgang</span>
            <Button onClick={handleSaveProgress}>
              Lagre fremgang
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{packedCount} av {totalItems} pakket</span>
            <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Kunder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Kunder</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentProductData?.items.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Pakket</TableHead>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Ordrenummer</TableHead>
                  <TableHead>Antall</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProductData.items.map((item: any) => {
                  const isChecked = packedItems.has(item.key);
                  return (
                    <TableRow key={item.key} className={isChecked ? 'bg-green-50' : ''}>
                      <TableCell>
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) => handleItemToggle(item.key, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.customerName}</TableCell>
                      <TableCell>#{item.orderNumber}</TableCell>
                      <TableCell>{item.quantity} stk</TableCell>
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
    </div>
  );
};

export default PackingProductDetail;
