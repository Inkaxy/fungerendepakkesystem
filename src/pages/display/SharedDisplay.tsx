import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import SharedDisplayHeader from '@/components/display/shared/SharedDisplayHeader';
import CustomerDataLoader from '@/components/display/shared/CustomerDataLoader';
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
import { 
  usePublicDisplaySettings,
  usePublicActivePackingDate,
  usePublicSharedDisplayCustomers 
} from '@/hooks/usePublicDisplayData';
import { generateDisplayStyles, statusColorMap } from '@/utils/displayStyleUtils';
import { format } from 'date-fns';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { cn } from '@/lib/utils';
import { DEMO_CUSTOMERS, DEMO_PACKING_DATA, DEMO_PACKING_DATE } from '@/utils/demoDisplayData';

const SharedDisplay = () => {
  const { bakeryId } = useParams<{ bakeryId: string }>();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');
  
  // ✅ Demo-modus sjekk
  const isDemo = searchParams.get('demo') === 'true';
  
  // Bruk public hooks - ingen autentisering nødvendig
  const { data: customers, isLoading: customersLoading } = usePublicSharedDisplayCustomers(bakeryId);
  const { data: settings } = usePublicDisplaySettings(bakeryId);
  const { data: activePackingDate, isLoading: dateLoading } = usePublicActivePackingDate(bakeryId);
  
  // ✅ Ekte kunder (kun for non-demo)
  const realCustomers = customers?.filter(c => !c.has_dedicated_display && c.status === 'active') || [];
  
  const effectivePackingDate = isDemo ? DEMO_PACKING_DATE : activePackingDate;
  
  // Real-time listener for cache updates (WebSocket fra postgres_changes) - skip i demo
  const { connectionStatus } = useRealTimePublicDisplay(isDemo ? undefined : bakeryId);
  
  // ✅ NY: Broadcast listener for push-first oppdateringer (< 100ms latency) - skip i demo
  usePackingBroadcastListener(isDemo ? undefined : bakeryId);
  
  // Lytt på refresh broadcasts fra admin - skip i demo
  useDisplayRefreshBroadcast(isDemo ? undefined : bakeryId, !isDemo);

  // Wake Lock - forhindrer at skjermen slukkes
  const { isActive: wakeLockActive, isSupported: wakeLockSupported } = useWakeLock();

  // 🔄 Fallback polling - kun når WebSocket er disconnected (skip i demo)
  useEffect(() => {
    if (isDemo || !bakeryId || connectionStatus === 'connected') return;

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
  }, [isDemo, bakeryId, connectionStatus, queryClient]);

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

  // 🔄 Auto-scroll funksjonalitet
  useEffect(() => {
    if (!settings?.shared_auto_scroll || !scrollContainerRef.current) return;

    const scrollSpeed = settings?.shared_scroll_speed || 30; // px per sekund
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
  }, [settings?.shared_auto_scroll, settings?.shared_scroll_speed, scrollDirection]);

  // Apply customer sorting and filtering based on settings (kun for ekte kunder)
  const sortedCustomers = useMemo(() => {
    let customerList = [...realCustomers];
    
    // Skjul fullførte kunder hvis innstillingen er på
    if (settings?.shared_hide_completed_customers) {
      customerList = customerList.filter(c => {
        // Vi kan ikke filtrere på progress her siden vi ikke har den dataen
        // Dette vil bli håndtert i CustomerDataLoader
        return true;
      });
    }
    
    if (settings?.customer_sort_order === 'alphabetical') {
      return customerList.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return customerList;
  }, [realCustomers, settings?.customer_sort_order, settings?.shared_hide_completed_customers]);
  
  // Demo-kunder sortert
  const sortedDemoCustomers = useMemo(() => {
    if (!isDemo) return [];
    let demoList = DEMO_CUSTOMERS.filter(c => !c.has_dedicated_display);
    if (settings?.customer_sort_order === 'alphabetical') {
      return demoList.sort((a, b) => a.name.localeCompare(b.name));
    }
    return demoList;
  }, [isDemo, settings?.customer_sort_order]);

  const displayStyles = settings ? generateDisplayStyles(settings) : {};
  const statusColors = settings ? statusColorMap(settings) : {
    pending: '#f59e0b',
    in_progress: '#3b82f6',
    completed: '#10b981',
    delivered: '#059669'
  };

  const isToday = effectivePackingDate ? effectivePackingDate === format(new Date(), 'yyyy-MM-dd') : false;
  const isLoading = isDemo ? false : (dateLoading || customersLoading);

  // Determine grid columns class based on settings
  const getCustomerGridClass = () => {
    const columns = settings?.customer_cards_columns || 3;
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

  const contentPadding = settings?.shared_content_padding ?? 24;

  return (
    <div 
      className={cn(
        "min-h-screen",
        settings?.auto_fit_screen && "h-screen flex flex-col overflow-hidden"
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
          settings?.shared_auto_scroll && !settings?.auto_fit_screen && 'overflow-hidden h-screen',
          settings?.auto_fit_screen && 'flex-1 min-h-0 flex flex-col overflow-hidden'
        )}
      >
        <SharedDisplayHeader 
          settings={settings}
          connectionStatus={isDemo ? 'demo' : connectionStatus}
          activePackingDate={effectivePackingDate}
        />

        {isLoading && (
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

        {!isLoading && !effectivePackingDate && !isDemo && (
          <EmptyPackingState
            settings={settings}
            activePackingDate={null}
            isToday={false}
          />
        )}

        {/* Demo-modus: Vis demo-kort */}
        {isDemo && (
          settings?.auto_fit_screen ? (
            <div className="flex-1 min-h-0">
              <AutoFitGrid 
                customerCount={DEMO_PACKING_DATA.length} 
                settings={settings}
              >
                {DEMO_PACKING_DATA.map((demoData) => (
                  <DemoCustomerCard
                    key={demoData.id}
                    customerData={demoData}
                    settings={settings}
                    statusColors={statusColors}
                    hideWhenCompleted={settings?.shared_hide_completed_customers}
                    completedOpacity={settings?.shared_completed_customer_opacity}
                  />
                ))}
              </AutoFitGrid>
            </div>
          ) : (
            <div 
              className={`grid ${getCustomerGridClass()} gap-6 mb-8`}
              style={{ 
                gap: settings?.customer_cards_gap ? `${settings.customer_cards_gap}px` : '24px' 
              }}
            >
              {DEMO_PACKING_DATA.map((demoData) => (
                <DemoCustomerCard
                  key={demoData.id}
                  customerData={demoData}
                  settings={settings}
                  statusColors={statusColors}
                  hideWhenCompleted={settings?.shared_hide_completed_customers}
                  completedOpacity={settings?.shared_completed_customer_opacity}
                />
              ))}
            </div>
          )
        )}

        {/* Ekte data: Vis ekte kunder */}
        {!isDemo && !isLoading && effectivePackingDate && sortedCustomers.length > 0 && (
          settings?.auto_fit_screen ? (
            <div className="flex-1 min-h-0">
              <AutoFitGrid 
                customerCount={sortedCustomers.length} 
                settings={settings}
              >
                {sortedCustomers.map((customer) => (
                  <CustomerDataLoader
                    key={customer.id}
                    customer={customer}
                    bakeryId={bakeryId}
                    activePackingDate={effectivePackingDate}
                    settings={settings}
                    statusColors={statusColors}
                    hideWhenCompleted={settings?.shared_hide_completed_customers}
                    completedOpacity={settings?.shared_completed_customer_opacity}
                  />
                ))}
              </AutoFitGrid>
            </div>
          ) : (
            <div 
              className={`grid ${getCustomerGridClass()} gap-6 mb-8`}
              style={{ 
                gap: settings?.customer_cards_gap ? `${settings.customer_cards_gap}px` : '24px' 
              }}
            >
              {sortedCustomers.map((customer) => (
                <CustomerDataLoader
                  key={customer.id}
                  customer={customer}
                  bakeryId={bakeryId}
                  activePackingDate={effectivePackingDate}
                  settings={settings}
                  statusColors={statusColors}
                  hideWhenCompleted={settings?.shared_hide_completed_customers}
                  completedOpacity={settings?.shared_completed_customer_opacity}
                />
              ))}
            </div>
          )
        )}

        {/* Tom tilstand: Vis kun for ekte data */}
        {!isDemo && !isLoading && effectivePackingDate && sortedCustomers.length === 0 && (
          <EmptyPackingState
            settings={settings}
            activePackingDate={effectivePackingDate}
            isToday={isToday}
          />
        )}

        {/* Footer - kun vis inni scroll-container hvis IKKE auto_fit_screen */}
        {!settings?.auto_fit_screen && (
          <div className="text-center mt-8">
            <div className="flex items-center justify-center gap-4 mb-2">
              <FullscreenButton settings={settings} />
              <ConnectionStatus 
                status={isDemo ? 'demo' : connectionStatus} 
                pollingActive={!isDemo && connectionStatus !== 'connected'} 
              />
            </div>
            <p className="text-xs mt-2" style={{ color: settings?.text_color || '#6b7280', opacity: 0.6 }}>
              {isDemo 
                ? 'Demo-modus - viser eksempeldata'
                : connectionStatus === 'connected' 
                  ? 'Automatiske oppdateringer via websockets' 
                  : 'Fallback polling aktivt (5s interval)'}
            </p>
            {wakeLockSupported && !isDemo && (
              <div className="text-xs mt-1 flex items-center justify-center gap-1">
                <span className={`inline-block w-2 h-2 rounded-full ${wakeLockActive ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span style={{ color: settings?.text_color || '#6b7280', opacity: 0.6 }}>
                  {wakeLockActive ? 'Skjerm holdes våken' : 'Wake Lock inaktiv'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer - vis utenfor scroll-container hvis auto_fit_screen for korrekt høydeberegning */}
      {settings?.auto_fit_screen && (
        <div className="flex-shrink-0 text-center py-2">
          <div className="flex items-center justify-center gap-4">
            <FullscreenButton settings={settings} />
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
