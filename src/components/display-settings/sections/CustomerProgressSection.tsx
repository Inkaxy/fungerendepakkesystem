import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ToggleSetting from '../ToggleSetting';
import SliderControl from '../SliderControl';
import ColorPicker from '../ColorPicker';
import type { DisplaySettings } from '@/types/displaySettings';

interface CustomerProgressSectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const CustomerProgressSection = ({ settings, onUpdate }: CustomerProgressSectionProps) => {
  return (
    <div className="space-y-4">
      <ToggleSetting
        id="compact_status_progress"
        label="Kompakt layout"
        description="Vis status og fremdrift på én linje"
        checked={settings.compact_status_progress}
        onCheckedChange={(checked) => onUpdate({ compact_status_progress: checked })}
      />

      <ToggleSetting
        id="show_status_indicator"
        label="Vis status-indikator"
        description="Stor status-tekst (PÅGÅR, FERDIG, etc.)"
        checked={settings.show_status_indicator}
        onCheckedChange={(checked) => onUpdate({ show_status_indicator: checked })}
      />

      {settings.show_status_indicator && (
        <div className="grid gap-4 md:grid-cols-2">
          <SliderControl
            label="Status tekststørrelse"
            value={settings.status_indicator_font_size}
            onChange={(value) => onUpdate({ status_indicator_font_size: value })}
            min={16}
            max={48}
            step={2}
            unit="px"
          />
          <SliderControl
            label="Status padding"
            value={settings.status_indicator_padding}
            onChange={(value) => onUpdate({ status_indicator_padding: value })}
            min={8}
            max={32}
            step={4}
            unit="px"
          />
        </div>
      )}

      <ToggleSetting
        id="show_progress_bar"
        label="Vis fremdriftslinje"
        description="Visuell indikator for pakkefremdrift"
        checked={settings.show_progress_bar}
        onCheckedChange={(checked) => onUpdate({ show_progress_bar: checked })}
      />

      {settings.show_progress_bar && (
        <>
          <div className="space-y-2">
            <Label>Fremdriftsvisning</Label>
            <Select
              value={settings.progress_bar_style}
              onValueChange={(value: 'bar' | 'circular' | 'steps') => onUpdate({ progress_bar_style: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Horisontal linje</SelectItem>
                <SelectItem value="circular">Sirkel</SelectItem>
                <SelectItem value="steps">Steg-indikator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <SliderControl
            label="Fremdriftshøyde"
            value={settings.progress_height}
            onChange={(value) => onUpdate({ progress_height: value })}
            min={4}
            max={24}
            step={2}
            unit="px"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <ToggleSetting
              id="show_progress_percentage"
              label="Vis prosent"
              description="Vis fremdrift som prosent"
              checked={settings.show_progress_percentage}
              onCheckedChange={(checked) => onUpdate({ show_progress_percentage: checked })}
            />
            <ToggleSetting
              id="progress_show_fraction"
              label="Vis brøk"
              description="Vis som 3/5 i stedet for 60%"
              checked={settings.progress_show_fraction}
              onCheckedChange={(checked) => onUpdate({ progress_show_fraction: checked })}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ColorPicker
              label="Fremdriftsfarge"
              value={settings.progress_bar_color}
              onChange={(color) => onUpdate({ progress_bar_color: color })}
            />
            <ColorPicker
              label="Bakgrunnsfarge"
              value={settings.progress_background_color}
              onChange={(color) => onUpdate({ progress_background_color: color })}
            />
          </div>

          <ToggleSetting
            id="progress_animation"
            label="Animer fremdrift"
            description="Myk animasjon ved endring"
            checked={settings.progress_animation}
            onCheckedChange={(checked) => onUpdate({ progress_animation: checked })}
          />
        </>
      )}

      <ToggleSetting
        id="show_truck_icon"
        label="Vis lastebil-ikon"
        description="Animert lastebil på fremdriftslinjen"
        checked={settings.show_truck_icon}
        onCheckedChange={(checked) => onUpdate({ show_truck_icon: checked })}
      />

      {settings.show_truck_icon && (
        <>
          <SliderControl
            label="Ikon-størrelse"
            value={settings.truck_icon_size}
            onChange={(value) => onUpdate({ truck_icon_size: value })}
            min={16}
            max={48}
            step={4}
            unit="px"
          />
          <div className="space-y-2">
            <Label>Animasjons-stil</Label>
            <Select
              value={settings.truck_animation_style}
              onValueChange={(value: 'bounce' | 'slide' | 'pulse' | 'none') => onUpdate({ truck_animation_style: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bounce">Sprette</SelectItem>
                <SelectItem value="slide">Gli</SelectItem>
                <SelectItem value="pulse">Pulsere</SelectItem>
                <SelectItem value="none">Ingen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerProgressSection;
