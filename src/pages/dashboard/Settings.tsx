import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Settings as SettingsIcon } from 'lucide-react';
import OneDriveSetup from '@/components/settings/OneDriveSetup';

const Settings: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle OAuth callback results
  useEffect(() => {
    const onedriveStatus = searchParams.get('onedrive');
    const message = searchParams.get('message');

    if (onedriveStatus === 'success') {
      toast.success('OneDrive er nå tilkoblet!');
      // Clear the params
      setSearchParams({});
    } else if (onedriveStatus === 'error') {
      toast.error(message || 'Kunne ikke koble til OneDrive');
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

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

      {/* OneDrive Setup Section */}
      <OneDriveSetup />
    </div>
  );
};

export default Settings;
