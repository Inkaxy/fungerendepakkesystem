import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface Preset {
  name: string;
  description: string;
  icon: string;
  settings: Partial<DisplaySettings>;
}

const presets: Preset[] = [
  {
    name: 'Kompakt',
    description: 'Perfekt for små skjermer eller mange produkter',
    icon: '📱',
    settings: {
      product_name_font_size: 16,
      product_quantity_font_size: 32,
      product_unit_font_size: 16,
      line_items_count_font_size: 14,
      status_badge_font_size: 12,
      product_card_size: 85
    }
  },
  {
    name: 'Normal',
    description: 'Standard innstillinger, godt balansert',
    icon: '💼',
    settings: {
      product_name_font_size: 24,
      product_quantity_font_size: 48,
      product_unit_font_size: 24,
      line_items_count_font_size: 18,
      status_badge_font_size: 14,
      product_card_size: 100
    }
  },
  {
    name: 'Stor',
    description: 'Tydelig for medium til store skjermer',
    icon: '📺',
    settings: {
      product_name_font_size: 36,
      product_quantity_font_size: 72,
      product_unit_font_size: 32,
      line_items_count_font_size: 24,
      status_badge_font_size: 16,
      product_card_size: 120
    }
  },
  {
    name: 'Ekstra Stor',
    description: 'Optimal for store skjermer på avstand',
    icon: '🖥️',
    settings: {
      product_name_font_size: 48,
      product_quantity_font_size: 96,
      product_unit_font_size: 40,
      line_items_count_font_size: 28,
      status_badge_font_size: 18,
      product_card_size: 140
    }
  }
];

interface PresetSelectorProps {
  onApplyPreset: (settings: Partial<DisplaySettings>) => void;
}

const PresetSelector = ({ onApplyPreset }: PresetSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">🚀 Hurtigvalg Presets</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Velg en forhåndsdefinert kombinasjon for rask oppsett. Du kan fortsatt justere individuelt etterpå.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              className="h-auto flex-col items-start p-4 hover:bg-primary/5 hover:border-primary"
              onClick={() => onApplyPreset(preset.settings)}
            >
              <span className="text-2xl mb-2">{preset.icon}</span>
              <span className="font-semibold">{preset.name}</span>
              <span className="text-xs text-muted-foreground text-left mt-1">
                {preset.description}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PresetSelector;
