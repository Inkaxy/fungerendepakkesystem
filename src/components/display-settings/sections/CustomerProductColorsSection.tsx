import React from 'react';
import { Card } from '@/components/ui/card';
import ColorPicker from '../ColorPicker';
import ToggleSetting from '../ToggleSetting';
import type { DisplaySettings } from '@/types/displaySettings';
import { getConsistentColorIndex } from '@/utils/productColorUtils';

interface CustomerProductColorsSectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const CustomerProductColorsSection = ({ settings, onUpdate }: CustomerProductColorsSectionProps) => {
  return (
    <div className="space-y-4">
      {/* Consistent Product Colors Toggle */}
      <ToggleSetting
        id="use_consistent_product_colors"
        label="Konsistente produktfarger"
        description="Samme produkt vises alltid med samme farge, uansett rekkefølge"
        checked={settings.use_consistent_product_colors ?? false}
        onCheckedChange={(checked) => onUpdate({ use_consistent_product_colors: checked })}
      />

      <p className="text-sm text-muted-foreground">
        Definer farger for alternerende produktrader (gjentas for alle produkter)
      </p>

      {/* Product Row 1 */}
      <Card className="p-4">
        <h4 className="font-medium mb-3">Produktrad 1</h4>
        <div className="grid gap-4 md:grid-cols-3">
          <ColorPicker
            label="Bakgrunn"
            value={settings.product_1_bg_color}
            onChange={(color) => onUpdate({ product_1_bg_color: color })}
          />
          <ColorPicker
            label="Tekstfarge"
            value={settings.product_1_text_color}
            onChange={(color) => onUpdate({ product_1_text_color: color })}
          />
          <ColorPicker
            label="Aksentfarge"
            value={settings.product_1_accent_color}
            onChange={(color) => onUpdate({ product_1_accent_color: color })}
          />
        </div>
      </Card>

      {/* Product Row 2 */}
      <Card className="p-4">
        <h4 className="font-medium mb-3">Produktrad 2</h4>
        <div className="grid gap-4 md:grid-cols-3">
          <ColorPicker
            label="Bakgrunn"
            value={settings.product_2_bg_color}
            onChange={(color) => onUpdate({ product_2_bg_color: color })}
          />
          <ColorPicker
            label="Tekstfarge"
            value={settings.product_2_text_color}
            onChange={(color) => onUpdate({ product_2_text_color: color })}
          />
          <ColorPicker
            label="Aksentfarge"
            value={settings.product_2_accent_color}
            onChange={(color) => onUpdate({ product_2_accent_color: color })}
          />
        </div>
      </Card>

      {/* Product Row 3 */}
      <Card className="p-4">
        <h4 className="font-medium mb-3">Produktrad 3</h4>
        <div className="grid gap-4 md:grid-cols-3">
          <ColorPicker
            label="Bakgrunn"
            value={settings.product_3_bg_color}
            onChange={(color) => onUpdate({ product_3_bg_color: color })}
          />
          <ColorPicker
            label="Tekstfarge"
            value={settings.product_3_text_color}
            onChange={(color) => onUpdate({ product_3_text_color: color })}
          />
          <ColorPicker
            label="Aksentfarge"
            value={settings.product_3_accent_color}
            onChange={(color) => onUpdate({ product_3_accent_color: color })}
          />
        </div>
      </Card>

      {/* Preview */}
      <Card className="p-4">
        <h4 className="font-medium mb-3">Forhåndsvisning</h4>
        <div className="space-y-2">
          {[1, 2, 3].map((num) => {
            const bgColor = settings[`product_${num}_bg_color` as keyof DisplaySettings] as string;
            const textColor = settings[`product_${num}_text_color` as keyof DisplaySettings] as string;
            const accentColor = settings[`product_${num}_accent_color` as keyof DisplaySettings] as string;
            return (
              <div
                key={num}
                className="flex justify-between items-center p-3 rounded-lg"
                style={{ backgroundColor: bgColor }}
              >
                <span style={{ color: textColor }}>Produkt {num}</span>
                <span className="font-bold" style={{ color: accentColor }}>24 stk</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default CustomerProductColorsSection;
