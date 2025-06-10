
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import ColorPicker from '../ColorPicker';
import SliderControl from '../SliderControl';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface ProgressBarCardProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const ProgressBarCard = ({ settings, onUpdate }: ProgressBarCardProps) => {
  return (
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressBarCard;
