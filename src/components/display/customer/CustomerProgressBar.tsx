import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { PackingCustomer } from '@/hooks/usePackingData';

interface CustomerProgressBarProps {
  customerPackingData: PackingCustomer;
  settings: DisplaySettings | undefined;
}

const CustomerProgressBar = React.memo(({ customerPackingData, settings }: CustomerProgressBarProps) => {
  const progress = useMemo(() => 
    customerPackingData.progress_percentage,
    [customerPackingData.progress_percentage]
  );

  return (
    <Card
      style={{
        backgroundColor: settings?.card_background_color || '#ffffff',
        borderColor: settings?.card_border_color || '#e5e7eb',
        borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
        boxShadow: settings?.card_shadow_intensity ? `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)` : undefined
      }}
    >
      <CardContent className="p-8">
        <div className="space-y-4">
          <div 
            className="w-full rounded-full relative overflow-visible"
            style={{ 
              backgroundColor: settings?.progress_background_color || '#e5e7eb',
              height: settings?.progress_height ? `${settings.progress_height * 4}px` : '32px',
              marginLeft: `${(settings?.truck_icon_size || 24) / 2}px`,
              marginRight: `${(settings?.truck_icon_size || 24) / 2}px`,
            }}
          >
            <div 
              className="rounded-full"
              style={{ 
                backgroundColor: settings?.progress_bar_color || '#3b82f6',
                height: '100%',
                width: `${progress}%`,
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: 'width',
              }}
            />
            {(settings?.show_truck_icon ?? true) && (
              <img
                src="/lovable-uploads/37c33860-5f09-44ea-a64c-a7e7fb7c925b.png"
                alt="Varebil"
                className="absolute top-1/2 transform -translate-y-1/2" 
                style={{ 
                  left: `calc(${progress}% - ${(settings?.truck_icon_size || 24) / 2}px)`,
                  width: `${settings?.truck_icon_size || 24}px`,
                  height: `${settings?.truck_icon_size || 24}px`,
                  objectFit: 'contain',
                  transition: 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: 10,
                }}
              />
            )}
          </div>
          {(settings?.show_progress_percentage ?? true) && (
            <div className="text-center">
              <span 
                className="text-3xl font-bold"
                style={{ color: settings?.text_color || '#374151' }}
              >
                {progress}%
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.customerPackingData.progress_percentage === nextProps.customerPackingData.progress_percentage &&
    prevProps.settings?.progress_bar_color === nextProps.settings?.progress_bar_color &&
    prevProps.settings?.progress_background_color === nextProps.settings?.progress_background_color &&
    prevProps.settings?.show_truck_icon === nextProps.settings?.show_truck_icon
  );
});

CustomerProgressBar.displayName = 'CustomerProgressBar';

export default CustomerProgressBar;
