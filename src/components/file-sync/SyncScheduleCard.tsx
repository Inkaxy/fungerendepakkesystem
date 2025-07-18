import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useFileSyncSettings, useUpdateFileSyncSetting, useTriggerSync } from '@/hooks/useFileSyncSettings';
import { Clock, Play, Pause } from 'lucide-react';

const getCronDescription = (cron: string) => {
  switch (cron) {
    case '0 8 * * *':
      return 'Daglig kl. 08:00';
    case '0 */6 * * *':
      return 'Hver 6. time';
    case '0 */2 * * *':
      return 'Hver 2. time';
    case '*/30 * * * *':
      return 'Hver 30. minutt';
    case '0 8 * * 1-5':
      return 'Hverdager kl. 08:00';
    default:
      return `Egendefinert: ${cron}`;
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

export const SyncScheduleCard = () => {
  const { data: settings, isLoading } = useFileSyncSettings();
  const updateSetting = useUpdateFileSyncSetting();
  const triggerSync = useTriggerSync();

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await updateSetting.mutateAsync({ id, is_active: isActive });
  };

  const handleTriggerSync = async (settingId: string) => {
    await triggerSync.mutateAsync(settingId);
  };

  if (isLoading) {
    return <div>Laster tidsplaner...</div>;
  }

  if (!settings || settings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Clock className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Ingen synkroniseringstidsplaner</h3>
          <p className="text-muted-foreground text-center">
            Konfigurer først tjenester i Innstillinger-fanen for å se tidsplaner her.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {settings.map((setting) => (
          <Card key={setting.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <CardTitle className="text-base">
                    {getServiceName(setting.service_type)}
                  </CardTitle>
                  {setting.is_active ? (
                    <Badge variant="default" className="bg-green-500">Aktiv</Badge>
                  ) : (
                    <Badge variant="secondary">Inaktiv</Badge>
                  )}
                </div>
                <Switch
                  checked={setting.is_active}
                  onCheckedChange={(checked) => handleToggleActive(setting.id, checked)}
                />
              </div>
              <CardDescription>
                {setting.folder_path || 'Ingen mappe spesifisert'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground mb-1">Tidsplan</div>
                  <div className="font-medium">{getCronDescription(setting.schedule_cron)}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-1">
                    {setting.schedule_cron}
                  </div>
                </div>
                
                <div>
                  <div className="text-muted-foreground mb-1">Sist kjørt</div>
                  <div className="font-medium">
                    {setting.last_sync_at ? (
                      new Date(setting.last_sync_at).toLocaleString('nb-NO')
                    ) : (
                      'Aldri'
                    )}
                  </div>
                  {setting.last_sync_status && (
                    <div className="text-xs mt-1">
                      Status: {setting.last_sync_status === 'success' ? 'Vellykket' : 
                               setting.last_sync_status === 'error' ? 'Feil' : 'Pågår'}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTriggerSync(setting.id)}
                  disabled={triggerSync.isPending}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Kjør nå
                </Button>
                
                {setting.delete_after_sync && (
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    Sletter filer
                  </Badge>
                )}
              </div>

              {setting.last_sync_error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="text-sm font-medium text-red-800 mb-1">Siste feil:</div>
                  <div className="text-sm text-red-700">{setting.last_sync_error}</div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};