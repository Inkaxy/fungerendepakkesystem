
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Package } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { useOrders } from '@/hooks/useOrders';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

const SharedDisplay = () => {
  const { data: customers } = useCustomers();
  const { data: orders } = useOrders();

  // Filtrer kunder som IKKE har eget display
  const sharedDisplayCustomers = customers?.filter(c => !c.has_dedicated_display && c.status === 'active') || [];
  
  // Filtrer ordrer for kunder på felles display
  const sharedDisplayOrders = orders?.filter(order => 
    sharedDisplayCustomers.some(customer => customer.id === order.customer_id)
  ) || [];

  const todaysOrders = sharedDisplayOrders.filter(order => 
    order.delivery_date === format(new Date(), 'yyyy-MM-dd')
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Felles Display
          </h1>
          <p className="text-xl text-gray-600">
            Oversikt over alle kunder og dagens ordrer
          </p>
        </div>

        {/* Statistikk */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Aktive Kunder
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sharedDisplayCustomers.length}</div>
              <p className="text-xs text-muted-foreground">
                Vises på felles display
              </p>
            </CardContent>
          </Card>
          
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
                Totale Produkter
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {todaysOrders.reduce((sum, order) => 
                  sum + (order.order_products?.reduce((orderSum, product) => 
                    orderSum + product.quantity, 0) || 0), 0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                I dagens ordrer
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Kunde Liste */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sharedDisplayCustomers.map((customer) => {
            const customerOrders = sharedDisplayOrders.filter(order => order.customer_id === customer.id);
            const customerTodaysOrders = todaysOrders.filter(order => order.customer_id === customer.id);
            
            return (
              <Card key={customer.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{customer.name}</CardTitle>
                    <Badge variant="secondary">
                      {customer.customer_number || 'Ingen nr.'}
                    </Badge>
                  </div>
                  {customer.contact_person && (
                    <p className="text-sm text-gray-600">{customer.contact_person}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Totale ordrer:</span>
                      <span className="font-semibold">{customerOrders.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Dagens ordrer:</span>
                      <span className="font-semibold text-blue-600">
                        {customerTodaysOrders.length}
                      </span>
                    </div>
                    {customer.phone && (
                      <div className="flex justify-between text-sm">
                        <span>Telefon:</span>
                        <span>{customer.phone}</span>
                      </div>
                    )}
                    {customer.email && (
                      <div className="flex justify-between text-sm">
                        <span>E-post:</span>
                        <span className="truncate max-w-32">{customer.email}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Dagens Ordrer Detaljer */}
        {todaysOrders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Dagens Ordrer - {format(new Date(), 'dd. MMMM yyyy', { locale: nb })}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaysOrders.map((order) => {
                  const customer = sharedDisplayCustomers.find(c => c.id === order.customer_id);
                  return (
                    <div key={order.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{customer?.name}</h3>
                          <p className="text-sm text-gray-600">Ordre: {order.order_number}</p>
                        </div>
                        <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </div>
                      {order.order_products && order.order_products.length > 0 && (
                        <div className="mt-2">
                          <h4 className="text-sm font-medium mb-1">Produkter:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {order.order_products.map((orderProduct) => (
                              <div key={orderProduct.id} className="text-sm bg-white p-2 rounded">
                                <span className="font-medium">{orderProduct.product?.name}</span>
                                <span className="text-gray-600 ml-2">x{orderProduct.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>Sist oppdatert: {format(new Date(), 'HH:mm:ss', { locale: nb })}</p>
        </div>
      </div>
    </div>
  );
};

export default SharedDisplay;
