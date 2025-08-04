
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Users, Clock, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Order } from '@/types/database';
import { usePackingSessionByDate, useCreateOrUpdatePackingSession } from '@/hooks/usePackingSessions';
import { useAuthStore } from '@/stores/authStore';

interface PackingDateDetailsProps {
  selectedDate: Date;
  orders: Order[];
}

const PackingDateDetails = ({ selectedDate, orders }: PackingDateDetailsProps) => {
  const navigate = useNavigate();
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const { data: packingSession } = usePackingSessionByDate(dateStr);
  const createOrUpdateSession = useCreateOrUpdatePackingSession();
  const { profile } = useAuthStore();

  // Calculate statistics
  const totalOrders = orders.length;
  const uniqueCustomers = new Set(orders.map(o => o.customer_id)).size;
  
  // Calculate product statistics
  const productStats = orders.reduce((acc, order) => {
    order.order_products?.forEach(item => {
      const productName = item.product?.name || `Produkt ID: ${item.product_id}`;
      acc[productName] = (acc[productName] || 0) + item.quantity;
    });
    return acc;
  }, {} as Record<string, number>);

  const topProducts = Object.entries(productStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const productTypes = Object.keys(productStats).length;

  const getStatusInfo = () => {
    if (!packingSession) return { status: 'Ikke planlagt', color: 'secondary' };
    
    switch (packingSession.status) {
      case 'ready':
        return { status: 'Klar for pakking', color: 'default' };
      case 'in_progress':
        return { status: 'Pakking pågår', color: 'default' };
      case 'completed':
        return { status: 'Ferdig pakket', color: 'default' };
      default:
        return { status: 'Ukjent status', color: 'secondary' };
    }
  };

  const handleStartPacking = async () => {
    if (packingSession?.status === 'in_progress') {
      // If already in progress, go directly to product overview
      navigate(`/dashboard/orders/packing/${dateStr}`);
      return;
    }

    if (!profile?.bakery_id) {
      console.error('No bakery_id found in user profile');
      return;
    }

    // Additional session validation
    const { user, session } = useAuthStore.getState();
    if (!user || !session) {
      console.error('No valid authentication session found');
      return;
    }

    console.log('Starting packing session with user:', user.id, 'bakery:', profile.bakery_id);

    try {
      await createOrUpdateSession.mutateAsync({
        bakery_id: profile.bakery_id,
        session_date: dateStr,
        total_orders: totalOrders,
        unique_customers: uniqueCustomers,
        product_types: productTypes,
        files_uploaded: 0,
        status: 'ready'
      });

      // Navigate to product overview
      navigate(`/dashboard/orders/packing/${dateStr}`);
    } catch (error) {
      console.error('Failed to start packing session:', error);
      
      // If it's an RLS error, provide more helpful feedback
      if (error instanceof Error && error.message.includes('row-level security')) {
        console.error('RLS Error - User:', user.id, 'Bakery:', profile.bakery_id);
      }
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          {format(selectedDate, 'dd. MMMM yyyy', { locale: nb })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status</span>
          <Badge variant={statusInfo.color as any}>{statusInfo.status}</Badge>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{totalOrders}</div>
            <div className="text-sm text-muted-foreground">Total ordrer</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{uniqueCustomers}</div>
            <div className="text-sm text-muted-foreground">Unike kunder</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{productTypes}</div>
            <div className="text-sm text-muted-foreground">Produkttyper</div>
          </div>
        </div>

        {/* Top Products */}
        {topProducts.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3">Mest bestilte produkter</h4>
            <div className="space-y-2">
              {topProducts.map(([productName, quantity]) => (
                <div key={productName} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{productName}</span>
                  <span className="font-medium">{quantity} stk</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        {totalOrders > 0 && (
          <Button 
            className="w-full"
            onClick={handleStartPacking}
            disabled={createOrUpdateSession.isPending}
          >
            <Package className="w-4 h-4 mr-2" />
            {packingSession?.status === 'in_progress' ? 'Fortsett pakking' : 'Start pakking'}
          </Button>
        )}

        {totalOrders === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Ingen ordrer for denne dagen</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PackingDateDetails;
