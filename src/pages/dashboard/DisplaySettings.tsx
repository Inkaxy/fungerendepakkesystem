import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Save, Monitor, Users, Sparkles } from 'lucide-react';
import { useDisplaySettings, useUpdateDisplaySettings, DisplaySettings as DisplaySettingsType } from '@/hooks/useDisplaySettings';
import { useDisplayRefreshBroadcast } from '@/hooks/useDisplayRefreshBroadcast';
import { useAuthStore } from '@/stores/authStore';
import { useCustomers } from '@/hooks/useCustomers';
import SharedDisplayTab from '@/components/display-settings/tabs/SharedDisplayTab';
import CustomerDisplayTab from '@/components/display-settings/tabs/CustomerDisplayTab';
import DisplayPreviewPanel from '@/components/display-settings/DisplayPreviewPanel';
import PresetsManager from '@/components/display-settings/PresetsManager';
import SavePresetDialog from '@/components/display-settings/SavePresetDialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const DisplaySettings = () => {
  const { data: settings, isLoading } = useDisplaySettings();
  const { data: customers } = useCustomers();
  const updateSettings = useUpdateDisplaySettings();
  const { toast } = useToast();
  const { profile } = useAuthStore();
  // Bruk bakery_id fra faktiske settings (mer robust enn authStore ved init-race)
  const bakeryId = settings?.bakery_id ?? profile?.bakery_id;
  const { broadcastRefresh } = useDisplayRefreshBroadcast(bakeryId);
  const [localSettings, setLocalSettings] = React.useState<DisplaySettingsType | null>(settings ?? null);
  const [activeTab, setActiveTab] = React.useState<string>('shared');
  const [savePresetDialogOpen, setSavePresetDialogOpen] = React.useState(false);
  
  // Beregn antall kunder for delt visning (uten dedikert display)
  const sharedDisplayCustomerCount = React.useMemo(() => {
    return customers?.filter(c => !c.has_dedicated_display && c.status === 'active').length || 0;
  }, [customers]);

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

  const handleApplyPreset = (presetSettings: Partial<DisplaySettingsType>) => {
    if (localSettings) {
      setLocalSettings({ ...localSettings, ...presetSettings });
      toast({
        title: 'Mal anvendt',
        description: 'Husk å lagre endringene.',
      });
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

  if (isLoading || !localSettings) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Laster skjerminnstillinger...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Skjermvisning Innstillinger</h1>
            <p className="text-muted-foreground text-sm">
              Tilpass utseendet på dine skjermvisninger
            </p>
          </div>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={updateSettings.isPending}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Save className="h-4 w-4" />
          {updateSettings.isPending ? 'Lagrer...' : 'Lagre endringer'}
        </Button>
      </div>

      {/* Templates Manager */}
      <div className="mb-6">
        <PresetsManager
          onApplyPreset={handleApplyPreset}
          onOpenSaveDialog={() => setSavePresetDialogOpen(true)}
        />
      </div>

      {/* Save Preset Dialog */}
      {localSettings && (
        <SavePresetDialog
          open={savePresetDialogOpen}
          onOpenChange={setSavePresetDialogOpen}
          currentSettings={localSettings}
        />
      )}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-muted/50 rounded-lg">
          <TabsTrigger 
            value="shared" 
            className={cn(
              "flex items-center justify-center gap-2 h-10 rounded-md transition-all",
              "data-[state=active]:bg-background data-[state=active]:shadow-sm"
            )}
          >
            <Monitor className="h-4 w-4" />
            <span className="font-medium">Delt visning</span>
          </TabsTrigger>
          <TabsTrigger 
            value="customer" 
            className={cn(
              "flex items-center justify-center gap-2 h-10 rounded-md transition-all",
              "data-[state=active]:bg-background data-[state=active]:shadow-sm"
            )}
          >
            <Users className="h-4 w-4" />
            <span className="font-medium">Kundevisning</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shared" className="mt-6">
          <SharedDisplayTab 
            settings={localSettings} 
            onUpdate={handleUpdate}
            customerCount={sharedDisplayCustomerCount}
          />
        </TabsContent>

        <TabsContent value="customer" className="mt-6">
          <CustomerDisplayTab 
            settings={localSettings} 
            onUpdate={handleUpdate} 
          />
        </TabsContent>
      </Tabs>

      {/* Preview Panel at Bottom */}
      <div className="mt-8">
        <DisplayPreviewPanel 
          settings={localSettings} 
          displayType={activeTab === 'shared' ? 'shared' : 'customer'} 
        />
      </div>
    </div>
  );
};

export default DisplaySettings;
