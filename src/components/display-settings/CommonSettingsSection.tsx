import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Type, Activity } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import SharedDisplaySettingsTab from './SharedDisplaySettingsTab';
import TypographySettingsTab from './TypographySettingsTab';
import InteractivitySettingsTab from './InteractivitySettingsTab';

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
        <Tabs defaultValue="shared" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="shared" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Delte innstillinger</span>
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center space-x-2">
              <Type className="h-4 w-4" />
              <span>Typografi</span>
            </TabsTrigger>
            <TabsTrigger value="interactivity" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Interaktivitet</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shared">
            <SharedDisplaySettingsTab 
              settings={settings} 
              onUpdate={onUpdate} 
            />
          </TabsContent>

          <TabsContent value="typography">
            <TypographySettingsTab 
              settings={settings} 
              onUpdate={onUpdate} 
            />
          </TabsContent>

          <TabsContent value="interactivity">
            <InteractivitySettingsTab 
              settings={settings} 
              onUpdate={onUpdate} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CommonSettingsSection;