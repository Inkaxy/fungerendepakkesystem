
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package2 } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { usePackingData } from '@/hooks/usePackingData';
import { useRealTimeOrders } from '@/hooks/useRealTimeOrders';
import { useDisplayRefresh } from '@/hooks/useDisplayRefresh';
import { useDisplaySettings } from '@/hooks/useDisplaySettings';
import { generateDisplayStyles, packingStatusColorMap } from '@/utils/displayStyleUtils';
import CustomerHeader from '@/components/display/CustomerHeader';
import { format } from 'date-fns';

const CustomerDisplay = () => {
  const { displayUrl } = useParams();
  const { data: customers, isLoading: customersLoading } = useCustomers();
  const { data: settings } = useDisplaySettings();
  
  // Enable real-time updates
  useRealTimeOrders();
  const { triggerRefresh } = useDisplayRefresh({ enabled: true, interval: 30000 });

  // Find customer by display_url
  const customer = customers?.find(c => c.display_url === displayUrl);
  
  const { data: packingData, isLoading: packingLoading } = usePackingData(
    customer?.id, 
    format(new Date(), 'yyyy-MM-dd')
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
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Always show customer header */}
          <CustomerHeader 
            customerName={customer.name}
            showRefresh={true}
            onRefresh={triggerRefresh}
            settings={settings}
          />

          {/* No packing message */}
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center p-12">
              <Package2 className="h-16 w-16 mx-auto mb-6 text-gray-400" />
              <p 
                className="text-xl mb-6"
                style={{ color: settings?.text_color || '#6b7280' }}
              >
                Ingen pakking planlagt for i dag
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isAllPacked = customerPackingData.progress_percentage >= 100;

  return (
    <div className="min-h-screen p-8" style={displayStyles}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Customer header - always displayed */}
        <CustomerHeader 
          customerName={customer.name}
          showRefresh={true}
          onRefresh={triggerRefresh}
          settings={settings}
        />

        {/* Products List */}
        <Card
          style={{
            backgroundColor: settings?.card_background_color || '#ffffff',
            borderColor: settings?.card_border_color || '#e5e7eb',
            borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
          }}
        >
          <CardContent className="p-8">
            <div className="space-y-4">
              {customerPackingData.products.map((product, index) => (
                <div 
                  key={product.id}
                  className="flex justify-between items-center p-4 rounded-lg"
                  style={{
                    backgroundColor: settings?.product_card_color || '#f9fafb',
                    borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
                  }}
                >
                  <h3 
                    className="font-bold"
                    style={{ 
                      color: settings?.product_text_color || '#111827',
                      fontSize: settings?.body_font_size ? `${settings.body_font_size * 1.5}px` : '1.5rem'
                    }}
                  >
                    {product.product_name}
                  </h3>
                  <span 
                    className="text-2xl font-bold"
                    style={{ color: settings?.product_accent_color || '#6b7280' }}
                  >
                    {product.total_line_items}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Section */}
        <Card
          style={{
            backgroundColor: settings?.card_background_color || '#ffffff',
            borderColor: settings?.card_border_color || '#e5e7eb',
            borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
          }}
        >
          <CardContent className="p-8 text-center space-y-4">
            <div className="space-y-2">
              <p 
                className="text-2xl"
                style={{ color: settings?.text_color || '#6b7280' }}
              >
                Bestilt {customerPackingData.total_line_items} varelinjer
              </p>
              <p 
                className="text-2xl font-semibold"
                style={{ color: settings?.text_color || '#111827' }}
              >
                Pakket {customerPackingData.packed_line_items} av {customerPackingData.total_line_items} varelinjer
              </p>
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

        {/* Progress Bar */}
        {settings?.show_progress_bar && (
          <Card
            style={{
              backgroundColor: settings?.card_background_color || '#ffffff',
              borderColor: settings?.card_border_color || '#e5e7eb',
              borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
            }}
          >
            <CardContent className="p-8">
              <div className="space-y-4">
                <div 
                  className="w-full rounded-full"
                  style={{ 
                    backgroundColor: settings?.progress_background_color || '#e5e7eb',
                    height: settings?.progress_height ? `${settings.progress_height * 4}px` : '32px'
                  }}
                >
                  <div 
                    className="rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: settings?.progress_bar_color || '#3b82f6',
                      height: settings?.progress_height ? `${settings.progress_height * 4}px` : '32px',
                      width: `${customerPackingData.progress_percentage}%`
                    }}
                  />
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

        {/* Completion Status */}
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

        {/* Footer */}
        <div className="text-center">
          <p style={{ color: settings?.text_color || '#6b7280', opacity: 0.8 }}>
            Sist oppdatert: {format(new Date(), 'HH:mm:ss')}
          </p>
          <p 
            className="text-sm mt-1"
            style={{ color: settings?.text_color || '#6b7280', opacity: 0.6 }}
          >
            Automatisk oppdatering hvert 30. sekund
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDisplay;
