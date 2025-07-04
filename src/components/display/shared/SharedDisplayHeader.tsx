
import React from 'react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import ConnectionStatus from '@/components/display/ConnectionStatus';

interface SharedDisplayHeaderProps {
  settings: DisplaySettings | undefined;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
}

const SharedDisplayHeader = ({ settings, connectionStatus }: SharedDisplayHeaderProps) => {
  return (
    <div className="relative mb-8">
      <div className="text-center">
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
          className="text-xl"
          style={{ 
            color: settings?.text_color || '#4b5563',
            fontSize: settings?.body_font_size ? `${settings.body_font_size * 1.25}px` : '1.25rem'
          }}
        >
          {settings?.subtitle || 'Pakkestatus for kunder'}
        </p>
      </div>
      
      {/* Connection status overlay in bottom right */}
      <div className="fixed bottom-4 right-4 z-10">
        <ConnectionStatus status={connectionStatus} className="opacity-80 hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};

export default SharedDisplayHeader;
