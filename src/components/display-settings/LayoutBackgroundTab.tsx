
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import ColorPicker from './ColorPicker';
import SliderControl from './SliderControl';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface LayoutBackgroundTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const LayoutBackgroundTab = ({ settings, onUpdate }: LayoutBackgroundTabProps) => {
  return (
    <div className="space-y-6">
      {/* Background Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bakgrunn</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Bakgrunnstype</Label>
            <RadioGroup
              value={settings.background_type}
              onValueChange={(value) => onUpdate({ background_type: value as any })}
              className="flex flex-wrap gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="solid" id="solid" />
                <Label htmlFor="solid">Ensfarget</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gradient" id="gradient" />
                <Label htmlFor="gradient">Gradient</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="image" id="image" />
                <Label htmlFor="image">Bilde</Label>
              </div>
            </RadioGroup>
          </div>

          {settings.background_type === 'solid' && (
            <ColorPicker
              label="Bakgrunnsfarge"
              value={settings.background_color}
              onChange={(color) => onUpdate({ background_color: color })}
            />
          )}

          {settings.background_type === 'gradient' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <Label className="text-sm font-medium">Bakgrunnsbilde URL</Label>
              <Input
                value={settings.background_image_url || ''}
                onChange={(e) => onUpdate({ background_image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="mt-2"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Typography Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tekst og Typografi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SliderControl
              label="Overskrift størrelse"
              value={settings.header_font_size}
              onChange={(value) => onUpdate({ header_font_size: value })}
              min={16}
              max={64}
              unit="px"
            />
            <SliderControl
              label="Tekst størrelse"
              value={settings.body_font_size}
              onChange={(value) => onUpdate({ body_font_size: value })}
              min={12}
              max={32}
              unit="px"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPicker
              label="Overskrift farge"
              value={settings.header_text_color}
              onChange={(color) => onUpdate({ header_text_color: color })}
            />
            <ColorPicker
              label="Tekst farge"
              value={settings.text_color}
              onChange={(color) => onUpdate({ text_color: color })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Card Layout Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Kort og Layout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SliderControl
              label="Skygge intensitet"
              value={settings.card_shadow_intensity}
              onChange={(value) => onUpdate({ card_shadow_intensity: value })}
              min={0}
              max={10}
            />
            <SliderControl
              label="Hjørne radius"
              value={settings.border_radius}
              onChange={(value) => onUpdate({ border_radius: value })}
              min={0}
              max={24}
              unit="px"
            />
            <SliderControl
              label="Mellomrom"
              value={settings.spacing}
              onChange={(value) => onUpdate({ spacing: value })}
              min={4}
              max={32}
              unit="px"
            />
          </div>
        </CardContent>
      </Card>

      {/* Display Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Display Alternativer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg border border-border mb-4">
            <div className="flex items-start gap-2">
              <div className="text-primary mt-0.5">💡</div>
              <div>
                <p className="text-sm font-medium">Live oppdateringer aktivert</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Displayene oppdateres automatisk via websockets - ingen forsinkelse!
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-customer-info"
                checked={settings.show_customer_info}
                onCheckedChange={(checked) => onUpdate({ show_customer_info: checked })}
              />
              <Label htmlFor="show-customer-info">Vis kundeinformasjon</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="show-order-numbers"
                checked={settings.show_order_numbers}
                onCheckedChange={(checked) => onUpdate({ show_order_numbers: checked })}
              />
              <Label htmlFor="show-order-numbers">Vis ordrenummer</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LayoutBackgroundTab;
