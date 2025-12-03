import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, CheckCircle2 } from 'lucide-react';
import { useOneDriveConnection } from '@/hooks/useOneDriveConnection';
import OneDriveConnectionStep from './OneDriveConnectionStep';
import OneDriveSyncStep from './OneDriveSyncStep';
import OneDriveSyncHistory from './OneDriveSyncHistory';

const OneDriveSetup: React.FC = () => {
  const { isConnected, isLoading } = useOneDriveConnection();

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Cloud className="h-6 w-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                OneDrive Integrasjon
                {isConnected && (
                  <span className="inline-flex items-center gap-1 text-sm font-normal text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Tilkoblet
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                Koble til Microsoft OneDrive for automatisk import av produkter, kunder og ordrer
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Step 1: Connection */}
          <OneDriveConnectionStep />

          {/* Step 2: Sync Settings - only show if connected */}
          <OneDriveSyncStep disabled={!isConnected} />
        </CardContent>
      </Card>

      {/* Sync History */}
      {isConnected && <OneDriveSyncHistory />}
    </div>
  );
};

export default OneDriveSetup;
