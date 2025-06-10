
import React from 'react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import StatusIndicatorCard from './status-progress/StatusIndicatorCard';
import ProgressBarCard from './status-progress/ProgressBarCard';
import TruckIconCard from './status-progress/TruckIconCard';

interface StatusProgressTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const StatusProgressTab = ({ settings, onUpdate }: StatusProgressTabProps) => {
  return (
    <div className="space-y-6">
      <StatusIndicatorCard settings={settings} onUpdate={onUpdate} />
      
      <div className="space-y-4">
        <ProgressBarCard settings={settings} onUpdate={onUpdate} />
        <TruckIconCard settings={settings} onUpdate={onUpdate} />
      </div>
    </div>
  );
};

export default StatusProgressTab;
