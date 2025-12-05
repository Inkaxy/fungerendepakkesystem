import React, { useState, useEffect } from 'react';
import { FolderOpen, Clock, Save, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOneDriveImportConfig, useUpdateImportConfig } from '@/hooks/useOneDriveConnection';

const TIME_PRESETS = [
  { value: '04:00', label: '04:00' },
  { value: '05:00', label: '05:00' },
  { value: '05:30', label: '05:30' },
  { value: '06:00', label: '06:00' },
  { value: '06:30', label: '06:30' },
  { value: '07:00', label: '07:00' },
];

const OneDriveImportConfigCard: React.FC = () => {
  const { data: config, isLoading } = useOneDriveImportConfig();
  const updateConfig = useUpdateImportConfig();

  const [folderPath, setFolderPath] = useState('/Pakkesystem');
  const [filePattern, setFilePattern] = useState('*.PRD,*.CUS,*.OD0');
  const [scheduledTime, setScheduledTime] = useState('06:00');
  const [isAutoEnabled, setIsAutoEnabled] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form with existing config
  useEffect(() => {
    if (config) {
      setFolderPath(config.folder_path || '/Pakkesystem');
      setFilePattern(config.file_pattern || '*.PRD,*.CUS,*.OD0');
      setScheduledTime(config.scheduled_time || '06:00');
      setIsAutoEnabled(config.is_auto_enabled || false);
      setHasChanges(false);
    }
  }, [config]);

  const handleSave = async () => {
    await updateConfig.mutateAsync({
      folder_path: folderPath,
      file_pattern: filePattern,
      scheduled_time: scheduledTime,
      is_auto_enabled: isAutoEnabled,
    });
    setHasChanges(false);
  };

  const handleChange = () => {
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Import-innstillinger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Import-innstillinger
        </CardTitle>
        <CardDescription>
          Konfigurer hvilken mappe og hvilke filer som skal importeres fra OneDrive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Folder Path */}
        <div className="space-y-2">
          <Label htmlFor="folderPath">Mappesti i OneDrive</Label>
          <Input
            id="folderPath"
            value={folderPath}
            onChange={(e) => { setFolderPath(e.target.value); handleChange(); }}
            placeholder="/Pakkesystem"
          />
          <p className="text-xs text-muted-foreground">
            Relativ sti fra roten av OneDrive, f.eks. /Pakkesystem eller /Bakeri/Filer
          </p>
        </div>

        {/* File Pattern */}
        <div className="space-y-2">
          <Label htmlFor="filePattern">Filtyper</Label>
          <Input
            id="filePattern"
            value={filePattern}
            onChange={(e) => { setFilePattern(e.target.value); handleChange(); }}
            placeholder="*.PRD,*.CUS,*.OD0"
          />
          <p className="text-xs text-muted-foreground">
            Kommaseparert liste over filtyper som skal inkluderes
          </p>
        </div>

        {/* Scheduled Time */}
        <div className="space-y-2">
          <Label htmlFor="scheduledTime" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Tidspunkt for automatisk import
          </Label>
          <Select 
            value={scheduledTime} 
            onValueChange={(value) => { setScheduledTime(value); handleChange(); }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Velg tidspunkt" />
            </SelectTrigger>
            <SelectContent>
              {TIME_PRESETS.map((preset) => (
                <SelectItem key={preset.value} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Filer vil importeres automatisk hver dag på dette tidspunktet (norsk tid)
          </p>
        </div>

        {/* Auto Import Toggle */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="autoImport">Automatisk import</Label>
            <p className="text-xs text-muted-foreground">
              Aktiver daglig automatisk import fra OneDrive
            </p>
          </div>
          <Switch
            id="autoImport"
            checked={isAutoEnabled}
            onCheckedChange={(checked) => { setIsAutoEnabled(checked); handleChange(); }}
          />
        </div>

        {/* Last Import Status */}
        {config?.last_import_at && (
          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <p className="text-muted-foreground">
              Siste import: {new Date(config.last_import_at).toLocaleString('nb-NO')}
              {config.last_import_status && (
                <span className={`ml-2 ${config.last_import_status === 'success' ? 'text-green-600' : 'text-destructive'}`}>
                  ({config.last_import_status === 'success' ? 'Vellykket' : 'Feilet'})
                </span>
              )}
            </p>
          </div>
        )}

        {/* Save Button */}
        <Button 
          onClick={handleSave} 
          disabled={!hasChanges || updateConfig.isPending}
          className="w-full"
        >
          {updateConfig.isPending ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Lagre innstillinger
        </Button>
      </CardContent>
    </Card>
  );
};

export default OneDriveImportConfigCard;
