
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useOrders } from '@/hooks/useOrders';
import { useCreateOrUpdatePackingSession, usePackingSessionByDate } from '@/hooks/usePackingSessions';
import { useSetActivePackingProducts } from '@/hooks/useActivePackingProducts';
import { useToast } from '@/hooks/use-toast';
import { useRealTimeDisplay } from '@/hooks/useRealTimeDisplay';
import { useQueryClient } from '@tanstack/react-query';
import ProductsTable from '@/components/packing/ProductsTable';
import PackingReportDialog from '@/components/packing/PackingReportDialog';
import ConnectionStatus from '@/components/display/ConnectionStatus';

const PackingProductOverview = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showReport, setShowReport] = useState(false);
  const isMountedRef = useRef(true);
  
  const { data: orders } = useOrders(date);
  const { data: existingSession } = usePackingSessionByDate(date || '');
  const createOrUpdateSession = useCreateOrUpdatePackingSession();
  const setActivePackingProducts = useSetActivePackingProducts();
  
  // Enhanced real-time updates
  const { connectionStatus } = useRealTimeDisplay();

  // Effect to force query updates when products are selected
  useEffect(() => {
    isMountedRef.current = true;
    
    if (selectedProducts.length > 0) {
      console.log('🔄 Products selected, forcing immediate query updates:', selectedProducts);
      
      // Only update if component is still mounted
      if (isMountedRef.current) {
        queryClient.invalidateQueries({ queryKey: ['packing-data'] });
        queryClient.invalidateQueries({ queryKey: ['active-packing-products'] });
        queryClient.refetchQueries({ queryKey: ['packing-data'] });
        queryClient.refetchQueries({ queryKey: ['active-packing-products'] });
      }
    }
    
    return () => {
      isMountedRef.current = false;
    };
  }, [selectedProducts, queryClient]);

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

  // Generate report data for all orders on this date
  const generateReportData = () => {
    const reportItems: any[] = [];
    
    orders?.forEach(order => {
      order.order_products?.forEach(item => {
        const isPacked = item.packing_status === 'packed' || item.packing_status === 'completed';
        
        reportItems.push({
          customerName: order.customer?.name || 'Ukjent kunde',
          customerNumber: order.customer?.customer_number || '',
          productName: item.product?.name || 'Ukjent produkt',
          productNumber: item.product?.product_number || '',
          orderedQuantity: item.quantity,
          packedQuantity: isPacked ? item.quantity : 0,
          deviation: 0 // Default to 0 - actual deviations would be tracked separately
        });
      });
    });
    
    return reportItems;
  };

  const handleProductSelection = (productId: string, checked: boolean) => {
    if (checked && selectedProducts.length < 3) {
      setSelectedProducts([...selectedProducts, productId]);
    } else if (!checked) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleProductActivate = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      navigate(`/dashboard/orders/packing/${date}/${productId}`, {
        state: { selectedProducts }
      });
    } else if (selectedProducts.length < 3) {
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
      console.log('🚀 Starting packing session with products:', selectedProducts);
      
      // Only create/update session if not already in progress
      if (existingSession?.status !== 'in_progress') {
        await createOrUpdateSession.mutateAsync({
          bakery_id: orders?.[0]?.bakery_id || '',
          session_date: date || '',
          total_orders: orders?.length || 0,
          unique_customers: new Set(orders?.map(o => o.customer_id)).size,
          product_types: productList.length,
          files_uploaded: 0,
          status: 'in_progress'
        });
      } else {
        console.log('⏭️ Session already in progress - skipping upsert');
      }

      // Save selected products as active packing products
      const activeProducts = selectedProducts.map(productId => {
        const product = productStats[productId];
        return {
          id: productId,
          name: product.name,
          totalQuantity: product.totalQuantity
        };
      });

      console.log('💾 Saving active products:', activeProducts);
      await setActivePackingProducts.mutateAsync({
        sessionDate: date || '',
        products: activeProducts
      });

      console.log('✅ Packing session started successfully');
      
      // Navigate immediately without delay
      navigate(`/dashboard/orders/packing/${date}/${selectedProducts[0]}`, {
        state: { selectedProducts }
      });
      
    } catch (error) {
      if (error instanceof Error && error.message.includes('Too many requests')) {
        toast({
          title: "For raskt",
          description: "Vennligst vent et øyeblikk før du prøver igjen",
          variant: "destructive",
        });
      } else {
        console.error('❌ Failed to start packing session:', error);
      }
    }
  };

  if (!date) {
    return <div>Ugyldig dato</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header - fixed at top */}
      <div className="flex-shrink-0 p-6 border-b bg-background">
        <div className="flex items-center justify-between">
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
          
          <div className="flex items-center gap-4">
            <ConnectionStatus status={connectionStatus} />
            <Button 
              onClick={() => setShowReport(true)}
              className="flex items-center space-x-2"
              variant="outline"
            >
              <FileText className="w-4 h-4" />
              <span>Generer rapport</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Products table with sticky header */}
      <div className="flex-1 min-h-0">
        <ProductsTable
          products={productList}
          selectedProducts={selectedProducts}
          onProductSelection={handleProductSelection}
          onProductActivate={handleProductActivate}
          onStartPacking={handleStartPacking}
          isStartPackingLoading={createOrUpdateSession.isPending}
        />
      </div>

      <PackingReportDialog
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        reportData={generateReportData()}
        sessionDate={date}
      />
    </div>
  );
};

export default PackingProductOverview;
