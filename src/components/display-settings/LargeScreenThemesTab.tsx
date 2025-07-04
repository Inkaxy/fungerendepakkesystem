import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tv, Presentation } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface LargeScreenThemesTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const largeScreenThemes = {
  tvDistance: {
    name: 'TV Avstand',
    icon: Tv,
    description: 'Optimalisert for 32-43" TV-skjermer og avstandslesing',
    settings: {
      background_type: 'gradient' as const,
      background_gradient_start: '#f8fafc',
      background_gradient_end: '#e2e8f0',
      product_1_bg_color: '#ffffff',
      product_2_bg_color: '#f1f5f9',
      product_3_bg_color: '#e2e8f0',
      product_1_text_color: '#0f172a',
      product_2_text_color: '#1e293b',
      product_3_text_color: '#334155',
      product_1_accent_color: '#3b82f6',
      product_2_accent_color: '#10b981',
      product_3_accent_color: '#f59e0b',
      progress_bar_color: '#3b82f6',
      header_text_color: '#0f172a',
      text_color: '#1e293b',
      header_font_size: 40,
      body_font_size: 18,
      status_indicator_font_size: 32,
      status_indicator_padding: 28,
      spacing: 20,
      customer_cards_columns: 4,
      screen_size_preset: '32inch' as const,
      large_screen_optimization: true,
    }
  },
  largeTv: {
    name: 'Store TV',
    icon: Tv,
    description: 'For 50-65"+ TV-skjermer med maksimal lesbarhet',
    settings: {
      background_type: 'gradient' as const,
      background_gradient_start: '#f8fafc',
      background_gradient_end: '#e2e8f0',
      product_1_bg_color: '#ffffff',
      product_2_bg_color: '#f1f5f9',
      product_3_bg_color: '#e2e8f0',
      product_1_text_color: '#0f172a',
      product_2_text_color: '#1e293b',
      product_3_text_color: '#334155',
      product_1_accent_color: '#3b82f6',
      product_2_accent_color: '#10b981',
      product_3_accent_color: '#f59e0b',
      progress_bar_color: '#3b82f6',
      header_text_color: '#0f172a',
      text_color: '#1e293b',
      header_font_size: 56,
      body_font_size: 24,
      status_indicator_font_size: 40,
      status_indicator_padding: 36,
      spacing: 28,
      customer_cards_columns: 6,
      screen_size_preset: '65inch' as const,
      large_screen_optimization: true,
    }
  },
  digitalSignage: {
    name: 'Digital Signage',
    icon: Presentation,
    description: 'Profesjonelt for digital skiltning og store installasjoner',
    settings: {
      background_type: 'gradient' as const,
      background_gradient_start: '#fafafa',
      background_gradient_end: '#f4f4f5',
      product_1_bg_color: '#ffffff',
      product_2_bg_color: '#fafafa',
      product_3_bg_color: '#f4f4f5',
      product_1_text_color: '#18181b',
      product_2_text_color: '#27272a',
      product_3_text_color: '#3f3f46',
      product_1_accent_color: '#6366f1',
      product_2_accent_color: '#8b5cf6',
      product_3_accent_color: '#06b6d4',
      progress_bar_color: '#6366f1',
      header_text_color: '#09090b',
      text_color: '#18181b',
      header_font_size: 48,
      body_font_size: 22,
      status_indicator_font_size: 36,
      status_indicator_padding: 32,
      spacing: 24,
      customer_cards_columns: 5,
      screen_size_preset: '55inch' as const,
      large_screen_optimization: true,
      border_radius: 12,
      card_shadow_intensity: 2,
    }
  }
};

const LargeScreenThemesTab = ({ settings, onUpdate }: LargeScreenThemesTabProps) => {
  const applyTheme = (themeKey: string) => {
    const theme = largeScreenThemes[themeKey as keyof typeof largeScreenThemes];
    if (theme) {
      onUpdate(theme.settings);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Store Skjerm Temaer</CardTitle>
          <p className="text-sm text-muted-foreground">
            Forhåndskonfigurerte temaer optimalisert for store skjermer og TV-er
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(largeScreenThemes).map(([key, theme]) => {
              const IconComponent = theme.icon;
              return (
                <Card key={key} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <IconComponent className="h-5 w-5 text-gray-600" />
                      <h4 className="font-medium">{theme.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{theme.description}</p>
                    
                    {/* Theme Preview */}
                    <div className="space-y-2 mb-4">
                      <div 
                        className="h-8 rounded-md flex items-center px-2 text-xs"
                        style={{ 
                          backgroundColor: theme.settings.product_1_bg_color,
                          color: theme.settings.product_1_text_color 
                        }}
                      >
                        <div 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: theme.settings.product_1_accent_color }}
                        />
                        Produkt 1
                      </div>
                      <div 
                        className="h-8 rounded-md flex items-center px-2 text-xs"
                        style={{ 
                          backgroundColor: theme.settings.product_2_bg_color,
                          color: theme.settings.product_2_text_color 
                        }}
                      >
                        <div 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: theme.settings.product_2_accent_color }}
                        />
                        Produkt 2
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => applyTheme(key)}
                      className="w-full"
                      variant="outline"
                    >
                      Bruk tema
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LargeScreenThemesTab;