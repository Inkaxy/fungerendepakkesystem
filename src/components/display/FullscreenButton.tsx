import React from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useFullscreen } from '@/hooks/useFullscreen';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface FullscreenButtonProps {
  settings?: DisplaySettings;
  className?: string;
}

const FullscreenButton = ({ settings, className = '' }: FullscreenButtonProps) => {
  const { isFullscreen, isSupported, toggleFullscreen } = useFullscreen();

  // Don't render if Fullscreen API is not supported
  if (!isSupported) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleFullscreen}
      title={isFullscreen ? 'Avslutt fullskjerm (Esc)' : 'Fullskjerm'}
      className={`h-8 px-2 ${className}`}
      style={{
        color: settings?.text_color || '#6b7280',
      }}
    >
      {isFullscreen ? (
        <Minimize2 className="h-4 w-4" />
      ) : (
        <Maximize2 className="h-4 w-4" />
      )}
      <span className="ml-1.5 text-xs hidden sm:inline">
        {isFullscreen ? 'Avslutt' : 'Fullskjerm'}
      </span>
    </Button>
  );
};

export default FullscreenButton;
