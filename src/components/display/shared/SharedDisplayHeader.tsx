import React from 'react';
import { Clock } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import ConnectionStatus from '@/components/display/ConnectionStatus';
import FullscreenButton from '@/components/display/FullscreenButton';
import { useRealtimeClock } from '@/hooks/useRealtimeClock';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface SharedDisplayHeaderProps {
  settings: DisplaySettings | undefined;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  activePackingDate: string | undefined;
}

const SharedDisplayHeader = ({ settings, connectionStatus, activePackingDate }: SharedDisplayHeaderProps) => {
  const isToday = activePackingDate ? activePackingDate === format(new Date(), 'yyyy-MM-dd') : true;
  
  // Sanntidsklokke - kun aktiv når innstillingen er på
  const currentTime = useRealtimeClock(settings?.shared_show_clock ?? false);

  // Header alignment
  const getAlignmentClass = () => {
    switch (settings?.shared_header_alignment) {
      case 'left': return 'text-left items-start';
      case 'right': return 'text-right items-end';
      default: return 'text-center items-center';
    }
  };

  return (
    <div className="flex justify-between items-start mb-8">
      {/* Logo (venstre) */}
      <div className="flex-shrink-0 w-24">
        {settings?.shared_show_logo && settings?.shared_logo_url && (
          <img 
            src={settings.shared_logo_url} 
            alt="Logo"
            className="object-contain"
            style={{
              height: settings?.shared_logo_size ? `${settings.shared_logo_size}px` : '48px',
              maxWidth: '100%'
            }}
          />
        )}
      </div>

      {/* Hovedinnhold (midten) */}
      <div className={cn("flex-1 flex flex-col", getAlignmentClass())}>
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
        
        {/* Dato og klokke */}
        <div className="flex items-center justify-center gap-4 mt-4">
          {settings?.show_date_indicator && activePackingDate && (
            <div className="flex items-center gap-2">
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
          
          {/* Sanntidsklokke */}
          {settings?.shared_show_clock && (
            <div 
              className="text-3xl font-mono font-bold"
              style={{ 
                color: settings?.header_text_color || '#111827'
              }}
            >
              {currentTime}
            </div>
          )}
        </div>
      </div>

      {/* Kontroller (høyre) */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0 w-24">
        <div className="flex items-center gap-2">
          <FullscreenButton settings={settings} />
          <ConnectionStatus status={connectionStatus} />
        </div>
      </div>
    </div>
  );
};

export default SharedDisplayHeader;
