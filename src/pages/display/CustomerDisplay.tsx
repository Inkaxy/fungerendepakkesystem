
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Package, Clock, MapPin, RefreshCw } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { useOrders } from '@/hooks/useOrders';
import { useRealTimeOrders } from '@/hooks/useRealTimeOrders';
import { useDisplayRefresh } from '@/hooks/useDisplayRefresh';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

const CustomerDisplay = () => {
  const { displayUrl } = useParams();
  const { data: customers, isLoading: customersLoading } = useCustomers();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  
  // Enable real-time updates
  useRealTimeOrders();
  const { triggerRefresh } = useDisplayRefresh({ enabled: true, interval: 30000 });

  // Find customer by display_url
  const customer = customers?.find(c => c.display_url === displayUrl);
  
  if (customersLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Laster...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              Henter kundeinformasjon...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Kunde ikke funnet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Ingen kunde funnet for denne display-URL-en.
            </p>
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/display/shared'}
              >
                Gå til felles display
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter orders for this specific customer
  const customerOrders = orders?.filter(order => order.customer_id === customer.id) || [];
  
  const todaysOrders = customerOrders.filter(order => 
    order.delivery_date === format(new Date(), 'yyyy-MM-dd')
  );

  const upcomingOrders = customerOrders.filter(order => 
    new Date(order.delivery_date) > new Date() && 
    order.delivery_date !== format(new Date(), 'yyyy-MM-dd')
  ).slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with refresh button */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {customer.name}
            </h1>
            {customer.customer_number && (
              <p className="text-xl text-gray-600">
                Kundenummer: {customer.customer_number}
              </p>
            )}
            {customer.contact_person && (
              <p className="text-lg text-gray-500">
                Kontaktperson: {customer.contact_person}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={triggerRefresh}
            className="ml-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Oppdater
          </Button>
        </div>

        {/* Customer Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Kundeinformasjon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {customer.phone && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Telefon: {customer.phone}</span>
                </div>
              )}
              {customer.email && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm">E-post: {customer.email}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{customer.address}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Dagens Ordrer
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaysOrders.length}</div>
              <p className="text-xs text-muted-foreground">
                Leveres i dag
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Kommende Ordrer
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingOrders.length}</div>
              <p className="text-xs text-muted-foreground">
                Planlagte ordrer
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Totale Ordrer
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerOrders.length}</div>
              <p className="text-xs text-muted-foreground">
                Alle registrerte ordrer
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Orders */}
        {todaysOrders.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">
                Dagens Ordrer - {format(new Date(), 'dd. MMMM yyyy', { locale: nb })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaysOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 bg-green-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">Ordre: {order.order_number}</h3>
                        <p className="text-sm text-gray-600">
                          Leveringsdato: {format(new Date(order.delivery_date), 'dd. MMMM yyyy', { locale: nb })}
                        </p>
                      </div>
                      <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </div>
                    {order.order_products && order.order_products.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium mb-2">Produkter:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {order.order_products.map((orderProduct) => (
                            <div key={orderProduct.id} className="text-sm bg-white p-3 rounded border">
                              <div className="flex justify-between">
                                <span className="font-medium">{orderProduct.product?.name}</span>
                                <span className="text-gray-600">x{orderProduct.quantity}</span>
                              </div>
                              {orderProduct.unit_price && (
                                <div className="text-xs text-gray-500">
                                  {orderProduct.unit_price} kr per {orderProduct.product?.unit || 'stk'}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {order.notes && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded">
                        <p className="text-sm"><strong>Notat:</strong> {order.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Orders */}
        {upcomingOrders.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Kommende Ordrer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-3 bg-blue-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Ordre: {order.order_number}</h4>
                        <p className="text-sm text-gray-600">
                          Leveres: {format(new Date(order.delivery_date), 'dd. MMMM yyyy', { locale: nb })}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {order.order_products?.length || 0} produkter
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>Sist oppdatert: {format(new Date(), 'HH:mm:ss', { locale: nb })}</p>
          <p className="text-xs mt-1">Automatisk oppdatering hvert 30. sekund</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDisplay;
