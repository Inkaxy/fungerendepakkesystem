import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Package, Upload, Calendar as CalendarIcon, Users, Clock, Loader2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useOrders, useOrdersByDateRange } from '@/hooks/useOrders';
import { usePackingSessions } from '@/hooks/usePackingSessions';
import OrderDetailsModal from '@/components/orders/OrderDetailsModal';
import DataUploadModal from '@/components/orders/DataUploadModal';
import PackingDateDetails from '@/components/orders/PackingDateDetails';
import { Order } from '@/types/database';

const Orders = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showDataUpload, setShowDataUpload] = useState(false);
  
  const currentMonth = format(selectedDate, 'yyyy-MM');
  const monthStart = format(startOfMonth(selectedDate), 'yyyy-MM-dd');
  const monthEnd = format(endOfMonth(selectedDate), 'yyyy-MM-dd');
  
  const { data: monthOrders, isLoading: ordersLoading } = useOrdersByDateRange(monthStart, monthEnd);
  const { data: selectedDateOrders, isLoading: dayOrdersLoading } = useOrders(format(selectedDate, 'yyyy-MM-dd'));
  const { data: packingSessions } = usePackingSessions();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Venter</Badge>;
      case 'confirmed':
        return <Badge variant="default">Bekreftet</Badge>;
      case 'in_progress':
        return <Badge variant="default"><Package className="w-3 h-3 mr-1" />Produksjon</Badge>;
      case 'packed':
        return <Badge className="bg-blue-500"><Package className="w-3 h-3 mr-1" />Pakket</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500">Levert</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Kansellert</Badge>;
      default:
        return <Badge variant="outline">Ukjent</Badge>;
    }
  };

  const handleOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  // Create calendar modifiers for packing days
  const calendarModifiers = {
    packingDayReady: (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const session = packingSessions?.find(s => s.session_date === dateStr);
      return session?.status === 'ready';
    },
    packingDayInProgress: (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const session = packingSessions?.find(s => s.session_date === dateStr);
      return session?.status === 'in_progress';
    },
    packingDayCompleted: (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const session = packingSessions?.find(s => s.session_date === dateStr);
      return session?.status === 'completed';
    },
    hasOrders: (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return monthOrders?.some(order => order.delivery_date === dateStr) || false;
    },
    today: (date: Date) => {
      const today = new Date();
      return format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
    }
  };

  if (ordersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const totalOrders = monthOrders?.length || 0;
  const pendingOrders = monthOrders?.filter(o => o.status === 'pending').length || 0;
  const packedOrders = monthOrders?.filter(o => o.status === 'packed').length || 0;
  const uniqueCustomers = new Set(monthOrders?.map(o => o.customer_id)).size;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ordrer & Pakking</h1>
          <p className="text-muted-foreground">
            Administrer ordrer og planlegg pakkedager
          </p>
        </div>
        <Button onClick={() => setShowDataUpload(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Last opp data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ordrer denne måneden</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {format(selectedDate, 'MMMM yyyy', { locale: nb })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Venter</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Ikke påbegynt</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pakket</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{packedOrders}</div>
            <p className="text-xs text-muted-foreground">Klare for levering</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unike kunder</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCustomers}</div>
            <p className="text-xs text-muted-foreground">Denne måneden</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Pakkekalender</CardTitle>
            <CardDescription>
              Klikk på en dato for å se alle ordrer for den dagen
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={nb}
                modifiers={calendarModifiers}
                modifiersClassNames={{
                  packingDayReady: 'bg-blue-100 text-blue-800',
                  packingDayInProgress: 'bg-orange-100 text-orange-800',
                  packingDayCompleted: 'bg-green-100 text-green-800',
                  hasOrders: 'ring-2 ring-blue-200',
                  today: 'ring-2 ring-red-500'
                }}
              />
              
              {/* Legend */}
              <div className="mt-4 space-y-2 text-sm">
                <div className="font-medium">Fargekoder:</div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-100 border rounded"></div>
                  <span>Klar for pakking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-100 border rounded"></div>
                  <span>Pakking pågår</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 border rounded"></div>
                  <span>Pakking fullført</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-red-500 rounded"></div>
                  <span>I dag</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Packing Date Details - New unified view */}
        <PackingDateDetails 
          selectedDate={selectedDate} 
          orders={selectedDateOrders || []} 
        />
      </div>

      {/* All Orders for Selected Date */}
      {selectedDateOrders && selectedDateOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Alle ordrer for {format(selectedDate, 'dd. MMMM yyyy', { locale: nb })}
            </CardTitle>
            <CardDescription>
              {selectedDateOrders.length} ordrer denne dagen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDateOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{order.order_number}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.customer?.name || 'Ukjent kunde'}
                    </p>
                    {order.total_amount && (
                      <p className="text-sm text-gray-500">
                        {order.total_amount.toLocaleString('nb-NO')} kr
                      </p>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleOrderDetails(order)}
                  >
                    Detaljer
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={showOrderDetails}
        onClose={() => {
          setShowOrderDetails(false);
          setSelectedOrder(null);
        }}
      />

      <DataUploadModal
        isOpen={showDataUpload}
        onClose={() => setShowDataUpload(false)}
      />
    </div>
  );
};

export default Orders;
