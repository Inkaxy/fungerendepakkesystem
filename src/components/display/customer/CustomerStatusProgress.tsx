import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { PackingCustomer } from '@/hooks/usePackingData';
import { packingStatusColorMap } from '@/utils/displayStyleUtils';

interface CustomerStatusProgressProps {
  customerPackingData: PackingCustomer;
  isAllPacked: boolean;
  settings: DisplaySettings | undefined;
}

const CustomerStatusProgress = React.memo(({ 
  customerPackingData, 
  isAllPacked,
  settings 
}: CustomerStatusProgressProps) => {
  const progress = useMemo(() => 
    customerPackingData.progress_percentage,
    [customerPackingData.progress_percentage]
  );

  const statusColors = settings ? packingStatusColorMap(settings) : { ongoing: '#3b82f6', completed: '#10b981' };
  const statusColor = isAllPacked ? statusColors.completed : statusColors.ongoing;
  const statusText = isAllPacked ? 'Ferdig Pakket' : 'Pågående';

  // Use compact layout setting (default to true for better UX)
  const useCompactLayout = settings?.compact_status_progress ?? true;
  
  // Check visibility settings
  const showStatusIndicator = settings?.show_status_indicator ?? true;
  const showProgressBar = settings?.show_progress_bar ?? true;
  
  // Accessibility settings
  const reducedMotion = settings?.reduce_motion ?? false;
  const largeTouchTargets = settings?.large_touch_targets ?? false;
  
  // If both are hidden, don't render anything
  if (!showStatusIndicator && !showProgressBar) {
    return null;
  }
  
  // If both are hidden, don't render anything
  if (!showStatusIndicator && !showProgressBar) {
    return null;
  }

  if (!useCompactLayout) {
    // Original separate layout - status card + progress card
    return (
      <div className="space-y-4">
        {/* Status Indicator - only show if enabled */}
        {showStatusIndicator && (
          <Card
            className="text-center"
            style={{
              backgroundColor: statusColor,
              borderColor: statusColor,
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
                STATUS: {statusText}
              </h2>
            </CardContent>
          </Card>
        )}

        {/* Progress Bar - only show if enabled */}
        {showProgressBar && (
          <Card
            style={{
              backgroundColor: settings?.card_background_color || '#ffffff',
              borderColor: settings?.card_border_color || '#e5e7eb',
              borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
              boxShadow: settings?.card_shadow_intensity ? `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)` : undefined,
              overflow: 'visible',
            }}
          >
            <CardContent className="p-8 flex flex-col justify-center" style={{ overflow: 'visible' }}>
              <div className="space-y-4 flex flex-col items-center" style={{ overflow: 'visible' }}>
                {renderProgressBar(progress, settings)}
                {renderPercentage(progress, settings)}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Compact combined layout
  return (
    <Card
      style={{
        backgroundColor: settings?.card_background_color || '#ffffff',
        borderColor: settings?.card_border_color || '#e5e7eb',
        borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
        boxShadow: settings?.card_shadow_intensity ? `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)` : undefined,
        overflow: 'visible',
      }}
    >
      <CardContent className="p-6" style={{ overflow: 'visible' }}>
        <div className="flex items-center gap-6" style={{ overflow: 'visible' }}>
          {/* Status badge on the left - only show if enabled */}
          {showStatusIndicator && (
            <div 
              className="flex-shrink-0 rounded-lg px-6 py-3"
              style={{
                backgroundColor: statusColor,
                borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
              }}
            >
              <span 
                className="font-bold text-white whitespace-nowrap"
                style={{ 
                  fontSize: settings?.status_indicator_font_size 
                    ? `${Math.max(16, settings.status_indicator_font_size * 0.6)}px` 
                    : '20px' 
                }}
              >
                {statusText}
              </span>
            </div>
          )}

          {/* Progress bar in the middle - only show if enabled */}
          {showProgressBar && (
            <div className="flex-1 flex items-center gap-4" style={{ overflow: 'visible' }}>
              <div 
                className="flex-1 rounded-full relative overflow-visible"
                style={{ 
                  backgroundColor: settings?.progress_background_color || '#e5e7eb',
                  height: settings?.progress_height ? `${settings.progress_height * 3}px` : '24px',
                }}
              >
                <div 
                  className="rounded-full h-full"
                  style={{ 
                    backgroundColor: settings?.progress_bar_color || '#3b82f6',
                    width: `${progress}%`,
                    transition: (!reducedMotion && (settings?.enable_animations ?? true)) ? 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                    willChange: 'width',
                  }}
                />
                {(settings?.show_truck_icon ?? true) && (
                  <img
                    src="/lovable-uploads/37c33860-5f09-44ea-a64c-a7e7fb7c925b.png"
                    alt="Varebil"
                    className="absolute top-1/2 transform -translate-y-1/2" 
                    style={{ 
                      left: `calc(${progress}% - ${(settings?.truck_icon_size || 20) / 2}px)`,
                      width: `${settings?.truck_icon_size || 20}px`,
                      height: `${settings?.truck_icon_size || 20}px`,
                      objectFit: 'contain',
                      transition: (!reducedMotion && (settings?.enable_animations ?? true)) ? 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                      zIndex: 10,
                    }}
                  />
                )}
              </div>

              {/* Percentage on the right */}
              {(settings?.show_progress_percentage ?? true) && (
                <span 
                  className="text-2xl font-bold flex-shrink-0"
                  style={{ color: settings?.text_color || '#374151' }}
                >
                  {settings?.progress_show_fraction 
                    ? `${customerPackingData.packed_line_items_all}/${customerPackingData.total_line_items_all}`
                    : `${progress}%`
                  }
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.customerPackingData.progress_percentage === nextProps.customerPackingData.progress_percentage &&
    prevProps.customerPackingData.packed_line_items_all === nextProps.customerPackingData.packed_line_items_all &&
    prevProps.customerPackingData.total_line_items_all === nextProps.customerPackingData.total_line_items_all &&
    prevProps.isAllPacked === nextProps.isAllPacked &&
    prevProps.settings?.progress_bar_color === nextProps.settings?.progress_bar_color &&
    prevProps.settings?.progress_background_color === nextProps.settings?.progress_background_color &&
    prevProps.settings?.show_truck_icon === nextProps.settings?.show_truck_icon &&
    prevProps.settings?.show_status_indicator === nextProps.settings?.show_status_indicator &&
    prevProps.settings?.show_progress_bar === nextProps.settings?.show_progress_bar &&
    prevProps.settings?.show_progress_percentage === nextProps.settings?.show_progress_percentage &&
    prevProps.settings?.progress_show_fraction === nextProps.settings?.progress_show_fraction &&
    prevProps.settings?.compact_status_progress === nextProps.settings?.compact_status_progress &&
    prevProps.settings?.enable_animations === nextProps.settings?.enable_animations &&
    prevProps.settings?.reduce_motion === nextProps.settings?.reduce_motion &&
    prevProps.settings?.large_touch_targets === nextProps.settings?.large_touch_targets
  );
});

// Helper function to render progress bar
function renderProgressBar(progress: number, settings: DisplaySettings | undefined) {
  return (
    <div 
      className="w-full rounded-full relative overflow-visible"
      style={{ 
        backgroundColor: settings?.progress_background_color || '#e5e7eb',
        height: settings?.progress_height ? `${settings.progress_height * 4}px` : '32px',
        marginLeft: `${(settings?.truck_icon_size || 24) / 2}px`,
        marginRight: `${(settings?.truck_icon_size || 24) / 2}px`,
        marginTop: `${Math.max(0, ((settings?.truck_icon_size || 24) - (settings?.progress_height ? settings.progress_height * 4 : 32)) / 2)}px`,
        marginBottom: `${Math.max(0, ((settings?.truck_icon_size || 24) - (settings?.progress_height ? settings.progress_height * 4 : 32)) / 2)}px`,
      }}
    >
      <div 
        className="rounded-full h-full"
        style={{ 
          backgroundColor: settings?.progress_bar_color || '#3b82f6',
          width: `${progress}%`,
          transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'width',
        }}
      />
      {(settings?.show_truck_icon ?? true) && (
        <img
          src="/lovable-uploads/37c33860-5f09-44ea-a64c-a7e7fb7c925b.png"
          alt="Varebil"
          className="absolute top-1/2 transform -translate-y-1/2" 
          style={{ 
            left: `calc(${progress}% - ${(settings?.truck_icon_size || 24) / 2}px)`,
            width: `${settings?.truck_icon_size || 24}px`,
            height: `${settings?.truck_icon_size || 24}px`,
            objectFit: 'contain',
            transition: 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}

// Helper function to render percentage
function renderPercentage(progress: number, settings: DisplaySettings | undefined) {
  if (!(settings?.show_progress_percentage ?? true)) return null;
  
  return (
    <div className="text-center">
      <span 
        className="text-3xl font-bold"
        style={{ color: settings?.text_color || '#374151' }}
      >
        {progress}%
      </span>
    </div>
  );
}

CustomerStatusProgress.displayName = 'CustomerStatusProgress';

export default CustomerStatusProgress;
