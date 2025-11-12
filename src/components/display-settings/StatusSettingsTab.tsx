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
          <CardTitle>STATUS-indikator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-status"
              checked={settings.show_status_indicator}
              onCheckedChange={(checked) => onUpdate({ show_status_indicator: checked })}
            />
            <Label htmlFor="show-status">Vis STATUS-indikator</Label>
          </div>

          <SliderControl
            label="STATUS tekststørrelse"
            value={settings.status_indicator_font_size}
            min={16}
            max={64}
            step={2}
            unit="px"
            onChange={(value) => onUpdate({ status_indicator_font_size: value })}
          />

          <SliderControl
            label="STATUS padding"
            value={settings.status_indicator_padding}
            min={8}
            max={48}
            step={4}
            unit="px"
            onChange={(value) => onUpdate({ status_indicator_padding: value })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status farger og størrelse</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SliderControl
            label="Status badge tekststørrelse"
            value={settings.status_badge_font_size}
            onChange={(value) => onUpdate({ status_badge_font_size: value })}
            min={10}
            max={24}
            unit="px"
            description="Størrelsen på teksten i status badges (Ferdig, Pågår, Venter)"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <ColorPicker
                label="Pågående farge"
                value={settings.packing_status_ongoing_color}
                onChange={(color) => onUpdate({ packing_status_ongoing_color: color })}
              />
            </div>
            <div>
              <ColorPicker
                label="Ferdig farge"
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
            <ColorPicker
              label="Status tekst farge"
              value={settings.text_color}
              onChange={(color) => onUpdate({ text_color: color })}
            />
          </div>

          <div>
            <ColorPicker
              label="Status kort bakgrunn"
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
            <ColorPicker
              label="Produktnavn farge"
              value={settings.product_text_color}
              onChange={(color) => onUpdate({ product_text_color: color })}
            />
          </div>

          <div>
            <ColorPicker
              label="Antall farge"
              value={settings.product_accent_color}
              onChange={(color) => onUpdate({ product_accent_color: color })}
            />
          </div>

          <div>
            <ColorPicker
              label="Produktrad bakgrunn"
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
          <div className="p-4 bg-muted/50 rounded-lg border border-border">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusSettingsTab;
