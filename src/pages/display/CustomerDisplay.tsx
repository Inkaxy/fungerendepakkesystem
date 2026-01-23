
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
import FullscreenButton from '@/components/display/FullscreenButton';
import { 
  usePublicCustomerByDisplayUrl, 
  usePublicDisplaySettings, 
  usePublicActivePackingDate, 
  usePublicPackingData,
  usePublicPackingSession,
  usePublicActivePackingProducts
} from '@/hooks/usePublicDisplayData';
import { useRealTimePublicDisplay } from '@/hooks/useRealTimePublicDisplay';
import { usePackingBroadcastListener } from '@/hooks/usePackingBroadcastListener';
import { useDisplayRefreshBroadcast } from '@/hooks/useDisplayRefreshBroadcast';
import { useDisplayHeartbeat } from '@/hooks/useDisplayHeartbeat';
import { useWakeLock } from '@/hooks/useWakeLock';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { QUERY_KEYS } from '@/lib/queryKeys';

const CustomerDisplay = () => {
  const queryClient = useQueryClient();
  const { displayUrl } = useParams();
  const navigate = useNavigate();
  
  // ✅ Debounce for tom-state - forhindrer flimring ved sesjonsskifte
  const [showEmptyState, setShowEmptyState] = React.useState(false);
  
  // ✅ KRITISK FIX: Invalidate cache ved mount (ikke remove - unngår race condition)
  React.useEffect(() => {
    console.log('🔄 CustomerDisplay mounted - invaliderer display cache');
    
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_PRODUCTS[0]],
      exact: false,
      refetchType: 'active'
    });
    
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.PUBLIC_PACKING_DATA[0]],
      exact: false,
      refetchType: 'active'
    });
    
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_DATE[0]],
      exact: false,
      refetchType: 'active'
    });
    
    console.log('✅ Display cache invalidert - vil fetche fresh data');
  }, [queryClient]);
  
  // Use public hooks that don't require authentication
  const { data: customer, isLoading: customerLoading } = usePublicCustomerByDisplayUrl(displayUrl || '');
  const { data: settings, isLoading: settingsLoading } = usePublicDisplaySettings(customer?.bakery_id);
  const { data: activePackingDate, isLoading: dateLoading } = usePublicActivePackingDate(customer?.bakery_id);
  
  // ✅ Invalidate packing data når aktiv dato endres (ikke remove - unngår race condition)
  React.useEffect(() => {
    if (!customer?.bakery_id || !activePackingDate) return;
    
    queryClient.invalidateQueries({
      predicate: (query) => 
        query.queryKey[0] === QUERY_KEYS.PUBLIC_PACKING_DATA[0] &&
        query.queryKey[3] !== activePackingDate,
      refetchType: 'active'
    });
    console.log('🔄 Aktiv dato endret - invaliderte gamle packing cache entries');
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
    activeProducts, // ✅ KRITISK: Send activeProducts som parameter
    customer?.name  // ✅ FIX: Send customerName for å unngå JOIN med public_display_customers
  );
  const { data: packingSession } = usePublicPackingSession(
    customer?.bakery_id, 
    displayDate
  );
  
  // ✅ KRITISK: Real-time hooks MÅ kalles FØR noen conditional returns
  // Dette sikrer at WebSocket kobles til umiddelbart ved mount
  const { connectionStatus } = useRealTimePublicDisplay(customer?.bakery_id);
  useDisplayRefreshBroadcast(customer?.bakery_id, true);
  
  // ✅ NY: Broadcast listener for push-first oppdateringer (< 100ms latency)
  usePackingBroadcastListener(customer?.bakery_id);
  
  // Wake Lock - forhindrer at skjermen slukkes
  const { isActive: wakeLockActive, isSupported: wakeLockSupported } = useWakeLock();

  // 🔄 Fallback polling - kun når WebSocket er disconnected
  React.useEffect(() => {
    if (!customer?.bakery_id || connectionStatus === 'connected') return;

    console.log('⚠️ WebSocket disconnected - aktiverer fallback polling (5s interval)');

    const interval = setInterval(() => {
      if (document.hidden) return;

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
    }, 5000);

    return () => clearInterval(interval);
  }, [customer?.bakery_id, connectionStatus, queryClient]);

  // ✅ KONSOLIDERT: Heartbeat via felles hook (60s intervall)
  useDisplayHeartbeat({ bakeryId: customer?.bakery_id, enabled: !!customer?.bakery_id });

  // ✅ NY: Debounce for tom-state - forhindrer flimring ved sesjonsskifte
  React.useEffect(() => {
    if (!activeProducts || activeProducts.length === 0) {
      const timer = setTimeout(() => setShowEmptyState(true), 3000);
      return () => clearTimeout(timer);
    }
    setShowEmptyState(false);
  }, [activeProducts]);

  // ✅ Page Visibility API - refresh data når tab blir synlig igjen
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('⏸️ Display hidden - polling paused');
      } else {
        console.log('▶️ Display visible - refreshing data');
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PUBLIC_PACKING_DATA[0]],
          exact: false,
          refetchType: 'active'
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_PRODUCTS[0]],
          exact: false,
          refetchType: 'active'
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [queryClient]);
  
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

  // ✅ Ingen early return - la STATUS og PROGRESS alltid vises

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
                className="text-2xl font-semibold capitalize"
                style={{ 
                  color: !isToday ? '#dc2626' : (settings?.text_color || '#6b7280'),
                }}
              >
                {!isToday && 'PAKKING FOR: '}
                {format(new Date(displayDate), 'EEEE dd.MM.yy', { locale: nb })}
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
        ) : (!displayCustomerPackingData || displayCustomerPackingData.products.length === 0) && !showEmptyState ? (
          // ✅ Venter-state - vises i 3 sekunder før tom-state
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p 
                className="text-lg animate-pulse"
                style={{ color: settings?.text_color || '#6b7280' }}
              >
                Venter på produktvalg...
              </p>
            </CardContent>
          </Card>
        ) : (!displayCustomerPackingData || displayCustomerPackingData.products.length === 0) && showEmptyState ? (
          // ✅ Tom-state - vises etter 3 sekunders forsinkelse
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
          <div className="flex items-center justify-center gap-4 mb-2">
            <FullscreenButton settings={settings} />
            <ConnectionStatus status={connectionStatus} pollingActive={connectionStatus !== 'connected'} />
          </div>
          <p className="text-xs mt-2" style={{ color: settings?.text_color || '#6b7280', opacity: 0.6 }}>
            {connectionStatus === 'connected' 
              ? 'Automatiske oppdateringer via websockets' 
              : 'Fallback polling aktivt (5s interval)'}
          </p>
          {wakeLockSupported && (
            <div className="text-xs mt-1 flex items-center justify-center gap-1">
              <span className={`inline-block w-2 h-2 rounded-full ${wakeLockActive ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span style={{ color: settings?.text_color || '#6b7280', opacity: 0.6 }}>
                {wakeLockActive ? 'Skjerm holdes våken' : 'Wake Lock inaktiv'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDisplay;
