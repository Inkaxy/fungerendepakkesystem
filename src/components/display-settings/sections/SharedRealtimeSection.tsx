import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import type { DisplaySettings } from '@/types/displaySettings';

interface SharedRealtimeSectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const SharedRealtimeSection = ({ settings, onUpdate }: SharedRealtimeSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="auto-refresh">Auto-oppdatering</Label>
        <Switch
          id="auto-refresh"
          checked={(settings.auto_refresh_interval ?? 30) > 0}
          onCheckedChange={(checked) => 
            onUpdate({ auto_refresh_interval: checked ? 30 : 0 })
          }
        />
      </div>

      {(settings.auto_refresh_interval ?? 30) > 0 && (
        <div className="space-y-2">
          <Label htmlFor="refresh-interval">Oppdateringsintervall (sekunder)</Label>
          <Input
            id="refresh-interval"
            type="number"
            min={5}
            max={300}
            value={settings.auto_refresh_interval ?? 30}
            onChange={(e) => onUpdate({ auto_refresh_interval: parseInt(e.target.value) || 30 })}
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <Label htmlFor="show-status-badges">Vis status-badges</Label>
        <Switch
          id="show-status-badges"
          checked={settings.show_status_badges ?? true}
          onCheckedChange={(checked) => onUpdate({ show_status_badges: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="pulse-on-update">Puls-effekt ved oppdatering</Label>
        <Switch
          id="pulse-on-update"
          checked={settings.pulse_on_update ?? true}
          onCheckedChange={(checked) => onUpdate({ pulse_on_update: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-delivery-dates">Vis leveringsdatoer</Label>
        <Switch
          id="show-delivery-dates"
          checked={settings.show_delivery_dates ?? false}
          onCheckedChange={(checked) => onUpdate({ show_delivery_dates: checked })}
        />
      </div>
    </div>
  );
};

export default SharedRealtimeSection;
