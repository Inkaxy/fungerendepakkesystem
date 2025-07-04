import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tablet, Palette, Settings, Layout, Activity, Zap } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import SmallScreenThemesTab from './SmallScreenThemesTab';
import GeneralSettingsTab from './GeneralSettingsTab';
import LayoutBackgroundTab from './LayoutBackgroundTab';
import ProductColorsTab from './ProductColorsTab';
import StatusProgressTab from './StatusProgressTab';
import AnimationSettingsTab from './AnimationSettingsTab';

interface SmallScreenSectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const SmallScreenSection = ({ settings, onUpdate }: SmallScreenSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Tablet className="h-5 w-5 mr-2" />
          Små Skjermer (10" - 24")
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Optimalisert for tablets, laptops og mindre monitorer
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="themes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="themes" className="flex items-center space-x-1">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Temaer</span>
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center space-x-1">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Generelt</span>
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
          </TabsList>

          <TabsContent value="themes">
            <SmallScreenThemesTab 
              settings={settings} 
              onUpdate={onUpdate} 
            />
          </TabsContent>

          <TabsContent value="general">
            <GeneralSettingsTab 
              settings={settings} 
              onUpdate={onUpdate} 
            />
          </TabsContent>

          <TabsContent value="layout">
            <LayoutBackgroundTab 
              settings={settings} 
              onUpdate={onUpdate} 
            />
          </TabsContent>

          <TabsContent value="products">
            <ProductColorsTab 
              settings={settings} 
              onUpdate={onUpdate} 
            />
          </TabsContent>

          <TabsContent value="status">
            <StatusProgressTab 
              settings={settings} 
              onUpdate={onUpdate} 
            />
          </TabsContent>

          <TabsContent value="animations">
            <AnimationSettingsTab 
              settings={settings} 
              onUpdate={onUpdate} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SmallScreenSection;