
import React from 'react';
import { Clock } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import ConnectionStatus from '@/components/display/ConnectionStatus';
import FullscreenButton from '@/components/display/FullscreenButton';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface SharedDisplayHeaderProps {
  settings: DisplaySettings | undefined;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  activePackingDate: string | undefined;
}

const SharedDisplayHeader = ({ settings, connectionStatus, activePackingDate }: SharedDisplayHeaderProps) => {
  const isToday = activePackingDate ? activePackingDate === format(new Date(), 'yyyy-MM-dd') : true;

  return (
    <div className="flex justify-between items-start mb-8">
      <div className="text-center flex-1">
        <h1 
          className="font-bold mb-2"
          style={{ 
            fontSize: settings?.header_font_size ? `${settings.header_font_size}px` : '2.25rem',
            color: settings?.header_text_color || '#111827'
          }}
        >
          {settings?.main_title || 'Felles Display'}
        </h1>
        <p 
          className="text-xl mb-2"
          style={{ 
            color: settings?.text_color || '#4b5563',
            fontSize: settings?.body_font_size ? `${settings.body_font_size * 1.25}px` : '1.25rem'
          }}
        >
          {settings?.subtitle || 'Pakkestatus for kunder'}
        </p>
        {settings?.show_date_indicator && activePackingDate && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Clock className="h-5 w-5" style={{ color: settings?.text_color || '#6b7280' }} />
            <span 
              className="text-2xl font-semibold capitalize"
              style={{ 
                color: !isToday ? '#dc2626' : (settings?.text_color || '#6b7280'),
              }}
            >
              {!isToday && 'PAKKING FOR: '}
              {format(new Date(activePackingDate), 'EEEE dd.MM.yy', { locale: nb })}
              {!isToday && ' (ikke i dag)'}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <FullscreenButton settings={settings} />
          <ConnectionStatus status={connectionStatus} />
        </div>
      </div>
    </div>
  );
};

export default SharedDisplayHeader;
