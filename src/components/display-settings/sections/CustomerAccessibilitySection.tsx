import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ToggleSetting from '../ToggleSetting';
import type { DisplaySettings } from '@/types/displaySettings';

interface CustomerAccessibilitySectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const CustomerAccessibilitySection = ({ settings, onUpdate }: CustomerAccessibilitySectionProps) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Innstillinger for å gjøre displayet mer tilgjengelig for alle brukere.
      </p>

      <ToggleSetting
        id="high_contrast_mode"
        label="Høykontrast-modus"
        description="Øk kontrasten mellom tekst og bakgrunn"
        checked={settings.high_contrast_mode ?? false}
        onCheckedChange={(checked) => onUpdate({ high_contrast_mode: checked })}
      />

      <ToggleSetting
        id="large_touch_targets"
        label="Store berøringsmål"
        description="Større klikk/trykk-områder for motoriske utfordringer"
        checked={settings.large_touch_targets ?? false}
        onCheckedChange={(checked) => onUpdate({ large_touch_targets: checked })}
      />

      <ToggleSetting
        id="reduce_motion"
        label="Reduser bevegelse"
        description="Minimerer animasjoner (for bevegelsessensitivitet)"
        checked={settings.reduce_motion ?? false}
        onCheckedChange={(checked) => onUpdate({ reduce_motion: checked })}
      />

      <div className="border-t pt-4 space-y-4">
        <Label className="text-base font-medium">Animasjoner</Label>

        <ToggleSetting
          id="enable_animations"
          label="Aktiver animasjoner"
          description="Globalt på/av for alle animasjoner"
          checked={settings.enable_animations ?? true}
          onCheckedChange={(checked) => onUpdate({ enable_animations: checked })}
        />

        {settings.enable_animations && !settings.reduce_motion && (
          <>
            <div className="space-y-2">
              <Label>Animasjonshastighet</Label>
              <Select
                value={settings.animation_speed ?? 'normal'}
                onValueChange={(value: 'slow' | 'normal' | 'fast') => onUpdate({ animation_speed: value })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  <SelectItem value="slow">Langsom (2s)</SelectItem>
                  <SelectItem value="normal">Normal (1s)</SelectItem>
                  <SelectItem value="fast">Rask (0.5s)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ToggleSetting
              id="fade_transitions"
              label="Fade-overganger"
              description="Myk fade-effekt ved innholdsendringer"
              checked={settings.fade_transitions ?? true}
              onCheckedChange={(checked) => onUpdate({ fade_transitions: checked })}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerAccessibilitySection;
