
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ColorPicker from './ColorPicker';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface StatusSettingsTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const StatusSettingsTab = ({ settings, onUpdate }: StatusSettingsTabProps) => {
  const statusItems = [
    { key: 'pending', label: 'Venter', field: 'status_pending_color' as keyof DisplaySettings },
    { key: 'in_progress', label: 'Under arbeid', field: 'status_in_progress_color' as keyof DisplaySettings },
    { key: 'completed', label: 'Fullført', field: 'status_completed_color' as keyof DisplaySettings },
    { key: 'delivered', label: 'Levert', field: 'status_delivered_color' as keyof DisplaySettings },
  ];

  return (
    <div className="space-y-6">
      {/* Status Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status Farger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statusItems.map((status) => (
              <ColorPicker
                key={status.key}
                label={status.label}
                value={settings[status.field] as string}
                onChange={(color) => onUpdate({ [status.field]: color })}
                description={`Farge for ${status.label.toLowerCase()} status`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status Forhåndsvisning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              Slik vil status-indikatorene se ut på displayet:
            </p>
            <div className="flex flex-wrap gap-3">
              {statusItems.map((status) => (
                <Badge
                  key={status.key}
                  variant="secondary"
                  className="px-3 py-1"
                  style={{ 
                    backgroundColor: settings[status.field] as string,
                    color: 'white'
                  }}
                >
                  {status.label}
                </Badge>
              ))}
            </div>
            
            {/* Example order card with status */}
            <div className="mt-6 p-4 border rounded-lg bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">Ordre #12345</h4>
                  <p className="text-sm text-gray-600">Kunde: Eksempel Bakeri AS</p>
                </div>
                <Badge
                  variant="secondary"
                  style={{ 
                    backgroundColor: settings.status_in_progress_color,
                    color: 'white'
                  }}
                >
                  Under arbeid
                </Badge>
              </div>
              <div className="mt-3 flex space-x-2">
                <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: settings.status_pending_color, color: 'white' }}>
                  2 venter
                </span>
                <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: settings.status_completed_color, color: 'white' }}>
                  3 fullført
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusSettingsTab;
