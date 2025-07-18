import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useUpdateFileSyncSetting, useTestConnection, FileSyncSetting } from '@/hooks/useFileSyncSettings';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { ServiceConfigForm } from './ServiceConfigForm';
import { FolderPathGuide } from './FolderPathGuide';
import { toast } from '@/hooks/use-toast';

interface EditFileSyncDialogProps {
  setting: FileSyncSetting;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const cronPresets = [
  { value: '0 8 * * *', label: 'Daglig kl. 08:00' },
  { value: '0 */6 * * *', label: 'Hver 6. time' },
  { value: '0 */2 * * *', label: 'Hver 2. time' },
  { value: '*/30 * * * *', label: 'Hver 30. minutt' },
  { value: '0 8 * * 1-5', label: 'Hverdager kl. 08:00' },
  { value: 'custom', label: 'Egendefinert' },
];

export const EditFileSyncDialog = ({ setting, open, onOpenChange }: EditFileSyncDialogProps) => {
  const [folderPath, setFolderPath] = useState('');
  const [scheduleCron, setScheduleCron] = useState('0 8 * * *');
  const [customCron, setCustomCron] = useState('');
  const [deleteAfterSync, setDeleteAfterSync] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [serviceConfig, setServiceConfig] = useState<any>({});
  const [connectionTested, setConnectionTested] = useState(false);

  const updateSetting = useUpdateFileSyncSetting();
  const testConnection = useTestConnection();

  useEffect(() => {
    if (setting) {
      setFolderPath(setting.folder_path || '');
      setDeleteAfterSync(setting.delete_after_sync);
      setIsActive(setting.is_active);
      setServiceConfig(setting.service_config || {});
      setConnectionTested(false);
      
      // Check if the cron is a preset or custom
      const preset = cronPresets.find(p => p.value === setting.schedule_cron);
      if (preset && preset.value !== 'custom') {
        setScheduleCron(preset.value);
        setCustomCron('');
      } else {
        setScheduleCron('custom');
        setCustomCron(setting.schedule_cron);
      }
    }
  }, [setting]);

  const handleTestConnection = async () => {
    if (!setting.service_type || Object.keys(serviceConfig).length === 0) {
      toast({
        title: "Manglende informasjon",
        description: "Fyll ut konfigurasjon før testing.",
        variant: "destructive"
      });
      return;
    }

    try {
      await testConnection.mutateAsync({
        service_type: setting.service_type,
        service_config: serviceConfig,
        folder_path: folderPath,
      } as any);
      
      setConnectionTested(true);
      toast({
        title: "Tilkobling vellykket!",
        description: "Tilkoblingen til tjenesten fungerer som forventet.",
      });
    } catch (error: any) {
      toast({
        title: "Tilkobling feilet",
        description: error.message || "Kunne ikke koble til tjenesten. Sjekk innstillingene dine.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const finalCron = scheduleCron === 'custom' ? customCron : scheduleCron;

      await updateSetting.mutateAsync({
        id: setting.id,
        service_config: serviceConfig,
        folder_path: folderPath || undefined,
        schedule_cron: finalCron,
        delete_after_sync: deleteAfterSync,
        is_active: isActive,
      });

      onOpenChange(false);
      toast({
        title: "Innstillinger oppdatert!",
        description: "Endringene i filhentingen er lagret.",
      });
    } catch (error: any) {
      console.error('Error updating sync setting:', error);
      toast({
        title: "Feil ved oppdatering",
        description: error.message || "Kunne ikke oppdatere innstillingen. Prøv igjen.",
        variant: "destructive"
      });
    }
  };

  const getServiceName = () => {
    switch (setting.service_type) {
      case 'onedrive':
        return 'OneDrive';
      case 'google_drive':
        return 'Google Drive';
      case 'ftp':
        return 'FTP';
      case 'sftp':
        return 'SFTP';
      default:
        return setting.service_type;
    }
  };

  const isConfigValid = () => {
    switch (setting.service_type) {
      case 'onedrive':
        return serviceConfig.client_id && serviceConfig.client_secret && serviceConfig.tenant_id;
      case 'google_drive':
        return serviceConfig.client_id && serviceConfig.client_secret;
      case 'ftp':
      case 'sftp':
        return serviceConfig.host && serviceConfig.username && serviceConfig.password;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rediger {getServiceName()}-innstilling</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ServiceConfigForm
            serviceType={setting.service_type}
            config={serviceConfig}
            onChange={(config) => {
              setServiceConfig(config);
              setConnectionTested(false);
            }}
          />

          <div className="space-y-2">
            <Label htmlFor="folder-path">Hvilken mappe skal søkes? (valgfritt)</Label>
            <Input
              id="folder-path"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
              placeholder="La stå tom for rot-mappen"
            />
            <FolderPathGuide serviceType={setting.service_type} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule">Hvor ofte skal filene hentes?</Label>
            <Select value={scheduleCron} onValueChange={setScheduleCron}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cronPresets.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {scheduleCron === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="custom-cron">Egendefinert tidsplan (cron-format)</Label>
              <Input
                id="custom-cron"
                value={customCron}
                onChange={(e) => setCustomCron(e.target.value)}
                placeholder="f.eks. 0 8 * * * (daglig kl. 08:00)"
                required
              />
              <p className="text-sm text-muted-foreground">
                Format: minutt time dag måned ukedag. <a href="https://crontab.guru/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Bruk crontab.guru for hjelp</a>
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="delete-after-sync">Slett filer etter vellykket henting</Label>
              <p className="text-sm text-muted-foreground">Fjerner filene fra kilden etter at de er hentet</p>
            </div>
            <Switch
              id="delete-after-sync"
              checked={deleteAfterSync}
              onCheckedChange={setDeleteAfterSync}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is-active">Aktiver automatisk henting</Label>
              <p className="text-sm text-muted-foreground">Start automatisk filhenting i henhold til tidsplanen</p>
            </div>
            <Switch
              id="is-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={!isConfigValid() || testConnection.isPending}
              className="w-full"
            >
              {testConnection.isPending ? (
                'Tester tilkobling...'
              ) : connectionTested ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Tilkobling testet - OK!</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Test tilkobling før lagring</span>
                </div>
              )}
            </Button>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Avbryt
            </Button>
            <Button 
              type="submit" 
              disabled={updateSetting.isPending || !isConfigValid()}
            >
              {updateSetting.isPending ? 'Oppdaterer...' : 'Oppdater innstillinger'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};