
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Monitor, Maximize, Tv } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import HeaderSettingsCard from './shared/HeaderSettingsCard';
import StatisticsSettingsCard from './shared/StatisticsSettingsCard';
import CustomerCardsSettingsCard from './shared/CustomerCardsSettingsCard';
import ProductListSettingsCard from './shared/ProductListSettingsCard';
import BasketQuantitySettingsCard from './BasketQuantitySettingsCard';

interface SharedDisplaySettingsTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const SharedDisplaySettingsTab = ({ settings, onUpdate }: SharedDisplaySettingsTabProps) => {
  const screenSizePresets = [
    { value: 'standard', label: 'Standard (laptop/desktop)', columns: 3, fontSize: 16 },
    { value: '32inch', label: '32-tommer TV/monitor', columns: 4, fontSize: 18 },
    { value: '43inch', label: '43-tommer TV/monitor', columns: 5, fontSize: 20 },
    { value: '55inch', label: '55-tommer TV/monitor', columns: 6, fontSize: 24 }
  ];

  const selectedPreset = screenSizePresets.find(p => p.value === settings.screen_size_preset);

  const handlePresetChange = (preset: string) => {
    const presetConfig = screenSizePresets.find(p => p.value === preset);
    if (presetConfig) {
      onUpdate({
        screen_size_preset: preset as any,
        customer_cards_columns: presetConfig.columns,
        body_font_size: presetConfig.fontSize,
        header_font_size: presetConfig.fontSize + 16,
        large_screen_optimization: preset !== 'standard'
      });
    }
  };

  return (
    <div className="space-y-6">
      <HeaderSettingsCard settings={settings} onUpdate={onUpdate} />
      <StatisticsSettingsCard settings={settings} onUpdate={onUpdate} />
      
      {/* Screen Size Settings - Only for Shared Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tv className="h-5 w-5" />
            Skjermstørrelse og Layout (kun felles skjerm)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Disse innstillingene gjelder kun for felles displayet. Dedikerte kundeskjermer bruker standard responsive layout.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="screen-preset">Skjermstørrelse Preset</Label>
            <Select 
              value={settings.screen_size_preset} 
              onValueChange={handlePresetChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Velg skjermstørrelse" />
              </SelectTrigger>
              <SelectContent>
                {screenSizePresets.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPreset && (
              <p className="text-sm text-muted-foreground">
                Optimalisert for {selectedPreset.columns} kolonner og {selectedPreset.fontSize}px font
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="force-single-screen">Vis alle kunder på ett skjermbilde</Label>
                <p className="text-sm text-muted-foreground">
                  Tvinger alle kunder til å vises på ett skjermbilde ved å justere layout automatisk
                </p>
              </div>
              <Switch
                id="force-single-screen"
                checked={settings.force_single_screen}
                onCheckedChange={(checked) => onUpdate({ force_single_screen: checked })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="large-screen-opt">Store skjerm optimaliseringer</Label>
                <p className="text-sm text-muted-foreground">
                  Aktiverer forbedringer for store skjermer (større fonter, bedre spacing)
                </p>
              </div>
              <Switch
                id="large-screen-opt"
                checked={settings.large_screen_optimization}
                onCheckedChange={(checked) => onUpdate({ large_screen_optimization: checked })}
              />
            </div>
          </div>

          {/* Layout Preview */}
          <div className="space-y-3">
            <Label>Layout Forhåndsvisning</Label>
            <div className="grid grid-cols-12 gap-2 p-4 bg-muted rounded-lg">
              {Array.from({ length: settings.customer_cards_columns || 3 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`col-span-${Math.floor(12 / (settings.customer_cards_columns || 3))} h-20 bg-primary/20 rounded border-2 border-dashed border-primary/30 flex items-center justify-center text-xs`}
                >
                  Kunde {i + 1}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {settings.customer_cards_columns} kolonner layout
              {settings.force_single_screen && " (alle kunder på ett skjermbilde)"}
            </p>
          </div>
        </CardContent>
      </Card>

      <CustomerCardsSettingsCard settings={settings} onUpdate={onUpdate} />
      <ProductListSettingsCard settings={settings} onUpdate={onUpdate} />
      
      {/* Enhanced Features for Shared Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Avanserte felles display-innstillinger
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Tilleggsfunksjoner for optimalisert brukeropplevelse på felles skjerm
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="hide-empty-customers">Skjul tomme kunder</Label>
                <p className="text-sm text-muted-foreground">
                  Kunder uten produkter for dagen vises ikke på felles skjerm
                </p>
              </div>
              <Switch
                id="hide-empty-customers"
                checked={settings.hide_empty_customers}
                onCheckedChange={(checked) => onUpdate({ hide_empty_customers: checked })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="show-delivery-indicators">Leveringsdato-indikatorer</Label>
                <p className="text-sm text-muted-foreground">
                  Vis merker for "I dag", "I morgen" osv. på kundekort
                </p>
              </div>
              <Switch
                id="show-delivery-indicators"
                checked={settings.show_delivery_date_indicators}
                onCheckedChange={(checked) => onUpdate({ show_delivery_date_indicators: checked })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="auto-hide-completed">Auto-skjul ferdige kunder</Label>
                <p className="text-sm text-muted-foreground">
                  Skjul automatisk kunder som er 100% ferdige etter angitt tid
                </p>
              </div>
              <Switch
                id="auto-hide-completed"
                checked={settings.auto_hide_completed_customers}
                onCheckedChange={(checked) => onUpdate({ auto_hide_completed_customers: checked })}
              />
            </div>
          </div>

          {settings.auto_hide_completed_customers && (
            <div className="space-y-3">
              <Label htmlFor="auto-hide-timer">Auto-skjul timer (minutter)</Label>
              <Select 
                value={settings.auto_hide_completed_timer.toString()} 
                onValueChange={(value) => onUpdate({ auto_hide_completed_timer: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Velg tid" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutter</SelectItem>
                  <SelectItem value="10">10 minutter</SelectItem>
                  <SelectItem value="15">15 minutter</SelectItem>
                  <SelectItem value="30">30 minutter</SelectItem>
                  <SelectItem value="60">1 time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="customer-priority">Kunde-prioritering</Label>
            <Select 
              value={settings.customer_priority_mode} 
              onValueChange={(value) => onUpdate({ customer_priority_mode: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Velg prioritering" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Ingen spesiell prioritering</SelectItem>
                <SelectItem value="delivery_date">Prioriter etter leveringsdato</SelectItem>
                <SelectItem value="progress">Prioriter etter fremgang</SelectItem>
                <SelectItem value="custom">Tilpasset prioritering</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Spesiell fargekoding eller sortering basert på prioritet
            </p>
          </div>
        </CardContent>
      </Card>

      <BasketQuantitySettingsCard settings={settings} onUpdate={onUpdate} />
    </div>
  );
};

export default SharedDisplaySettingsTab;
