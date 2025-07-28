
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { PackingCustomer } from '@/hooks/usePackingData';

interface CustomerProgressBarProps {
  customerPackingData: PackingCustomer;
  settings: DisplaySettings | undefined;
}

const CustomerProgressBar = ({ customerPackingData, settings }: CustomerProgressBarProps) => {
  if (!settings?.show_progress_bar) return null;

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
            className="w-full rounded-full relative"
            style={{ 
              backgroundColor: settings?.progress_background_color || '#e5e7eb',
              height: settings?.progress_height ? `${settings.progress_height * 4}px` : '32px'
            }}
          >
            <div 
              className={`rounded-full transition-all duration-300 ${settings?.progress_animation ? 'animate-pulse' : ''}`}
              style={{ 
                backgroundColor: settings?.progress_bar_color || '#3b82f6',
                height: settings?.progress_height ? `${settings.progress_height * 4}px` : '32px',
                width: `${customerPackingData.progress_percentage}%`
              }}
            />
            {settings?.show_truck_icon && (
              <img 
                src="/lovable-uploads/37c33860-5f09-44ea-a64c-a7e7fb7c925b.png"
                alt="Varebil"
                className="absolute top-1/2 transform -translate-y-1/2" 
                style={{ 
                  left: `${customerPackingData.progress_percentage}%`, 
                  marginLeft: `-${(settings?.truck_icon_size || 24) / 2}px`,
                  width: `${settings?.truck_icon_size || 24}px`,
                  height: `${settings?.truck_icon_size || 24}px`,
                  objectFit: 'contain'
                }}
              />
            )}
          </div>
          {settings?.show_progress_percentage && (
            <div className="text-center">
              <span 
                className="text-3xl font-bold"
                style={{ color: settings?.text_color || '#374151' }}
              >
                {customerPackingData.progress_percentage}%
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerProgressBar;
