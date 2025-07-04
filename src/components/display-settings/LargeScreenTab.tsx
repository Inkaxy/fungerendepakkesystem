import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tv, Monitor, Maximize } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface LargeScreenTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const LargeScreenTab = ({ settings, onUpdate }: LargeScreenTabProps) => {
  const screenSizePresets = [
    // Små skjermer og tablets
    { value: '10inch', label: '10.1" Tablet', columns: 2, fontSize: 14, headerSize: 24, category: 'small' },
    { value: '13inch', label: '12.9" Tablet Pro', columns: 2, fontSize: 15, headerSize: 26, category: 'small' },
    { value: 'laptop', label: '13-17" Laptop', columns: 3, fontSize: 16, headerSize: 28, category: 'small' },
    { value: 'monitor', label: '19-24" Monitor', columns: 3, fontSize: 16, headerSize: 30, category: 'small' },
    
    // Standard og store skjermer
    { value: 'standard', label: 'Standard (desktop)', columns: 3, fontSize: 16, headerSize: 32, category: 'medium' },
    { value: '32inch', label: '32" TV/Monitor', columns: 4, fontSize: 18, headerSize: 36, category: 'large' },
    { value: '43inch', label: '43" TV/Monitor', columns: 5, fontSize: 20, headerSize: 40, category: 'large' },
    { value: '55inch', label: '55" TV/Monitor', columns: 6, fontSize: 24, headerSize: 48, category: 'large' },
    { value: '65inch', label: '65"+ Store TV', columns: 7, fontSize: 28, headerSize: 56, category: 'large' }
  ];

  const selectedPreset = screenSizePresets.find(p => p.value === settings.screen_size_preset);

  const handlePresetChange = (preset: string) => {
    const presetConfig = screenSizePresets.find(p => p.value === preset);
    if (presetConfig) {
      onUpdate({
        screen_size_preset: preset as any,
        customer_cards_columns: presetConfig.columns,
        body_font_size: presetConfig.fontSize,
        header_font_size: presetConfig.headerSize,
        large_screen_optimization: preset !== 'standard'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Screen Size Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tv className="h-5 w-5" />
            Skjermstørrelse Presets
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Forhåndskonfigurerte innstillinger optimalisert for ulike TV- og monitorstørrelser
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-3">
             <Label htmlFor="screen-preset">Velg skjermstørrelse</Label>
             <Select 
               value={settings.screen_size_preset} 
               onValueChange={handlePresetChange}
             >
               <SelectTrigger>
                 <SelectValue placeholder="Velg skjermstørrelse" />
               </SelectTrigger>
               <SelectContent>
                 <div className="p-2">
                   <div className="text-xs font-medium text-muted-foreground mb-2">Små skjermer & Tablets</div>
                   {screenSizePresets.filter(p => p.category === 'small').map((preset) => (
                     <SelectItem key={preset.value} value={preset.value}>
                       {preset.label}
                     </SelectItem>
                   ))}
                   
                   <div className="text-xs font-medium text-muted-foreground mb-2 mt-4">Standard & Store skjermer</div>
                   {screenSizePresets.filter(p => p.category === 'medium' || p.category === 'large').map((preset) => (
                     <SelectItem key={preset.value} value={preset.value}>
                       {preset.label}
                     </SelectItem>
                   ))}
                 </div>
               </SelectContent>
             </Select>
            {selectedPreset && (
              <p className="text-sm text-muted-foreground">
                Optimalisert for {selectedPreset.columns} kolonner, {selectedPreset.fontSize}px tekst og {selectedPreset.headerSize}px overskrifter
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Font Size Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Tekststørrelser for Store Skjermer
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Juster tekststørrelser for optimal lesbarhet på avstand
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="header-font-size">
              Overskrift størrelse: {settings.header_font_size}px
            </Label>
            <Slider
              id="header-font-size"
              min={24}
              max={64}
              step={2}
              value={[settings.header_font_size]}
              onValueChange={([value]) => onUpdate({ header_font_size: value })}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="body-font-size">
              Brødtekst størrelse: {settings.body_font_size}px
            </Label>
            <Slider
              id="body-font-size"
              min={12}
              max={32}
              step={1}
              value={[settings.body_font_size]}
              onValueChange={([value]) => onUpdate({ body_font_size: value })}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="status-font-size">
              Status indikator størrelse: {settings.status_indicator_font_size}px
            </Label>
            <Slider
              id="status-font-size"
              min={16}
              max={48}
              step={2}
              value={[settings.status_indicator_font_size]}
              onValueChange={([value]) => onUpdate({ status_indicator_font_size: value })}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Layout Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Maximize className="h-5 w-5" />
            Layout Optimaliseringer
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Spesielle innstillinger for store skjermer og TV-visning
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
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
                  Aktiverer forbedringer for store skjermer (større spacing, bedre kontrast)
                </p>
              </div>
              <Switch
                id="large-screen-opt"
                checked={settings.large_screen_optimization}
                onCheckedChange={(checked) => onUpdate({ large_screen_optimization: checked })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="columns">
              Antall kolonner: {settings.customer_cards_columns}
            </Label>
            <Slider
              id="columns"
              min={2}
              max={8}
              step={1}
              value={[settings.customer_cards_columns]}
              onValueChange={([value]) => onUpdate({ customer_cards_columns: value })}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="spacing">
              Ekstra spacing: {settings.spacing}px
            </Label>
            <Slider
              id="spacing"
              min={8}
              max={32}
              step={2}
              value={[settings.spacing]}
              onValueChange={([value]) => onUpdate({ spacing: value })}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="status-padding">
              Status indikator padding: {settings.status_indicator_padding}px
            </Label>
            <Slider
              id="status-padding"
              min={12}
              max={48}
              step={2}
              value={[settings.status_indicator_padding]}
              onValueChange={([value]) => onUpdate({ status_indicator_padding: value })}
              className="w-full"
            />
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
    </div>
  );
};

export default LargeScreenTab;