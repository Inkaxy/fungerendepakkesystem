
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useCustomers } from '@/hooks/useCustomers';
import { usePackingData } from '@/hooks/usePackingData';
import { useDisplayRefresh } from '@/hooks/useDisplayRefresh';
import { useDisplaySettings } from '@/hooks/useDisplaySettings';
import { useRealTimeDisplay } from '@/hooks/useRealTimeDisplay';
import { useActivePackingDate } from '@/hooks/useActivePackingDate';
import { generateDisplayStyles, statusColorMap } from '@/utils/displayStyleUtils';
import SharedDisplayHeader from '@/components/display/shared/SharedDisplayHeader';
import SharedDisplayStats from '@/components/display/shared/SharedDisplayStats';
import CustomerPackingCard from '@/components/display/shared/CustomerPackingCard';
import EmptyPackingState from '@/components/display/shared/EmptyPackingState';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

const SharedDisplay = () => {
  const { data: customers } = useCustomers();
  const { data: settings } = useDisplaySettings();
  
  const { data: activePackingDate, isLoading: dateLoading } = useActivePackingDate();
  
  const { data: packingData } = usePackingData(
    undefined, 
    activePackingDate || undefined,
    true
  );
  
  const { connectionStatus } = useRealTimeDisplay();
  
  const { triggerRefresh } = useDisplayRefresh({ 
    enabled: true, 
    interval: (settings?.auto_refresh_interval || 30) * 1000 
  });

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

  // Determine grid columns class based on settings and single screen mode
  const getCustomerGridClass = () => {
    const baseColumns = settings?.customer_cards_columns || 3;
    const customerCount = sharedDisplayPackingData.length;
    
    // If force_single_screen is enabled, calculate optimal layout
    if (settings?.force_single_screen && customerCount > 0) {
      // Calculate optimal columns to fit all customers on screen
      const optimalColumns = Math.min(Math.ceil(Math.sqrt(customerCount * 1.5)), 6);
      const columns = Math.max(optimalColumns, baseColumns);
      
      switch (columns) {
        case 1: return 'grid-cols-1';
        case 2: return 'grid-cols-1 md:grid-cols-2';
        case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
        case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
        case 5: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5';
        case 6: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6';
        default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6';
      }
    }
    
    // Standard responsive grid
    switch (baseColumns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 5: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5';
      case 6: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  // Get font sizes based on screen optimization
  const getFontSizes = () => {
    if (settings?.large_screen_optimization) {
      return {
        header: `${settings.header_font_size || 32}px`,
        body: `${settings.body_font_size || 16}px`,
        title: `${(settings.body_font_size || 16) + 4}px`
      };
    }
    return {
      header: `${settings?.header_font_size || 32}px`,
      body: `${settings?.body_font_size || 16}px`,
      title: `${(settings?.body_font_size || 16) + 2}px`
    };
  };

  const fontSizes = getFontSizes();

  return (
    <div 
      className="min-h-screen p-8"
      style={displayStyles}
    >
      <div className="max-w-7xl mx-auto">
        <SharedDisplayHeader
          settings={settings}
          connectionStatus={connectionStatus}
          onRefresh={triggerRefresh}
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

        {!dateLoading && activePackingDate && sharedDisplayPackingData.length > 0 && (
          <div 
            className={`grid ${getCustomerGridClass()} mb-8`}
            style={{ 
              gap: settings?.customer_cards_gap ? `${settings.customer_cards_gap}px` : '24px',
              fontSize: fontSizes.body
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
        )}

        {!dateLoading && activePackingDate && sharedDisplayPackingData.length === 0 && (
          <EmptyPackingState
            settings={settings}
            activePackingDate={activePackingDate}
            isToday={isToday}
          />
        )}

        <div className="text-center mt-8">
          <p style={{ color: settings?.text_color || '#6b7280', opacity: 0.8 }}>
            Sist oppdatert: {format(new Date(), 'HH:mm:ss', { locale: nb })}
          </p>
          <p 
            className="text-xs mt-1"
            style={{ color: settings?.text_color || '#6b7280', opacity: 0.6 }}
          >
            Automatisk oppdatering hvert {settings?.auto_refresh_interval || 30}. sekund
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedDisplay;
