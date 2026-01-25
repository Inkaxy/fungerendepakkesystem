import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ToggleSetting from '../ToggleSetting';
import SliderControl from '../SliderControl';
import type { DisplaySettings } from '@/types/displaySettings';

interface SharedProductListSectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const SharedProductListSection = ({ settings, onUpdate }: SharedProductListSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <SliderControl
          label="Maks produkter per kort"
          value={settings.max_products_per_card}
          onChange={(value) => onUpdate({ max_products_per_card: value })}
          min={3}
          max={20}
          step={1}
        />
        <div className="space-y-2">
          <Label>Produkt-listestil</Label>
          <Select
            value={settings.product_list_style}
            onValueChange={(value: 'normal' | 'compact' | 'detailed') => onUpdate({ product_list_style: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Kompakt</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="detailed">Detaljert</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SliderControl
          label="Produktnavn tekststørrelse"
          value={settings.shared_product_font_size}
          onChange={(value) => onUpdate({ shared_product_font_size: value })}
          min={10}
          max={24}
          step={1}
          unit="px"
        />
        <SliderControl
          label="Produktantall tekststørrelse"
          value={Math.round((settings.shared_product_font_size || 14) * 1.2)}
          onChange={(value) => onUpdate({ shared_product_font_size: Math.round(value / 1.2) })}
          min={12}
          max={32}
          step={1}
          unit="px"
          description="Antallet vises 20% større enn navn"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ToggleSetting
          id="show_line_items_count"
          label="Vis antall linjer"
          description="Vis total antall produktlinjer"
          checked={settings.show_line_items_count}
          onCheckedChange={(checked) => onUpdate({ show_line_items_count: checked })}
        />
        <ToggleSetting
          id="shared_show_product_quantity"
          label="Vis antall"
          description="Vis produktmengde"
          checked={settings.shared_show_product_quantity}
          onCheckedChange={(checked) => onUpdate({ shared_show_product_quantity: checked })}
        />
      </div>

      <ToggleSetting
        id="show_basket_quantity"
        label="Vis antall pr kurv"
        description="Vis hvor mange enheter per kurv ved produktnavn"
        checked={settings.show_basket_quantity}
        onCheckedChange={(checked) => onUpdate({ show_basket_quantity: checked })}
      />

      <ToggleSetting
        id="shared_hide_completed_customers"
        label="Skjul ferdige kunder"
        description="Skjul kunder når all pakking er ferdig"
        checked={settings.shared_hide_completed_customers}
        onCheckedChange={(checked) => onUpdate({ shared_hide_completed_customers: checked })}
      />

      {settings.shared_hide_completed_customers && (
        <SliderControl
          label="Ferdige kunder opacity"
          value={settings.shared_completed_customer_opacity}
          onChange={(value) => onUpdate({ shared_completed_customer_opacity: value })}
          min={0}
          max={100}
          step={10}
          unit="%"
          description="0% = helt skjult, 100% = fullt synlig"
        />
      )}
    </div>
  );
};

export default SharedProductListSection;
