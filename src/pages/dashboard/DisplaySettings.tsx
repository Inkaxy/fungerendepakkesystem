import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Eye, Tablet, Tv, Settings, Archive } from 'lucide-react';
import { useDisplaySettings, useUpdateDisplaySettings, ScreenType } from '@/hooks/useDisplaySettings';
import SmallScreenSection from '@/components/display-settings/SmallScreenSection';
import LargeScreenSection from '@/components/display-settings/LargeScreenSection';
import CommonSettingsSection from '@/components/display-settings/CommonSettingsSection';
import SavedPresetsSection from '@/components/display-settings/SavedPresetsSection';
import DisplayPreview from '@/components/display-settings/DisplayPreview';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const DisplaySettings = () => {
  const [activeTab, setActiveTab] = React.useState<ScreenType>('small');
  const { data: settings, isLoading } = useDisplaySettings(activeTab);
  const updateSettings = useUpdateDisplaySettings(activeTab);
  const { toast } = useToast();
  const navigate = useNavigate();
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
    navigate('/display/shared');
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
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ScreenType)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="small" className="flex items-center space-x-2">
                <Tablet className="h-4 w-4" />
                <span>Små Skjermer</span>
              </TabsTrigger>
              <TabsTrigger value="large" className="flex items-center space-x-2">
                <Tv className="h-4 w-4" />
                <span>Store Skjermer</span>
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Felles Innstillinger</span>
              </TabsTrigger>
              <TabsTrigger value="saved-presets" className="flex items-center space-x-2">
                <Archive className="h-4 w-4" />
                <span>Lagrede Oppsett</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="small">
              <SmallScreenSection 
                settings={localSettings} 
                onUpdate={handleUpdate} 
              />
            </TabsContent>

            <TabsContent value="large">
              <LargeScreenSection 
                settings={localSettings} 
                onUpdate={handleUpdate} 
              />
            </TabsContent>

            <TabsContent value="shared">
              <CommonSettingsSection 
                settings={localSettings} 
                onUpdate={handleUpdate} 
              />
            </TabsContent>

            <TabsContent value="saved-presets">
              <SavedPresetsSection 
                settings={localSettings} 
                onUpdate={handleUpdate} 
              />
            </TabsContent>
          </Tabs>
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
