
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Package, RefreshCw, Clock } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { usePackingData } from '@/hooks/usePackingData';
import { useDisplayRefresh } from '@/hooks/useDisplayRefresh';
import { useDisplaySettings } from '@/hooks/useDisplaySettings';
import { useRealTimeDisplay } from '@/hooks/useRealTimeDisplay';
import { useActivePackingDate } from '@/hooks/useActivePackingDate';
import { generateDisplayStyles, statusColorMap, getProductBackgroundColor, getProductTextColor, getProductAccentColor } from '@/utils/displayStyleUtils';
import { CatGameOverlay } from '@/components/CatGameOverlay';
import ConnectionStatus from '@/components/display/ConnectionStatus';
import DebugInfo from '@/components/display/DebugInfo';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

const SharedDisplay = () => {
  const { data: customers } = useCustomers();
  const { data: settings } = useDisplaySettings();
  
  // Get the active packing date instead of using today's date
  const { data: activePackingDate, isLoading: dateLoading } = useActivePackingDate();
  
  // Use packing data with the active packing date
  const { data: packingData } = usePackingData(
    undefined, 
    activePackingDate,
    true // activeOnly = true to show only selected products
  );
  
  // Enhanced real-time updates with connection monitoring
  const { connectionStatus } = useRealTimeDisplay();
  
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
  const statusColors = settings ? statusColorMap(settings) : {
    pending: '#f59e0b',
    in_progress: '#3b82f6',
    completed: '#10b981',
    delivered: '#059669'
  };

  // Calculate statistics based on active packing data
  const totalActiveProducts = sharedDisplayPackingData.reduce((sum, customer) => 
    sum + customer.products.reduce((productSum, product) => productSum + product.total_quantity, 0), 0
  );

  // Fix the date comparison - ensure activePackingDate exists before comparing
  const isToday = activePackingDate ? activePackingDate === format(new Date(), 'yyyy-MM-dd') : true;

  return (
    <div 
      className="min-h-screen p-8"
      style={displayStyles}
    >
      {/* Cat Game Overlay */}
      <CatGameOverlay settings={settings} />
      
      <div className="max-w-7xl mx-auto">
        {/* Debug Info - only show when there are issues */}
        <DebugInfo showDebug={!packingData || packingData.length === 0} />

        {/* Header with refresh button and connection status */}
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
              className="text-xl mb-2"
              style={{ 
                color: settings?.text_color || '#4b5563',
                fontSize: settings?.body_font_size ? `${settings.body_font_size * 1.25}px` : '1.25rem'
              }}
            >
              Pakkestatus for kunder
            </p>
            {/* Date indicator */}
            {activePackingDate && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <Clock className="h-4 w-4" style={{ color: settings?.text_color || '#6b7280' }} />
                <span 
                  className={`text-sm ${!isToday ? 'font-bold' : ''}`}
                  style={{ 
                    color: !isToday ? '#dc2626' : (settings?.text_color || '#6b7280'),
                  }}
                >
                  {!isToday && 'PAKKING FOR: '}
                  {format(new Date(activePackingDate), 'dd.MM.yyyy', { locale: nb })}
                  {!isToday && ' (ikke i dag)'}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <ConnectionStatus status={connectionStatus} />
            <Button
              variant="outline"
              size="sm"
              onClick={triggerRefresh}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Oppdater
            </Button>
          </div>
        </div>

        {/* Loading state */}
        {dateLoading && (
          <Card
            style={{
              backgroundColor: settings?.card_background_color || '#ffffff',
              borderColor: settings?.card_border_color || '#e5e7eb',
              borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
            }}
          >
            <CardContent className="text-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p style={{ color: settings?.text_color || '#6b7280' }}>
                Laster pakkeinformasjon...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        {!dateLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: Users, label: 'Kunder med Aktive Produkter', value: sharedDisplayPackingData.length, desc: 'Har produkter valgt for pakking' },
              { icon: Package, label: 'Aktive Produkttyper', value: sharedDisplayPackingData.reduce((sum, customer) => sum + customer.products.length, 0), desc: 'Forskjellige produkter' },
              { icon: Calendar, label: 'Totale Produkter', value: totalActiveProducts, desc: 'Antall produkter som skal pakkes' }
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
        )}

        {/* Active Packing Products by Customer */}
        {!dateLoading && sharedDisplayPackingData.length > 0 && (
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
                          backgroundColor: customerData.overall_status === 'completed' ? statusColors.completed : statusColors.in_progress,
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
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span style={{ color: settings?.text_color || '#374151' }}>Fremgang (alle varer):</span>
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
                        <div className="text-xs text-center">
                          <span style={{ color: settings?.text_color || '#6b7280' }}>
                            {customerData.packed_line_items_all}/{customerData.total_line_items_all} varelinjer pakket
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 
                          className="text-sm font-medium mb-2"
                          style={{ color: settings?.text_color || '#374151' }}
                        >
                          Produkter:
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
                              <div className="flex flex-col flex-1">
                                <span 
                                  className="font-medium"
                                  style={{ color: getProductTextColor(settings || {} as any, idx % 3) }}
                                >
                                  {product.product_name}
                                </span>
                                <span 
                                  className="text-xs font-semibold"
                                  style={{ color: getProductAccentColor(settings || {} as any, idx % 3) }}
                                >
                                  {product.total_quantity} {product.product_unit}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span 
                                  className="text-xs"
                                  style={{ color: getProductAccentColor(settings || {} as any, idx % 3) }}
                                >
                                  {product.packed_line_items}/{product.total_line_items}
                                </span>
                                <Badge 
                                  variant={product.packing_status === 'completed' ? 'default' : 'secondary'}
                                  className="text-xs"
                                  style={{
                                    backgroundColor: product.packing_status === 'completed' ? statusColors.completed : statusColors.in_progress,
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
        )}

        {/* No active products message */}
        {!dateLoading && sharedDisplayPackingData.length === 0 && (
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
                Ingen aktive produkter valgt for pakking
                {activePackingDate && !isToday && (
                  <span className="block text-sm mt-2 font-bold" style={{ color: '#dc2626' }}>
                    for {format(new Date(activePackingDate), 'dd.MM.yyyy', { locale: nb })}
                  </span>
                )}
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
