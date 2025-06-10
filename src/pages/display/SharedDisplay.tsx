
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Package, RefreshCw } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { useOrders } from '@/hooks/useOrders';
import { useRealTimeOrders } from '@/hooks/useRealTimeOrders';
import { useDisplayRefresh } from '@/hooks/useDisplayRefresh';
import { useDisplaySettings } from '@/hooks/useDisplaySettings';
import { generateDisplayStyles, statusColorMap, getProductBackgroundColor, getProductTextColor, getProductAccentColor } from '@/utils/displayStyleUtils';
import { CatGameOverlay } from '@/components/CatGameOverlay';
import CustomerHeader from '@/components/display/CustomerHeader';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

const SharedDisplay = () => {
  const { data: customers } = useCustomers();
  const { data: orders } = useOrders();
  const { data: settings } = useDisplaySettings();
  
  // Enable real-time updates
  useRealTimeOrders();
  const { triggerRefresh } = useDisplayRefresh({ 
    enabled: true, 
    interval: (settings?.auto_refresh_interval || 30) * 1000 
  });

  // Filter customers that DON'T have their own display
  const sharedDisplayCustomers = customers?.filter(c => !c.has_dedicated_display && c.status === 'active') || [];
  
  // Filter orders for customers on shared display
  const sharedDisplayOrders = orders?.filter(order => 
    sharedDisplayCustomers.some(customer => customer.id === order.customer_id)
  ) || [];

  const todaysOrders = sharedDisplayOrders.filter(order => 
    order.delivery_date === format(new Date(), 'yyyy-MM-dd')
  );

  const displayStyles = settings ? generateDisplayStyles(settings) : {};
  const statusColors = settings ? statusColorMap(settings) : {};

  return (
    <div 
      className="min-h-screen p-8"
      style={displayStyles}
    >
      {/* Cat Game Overlay */}
      <CatGameOverlay settings={settings} />
      
      <div className="max-w-7xl mx-auto">
        {/* Header with refresh button */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1">
            <h1 
              className="font-bold mb-2"
              style={{ 
                fontSize: settings?.header_font_size ? `${settings.header_font_size}px` : '2.25rem',
                color: settings?.header_text_color || '#111827'
              }}
            >
              Felles Display
            </h1>
            <p 
              className="text-xl"
              style={{ 
                color: settings?.text_color || '#4b5563',
                fontSize: settings?.body_font_size ? `${settings.body_font_size * 1.25}px` : '1.25rem'
              }}
            >
              Oversikt over alle kunder og dagens ordrer
            </p>
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

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: Users, label: 'Aktive Kunder', value: sharedDisplayCustomers.length, desc: 'Vises på felles display' },
            { icon: Calendar, label: 'Dagens Ordrer', value: todaysOrders.length, desc: 'Leveres i dag' },
            { icon: Package, label: 'Totale Produkter', value: todaysOrders.reduce((sum, order) => sum + (order.order_products?.reduce((orderSum, product) => orderSum + product.quantity, 0) || 0), 0), desc: 'I dagens ordrer' }
          ].map((stat, idx) => (
            <Card 
              key={idx}
              style={{
                backgroundColor: settings?.card_background_color || '#ffffff',
                borderColor: settings?.card_border_color || '#e5e7eb',
                borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
                boxShadow: settings?.card_shadow_intensity ? `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)` : undefined
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle 
                  className="text-sm font-medium"
                  style={{ color: settings?.text_color || '#6b7280' }}
                >
                  {stat.label}
                </CardTitle>
                <stat.icon 
                  className="h-4 w-4"
                  style={{ color: settings?.product_accent_color || '#6b7280' }}
                />
              </CardHeader>
              <CardContent>
                <div 
                  className="text-2xl font-bold"
                  style={{ color: settings?.text_color || '#111827' }}
                >
                  {stat.value}
                </div>
                <p 
                  className="text-xs"
                  style={{ color: settings?.text_color || '#6b7280', opacity: 0.7 }}
                >
                  {stat.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Kunde Liste with more prominent names */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sharedDisplayCustomers.map((customer) => {
            const customerOrders = sharedDisplayOrders.filter(order => order.customer_id === customer.id);
            const customerTodaysOrders = todaysOrders.filter(order => order.customer_id === customer.id);
            
            return (
              <Card 
                key={customer.id} 
                className="shadow-lg hover:shadow-xl transition-shadow"
                style={{
                  backgroundColor: settings?.card_background_color || '#ffffff',
                  borderColor: settings?.card_border_color || '#e5e7eb',
                  borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
                  boxShadow: settings?.card_shadow_intensity ? `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)` : undefined
                }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge 
                      variant="secondary"
                      style={{
                        backgroundColor: settings?.product_accent_color || '#f3f4f6',
                        color: settings?.card_background_color || '#ffffff'
                      }}
                    >
                      {customer.customer_number || 'Ingen nr.'}
                    </Badge>
                  </div>
                  {/* Make customer name much more prominent */}
                  <CardTitle 
                    className="text-2xl text-center mb-3"
                    style={{ 
                      color: settings?.header_text_color || '#111827',
                      fontSize: settings?.header_font_size ? `${Math.min(settings.header_font_size * 0.7, 28)}px` : '1.5rem'
                    }}
                  >
                    {customer.name}
                  </CardTitle>
                  {customer.contact_person && (
                    <p 
                      className="text-sm text-center"
                      style={{ color: settings?.text_color || '#6b7280', opacity: 0.8 }}
                    >
                      {customer.contact_person}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: settings?.text_color || '#374151' }}>Totale ordrer:</span>
                      <span 
                        className="font-semibold"
                        style={{ color: settings?.text_color || '#374151' }}
                      >
                        {customerOrders.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: settings?.text_color || '#374151' }}>Dagens ordrer:</span>
                      <span 
                        className="font-semibold"
                        style={{ color: settings?.product_accent_color || '#3b82f6' }}
                      >
                        {customerTodaysOrders.length}
                      </span>
                    </div>
                    {settings?.show_customer_info && customer.phone && (
                      <div className="flex justify-between text-sm">
                        <span style={{ color: settings?.text_color || '#374151' }}>Telefon:</span>
                        <span style={{ color: settings?.text_color || '#374151' }}>{customer.phone}</span>
                      </div>
                    )}
                    {settings?.show_customer_info && customer.email && (
                      <div className="flex justify-between text-sm">
                        <span style={{ color: settings?.text_color || '#374151' }}>E-post:</span>
                        <span 
                          className="truncate max-w-32"
                          style={{ color: settings?.text_color || '#374151' }}
                        >
                          {customer.email}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Dagens Ordrer Detaljer - with more prominent customer names */}
        {todaysOrders.length > 0 && (
          <Card
            style={{
              backgroundColor: settings?.card_background_color || '#ffffff',
              borderColor: settings?.card_border_color || '#e5e7eb',
              borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
              boxShadow: settings?.card_shadow_intensity ? `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)` : undefined
            }}
          >
            <CardHeader>
              <CardTitle 
                className="text-xl"
                style={{ color: settings?.text_color || '#111827' }}
              >
                Dagens Ordrer - {format(new Date(), 'dd. MMMM yyyy', { locale: nb })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaysOrders.map((order) => {
                  const customer = sharedDisplayCustomers.find(c => c.id === order.customer_id);
                  return (
                    <div 
                      key={order.id} 
                      className="border rounded-lg p-4"
                      style={{
                        backgroundColor: settings?.product_card_color || '#f9fafb',
                        borderColor: settings?.card_border_color || '#e5e7eb',
                        borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          {/* Make customer name more prominent in order details */}
                          <h3 
                            className="font-bold text-lg mb-1"
                            style={{ 
                              color: settings?.header_text_color || '#111827',
                              fontSize: settings?.body_font_size ? `${settings.body_font_size * 1.3}px` : '1.125rem'
                            }}
                          >
                            {customer?.name}
                          </h3>
                          {settings?.show_order_numbers && (
                            <p 
                              className="text-sm"
                              style={{ color: settings?.text_color || '#6b7280', opacity: 0.8 }}
                            >
                              Ordre: {order.order_number}
                            </p>
                          )}
                        </div>
                        <Badge 
                          variant={order.status === 'delivered' ? 'default' : 'secondary'}
                          style={{
                            backgroundColor: statusColors[order.status as keyof typeof statusColors] || settings?.status_pending_color || '#f59e0b',
                            color: 'white'
                          }}
                        >
                          {order.status}
                        </Badge>
                      </div>
                      {order.order_products && order.order_products.length > 0 && (
                        <div className="mt-2">
                          <h4 
                            className="text-sm font-medium mb-1"
                            style={{ color: settings?.text_color || '#374151' }}
                          >
                            Produkter:
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {order.order_products.map((orderProduct, idx) => (
                              <div 
                                key={orderProduct.id} 
                                className="text-sm p-2 rounded"
                                style={{
                                  backgroundColor: getProductBackgroundColor(settings || {} as any, idx % 3),
                                  borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.25rem',
                                  transform: `scale(${(settings?.product_card_size || 100) / 100})`,
                                  transformOrigin: 'left center'
                                }}
                              >
                                <span 
                                  className="font-medium"
                                  style={{ color: getProductTextColor(settings || {} as any, idx % 3) }}
                                >
                                  {orderProduct.product?.name}
                                </span>
                                <span 
                                  className="ml-2"
                                  style={{ color: getProductAccentColor(settings || {} as any, idx % 3) }}
                                >
                                  x{orderProduct.quantity}
                                </span>
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
        <div className="text-center mt-8">
          <p style={{ color: settings?.text_color || '#6b7280', opacity: 0.8 }}>
            Sist oppdatert: {format(new Date(), 'HH:mm:ss', { locale: nb })}
          </p>
          <p 
            className="text-xs mt-1"
            style={{ color: settings?.text_color || '#6b7280', opacity: 0.6 }}
          >
            Automatisk oppdatering hvert {settings?.auto_refresh_interval || 30}. sekund
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedDisplay;
