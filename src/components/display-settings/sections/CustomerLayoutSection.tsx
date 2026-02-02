import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import ToggleSetting from '../ToggleSetting';
import SliderControl from '../SliderControl';
import ColorPicker from '../ColorPicker';
import type { DisplaySettings } from '@/types/displaySettings';

interface CustomerLayoutSectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const CustomerLayoutSection = ({ settings, onUpdate }: CustomerLayoutSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Screen Layout */}
      <div className="space-y-4">
        <ToggleSetting
          id="customer_fullscreen_mode"
          label="Fullskjerm-modus"
          description="Optimalisert for fullskjerm på nettbrett eller TV"
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
          description="Begrenser bredden på innholdet"
        />
      </div>

      {/* Background */}
      <div className="border-t pt-4 space-y-4">
        <Label className="text-base font-medium">Bakgrunn</Label>
        
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

        {settings.background_type === 'solid' && (
          <ColorPicker
            label="Bakgrunnsfarge"
            value={settings.background_color}
            onChange={(color) => onUpdate({ background_color: color })}
          />
        )}

        {settings.background_type === 'gradient' && (
          <div className="grid gap-4 md:grid-cols-2">
            <ColorPicker
              label="Gradient start"
              value={settings.background_gradient_start}
              onChange={(color) => onUpdate({ background_gradient_start: color })}
            />
            <ColorPicker
              label="Gradient slutt"
              value={settings.background_gradient_end}
              onChange={(color) => onUpdate({ background_gradient_end: color })}
            />
          </div>
        )}

        {settings.background_type === 'image' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bg_image_url_customer">Bilde URL</Label>
              <Input
                id="bg_image_url_customer"
                value={settings.background_image_url || ''}
                onChange={(e) => onUpdate({ background_image_url: e.target.value })}
                placeholder="https://example.com/bakgrunn.jpg"
              />
            </div>
            <SliderControl
              label="Overlay mørkning"
              value={settings.background_overlay_opacity ?? 0}
              onChange={(value) => onUpdate({ background_overlay_opacity: value })}
              min={0}
              max={100}
              step={10}
              unit="%"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerLayoutSection;
