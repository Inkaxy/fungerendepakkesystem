
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package2 } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { usePackingData } from '@/hooks/usePackingData';
import { useDisplayRefresh } from '@/hooks/useDisplayRefresh';
import { useDisplaySettings } from '@/hooks/useDisplaySettings';
import { useRealTimeDisplay } from '@/hooks/useRealTimeDisplay';
import { generateDisplayStyles, packingStatusColorMap, getProductBackgroundColor, getProductTextColor, getProductAccentColor } from '@/utils/displayStyleUtils';
import { CatGameOverlay } from '@/components/CatGameOverlay';
import CustomerHeader from '@/components/display/CustomerHeader';
import ConnectionStatus from '@/components/display/ConnectionStatus';
import { format } from 'date-fns';

const CustomerDisplay = () => {
  const { displayUrl } = useParams();
  const { data: customers, isLoading: customersLoading } = useCustomers();
  const { data: settings } = useDisplaySettings();
  
  // Enhanced real-time updates with connection monitoring
  const { connectionStatus } = useRealTimeDisplay();
  
  const { triggerRefresh } = useDisplayRefresh({ enabled: true, interval: 30000 });

  // Find customer by display_url
  const customer = customers?.find(c => c.display_url === displayUrl);
  
  // Use packing data with activeOnly to show selected products
  const { data: packingData, isLoading: packingLoading } = usePackingData(
    customer?.id, 
    format(new Date(), 'yyyy-MM-dd'),
    true // activeOnly = true to show only selected products
  );

  if (customersLoading || packingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={settings ? generateDisplayStyles(settings) : {}}>
        <Card className="max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Laster pakkeskjerm...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={settings ? generateDisplayStyles(settings) : {}}>
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <h1 className="text-xl font-bold mb-4">Kunde ikke funnet</h1>
            <p className="text-gray-600 mb-4">
              Ingen kunde funnet for denne display-URL-en.
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/display/shared'}
            >
              Gå til felles display
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const customerPackingData = packingData?.find(data => data.id === customer.id);
  const displayStyles = settings ? generateDisplayStyles(settings) : {};
  const statusColors = settings ? packingStatusColorMap(settings) : { ongoing: '#3b82f6', completed: '#10b981' };

  if (!customerPackingData || customerPackingData.products.length === 0) {
    return (
      <div className="min-h-screen p-8" style={displayStyles}>
        {/* Cat Game Overlay */}
        <CatGameOverlay settings={settings} />
        
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Connection Status */}
          <div className="flex justify-end">
            <ConnectionStatus status={connectionStatus} />
          </div>

          {/* Always show customer header */}
          <CustomerHeader 
            customerName={customer.name}
            showRefresh={true}
            onRefresh={triggerRefresh}
            settings={settings}
          />

          {/* No active products message */}
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center p-12">
              <Package2 className="h-16 w-16 mx-auto mb-6 text-gray-400" />
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
        </div>
      </div>
    );
  }

  // Check if customer is completed based on ALL line items
  const isAllPacked = customerPackingData.progress_percentage >= 100;

  return (
    <div className="min-h-screen p-8" style={displayStyles}>
      {/* Cat Game Overlay */}
      <CatGameOverlay settings={settings} />
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Connection Status */}
        <div className="flex justify-end">
          <ConnectionStatus status={connectionStatus} />
        </div>

        {/* Customer header - always displayed */}
        <CustomerHeader 
          customerName={customer.name}
          showRefresh={true}
          onRefresh={triggerRefresh}
          settings={settings}
        />

        {/* Active Products indicator */}
        <Card
          style={{
            backgroundColor: settings?.product_accent_color || '#3b82f6',
            borderColor: settings?.product_accent_color || '#3b82f6',
            borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
          }}
        >
          <CardContent className="p-4 text-center">
            <h2 
              className="font-bold text-white"
              style={{ 
                fontSize: settings?.body_font_size ? `${settings.body_font_size * 1.2}px` : '1.2rem' 
              }}
            >
              Aktive Produkter for Pakking
            </h2>
          </CardContent>
        </Card>

        {/* Products List with customer-specific quantities */}
        <Card
          style={{
            backgroundColor: settings?.card_background_color || '#ffffff',
            borderColor: settings?.card_border_color || '#e5e7eb',
            borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
            boxShadow: settings?.card_shadow_intensity ? `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)` : undefined
          }}
        >
          <CardContent className="p-8">
            <div className="space-y-4">
              {customerPackingData.products.map((product, index) => (
                <div 
                  key={product.id}
                  className="flex justify-between items-center p-4 rounded-lg"
                  style={{
                    backgroundColor: getProductBackgroundColor(settings || {} as any, index),
                    borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
                    transform: `scale(${(settings?.product_card_size || 100) / 100})`,
                    transformOrigin: 'left center'
                  }}
                >
                  <div className="flex-1">
                    <h3 
                      className="font-bold mb-1"
                      style={{ 
                        color: getProductTextColor(settings || {} as any, index),
                        fontSize: settings?.body_font_size ? `${settings.body_font_size * 1.5}px` : '1.5rem'
                      }}
                    >
                      {product.product_name}
                    </h3>
                  </div>
                  <div className="text-right space-y-2">
                    {/* Customer-specific quantity prominently displayed */}
                    <div 
                      className="text-3xl font-bold"
                      style={{ color: getProductAccentColor(settings || {} as any, index) }}
                    >
                      {product.total_quantity} {product.product_unit}
                    </div>
                    <div className="text-right">
                      <span 
                        className="text-lg font-semibold block mb-1"
                        style={{ color: getProductTextColor(settings || {} as any, index) }}
                      >
                        {product.packed_line_items}/{product.total_line_items}
                      </span>
                      <Badge 
                        variant={product.packing_status === 'completed' ? 'default' : 'secondary'}
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* STATUS Indicator - Pågående */}
        {settings?.show_status_indicator && !isAllPacked && (
          <Card
            className="text-center"
            style={{
              backgroundColor: statusColors.ongoing,
              borderColor: statusColors.ongoing,
              borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
            }}
          >
            <CardContent 
              style={{ 
                padding: settings?.status_indicator_padding ? `${settings.status_indicator_padding}px` : '32px' 
              }}
            >
              <h2 
                className="font-bold text-white"
                style={{ 
                  fontSize: settings?.status_indicator_font_size ? `${settings.status_indicator_font_size}px` : '32px' 
                }}
              >
                STATUS: Pågående
              </h2>
            </CardContent>
          </Card>
        )}

        {settings?.show_progress_bar && (
          <Card
            style={{
              backgroundColor: settings?.card_background_color || '#ffffff',
              borderColor: settings?.card_border_color || '#e5e7eb',
              borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
              boxShadow: settings?.card_shadow_intensity ? `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)` : undefined
            }}
          >
            <CardContent className="p-8">
              <div className="space-y-4">
                <div 
                  className="w-full rounded-full relative"
                  style={{ 
                    backgroundColor: settings?.progress_background_color || '#e5e7eb',
                    height: settings?.progress_height ? `${settings.progress_height * 4}px` : '32px'
                  }}
                >
                  <div 
                    className={`rounded-full transition-all duration-300 ${settings?.progress_animation ? 'animate-pulse' : ''}`}
                    style={{ 
                      backgroundColor: settings?.progress_bar_color || '#3b82f6',
                      height: settings?.progress_height ? `${settings.progress_height * 4}px` : '32px',
                      width: `${customerPackingData.progress_percentage}%`
                    }}
                  />
                  {settings?.show_truck_icon && (
                    <img 
                      src="/lovable-uploads/37c33860-5f09-44ea-a64c-a7e7fb7c925b.png"
                      alt="Varebil"
                      className="absolute top-1/2 transform -translate-y-1/2" 
                      style={{ 
                        left: `${customerPackingData.progress_percentage}%`, 
                        marginLeft: `-${(settings?.truck_icon_size || 24) / 2}px`,
                        width: `${settings?.truck_icon_size || 24}px`,
                        height: `${settings?.truck_icon_size || 24}px`,
                        objectFit: 'contain'
                      }}
                    />
                  )}
                </div>
                {settings?.show_progress_percentage && (
                  <div className="text-center">
                    <span 
                      className="text-3xl font-bold"
                      style={{ color: settings?.text_color || '#374151' }}
                    >
                      {customerPackingData.progress_percentage}%
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {isAllPacked && settings?.show_status_indicator && (
          <Card
            className="text-center"
            style={{
              backgroundColor: statusColors.completed,
              borderColor: statusColors.completed,
              borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
            }}
          >
            <CardContent 
              style={{ 
                padding: settings?.status_indicator_padding ? `${settings.status_indicator_padding}px` : '32px' 
              }}
            >
              <h2 
                className="font-bold text-white"
                style={{ 
                  fontSize: settings?.status_indicator_font_size ? `${settings.status_indicator_font_size}px` : '32px' 
                }}
              >
                STATUS: Ferdig Pakket
              </h2>
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <p style={{ color: settings?.text_color || '#6b7280', opacity: 0.8 }}>
            Sist oppdatert: {format(new Date(), 'HH:mm:ss')}
          </p>
          <p 
            className="text-sm mt-1"
            style={{ color: settings?.text_color || '#6b7280', opacity: 0.6 }}
          >
            Automatisk oppdatering hvert 30. sekund • Viser kun aktive produkter
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDisplay;
