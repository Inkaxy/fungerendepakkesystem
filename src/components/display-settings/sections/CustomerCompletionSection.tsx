import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ToggleSetting from '../ToggleSetting';
import type { DisplaySettings } from '@/types/displaySettings';

interface CustomerCompletionSectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const CustomerCompletionSection = ({ settings, onUpdate }: CustomerCompletionSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="completion_message">Fullført-melding</Label>
        <Input
          id="completion_message"
          value={settings.customer_completion_message}
          onChange={(e) => onUpdate({ customer_completion_message: e.target.value })}
          placeholder="Alt er pakket og klart! 🎉"
        />
        <p className="text-sm text-muted-foreground">
          Meldingen som vises når all pakking er fullført
        </p>
      </div>

      <ToggleSetting
        id="customer_show_completion_animation"
        label="Fullført-animasjon"
        description="Vis konfetti eller lignende animasjon ved fullført pakking"
        checked={settings.customer_show_completion_animation}
        onCheckedChange={(checked) => onUpdate({ customer_show_completion_animation: checked })}
      />

      <ToggleSetting
        id="customer_completion_sound"
        label="Lydeffekt ved fullført"
        description="Spill av en lyd når all pakking er ferdig"
        checked={settings.customer_completion_sound}
        onCheckedChange={(checked) => onUpdate({ customer_completion_sound: checked })}
      />
    </div>
  );
};

export default CustomerCompletionSection;
