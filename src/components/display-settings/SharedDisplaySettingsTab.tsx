
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Monitor, BarChart3, Grid3X3, Type } from 'lucide-react';
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
            Hovedtitler og Tekst
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="main-title">Hovedtittel</Label>
              <Input
                id="main-title"
                value={settings.main_title}
                onChange={(e) => onUpdate({ main_title: e.target.value })}
                placeholder="Felles Display"
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Undertittel</Label>
              <Input
                id="subtitle"
                value={settings.subtitle}
                onChange={(e) => onUpdate({ subtitle: e.target.value })}
                placeholder="Pakkestatus for kunder"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={settings.show_date_indicator}
              onCheckedChange={(checked) => onUpdate({ show_date_indicator: checked })}
            />
            <Label>Vis datoindikator</Label>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Statistikk-kort
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={settings.show_stats_cards}
              onCheckedChange={(checked) => onUpdate({ show_stats_cards: checked })}
            />
            <Label>Vis statistikk-kort</Label>
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
                <Label>Statistikk-kort høyde</Label>
                <Select
                  value={settings.stats_card_height}
                  onValueChange={(value: 'compact' | 'normal' | 'extended') => 
                    onUpdate({ stats_card_height: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Kompakt</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="extended">Utvidet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ColorPicker
                label="Statistikk ikon farge"
                value={settings.stats_icon_color}
                onChange={(color) => onUpdate({ stats_icon_color: color })}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Customer Cards Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Grid3X3 className="h-5 w-5 mr-2" />
            Kunde-kort Layout
          </CardTitle>
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
            <Label>Kunde-kort høyde</Label>
            <Select
              value={settings.customer_card_height}
              onValueChange={(value: 'compact' | 'normal' | 'extended') => 
                onUpdate({ customer_card_height: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Kompakt</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="extended">Utvidet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <SliderControl
            label="Avstand mellom kort (px)"
            value={settings.customer_cards_gap}
            onChange={(value) => onUpdate({ customer_cards_gap: value })}
            min={8}
            max={48}
            step={4}
          />

          <div className="flex items-center space-x-2">
            <Switch
              checked={settings.show_customer_numbers}
              onCheckedChange={(checked) => onUpdate({ show_customer_numbers: checked })}
            />
            <Label>Vis kundenummer badges</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={settings.show_status_badges}
              onCheckedChange={(checked) => onUpdate({ show_status_badges: checked })}
            />
            <Label>Vis status badges</Label>
          </div>
        </CardContent>
      </Card>

      {/* Product List Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Monitor className="h-5 w-5 mr-2" />
            Produktliste Innstillinger
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SliderControl
            label="Maks produkter per kort"
            value={settings.max_products_per_card}
            onChange={(value) => onUpdate({ max_products_per_card: value })}
            min={3}
            max={20}
            step={1}
          />

          <div>
            <Label>Produktliste stil</Label>
            <Select
              value={settings.product_list_style}
              onValueChange={(value: 'compact' | 'normal') => 
                onUpdate({ product_list_style: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Kompakt</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Sorteringsrekkefølge</Label>
            <Select
              value={settings.customer_sort_order}
              onValueChange={(value: 'alphabetical' | 'status' | 'progress') => 
                onUpdate({ customer_sort_order: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alphabetical">Alfabetisk</SelectItem>
                <SelectItem value="status">Etter status</SelectItem>
                <SelectItem value="progress">Etter fremgang</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={settings.show_line_items_count}
              onCheckedChange={(checked) => onUpdate({ show_line_items_count: checked })}
            />
            <Label>Vis varelinjer-telling</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SharedDisplaySettingsTab;
