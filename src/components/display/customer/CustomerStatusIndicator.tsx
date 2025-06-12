
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { packingStatusColorMap } from '@/utils/displayStyleUtils';

interface CustomerStatusIndicatorProps {
  isAllPacked: boolean;
  settings: DisplaySettings | undefined;
}

const CustomerStatusIndicator = ({ isAllPacked, settings }: CustomerStatusIndicatorProps) => {
  if (!settings?.show_status_indicator) return null;

  const statusColors = settings ? packingStatusColorMap(settings) : { ongoing: '#3b82f6', completed: '#10b981' };

  return (
    <Card
      className="text-center"
      style={{
        backgroundColor: isAllPacked ? statusColors.completed : statusColors.ongoing,
        borderColor: isAllPacked ? statusColors.completed : statusColors.ongoing,
        borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
      }}
    >
      <CardContent 
        style={{ 
          padding: settings?.status_indicator_padding ? `${settings.status_indicator_padding}px` : '32px' 
        }}
      >
        <h2 
          className="font-bold text-white"
          style={{ 
            fontSize: settings?.status_indicator_font_size ? `${settings.status_indicator_font_size}px` : '32px' 
          }}
        >
          STATUS: {isAllPacked ? 'Ferdig Pakket' : 'Pågående'}
        </h2>
      </CardContent>
    </Card>
  );
};

export default CustomerStatusIndicator;
