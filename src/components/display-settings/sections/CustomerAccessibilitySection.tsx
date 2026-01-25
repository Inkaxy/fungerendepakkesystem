import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ToggleSetting from '../ToggleSetting';
import type { DisplaySettings } from '@/types/displaySettings';

interface CustomerAccessibilitySectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const CustomerAccessibilitySection = ({ settings, onUpdate }: CustomerAccessibilitySectionProps) => {
  return (
    <div className="space-y-4">
      <ToggleSetting
        id="high_contrast_mode"
        label="Høykontrast-modus"
        description="Øk kontrasten for bedre synlighet"
        checked={settings.high_contrast_mode ?? false}
        onCheckedChange={(checked) => onUpdate({ high_contrast_mode: checked })}
      />

      <ToggleSetting
        id="large_touch_targets"
        label="Store berøringsmål"
        description="Øk størrelsen på knapper og interaktive elementer"
        checked={settings.large_touch_targets ?? false}
        onCheckedChange={(checked) => onUpdate({ large_touch_targets: checked })}
      />

      <ToggleSetting
        id="reduce_motion"
        label="Reduser bevegelse"
        description="Minimer animasjoner for brukere med bevegelsessensitivitet"
        checked={settings.reduce_motion ?? false}
        onCheckedChange={(checked) => onUpdate({ reduce_motion: checked })}
      />

      <div className="space-y-2">
        <Label>Animasjonshastighet</Label>
        <Select
          value={settings.animation_speed ?? 'normal'}
          onValueChange={(value: 'slow' | 'normal' | 'fast') => onUpdate({ animation_speed: value })}
        >
          <SelectTrigger className="bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-lg z-50">
            <SelectItem value="slow">Langsom</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="fast">Rask</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Justerer hastigheten på alle animasjoner
        </p>
      </div>
    </div>
  );
};

export default CustomerAccessibilitySection;
