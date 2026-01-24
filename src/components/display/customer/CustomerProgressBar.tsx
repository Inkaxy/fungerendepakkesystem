import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DisplaySettings } from '@/types/displaySettings';
import { PackingCustomer } from '@/hooks/usePackingData';
import { cn } from '@/lib/utils';

interface CustomerProgressBarProps {
  customerPackingData: PackingCustomer;
  settings: DisplaySettings | undefined;
}

const CustomerProgressBar = React.memo(({ customerPackingData, settings }: CustomerProgressBarProps) => {
  const progress = useMemo(() => 
    customerPackingData.progress_percentage,
    [customerPackingData.progress_percentage]
  );

  // Get progress bar style based on settings
  const progressBarStyle = settings?.progress_bar_style || 'bar';

  // Get truck animation class
  const getTruckAnimationClass = () => {
    switch (settings?.truck_animation_style) {
      case 'bounce':
        return 'animate-bounce';
      case 'pulse':
        return 'animate-pulse';
      case 'slide':
        return ''; // Slide is handled by CSS transition
      case 'none':
      default:
        return '';
    }
  };

  // Render circular progress
  const renderCircularProgress = () => {
    const size = (settings?.progress_height || 8) * 16;
    const strokeWidth = Math.max(8, size / 10);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
      <div className="flex flex-col items-center gap-4">
        <svg 
          width={size} 
          height={size} 
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={settings?.progress_background_color || '#e5e7eb'}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={settings?.progress_bar_color || '#3b82f6'}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>
        {(settings?.show_progress_percentage ?? true) && (
          <span 
            className="text-3xl font-bold"
            style={{ color: settings?.text_color || '#374151' }}
          >
            {progress}%
          </span>
        )}
        {(settings?.progress_show_fraction ?? false) && (
          <span 
            className="text-lg"
            style={{ color: settings?.text_color || '#6b7280' }}
          >
            {customerPackingData.packed_line_items_all}/{customerPackingData.total_line_items_all} varelinjer
          </span>
        )}
      </div>
    );
  };

  // Render steps progress
  const renderStepsProgress = () => {
    const totalSteps = customerPackingData.total_line_items_all || 5;
    const completedSteps = customerPackingData.packed_line_items_all || 0;
    const displaySteps = Math.min(totalSteps, 10); // Max 10 steps for display
    const stepsRatio = totalSteps / displaySteps;

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          {Array.from({ length: displaySteps }).map((_, idx) => {
            const stepProgress = Math.floor((idx + 1) * stepsRatio);
            const isCompleted = completedSteps >= stepProgress;
            const isCurrent = completedSteps >= Math.floor(idx * stepsRatio) && 
                             completedSteps < stepProgress;
            
            return (
              <div
                key={idx}
                className={cn(
                  "rounded-full transition-all duration-300",
                  isCurrent && "ring-2 ring-offset-2 ring-blue-500"
                )}
                style={{
                  width: `${(settings?.progress_height || 8) * 3}px`,
                  height: `${(settings?.progress_height || 8) * 3}px`,
                  backgroundColor: isCompleted 
                    ? (settings?.progress_bar_color || '#3b82f6')
                    : (settings?.progress_background_color || '#e5e7eb'),
                }}
              />
            );
          })}
        </div>
        {(settings?.show_progress_percentage ?? true) && (
          <span 
            className="text-3xl font-bold"
            style={{ color: settings?.text_color || '#374151' }}
          >
            {progress}%
          </span>
        )}
        {(settings?.progress_show_fraction ?? false) && (
          <span 
            className="text-lg"
            style={{ color: settings?.text_color || '#6b7280' }}
          >
            {completedSteps}/{totalSteps} varelinjer
          </span>
        )}
      </div>
    );
  };

  // Render bar progress (default)
  const renderBarProgress = () => (
    <div className="space-y-4 flex flex-col items-center" style={{ overflow: 'visible' }}>
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
          className={cn(
            "rounded-full h-full",
            (settings?.progress_animation ?? true) && progress < 100 && "animate-pulse"
          )}
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
            className={cn(
              "absolute top-1/2 transform -translate-y-1/2",
              getTruckAnimationClass()
            )}
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
      <div className="text-center space-y-1">
        {(settings?.show_progress_percentage ?? true) && (
          <span 
            className="text-3xl font-bold block"
            style={{ color: settings?.text_color || '#374151' }}
          >
            {progress}%
          </span>
        )}
        {(settings?.progress_show_fraction ?? false) && (
          <span 
            className="text-lg block"
            style={{ color: settings?.text_color || '#6b7280' }}
          >
            {customerPackingData.packed_line_items_all}/{customerPackingData.total_line_items_all} varelinjer
          </span>
        )}
      </div>
    </div>
  );

  return (
    <Card
      style={{
        backgroundColor: settings?.card_background_color || '#ffffff',
        borderColor: settings?.card_border_color || '#e5e7eb',
        borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
        boxShadow: settings?.card_shadow_intensity 
          ? `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)` 
          : undefined,
        overflow: 'visible',
      }}
    >
      <CardContent className="p-8 flex flex-col justify-center" style={{ overflow: 'visible' }}>
        {progressBarStyle === 'circular' && renderCircularProgress()}
        {progressBarStyle === 'steps' && renderStepsProgress()}
        {progressBarStyle === 'bar' && renderBarProgress()}
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.customerPackingData.progress_percentage === nextProps.customerPackingData.progress_percentage &&
    prevProps.customerPackingData.packed_line_items_all === nextProps.customerPackingData.packed_line_items_all &&
    prevProps.settings?.progress_bar_color === nextProps.settings?.progress_bar_color &&
    prevProps.settings?.progress_background_color === nextProps.settings?.progress_background_color &&
    prevProps.settings?.progress_bar_style === nextProps.settings?.progress_bar_style &&
    prevProps.settings?.show_truck_icon === nextProps.settings?.show_truck_icon &&
    prevProps.settings?.progress_animation === nextProps.settings?.progress_animation
  );
});

CustomerProgressBar.displayName = 'CustomerProgressBar';

export default CustomerProgressBar;
