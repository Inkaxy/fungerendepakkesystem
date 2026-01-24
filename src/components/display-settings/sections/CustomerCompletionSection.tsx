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
        <Label htmlFor="completion_message" className="font-medium">Fullføringsmelding</Label>
        <Input
          id="completion_message"
          value={settings.customer_completion_message}
          onChange={(e) => onUpdate({ customer_completion_message: e.target.value })}
          placeholder="Alt er pakket og klart! 🎉"
          className="bg-muted/50"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show_completion_animation" className="font-normal">Vis fullføringsanimasjon</Label>
        <input
          type="checkbox"
          id="show_completion_animation"
          checked={settings.customer_show_completion_animation}
          onChange={(e) => onUpdate({ customer_show_completion_animation: e.target.checked })}
          className="h-5 w-10 rounded-full appearance-none bg-muted checked:bg-primary relative cursor-pointer transition-colors
                     before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:w-4 before:h-4 before:rounded-full before:bg-white before:shadow before:transition-transform
                     checked:before:translate-x-5"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="truck_animation" className="font-normal">Lastebil-animasjon</Label>
        <input
          type="checkbox"
          id="truck_animation"
          checked={settings.show_truck_icon ?? true}
          onChange={(e) => onUpdate({ show_truck_icon: e.target.checked })}
          className="h-5 w-10 rounded-full appearance-none bg-muted checked:bg-primary relative cursor-pointer transition-colors
                     before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:w-4 before:h-4 before:rounded-full before:bg-white before:shadow before:transition-transform
                     checked:before:translate-x-5"
        />
      </div>
    </div>
  );
};

export default CustomerCompletionSection;
