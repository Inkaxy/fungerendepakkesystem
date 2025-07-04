import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Pause, Play } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface InteractiveControlsProps {
  settings: DisplaySettings;
  onRefresh?: () => void;
}

const InteractiveControls = ({ settings, onRefresh }: InteractiveControlsProps) => {
  const [isPaused, setIsPaused] = useState(false);

  const getPositionClasses = () => {
    switch (settings.manual_refresh_button_position) {
      case 'top-left':
        return 'fixed top-4 left-4';
      case 'top-right':
        return 'fixed top-4 right-4';
      case 'bottom-left':
        return 'fixed bottom-4 left-4';
      case 'bottom-right':
        return 'fixed bottom-4 right-4';
      default:
        return 'fixed top-4 right-4';
    }
  };

  const touchSize = settings.touch_friendly_sizes 
    ? { minWidth: `${settings.touch_target_size}px`, minHeight: `${settings.touch_target_size}px` }
    : {};

  return (
    <div className={`${getPositionClasses()} z-20 flex gap-2`}>
      {settings.show_manual_refresh_button && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="bg-white/90 hover:bg-white shadow-md"
          style={touchSize}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      )}
      
      {settings.pause_mode_enabled && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPaused(!isPaused)}
          className="bg-white/90 hover:bg-white shadow-md"
          style={touchSize}
        >
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
};

export default InteractiveControls;