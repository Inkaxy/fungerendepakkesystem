import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '@/hooks/useOrders';
import { useCreateOrUpdatePackingSession, usePackingSessionByDate } from '@/hooks/usePackingSessions';
import { useSetActivePackingProducts } from '@/hooks/useActivePackingProducts';
import { useToast } from '@/hooks/use-toast';
import { useDashboardRealTime } from '@/hooks/useDashboardRealTime';
import { useQueryClient } from '@tanstack/react-query';
import ProductsTable from '@/components/packing/ProductsTable';
import PackingReportDialog from '@/components/packing/PackingReportDialog';
import PackingOverviewHeader from '@/components/packing/PackingOverviewHeader';
import SelectedProductsPanel from '@/components/packing/SelectedProductsPanel';

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
  
  const { connectionStatus } = useDashboardRealTime();

  useEffect(() => {
    isMountedRef.current = true;
    
    if (selectedProducts.length > 0) {
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

  // Calculate product statistics
  const productStats = useMemo(() => {
    if (!orders) return {};
    
    return orders.reduce((acc, order) => {
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
    }, {} as Record<string, any>);
  }, [orders]);

  const productList = useMemo(() => {
    return Object.values(productStats).sort((a: any, b: any) => 
      a.name.localeCompare(b.name)
    );
  }, [productStats]);

  // Calculate totals for header
  const totals = useMemo(() => {
    const totalProducts = productList.length;
    const totalUnits = productList.reduce((sum: number, p: any) => sum + p.totalQuantity, 0);
    const completedProducts = productList.filter((p: any) => 
      p.packedQuantity >= p.totalQuantity
    ).length;
    return { totalProducts, totalUnits, completedProducts };
  }, [productList]);

  // Selected products with details for panel
  const selectedProductDetails = useMemo(() => {
    return selectedProducts.map(id => {
      const product = productStats[id];
      return {
        id,
        name: product?.name || '',
        totalQuantity: product?.totalQuantity || 0,
        customerCount: product?.customers?.size || 0,
        packedQuantity: product?.packedQuantity || 0
      };
    });
  }, [selectedProducts, productStats]);

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
          deviation: 0
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

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(id => id !== productId));
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
      }

      const activeProducts = selectedProducts.map(productId => {
        const product = productStats[productId];
        return {
          id: productId,
          name: product.name,
          totalQuantity: product.totalQuantity
        };
      });

      await setActivePackingProducts.mutateAsync({
        sessionDate: date || '',
        products: activeProducts
      });

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
        console.error('Failed to start packing session:', error);
      }
    }
  };

  if (!date) {
    return <div>Ugyldig dato</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Compact Header */}
      <PackingOverviewHeader
        date={date}
        totalProducts={totals.totalProducts}
        totalUnits={totals.totalUnits}
        completedProducts={totals.completedProducts}
        connectionStatus={connectionStatus}
        onBack={() => navigate('/dashboard/orders')}
        onGenerateReport={() => setShowReport(true)}
      />

      {/* Main Content - Table is the hero */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Products Table - Primary Focus */}
        <div className="flex-1 min-w-0 flex flex-col">
          <ProductsTable
            products={productList}
            selectedProducts={selectedProducts}
            onProductSelection={handleProductSelection}
            onProductActivate={handleProductActivate}
          />
        </div>

        {/* Selected Products Panel - Narrower */}
        <div className="w-72 flex-shrink-0 p-3 border-l bg-muted/5">
          <SelectedProductsPanel
            selectedProducts={selectedProductDetails}
            onRemoveProduct={handleRemoveProduct}
            onStartPacking={handleStartPacking}
            isLoading={createOrUpdateSession.isPending}
          />
        </div>
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
