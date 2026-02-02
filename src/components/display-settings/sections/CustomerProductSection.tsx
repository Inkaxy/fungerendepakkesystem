import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ToggleSetting from '../ToggleSetting';
import SliderControl from '../SliderControl';
import type { DisplaySettings } from '@/types/displaySettings';

interface CustomerProductSectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const CustomerProductSection = ({ settings, onUpdate }: CustomerProductSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <ToggleSetting
          id="show_status_badges"
          label="Vis status-badges"
          description="Vis pakke-status på produkter"
          checked={settings.show_status_badges}
          onCheckedChange={(checked) => onUpdate({ show_status_badges: checked })}
        />
        <ToggleSetting
          id="show_product_unit"
          label="Vis enhet"
          description="Vis produktenhet (stk, kg, etc.)"
          checked={settings.show_product_unit}
          onCheckedChange={(checked) => onUpdate({ show_product_unit: checked })}
        />
      </div>

      <ToggleSetting
        id="show_basket_quantity"
        label="Vis antall pr kurv"
        description="Vis hvor mange enheter per kurv ved produktnavn"
        checked={settings.show_basket_quantity}
        onCheckedChange={(checked) => onUpdate({ show_basket_quantity: checked })}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <ToggleSetting
          id="show_line_items_count"
          label="Vis varelinjer-telling"
          description="Vis telling som f.eks. 0/1 på produktkort"
          checked={settings.show_line_items_count}
          onCheckedChange={(checked) => onUpdate({ show_line_items_count: checked })}
        />
        {settings.show_line_items_count && (
          <SliderControl
            label="Telling-størrelse"
            value={settings.line_items_count_font_size}
            onChange={(value) => onUpdate({ line_items_count_font_size: value })}
            min={12}
            max={32}
            step={1}
            unit="px"
          />
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ToggleSetting
          id="strikethrough_completed_products"
          label="Stryk gjennom ferdige"
          description="Vis gjennomstreking på pakkede produkter"
          checked={settings.strikethrough_completed_products}
          onCheckedChange={(checked) => onUpdate({ strikethrough_completed_products: checked })}
        />
        <ToggleSetting
          id="hide_completed_products"
          label="Skjul ferdige produkter"
          description="Skjul produkter som er ferdig pakket"
          checked={settings.hide_completed_products}
          onCheckedChange={(checked) => onUpdate({ hide_completed_products: checked })}
        />
      </div>

      <div className="space-y-2">
        <Label>Produkt-layout</Label>
        <Select
          value={settings.product_card_layout}
          onValueChange={(value: 'horizontal' | 'vertical' | 'grid') => onUpdate({ product_card_layout: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="horizontal">Horisontal (liste)</SelectItem>
            <SelectItem value="vertical">Vertikal (stabel)</SelectItem>
            <SelectItem value="grid">Rutenett</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {settings.product_card_layout === 'grid' && (
        <SliderControl
          label="Antall kolonner"
          value={settings.product_columns}
          onChange={(value) => onUpdate({ product_columns: value })}
          min={1}
          max={4}
          step={1}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <ToggleSetting
          id="product_show_category"
          label="Vis kategori"
          description="Vis produktkategori"
          checked={settings.product_show_category}
          onCheckedChange={(checked) => onUpdate({ product_show_category: checked })}
        />
        <ToggleSetting
          id="product_group_by_status"
          label="Grupper etter status"
          description="Sorter produkter etter pakkestatus"
          checked={settings.product_group_by_status}
          onCheckedChange={(checked) => onUpdate({ product_group_by_status: checked })}
        />
      </div>

      <SliderControl
        label="Produktkort skalering"
        value={settings.product_card_size}
        onChange={(value) => onUpdate({ product_card_size: value })}
        min={50}
        max={150}
        step={10}
        unit="%"
        description="Skalerer hele produktkortet proporsjonalt"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <SliderControl
          label="Produktnavn størrelse"
          value={settings.product_name_font_size}
          onChange={(value) => onUpdate({ product_name_font_size: value })}
          min={12}
          max={36}
          step={1}
          unit="px"
        />
        <SliderControl
          label="Antall størrelse"
          value={settings.product_quantity_font_size}
          onChange={(value) => onUpdate({ product_quantity_font_size: value })}
          min={24}
          max={72}
          step={4}
          unit="px"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SliderControl
          label="Produktavstand"
          value={settings.product_spacing}
          onChange={(value) => onUpdate({ product_spacing: value })}
          min={4}
          max={32}
          step={2}
          unit="px"
        />
        <SliderControl
          label="Kort-padding"
          value={settings.product_card_padding}
          onChange={(value) => onUpdate({ product_card_padding: value })}
          min={8}
          max={48}
          step={4}
          unit="px"
        />
      </div>
    </div>
  );
};

export default CustomerProductSection;
