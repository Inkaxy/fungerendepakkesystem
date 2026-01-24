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
        id="shared_fullscreen_mode"
        label="Fullskjerm-modus"
        description="Optimalisert for fullskjerm-visning"
        checked={settings.shared_fullscreen_mode}
        onCheckedChange={(checked) => onUpdate({ shared_fullscreen_mode: checked })}
      />

      <ToggleSetting
        id="shared_auto_scroll"
        label="Auto-scroll"
        description="Automatisk scrolling når innholdet er for langt"
        checked={settings.shared_auto_scroll}
        onCheckedChange={(checked) => onUpdate({ shared_auto_scroll: checked })}
      />

      {settings.shared_auto_scroll && (
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
