import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Save, Eye, Monitor, Palette, Layout, Activity, Settings2 } from 'lucide-react';
import { useDisplaySettings, useUpdateDisplaySettings } from '@/hooks/useDisplaySettings';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import DisplayPreview from '@/components/display-settings/DisplayPreview';

const DisplaySettings = () => {
  const { data: settings, isLoading } = useDisplaySettings();
  const updateSettings = useUpdateDisplaySettings();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [localSettings, setLocalSettings] = React.useState(settings);

  React.useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleUpdate = (updates: any) => {
    if (localSettings) {
      setLocalSettings({ ...localSettings, ...updates });
    }
  };

  const handleSave = () => {
    if (localSettings) {
      updateSettings.mutate(localSettings);
    }
  };

  const handlePreview = () => {
    navigate('/display/shared');
  };

  // Screen size presets with correct configurations
  const screenPresets = [
    {
      value: '10inch',
      label: '10" - 13" Tablets',
      config: {
        customer_cards_columns: 2,
        body_font_size: 14,
        header_font_size: 24,
        large_screen_optimization: false,
        force_single_screen: true,
        spacing: 12,
        status_indicator_padding: 16
      }
    },
    {
      value: 'laptop',
      label: '13" - 17" Laptops',
      config: {
        customer_cards_columns: 3,
        body_font_size: 16,
        header_font_size: 28,
        large_screen_optimization: false,
        force_single_screen: false,
        spacing: 16,
        status_indicator_padding: 20
      }
    },
    {
      value: 'monitor',
      label: '19" - 27" Monitorer',
      config: {
        customer_cards_columns: 3,
        body_font_size: 16,
        header_font_size: 32,
        large_screen_optimization: false,
        force_single_screen: false,
        spacing: 16,
        status_indicator_padding: 24
      }
    },
    {
      value: '32inch',
      label: '32" TV/Store Monitorer',
      config: {
        customer_cards_columns: 4,
        body_font_size: 18,
        header_font_size: 36,
        large_screen_optimization: true,
        force_single_screen: false,
        spacing: 20,
        status_indicator_padding: 28
      }
    },
    {
      value: '43inch',
      label: '43" TV-skjermer',
      config: {
        customer_cards_columns: 5,
        body_font_size: 20,
        header_font_size: 40,
        large_screen_optimization: true,
        force_single_screen: false,
        spacing: 24,
        status_indicator_padding: 32
      }
    },
    {
      value: '55inch',
      label: '55" Store TV-skjermer',
      config: {
        customer_cards_columns: 6,
        body_font_size: 24,
        header_font_size: 48,
        large_screen_optimization: true,
        force_single_screen: false,
        spacing: 28,
        status_indicator_padding: 36
      }
    },
    {
      value: '65inch',
      label: '65"+ Ekstra Store TV',
      config: {
        customer_cards_columns: 7,
        body_font_size: 28,
        header_font_size: 56,
        large_screen_optimization: true,
        force_single_screen: false,
        spacing: 32,
        status_indicator_padding: 40
      }
    }
  ];

  const handlePresetChange = (presetValue: string) => {
    const preset = screenPresets.find(p => p.value === presetValue);
    if (preset && localSettings) {
      handleUpdate({
        screen_size_preset: presetValue,
        ...preset.config
      });
    }
  };

  if (isLoading || !localSettings) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Laster displayinnstillinger...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentPreset = screenPresets.find(p => p.value === localSettings.screen_size_preset);

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Display Innstillinger</h1>
          <p className="text-gray-600 mt-2">
            Konfigurer utseendet på pakkeskjermene dine
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Forhåndsvis
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={updateSettings.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {updateSettings.isPending ? 'Lagrer...' : 'Lagre Innstillinger'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Skjermstørrelse */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Skjermstørrelse & Layout
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Velg skjermstørrelse for automatisk optimalisering
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Skjermstørrelse</Label>
                <Select 
                  value={localSettings.screen_size_preset} 
                  onValueChange={handlePresetChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Velg skjermstørrelse" />
                  </SelectTrigger>
                  <SelectContent>
                    {screenPresets.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {currentPreset && (
                  <p className="text-sm text-muted-foreground">
                    Optimalisert for {currentPreset.config.customer_cards_columns} kolonner, 
                    {currentPreset.config.body_font_size}px tekst, 
                    {currentPreset.config.spacing}px spacing
                  </p>
                )}
              </div>

              <Separator />

              {/* Layout Optimaliseringer */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  Layout Optimaliseringer
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Vis alle kunder på ett skjermbilde</Label>
                      <p className="text-sm text-muted-foreground">
                        Justerer layout automatisk så alle kunder vises uten scrolling
                      </p>
                    </div>
                    <Switch
                      checked={localSettings.force_single_screen}
                      onCheckedChange={(checked) => handleUpdate({ force_single_screen: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Store skjerm optimaliseringer</Label>
                      <p className="text-sm text-muted-foreground">
                        Øker kontrast, spacing og lesbarhet for TV-skjermer
                      </p>
                    </div>
                    <Switch
                      checked={localSettings.large_screen_optimization}
                      onCheckedChange={(checked) => handleUpdate({ large_screen_optimization: checked })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Manuell justering */}
              <div className="space-y-4">
                <h4 className="font-medium">Manuell Justering</h4>
                
                <div className="space-y-3">
                  <Label>Antall kolonner: {localSettings.customer_cards_columns}</Label>
                  <Slider
                    min={2}
                    max={8}
                    step={1}
                    value={[localSettings.customer_cards_columns]}
                    onValueChange={([value]) => handleUpdate({ customer_cards_columns: value })}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Spacing: {localSettings.spacing}px</Label>
                  <Slider
                    min={8}
                    max={40}
                    step={2}
                    value={[localSettings.spacing]}
                    onValueChange={([value]) => handleUpdate({ spacing: value })}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Status indikator padding: {localSettings.status_indicator_padding}px</Label>
                  <Slider
                    min={12}
                    max={48}
                    step={2}
                    value={[localSettings.status_indicator_padding]}
                    onValueChange={([value]) => handleUpdate({ status_indicator_padding: value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tekststørrelser */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                Tekststørrelser
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Overskrift størrelse: {localSettings.header_font_size}px</Label>
                <Slider
                  min={20}
                  max={64}
                  step={2}
                  value={[localSettings.header_font_size]}
                  onValueChange={([value]) => handleUpdate({ header_font_size: value })}
                />
              </div>

              <div className="space-y-3">
                <Label>Brødtekst størrelse: {localSettings.body_font_size}px</Label>
                <Slider
                  min={12}
                  max={32}
                  step={1}
                  value={[localSettings.body_font_size]}
                  onValueChange={([value]) => handleUpdate({ body_font_size: value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Farger */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Farger & Styling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bakgrunnsfarge</Label>
                  <input
                    type="color"
                    value={localSettings.background_color}
                    onChange={(e) => handleUpdate({ background_color: e.target.value })}
                    className="w-full h-10 rounded border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tekst farge</Label>
                  <input
                    type="color"
                    value={localSettings.text_color}
                    onChange={(e) => handleUpdate({ text_color: e.target.value })}
                    className="w-full h-10 rounded border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kort bakgrunn</Label>
                  <input
                    type="color"
                    value={localSettings.card_background_color}
                    onChange={(e) => handleUpdate({ card_background_color: e.target.value })}
                    className="w-full h-10 rounded border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Accent farge</Label>
                  <input
                    type="color"
                    value={localSettings.product_accent_color}
                    onChange={(e) => handleUpdate({ product_accent_color: e.target.value })}
                    className="w-full h-10 rounded border"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status & Animasjoner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Status & Funksjoner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Fullskjerm-modus</Label>
                  <p className="text-sm text-muted-foreground">
                    Aktiverer fullskjerm automatisk når siden lastes (trykk ESC for å avslutte)
                  </p>
                </div>
                <Switch
                  checked={localSettings.fullscreen_mode}
                  onCheckedChange={(checked) => handleUpdate({ fullscreen_mode: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Vis fremgangslinje</Label>
                <Switch
                  checked={localSettings.show_progress_bar}
                  onCheckedChange={(checked) => handleUpdate({ show_progress_bar: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Vis prosentandel</Label>
                <Switch
                  checked={localSettings.show_progress_percentage}
                  onCheckedChange={(checked) => handleUpdate({ show_progress_percentage: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Aktiver animasjoner</Label>
                <Switch
                  checked={localSettings.enable_animations}
                  onCheckedChange={(checked) => handleUpdate({ enable_animations: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Vis lastebil ikon</Label>
                <Switch
                  checked={localSettings.show_truck_icon}
                  onCheckedChange={(checked) => handleUpdate({ show_truck_icon: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Vis kundenummer</Label>
                <Switch
                  checked={localSettings.show_customer_numbers}
                  onCheckedChange={(checked) => handleUpdate({ show_customer_numbers: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Vis status-badges</Label>
                <Switch
                  checked={localSettings.show_status_badges}
                  onCheckedChange={(checked) => handleUpdate({ show_status_badges: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <DisplayPreview settings={localSettings} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplaySettings;