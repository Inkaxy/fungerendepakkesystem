import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ToggleSetting from '../ToggleSetting';
import SliderControl from '../SliderControl';
import ColorPicker from '../ColorPicker';
import type { DisplaySettings } from '@/types/displaySettings';

interface SharedAppearanceSectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const SharedAppearanceSection = ({ settings, onUpdate }: SharedAppearanceSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Background Type */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Bakgrunnstype</Label>
        <RadioGroup
          value={settings.background_type}
          onValueChange={(value: 'solid' | 'gradient' | 'image') => onUpdate({ background_type: value })}
          className="grid grid-cols-3 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="solid" id="bg-solid" />
            <Label htmlFor="bg-solid" className="cursor-pointer">Ensfarget</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="gradient" id="bg-gradient" />
            <Label htmlFor="bg-gradient" className="cursor-pointer">Gradient</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="image" id="bg-image" />
            <Label htmlFor="bg-image" className="cursor-pointer">Bilde</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Conditional Background Options */}
      {settings.background_type === 'solid' && (
        <ColorPicker
          label="Bakgrunnsfarge"
          value={settings.background_color}
          onChange={(color) => onUpdate({ background_color: color })}
        />
      )}

      {settings.background_type === 'gradient' && (
        <div className="space-y-4">
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
          <div className="space-y-2">
            <Label>Gradient retning</Label>
            <Select
              value={settings.background_gradient_direction}
              onValueChange={(value) => onUpdate({ background_gradient_direction: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="to-bottom">Nedover</SelectItem>
                <SelectItem value="to-top">Oppover</SelectItem>
                <SelectItem value="to-right">Høyre</SelectItem>
                <SelectItem value="to-left">Venstre</SelectItem>
                <SelectItem value="to-bottom-right">Diagonalt ↘</SelectItem>
                <SelectItem value="to-bottom-left">Diagonalt ↙</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {settings.background_type === 'image' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bg_image_url">Bilde URL</Label>
            <Input
              id="bg_image_url"
              value={settings.background_image_url || ''}
              onChange={(e) => onUpdate({ background_image_url: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <SliderControl
            label="Overlay opacity"
            value={settings.background_overlay_opacity}
            onChange={(value) => onUpdate({ background_overlay_opacity: value })}
            min={0}
            max={100}
            step={10}
            unit="%"
            description="Mørk overlay over bakgrunnsbildet"
          />
        </div>
      )}

      {/* Card Styling */}
      <div className="border-t pt-4 space-y-4">
        <Label className="text-base font-medium">Kort-styling</Label>
        
        <div className="grid gap-4 md:grid-cols-2">
          <ColorPicker
            label="Kort bakgrunn"
            value={settings.card_background_color}
            onChange={(color) => onUpdate({ card_background_color: color })}
          />
          <ColorPicker
            label="Kort ramme"
            value={settings.card_border_color}
            onChange={(color) => onUpdate({ card_border_color: color })}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <SliderControl
            label="Skygge-intensitet"
            value={settings.card_shadow_intensity}
            onChange={(value) => onUpdate({ card_shadow_intensity: value })}
            min={0}
            max={10}
            step={1}
          />
          <SliderControl
            label="Hjørneradius"
            value={settings.border_radius}
            onChange={(value) => onUpdate({ border_radius: value })}
            min={0}
            max={24}
            step={2}
            unit="px"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <SliderControl
            label="Rammetykkelse"
            value={settings.card_border_width}
            onChange={(value) => onUpdate({ card_border_width: value })}
            min={0}
            max={4}
            step={1}
            unit="px"
          />
          <SliderControl
            label="Avstand (spacing)"
            value={settings.spacing}
            onChange={(value) => onUpdate({ spacing: value })}
            min={8}
            max={32}
            step={4}
            unit="px"
          />
        </div>

        <ToggleSetting
          id="card_hover_effect"
          label="Hover-effekt"
          description="Legg til skalering ved hover på kort"
          checked={settings.card_hover_effect}
          onCheckedChange={(checked) => onUpdate({ card_hover_effect: checked })}
        />
      </div>
    </div>
  );
};

export default SharedAppearanceSection;
