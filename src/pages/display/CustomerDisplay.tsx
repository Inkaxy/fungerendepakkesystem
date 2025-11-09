
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package2, Clock } from 'lucide-react';
import { useDisplayRefresh } from '@/hooks/useDisplayRefresh';
import { useRealTimeDisplay } from '@/hooks/useRealTimeDisplay';
import { useRealTimeActivePackingProducts } from '@/hooks/useRealTimeActivePackingProducts';
import { generateDisplayStyles, packingStatusColorMap } from '@/utils/displayStyleUtils';
import CustomerHeader from '@/components/display/CustomerHeader';
import ConnectionStatus from '@/components/display/ConnectionStatus';
import CustomerProductsList from '@/components/display/customer/CustomerProductsList';
import CustomerProgressBar from '@/components/display/customer/CustomerProgressBar';
import CustomerStatusIndicator from '@/components/display/customer/CustomerStatusIndicator';
import { 
  usePublicCustomerByDisplayUrl, 
  usePublicDisplaySettings, 
  usePublicActivePackingDate, 
  usePublicPackingData 
} from '@/hooks/usePublicDisplayData';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

const CustomerDisplay = () => {
  const { displayUrl } = useParams();
  
  // Use public hooks that don't require authentication
  const { data: customer, isLoading: customerLoading } = usePublicCustomerByDisplayUrl(displayUrl || '');
  const { data: settings, isLoading: settingsLoading } = usePublicDisplaySettings(displayUrl || '');
  const { data: activePackingDate, isLoading: dateLoading } = usePublicActivePackingDate(customer?.bakery_id);
  const { data: packingData, isLoading: packingLoading } = usePublicPackingData(
    customer?.id, 
    customer?.bakery_id, 
    activePackingDate || undefined
  );
  
  const { connectionStatus } = useRealTimeDisplay();
  useRealTimeActivePackingProducts();
  const { triggerRefresh } = useDisplayRefresh({ enabled: true, interval: 30000 });

  const isToday = activePackingDate ? activePackingDate === format(new Date(), 'yyyy-MM-dd') : false;

  if (customerLoading || settingsLoading || dateLoading || packingLoading) {
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

  // If no active packing date, show message that no products are selected
  if (!activePackingDate) {
    return (
      <div className="min-h-screen p-8" style={displayStyles}>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-end">
            <ConnectionStatus status={connectionStatus} />
          </div>

          <CustomerHeader 
            customerName={customer.name}
            showRefresh={true}
            onRefresh={triggerRefresh}
            settings={settings}
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
      <div className="min-h-screen p-8" style={displayStyles}>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-end">
            <ConnectionStatus status={connectionStatus} />
          </div>

          <CustomerHeader 
            customerName={customer.name}
            showRefresh={true}
            onRefresh={triggerRefresh}
            settings={settings}
          />

          <Card
            style={{
              backgroundColor: settings?.card_background_color || '#ffffff',
              borderColor: settings?.card_border_color || '#e5e7eb',
              borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
            }}
          >
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2">
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
            </CardContent>
          </Card>

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
    <div className="min-h-screen p-8" style={displayStyles}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-end">
          <ConnectionStatus status={connectionStatus} />
        </div>

        <CustomerHeader 
          customerName={customer.name}
          showRefresh={true}
          onRefresh={triggerRefresh}
          settings={settings}
        />

        <Card
          style={{
            backgroundColor: settings?.card_background_color || '#ffffff',
            borderColor: settings?.card_border_color || '#e5e7eb',
            borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
          }}
        >
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2">
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
          </CardContent>
        </Card>

        <CustomerProductsList
          customerPackingData={customerPackingData}
          settings={settings}
          statusColors={statusColors}
        />

        <CustomerStatusIndicator
          isAllPacked={isAllPacked}
          settings={settings}
        />

        <CustomerProgressBar
          customerPackingData={customerPackingData}
          settings={settings}
        />

        {isAllPacked && settings?.show_status_indicator && (
          <CustomerStatusIndicator
            isAllPacked={true}
            settings={settings}
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
