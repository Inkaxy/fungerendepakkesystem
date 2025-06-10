
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import ColorPicker from './ColorPicker';
import SliderControl from './SliderControl';
import { Switch } from '@/components/ui/switch';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface StatusSettingsTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const StatusSettingsTab = ({ settings, onUpdate }: StatusSettingsTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Status farger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Pågående farge</Label>
              <ColorPicker
                value={settings.packing_status_ongoing_color}
                onChange={(color) => onUpdate({ packing_status_ongoing_color: color })}
              />
            </div>
            <div>
              <Label>Ferdig farge</Label>
              <ColorPicker
                value={settings.packing_status_completed_color}
                onChange={(color) => onUpdate({ packing_status_completed_color: color })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status seksjon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SliderControl
            label="Status tekst størrelse (multiplicator)"
            value={settings.body_font_size}
            min={12}
            max={32}
            step={1}
            onChange={(value) => onUpdate({ body_font_size: value })}
          />
          
          <div>
            <Label>Status tekst farge</Label>
            <ColorPicker
              value={settings.text_color}
              onChange={(color) => onUpdate({ text_color: color })}
            />
          </div>

          <div>
            <Label>Status kort bakgrunn</Label>
            <ColorPicker
              value={settings.card_background_color}
              onChange={(color) => onUpdate({ card_background_color: color })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Produktliste innstillinger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Produktnavn farge</Label>
            <ColorPicker
              value={settings.product_text_color}
              onChange={(color) => onUpdate({ product_text_color: color })}
            />
          </div>

          <div>
            <Label>Antall farge</Label>
            <ColorPicker
              value={settings.product_accent_color}
              onChange={(color) => onUpdate({ product_accent_color: color })}
            />
          </div>

          <div>
            <Label>Produktrad bakgrunn</Label>
            <ColorPicker
              value={settings.product_card_color}
              onChange={(color) => onUpdate({ product_card_color: color })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display alternativer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SliderControl
            label="Automatisk oppdatering (sekunder)"
            value={settings.auto_refresh_interval}
            min={10}
            max={120}
            step={5}
            onChange={(value) => onUpdate({ auto_refresh_interval: value })}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusSettingsTab;
