import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useCreateFileSyncSetting } from '@/hooks/useFileSyncSettings';
import { Cloud, HardDrive, Server } from 'lucide-react';

interface CreateFileSyncDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const serviceTypes = [
  { value: 'onedrive', label: 'OneDrive', icon: Cloud },
  { value: 'google_drive', label: 'Google Drive', icon: HardDrive },
  { value: 'ftp', label: 'FTP', icon: Server },
  { value: 'sftp', label: 'SFTP', icon: Server },
];

const cronPresets = [
  { value: '0 8 * * *', label: 'Daglig kl. 08:00' },
  { value: '0 */6 * * *', label: 'Hver 6. time' },
  { value: '0 */2 * * *', label: 'Hver 2. time' },
  { value: '*/30 * * * *', label: 'Hver 30. minutt' },
  { value: '0 8 * * 1-5', label: 'Hverdager kl. 08:00' },
  { value: 'custom', label: 'Egendefinert' },
];

export const CreateFileSyncDialog = ({ open, onOpenChange }: CreateFileSyncDialogProps) => {
  const [serviceType, setServiceType] = useState<string>('');
  const [folderPath, setFolderPath] = useState('');
  const [scheduleCron, setScheduleCron] = useState('0 8 * * *');
  const [customCron, setCustomCron] = useState('');
  const [deleteAfterSync, setDeleteAfterSync] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [serviceConfig, setServiceConfig] = useState('{}');

  const createSetting = useCreateFileSyncSetting();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let config = {};
      if (serviceConfig.trim()) {
        config = JSON.parse(serviceConfig);
      }

      const finalCron = scheduleCron === 'custom' ? customCron : scheduleCron;

      await createSetting.mutateAsync({
        service_type: serviceType as any,
        service_config: config,
        folder_path: folderPath || undefined,
        schedule_cron: finalCron,
        delete_after_sync: deleteAfterSync,
        is_active: isActive,
      });

      // Reset form
      setServiceType('');
      setFolderPath('');
      setScheduleCron('0 8 * * *');
      setCustomCron('');
      setDeleteAfterSync(false);
      setIsActive(true);
      setServiceConfig('{}');
      
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error creating sync setting:', error);
    }
  };

  const getConfigPlaceholder = () => {
    switch (serviceType) {
      case 'onedrive':
        return `{
  "client_id": "din-client-id",
  "client_secret": "din-client-secret",
  "tenant_id": "din-tenant-id"
}`;
      case 'google_drive':
        return `{
  "client_id": "din-client-id",
  "client_secret": "din-client-secret",
  "redirect_uri": "urn:ietf:wg:oauth:2.0:oob"
}`;
      case 'ftp':
      case 'sftp':
        return `{
  "host": "ftp.example.com",
  "port": 21,
  "username": "bruker",
  "password": "passord"
}`;
      default:
        return '{}';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Legg til ny fil-tjeneste</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service-type">Tjeneste-type</Label>
            <Select value={serviceType} onValueChange={setServiceType} required>
              <SelectTrigger>
                <SelectValue placeholder="Velg tjeneste" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((service) => {
                  const Icon = service.icon;
                  return (
                    <SelectItem key={service.value} value={service.value}>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{service.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="folder-path">Mappe-sti</Label>
            <Input
              id="folder-path"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
              placeholder="/path/to/files eller Documents/Files"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule">Tidsplan</Label>
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
              <Label htmlFor="custom-cron">Egendefinert cron</Label>
              <Input
                id="custom-cron"
                value={customCron}
                onChange={(e) => setCustomCron(e.target.value)}
                placeholder="0 8 * * *"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="service-config">Tjeneste-konfigurasjon (JSON)</Label>
            <Textarea
              id="service-config"
              value={serviceConfig}
              onChange={(e) => setServiceConfig(e.target.value)}
              placeholder={getConfigPlaceholder()}
              rows={6}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="delete-after-sync">Slett filer etter henting</Label>
            <Switch
              id="delete-after-sync"
              checked={deleteAfterSync}
              onCheckedChange={setDeleteAfterSync}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is-active">Aktiv</Label>
            <Switch
              id="is-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Avbryt
            </Button>
            <Button type="submit" disabled={createSetting.isPending}>
              {createSetting.isPending ? 'Oppretter...' : 'Opprett'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};