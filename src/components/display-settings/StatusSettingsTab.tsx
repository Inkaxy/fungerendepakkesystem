
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
  const packingStatusItems = [
    { key: 'ongoing', label: 'Pågående', field: 'packing_status_ongoing_color' as keyof DisplaySettings },
    { key: 'completed', label: 'Ferdig pakket', field: 'packing_status_completed_color' as keyof DisplaySettings },
  ];

  return (
    <div className="space-y-6">
      {/* Packing Status Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pakkestatus Farger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packingStatusItems.map((status) => (
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
          <CardTitle className="text-lg">Pakkestatus Forhåndsvisning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              Slik vil status-indikatorene se ut på pakkeskjermen:
            </p>
            <div className="flex flex-wrap gap-3">
              {packingStatusItems.map((status) => (
                <Badge
                  key={status.key}
                  variant="secondary"
                  className="px-4 py-2 text-lg font-semibold"
                  style={{ 
                    backgroundColor: settings[status.field] as string,
                    color: 'white'
                  }}
                >
                  {status.label}
                </Badge>
              ))}
            </div>
            
            {/* Example packing card */}
            <div className="mt-6 p-6 border rounded-lg bg-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-xl mb-2">Eksempel Produkt</h4>
                  <p className="text-lg text-gray-600">15 av 20 pakket</p>
                </div>
                <div className="flex-1 mx-6">
                  <div 
                    className="w-full rounded-full bg-gray-200"
                    style={{ height: `${(settings.progress_height || 8) * 2}px` }}
                  >
                    <div 
                      className="rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: settings.progress_bar_color || '#3b82f6',
                        height: `${(settings.progress_height || 8) * 2}px`,
                        width: '75%'
                      }}
                    />
                  </div>
                  <div className="text-right mt-1 font-semibold">75%</div>
                </div>
                <Badge
                  className="text-lg px-4 py-2 font-semibold"
                  style={{ 
                    backgroundColor: settings.packing_status_ongoing_color || '#3b82f6',
                    color: 'white'
                  }}
                >
                  Pågående
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusSettingsTab;
