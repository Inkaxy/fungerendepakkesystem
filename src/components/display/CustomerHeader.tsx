
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface CustomerHeaderProps {
  customerName: string;
  showRefresh?: boolean;
  onRefresh?: () => void;
  settings?: DisplaySettings;
  className?: string;
}

const CustomerHeader = ({ 
  customerName, 
  showRefresh = false, 
  onRefresh, 
  settings,
  className = ""
}: CustomerHeaderProps) => {
  const handleRefresh = () => {
    console.log('🔄 CustomerHeader: Refresh button clicked!');
    if (onRefresh) {
      console.log('🔄 CustomerHeader: Calling onRefresh()');
      onRefresh();
    } else {
      console.error('❌ CustomerHeader: onRefresh is undefined!');
    }
  };

  return (
    <div className={`flex justify-between items-start ${className}`}>
      <div className="text-center flex-1 flex-shrink mr-4">
        <h1 
          className="font-bold"
          style={{ 
            fontSize: settings?.header_font_size ? `${settings.header_font_size}px` : '3rem',
            color: settings?.header_text_color || '#111827'
          }}
        >
          {customerName}
        </h1>
      </div>
      {showRefresh && onRefresh && (
        <div className="flex flex-col items-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="relative z-10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Oppdater
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomerHeader;
