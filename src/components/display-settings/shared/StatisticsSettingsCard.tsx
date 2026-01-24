
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3 } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import ColorPicker from '../ColorPicker';
import SliderControl from '../SliderControl';

interface StatisticsSettingsCardProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const StatisticsSettingsCard = ({ settings, onUpdate }: StatisticsSettingsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Statistikk-kort
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={settings.show_stats_cards}
            onCheckedChange={(checked) => onUpdate({ show_stats_cards: checked })}
          />
          <Label>Vis statistikk-kort</Label>
        </div>

        {settings.show_stats_cards && (
          <>
            <SliderControl
              label="Antall kolonner"
              value={settings.stats_columns}
              onChange={(value) => onUpdate({ stats_columns: value })}
              min={1}
              max={4}
              step={1}
            />

            <div>
              <Label>Statistikk-kort høyde</Label>
              <Select
                value={settings.stats_card_height}
                onValueChange={(value: 'compact' | 'normal' | 'large') => 
                  onUpdate({ stats_card_height: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Kompakt</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="large">Utvidet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ColorPicker
              label="Statistikk ikon farge"
              value={settings.stats_icon_color}
              onChange={(color) => onUpdate({ stats_icon_color: color })}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticsSettingsCard;
