
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { User, Layout, Eye, Palette } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import SliderControl from './SliderControl';
import ColorPicker from './ColorPicker';
import StatusIndicatorCard from './status-progress/StatusIndicatorCard';
import ProgressBarCard from './status-progress/ProgressBarCard';
import TruckIconCard from './status-progress/TruckIconCard';

interface CustomerDisplayTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const CustomerDisplayTab = ({ settings, onUpdate }: CustomerDisplayTabProps) => {
  return (
    <div className="space-y-6">
      {/* Header Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Kunde-header
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Innstillinger for overskriften på kundens dedikerte display
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Vis alltid kundenavn</Label>
              <p className="text-sm text-muted-foreground">
                Kundenavnet vises alltid tydelig øverst på skjermen
              </p>
            </div>
            <Switch
              checked={settings.always_show_customer_name}
              onCheckedChange={(checked) => onUpdate({ always_show_customer_name: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Vis dato på display</Label>
              <p className="text-sm text-muted-foreground">
                Viser dagens dato og ukedag på kundens display
              </p>
            </div>
            <Switch
              checked={settings.customer_display_show_date ?? true}
              onCheckedChange={(checked) => onUpdate({ customer_display_show_date: checked })}
            />
          </div>

          <SliderControl
            label="Header tekststørrelse"
            value={settings.customer_display_header_size ?? 32}
            onChange={(value) => onUpdate({ customer_display_header_size: value })}
            min={24}
            max={64}
            unit="px"
          />
        </CardContent>
      </Card>

      {/* Layout Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Layout className="h-5 w-5 mr-2" />
            Status/Progress Layout
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Kontroller hvordan status og fremdrift vises
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Kompakt layout</Label>
              <p className="text-sm text-muted-foreground">
                Kombinerer status og progress i én kompakt rad
              </p>
            </div>
            <Switch
              checked={settings.compact_status_progress ?? true}
              onCheckedChange={(checked) => onUpdate({ compact_status_progress: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Status Indicator */}
      <StatusIndicatorCard settings={settings} onUpdate={onUpdate} />

      {/* Progress Bar */}
      <ProgressBarCard settings={settings} onUpdate={onUpdate} />

      {/* Truck Icon */}
      <TruckIconCard settings={settings} onUpdate={onUpdate} />

      {/* Product Display Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Produktvisning
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Kontroller hva som vises på produktkortene
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Vis status badges</Label>
              <p className="text-sm text-muted-foreground">
                Vis "Ferdig", "Pågår", "Venter" badges på produktene
              </p>
            </div>
            <Switch
              checked={settings.show_status_badges ?? true}
              onCheckedChange={(checked) => onUpdate({ show_status_badges: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Strek over ferdige produkter</Label>
              <p className="text-sm text-muted-foreground">
                Viser gjennomstreking på produkter som er ferdig pakket
              </p>
            </div>
            <Switch
              checked={settings.strikethrough_completed_products ?? true}
              onCheckedChange={(checked) => onUpdate({ strikethrough_completed_products: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Skjul ferdige produkter</Label>
              <p className="text-sm text-muted-foreground">
                Skjuler produkter som er 100% pakket fra listen
              </p>
            </div>
            <Switch
              checked={settings.hide_completed_products ?? false}
              onCheckedChange={(checked) => onUpdate({ hide_completed_products: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Vis varelinjer-telling</Label>
              <p className="text-sm text-muted-foreground">
                Vis "3/5 varelinjer" på hvert produkt
              </p>
            </div>
            <Switch
              checked={settings.show_line_items_count ?? true}
              onCheckedChange={(checked) => onUpdate({ show_line_items_count: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Vis produktenhet</Label>
              <p className="text-sm text-muted-foreground">
                Vis enheter som "stk", "kg" ved antall
              </p>
            </div>
            <Switch
              checked={settings.show_product_unit ?? true}
              onCheckedChange={(checked) => onUpdate({ show_product_unit: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Tilgjengelighet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Høykontrast-modus</Label>
              <p className="text-sm text-muted-foreground">
                Øker kontrasten for bedre synlighet
              </p>
            </div>
            <Switch
              checked={settings.high_contrast_mode ?? false}
              onCheckedChange={(checked) => onUpdate({ high_contrast_mode: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Info Box */}
      <div className="p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-start gap-2">
          <div className="text-primary mt-0.5">💡</div>
          <div>
            <p className="text-sm font-medium">Live oppdateringer aktivert</p>
            <p className="text-xs text-muted-foreground mt-1">
              Kunde-displayene oppdateres automatisk via websockets - ingen forsinkelse!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDisplayTab;
