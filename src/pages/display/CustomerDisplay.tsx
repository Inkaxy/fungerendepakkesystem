
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package2, Clock } from 'lucide-react';
import { generateDisplayStyles, packingStatusColorMap } from '@/utils/displayStyleUtils';
import CustomerHeader from '@/components/display/CustomerHeader';
import CustomerProductsList from '@/components/display/customer/CustomerProductsList';
import CustomerProgressBar from '@/components/display/customer/CustomerProgressBar';
import CustomerStatusIndicator from '@/components/display/customer/CustomerStatusIndicator';
import ConnectionStatus from '@/components/display/ConnectionStatus';
import { 
  usePublicCustomerByDisplayUrl, 
  usePublicDisplaySettings, 
  usePublicActivePackingDate, 
  usePublicPackingData,
  usePublicPackingSession,
  usePublicActivePackingProducts
} from '@/hooks/usePublicDisplayData';
import { useRealTimePublicDisplay } from '@/hooks/useRealTimePublicDisplay';
import { useDisplayRefreshBroadcast } from '@/hooks/useDisplayRefreshBroadcast';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { QUERY_KEYS } from '@/lib/queryKeys';

const isDebugMode = import.meta.env.DEV;

const CustomerDisplay = () => {
  const queryClient = useQueryClient();
  const { displayUrl } = useParams();
  const navigate = useNavigate();
  
  // ✅ KRITISK FIX: HARD RESET av ALL cache ved mount
  React.useEffect(() => {
    console.log('🔄 CustomerDisplay mounted - HARD RESET av display cache');
    
    queryClient.removeQueries({
      queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_PRODUCTS[0]],
      exact: false
    });
    
    queryClient.removeQueries({
      queryKey: [QUERY_KEYS.PUBLIC_PACKING_DATA[0]],
      exact: false
    });
    
    queryClient.removeQueries({
      queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_DATE[0]],
      exact: false
    });
    
    console.log('✅ Display cache RESATT - vil fetche fresh data');
  }, [queryClient]);
  
  // Use public hooks that don't require authentication
  const { data: customer, isLoading: customerLoading } = usePublicCustomerByDisplayUrl(displayUrl || '');
  const { data: settings, isLoading: settingsLoading } = usePublicDisplaySettings(customer?.bakery_id);
  const { data: activePackingDate, isLoading: dateLoading } = usePublicActivePackingDate(customer?.bakery_id);
  
  // ✅ Force reset av packing data når aktiv dato endres
  React.useEffect(() => {
    if (!customer?.bakery_id || !activePackingDate) return;
    
    queryClient.removeQueries({
      predicate: (query) => 
        query.queryKey[0] === QUERY_KEYS.PUBLIC_PACKING_DATA[0] &&
        query.queryKey[3] !== activePackingDate,
    });
    console.log('🔄 Aktiv dato endret - fjernet gamle packing cache entries');
  }, [customer?.bakery_id, activePackingDate, queryClient]);
  
  // Bruk alltid dagens dato hvis ingen aktiv pakkesession finnes
  const displayDate = activePackingDate || format(new Date(), 'yyyy-MM-dd');
  
  // ✅ Hent activeProducts FØR usePublicPackingData
  const { data: activeProducts, isLoading: activeProductsLoading } = usePublicActivePackingProducts(
    customer?.bakery_id,
    displayDate
  );
  
  const { data: packingData, isLoading: packingLoading } = usePublicPackingData(
    customer?.id, 
    customer?.bakery_id, 
    displayDate,
    activeProducts // ✅ KRITISK: Send activeProducts som parameter
  );
  const { data: packingSession } = usePublicPackingSession(
    customer?.bakery_id, 
    displayDate
  );
  
  // ✅ KRITISK: Real-time hooks MÅ kalles FØR noen conditional returns
  // Dette sikrer at WebSocket kobles til umiddelbart ved mount
  const { connectionStatus } = useRealTimePublicDisplay(customer?.bakery_id);
  useDisplayRefreshBroadcast(customer?.bakery_id, true);

  // 🔄 Ekstra sikkerhet: poll backend jevnlig i tilfelle websocket ikke treffer
  // ✅ Smart polling - kun når WebSocket er disconnected
  React.useEffect(() => {
    if (!customer?.bakery_id || connectionStatus === 'connected') return;

    console.log('⚠️ WebSocket disconnected - aktiverer fallback polling (5s interval)');

    const interval = setInterval(() => {
      console.log('🔄 Fallback polling: Invalidating queries...');
      
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_PRODUCTS[0]],
        exact: false,
        refetchType: 'active',
      });
      
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PUBLIC_PACKING_DATA[0]],
        exact: false,
        refetchType: 'active',
      });
    }, 5000); // ✅ Lengre intervall siden det er fallback

    return () => clearInterval(interval);
  }, [customer?.bakery_id, connectionStatus, queryClient]);
  
  // ✅ GUARD: Ikke fortsett før activeProducts er lastet
  if (activeProductsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={settings ? generateDisplayStyles(settings) : {}}>
        <Card className="max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Henter aktive produkter...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ GUARD: Hvis ingen active products, vis tom state
  if (!activeProducts || activeProducts.length === 0) {
    return (
      <div className="min-h-screen p-8" style={settings ? generateDisplayStyles(settings) : {}}>
        <div className="max-w-4xl mx-auto">
          <CustomerHeader
            customerName={customer?.name || ''}
            showRefresh={false}
            settings={settings}
          />
          <Card className="mt-8">
            <CardContent className="text-center p-12">
              <Package2 className="h-16 w-16 mx-auto mb-6 text-gray-400" />
              <p className="text-xl mb-4">Ingen produkter valgt for pakking i dag</p>
              <p className="text-sm text-gray-500">
                Gå til Pakking-siden for å velge produkter som skal pakkes
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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

  // 🧠 Filtrer kundens produkter basert på aktive produkter i DB
  const maxProducts = settings?.max_products_per_card ?? 3;
  const displayProducts =
    customerPackingData && activeProducts
      ? customerPackingData.products
          .filter(p =>
            activeProducts.some(ap => 
              ap.product_id === p.product_id || ap.product_name === p.product_name
            )
          )
          .slice(0, maxProducts) // ✅ Dynamisk maks produkter
      : customerPackingData?.products ?? [];

  const displayCustomerPackingData = customerPackingData
    ? { ...customerPackingData, products: displayProducts }
    : undefined;
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
          showRefresh={false}
          settings={settings}
        />

        {/* DEBUG PANEL - Kun i development */}
        {isDebugMode && (
          <Card className="border-2 border-yellow-500 bg-yellow-50">
            <CardContent className="p-3 text-sm space-y-1">
              <p className="font-bold text-yellow-900">🔍 DEBUG INFO:</p>
              <p className="text-yellow-800">
                <strong>Aktive produkter i DB:</strong> {activeProducts?.length || 0}
              </p>
              <p className="text-yellow-800">
                <strong>Fra DB:</strong> {activeProducts?.map(ap => ap.product_name).join(', ') || 'Ingen'}
              </p>
              <p className="text-yellow-800">
                <strong>Vises på display:</strong> {displayCustomerPackingData?.products.map(p => p.product_name).join(', ') || 'Ingen'}
              </p>
              <p className="text-yellow-800">
                <strong>Antall viste:</strong> {displayCustomerPackingData?.products.length || 0}
              </p>
            </CardContent>
          </Card>
        )}

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
        {activeProductsLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p style={{ color: settings?.text_color || '#6b7280' }}>Henter aktive produkter...</p>
            </CardContent>
          </Card>
        ) : !displayCustomerPackingData || displayCustomerPackingData.products.length === 0 ? (
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
            customerPackingData={displayCustomerPackingData || customerPackingData}
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
          <ConnectionStatus status={connectionStatus} pollingActive={connectionStatus !== 'connected'} />
          <p className="text-xs mt-2" style={{ color: settings?.text_color || '#6b7280', opacity: 0.6 }}>
            {connectionStatus === 'connected' 
              ? 'Automatiske oppdateringer via websockets' 
              : 'Fallback polling aktivt (5s interval)'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDisplay;
