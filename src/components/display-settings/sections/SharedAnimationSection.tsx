import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ToggleSetting from '../ToggleSetting';
import type { DisplaySettings } from '@/types/displaySettings';

interface SharedAnimationSectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const SharedAnimationSection = ({ settings, onUpdate }: SharedAnimationSectionProps) => {
  return (
    <div className="space-y-4">
      <ToggleSetting
        id="enable_animations"
        label="Aktiver animasjoner"
        description="Slå av for å forbedre ytelse på svakere enheter"
        checked={settings.enable_animations}
        onCheckedChange={(checked) => onUpdate({ enable_animations: checked })}
      />

      {settings.enable_animations && (
        <>
          <div className="space-y-2">
            <Label>Animasjonshastighet</Label>
            <Select
              value={settings.animation_speed}
              onValueChange={(value: 'slow' | 'normal' | 'fast') => onUpdate({ animation_speed: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">Sakte</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="fast">Rask</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ToggleSetting
              id="fade_transitions"
              label="Fade-overganger"
              description="Myk innfading ved endringer"
              checked={settings.fade_transitions}
              onCheckedChange={(checked) => onUpdate({ fade_transitions: checked })}
            />
            <ToggleSetting
              id="pulse_on_update"
              label="Puls ved oppdatering"
              description="Kort puls-animasjon ved data-endringer"
              checked={settings.pulse_on_update}
              onCheckedChange={(checked) => onUpdate({ pulse_on_update: checked })}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SharedAnimationSection;
