import React from 'react';
import ToggleSetting from '../ToggleSetting';
import SliderControl from '../SliderControl';
import type { DisplaySettings } from '@/types/displaySettings';

interface CustomerLayoutSectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const CustomerLayoutSection = ({ settings, onUpdate }: CustomerLayoutSectionProps) => {
  return (
    <div className="space-y-4">
      <ToggleSetting
        id="customer_fullscreen_mode"
        label="Fullskjerm-modus"
        description="Optimalisert for fullskjerm-visning"
        checked={settings.customer_fullscreen_mode}
        onCheckedChange={(checked) => onUpdate({ customer_fullscreen_mode: checked })}
      />

      <SliderControl
        label="Innholdspadding"
        value={settings.customer_content_padding}
        onChange={(value) => onUpdate({ customer_content_padding: value })}
        min={0}
        max={48}
        step={4}
        unit="px"
        description="Avstand fra kanten av skjermen"
      />

      <SliderControl
        label="Maks innholdsbredde"
        value={settings.customer_max_content_width}
        onChange={(value) => onUpdate({ customer_max_content_width: value })}
        min={600}
        max={1920}
        step={100}
        unit="px"
        description="Maksimal bredde på innholdet"
      />
    </div>
  );
};

export default CustomerLayoutSection;
