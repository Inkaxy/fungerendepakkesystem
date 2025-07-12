
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tv, Monitor, Maximize, Zap } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface LargeScreenTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const LargeScreenTab = ({ settings, onUpdate }: LargeScreenTabProps) => {
  const screenSizePresets = [
    // Små skjermer og tablets
    { value: '10inch', label: '10.1" Tablet', columns: 2, fontSize: 12, headerSize: 20, category: 'small', description: 'Kompakt tablet-visning' },
    { value: '13inch', label: '12.9" Tablet Pro', columns: 2, fontSize: 14, headerSize: 24, category: 'small', description: 'Stor tablet med god lesbarhet' },
    { value: 'laptop', label: '13-17" Laptop', columns: 3, fontSize: 15, headerSize: 28, category: 'small', description: 'Standard laptop skjerm' },
    
    // Medium skjermer
    { value: 'monitor', label: '19-24" Monitor', columns: 3, fontSize: 16, headerSize: 30, category: 'medium', description: 'Desktop monitor' },
    { value: 'standard', label: '24" Standard', columns: 3, fontSize: 16, headerSize: 32, category: 'medium', description: 'Standard desktop oppsett' },
    
    // Store skjermer - TV og store monitorer
    { value: '32inch', label: '32" TV/Monitor', columns: 4, fontSize: 20, headerSize: 40, category: 'large', description: 'Stor skjerm med avstandslesing' },
    { value: '43inch', label: '43" TV/Monitor', columns: 5, fontSize: 24, headerSize: 48, category: 'large', description: 'TV-størrelse for større rom' },
    { value: '55inch', label: '55" TV/Monitor', columns: 6, fontSize: 28, headerSize: 56, category: 'large', description: 'Stor TV, optimal for lange avstander' },
    { value: '65inch', label: '65"+ Store TV', columns: 7, fontSize: 32, headerSize: 64, category: 'extra-large', description: 'Ekstra store TV-skjermer' }
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
        large_screen_optimization: presetConfig.category === 'large' || presetConfig.category === 'extra-large'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Auto Screen Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Automatisk Skjermoptimalisering
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Lar systemet automatisk tilpasse layout og størrelser basert på faktisk skjermstørrelse
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="auto-detection">Aktiver automatisk tilpasning</Label>
              <p className="text-sm text-muted-foreground">
                Systemet vil automatisk justere kolonner, fontstørrelser og spacing
              </p>
            </div>
            <Switch
              id="auto-detection"
              checked={settings.auto_screen_detection}
              onCheckedChange={(checked) => onUpdate({ auto_screen_detection: checked })}
            />
          </div>
          
          {settings.auto_screen_detection && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                ✨ Automatisk tilpasning er aktivert. Systemet vil overstyre manuelle innstillinger for optimal visning på hver skjerm.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Screen Size Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tv className="h-5 w-5" />
            Skjermstørrelse Presets
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Forhåndskonfigurerte innstillinger optimalisert for forskjellige skjermstørrelser
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
                       <div>
                         <div className="font-medium">{preset.label}</div>
                         <div className="text-xs text-muted-foreground">{preset.description}</div>
                       </div>
                     </SelectItem>
                   ))}
                   
                   <div className="text-xs font-medium text-muted-foreground mb-2 mt-4">Standard & Store skjermer</div>
                   {screenSizePresets.filter(p => p.category === 'medium' || p.category === 'large' || p.category === 'extra-large').map((preset) => (
                     <SelectItem key={preset.value} value={preset.value}>
                       <div>
                         <div className="font-medium">{preset.label}</div>
                         <div className="text-xs text-muted-foreground">{preset.description}</div>
                       </div>
                     </SelectItem>
                   ))}
                 </div>
               </SelectContent>
             </Select>
            {selectedPreset && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium">{selectedPreset.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedPreset.columns} kolonner • {selectedPreset.fontSize}px tekst • {selectedPreset.headerSize}px overskrifter
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Font Size Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Tekststørrelser
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Juster tekststørrelser manuelt (overstyres av automatisk tilpasning)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="header-font-size">
              Overskrift størrelse: {settings.header_font_size}px
            </Label>
            <Slider
              id="header-font-size"
              min={16}
              max={72}
              step={2}
              value={[settings.header_font_size]}
              onValueChange={([value]) => onUpdate({ header_font_size: value })}
              className="w-full"
              disabled={settings.auto_screen_detection}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="body-font-size">
              Brødtekst størrelse: {settings.body_font_size}px
            </Label>
            <Slider
              id="body-font-size"
              min={10}
              max={36}
              step={1}
              value={[settings.body_font_size]}
              onValueChange={([value]) => onUpdate({ body_font_size: value })}
              className="w-full"
              disabled={settings.auto_screen_detection}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="status-font-size">
              Status indikator størrelse: {settings.status_indicator_font_size}px
            </Label>
            <Slider
              id="status-font-size"
              min={12}
              max={56}
              step={2}
              value={[settings.status_indicator_font_size]}
              onValueChange={([value]) => onUpdate({ status_indicator_font_size: value })}
              className="w-full"
              disabled={settings.auto_screen_detection}
            />
          </div>
        </CardContent>
      </Card>

      {/* Layout Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Maximize className="h-5 w-5" />
            Layout Innstillinger
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manuelle layout-justeringer for spesialtilpasninger
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
              min={1}
              max={8}
              step={1}
              value={[settings.customer_cards_columns]}
              onValueChange={([value]) => onUpdate({ customer_cards_columns: value })}
              className="w-full"
              disabled={settings.auto_screen_detection}
            />
            {settings.auto_screen_detection && (
              <p className="text-xs text-muted-foreground">
                Automatisk tilpasning overstyrer denne innstillingen
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="spacing">
              Ekstra spacing: {settings.spacing}px
            </Label>
            <Slider
              id="spacing"
              min={4}
              max={48}
              step={2}
              value={[settings.spacing]}
              onValueChange={([value]) => onUpdate({ spacing: value })}
              className="w-full"
              disabled={settings.auto_screen_detection}
            />
          </div>

          {/* Layout Preview */}
          <div className="space-y-3">
            <Label>Layout Forhåndsvisning</Label>
            <div className="grid grid-cols-12 gap-2 p-4 bg-muted rounded-lg">
              {Array.from({ length: Math.min(settings.customer_cards_columns || 3, 6) }).map((_, i) => (
                <div 
                  key={i} 
                  className={`${
                    settings.customer_cards_columns <= 2 ? 'col-span-6' :
                    settings.customer_cards_columns === 3 ? 'col-span-4' :
                    settings.customer_cards_columns === 4 ? 'col-span-3' :
                    'col-span-2'
                  } h-16 bg-primary/20 rounded border-2 border-dashed border-primary/30 flex items-center justify-center text-xs`}
                >
                  Kunde {i + 1}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {settings.customer_cards_columns} kolonner layout
              {settings.force_single_screen && " (alle kunder på ett skjermbilde)"}
              {settings.auto_screen_detection && " (automatisk tilpasset)"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LargeScreenTab;
