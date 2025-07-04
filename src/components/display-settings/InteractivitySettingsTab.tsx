import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { TouchpadIcon, RefreshCw, Pause, Hand } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface InteractivitySettingsTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const InteractivitySettingsTab = ({ settings, onUpdate }: InteractivitySettingsTabProps) => {
  return (
    <div className="space-y-6">
      {/* Touch-friendly Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Hand className="h-5 w-5 mr-2" />
            Touch-vennlige innstillinger
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Optimaliser for berøringsskjermer og touch-interaksjon
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="touch-friendly">Aktiver touch-vennlige størrelser</Label>
            <Switch
              id="touch-friendly"
              checked={settings.touch_friendly_sizes}
              onCheckedChange={(checked) => onUpdate({ touch_friendly_sizes: checked })}
            />
          </div>

          {settings.touch_friendly_sizes && (
            <div className="space-y-3 pl-4 border-l-2 border-muted">
              <div className="flex items-center justify-between">
                <Label>Minimum touch-størrelse</Label>
                <span className="text-sm font-medium">{settings.touch_target_size}px</span>
              </div>
              <Slider
                value={[settings.touch_target_size]}
                onValueChange={(value) => onUpdate({ touch_target_size: value[0] })}
                min={32}
                max={64}
                step={4}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Liten (32px)</span>
                <span>Standard (44px)</span>
                <span>Stor (64px)</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pause Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Pause className="h-5 w-5 mr-2" />
            Pause-modus
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Tillat brukere å pause automatisk oppdatering av displayet
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="pause-mode">Aktiver pause-modus</Label>
            <Switch
              id="pause-mode"
              checked={settings.pause_mode_enabled}
              onCheckedChange={(checked) => onUpdate({ pause_mode_enabled: checked })}
            />
          </div>
          
          {settings.pause_mode_enabled && (
            <div className="pl-4 border-l-2 border-muted">
              <p className="text-sm text-muted-foreground">
                Når aktivert, vil displayet vise en pause-knapp som lar brukere stoppe automatisk oppdatering midlertidig.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Refresh Button */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <RefreshCw className="h-5 w-5 mr-2" />
            Manuell oppdatering
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Vis en knapp som lar brukere manuelt oppdatere displaydata
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="manual-refresh">Vis oppdateringsknapp</Label>
            <Switch
              id="manual-refresh"
              checked={settings.show_manual_refresh_button}
              onCheckedChange={(checked) => onUpdate({ show_manual_refresh_button: checked })}
            />
          </div>

          {settings.show_manual_refresh_button && (
            <div className="space-y-4 pl-4 border-l-2 border-muted">
              <div className="space-y-2">
                <Label>Plassering av knapp</Label>
                <Select 
                  value={settings.manual_refresh_button_position} 
                  onValueChange={(value: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => 
                    onUpdate({ manual_refresh_button_position: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-left">Øverst til venstre</SelectItem>
                    <SelectItem value="top-right">Øverst til høyre</SelectItem>
                    <SelectItem value="bottom-left">Nederst til venstre</SelectItem>
                    <SelectItem value="bottom-right">Nederst til høyre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractivitySettingsTab;