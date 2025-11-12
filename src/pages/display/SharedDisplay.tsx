
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SharedDisplayHeader from '@/components/display/shared/SharedDisplayHeader';
import SharedDisplayStats from '@/components/display/shared/SharedDisplayStats';
import CustomerPackingCard from '@/components/display/shared/CustomerPackingCard';
import EmptyPackingState from '@/components/display/shared/EmptyPackingState';
import ConnectionStatus from '@/components/display/ConnectionStatus';
import { useRealTimeDisplay } from '@/hooks/useRealTimeDisplay';
import { useRealTimeActivePackingProducts } from '@/hooks/useRealTimeActivePackingProducts';
import { useRealTimePublicDisplay } from '@/hooks/useRealTimePublicDisplay';
import { useActivePackingDate } from '@/hooks/useActivePackingDate';
import { useCustomers } from '@/hooks/useCustomers';
import { useDisplaySettings } from '@/hooks/useDisplaySettings';
import { usePackingData } from '@/hooks/usePackingData';
import { generateDisplayStyles, statusColorMap } from '@/utils/displayStyleUtils';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

const SharedDisplay = () => {
  // For SharedDisplay, we still use the authenticated hooks since it's not customer-specific
  const { data: customers } = useCustomers();
  const { data: settings } = useDisplaySettings();
  
  const { data: activePackingDate, isLoading: dateLoading } = useActivePackingDate();
  
  const { data: packingData, isLoading: packingLoading } = usePackingData(
    undefined, 
    activePackingDate || undefined,
    true
  );
  
  const { connectionStatus } = useRealTimeDisplay();
  useRealTimeActivePackingProducts();
  
  // Add real-time listener for public displays
  const bakeryId = customers?.[0]?.bakery_id;
  useRealTimePublicDisplay(bakeryId);

  const sharedDisplayCustomers = customers?.filter(c => !c.has_dedicated_display && c.status === 'active') || [];
  
  let sharedDisplayPackingData = packingData?.filter(data => 
    sharedDisplayCustomers.some(customer => customer.id === data.id)
  ) || [];

  // Apply customer sorting based on settings
  if (settings?.customer_sort_order && sharedDisplayPackingData.length > 0) {
    switch (settings.customer_sort_order) {
      case 'alphabetical':
        sharedDisplayPackingData = sharedDisplayPackingData.sort((a, b) => {
          const customerA = sharedDisplayCustomers.find(c => c.id === a.id);
          const customerB = sharedDisplayCustomers.find(c => c.id === b.id);
          return (customerA?.name || '').localeCompare(customerB?.name || '');
        });
        break;
      case 'status':
        sharedDisplayPackingData = sharedDisplayPackingData.sort((a, b) => {
          if (a.overall_status === b.overall_status) return 0;
          if (a.overall_status === 'completed') return 1;
          if (b.overall_status === 'completed') return -1;
          return 0;
        });
        break;
      case 'progress':
        sharedDisplayPackingData = sharedDisplayPackingData.sort((a, b) => 
          b.progress_percentage - a.progress_percentage
        );
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

        {!dateLoading && activePackingDate && settings?.show_stats_cards && (
          <SharedDisplayStats
            settings={settings}
            sharedDisplayPackingData={sharedDisplayPackingData}
          />
        )}

        {!dateLoading && activePackingDate && (packingLoading ? (
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
                Oppdaterer kundekort...
              </p>
            </CardContent>
          </Card>
        ) : sharedDisplayPackingData.length > 0 ? (
          <div 
            className={`grid ${getCustomerGridClass()} gap-6 mb-8`}
            style={{ 
              gap: settings?.customer_cards_gap ? `${settings.customer_cards_gap}px` : '24px' 
            }}
          >
            {sharedDisplayPackingData.map((customerData) => {
              const customer = sharedDisplayCustomers.find(c => c.id === customerData.id);
              if (!customer) return null;

              return (
                <CustomerPackingCard
                  key={customer.id}
                  customerData={customerData}
                  customer={customer}
                  settings={settings}
                  statusColors={statusColors}
                />
              );
            })}
          </div>
        ) : null)}

        {!dateLoading && activePackingDate && sharedDisplayPackingData.length === 0 && (
          <EmptyPackingState
            settings={settings}
            activePackingDate={activePackingDate}
            isToday={isToday}
          />
        )}

        <div className="text-center mt-8">
          <ConnectionStatus status={connectionStatus} />
          <p className="text-xs mt-2" style={{ color: settings?.text_color || '#6b7280', opacity: 0.6 }}>
            Automatiske oppdateringer via websockets
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedDisplay;
