
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ColorPicker from './ColorPicker';
import SliderControl from './SliderControl';
import { Progress } from '@/components/ui/progress';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface ProgressSettingsTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const ProgressSettingsTab = ({ settings, onUpdate }: ProgressSettingsTabProps) => {
  return (
    <div className="space-y-6">
      {/* Progress Bar Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fremdriftslinje Farger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPicker
              label="Fremdrift farge"
              value={settings.progress_bar_color}
              onChange={(color) => onUpdate({ progress_bar_color: color })}
              description="Farge på den fylte delen av fremdriftslinjen"
            />
            <ColorPicker
              label="Bakgrunn farge"
              value={settings.progress_background_color}
              onChange={(color) => onUpdate({ progress_background_color: color })}
              description="Bakgrunnsfarge for fremdriftslinjen"
            />
          </div>
        </CardContent>
      </Card>

      {/* Progress Bar Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fremdriftslinje Innstillinger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SliderControl
            label="Høyde"
            value={settings.progress_height}
            onChange={(value) => onUpdate({ progress_height: value })}
            min={4}
            max={20}
            unit="px"
            description="Tykkelsen på fremdriftslinjen"
          />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Vis prosentandel</Label>
              <p className="text-xs text-gray-500 mt-1">
                Vis prosentverdi ved siden av fremdriftslinjen
              </p>
            </div>
            <Switch
              checked={settings.show_progress_percentage}
              onCheckedChange={(checked) => onUpdate({ show_progress_percentage: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Progress Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fremdrift Forhåndsvisning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Slik vil fremdriftslinjene se ut på displayet:
            </p>
            
            {/* Progress examples */}
            {[25, 50, 75, 100].map((value) => (
              <div key={value} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Ordre #{1000 + value}</span>
                  {settings.show_progress_percentage && (
                    <span className="text-sm text-gray-600">{value}%</span>
                  )}
                </div>
                <div className="relative">
                  <div 
                    className="w-full rounded-full"
                    style={{ 
                      backgroundColor: settings.progress_background_color,
                      height: `${settings.progress_height}px`
                    }}
                  >
                    <div 
                      className="rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: settings.progress_bar_color,
                        height: `${settings.progress_height}px`,
                        width: `${value}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressSettingsTab;
