import React from 'react';
import ToggleSetting from '../ToggleSetting';
import SliderControl from '../SliderControl';
import GridLayoutSelector from '../GridLayoutSelector';
import type { DisplaySettings } from '@/types/displaySettings';

interface SharedLayoutSectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
  customerCount?: number;
}

const SharedLayoutSection = ({ settings, onUpdate, customerCount = 0 }: SharedLayoutSectionProps) => {
  return (
    <div className="space-y-4">
      <ToggleSetting
        id="shared_compact_table_mode"
        label="Kompakt tabell-modus"
        description="Viser produkter i en kompakt tabell for å få plass til flere kunder på skjermen"
        checked={settings.shared_compact_table_mode ?? false}
        onCheckedChange={(checked) => onUpdate({ shared_compact_table_mode: checked })}
      />

      <ToggleSetting
        id="auto_fit_screen"
        label="Tilpass til skjerm"
        description="Skalerer automatisk slik at alle kundekort får plass på én skjerm uten scrolling"
        checked={settings.auto_fit_screen ?? false}
        onCheckedChange={(checked) => onUpdate({ auto_fit_screen: checked })}
      />

      {settings.auto_fit_screen && (
        <div className="space-y-4 pl-4 border-l-2 border-primary/20">
          <GridLayoutSelector 
            settings={settings} 
            onUpdate={onUpdate}
            customerCount={customerCount}
          />
          
          {/* Vis kun min-størrelse kontroller i automatisk modus */}
          {settings.grid_layout_mode !== 'fixed' && (
            <div className="grid gap-4 md:grid-cols-2">
              <SliderControl
                label="Minimum kort-høyde"
                value={settings.auto_fit_min_card_height ?? 180}
                onChange={(value) => onUpdate({ auto_fit_min_card_height: value })}
                min={120}
                max={300}
                step={10}
                unit="px"
                description="Garantert minimumshøyde for hvert kundekort"
              />
              <SliderControl
                label="Minimum kort-bredde"
                value={settings.auto_fit_min_card_width ?? 280}
                onChange={(value) => onUpdate({ auto_fit_min_card_width: value })}
                min={200}
                max={500}
                step={20}
                unit="px"
                description="Garantert minimumsbredde for hvert kundekort"
              />
            </div>
          )}
        </div>
      )}

      {!settings.auto_fit_screen && (
        <>
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
        </>
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
