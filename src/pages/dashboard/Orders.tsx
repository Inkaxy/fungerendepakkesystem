
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Clock, CheckCircle, Truck } from 'lucide-react';

const Orders = () => {
  const mockOrders = [
    {
      id: 'ORD-001',
      customer: 'Kafe Sentralen',
      items: 'Grovbrød x10, Rundstykker x20',
      status: 'pending',
      orderDate: '2025-06-07',
      deliveryDate: '2025-06-08',
      total: '850 kr'
    },
    {
      id: 'ORD-002', 
      customer: 'Restaurant Nord',
      items: 'Focaccia x5, Bagetter x15',
      status: 'in_progress',
      orderDate: '2025-06-07',
      deliveryDate: '2025-06-08',
      total: '1200 kr'
    },
    {
      id: 'ORD-003',
      customer: 'Bakeri Sør',
      items: 'Surdeig x8, Croissant x25',
      status: 'packed',
      orderDate: '2025-06-06',
      deliveryDate: '2025-06-07',
      total: '950 kr'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Venter</Badge>;
      case 'in_progress':
        return <Badge variant="default"><Package className="w-3 h-3 mr-1" />Pakkes</Badge>;
      case 'packed':
        return <Badge variant="outline"><CheckCircle className="w-3 h-3 mr-1" />Pakket</Badge>;
      case 'delivered':
        return <Badge variant="destructive"><Truck className="w-3 h-3 mr-1" />Levert</Badge>;
      default:
        return <Badge variant="secondary">Ukjent</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ordrer & Pakking</h1>
          <p className="text-muted-foreground">
            Administrer ordrer og pakking-prosesser
          </p>
        </div>
        <Button>
          <Package className="mr-2 h-4 w-4" />
          Ny Ordre
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Venter pakking
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              +2 fra i går
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Under pakking
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              +1 fra i går
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pakket
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +8 fra i går
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total omsetning
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25.400 kr</div>
            <p className="text-xs text-muted-foreground">
              +12% fra i går
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Aktive Ordrer</CardTitle>
          <CardDescription>
            Oversikt over dagens ordrer og deres status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{order.id}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                  <p className="text-sm text-gray-500">{order.items}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Bestilt: {order.orderDate}</span>
                    <span>Levering: {order.deliveryDate}</span>
                    <span className="font-medium">{order.total}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Detaljer
                  </Button>
                  {order.status === 'pending' && (
                    <Button size="sm">
                      Start Pakking
                    </Button>
                  )}
                  {order.status === 'in_progress' && (
                    <Button size="sm">
                      Fullfør Pakking
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
