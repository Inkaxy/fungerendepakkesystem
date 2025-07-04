import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Monitor, Maximize, Smartphone } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface ResponsivenessTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const ResponsivenessTab = ({ settings, onUpdate }: ResponsivenessTabProps) => {
  return (
    <div className="space-y-6">
      {/* Auto Screen Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Monitor className="h-5 w-5 mr-2" />
            Automatisk skjermdetektering
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Automatisk tilpassing basert på skjermstørrelse og enhet
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-detection">Aktiver automatisk detektering</Label>
            <Switch
              id="auto-detection"
              checked={settings.auto_screen_detection}
              onCheckedChange={(checked) => onUpdate({ auto_screen_detection: checked })}
            />
          </div>

          {settings.auto_screen_detection && (
            <div className="space-y-4 pl-4 border-l-2 border-muted">
              <div className="space-y-2">
                <Label>Responsivitet breakpoint</Label>
                <Select 
                  value={settings.responsive_breakpoint} 
                  onValueChange={(value: 'small' | 'medium' | 'large') => 
                    onUpdate({ responsive_breakpoint: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Aggressiv (favoriserer små skjermer)</SelectItem>
                    <SelectItem value="medium">Balansert (standard)</SelectItem>
                    <SelectItem value="large">Konservativ (favoriserer store skjermer)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Bestemmer hvor tidlig systemet bytter fra stor-skjerm til liten-skjerm modus
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fullscreen Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Maximize className="h-5 w-5 mr-2" />
            Fullskjerm-modus
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Aktiver fullskjerm for en mer immersiv opplevelse
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="fullscreen">Aktiver fullskjerm-modus</Label>
            <Switch
              id="fullscreen"
              checked={settings.fullscreen_mode}
              onCheckedChange={(checked) => onUpdate({ fullscreen_mode: checked })}
            />
          </div>
          
          {settings.fullscreen_mode && (
            <div className="pl-4 border-l-2 border-muted">
              <p className="text-sm text-muted-foreground">
                Displayet vil automatisk gå i fullskjerm når det lastes. Brukere kan trykke ESC for å gå ut av fullskjerm.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Layout Dimensions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Smartphone className="h-5 w-5 mr-2" />
            Layout-dimensjoner
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Juster størrelse og avstand for optimal visning
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Minimum kortbredde</Label>
              <span className="text-sm font-medium">{settings.minimum_card_width}px</span>
            </div>
            <Slider
              value={[settings.minimum_card_width]}
              onValueChange={(value) => onUpdate({ minimum_card_width: value[0] })}
              min={150}
              max={400}
              step={10}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Display padding</Label>
              <span className="text-sm font-medium">{settings.display_padding}px</span>
            </div>
            <Slider
              value={[settings.display_padding]}
              onValueChange={(value) => onUpdate({ display_padding: value[0] })}
              min={0}
              max={48}
              step={4}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Display margin</Label>
              <span className="text-sm font-medium">{settings.display_margin}px</span>
            </div>
            <Slider
              value={[settings.display_margin]}
              onValueChange={(value) => onUpdate({ display_margin: value[0] })}
              min={0}
              max={32}
              step={2}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsivenessTab;