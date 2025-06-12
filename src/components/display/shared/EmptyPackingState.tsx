
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface EmptyPackingStateProps {
  settings: DisplaySettings | undefined;
  activePackingDate: string | undefined;
  isToday: boolean;
}

const EmptyPackingState = ({ settings, activePackingDate, isToday }: EmptyPackingStateProps) => {
  return (
    <Card
      style={{
        backgroundColor: settings?.card_background_color || '#ffffff',
        borderColor: settings?.card_border_color || '#e5e7eb',
        borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
        boxShadow: settings?.card_shadow_intensity ? `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)` : undefined
      }}
    >
      <CardContent className="text-center p-12">
        <Package className="h-16 w-16 mx-auto mb-6 text-gray-400" />
        <p 
          className="text-xl mb-6"
          style={{ color: settings?.text_color || '#6b7280' }}
        >
          Ingen aktive produkter valgt for pakking
          {activePackingDate && !isToday && (
            <span className="block text-sm mt-2 font-bold" style={{ color: '#dc2626' }}>
              for {format(new Date(activePackingDate), 'dd.MM.yyyy', { locale: nb })}
            </span>
          )}
        </p>
        <p 
          className="text-sm"
          style={{ color: settings?.text_color || '#6b7280', opacity: 0.7 }}
        >
          Gå til Pakking-siden for å velge produkter som skal pakkes
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyPackingState;
