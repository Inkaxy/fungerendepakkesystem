
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Monitor, BarChart3, Grid3X3, List, Type } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import ColorPicker from './ColorPicker';
import SliderControl from './SliderControl';

interface SharedDisplaySettingsTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const SharedDisplaySettingsTab = ({ settings, onUpdate }: SharedDisplaySettingsTabProps) => {
  return (
    <div className="space-y-6">
      {/* Header Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Type className="h-5 w-5 mr-2" />
            Header og Titler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="main-title">Hovedtittel</Label>
            <Input
              id="main-title"
              value={settings.main_title}
              onChange={(e) => onUpdate({ main_title: e.target.value })}
              placeholder="Felles Display"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="subtitle">Undertittel</Label>
            <Input
              id="subtitle"
              value={settings.subtitle}
              onChange={(e) => onUpdate({ subtitle: e.target.value })}
              placeholder="Pakkestatus for kunder"
              className="mt-1"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Vis dato-indikator</Label>
              <p className="text-sm text-muted-foreground">
                Viser dagens dato/aktiv pakkedato i headeren
              </p>
            </div>
            <Switch
              checked={settings.show_date_indicator}
              onCheckedChange={(checked) => onUpdate({ show_date_indicator: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Statistikk-kort
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Oversiktskortene som viser kunder, produkttyper og totalt antall
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">Vis statistikk-kort</Label>
            <Switch
              checked={settings.show_stats_cards}
              onCheckedChange={(checked) => onUpdate({ show_stats_cards: checked })}
            />
          </div>

          {settings.show_stats_cards && (
            <>
              <SliderControl
                label="Antall kolonner"
                value={settings.stats_columns}
                onChange={(value) => onUpdate({ stats_columns: value })}
                min={1}
                max={4}
                step={1}
              />

              <div>
                <Label>Kort høyde</Label>
                <Select
                  value={settings.stats_card_height}
                  onValueChange={(value: 'compact' | 'normal' | 'large') => 
                    onUpdate({ stats_card_height: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Kompakt</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="large">Utvidet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ColorPicker
                label="Ikon farge"
                value={settings.stats_icon_color}
                onChange={(color) => onUpdate({ stats_icon_color: color })}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Customer Cards Layout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Grid3X3 className="h-5 w-5 mr-2" />
            Kunde-kort Layout
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Hvordan kundens pakkestatus-kort vises i rutenettet
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <SliderControl
            label="Antall kolonner"
            value={settings.customer_cards_columns}
            onChange={(value) => onUpdate({ customer_cards_columns: value })}
            min={1}
            max={4}
            step={1}
          />

          <div>
            <Label>Kort høyde</Label>
            <Select
              value={settings.customer_card_height}
              onValueChange={(value: 'compact' | 'normal' | 'large') => 
                onUpdate({ customer_card_height: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Kompakt</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="large">Utvidet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <SliderControl
            label="Avstand mellom kort"
            value={settings.customer_cards_gap}
            onChange={(value) => onUpdate({ customer_cards_gap: value })}
            min={8}
            max={48}
            step={4}
            unit="px"
          />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Vis kundenummer</Label>
              <p className="text-sm text-muted-foreground">
                Vis kundenummer som badge på hvert kort
              </p>
            </div>
            <Switch
              checked={settings.show_customer_numbers}
              onCheckedChange={(checked) => onUpdate({ show_customer_numbers: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Product List Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <List className="h-5 w-5 mr-2" />
            Produktliste per Kunde
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Innstillinger for produktlisten på hvert kundekort
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <SliderControl
            label="Maks produkter per kort"
            value={settings.max_products_per_card}
            onChange={(value) => onUpdate({ max_products_per_card: value })}
            min={3}
            max={20}
            step={1}
            description="Hvor mange produkter som vises før '...og X til'"
          />

          <div>
            <Label>Produktliste stil</Label>
            <Select
              value={settings.product_list_style}
              onValueChange={(value: 'compact' | 'normal') => 
                onUpdate({ product_list_style: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Kompakt</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Kunde-sortering</Label>
            <Select
              value={settings.customer_sort_order}
              onValueChange={(value: 'alphabetical' | 'status' | 'progress') => 
                onUpdate({ customer_sort_order: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alphabetical">Alfabetisk</SelectItem>
                <SelectItem value="status">Etter status</SelectItem>
                <SelectItem value="progress">Etter fremgang</SelectItem>
              </SelectContent>
            </Select>
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
              Felles Display oppdateres automatisk via websockets når pakkestatus endres.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedDisplaySettingsTab;
