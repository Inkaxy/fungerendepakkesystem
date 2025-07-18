import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateFileSyncSetting, FileSyncSetting } from '@/hooks/useFileSyncSettings';

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
  const [serviceConfig, setServiceConfig] = useState('{}');

  const updateSetting = useUpdateFileSyncSetting();

  useEffect(() => {
    if (setting) {
      setFolderPath(setting.folder_path || '');
      setDeleteAfterSync(setting.delete_after_sync);
      setIsActive(setting.is_active);
      setServiceConfig(JSON.stringify(setting.service_config, null, 2));
      
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let config = {};
      if (serviceConfig.trim()) {
        config = JSON.parse(serviceConfig);
      }

      const finalCron = scheduleCron === 'custom' ? customCron : scheduleCron;

      await updateSetting.mutateAsync({
        id: setting.id,
        service_config: config,
        folder_path: folderPath || undefined,
        schedule_cron: finalCron,
        delete_after_sync: deleteAfterSync,
        is_active: isActive,
      });

      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating sync setting:', error);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rediger {getServiceName()}-innstilling</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="submit" disabled={updateSetting.isPending}>
              {updateSetting.isPending ? 'Oppdaterer...' : 'Oppdater'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};