import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Eye, RefreshCw, Palette, Layout, Activity, Sparkles, Zap, Settings, Monitor, Sliders } from 'lucide-react';
import { useDisplaySettings, useUpdateDisplaySettings, DisplaySettings as DisplaySettingsType } from '@/hooks/useDisplaySettings';
import { useDisplayRefreshBroadcast } from '@/hooks/useDisplayRefreshBroadcast';
import { useAuthStore } from '@/stores/authStore';
import LayoutBackgroundTab from '@/components/display-settings/LayoutBackgroundTab';
import ProductColorsTab from '@/components/display-settings/ProductColorsTab';
import StatusProgressTab from '@/components/display-settings/StatusProgressTab';
import ThemePresetsTab from '@/components/display-settings/ThemePresetsTab';
import AnimationSettingsTab from '@/components/display-settings/AnimationSettingsTab';
import GeneralSettingsTab from '@/components/display-settings/GeneralSettingsTab';
import SharedDisplaySettingsTab from '@/components/display-settings/SharedDisplaySettingsTab';
import AdvancedSettingsTab from '@/components/display-settings/AdvancedSettingsTab';
import DisplayPreview from '@/components/display-settings/DisplayPreview';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const DisplaySettings = () => {
  const { data: settings, isLoading } = useDisplaySettings();
  const updateSettings = useUpdateDisplaySettings();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const { broadcastRefresh } = useDisplayRefreshBroadcast(profile?.bakery_id);
  const [localSettings, setLocalSettings] = React.useState<DisplaySettingsType | null>(settings ?? null);

  React.useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleUpdate = (updates: Partial<DisplaySettingsType>) => {
    if (localSettings) {
      setLocalSettings({ ...localSettings, ...updates });
    }
  };

  const handleSave = () => {
    if (localSettings) {
      updateSettings.mutate(localSettings, {
        onSuccess: () => {
          toast({ 
            title: 'Lagret', 
            description: 'Innstillingene er oppdatert.' 
          });
          broadcastRefresh(); // Auto-refresh displays etter lagring
        },
        onError: () => {
          toast({ 
            title: 'Feil', 
            description: 'Kunne ikke lagre innstillinger.', 
            variant: 'destructive' 
          });
        }
      });
    }
  };

  const handlePreview = () => {
    navigate('/dashboard/display/shared');
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
            variant="outline" 
            onClick={broadcastRefresh}
            className="bg-orange-50 hover:bg-orange-100 text-orange-600 border-orange-300"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Oppdater alle displays
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
              <Tabs defaultValue="themes" className="space-y-6">
                <TabsList className="grid w-full grid-cols-8 gap-1">
                  <TabsTrigger value="themes" className="flex items-center space-x-1">
                    <Sparkles className="h-4 w-4" />
                    <span className="hidden sm:inline">Temaer</span>
                  </TabsTrigger>
                  <TabsTrigger value="general" className="flex items-center space-x-1">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Generelt</span>
                  </TabsTrigger>
                  <TabsTrigger value="shared" className="flex items-center space-x-1">
                    <Monitor className="h-4 w-4" />
                    <span className="hidden sm:inline">Felles</span>
                  </TabsTrigger>
                  <TabsTrigger value="layout" className="flex items-center space-x-1">
                    <Layout className="h-4 w-4" />
                    <span className="hidden sm:inline">Layout</span>
                  </TabsTrigger>
                  <TabsTrigger value="products" className="flex items-center space-x-1">
                    <Palette className="h-4 w-4" />
                    <span className="hidden sm:inline">Produkter</span>
                  </TabsTrigger>
                  <TabsTrigger value="status" className="flex items-center space-x-1">
                    <Activity className="h-4 w-4" />
                    <span className="hidden sm:inline">Status</span>
                  </TabsTrigger>
                  <TabsTrigger value="animations" className="flex items-center space-x-1">
                    <Zap className="h-4 w-4" />
                    <span className="hidden sm:inline">Animasjon</span>
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="flex items-center space-x-1">
                    <Sliders className="h-4 w-4" />
                    <span className="hidden sm:inline">Avansert</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="themes">
                  <ThemePresetsTab 
                    settings={localSettings} 
                    onUpdate={handleUpdate} 
                  />
                </TabsContent>

                <TabsContent value="general">
                  <GeneralSettingsTab 
                    settings={localSettings} 
                    onUpdate={handleUpdate} 
                  />
                </TabsContent>

                <TabsContent value="shared">
                  <SharedDisplaySettingsTab 
                    settings={localSettings} 
                    onUpdate={handleUpdate} 
                  />
                </TabsContent>

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

                <TabsContent value="animations">
                  <AnimationSettingsTab 
                    settings={localSettings} 
                    onUpdate={handleUpdate} 
                  />
                </TabsContent>

                <TabsContent value="advanced">
                  <AdvancedSettingsTab 
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
