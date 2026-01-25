import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ToggleSetting from '../ToggleSetting';
import SliderControl from '../SliderControl';
import ColorPicker from '../ColorPicker';
import type { DisplaySettings } from '@/types/displaySettings';

interface SharedHeaderSectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const SharedHeaderSection = ({ settings, onUpdate }: SharedHeaderSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <ToggleSetting
          id="show_main_title"
          label="Vis hovedtittel"
          description="Vis hovedtittelen på displayet"
          checked={settings.show_main_title ?? true}
          onCheckedChange={(checked) => onUpdate({ show_main_title: checked })}
        />
        <ToggleSetting
          id="show_subtitle"
          label="Vis undertittel"
          description="Vis undertittelen på displayet"
          checked={settings.show_subtitle ?? true}
          onCheckedChange={(checked) => onUpdate({ show_subtitle: checked })}
        />
      </div>

      {(settings.show_main_title ?? true) && (
        <div className="space-y-2">
          <Label htmlFor="main_title">Hovedtittel</Label>
          <Input
            id="main_title"
            value={settings.main_title}
            onChange={(e) => onUpdate({ main_title: e.target.value })}
            placeholder="Felles Display"
          />
        </div>
      )}
      
      {(settings.show_subtitle ?? true) && (
        <div className="space-y-2">
          <Label htmlFor="subtitle">Undertittel</Label>
          <Input
            id="subtitle"
            value={settings.subtitle}
            onChange={(e) => onUpdate({ subtitle: e.target.value })}
            placeholder="Pakkestatus for kunder"
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <ToggleSetting
          id="show_date_indicator"
          label="Vis dato"
          description="Vis dagens dato i headeren"
          checked={settings.show_date_indicator}
          onCheckedChange={(checked) => onUpdate({ show_date_indicator: checked })}
        />
        <ToggleSetting
          id="shared_show_clock"
          label="Vis klokke"
          description="Vis sanntidsklokke i headeren"
          checked={settings.shared_show_clock}
          onCheckedChange={(checked) => onUpdate({ shared_show_clock: checked })}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ToggleSetting
          id="shared_show_logo"
          label="Vis logo"
          description="Vis bakeriets logo i headeren"
          checked={settings.shared_show_logo}
          onCheckedChange={(checked) => onUpdate({ shared_show_logo: checked })}
        />
        {settings.shared_show_logo && (
          <div className="space-y-2">
            <Label htmlFor="shared_logo_url">Logo URL</Label>
            <Input
              id="shared_logo_url"
              value={settings.shared_logo_url}
              onChange={(e) => onUpdate({ shared_logo_url: e.target.value })}
              placeholder="https://..."
            />
          </div>
        )}
      </div>

      {settings.shared_show_logo && (
        <SliderControl
          label="Logo størrelse"
          value={settings.shared_logo_size}
          onChange={(value) => onUpdate({ shared_logo_size: value })}
          min={24}
          max={96}
          step={4}
          unit="px"
        />
      )}

      <div className="space-y-2">
        <Label>Header-justering</Label>
        <Select
          value={settings.shared_header_alignment}
          onValueChange={(value: 'left' | 'center' | 'right') => onUpdate({ shared_header_alignment: value })}
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

      <div className="grid gap-4 md:grid-cols-2">
        <SliderControl
          label="Header tekststørrelse"
          value={settings.header_font_size}
          onChange={(value) => onUpdate({ header_font_size: value })}
          min={18}
          max={48}
          step={2}
          unit="px"
        />
        <ColorPicker
          label="Header tekstfarge"
          value={settings.header_text_color}
          onChange={(color) => onUpdate({ header_text_color: color })}
        />
      </div>
    </div>
  );
};

export default SharedHeaderSection;
