
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import ConnectionStatus from '@/components/display/ConnectionStatus';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface SharedDisplayHeaderProps {
  settings: DisplaySettings | undefined;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  onRefresh: () => void;
  activePackingDate: string | undefined;
}

const SharedDisplayHeader = ({ settings, connectionStatus, onRefresh, activePackingDate }: SharedDisplayHeaderProps) => {
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
          Felles Display
        </h1>
        <p 
          className="text-xl mb-2"
          style={{ 
            color: settings?.text_color || '#4b5563',
            fontSize: settings?.body_font_size ? `${settings.body_font_size * 1.25}px` : '1.25rem'
          }}
        >
          Pakkestatus for kunder
        </p>
        {activePackingDate && (
          <div className="flex items-center justify-center gap-2 mt-2">
            <Clock className="h-4 w-4" style={{ color: settings?.text_color || '#6b7280' }} />
            <span 
              className={`text-sm ${!isToday ? 'font-bold' : ''}`}
              style={{ 
                color: !isToday ? '#dc2626' : (settings?.text_color || '#6b7280'),
              }}
            >
              {!isToday && 'PAKKING FOR: '}
              {format(new Date(activePackingDate), 'dd.MM.yyyy', { locale: nb })}
              {!isToday && ' (ikke i dag)'}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-2">
        <ConnectionStatus status={connectionStatus} />
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Oppdater
        </Button>
      </div>
    </div>
  );
};

export default SharedDisplayHeader;
