
import React from 'react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import StatusIndicatorCard from './status-progress/StatusIndicatorCard';
import ProgressBarCard from './status-progress/ProgressBarCard';
import TruckIconCard from './status-progress/TruckIconCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LayoutGrid } from 'lucide-react';

interface StatusProgressTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const StatusProgressTab = ({ settings, onUpdate }: StatusProgressTabProps) => {
  return (
    <div className="space-y-6">
      {/* Layout toggle */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Layout
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compact-layout">Kompakt layout</Label>
              <p className="text-xs text-muted-foreground">
                Kombinerer status og fremdrift i én rad (anbefalt)
              </p>
            </div>
            <Switch
              id="compact-layout"
              checked={settings.compact_status_progress ?? true}
              onCheckedChange={(checked) => onUpdate({ compact_status_progress: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <StatusIndicatorCard settings={settings} onUpdate={onUpdate} />
      
      <div className="space-y-4">
        <ProgressBarCard settings={settings} onUpdate={onUpdate} />
        <TruckIconCard settings={settings} onUpdate={onUpdate} />
      </div>
    </div>
  );
};

export default StatusProgressTab;
