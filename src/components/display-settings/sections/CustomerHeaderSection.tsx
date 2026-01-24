import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ToggleSetting from '../ToggleSetting';
import SliderControl from '../SliderControl';
import type { DisplaySettings } from '@/types/displaySettings';

interface CustomerHeaderSectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const CustomerHeaderSection = ({ settings, onUpdate }: CustomerHeaderSectionProps) => {
  return (
    <div className="space-y-4">
      <ToggleSetting
        id="always_show_customer_name"
        label="Vis kundenavn alltid"
        description="Vis kundens navn øverst på skjermen"
        checked={settings.always_show_customer_name}
        onCheckedChange={(checked) => onUpdate({ always_show_customer_name: checked })}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <ToggleSetting
          id="customer_display_show_date"
          label="Vis dato"
          description="Vis dagens dato i headeren"
          checked={settings.customer_display_show_date}
          onCheckedChange={(checked) => onUpdate({ customer_display_show_date: checked })}
        />
        <ToggleSetting
          id="customer_show_bakery_name"
          label="Vis bakerinavn"
          description="Vis bakeriets navn i headeren"
          checked={settings.customer_show_bakery_name}
          onCheckedChange={(checked) => onUpdate({ customer_show_bakery_name: checked })}
        />
      </div>

      <ToggleSetting
        id="customer_show_delivery_info"
        label="Vis leveringsinfo"
        description="Vis leveringsdato og tidspunkt"
        checked={settings.customer_show_delivery_info}
        onCheckedChange={(checked) => onUpdate({ customer_show_delivery_info: checked })}
      />

      <SliderControl
        label="Header tekststørrelse"
        value={settings.customer_display_header_size}
        onChange={(value) => onUpdate({ customer_display_header_size: value })}
        min={20}
        max={48}
        step={2}
        unit="px"
      />

      <div className="space-y-2">
        <Label>Header-justering</Label>
        <Select
          value={settings.customer_header_alignment}
          onValueChange={(value: 'left' | 'center' | 'right') => onUpdate({ customer_header_alignment: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Venstre</SelectItem>
            <SelectItem value="center">Midtstilt</SelectItem>
            <SelectItem value="right">Høyre</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CustomerHeaderSection;
