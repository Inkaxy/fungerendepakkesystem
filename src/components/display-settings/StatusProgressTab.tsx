
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import ColorPicker from './ColorPicker';
import SliderControl from './SliderControl';
import { Switch } from '@/components/ui/switch';
import { Truck } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface StatusProgressTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const StatusProgressTab = ({ settings, onUpdate }: StatusProgressTabProps) => {
  return (
    <div className="space-y-6">
      {/* STATUS Indicator Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">STATUS-indikator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-status"
              checked={settings.show_status_indicator}
              onCheckedChange={(checked) => onUpdate({ show_status_indicator: checked })}
            />
            <Label htmlFor="show-status">Vis STATUS-indikator</Label>
          </div>

          {settings.show_status_indicator && (
            <>
              <SliderControl
                label="STATUS tekststørrelse"
                value={settings.status_indicator_font_size}
                min={16}
                max={64}
                step={2}
                unit="px"
                onChange={(value) => onUpdate({ status_indicator_font_size: value })}
              />

              <SliderControl
                label="STATUS padding"
                value={settings.status_indicator_padding}
                min={8}
                max={48}
                step={4}
                unit="px"
                onChange={(value) => onUpdate({ status_indicator_padding: value })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ColorPicker
                  label="Pågående farge"
                  value={settings.packing_status_ongoing_color}
                  onChange={(color) => onUpdate({ packing_status_ongoing_color: color })}
                  description="Farge når pakking pågår"
                />
                <ColorPicker
                  label="Ferdig farge"
                  value={settings.packing_status_completed_color}
                  onChange={(color) => onUpdate({ packing_status_completed_color: color })}
                  description="Farge når pakking er ferdig"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Progress Bar Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progressbar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-progress-bar"
              checked={settings.show_progress_bar}
              onCheckedChange={(checked) => onUpdate({ show_progress_bar: checked })}
            />
            <Label htmlFor="show-progress-bar">Vis progressbar</Label>
          </div>

          {settings.show_progress_bar && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ColorPicker
                  label="Progressbar farge"
                  value={settings.progress_bar_color}
                  onChange={(color) => onUpdate({ progress_bar_color: color })}
                  description="Farge på fremgangsindikatoren"
                />
                <ColorPicker
                  label="Progressbar bakgrunn"
                  value={settings.progress_background_color}
                  onChange={(color) => onUpdate({ progress_background_color: color })}
                  description="Bakgrunnsfarge på progressbaren"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SliderControl
                  label="Progressbar høyde"
                  value={settings.progress_height}
                  min={4}
                  max={20}
                  step={2}
                  unit="px"
                  onChange={(value) => onUpdate({ progress_height: value })}
                />
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-percentage"
                    checked={settings.show_progress_percentage}
                    onCheckedChange={(checked) => onUpdate({ show_progress_percentage: checked })}
                  />
                  <Label htmlFor="show-percentage">Vis prosent</Label>
                </div>
              </div>

              {/* Truck Icon Settings */}
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
                        className="w-full h-2 bg-gray-200 rounded-full relative"
                        style={{ height: `${settings.progress_height}px` }}
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
                              left: '65%', 
                              marginLeft: `-${settings.truck_icon_size / 2}px`,
                              width: `${settings.truck_icon_size}px`,
                              height: `${settings.truck_icon_size}px`,
                              objectFit: 'contain'
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusProgressTab;
