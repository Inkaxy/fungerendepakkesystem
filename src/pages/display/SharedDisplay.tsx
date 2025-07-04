
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
  
  let sharedDisplayPackingData = packingData?.filter(data => {
    const customer = sharedDisplayCustomers.find(customer => customer.id === data.id);
    if (!customer) return false;
    
    // Hide empty customers if setting is enabled
    if (settings?.hide_empty_customers && data.products.length === 0) {
      return false;
    }
    
    return true;
  }) || [];

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

  // Calculate optimal layout based on screen size and customer count
  const getOptimalLayout = () => {
    const customerCount = sharedDisplayPackingData.length;
    const baseColumns = settings?.customer_cards_columns || 3;
    
    if (customerCount === 0) return { columns: baseColumns, maxWidth: 'none' };
    
    // TV screen size optimization
    const screenPreset = settings?.screen_size_preset || 'standard';
    const isLargeScreen = settings?.large_screen_optimization;
    
    let optimalColumns = baseColumns;
    let maxCardWidth = 'none';
    
    // Calculate optimal columns for different scenarios
    if (settings?.force_single_screen && customerCount > 0) {
      // Smart algorithm: balance rows and columns for single screen view
      const aspectRatio = window.innerWidth / window.innerHeight;
      const isWideScreen = aspectRatio > 1.6;
      
      if (customerCount <= 4) {
        optimalColumns = customerCount <= 2 ? customerCount : 2;
      } else if (customerCount <= 9) {
        optimalColumns = isWideScreen ? Math.ceil(customerCount / 2) : 3;
      } else {
        // For many customers, use grid that minimizes scrolling
        optimalColumns = Math.min(
          Math.ceil(Math.sqrt(customerCount * (isWideScreen ? 1.6 : 1.2))),
          isWideScreen ? 8 : 6
        );
      }
    } else {
      // Screen preset optimization
      switch (screenPreset) {
        case '32inch':
          optimalColumns = Math.min(customerCount, 4);
          maxCardWidth = '380px';
          break;
        case '43inch':
          optimalColumns = Math.min(customerCount, 5);
          maxCardWidth = '420px';
          break;
        case '55inch':
          optimalColumns = Math.min(customerCount, 6);
          maxCardWidth = '450px';
          break;
        default:
          optimalColumns = Math.min(customerCount, baseColumns);
          maxCardWidth = isLargeScreen ? '400px' : '350px';
      }
    }
    
    return { 
      columns: Math.max(1, Math.min(optimalColumns, 8)), 
      maxWidth: maxCardWidth 
    };
  };

  const { columns, maxWidth } = getOptimalLayout();

  // Generate responsive grid classes with TV breakpoints
  const getCustomerGridClass = () => {
    const cols = columns;
    
    // Build grid classes with proper responsive behavior
    const gridClasses = [
      'grid-cols-1', // Mobile default
      cols >= 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-1',
      cols >= 3 ? 'md:grid-cols-3' : `md:grid-cols-${Math.min(cols, 2)}`,
      cols >= 4 ? 'lg:grid-cols-4' : `lg:grid-cols-${Math.min(cols, 3)}`,
    ];

    // For larger screens, use the extended grid classes
    if (cols >= 5) {
      gridClasses.push('xl:grid-cols-5');
    } else {
      gridClasses.push(`xl:grid-cols-${Math.min(cols, 4)}`);
    }

    if (cols >= 6) {
      gridClasses.push('2xl:grid-cols-6');
    } else {
      gridClasses.push(`2xl:grid-cols-${Math.min(cols, 5)}`);
    }

    if (cols >= 7) {
      gridClasses.push('3xl:grid-cols-7');
    } else {
      gridClasses.push(`3xl:grid-cols-${Math.min(cols, 6)}`);
    }

    if (cols >= 8) {
      gridClasses.push('4xl:grid-cols-8');
    } else {
      gridClasses.push(`4xl:grid-cols-${Math.min(cols, 7)}`);
    }
    
    return gridClasses.join(' ');
  };

  // Dynamic spacing and sizing based on screen and customer count
  const getDynamicSpacing = () => {
    const customerCount = sharedDisplayPackingData.length;
    const isLargeScreen = settings?.large_screen_optimization;
    const baseGap = settings?.customer_cards_gap || 24;
    
    // Reduce gap on screens with many customers to utilize space better
    let adaptiveGap = baseGap;
    if (customerCount > 8) {
      adaptiveGap = Math.max(baseGap * 0.7, 16);
    } else if (customerCount > 12) {
      adaptiveGap = Math.max(baseGap * 0.5, 12);
    }
    
    // Increase gap on large screens for better visual separation
    if (isLargeScreen && customerCount <= 6) {
      adaptiveGap = Math.min(baseGap * 1.3, 40);
    }
    
    return adaptiveGap;
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
              gap: `${getDynamicSpacing()}px`,
              fontSize: fontSizes.body,
              maxWidth: maxWidth !== 'none' ? `calc(${columns} * ${maxWidth} + ${columns - 1} * ${getDynamicSpacing()}px)` : undefined,
              margin: '0 auto'
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
