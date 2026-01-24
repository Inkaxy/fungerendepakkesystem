import React from 'react';
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
        checked={settings.high_contrast_mode}
        onCheckedChange={(checked) => onUpdate({ high_contrast_mode: checked })}
      />

      <ToggleSetting
        id="large_touch_targets"
        label="Store berøringsmål"
        description="Øk størrelsen på knapper og interaktive elementer"
        checked={settings.large_touch_targets}
        onCheckedChange={(checked) => onUpdate({ large_touch_targets: checked })}
      />

      <ToggleSetting
        id="reduce_motion"
        label="Reduser bevegelse"
        description="Minimer animasjoner for brukere med bevegelsessensitivitet"
        checked={settings.reduce_motion}
        onCheckedChange={(checked) => onUpdate({ reduce_motion: checked })}
      />
    </div>
  );
};

export default CustomerAccessibilitySection;
