import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tv, Palette, Settings, Layout, Activity, Zap, Monitor } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import LargeScreenThemesTab from './LargeScreenThemesTab';
import LargeScreenTab from './LargeScreenTab';
import LayoutBackgroundTab from './LayoutBackgroundTab';
import ProductColorsTab from './ProductColorsTab';
import StatusProgressTab from './StatusProgressTab';
import AnimationSettingsTab from './AnimationSettingsTab';
import ResponsivenessTab from './ResponsivenessTab';

interface LargeScreenSectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const LargeScreenSection = ({ settings, onUpdate }: LargeScreenSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Tv className="h-5 w-5 mr-2" />
          Store Skjermer (32" - 65"+)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Optimalisert for TV-skjermer og store monitorer med avstandslesing
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="themes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-8">
            <TabsTrigger value="themes" className="flex items-center space-x-1">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Temaer</span>
            </TabsTrigger>
            <TabsTrigger value="screen-config" className="flex items-center space-x-1">
              <Monitor className="h-4 w-4" />
              <span className="hidden sm:inline">Skjerm</span>
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center space-x-1">
              <Layout className="h-4 w-4" />
              <span className="hidden sm:inline">Layout</span>
            </TabsTrigger>
            <TabsTrigger value="responsiveness" className="flex items-center space-x-1">
              <Tv className="h-4 w-4" />
              <span className="hidden sm:inline">Responsivitet</span>
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
            <LargeScreenThemesTab 
              settings={settings} 
              onUpdate={onUpdate} 
            />
          </TabsContent>

          <TabsContent value="screen-config">
            <LargeScreenTab 
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

          <TabsContent value="responsiveness">
            <ResponsivenessTab 
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

export default LargeScreenSection;