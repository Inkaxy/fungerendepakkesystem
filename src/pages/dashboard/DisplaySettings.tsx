
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Eye, Settings2, Palette, Activity } from 'lucide-react';
import { useDisplaySettings, useUpdateDisplaySettings } from '@/hooks/useDisplaySettings';
import GeneralSettingsTab from '@/components/display-settings/GeneralSettingsTab';
import ProductsSettingsTab from '@/components/display-settings/ProductsSettingsTab';
import StatusSettingsTab from '@/components/display-settings/StatusSettingsTab';
import ProgressSettingsTab from '@/components/display-settings/ProgressSettingsTab';
import DisplayPreview from '@/components/display-settings/DisplayPreview';
import { useToast } from '@/hooks/use-toast';

const DisplaySettings = () => {
  const { data: settings, isLoading } = useDisplaySettings();
  const updateSettings = useUpdateDisplaySettings();
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = React.useState(settings);

  React.useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleUpdate = (updates: any) => {
    if (localSettings) {
      setLocalSettings({ ...localSettings, ...updates });
    }
  };

  const handleSave = () => {
    if (localSettings) {
      updateSettings.mutate(localSettings);
    }
  };

  const handlePreview = () => {
    window.open('/display/shared', '_blank');
  };

  if (isLoading || !localSettings) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Laster pakkeskjerm-innstillinger...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Pakkeskjerm Innstillinger</h1>
          <p className="text-gray-600 mt-2">
            Tilpass utseendet og oppførselen til pakkeskjermene dine
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Forhåndsvis
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={updateSettings.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {updateSettings.isPending ? 'Lagrer...' : 'Lagre'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings2 className="h-5 w-5 mr-2" />
                Pakkeskjerm Tilpassinger
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general" className="flex items-center space-x-2">
                    <Settings2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Generelt</span>
                  </TabsTrigger>
                  <TabsTrigger value="products" className="flex items-center space-x-2">
                    <Palette className="h-4 w-4" />
                    <span className="hidden sm:inline">Produkter</span>
                  </TabsTrigger>
                  <TabsTrigger value="status" className="flex items-center space-x-2">
                    <Activity className="h-4 w-4" />
                    <span className="hidden sm:inline">Status</span>
                  </TabsTrigger>
                  <TabsTrigger value="progress" className="flex items-center space-x-2">
                    <Activity className="h-4 w-4" />
                    <span className="hidden sm:inline">Fremgang</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <GeneralSettingsTab 
                    settings={localSettings} 
                    onUpdate={handleUpdate} 
                  />
                </TabsContent>

                <TabsContent value="products">
                  <ProductsSettingsTab 
                    settings={localSettings} 
                    onUpdate={handleUpdate} 
                  />
                </TabsContent>

                <TabsContent value="status">
                  <StatusSettingsTab 
                    settings={localSettings} 
                    onUpdate={handleUpdate} 
                  />
                </TabsContent>

                <TabsContent value="progress">
                  <ProgressSettingsTab 
                    settings={localSettings} 
                    onUpdate={handleUpdate} 
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <DisplayPreview settings={localSettings} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplaySettings;
