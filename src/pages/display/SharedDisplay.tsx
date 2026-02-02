import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import SharedDisplayHeader from '@/components/display/shared/SharedDisplayHeader';
import OptimizedCustomerCard from '@/components/display/shared/OptimizedCustomerCard';
import DemoCustomerCard from '@/components/display/shared/DemoCustomerCard';
import EmptyPackingState from '@/components/display/shared/EmptyPackingState';
import AutoFitGrid from '@/components/display/shared/AutoFitGrid';
import ConnectionStatus from '@/components/display/ConnectionStatus';
import FullscreenButton from '@/components/display/FullscreenButton';
import { useRealTimePublicDisplay } from '@/hooks/useRealTimePublicDisplay';
import { usePackingBroadcastListener } from '@/hooks/usePackingBroadcastListener';
import { useDisplayRefreshBroadcast } from '@/hooks/useDisplayRefreshBroadcast';
import { useDisplayHeartbeat } from '@/hooks/useDisplayHeartbeat';
import { useWakeLock } from '@/hooks/useWakeLock';
import { useResolveBakeryId } from '@/hooks/useResolveBakeryId';
import { 
  usePublicDisplaySettings,
  usePublicActivePackingDate,
  usePublicSharedDisplayCustomers,
  usePublicActivePackingProducts,
  usePublicAllCustomersPackingData
} from '@/hooks/usePublicDisplayData';
import { generateDisplayStyles, statusColorMap } from '@/utils/displayStyleUtils';
import { format } from 'date-fns';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { cn } from '@/lib/utils';
import { DEMO_CUSTOMERS, DEMO_PACKING_DATA, DEMO_PACKING_DATE } from '@/utils/demoDisplayData';
import { getDefaultSettings } from '@/utils/displaySettingsDefaults';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { PackingCustomer } from '@/hooks/usePackingData';

const SharedDisplay = () => {
  // shortId kan være enten short_id (6 tegn) eller full UUID (36 tegn) for bakoverkompatibilitet
  const { shortId } = useParams<{ shortId: string }>();
  
  // ✅ Oppløs short_id til full bakery_id (UUID)
  const { data: resolvedBakeryId, isLoading: isResolvingId } = useResolveBakeryId(shortId);
  const bakeryId = resolvedBakeryId; // Bruk oppløst UUID
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');
  
  // ✅ Demo-modus sjekk
  const isDemo = searchParams.get('demo') === 'true';
  
  // Bruk public hooks - ingen autentisering nødvendig
  const { data: customers, isLoading: customersLoading } = usePublicSharedDisplayCustomers(bakeryId);
  const { data: dbSettings } = usePublicDisplaySettings(bakeryId);
  const { data: activePackingDate, isLoading: dateLoading } = usePublicActivePackingDate(bakeryId);

  // ✅ Fallback-innstillinger for demo-modus når database-innstillinger ikke er tilgjengelige
  const effectiveSettings = useMemo((): DisplaySettings | undefined => {
    if (dbSettings) return dbSettings;
    
    // Fallback for demo-modus når settings ikke er tilgjengelig
    if (isDemo) {
      return {
        ...getDefaultSettings('demo'),
        auto_fit_screen: true, // Aktiver auto-fit i demo
        id: 'demo-settings'
      } as DisplaySettings;
    }
    
    return undefined;
  }, [dbSettings, isDemo]);
  
  // ✅ Ekte kunder (kun for non-demo)
  const realCustomers = customers?.filter(c => !c.has_dedicated_display && c.status === 'active') || [];
  
  const effectivePackingDate = isDemo ? DEMO_PACKING_DATE : activePackingDate;

  // ✅ OPTIMALISERING: Heis activeProducts til topp-nivå (eliminerer N-1 dupliserte queries)
  const { data: activeProducts, isLoading: productsLoading } = usePublicActivePackingProducts(
    isDemo ? undefined : bakeryId,
    effectivePackingDate
  );
  
  // ✅ OPTIMALISERING: Bruk batch-query for ALLE kunder (eliminerer N separate queries)
  const customersList = useMemo(() => 
    realCustomers.map(c => ({ id: c.id, name: c.name })), 
    [realCustomers]
  );
  
  const { data: allPackingData, isLoading: packingDataLoading } = usePublicAllCustomersPackingData(
    isDemo ? undefined : bakeryId,
    customersList,
    effectivePackingDate,
    activeProducts
  );
  
  // ✅ Lag en O(1) lookup-map for packing data
  const packingDataMap = useMemo(() => {
    const map = new Map<string, PackingCustomer>();
    allPackingData?.forEach(d => map.set(d.id, d));
    return map;
  }, [allPackingData]);
  
  // Real-time listener for cache updates (WebSocket fra postgres_changes) - skip i demo
  const { connectionStatus } = useRealTimePublicDisplay(isDemo ? undefined : bakeryId);
  
  // ✅ NY: Broadcast listener for push-first oppdateringer (< 100ms latency) - skip i demo
  usePackingBroadcastListener(isDemo ? undefined : bakeryId);
  
  // Lytt på refresh broadcasts fra admin - skip i demo
  useDisplayRefreshBroadcast(isDemo ? undefined : bakeryId, !isDemo);

  // Wake Lock - forhindrer at skjermen slukkes
  const { isActive: wakeLockActive, isSupported: wakeLockSupported } = useWakeLock();

  // 🔄 Fallback/Force polling - aktiveres når WebSocket er disconnected ELLER force_polling er på
  useEffect(() => {
    const shouldPoll = (effectiveSettings?.force_polling === true) || connectionStatus !== 'connected';
    if (isDemo || !bakeryId || !shouldPoll) return;

    const reason = effectiveSettings?.force_polling ? 'force_polling aktivert' : 'WebSocket disconnected';
    console.log(`⚠️ ${reason} - aktiverer polling (5s interval)`);

    const interval = setInterval(() => {
      if (document.hidden) return;

      console.log('🔄 Fallback polling: Invalidating queries...');
      
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_PRODUCTS[0]],
        exact: false,
        refetchType: 'active',
      });

      // ✅ Viktig: innstillinger må også refetches når WS er nede
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PUBLIC_DISPLAY_SETTINGS[0], bakeryId],
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
  }, [isDemo, bakeryId, connectionStatus, effectiveSettings?.force_polling, queryClient]);

  // ✅ KONSOLIDERT: Heartbeat via felles hook (60s intervall) - skip i demo
  useDisplayHeartbeat({ bakeryId: isDemo ? undefined : bakeryId, enabled: !isDemo && !!bakeryId });

  // ✅ Invalidate cache ved mount (ikke remove - forhindrer race condition) - skip i demo
  useEffect(() => {
    if (isDemo || !bakeryId) return;
    
    console.log('🔄 SharedDisplay: Invalidating cache ved mount');
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
  }, [isDemo, bakeryId, queryClient]);

  // Force invalidate av packing data når aktiv dato endres - skip i demo
  useEffect(() => {
    if (isDemo || !bakeryId || !activePackingDate) return;
    
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
    console.log('🔄 Aktiv dato endret - invaliderer packing cache');
  }, [isDemo, bakeryId, activePackingDate, queryClient]);

  // ✅ Page Visibility API - oppdater data når skjerm/tab våkner fra dvale
  useEffect(() => {
    if (isDemo) return;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('⏸️ SharedDisplay hidden - polling paused');
      } else {
        console.log('▶️ SharedDisplay visible - refreshing all data');
        
        if (bakeryId) {
          // Oppdater innstillinger
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.PUBLIC_DISPLAY_SETTINGS[0], bakeryId],
            exact: false,
            refetchType: 'active',
          });
        }
        
        // Oppdater aktive produkter
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_PRODUCTS[0]],
          exact: false,
          refetchType: 'active',
        });
        
        // Oppdater pakkedata
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PUBLIC_PACKING_DATA[0]],
          exact: false,
          refetchType: 'active',
        });
        
        // Oppdater aktiv dato
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_DATE[0]],
          exact: false,
          refetchType: 'active',
        });
        
        console.log('✅ Cache invalidert - data vil oppdateres');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isDemo, bakeryId, queryClient]);

  // 🔄 Auto-scroll funksjonalitet
  useEffect(() => {
    if (!effectiveSettings?.shared_auto_scroll || !scrollContainerRef.current) return;

    const scrollSpeed = effectiveSettings?.shared_scroll_speed || 30; // px per sekund
    const container = scrollContainerRef.current;
    let animationFrameId: number;
    let lastTimestamp: number;

    const scroll = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      const scrollAmount = (scrollSpeed * delta) / 1000;
      
      if (scrollDirection === 'down') {
        container.scrollTop += scrollAmount;
        // Sjekk om vi har nådd bunnen
        if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
          setScrollDirection('up');
        }
      } else {
        container.scrollTop -= scrollAmount;
        // Sjekk om vi har nådd toppen
        if (container.scrollTop <= 10) {
          setScrollDirection('down');
        }
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [effectiveSettings?.shared_auto_scroll, effectiveSettings?.shared_scroll_speed, scrollDirection]);

  // Apply customer sorting and filtering based on settings (kun for ekte kunder)
  const sortedCustomers = useMemo(() => {
    let customerList = [...realCustomers];
    
    if (effectiveSettings?.customer_sort_order === 'alphabetical') {
      return customerList.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return customerList;
  }, [realCustomers, effectiveSettings?.customer_sort_order]);

  // ✅ Pre-filter kunder til kun de som har ordrer (total_line_items_all > 0)
  // Dette sikrer at AutoFitGrid beregner riktig antall celler uten tomme hull
  // VIKTIG: Returner tom array hvis data fortsatt lastes for å unngå feil filtrering
  const visibleCustomers = useMemo(() => {
    // ✅ FIX: Hvis packing data ikke er lastet ennå, ikke filtrer ut kunder
    if (!allPackingData || allPackingData.length === 0) {
      // Returner alle kunder midlertidig under lasting, eller tom hvis ingen data
      return packingDataLoading ? sortedCustomers : [];
    }
    
    return sortedCustomers.filter(c => {
      const data = packingDataMap.get(c.id);
      // Vis kunder som har ordrer for datoen
      if (!data || data.total_line_items_all <= 0) return false;
      
      // Skjul fullførte kunder hvis innstillingen er på
      if (effectiveSettings?.shared_hide_completed_customers && data.progress_percentage === 100) {
        return false;
      }
      
      return true;
    });
  }, [sortedCustomers, packingDataMap, allPackingData, packingDataLoading, effectiveSettings?.shared_hide_completed_customers]);
  
  // Demo-kunder sortert
  const sortedDemoCustomers = useMemo(() => {
    if (!isDemo) return [];
    let demoList = DEMO_CUSTOMERS.filter(c => !c.has_dedicated_display);
    if (effectiveSettings?.customer_sort_order === 'alphabetical') {
      return demoList.sort((a, b) => a.name.localeCompare(b.name));
    }
    return demoList;
  }, [isDemo, effectiveSettings?.customer_sort_order]);

  const displayStyles = effectiveSettings ? generateDisplayStyles(effectiveSettings) : {};
  const statusColors = effectiveSettings ? statusColorMap(effectiveSettings) : {
    pending: '#f59e0b',
    in_progress: '#3b82f6',
    completed: '#10b981',
    delivered: '#059669'
  };

  const isToday = effectivePackingDate ? effectivePackingDate === format(new Date(), 'yyyy-MM-dd') : false;
  // ✅ FIX: Inkluder packingDataLoading for å unngå tom-tilstand før data er hentet
  // Inkluderer også ID-oppløsning for short_id
  const isLoading = isDemo ? false : (isResolvingId || dateLoading || customersLoading || packingDataLoading);

  // Determine grid columns class based on settings
  const getCustomerGridClass = () => {
    const columns = effectiveSettings?.customer_cards_columns || 3;
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 5: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5';
      case 6: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  // Vis feilmelding hvis bakeryId mangler
  if (!bakeryId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="text-center p-12">
            <h2 className="text-xl font-semibold text-destructive mb-4">
              Ugyldig display-URL
            </h2>
            <p className="text-muted-foreground">
              Denne display-URLen mangler bakeri-ID. 
              Kontakt administrator for korrekt URL.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const contentPadding = effectiveSettings?.shared_content_padding ?? 24;

  return (
    <div 
      className={cn(
        "min-h-screen",
        effectiveSettings?.auto_fit_screen && "h-screen flex flex-col overflow-hidden"
      )}
      style={{
        ...displayStyles,
        padding: `${contentPadding}px`
      }}
    >
      <div 
        ref={scrollContainerRef}
        className={cn(
          "mx-auto w-full",
          effectiveSettings?.shared_auto_scroll && !effectiveSettings?.auto_fit_screen && 'overflow-hidden h-screen',
          effectiveSettings?.auto_fit_screen && 'flex-1 min-h-0 flex flex-col overflow-hidden'
        )}
      >
        <SharedDisplayHeader 
          settings={effectiveSettings}
          connectionStatus={isDemo ? 'demo' : connectionStatus}
          activePackingDate={effectivePackingDate}
        />

        {/* Loading state - kun for ikke-demo */}
        {!isDemo && isLoading && (
          <Card
            style={{
              backgroundColor: effectiveSettings?.card_background_color || '#ffffff',
              borderColor: effectiveSettings?.card_border_color || '#e5e7eb',
              borderRadius: effectiveSettings?.border_radius ? `${effectiveSettings.border_radius}px` : '0.5rem',
            }}
          >
            <CardContent className="text-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p style={{ color: effectiveSettings?.text_color || '#6b7280' }}>
                Laster pakkeinformasjon...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tom tilstand når ingen aktiv pakkingsdato - kun for ikke-demo */}
        {!isDemo && !isLoading && !effectivePackingDate && (
          <EmptyPackingState
            settings={effectiveSettings}
            activePackingDate={null}
            isToday={false}
          />
        )}

        {/* Demo-modus: Vis demo-kort */}
        {isDemo && effectiveSettings?.auto_fit_screen && (
          <div className="flex-1 min-h-0">
            <AutoFitGrid 
              customerCount={DEMO_PACKING_DATA.length} 
              settings={effectiveSettings}
            >
              {DEMO_PACKING_DATA.map((demoData) => (
                <DemoCustomerCard
                  key={demoData.id}
                  customerData={demoData}
                  settings={effectiveSettings}
                  statusColors={statusColors}
                  hideWhenCompleted={effectiveSettings?.shared_hide_completed_customers}
                  completedOpacity={effectiveSettings?.shared_completed_customer_opacity}
                />
              ))}
            </AutoFitGrid>
          </div>
        )}

        {isDemo && !effectiveSettings?.auto_fit_screen && (
          <div 
            className={`grid ${getCustomerGridClass()} gap-6 mb-8`}
            style={{ 
              gap: effectiveSettings?.customer_cards_gap ? `${effectiveSettings.customer_cards_gap}px` : '24px' 
            }}
          >
            {DEMO_PACKING_DATA.map((demoData) => (
              <DemoCustomerCard
                key={demoData.id}
                customerData={demoData}
                settings={effectiveSettings}
                statusColors={statusColors}
                hideWhenCompleted={effectiveSettings?.shared_hide_completed_customers}
                completedOpacity={effectiveSettings?.shared_completed_customer_opacity}
              />
            ))}
          </div>
        )}

        {/* Ekte data: Vis ekte kunder */}
        {/* Ekte data: Vis synlige kunder (pre-filtrert for å unngå tomme hull i grid) */}
        {!isDemo && !isLoading && effectivePackingDate && visibleCustomers.length > 0 && (
          effectiveSettings?.auto_fit_screen ? (
            <div className="flex-1 min-h-0">
              <AutoFitGrid 
                customerCount={visibleCustomers.length} 
                settings={effectiveSettings}
              >
                {visibleCustomers.map((customer) => (
                  <OptimizedCustomerCard
                    key={customer.id}
                    customer={customer}
                    packingData={packingDataMap.get(customer.id)}
                    settings={effectiveSettings}
                    statusColors={statusColors}
                    hideWhenCompleted={false}
                    completedOpacity={effectiveSettings?.shared_completed_customer_opacity}
                    isLoading={packingDataLoading}
                  />
                ))}
              </AutoFitGrid>
            </div>
          ) : (
            <div 
              className={`grid ${getCustomerGridClass()} gap-6 mb-8`}
              style={{ 
                gap: effectiveSettings?.customer_cards_gap ? `${effectiveSettings.customer_cards_gap}px` : '24px' 
              }}
            >
              {visibleCustomers.map((customer) => (
                <OptimizedCustomerCard
                  key={customer.id}
                  customer={customer}
                  packingData={packingDataMap.get(customer.id)}
                  settings={effectiveSettings}
                  statusColors={statusColors}
                  hideWhenCompleted={false}
                  completedOpacity={effectiveSettings?.shared_completed_customer_opacity}
                  isLoading={packingDataLoading}
                />
              ))}
            </div>
          )
        )}

        {/* Tom tilstand: Vis kun for ekte data når ingen synlige kunder */}
        {!isDemo && !isLoading && effectivePackingDate && visibleCustomers.length === 0 && (
          <EmptyPackingState
            settings={effectiveSettings}
            activePackingDate={effectivePackingDate}
            isToday={isToday}
          />
        )}

        {/* Footer - kun vis inni scroll-container hvis IKKE auto_fit_screen */}
        {!effectiveSettings?.auto_fit_screen && (
          <div className="text-center mt-8">
            <div className="flex items-center justify-center gap-4 mb-2">
              <FullscreenButton settings={effectiveSettings} />
              <ConnectionStatus 
                status={isDemo ? 'demo' : connectionStatus} 
                pollingActive={!isDemo && connectionStatus !== 'connected'} 
              />
            </div>
            <p className="text-xs mt-2" style={{ color: effectiveSettings?.text_color || '#6b7280', opacity: 0.6 }}>
              {isDemo 
                ? 'Demo-modus - viser eksempeldata'
                : connectionStatus === 'connected' 
                  ? 'Automatiske oppdateringer via websockets' 
                  : 'Fallback polling aktivt (5s interval)'}
            </p>
            {wakeLockSupported && !isDemo && (
              <div className="text-xs mt-1 flex items-center justify-center gap-1">
                <span className={`inline-block w-2 h-2 rounded-full ${wakeLockActive ? 'bg-success' : 'bg-warning'}`} />
                <span style={{ color: effectiveSettings?.text_color || '#6b7280', opacity: 0.6 }}>
                  {wakeLockActive ? 'Skjerm holdes våken' : 'Wake Lock inaktiv'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer - vis utenfor scroll-container hvis auto_fit_screen for korrekt høydeberegning */}
      {effectiveSettings?.auto_fit_screen && (
        <div className="flex-shrink-0 text-center py-2">
          <div className="flex items-center justify-center gap-4">
            <FullscreenButton settings={effectiveSettings} />
            <ConnectionStatus 
              status={isDemo ? 'demo' : connectionStatus} 
              pollingActive={!isDemo && connectionStatus !== 'connected'} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedDisplay;
