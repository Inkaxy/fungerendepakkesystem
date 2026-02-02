import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ToggleSetting from '../ToggleSetting';
import SliderControl from '../SliderControl';
import type { DisplaySettings } from '@/types/displaySettings';

interface SharedRealtimeSectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const SharedRealtimeSection = ({ settings, onUpdate }: SharedRealtimeSectionProps) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Sanntidsoppdateringer skjer automatisk via WebSocket. Disse innstillingene styrer fallback og visuell tilbakemelding.
      </p>

      <ToggleSetting
        id="auto-refresh-toggle"
        label="Fallback polling"
        description="Automatisk oppdatering hvis WebSocket feiler (anbefalt på)"
        checked={(settings.auto_refresh_interval ?? 30) > 0}
        onCheckedChange={(checked) => 
          onUpdate({ auto_refresh_interval: checked ? 30 : 0 })
        }
      />

      {(settings.auto_refresh_interval ?? 30) > 0 && (
        <SliderControl
          label="Polling-intervall"
          value={settings.auto_refresh_interval ?? 30}
          onChange={(value) => onUpdate({ auto_refresh_interval: value })}
          min={5}
          max={120}
          step={5}
          unit="sek"
          description="Hvor ofte data hentes ved WebSocket-feil"
        />
      )}

      <ToggleSetting
        id="show-delivery-dates"
        label="Vis leveringsdatoer"
        description="Vis forventet leveringsdato på kundekortene"
        checked={settings.show_delivery_dates ?? false}
        onCheckedChange={(checked) => onUpdate({ show_delivery_dates: checked })}
      />

      <ToggleSetting
        id="shared_hide_completed_customers"
        label="Skjul ferdige kunder"
        description="Automatisk fjern kunder som er ferdig pakket fra visningen"
        checked={settings.shared_hide_completed_customers ?? false}
        onCheckedChange={(checked) => onUpdate({ shared_hide_completed_customers: checked })}
      />

      <SliderControl
        label="Opacity på ferdige kunder"
        value={settings.shared_completed_customer_opacity ?? 50}
        onChange={(value) => onUpdate({ shared_completed_customer_opacity: value })}
        min={20}
        max={100}
        step={10}
        unit="%"
        description="Hvor gjennomsiktige ferdige kunder vises (før de eventuelt skjules)"
      />
    </div>
  );
};

export default SharedRealtimeSection;
