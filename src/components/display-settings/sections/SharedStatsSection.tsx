import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ToggleSetting from '../ToggleSetting';
import SliderControl from '../SliderControl';
import ColorPicker from '../ColorPicker';
import type { DisplaySettings } from '@/types/displaySettings';

interface SharedStatsSectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const SharedStatsSection = ({ settings, onUpdate }: SharedStatsSectionProps) => {
  return (
    <div className="space-y-4">
      <ToggleSetting
        id="show_stats_cards"
        label="Vis statistikk-kort"
        description="Vis oppsummering med antall kunder, produkter og fremdrift"
        checked={settings.show_stats_cards}
        onCheckedChange={(checked) => onUpdate({ show_stats_cards: checked })}
      />

      {settings.show_stats_cards && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <SliderControl
              label="Antall kolonner"
              value={settings.stats_columns}
              onChange={(value) => onUpdate({ stats_columns: value })}
              min={1}
              max={4}
              step={1}
            />
            <div className="space-y-2">
              <Label>Kort-høyde</Label>
              <Select
                value={settings.stats_card_height}
                onValueChange={(value: 'compact' | 'normal' | 'large') => onUpdate({ stats_card_height: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Kompakt</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="large">Stor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Kort-stil</Label>
            <Select
              value={settings.stats_card_style}
              onValueChange={(value: 'filled' | 'outlined' | 'minimal') => onUpdate({ stats_card_style: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="filled">Fylt bakgrunn</SelectItem>
                <SelectItem value="outlined">Kun ramme</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ToggleSetting
              id="stats_show_percentage"
              label="Vis prosent"
              description="Vis prosentandel i statistikk"
              checked={settings.stats_show_percentage}
              onCheckedChange={(checked) => onUpdate({ stats_show_percentage: checked })}
            />
            <ToggleSetting
              id="stats_show_icons"
              label="Vis ikoner"
              description="Vis ikoner ved hver statistikk"
              checked={settings.stats_show_icons}
              onCheckedChange={(checked) => onUpdate({ stats_show_icons: checked })}
            />
          </div>

          <ColorPicker
            label="Ikon-farge"
            value={settings.stats_icon_color}
            onChange={(color) => onUpdate({ stats_icon_color: color })}
          />
        </>
      )}
    </div>
  );
};

export default SharedStatsSection;
