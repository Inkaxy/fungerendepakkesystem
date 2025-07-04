import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Type, Zap, Palette } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface TypographySettingsTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const fontOptions = [
  { value: 'Inter', label: 'Inter (Standard)' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'PT Sans', label: 'PT Sans' },
];

const TypographySettingsTab = ({ settings, onUpdate }: TypographySettingsTabProps) => {
  return (
    <div className="space-y-6">
      {/* Font Family */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Type className="h-5 w-5 mr-2" />
            Font-familie
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Velg skrifttype for alle tekster på displayene
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Skrifttype</Label>
            <Select 
              value={settings.font_family} 
              onValueChange={(value) => onUpdate({ font_family: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Velg skrifttype" />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Line Height */}
      <Card>
        <CardHeader>
          <CardTitle>Linjeavstand</CardTitle>
          <p className="text-sm text-muted-foreground">
            Juster avstand mellom tekstlinjer for bedre lesbarhet
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Linjehøyde</Label>
              <span className="text-sm font-medium">{settings.line_height}</span>
            </div>
            <Slider
              value={[settings.line_height]}
              onValueChange={(value) => onUpdate({ line_height: value[0] })}
              min={1}
              max={2.5}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Tett (1.0)</span>
              <span>Normal (1.5)</span>
              <span>Luftig (2.5)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Text Shadow */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Tekst-skygge
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Legg til skygge bak tekst for bedre kontrast og lesbarhet
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="text-shadow-enabled">Aktiver tekst-skygge</Label>
            <Switch
              id="text-shadow-enabled"
              checked={settings.text_shadow_enabled}
              onCheckedChange={(checked) => onUpdate({ text_shadow_enabled: checked })}
            />
          </div>

          {settings.text_shadow_enabled && (
            <div className="space-y-4 pl-4 border-l-2 border-muted">
              <div className="space-y-2">
                <Label htmlFor="text-shadow-color">Skygge-farge</Label>
                <div className="flex space-x-2">
                  <Input
                    id="text-shadow-color"
                    type="color"
                    value={settings.text_shadow_color}
                    onChange={(e) => onUpdate({ text_shadow_color: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={settings.text_shadow_color}
                    onChange={(e) => onUpdate({ text_shadow_color: e.target.value })}
                    placeholder="#00000020"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Uskarphet</Label>
                  <span className="text-sm font-medium">{settings.text_shadow_blur}px</span>
                </div>
                <Slider
                  value={[settings.text_shadow_blur]}
                  onValueChange={(value) => onUpdate({ text_shadow_blur: value[0] })}
                  min={0}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>X-offset</Label>
                    <span className="text-sm font-medium">{settings.text_shadow_offset_x}px</span>
                  </div>
                  <Slider
                    value={[settings.text_shadow_offset_x]}
                    onValueChange={(value) => onUpdate({ text_shadow_offset_x: value[0] })}
                    min={-10}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Y-offset</Label>
                    <span className="text-sm font-medium">{settings.text_shadow_offset_y}px</span>
                  </div>
                  <Slider
                    value={[settings.text_shadow_offset_y]}
                    onValueChange={(value) => onUpdate({ text_shadow_offset_y: value[0] })}
                    min={-10}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TypographySettingsTab;