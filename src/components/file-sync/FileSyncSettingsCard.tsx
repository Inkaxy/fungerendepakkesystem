import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  useFileSyncSettings, 
  useUpdateFileSyncSetting, 
  useDeleteFileSyncSetting 
} from '@/hooks/useFileSyncSettings';
import { CreateFileSyncDialog } from './CreateFileSyncDialog';
import { EditFileSyncDialog } from './EditFileSyncDialog';
import { Trash2, Edit, Plus, Cloud, HardDrive, Server } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

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

const getStatusBadge = (status?: string) => {
  switch (status) {
    case 'success':
      return <Badge variant="default" className="bg-green-500">Vellykket</Badge>;
    case 'error':
      return <Badge variant="destructive">Feil</Badge>;
    case 'in_progress':
      return <Badge variant="secondary">Pågår</Badge>;
    default:
      return <Badge variant="outline">Aldri kjørt</Badge>;
  }
};

export const FileSyncSettingsCard = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingSetting, setEditingSetting] = useState<any>(null);
  
  const { data: settings, isLoading } = useFileSyncSettings();
  const updateSetting = useUpdateFileSyncSetting();
  const deleteSetting = useDeleteFileSyncSetting();

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await updateSetting.mutateAsync({ id, is_active: isActive });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Er du sikker på at du vil slette denne innstillingen?')) {
      await deleteSetting.mutateAsync(id);
    }
  };

  if (isLoading) {
    return <div>Laster innstillinger...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Konfigurerte tjenester</h3>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Legg til tjeneste
        </Button>
      </div>

      {!settings || settings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Cloud className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ingen tjenester konfigurert</h3>
            <p className="text-muted-foreground text-center mb-4">
              Kom i gang ved å legge til din første fil-tjeneste for automatisk henting.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Legg til tjeneste
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {settings.map((setting) => (
            <Card key={setting.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getServiceIcon(setting.service_type)}
                    <CardTitle className="text-base">
                      {getServiceName(setting.service_type)}
                    </CardTitle>
                  </div>
                  <Switch
                    checked={setting.is_active}
                    onCheckedChange={(checked) => handleToggleActive(setting.id, checked)}
                  />
                </div>
                <CardDescription className="text-sm">
                  {setting.folder_path || 'Ingen mappe spesifisert'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    {getStatusBadge(setting.last_sync_status)}
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tidsplan:</span>
                    <span className="font-mono text-xs">{setting.schedule_cron}</span>
                  </div>

                  {setting.last_sync_at && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sist kjørt:</span>
                      <span className="text-xs">
                        {format(new Date(setting.last_sync_at), 'dd.MM.yyyy HH:mm', { locale: nb })}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Slett filer:</span>
                    <span className="text-xs">
                      {setting.delete_after_sync ? 'Ja' : 'Nei'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingSetting(setting)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(setting.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateFileSyncDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      {editingSetting && (
        <EditFileSyncDialog
          setting={editingSetting}
          open={!!editingSetting}
          onOpenChange={(open) => !open && setEditingSetting(null)}
        />
      )}
    </div>
  );
};