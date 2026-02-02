import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ToggleSetting from '../ToggleSetting';
import SliderControl from '../SliderControl';
import type { DisplaySettings } from '@/types/displaySettings';

interface SharedCustomerCardsSectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const SharedCustomerCardsSection = ({ settings, onUpdate }: SharedCustomerCardsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <SliderControl
          label="Antall kolonner"
          value={settings.customer_cards_columns}
          onChange={(value) => onUpdate({ customer_cards_columns: value })}
          min={1}
          max={6}
          step={1}
        />
        <div className="space-y-2">
          <Label>Kort-høyde</Label>
          <Select
            value={settings.customer_card_height}
            onValueChange={(value: 'compact' | 'normal' | 'large') => onUpdate({ customer_card_height: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Kompakt</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="large">Stor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Kort-stil</Label>
          <Select
            value={settings.customer_card_style}
            onValueChange={(value: 'card' | 'minimal' | 'bordered') => onUpdate({ customer_card_style: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">Kort med skygge</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="bordered">Kun ramme</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <SliderControl
          label="Avstand mellom kort"
          value={settings.customer_cards_gap}
          onChange={(value) => onUpdate({ customer_cards_gap: value })}
          min={8}
          max={48}
          step={4}
          unit="px"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SliderControl
          label="Kundenavn tekststørrelse"
          value={settings.customer_name_font_size}
          onChange={(value) => onUpdate({ customer_name_font_size: value })}
          min={12}
          max={36}
          step={1}
          unit="px"
        />
        <SliderControl
          label="Fremdriftslinje høyde"
          value={settings.progress_height}
          onChange={(value) => onUpdate({ progress_height: value })}
          min={4}
          max={24}
          step={2}
          unit="px"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ToggleSetting
          id="show_customer_numbers"
          label="Vis kundenummer"
          description="Vis kundenummer ved navn"
          checked={settings.show_customer_numbers}
          onCheckedChange={(checked) => onUpdate({ show_customer_numbers: checked })}
        />
        <ToggleSetting
          id="show_customer_progress_bar"
          label="Vis fremdriftslinje"
          description="Vis fremdrift per kunde"
          checked={settings.show_customer_progress_bar}
          onCheckedChange={(checked) => onUpdate({ show_customer_progress_bar: checked })}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ToggleSetting
          id="show_truck_icon"
          label="Vis varebil-ikon"
          description="Vis varebil på fremdriftslinje"
          checked={settings.show_truck_icon}
          onCheckedChange={(checked) => onUpdate({ show_truck_icon: checked })}
        />
        {settings.show_truck_icon && (
          <SliderControl
            label="Varebil-størrelse"
            value={settings.truck_icon_size}
            onChange={(value) => onUpdate({ truck_icon_size: value })}
            min={16}
            max={100}
            step={4}
            unit="px"
          />
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ToggleSetting
          id="shared_show_completion_icon"
          label="Vis ferdig-ikon"
          description="Vis grønt hake-ikon når kunde er ferdig pakket"
          checked={settings.shared_show_completion_icon ?? true}
          onCheckedChange={(checked) => onUpdate({ shared_show_completion_icon: checked })}
        />
        <ToggleSetting
          id="show_status_badges"
          label="Vis status-badges"
          description="Vis tekstlig status på hvert kort"
          checked={settings.show_status_badges ?? true}
          onCheckedChange={(checked) => onUpdate({ show_status_badges: checked })}
        />
      </div>

      <div className="border-t pt-4 space-y-4">
        <Label className="text-base font-medium">Produktvisning i kort</Label>

        <SliderControl
          label="Maks produkter per kort"
          value={settings.max_products_per_card}
          onChange={(value) => onUpdate({ max_products_per_card: value })}
          min={1}
          max={10}
          step={1}
          description="Begrens antall produkter som vises per kundekort"
        />

        <SliderControl
          label="Produkt tekststørrelse"
          value={settings.shared_product_font_size}
          onChange={(value) => onUpdate({ shared_product_font_size: value })}
          min={10}
          max={24}
          step={1}
          unit="px"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <ToggleSetting
            id="shared_show_product_quantity"
            label="Vis antall"
            description="Vis produktantall i produktlisten"
            checked={settings.shared_show_product_quantity}
            onCheckedChange={(checked) => onUpdate({ shared_show_product_quantity: checked })}
          />
          <ToggleSetting
            id="show_line_items_count"
            label="Vis varelinjer"
            description="Vis telling som 2/5 på produkter"
            checked={settings.show_line_items_count}
            onCheckedChange={(checked) => onUpdate({ show_line_items_count: checked })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Sortering</Label>
        <Select
          value={settings.customer_sort_order}
          onValueChange={(value: 'alphabetical' | 'priority' | 'progress') => onUpdate({ customer_sort_order: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alphabetical">Alfabetisk</SelectItem>
            <SelectItem value="priority">Prioritet (pågår først)</SelectItem>
            <SelectItem value="progress">Fremdrift</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SharedCustomerCardsSection;
