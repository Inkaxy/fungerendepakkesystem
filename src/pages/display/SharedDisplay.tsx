
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useCustomers } from '@/hooks/useCustomers';
import { usePackingData } from '@/hooks/usePackingData';
import { useDisplayRefresh } from '@/hooks/useDisplayRefresh';
import { useDisplaySettings } from '@/hooks/useDisplaySettings';
import { useRealTimeDisplay } from '@/hooks/useRealTimeDisplay';
import { useActivePackingDate } from '@/hooks/useActivePackingDate';
import { generateDisplayStyles, statusColorMap } from '@/utils/displayStyleUtils';
import { CatGameOverlay } from '@/components/CatGameOverlay';
import DebugInfo from '@/components/display/DebugInfo';
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
    activePackingDate,
    true
  );
  
  const { connectionStatus } = useRealTimeDisplay();
  
  const { triggerRefresh } = useDisplayRefresh({ 
    enabled: true, 
    interval: (settings?.auto_refresh_interval || 30) * 1000 
  });

  const sharedDisplayCustomers = customers?.filter(c => !c.has_dedicated_display && c.status === 'active') || [];
  
  const sharedDisplayPackingData = packingData?.filter(data => 
    sharedDisplayCustomers.some(customer => customer.id === data.id)
  ) || [];

  const displayStyles = settings ? generateDisplayStyles(settings) : {};
  const statusColors = settings ? statusColorMap(settings) : {
    pending: '#f59e0b',
    in_progress: '#3b82f6',
    completed: '#10b981',
    delivered: '#059669'
  };

  const isToday = activePackingDate ? activePackingDate === format(new Date(), 'yyyy-MM-dd') : true;

  return (
    <div 
      className="min-h-screen p-8"
      style={displayStyles}
    >
      <CatGameOverlay settings={settings} />
      
      <div className="max-w-7xl mx-auto">
        <DebugInfo showDebug={!packingData || packingData.length === 0} />

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

        {!dateLoading && (
          <SharedDisplayStats
            settings={settings}
            sharedDisplayPackingData={sharedDisplayPackingData}
          />
        )}

        {!dateLoading && sharedDisplayPackingData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

        {!dateLoading && sharedDisplayPackingData.length === 0 && (
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
