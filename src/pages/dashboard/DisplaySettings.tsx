
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Eye, Palette, Layout, Activity } from 'lucide-react';
import { useDisplaySettings, useUpdateDisplaySettings } from '@/hooks/useDisplaySettings';
import LayoutBackgroundTab from '@/components/display-settings/LayoutBackgroundTab';
import ProductColorsTab from '@/components/display-settings/ProductColorsTab';
import StatusProgressTab from '@/components/display-settings/StatusProgressTab';
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
          <h1 className="text-3xl font-bold">Pakkeskjerm Tilpassinger</h1>
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
                <Palette className="h-5 w-5 mr-2" />
                Pakkeskjerm Tilpassinger
              </CardTitle>
              <p className="text-sm text-gray-600">
                Organisert i logiske kategorier for enkel tilpasning
              </p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="layout" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="layout" className="flex items-center space-x-2">
                    <Layout className="h-4 w-4" />
                    <span className="hidden sm:inline">Layout & Bakgrunn</span>
                  </TabsTrigger>
                  <TabsTrigger value="products" className="flex items-center space-x-2">
                    <Palette className="h-4 w-4" />
                    <span className="hidden sm:inline">Produkter & Farger</span>
                  </TabsTrigger>
                  <TabsTrigger value="status" className="flex items-center space-x-2">
                    <Activity className="h-4 w-4" />
                    <span className="hidden sm:inline">Status & Fremgang</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="layout">
                  <LayoutBackgroundTab 
                    settings={localSettings} 
                    onUpdate={handleUpdate} 
                  />
                </TabsContent>

                <TabsContent value="products">
                  <ProductColorsTab 
                    settings={localSettings} 
                    onUpdate={handleUpdate} 
                  />
                </TabsContent>

                <TabsContent value="status">
                  <StatusProgressTab 
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
