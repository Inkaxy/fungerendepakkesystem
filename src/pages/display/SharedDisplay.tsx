
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Package, RefreshCw } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { usePackingData } from '@/hooks/usePackingData';
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
  const { data: settings } = useDisplaySettings();
  
  // Use packing data with activeOnly to show selected products
  const { data: packingData } = usePackingData(
    undefined, 
    format(new Date(), 'yyyy-MM-dd'), 
    true // activeOnly = true to show only selected products
  );
  
  // Enable real-time updates
  useRealTimeOrders();
  const { triggerRefresh } = useDisplayRefresh({ 
    enabled: true, 
    interval: (settings?.auto_refresh_interval || 30) * 1000 
  });

  // Filter customers that DON'T have their own display
  const sharedDisplayCustomers = customers?.filter(c => !c.has_dedicated_display && c.status === 'active') || [];
  
  // Get packing data for shared display customers
  const sharedDisplayPackingData = packingData?.filter(data => 
    sharedDisplayCustomers.some(customer => customer.id === data.id)
  ) || [];

  const displayStyles = settings ? generateDisplayStyles(settings) : {};
  const statusColors = settings ? statusColorMap(settings) : {};

  // Calculate statistics based on active packing data
  const totalActiveProducts = sharedDisplayPackingData.reduce((sum, customer) => 
    sum + customer.products.reduce((productSum, product) => productSum + product.total_line_items, 0), 0
  );

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
              Felles Display - Aktive Produkter
            </h1>
            <p 
              className="text-xl"
              style={{ 
                color: settings?.text_color || '#4b5563',
                fontSize: settings?.body_font_size ? `${settings.body_font_size * 1.25}px` : '1.25rem'
              }}
            >
              Produkter valgt for pakking i dag
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
            { icon: Users, label: 'Kunder med Aktive Produkter', value: sharedDisplayPackingData.length, desc: 'Har produkter valgt for pakking' },
            { icon: Package, label: 'Aktive Produkttyper', value: sharedDisplayPackingData.reduce((sum, customer) => sum + customer.products.length, 0), desc: 'Forskjellige produkter' },
            { icon: Calendar, label: 'Totale Varelinjer', value: totalActiveProducts, desc: 'Skal pakkes i dag' }
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

        {/* Active Packing Products by Customer */}
        {sharedDisplayPackingData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {sharedDisplayPackingData.map((customerData) => {
              const customer = sharedDisplayCustomers.find(c => c.id === customerData.id);
              if (!customer) return null;

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
                          backgroundColor: customerData.overall_status === 'completed' ? statusColors.completed : statusColors.ongoing,
                          color: 'white'
                        }}
                      >
                        {customerData.overall_status === 'completed' ? 'Ferdig' : 'Pågående'}
                      </Badge>
                      <Badge 
                        variant="outline"
                        style={{
                          backgroundColor: settings?.product_accent_color || '#f3f4f6',
                          color: settings?.card_background_color || '#ffffff'
                        }}
                      >
                        {customer.customer_number || 'Ingen nr.'}
                      </Badge>
                    </div>
                    <CardTitle 
                      className="text-xl text-center mb-3"
                      style={{ 
                        color: settings?.header_text_color || '#111827',
                        fontSize: settings?.header_font_size ? `${Math.min(settings.header_font_size * 0.6, 24)}px` : '1.25rem'
                      }}
                    >
                      {customer.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span style={{ color: settings?.text_color || '#374151' }}>Fremgang:</span>
                          <span 
                            className="font-semibold"
                            style={{ color: settings?.product_accent_color || '#3b82f6' }}
                          >
                            {customerData.progress_percentage}%
                          </span>
                        </div>
                        <div 
                          className="w-full rounded-full h-2"
                          style={{ backgroundColor: settings?.progress_background_color || '#e5e7eb' }}
                        >
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              backgroundColor: settings?.progress_bar_color || '#3b82f6',
                              width: `${customerData.progress_percentage}%`
                            }}
                          />
                        </div>
                      </div>

                      {/* Active Products */}
                      <div>
                        <h4 
                          className="text-sm font-medium mb-2"
                          style={{ color: settings?.text_color || '#374151' }}
                        >
                          Aktive Produkter:
                        </h4>
                        <div className="space-y-1">
                          {customerData.products.map((product, idx) => (
                            <div 
                              key={product.id} 
                              className="text-sm p-2 rounded flex justify-between items-center"
                              style={{
                                backgroundColor: getProductBackgroundColor(settings || {} as any, idx % 3),
                                borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.25rem',
                              }}
                            >
                              <span 
                                className="font-medium"
                                style={{ color: getProductTextColor(settings || {} as any, idx % 3) }}
                              >
                                {product.product_name}
                              </span>
                              <div className="flex items-center space-x-2">
                                <span 
                                  style={{ color: getProductAccentColor(settings || {} as any, idx % 3) }}
                                >
                                  {product.packed_line_items}/{product.total_line_items}
                                </span>
                                <Badge 
                                  variant={product.packing_status === 'completed' ? 'default' : 'secondary'}
                                  className="text-xs"
                                  style={{
                                    backgroundColor: product.packing_status === 'completed' ? statusColors.completed : statusColors.ongoing,
                                    color: 'white'
                                  }}
                                >
                                  {product.packing_status === 'completed' ? 'Ferdig' : 
                                   product.packing_status === 'in_progress' ? 'Pågår' : 'Venter'}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card
            style={{
              backgroundColor: settings?.card_background_color || '#ffffff',
              borderColor: settings?.card_border_color || '#e5e7eb',
              borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
              boxShadow: settings?.card_shadow_intensity ? `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)` : undefined
            }}
          >
            <CardContent className="text-center p-12">
              <Package className="h-16 w-16 mx-auto mb-6 text-gray-400" />
              <p 
                className="text-xl mb-6"
                style={{ color: settings?.text_color || '#6b7280' }}
              >
                Ingen aktive produkter valgt for pakking i dag
              </p>
              <p 
                className="text-sm"
                style={{ color: settings?.text_color || '#6b7280', opacity: 0.7 }}
              >
                Gå til Pakking-siden for å velge produkter som skal pakkes
              </p>
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
