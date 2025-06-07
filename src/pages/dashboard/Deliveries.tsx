
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Truck, MapPin, Clock, CheckCircle } from 'lucide-react';

const Deliveries = () => {
  const mockDeliveries = [
    {
      id: 'DEL-001',
      route: 'Sentrum Nord',
      driver: 'Ole Hansen',
      orders: ['ORD-001', 'ORD-003', 'ORD-005'],
      status: 'in_progress',
      startTime: '08:00',
      estimatedEnd: '12:00',
      completedStops: 2,
      totalStops: 8
    },
    {
      id: 'DEL-002',
      route: 'Øst-rute',
      driver: 'Anna Larsen',
      orders: ['ORD-002', 'ORD-004'],
      status: 'pending',
      startTime: '09:00',
      estimatedEnd: '13:30',
      completedStops: 0,
      totalStops: 5
    },
    {
      id: 'DEL-003',
      route: 'Vest-rute',
      driver: 'Erik Solberg',
      orders: ['ORD-006', 'ORD-007', 'ORD-008'],
      status: 'completed',
      startTime: '07:00',
      estimatedEnd: '11:00',
      completedStops: 6,
      totalStops: 6
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Venter</Badge>;
      case 'in_progress':
        return <Badge variant="default"><Truck className="w-3 h-3 mr-1" />Underveis</Badge>;
      case 'completed':
        return <Badge variant="outline"><CheckCircle className="w-3 h-3 mr-1" />Fullført</Badge>;
      default:
        return <Badge variant="secondary">Ukjent</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leveranser</h1>
          <p className="text-muted-foreground">
            Planlegg og følg opp leveranser
          </p>
        </div>
        <Button>
          <MapPin className="mr-2 h-4 w-4" />
          Ny Leveringsrute
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktive ruter
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Underveis nå
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fullførte i dag
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">
              +2 fra i går
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Stopp i dag
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">19</div>
            <p className="text-xs text-muted-foreground">
              11 gjenstår
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gjennomsnittlig tid
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2t</div>
            <p className="text-xs text-muted-foreground">
              -0.3t fra i går
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Deliveries List */}
      <Card>
        <CardHeader>
          <CardTitle>Dagens Leveranser</CardTitle>
          <CardDescription>
            Oversikt over leveringsruter og deres fremdrift
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDeliveries.map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{delivery.route}</span>
                    {getStatusBadge(delivery.status)}
                  </div>
                  <p className="text-sm text-gray-600">Sjåfør: {delivery.driver}</p>
                  <p className="text-sm text-gray-500">
                    Ordrer: {delivery.orders.join(', ')}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Start: {delivery.startTime}</span>
                    <span>Estimert slutt: {delivery.estimatedEnd}</span>
                    <span>Stopp: {delivery.completedStops}/{delivery.totalStops}</span>
                  </div>
                  {delivery.status === 'in_progress' && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(delivery.completedStops / delivery.totalStops) * 100}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    Spor
                  </Button>
                  {delivery.status === 'pending' && (
                    <Button size="sm">
                      Start Levering
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

export default Deliveries;
