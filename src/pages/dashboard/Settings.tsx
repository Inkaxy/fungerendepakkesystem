import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import OneDriveConnectionCard from '@/components/settings/OneDriveConnectionCard';
import OneDriveImportConfigCard from '@/components/settings/OneDriveImportConfigCard';
import OneDriveFileBrowser from '@/components/settings/OneDriveFileBrowser';
import OneDriveImportHistoryCard from '@/components/settings/OneDriveImportHistoryCard';
import { useOneDriveConnection } from '@/hooks/useOneDriveConnection';

const Settings: React.FC = () => {
  const { data: connection } = useOneDriveConnection();
  const isConnected = connection?.is_connected ?? false;

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

      {/* OneDrive Import Config - only show when connected */}
      {isConnected && (
        <>
          <OneDriveImportConfigCard />
          <OneDriveFileBrowser />
          <OneDriveImportHistoryCard />
        </>
      )}
    </div>
  );
};

export default Settings;
