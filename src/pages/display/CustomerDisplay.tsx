
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package2 } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { usePackingData } from '@/hooks/usePackingData';
import { useDisplayRefresh } from '@/hooks/useDisplayRefresh';
import { useDisplaySettings, DisplaySettings } from '@/hooks/useDisplaySettings';
import { useRealTimeDisplay } from '@/hooks/useRealTimeDisplay';
import { useActivePackingDate } from '@/hooks/useActivePackingDate';
import { generateDisplayStyles, packingStatusColorMap } from '@/utils/displayStyleUtils';
import CustomerHeader from '@/components/display/CustomerHeader';
import ConnectionStatus from '@/components/display/ConnectionStatus';
import CustomerProductsList from '@/components/display/customer/CustomerProductsList';
import CustomerProgressBar from '@/components/display/customer/CustomerProgressBar';
import CustomerStatusIndicator from '@/components/display/customer/CustomerStatusIndicator';
import InteractiveControls from '@/components/display/InteractiveControls';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

const CustomerDisplay = () => {
  const { displayUrl } = useParams();
  const { data: customers, isLoading: customersLoading } = useCustomers();
  const { data: settings } = useDisplaySettings();
  
  const { connectionStatus } = useRealTimeDisplay();
  
  const { triggerRefresh } = useDisplayRefresh({ enabled: true, interval: 30000 });

  const customer = customers?.find(c => c.display_url === displayUrl);
  
  const { data: activePackingDate, isLoading: dateLoading } = useActivePackingDate();
  
  const { data: packingData, isLoading: packingLoading } = usePackingData(
    customer?.id, 
    activePackingDate || undefined,
    true
  );

  // Customer displays ignore screen size settings - use standard responsive layout
  const customerDisplaySettings = settings ? {
    ...settings,
    // Override screen size settings for customer displays
    screen_size_preset: 'standard' as const,
    force_single_screen: false,
    large_screen_optimization: false,
    customer_cards_columns: 1, // Single customer view
    body_font_size: 16,
    header_font_size: 32
  } : undefined;

  const isToday = activePackingDate ? activePackingDate === format(new Date(), 'yyyy-MM-dd') : false;

  if (customersLoading || dateLoading || packingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={customerDisplaySettings ? generateDisplayStyles(customerDisplaySettings) : {}}>
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
           style={customerDisplaySettings ? generateDisplayStyles(customerDisplaySettings) : {}}>
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
  const displayStyles = customerDisplaySettings ? generateDisplayStyles(customerDisplaySettings) : {};
  const statusColors = settings ? packingStatusColorMap(settings) : { ongoing: '#3b82f6', completed: '#10b981' };

  // If no active packing date, show message that no products are selected
  if (!activePackingDate) {
    return (
      <div className="min-h-screen p-8 relative" style={displayStyles}>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Connection status overlay in bottom right */}
          <div className="fixed bottom-4 right-4 z-10">
            <ConnectionStatus status={connectionStatus} className="opacity-80 hover:opacity-100 transition-opacity" />
          </div>

          <CustomerHeader 
            customerName={customer.name}
            settings={customerDisplaySettings}
          />

          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center p-12">
              <Package2 className="h-16 w-16 mx-auto mb-6 text-gray-400" />
              <p 
                className="text-xl mb-6"
                style={{ color: settings?.text_color || '#6b7280' }}
              >
                Ingen produkter valgt for pakking
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

  if (!customerPackingData || customerPackingData.products.length === 0) {
    return (
      <div className="min-h-screen p-8 relative" style={displayStyles}>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Connection status overlay in bottom right */}
          <div className="fixed bottom-4 right-4 z-10">
            <ConnectionStatus status={connectionStatus} className="opacity-80 hover:opacity-100 transition-opacity" />
          </div>

          <CustomerHeader 
            customerName={customer.name}
            settings={customerDisplaySettings}
          />

          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center p-12">
              <Package2 className="h-16 w-16 mx-auto mb-6 text-gray-400" />
              <p 
                className="text-xl mb-6"
                style={{ color: settings?.text_color || '#6b7280' }}
              >
                {customer.name} har ingen aktive produkter valgt for pakking
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
                Produkter valgt for andre kunder vises ikke på denne kundespesifikke skjermen
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isAllPacked = customerPackingData.progress_percentage >= 100;

  return (
    <div 
      className="min-h-screen relative" 
      style={{
        ...displayStyles,
        padding: `${customerDisplaySettings?.display_padding || 32}px`,
        margin: `${customerDisplaySettings?.display_margin || 8}px`,
      }}
    >
      <InteractiveControls 
        settings={customerDisplaySettings || {} as DisplaySettings} 
        onRefresh={triggerRefresh}
      />
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Connection status overlay in bottom right */}
        <div className="fixed bottom-4 right-4 z-10">
          <ConnectionStatus status={connectionStatus} className="opacity-80 hover:opacity-100 transition-opacity" />
        </div>

        <CustomerHeader 
          customerName={customer.name}
          settings={customerDisplaySettings}
        />

        <CustomerProductsList
          customerPackingData={customerPackingData}
          settings={customerDisplaySettings}
          statusColors={statusColors}
        />

        <CustomerStatusIndicator
          isAllPacked={isAllPacked}
          settings={customerDisplaySettings}
        />

        <CustomerProgressBar
          customerPackingData={customerPackingData}
          settings={customerDisplaySettings}
        />

        {isAllPacked && customerDisplaySettings?.show_status_indicator && (
          <CustomerStatusIndicator
            isAllPacked={true}
            settings={customerDisplaySettings}
          />
        )}

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
