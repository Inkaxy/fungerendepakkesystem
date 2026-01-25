
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { cn } from '@/lib/utils';

interface CustomerHeaderProps {
  customerName: string;
  bakeryName?: string;
  showRefresh?: boolean;
  onRefresh?: () => void;
  settings?: DisplaySettings;
  className?: string;
}

const CustomerHeader = ({ 
  customerName,
  bakeryName,
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

  // Use customer_display_header_size if available, fallback to header_font_size
  const headerSize = settings?.customer_display_header_size || settings?.header_font_size || 32;
  
  // Use customer_header_alignment for text alignment
  const alignment = settings?.customer_header_alignment || 'center';
  const alignmentClass = alignment === 'left' ? 'text-left' : 
                         alignment === 'right' ? 'text-right' : 'text-center';

  return (
    <div className={cn("flex justify-between items-start", className)}>
      <div className={cn("flex-1 flex-shrink mr-4", alignmentClass)}>
        {/* Show bakery name if enabled */}
        {settings?.customer_show_bakery_name && bakeryName && (
          <p 
            className="text-lg mb-1 opacity-70"
            style={{ color: settings?.text_color || '#6b7280' }}
          >
            {bakeryName}
          </p>
        )}
        <h1 
          className="font-bold"
          style={{ 
            fontSize: `${headerSize}px`,
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
