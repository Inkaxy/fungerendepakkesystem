import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Monitor } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import SharedDisplaySettingsTab from './SharedDisplaySettingsTab';

interface CommonSettingsSectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const CommonSettingsSection = ({ settings, onUpdate }: CommonSettingsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Felles Innstillinger
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Innstillinger som gjelder for alle skjermstørrelser
        </p>
      </CardHeader>
      <CardContent>
        <SharedDisplaySettingsTab 
          settings={settings} 
          onUpdate={onUpdate} 
        />
      </CardContent>
    </Card>
  );
};

export default CommonSettingsSection;