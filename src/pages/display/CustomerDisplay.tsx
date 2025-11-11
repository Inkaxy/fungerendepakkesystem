
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package2, Clock } from 'lucide-react';
import { useDisplayRefresh } from '@/hooks/useDisplayRefresh';
import { generateDisplayStyles, packingStatusColorMap } from '@/utils/displayStyleUtils';
import CustomerHeader from '@/components/display/CustomerHeader';
import CustomerProductsList from '@/components/display/customer/CustomerProductsList';
import CustomerProgressBar from '@/components/display/customer/CustomerProgressBar';
import CustomerStatusIndicator from '@/components/display/customer/CustomerStatusIndicator';
import { 
  usePublicCustomerByDisplayUrl, 
  usePublicDisplaySettings, 
  usePublicActivePackingDate, 
  usePublicPackingData,
  usePublicPackingSession
} from '@/hooks/usePublicDisplayData';
import { useRealTimePublicDisplay } from '@/hooks/useRealTimePublicDisplay';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

const CustomerDisplay = () => {
  const { displayUrl } = useParams();
  const navigate = useNavigate();
  
  // Use public hooks that don't require authentication
  const { data: customer, isLoading: customerLoading } = usePublicCustomerByDisplayUrl(displayUrl || '');
  const { data: settings, isLoading: settingsLoading } = usePublicDisplaySettings(displayUrl || '');
  const { data: activePackingDate, isLoading: dateLoading } = usePublicActivePackingDate(customer?.bakery_id);
  
  // Bruk alltid dagens dato hvis ingen aktiv pakkesession finnes
  const displayDate = activePackingDate || format(new Date(), 'yyyy-MM-dd');
  
  const { data: packingData, isLoading: packingLoading } = usePublicPackingData(
    customer?.id, 
    customer?.bakery_id, 
    displayDate
  );
  const { data: packingSession } = usePublicPackingSession(
    customer?.bakery_id, 
    displayDate
  );
  
  // Add real-time listener for immediate updates
  useRealTimePublicDisplay(customer?.bakery_id);
  
  const { triggerRefresh } = useDisplayRefresh({ enabled: true, interval: 30000 });

  // Debug logging
  console.log('🔍 CustomerDisplay render:', {
    displayUrl,
    customer: customer ? { id: customer.id, name: customer.name } : null,
    customerLoading,
    settingsLoading,
    dateLoading,
    packingLoading,
    hasSettings: !!settings,
    activePackingDate,
  });

  const isToday = activePackingDate ? activePackingDate === format(new Date(), 'yyyy-MM-dd') : false;

  // Only wait for customer loading initially, then settings if customer exists
  const isInitialLoading = customerLoading || (customer && settingsLoading);
  if (isInitialLoading) {
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
    console.error('❌ Customer not found for URL:', displayUrl);
    console.log('💡 Tip: Sjekk at URL-en er riktig i kundeoversikten under "Display Management"');
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <Package2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Kunde ikke funnet</h2>
          <p className="text-gray-600 mb-2">
            Ingen kunde funnet for URL:
          </p>
          <code className="block bg-gray-100 px-3 py-2 rounded text-sm mb-4 text-gray-800">
            {displayUrl}
          </code>
          <p className="text-sm text-gray-500 mb-6">
            Sjekk at URL-en er riktig, eller gå til kundeoversikten for å finne riktig display-URL under "Display Management".
          </p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard/display/shared')}
          >
            Gå til felles display
          </Button>
        </div>
      </div>
    );
  }

  const customerPackingData = packingData?.find(data => data.id === customer.id);
  const displayStyles = settings ? generateDisplayStyles(settings) : {};
  const statusColors = settings ? packingStatusColorMap(settings) : { ongoing: '#3b82f6', completed: '#10b981' };

  // Helper function to calculate session-based progress
  const getSessionProgress = () => {
    if (packingSession && packingSession.status === 'completed') {
      return { percentage: 100, isCompleted: true };
    }
    
    if (customerPackingData) {
      return {
        percentage: customerPackingData.progress_percentage,
        isCompleted: customerPackingData.progress_percentage >= 100
      };
    }
    
    // Default to 0% if no data
    return { percentage: 0, isCompleted: false };
  };

  const sessionProgress = getSessionProgress();

  return (
    <div className="min-h-screen p-8" style={displayStyles}>
      <div className="max-w-4xl mx-auto space-y-8">
        <CustomerHeader
          customerName={customer.name}
          showRefresh={true}
          onRefresh={triggerRefresh}
          settings={settings}
        />

        {/* Date card - vises alltid */}
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
                {format(new Date(displayDate), 'dd.MM.yyyy', { locale: nb })}
                {!isToday && ' (ikke i dag)'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Content area - conditional basert på state */}
        {!customerPackingData || customerPackingData.products.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center p-12">
              <Package2 className="h-16 w-16 mx-auto mb-6 text-gray-400" />
              <p 
                className="text-xl mb-6"
                style={{ color: settings?.text_color || '#6b7280' }}
              >
                {!activePackingDate 
                  ? 'Ingen produkter valgt for pakking i dag'
                  : `${customer.name} har ingen aktive produkter valgt for pakking`
                }
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
                {!activePackingDate 
                  ? 'Gå til Pakking-siden for å velge produkter som skal pakkes'
                  : 'Produkter valgt for andre kunder vises ikke på denne kundespesifikke skjermen'
                }
              </p>
            </CardContent>
          </Card>
        ) : packingLoading ? (
          <Card
            style={{
              backgroundColor: settings?.card_background_color || '#ffffff',
              borderColor: settings?.card_border_color || '#e5e7eb',
              borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
            }}
          >
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p style={{ color: settings?.text_color || '#6b7280' }}>
                Oppdaterer produktliste...
              </p>
            </CardContent>
          </Card>
        ) : (
          <CustomerProductsList
            customerPackingData={customerPackingData}
            settings={settings}
            statusColors={statusColors}
          />
        )}

        {/* STATUS BAR - ALLTID SYNLIG */}
        <CustomerStatusIndicator
          isAllPacked={sessionProgress.isCompleted}
          settings={settings}
        />

        {/* PROGRESS BAR - ALLTID SYNLIG */}
        <CustomerProgressBar
          customerPackingData={
            customerPackingData || {
              id: customer.id,
              name: customer.name,
              products: [],
              overall_status: packingSession?.status === 'completed' ? 'completed' : 'ongoing',
              progress_percentage: sessionProgress.percentage,
              total_line_items: 0,
              packed_line_items: 0,
              total_line_items_all: 0,
              packed_line_items_all: 0,
            }
          }
          settings={settings}
        />

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
