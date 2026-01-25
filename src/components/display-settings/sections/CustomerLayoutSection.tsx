import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
        checked={settings.customer_fullscreen_mode ?? false}
        onCheckedChange={(checked) => onUpdate({ customer_fullscreen_mode: checked })}
      />

      <SliderControl
        label="Innholdspadding"
        value={settings.customer_content_padding ?? 24}
        onChange={(value) => onUpdate({ customer_content_padding: value })}
        min={0}
        max={48}
        step={4}
        unit="px"
        description="Avstand fra kanten av skjermen"
      />

      <SliderControl
        label="Maks innholdsbredde"
        value={settings.customer_max_content_width ?? 1200}
        onChange={(value) => onUpdate({ customer_max_content_width: value })}
        min={600}
        max={1920}
        step={100}
        unit="px"
        description="Maksimal bredde på innholdet"
      />

      <div className="space-y-2">
        <Label>Bakgrunnstype</Label>
        <Select
          value={settings.background_type ?? 'gradient'}
          onValueChange={(value: 'solid' | 'gradient' | 'image') => onUpdate({ background_type: value })}
        >
          <SelectTrigger className="bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-lg z-50">
            <SelectItem value="solid">Ensfarget</SelectItem>
            <SelectItem value="gradient">Gradient</SelectItem>
            <SelectItem value="image">Bilde</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ToggleSetting
        id="enable_animations"
        label="Aktiver animasjoner"
        description="Slå på/av alle animasjoner"
        checked={settings.enable_animations ?? true}
        onCheckedChange={(checked) => onUpdate({ enable_animations: checked })}
      />

      <ToggleSetting
        id="fade_transitions"
        label="Fade-overganger"
        description="Myk fade-effekt ved endringer"
        checked={settings.fade_transitions ?? true}
        onCheckedChange={(checked) => onUpdate({ fade_transitions: checked })}
      />
    </div>
  );
};

export default CustomerLayoutSection;
