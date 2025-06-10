
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Sun, Snowflake, Leaf, Heart, Crown, Gift } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface ThemePresetsTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const themes = {
  summer: {
    name: 'Sommer',
    icon: Sun,
    description: 'Lys og frisk sommertema',
    settings: {
      background_type: 'gradient' as const,
      background_gradient_start: '#fef3c7',
      background_gradient_end: '#93c5fd',
      product_1_bg_color: '#fef3c7',
      product_2_bg_color: '#bfdbfe',
      product_3_bg_color: '#bbf7d0',
      product_1_text_color: '#374151',
      product_2_text_color: '#1e40af',
      product_3_text_color: '#065f46',
      product_1_accent_color: '#f59e0b',
      product_2_accent_color: '#3b82f6',
      product_3_accent_color: '#10b981',
      progress_bar_color: '#f59e0b',
      header_text_color: '#1f2937',
      text_color: '#374151',
    }
  },
  winter: {
    name: 'Vinter',
    icon: Snowflake,
    description: 'Kaldt og elegant vintertema',
    settings: {
      background_type: 'gradient' as const,
      background_gradient_start: '#f1f5f9',
      background_gradient_end: '#e2e8f0',
      product_1_bg_color: '#f8fafc',
      product_2_bg_color: '#e2e8f0',
      product_3_bg_color: '#cbd5e1',
      product_1_text_color: '#1e293b',
      product_2_text_color: '#334155',
      product_3_text_color: '#475569',
      product_1_accent_color: '#0ea5e9',
      product_2_accent_color: '#6366f1',
      product_3_accent_color: '#8b5cf6',
      progress_bar_color: '#0ea5e9',
      header_text_color: '#0f172a',
      text_color: '#334155',
    }
  },
  autumn: {
    name: 'Høst',
    icon: Leaf,
    description: 'Varme høstfarger',
    settings: {
      background_type: 'gradient' as const,
      background_gradient_start: '#fed7aa',
      background_gradient_end: '#fca5a5',
      product_1_bg_color: '#fed7aa',
      product_2_bg_color: '#fdba74',
      product_3_bg_color: '#fb923c',
      product_1_text_color: '#7c2d12',
      product_2_text_color: '#9a3412',
      product_3_text_color: '#c2410c',
      product_1_accent_color: '#ea580c',
      product_2_accent_color: '#dc2626',
      product_3_accent_color: '#b91c1c',
      progress_bar_color: '#ea580c',
      header_text_color: '#7c2d12',
      text_color: '#9a3412',
    }
  },
  pride: {
    name: 'Pride',
    icon: Heart,
    description: 'Festlige regnbuefarger',
    settings: {
      background_type: 'gradient' as const,
      background_gradient_start: '#fef3c7',
      background_gradient_end: '#ddd6fe',
      product_1_bg_color: '#fecaca',
      product_2_bg_color: '#fed7aa',
      product_3_bg_color: '#fef3c7',
      product_1_text_color: '#991b1b',
      product_2_text_color: '#9a3412',
      product_3_text_color: '#92400e',
      product_1_accent_color: '#ef4444',
      product_2_accent_color: '#f97316',
      product_3_accent_color: '#eab308',
      progress_bar_color: '#8b5cf6',
      header_text_color: '#7c3aed',
      text_color: '#6d28d9',
    }
  },
  classic: {
    name: 'Klassisk',
    icon: Crown,
    description: 'Profesjonelt og nøytralt',
    settings: {
      background_type: 'solid' as const,
      background_color: '#ffffff',
      product_1_bg_color: '#ffffff',
      product_2_bg_color: '#f9fafb',
      product_3_bg_color: '#f3f4f6',
      product_1_text_color: '#111827',
      product_2_text_color: '#374151',
      product_3_text_color: '#4b5563',
      product_1_accent_color: '#3b82f6',
      product_2_accent_color: '#10b981',
      product_3_accent_color: '#f59e0b',
      progress_bar_color: '#3b82f6',
      header_text_color: '#111827',
      text_color: '#374151',
    }
  },
  holiday: {
    name: 'Høytid',
    icon: Gift,
    description: 'Jule- og høytidsfarger',
    settings: {
      background_type: 'gradient' as const,
      background_gradient_start: '#fecaca',
      background_gradient_end: '#bbf7d0',
      product_1_bg_color: '#fecaca',
      product_2_bg_color: '#bbf7d0',
      product_3_bg_color: '#fef3c7',
      product_1_text_color: '#7f1d1d',
      product_2_text_color: '#14532d',
      product_3_text_color: '#78350f',
      product_1_accent_color: '#dc2626',
      product_2_accent_color: '#16a34a',
      product_3_accent_color: '#ca8a04',
      progress_bar_color: '#dc2626',
      header_text_color: '#7f1d1d',
      text_color: '#374151',
    }
  }
};

const ThemePresetsTab = ({ settings, onUpdate }: ThemePresetsTabProps) => {
  const applyTheme = (themeKey: string) => {
    const theme = themes[themeKey as keyof typeof themes];
    if (theme) {
      onUpdate(theme.settings);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Forhåndsdefinerte Temaer
          </CardTitle>
          <p className="text-sm text-gray-600">
            Velg et ferdig tema for raskt å endre utseendet på pakkeskjermen
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(themes).map(([key, theme]) => {
              const IconComponent = theme.icon;
              return (
                <Card key={key} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <IconComponent className="h-5 w-5 text-gray-600" />
                      <h3 className="font-medium">{theme.name}</h3>
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
                      <div 
                        className="h-8 rounded-md flex items-center px-2 text-xs"
                        style={{ 
                          backgroundColor: theme.settings.product_3_bg_color,
                          color: theme.settings.product_3_text_color 
                        }}
                      >
                        <div 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: theme.settings.product_3_accent_color }}
                        />
                        Produkt 3
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

      <Card>
        <CardHeader>
          <CardTitle>Tilbakestill til Standard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Gjenopprett alle innstillinger til standardverdier
              </p>
            </div>
            <Button 
              onClick={() => applyTheme('classic')}
              variant="outline"
            >
              Tilbakestill
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemePresetsTab;
