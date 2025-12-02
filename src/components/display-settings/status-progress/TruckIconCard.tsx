
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Truck } from 'lucide-react';
import SliderControl from '../SliderControl';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface TruckIconCardProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const TruckIconCard = ({ settings, onUpdate }: TruckIconCardProps) => {
  if (!settings.show_progress_bar) {
    return null;
  }

  return (
    <div className="border-t pt-4">
      <div className="flex items-center space-x-2 mb-4">
        <Truck className="h-5 w-5" />
        <Label className="text-sm font-medium">Varebil ikon</Label>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="show-truck-icon"
            checked={settings.show_truck_icon}
            onCheckedChange={(checked) => onUpdate({ show_truck_icon: checked })}
          />
          <Label htmlFor="show-truck-icon">Vis varebil på progressbar</Label>
        </div>

        {settings.show_truck_icon && (
          <SliderControl
            label="Varebil størrelse"
            value={settings.truck_icon_size}
            min={16}
            max={100}
            step={4}
            onChange={(value) => onUpdate({ truck_icon_size: value })}
            unit="px"
            description="Størrelsen på varebil-ikonet"
          />
        )}

        {/* Preview */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Forhåndsvisning:</p>
          <div className="flex items-center space-x-2">
            <div 
              className="w-full h-2 bg-gray-200 rounded-full relative overflow-visible"
              style={{ 
                height: `${settings.progress_height}px`,
                marginLeft: `${(settings.truck_icon_size || 24) / 2}px`,
                marginRight: `${(settings.truck_icon_size || 24) / 2}px`,
              }}
            >
              <div 
                className="h-full rounded-full"
                style={{ 
                  width: '65%',
                  backgroundColor: settings.progress_bar_color
                }}
              />
              {settings.show_truck_icon && (
                <img 
                  src="/lovable-uploads/37c33860-5f09-44ea-a64c-a7e7fb7c925b.png"
                  alt="Varebil"
                  className="absolute top-1/2 transform -translate-y-1/2" 
                  style={{ 
                    left: `calc(65% - ${(settings.truck_icon_size || 24) / 2}px)`,
                    width: `${settings.truck_icon_size}px`,
                    height: `${settings.truck_icon_size}px`,
                    objectFit: 'contain',
                    zIndex: 10,
                  }}
                />
              )}
            </div>
          </div>
          {settings.show_progress_percentage && (
            <p className="text-center text-sm mt-2" style={{ color: settings.text_color }}>
              65%
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TruckIconCard;
