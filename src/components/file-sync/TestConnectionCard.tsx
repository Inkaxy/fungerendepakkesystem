import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFileSyncSettings, useTestConnection } from '@/hooks/useFileSyncSettings';
import { TestTube, CheckCircle, AlertTriangle, Cloud, HardDrive, Server } from 'lucide-react';

const getServiceIcon = (serviceType: string) => {
  switch (serviceType) {
    case 'onedrive':
      return <Cloud className="h-4 w-4" />;
    case 'google_drive':
      return <HardDrive className="h-4 w-4" />;
    case 'ftp':
    case 'sftp':
      return <Server className="h-4 w-4" />;
    default:
      return <Cloud className="h-4 w-4" />;
  }
};

const getServiceName = (serviceType: string) => {
  switch (serviceType) {
    case 'onedrive':
      return 'OneDrive';
    case 'google_drive':
      return 'Google Drive';
    case 'ftp':
      return 'FTP';
    case 'sftp':
      return 'SFTP';
    default:
      return serviceType;
  }
};

export const TestConnectionCard = () => {
  const { data: settings, isLoading } = useFileSyncSettings();
  const testConnection = useTestConnection();

  const handleTestConnection = async (setting: any) => {
    await testConnection.mutateAsync(setting);
  };

  if (isLoading) {
    return <div>Laster tjenester...</div>;
  }

  if (!settings || settings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <TestTube className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Ingen tjenester å teste</h3>
          <p className="text-muted-foreground text-center">
            Konfigurer først tjenester i Innstillinger-fanen for å teste tilkoblinger.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Test tilkoblingene til dine konfigurerte tjenester for å sikre at de fungerer korrekt.
      </div>

      <div className="grid gap-4">
        {settings.map((setting) => (
          <Card key={setting.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getServiceIcon(setting.service_type)}
                  <CardTitle className="text-base">
                    {getServiceName(setting.service_type)}
                  </CardTitle>
                  {setting.is_active ? (
                    <Badge variant="default" className="bg-green-500">Aktiv</Badge>
                  ) : (
                    <Badge variant="secondary">Inaktiv</Badge>
                  )}
                </div>
              </div>
              <CardDescription>
                {setting.folder_path || 'Ingen mappe spesifisert'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tjeneste-type:</span>
                  <span className="font-medium">{getServiceName(setting.service_type)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mappe:</span>
                  <span className="font-medium">{setting.folder_path || 'Rot-mappe'}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sist testet:</span>
                  <span className="font-medium">
                    {setting.last_sync_at ? (
                      new Date(setting.last_sync_at).toLocaleString('nb-NO')
                    ) : (
                      'Aldri'
                    )}
                  </span>
                </div>

                {setting.last_sync_status && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status:</span>
                    <div className="flex items-center space-x-2">
                      {setting.last_sync_status === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : setting.last_sync_status === 'error' ? (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      ) : (
                        <TestTube className="h-4 w-4 text-blue-500" />
                      )}
                      <span className="font-medium">
                        {setting.last_sync_status === 'success' ? 'Vellykket' : 
                         setting.last_sync_status === 'error' ? 'Feil' : 'Pågår'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {setting.last_sync_error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="text-sm font-medium text-red-800 mb-1">Siste feil:</div>
                  <div className="text-sm text-red-700">{setting.last_sync_error}</div>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => handleTestConnection(setting)}
                  disabled={testConnection.isPending || !setting.is_active}
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  {testConnection.isPending ? 'Tester...' : 'Test tilkobling'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};