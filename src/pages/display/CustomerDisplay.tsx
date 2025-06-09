
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Package2 } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { usePackingData } from '@/hooks/usePackingData';
import { useRealTimeOrders } from '@/hooks/useRealTimeOrders';
import { useDisplayRefresh } from '@/hooks/useDisplayRefresh';
import { useDisplaySettings } from '@/hooks/useDisplaySettings';
import { generateDisplayStyles, packingStatusColorMap } from '@/utils/displayStyleUtils';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

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
      <div className="min-h-screen flex items-center justify-center p-8"
           style={displayStyles}>
        <Card className="max-w-2xl w-full">
          <CardContent className="text-center p-12">
            <Package2 className="h-16 w-16 mx-auto mb-6 text-gray-400" />
            <h1 
              className="text-4xl font-bold mb-4"
              style={{ color: settings?.header_text_color || '#111827' }}
            >
              {customer.name}
            </h1>
            <p 
              className="text-xl mb-6"
              style={{ color: settings?.text_color || '#6b7280' }}
            >
              Ingen pakking planlagt for i dag
            </p>
            <Button variant="outline" onClick={triggerRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Oppdater
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={displayStyles}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with customer name and refresh */}
        <div className="flex justify-between items-center">
          <div className="text-center flex-1">
            <h1 
              className="font-bold mb-2"
              style={{ 
                fontSize: settings?.header_font_size ? `${settings.header_font_size}px` : '3rem',
                color: settings?.header_text_color || '#111827'
              }}
            >
              {customer.name}
            </h1>
            <p 
              className="text-xl"
              style={{ 
                color: settings?.text_color || '#6b7280',
                fontSize: settings?.body_font_size ? `${settings.body_font_size * 1.25}px` : '1.25rem'
              }}
            >
              Pakkeskjerm - {format(new Date(), 'dd. MMMM yyyy', { locale: nb })}
            </p>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={triggerRefresh}
            className="ml-4"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Oppdater
          </Button>
        </div>

        {/* Products to pack (max 3) */}
        <Card
          style={{
            backgroundColor: settings?.card_background_color || '#ffffff',
            borderColor: settings?.card_border_color || '#e5e7eb',
            borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
            boxShadow: settings?.card_shadow_intensity ? `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)` : undefined
          }}
        >
          <CardContent className="p-8">
            <div className="space-y-6">
              {customerPackingData.products.map((product, index) => (
                <div 
                  key={product.id}
                  className="flex items-center justify-between p-6 rounded-lg"
                  style={{
                    backgroundColor: settings?.product_card_color || '#f9fafb',
                    borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
                  }}
                >
                  {/* Product info */}
                  <div className="flex-1">
                    <h3 
                      className="font-bold mb-2"
                      style={{ 
                        color: settings?.product_text_color || '#111827',
                        fontSize: settings?.body_font_size ? `${settings.body_font_size * 1.5}px` : '1.5rem'
                      }}
                    >
                      {product.product_name}
                    </h3>
                    <p 
                      className="text-sm mb-1"
                      style={{ color: settings?.product_accent_color || '#6b7280' }}
                    >
                      Kategori: {product.product_category}
                    </p>
                    <p 
                      className="text-lg"
                      style={{ color: settings?.product_accent_color || '#6b7280' }}
                    >
                      {product.quantity_packed} av {product.quantity_ordered} pakket
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="flex-1 mx-8">
                    <div className="relative">
                      <div 
                        className="w-full rounded-full"
                        style={{ 
                          backgroundColor: settings?.progress_background_color || '#e5e7eb',
                          height: settings?.progress_height ? `${settings.progress_height * 2}px` : '16px'
                        }}
                      >
                        <div 
                          className="rounded-full transition-all duration-300"
                          style={{ 
                            backgroundColor: settings?.progress_bar_color || '#3b82f6',
                            height: settings?.progress_height ? `${settings.progress_height * 2}px` : '16px',
                            width: `${Math.round((product.quantity_packed / product.quantity_ordered) * 100)}%`
                          }}
                        />
                      </div>
                      {settings?.show_progress_percentage && (
                        <div 
                          className="absolute right-0 top-0 transform translate-x-full ml-4 text-lg font-semibold"
                          style={{ color: settings?.text_color || '#374151' }}
                        >
                          {Math.round((product.quantity_packed / product.quantity_ordered) * 100)}%
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="flex-shrink-0">
                    <Badge
                      className="text-lg px-4 py-2 font-semibold"
                      style={{
                        backgroundColor: product.packing_status === 'completed' 
                          ? statusColors.completed
                          : statusColors.ongoing,
                        color: 'white'
                      }}
                    >
                      {product.packing_status === 'completed' ? 'Ferdig pakket' : 'Pågående'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Overall status */}
        <Card
          className="text-center"
          style={{
            backgroundColor: settings?.card_background_color || '#ffffff',
            borderColor: settings?.card_border_color || '#e5e7eb',
            borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
          }}
        >
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-6">
              <div>
                <p 
                  className="text-xl mb-2"
                  style={{ color: settings?.text_color || '#6b7280' }}
                >
                  Total fremdrift
                </p>
                <p 
                  className="text-4xl font-bold"
                  style={{ color: settings?.text_color || '#111827' }}
                >
                  {customerPackingData.progress_percentage}%
                </p>
              </div>
              <div className="flex-1 max-w-md">
                <div 
                  className="w-full rounded-full"
                  style={{ 
                    backgroundColor: settings?.progress_background_color || '#e5e7eb',
                    height: settings?.progress_height ? `${settings.progress_height * 3}px` : '24px'
                  }}
                >
                  <div 
                    className="rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: settings?.progress_bar_color || '#3b82f6',
                      height: settings?.progress_height ? `${settings.progress_height * 3}px` : '24px',
                      width: `${customerPackingData.progress_percentage}%`
                    }}
                  />
                </div>
              </div>
              <Badge
                className="text-2xl px-6 py-3 font-bold"
                style={{
                  backgroundColor: customerPackingData.overall_status === 'completed' 
                    ? statusColors.completed
                    : statusColors.ongoing,
                  color: 'white'
                }}
              >
                {customerPackingData.overall_status === 'completed' ? 'Ferdig pakket' : 'Pågående'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p style={{ color: settings?.text_color || '#6b7280', opacity: 0.8 }}>
            Sist oppdatert: {format(new Date(), 'HH:mm:ss', { locale: nb })}
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
