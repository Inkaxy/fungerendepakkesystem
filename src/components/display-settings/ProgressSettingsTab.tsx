
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import ColorPicker from './ColorPicker';
import SliderControl from './SliderControl';
import { Switch } from '@/components/ui/switch';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface ProgressSettingsTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const ProgressSettingsTab = ({ settings, onUpdate }: ProgressSettingsTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Progressbar innstillinger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Progressbar farge</Label>
            <ColorPicker
              value={settings.progress_bar_color}
              onChange={(color) => onUpdate({ progress_bar_color: color })}
            />
          </div>

          <div>
            <Label>Progressbar bakgrunn</Label>
            <ColorPicker
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

      <Card>
        <CardHeader>
          <CardTitle>Ferdig status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>"Ferdig Pakket" farge</Label>
            <ColorPicker
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
