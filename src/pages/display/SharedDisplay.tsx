
import React, { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import SharedDisplayHeader from '@/components/display/shared/SharedDisplayHeader';
import SharedDisplayStats from '@/components/display/shared/SharedDisplayStats';
import CustomerDataLoader from '@/components/display/shared/CustomerDataLoader';
import EmptyPackingState from '@/components/display/shared/EmptyPackingState';
import ConnectionStatus from '@/components/display/ConnectionStatus';
import { useRealTimePublicDisplay } from '@/hooks/useRealTimePublicDisplay';
import { useDisplayRefreshBroadcast } from '@/hooks/useDisplayRefreshBroadcast';
import { useWakeLock } from '@/hooks/useWakeLock';
import { useCustomers } from '@/hooks/useCustomers';
import { useDisplaySettings } from '@/hooks/useDisplaySettings';
import { usePublicActivePackingDate } from '@/hooks/usePublicDisplayData';
import { generateDisplayStyles, statusColorMap } from '@/utils/displayStyleUtils';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { QUERY_KEYS } from '@/lib/queryKeys';

const SharedDisplay = () => {
  const queryClient = useQueryClient();
  const { data: customers } = useCustomers();
  const { data: settings } = useDisplaySettings();
  
  // Bruk public hooks for konsistent oppførsel med CustomerDisplay
  const bakeryId = customers?.[0]?.bakery_id;
  const { data: activePackingDate, isLoading: dateLoading } = usePublicActivePackingDate(bakeryId);
  
  // Filter shared display customers
  const sharedDisplayCustomers = customers?.filter(c => !c.has_dedicated_display && c.status === 'active') || [];
  
  // Real-time listener for cache updates
  const { connectionStatus } = useRealTimePublicDisplay(bakeryId);
  
  // Lytt på refresh broadcasts fra admin
  useDisplayRefreshBroadcast(bakeryId, true);

  // Wake Lock - forhindrer at skjermen slukkes
  const { isActive: wakeLockActive, isSupported: wakeLockSupported } = useWakeLock();

  // 🔄 Ekstra sikkerhet: poll packing-data for shared display
  // ✅ Smart polling - kun når WebSocket er disconnected
  React.useEffect(() => {
    if (!bakeryId || connectionStatus === 'connected') return;

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
  }, [bakeryId, connectionStatus, queryClient]);

  // ✅ Invalidate cache ved mount (ikke remove - forhindrer race condition)
  React.useEffect(() => {
    if (!bakeryId) return;
    
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
  }, [bakeryId, queryClient]);

  // Force invalidate av packing data når aktiv dato endres
  React.useEffect(() => {
    if (!bakeryId || !activePackingDate) return;
    
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
  }, [bakeryId, activePackingDate, queryClient]);

  // Apply customer sorting based on settings
  const sortedCustomers = useMemo(() => {
    const customers = [...sharedDisplayCustomers];
    
    if (settings?.customer_sort_order === 'alphabetical') {
      return customers.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return customers;
  }, [sharedDisplayCustomers, settings?.customer_sort_order]);

  const displayStyles = settings ? generateDisplayStyles(settings) : {};
  const statusColors = settings ? statusColorMap(settings) : {
    pending: '#f59e0b',
    in_progress: '#3b82f6',
    completed: '#10b981',
    delivered: '#059669'
  };

  const isToday = activePackingDate ? activePackingDate === format(new Date(), 'yyyy-MM-dd') : false;

  // Determine grid columns class based on settings
  const getCustomerGridClass = () => {
    const columns = settings?.customer_cards_columns || 3;
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <div 
      className="min-h-screen p-8"
      style={displayStyles}
    >
      <div className="max-w-7xl mx-auto">
      <SharedDisplayHeader 
        settings={settings}
        connectionStatus={connectionStatus}
        activePackingDate={activePackingDate}
      />

        {dateLoading && (
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

        {!dateLoading && !activePackingDate && (
          <EmptyPackingState
            settings={settings}
            activePackingDate={null}
            isToday={false}
          />
        )}

        {!dateLoading && activePackingDate && sortedCustomers.length > 0 ? (
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
                activePackingDate={activePackingDate}
                settings={settings}
                statusColors={statusColors}
              />
            ))}
          </div>
        ) : !dateLoading && activePackingDate && sortedCustomers.length === 0 ? (
          <EmptyPackingState
            settings={settings}
            activePackingDate={activePackingDate}
            isToday={isToday}
          />
        ) : null}

        <div className="text-center mt-8">
          <ConnectionStatus status={connectionStatus} pollingActive={connectionStatus !== 'connected'} />
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

export default SharedDisplay;
