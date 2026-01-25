import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
        <Label htmlFor="completion_message" className="font-medium">Fullføringsmelding</Label>
        <Input
          id="completion_message"
          value={settings.customer_completion_message ?? ''}
          onChange={(e) => onUpdate({ customer_completion_message: e.target.value })}
          placeholder="Alt er pakket og klart! 🎉"
          className="bg-muted/50"
        />
        <p className="text-xs text-muted-foreground">
          Meldingen som vises når alle produkter er pakket
        </p>
      </div>

      <ToggleSetting
        id="customer_show_completion_animation"
        label="Vis fullføringsanimasjon"
        description="Konfetti-effekt når alt er pakket"
        checked={settings.customer_show_completion_animation ?? false}
        onCheckedChange={(checked) => onUpdate({ customer_show_completion_animation: checked })}
      />

      <ToggleSetting
        id="customer_completion_sound"
        label="Spill av lyd ved fullføring"
        description="En glad lyd når pakking er ferdig"
        checked={settings.customer_completion_sound ?? false}
        onCheckedChange={(checked) => onUpdate({ customer_completion_sound: checked })}
      />
    </div>
  );
};

export default CustomerCompletionSection;
