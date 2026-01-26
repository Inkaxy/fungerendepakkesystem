import React from 'react';
import ToggleSetting from '../ToggleSetting';
import SliderControl from '../SliderControl';
import type { DisplaySettings } from '@/types/displaySettings';

interface SharedLayoutSectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const SharedLayoutSection = ({ settings, onUpdate }: SharedLayoutSectionProps) => {
  return (
    <div className="space-y-4">
      <ToggleSetting
        id="auto_fit_screen"
        label="Tilpass til skjerm"
        description="Skalerer automatisk slik at alle kundekort får plass på én skjerm uten scrolling"
        checked={settings.auto_fit_screen ?? false}
        onCheckedChange={(checked) => onUpdate({ auto_fit_screen: checked })}
      />

      {!settings.auto_fit_screen && (
        <ToggleSetting
          id="shared_auto_scroll"
          label="Auto-scroll"
          description="Automatisk scrolling når innholdet er for langt"
          checked={settings.shared_auto_scroll}
          onCheckedChange={(checked) => onUpdate({ shared_auto_scroll: checked })}
        />
      )}

      {!settings.auto_fit_screen && settings.shared_auto_scroll && (
        <SliderControl
          label="Scroll-hastighet"
          value={settings.shared_scroll_speed}
          onChange={(value) => onUpdate({ shared_scroll_speed: value })}
          min={10}
          max={100}
          step={5}
          unit="px/s"
          description="Hastighet for automatisk scrolling"
        />
      )}

      <SliderControl
        label="Innholdspadding"
        value={settings.shared_content_padding}
        onChange={(value) => onUpdate({ shared_content_padding: value })}
        min={0}
        max={48}
        step={4}
        unit="px"
        description="Avstand fra kanten av skjermen"
      />
    </div>
  );
};

export default SharedLayoutSection;
