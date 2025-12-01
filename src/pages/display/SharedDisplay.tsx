
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import SharedDisplayHeader from '@/components/display/shared/SharedDisplayHeader';
import SharedDisplayStats from '@/components/display/shared/SharedDisplayStats';
import CustomerDataLoader from '@/components/display/shared/CustomerDataLoader';
import EmptyPackingState from '@/components/display/shared/EmptyPackingState';
import ConnectionStatus from '@/components/display/ConnectionStatus';
import { useRealTimePublicDisplay } from '@/hooks/useRealTimePublicDisplay';
import { useDisplayRefreshBroadcast } from '@/hooks/useDisplayRefreshBroadcast';
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

  // 🔄 Ekstra sikkerhet: poll packing-data for shared display
  React.useEffect(() => {
    if (!bakeryId) return;

    const interval = setInterval(() => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_PRODUCTS[0]],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PUBLIC_PACKING_DATA[0]],
        exact: false,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [bakeryId, queryClient]);

  // ✅ Force cache clearing ved mount
  React.useEffect(() => {
    if (!bakeryId) return;
    
    console.log('🧹 SharedDisplay: Clearing cache ved mount');
    queryClient.removeQueries({ 
      queryKey: [QUERY_KEYS.PUBLIC_ACTIVE_PRODUCTS[0]], 
      exact: false 
    });
    queryClient.removeQueries({ 
      queryKey: [QUERY_KEYS.PUBLIC_PACKING_DATA[0]], 
      exact: false 
    });
  }, [bakeryId, queryClient]);

  // Force reset av packing data når aktiv dato endres
  React.useEffect(() => {
    if (!bakeryId || !activePackingDate) return;
    
    queryClient.removeQueries({
      predicate: (query) => 
        query.queryKey[0] === QUERY_KEYS.PUBLIC_PACKING_DATA[0] &&
        query.queryKey[3] !== activePackingDate,
    });
    console.log('🔄 Aktiv dato endret - fjernet gamle packing cache entries');
  }, [bakeryId, activePackingDate, queryClient]);

  // Apply customer sorting based on settings
  let sortedCustomers = [...sharedDisplayCustomers];
  if (settings?.customer_sort_order) {
    switch (settings.customer_sort_order) {
      case 'alphabetical':
        sortedCustomers = sortedCustomers.sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        break;
      // Status og progress sorting vil skje per kunde i CustomerDataLoader
      default:
        break;
    }
  }

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
          <ConnectionStatus status={connectionStatus} pollingActive={true} />
          <p className="text-xs mt-2" style={{ color: settings?.text_color || '#6b7280', opacity: 0.6 }}>
            Automatiske oppdateringer via websockets
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedDisplay;
