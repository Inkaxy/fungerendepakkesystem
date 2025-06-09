
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useOrders } from '@/hooks/useOrders';
import { useCreateOrUpdatePackingSession } from '@/hooks/usePackingSessions';
import SelectedProductsCard from '@/components/packing/SelectedProductsCard';
import ProductsTable from '@/components/packing/ProductsTable';

const PackingProductOverview = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  const { data: orders } = useOrders(date);
  const createOrUpdateSession = useCreateOrUpdatePackingSession();

  // Calculate product statistics with category from products table
  const productStats = orders?.reduce((acc, order) => {
    order.order_products?.forEach(item => {
      const productId = item.product_id;
      const productName = item.product?.name || `Produkt ID: ${productId}`;
      const productNumber = item.product?.product_number || '';
      const productCategory = item.product?.category || 'Ingen kategori';
      
      if (!acc[productId]) {
        acc[productId] = {
          id: productId,
          name: productName,
          productNumber: productNumber,
          category: productCategory,
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
    a.name.localeCompare(b.name)
  );

  const handleProductSelection = (productId: string, checked: boolean) => {
    if (checked && selectedProducts.length < 3) {
      setSelectedProducts([...selectedProducts, productId]);
    } else if (!checked) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleProductActivate = (productId: string) => {
    // If product is already selected, navigate to it
    if (selectedProducts.includes(productId)) {
      navigate(`/dashboard/orders/packing/${date}/${productId}`, {
        state: { selectedProducts }
      });
    } else if (selectedProducts.length < 3) {
      // If not selected and we have room, select it and navigate
      const newSelectedProducts = [...selectedProducts, productId];
      setSelectedProducts(newSelectedProducts);
      navigate(`/dashboard/orders/packing/${date}/${productId}`, {
        state: { selectedProducts: newSelectedProducts }
      });
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
          <h1 className="text-3xl font-bold tracking-tight">
            Pakking for {format(new Date(date), 'dd. MMMM yyyy', { locale: nb })}
          </h1>
          <p className="text-muted-foreground">
            Velg opptil 3 produkter for pakking
          </p>
        </div>
      </div>

      {selectedProducts.length > 0 && (
        <SelectedProductsCard
          selectedProducts={selectedProducts}
          productStats={productStats}
          onStartPacking={handleStartPacking}
          isLoading={createOrUpdateSession.isPending}
        />
      )}

      <ProductsTable
        products={productList}
        selectedProducts={selectedProducts}
        onProductSelection={handleProductSelection}
        onProductActivate={handleProductActivate}
      />
    </div>
  );
};

export default PackingProductOverview;
