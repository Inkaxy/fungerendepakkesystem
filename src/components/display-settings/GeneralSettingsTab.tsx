
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import SliderControl from './SliderControl';

interface GeneralSettingsTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const GeneralSettingsTab = ({ settings, onUpdate }: GeneralSettingsTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generelle Visningsinnstillinger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Vis alltid kundenavn øverst</Label>
              <p className="text-sm text-muted-foreground">
                Sørger for at kundenavnet alltid vises tydelig øverst på skjermen
              </p>
            </div>
            <Switch
              checked={settings.always_show_customer_name}
              onCheckedChange={(checked) => onUpdate({ always_show_customer_name: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Vis kundeinformasjon</Label>
              <p className="text-sm text-muted-foreground">
                Viser telefon og e-post for kunder
              </p>
            </div>
            <Switch
              checked={settings.show_customer_info || false}
              onCheckedChange={(checked) => onUpdate({ show_customer_info: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Vis ordrenumre</Label>
              <p className="text-sm text-muted-foreground">
                Viser ordrenumre i ordrelisten
              </p>
            </div>
            <Switch
              checked={settings.show_order_numbers || false}
              onCheckedChange={(checked) => onUpdate({ show_order_numbers: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Vis leveringsdatoer</Label>
              <p className="text-sm text-muted-foreground">
                Viser leveringsdatoer for ordrer
              </p>
            </div>
            <Switch
              checked={settings.show_delivery_dates || false}
              onCheckedChange={(checked) => onUpdate({ show_delivery_dates: checked })}
            />
          </div>

          <SliderControl
            label="Automatisk oppdateringsintervall"
            value={settings.auto_refresh_interval}
            onChange={(value) => onUpdate({ auto_refresh_interval: value })}
            min={10}
            max={300}
            step={5}
            unit="sekunder"
            description="Hvor ofte skjermen oppdateres automatisk"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettingsTab;
