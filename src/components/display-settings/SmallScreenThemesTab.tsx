import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tablet, Monitor, Laptop } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface SmallScreenThemesTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const smallScreenThemes = {
  tabletCompact: {
    name: 'Tablet Kompakt',
    icon: Tablet,
    description: 'Optimalisert for 10-13" tablets med kompakt layout',
    settings: {
      background_type: 'solid' as const,
      background_color: '#ffffff',
      product_1_bg_color: '#ffffff',
      product_2_bg_color: '#f8fafc',
      product_3_bg_color: '#f1f5f9',
      product_1_text_color: '#0f172a',
      product_2_text_color: '#1e293b',
      product_3_text_color: '#334155',
      product_1_accent_color: '#3b82f6',
      product_2_accent_color: '#10b981',
      product_3_accent_color: '#f59e0b',
      progress_bar_color: '#3b82f6',
      header_text_color: '#0f172a',
      text_color: '#1e293b',
      header_font_size: 24,
      body_font_size: 14,
      status_indicator_font_size: 20,
      status_indicator_padding: 16,
      spacing: 12,
      customer_cards_columns: 2,
      screen_size_preset: '10inch' as const,
      large_screen_optimization: false,
    }
  },
  laptopStandard: {
    name: 'Laptop Standard',
    icon: Laptop,
    description: 'Balansert for 13-17" laptops og mindre monitorer',
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
      header_font_size: 28,
      body_font_size: 16,
      status_indicator_font_size: 24,
      status_indicator_padding: 20,
      spacing: 16,
      customer_cards_columns: 3,
      screen_size_preset: 'laptop' as const,
      large_screen_optimization: false,
    }
  },
  monitorBalanced: {
    name: 'Monitor Balansert',
    icon: Monitor,
    description: 'For 19-24" monitorer med balansert layout',
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
      header_font_size: 30,
      body_font_size: 16,
      status_indicator_font_size: 26,
      status_indicator_padding: 22,
      spacing: 18,
      customer_cards_columns: 3,
      screen_size_preset: 'monitor' as const,
      large_screen_optimization: false,
    }
  }
};

const SmallScreenThemesTab = ({ settings, onUpdate }: SmallScreenThemesTabProps) => {
  const applyTheme = (themeKey: string) => {
    const theme = smallScreenThemes[themeKey as keyof typeof smallScreenThemes];
    if (theme) {
      onUpdate(theme.settings);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Små Skjerm Temaer</CardTitle>
          <p className="text-sm text-muted-foreground">
            Forhåndskonfigurerte temaer optimalisert for små skjermer
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(smallScreenThemes).map(([key, theme]) => {
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

export default SmallScreenThemesTab;