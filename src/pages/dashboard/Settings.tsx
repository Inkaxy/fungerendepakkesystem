import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import OneDriveConnectionCard from '@/components/settings/OneDriveConnectionCard';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <SettingsIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Innstillinger</h1>
          <p className="text-muted-foreground">Administrer integrasjoner og automatiseringer</p>
        </div>
      </div>

      {/* OneDrive Connection */}
      <OneDriveConnectionCard />
    </div>
  );
};

export default Settings;
