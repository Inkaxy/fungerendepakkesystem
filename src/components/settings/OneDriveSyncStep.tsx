import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, FolderOpen, Clock, RefreshCw, Save } from 'lucide-react';
import { useOneDriveSyncSettings } from '@/hooks/useOneDriveSyncSettings';
import TimePickerPresets from './TimePickerPresets';

interface OneDriveSyncStepProps {
  disabled?: boolean;
}

const OneDriveSyncStep: React.FC<OneDriveSyncStepProps> = ({ disabled }) => {
  const {
    settings,
    isLoading,
    scheduleTime,
    folderPath,
    isActive,
    updateSettings,
    isUpdating,
    triggerSync,
    isSyncing,
  } = useOneDriveSyncSettings();

  const [localFolderPath, setLocalFolderPath] = useState(folderPath);
  const [localScheduleTime, setLocalScheduleTime] = useState(scheduleTime);
  const [localIsActive, setLocalIsActive] = useState(isActive);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync local state with fetched data
  useEffect(() => {
    setLocalFolderPath(folderPath);
    setLocalScheduleTime(scheduleTime);
    setLocalIsActive(isActive);
    setHasChanges(false);
  }, [folderPath, scheduleTime, isActive]);

  // Detect changes
  useEffect(() => {
    const changed = 
      localFolderPath !== folderPath ||
      localScheduleTime !== scheduleTime ||
      localIsActive !== isActive;
    setHasChanges(changed);
  }, [localFolderPath, localScheduleTime, localIsActive, folderPath, scheduleTime, isActive]);

  const handleSave = () => {
    updateSettings({
      folder_path: localFolderPath,
      schedule_time: localScheduleTime,
      is_active: localIsActive,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Step Header */}
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center h-8 w-8 rounded-full font-semibold text-sm ${
          disabled ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'
        }`}>
          2
        </div>
        <div>
          <h3 className="font-semibold">Konfigurer synkronisering</h3>
          <p className="text-sm text-muted-foreground">
            Velg mappe og tidspunkt for automatisk import
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <div className="ml-11 space-y-6">
        {/* Folder Path */}
        <div className="space-y-2">
          <Label htmlFor="folder-path" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            OneDrive-mappe
          </Label>
          <Input
            id="folder-path"
            value={localFolderPath}
            onChange={(e) => setLocalFolderPath(e.target.value)}
            placeholder="/Pakkesystem"
            disabled={disabled}
          />
          <p className="text-xs text-muted-foreground">
            Sti til mappen i OneDrive som inneholder .PRD, .CUS og .OD0 filer
          </p>
        </div>

        {/* Schedule Time */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Tidspunkt for daglig synkronisering
          </Label>
          <TimePickerPresets
            value={localScheduleTime}
            onChange={setLocalScheduleTime}
            disabled={disabled}
          />
        </div>

        {/* Auto Sync Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="space-y-0.5">
            <Label htmlFor="auto-sync">Automatisk synkronisering</Label>
            <p className="text-sm text-muted-foreground">
              Importer filer automatisk hver dag på valgt tidspunkt
            </p>
          </div>
          <Switch
            id="auto-sync"
            checked={localIsActive}
            onCheckedChange={setLocalIsActive}
            disabled={disabled}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleSave}
            disabled={disabled || isUpdating || !hasChanges}
            className="gap-2"
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Lagre innstillinger
          </Button>

          <Button
            variant="outline"
            onClick={() => triggerSync()}
            disabled={disabled || isSyncing}
            className="gap-2"
          >
            {isSyncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Synkroniser nå
          </Button>
        </div>

        {/* Last sync info */}
        {settings?.last_sync_at && (
          <div className="text-sm text-muted-foreground">
            Siste synkronisering:{' '}
            {new Date(settings.last_sync_at).toLocaleString('nb-NO')}
            {settings.last_sync_status && (
              <span className={`ml-2 ${
                settings.last_sync_status === 'success' ? 'text-green-600' :
                settings.last_sync_status === 'error' ? 'text-destructive' :
                'text-yellow-600'
              }`}>
                ({settings.last_sync_status === 'success' ? 'Vellykket' :
                  settings.last_sync_status === 'error' ? 'Feilet' : 'Delvis'})
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OneDriveSyncStep;
