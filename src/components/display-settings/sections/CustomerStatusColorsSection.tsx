import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ColorPicker from '../ColorPicker';
import type { DisplaySettings } from '@/types/displaySettings';

interface CustomerStatusColorsSectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const CustomerStatusColorsSection = ({ settings, onUpdate }: CustomerStatusColorsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <ColorPicker
          label="Venter (pending)"
          value={settings.status_pending_color}
          onChange={(color) => onUpdate({ status_pending_color: color })}
        />
        <ColorPicker
          label="Pågår (in progress)"
          value={settings.status_in_progress_color}
          onChange={(color) => onUpdate({ status_in_progress_color: color })}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ColorPicker
          label="Ferdig (completed)"
          value={settings.status_completed_color}
          onChange={(color) => onUpdate({ status_completed_color: color })}
        />
        <ColorPicker
          label="Levert (delivered)"
          value={settings.status_delivered_color}
          onChange={(color) => onUpdate({ status_delivered_color: color })}
        />
      </div>

      {/* Preview */}
      <Card className="p-4">
        <h4 className="font-medium mb-3">Forhåndsvisning</h4>
        <div className="flex flex-wrap gap-2">
          <Badge style={{ backgroundColor: settings.status_pending_color, color: 'white' }}>
            Venter
          </Badge>
          <Badge style={{ backgroundColor: settings.status_in_progress_color, color: 'white' }}>
            Pågår
          </Badge>
          <Badge style={{ backgroundColor: settings.status_completed_color, color: 'white' }}>
            Ferdig
          </Badge>
          <Badge style={{ backgroundColor: settings.status_delivered_color, color: 'white' }}>
            Levert
          </Badge>
        </div>
      </Card>
    </div>
  );
};

export default CustomerStatusColorsSection;
