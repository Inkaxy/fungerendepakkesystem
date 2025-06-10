
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import ColorPicker from './ColorPicker';
import SliderControl from './SliderControl';
import { Switch } from '@/components/ui/switch';
import { Truck } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface ProgressSettingsTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const ProgressSettingsTab = ({ settings, onUpdate }: ProgressSettingsTabProps) => {
  return (
    <div className="space-y-6">
      {/* Progress Bar Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>Progressbar visning</CardTitle>
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
          <p className="text-sm text-gray-600">
            Skru av/på hele progressbar-seksjonen i displayet
          </p>
        </CardContent>
      </Card>

      {/* Progress Bar Settings - Only show if progress bar is enabled */}
      {settings.show_progress_bar && (
        <Card>
          <CardHeader>
            <CardTitle>Progressbar innstillinger</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <ColorPicker
                label="Progressbar farge"
                value={settings.progress_bar_color}
                onChange={(color) => onUpdate({ progress_bar_color: color })}
              />
            </div>

            <div>
              <ColorPicker
                label="Progressbar bakgrunn"
                value={settings.progress_background_color}
                onChange={(color) => onUpdate({ progress_background_color: color })}
              />
            </div>

            <SliderControl
              label="Progressbar høyde"
              value={settings.progress_height}
              min={4}
              max={20}
              step={2}
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
          </CardContent>
        </Card>
      )}

      {/* Truck Icon Settings - Only show if progress bar is enabled */}
      {settings.show_progress_bar && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>Varebil ikon</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                max={48}
                step={2}
                onChange={(value) => onUpdate({ truck_icon_size: value })}
                unit="px"
                description="Størrelsen på varebil-ikonet"
              />
            )}

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Forhåndsvisning:</p>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-full h-2 bg-gray-200 rounded-full relative"
                >
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: '65%' }}
                  />
                  {settings.show_truck_icon && (
                    <Truck 
                      className="absolute top-1/2 transform -translate-y-1/2 text-gray-700" 
                      style={{ 
                        left: '65%', 
                        marginLeft: '-12px',
                        width: `${settings.truck_icon_size}px`,
                        height: `${settings.truck_icon_size}px`
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Status */}
      <Card>
        <CardHeader>
          <CardTitle>Ferdig status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <ColorPicker
              label="&quot;Ferdig Pakket&quot; farge"
              value={settings.packing_status_completed_color}
              onChange={(color) => onUpdate({ packing_status_completed_color: color })}
            />
          </div>

          <div>
            <Label>Ferdig status tekst farge</Label>
            <div className="mt-2 p-3 rounded-md bg-gray-100">
              <p className="text-sm text-gray-600">
                Teksten "STATUS: Ferdig Pakket" vises alltid i hvit farge for best kontrast.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Varelinjer beregning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Fremdriften beregnes basert på antall varelinjer (order_products) som er pakket, ikke antall produkter.
            </p>
            <p className="text-sm text-gray-600">
              Dette gir en mer nøyaktig fremstilling av pakkingsfremgang.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressSettingsTab;
