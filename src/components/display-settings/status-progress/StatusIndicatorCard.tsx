
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import ColorPicker from '../ColorPicker';
import SliderControl from '../SliderControl';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface StatusIndicatorCardProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const StatusIndicatorCard = ({ settings, onUpdate }: StatusIndicatorCardProps) => {
  return (
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

            <SliderControl
              label="Status badge tekststørrelse"
              value={settings.status_badge_font_size}
              min={10}
              max={24}
              step={2}
              unit="px"
              onChange={(value) => onUpdate({ status_badge_font_size: value })}
              description="Størrelsen på teksten i status badges (Ferdig, Pågår, Venter)"
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
  );
};

export default StatusIndicatorCard;
