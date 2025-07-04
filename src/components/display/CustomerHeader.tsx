
import React from 'react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface CustomerHeaderProps {
  customerName: string;
  settings?: DisplaySettings;
  className?: string;
}

const CustomerHeader = ({ 
  customerName, 
  settings,
  className = ""
}: CustomerHeaderProps) => {
  return (
    <div className={`text-center ${className}`}>
      <h1 
        className="font-bold mb-2"
        style={{ 
          fontSize: settings?.header_font_size ? `${settings.header_font_size}px` : '3rem',
          color: settings?.header_text_color || '#111827'
        }}
      >
        {customerName}
      </h1>
      <p 
        className="text-xl"
        style={{ 
          color: settings?.text_color || '#6b7280',
          fontSize: settings?.body_font_size ? `${settings.body_font_size * 1.25}px` : '1.25rem'
        }}
      >
        {format(new Date(), 'dd. MMMM yyyy', { locale: nb })}
      </p>
    </div>
  );
};

export default CustomerHeader;
