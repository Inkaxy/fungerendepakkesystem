import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Save, Eye, RefreshCw, Monitor, User } from 'lucide-react';
import { useDisplaySettings, useUpdateDisplaySettings, DisplaySettings as DisplaySettingsType } from '@/hooks/useDisplaySettings';
import { useDisplayRefreshBroadcast } from '@/hooks/useDisplayRefreshBroadcast';
import { useAuthStore } from '@/stores/authStore';
import SharedDisplayTab from '@/components/display-settings/tabs/SharedDisplayTab';
import CustomerDisplayTab from '@/components/display-settings/tabs/CustomerDisplayTab';
import DisplayPreview from '@/components/display-settings/DisplayPreview';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const DisplaySettings = () => {
  const { data: settings, isLoading } = useDisplaySettings();
  const updateSettings = useUpdateDisplaySettings();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const { broadcastRefresh } = useDisplayRefreshBroadcast(profile?.bakery_id);
  const [localSettings, setLocalSettings] = React.useState<DisplaySettingsType | null>(settings ?? null);
  const [activeTab, setActiveTab] = React.useState<string>('shared');

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
          broadcastRefresh();
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
    if (activeTab === 'shared') {
      navigate('/dashboard/display/shared');
    } else {
      // For customer display, we'd need a specific customer URL
      navigate('/dashboard/display/shared');
    }
  };

  if (isLoading || !localSettings) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Laster pakkeskjerm-innstillinger...</p>
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
          <h1 className="text-3xl font-bold">Pakkeskjerm Tilpasninger</h1>
          <p className="text-muted-foreground mt-2">
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted/50">
              <TabsTrigger 
                value="shared" 
                className={cn(
                  "flex items-center gap-3 py-4 px-6 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900",
                  "transition-all duration-200"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  activeTab === 'shared' ? 'bg-blue-200' : 'bg-muted'
                )}>
                  <Monitor className={cn(
                    "h-5 w-5",
                    activeTab === 'shared' ? 'text-blue-700' : 'text-muted-foreground'
                  )} />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Felles Skjerm</div>
                  <div className="text-xs text-muted-foreground">
                    Oversikt for alle kunder
                  </div>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="customer" 
                className={cn(
                  "flex items-center gap-3 py-4 px-6 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900",
                  "transition-all duration-200"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  activeTab === 'customer' ? 'bg-purple-200' : 'bg-muted'
                )}>
                  <User className={cn(
                    "h-5 w-5",
                    activeTab === 'customer' ? 'text-purple-700' : 'text-muted-foreground'
                  )} />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Kundeskjerm</div>
                  <div className="text-xs text-muted-foreground">
                    Individuell kundevisning
                  </div>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shared" className="mt-6">
              <SharedDisplayTab 
                settings={localSettings} 
                onUpdate={handleUpdate} 
              />
            </TabsContent>

            <TabsContent value="customer" className="mt-6">
              <CustomerDisplayTab 
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
