import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Sun, Snowflake, Leaf, Heart, Crown, Gift, Monitor, Tablet, Eye, Presentation, Zap, Coffee, Tv } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface ThemePresetsTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const smallScreenThemes = {
  tabletCompact: {
    name: 'Tablet Kompakt',
    icon: Tablet,
    description: 'Optimalisert for 10-13" tablets med kompakt layout',
    category: 'small',
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
    icon: Monitor,
    description: 'Balansert for 13-17" laptops og mindre monitorer',
    category: 'small',
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
    category: 'small',
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

const largeScreenThemes = {
  tvDistance: {
    name: 'TV Avstand',
    icon: Tv,
    description: 'Optimalisert for 32-43" TV-skjermer og avstandslesing',
    category: 'large',
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
    category: 'large',
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
    category: 'large',
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

const universalThemes = {
  compact: {
    name: 'Kompakt',
    icon: Tablet,
    description: 'Maksimal informasjonstetthet for mindre skjermer',
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
      header_font_size: 24,
      body_font_size: 14,
      status_indicator_font_size: 20,
      status_indicator_padding: 16,
      spacing: 12,
      customer_cards_columns: 4,
      customer_card_height: 'compact' as const,
    }
  },
  highContrast: {
    name: 'Høy Kontrast',
    icon: Eye,
    description: 'Maksimal lesbarhet og tilgjengelighet',
    settings: {
      background_type: 'solid' as const,
      background_color: '#ffffff',
      product_1_bg_color: '#000000',
      product_2_bg_color: '#1f2937',
      product_3_bg_color: '#374151',
      product_1_text_color: '#ffffff',
      product_2_text_color: '#ffffff',
      product_3_text_color: '#ffffff',
      product_1_accent_color: '#fbbf24',
      product_2_accent_color: '#34d399',
      product_3_accent_color: '#60a5fa',
      progress_bar_color: '#fbbf24',
      header_text_color: '#000000',
      text_color: '#000000',
      header_font_size: 36,
      body_font_size: 18,
      status_indicator_font_size: 32,
      status_indicator_padding: 24,
      spacing: 20,
      card_shadow_intensity: 5,
    }
  },
  presentation: {
    name: 'Presentasjon',
    icon: Presentation,
    description: 'Profesjonelt og minimalistisk for formelle miljøer',
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
      header_font_size: 32,
      body_font_size: 16,
      status_indicator_font_size: 28,
      border_radius: 12,
      card_shadow_intensity: 2,
    }
  },
  energetic: {
    name: 'Energisk',
    icon: Zap,
    description: 'Livlige farger for å skape oppmerksomhet og energi',
    settings: {
      background_type: 'gradient' as const,
      background_gradient_start: '#fef3c7',
      background_gradient_end: '#a7f3d0',
      product_1_bg_color: '#fee2e2',
      product_2_bg_color: '#dbeafe',
      product_3_bg_color: '#dcfce7',
      product_1_text_color: '#7f1d1d',
      product_2_text_color: '#1e3a8a',
      product_3_text_color: '#14532d',
      product_1_accent_color: '#ef4444',
      product_2_accent_color: '#3b82f6',
      product_3_accent_color: '#22c55e',
      progress_bar_color: '#f59e0b',
      header_text_color: '#1f2937',
      text_color: '#374151',
      header_font_size: 36,
      body_font_size: 17,
      card_shadow_intensity: 4,
      enable_animations: true,
      animation_speed: 'fast' as const,
    }
  },
  bakery: {
    name: 'Bakeri',
    icon: Coffee,
    description: 'Varme bakerfarger som minner om fersk bakst',
    settings: {
      background_type: 'gradient' as const,
      background_gradient_start: '#fef7ed',
      background_gradient_end: '#fed7aa',
      product_1_bg_color: '#fed7aa',
      product_2_bg_color: '#fdba74',
      product_3_bg_color: '#fb923c',
      product_1_text_color: '#7c2d12',
      product_2_text_color: '#9a3412',
      product_3_text_color: '#c2410c',
      product_1_accent_color: '#ea580c',
      product_2_accent_color: '#dc2626',
      product_3_accent_color: '#b45309',
      progress_bar_color: '#ea580c',
      header_text_color: '#7c2d12',
      text_color: '#92400e',
      header_font_size: 34,
      body_font_size: 16,
      border_radius: 10,
      card_shadow_intensity: 3,
    }
  },
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
  const allThemes = { ...smallScreenThemes, ...largeScreenThemes, ...universalThemes };

  const applyTheme = (themeKey: string) => {
    const theme = allThemes[themeKey as keyof typeof allThemes];
    if (theme) {
      onUpdate(theme.settings);
    }
  };

  const renderThemeSection = (themes: Record<string, any>, title: string, description: string) => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(themes).map(([key, theme]) => {
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
    </div>
  );

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Forhåndsdefinerte Temaer
          </CardTitle>
          <p className="text-sm text-gray-600">
            Velg et ferdig tema optimalisert for din skjermstørrelse
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {renderThemeSection(
            smallScreenThemes, 
            "Små Skjermer & Tablets", 
            "Optimalisert for 10-24\" skjermer med kompakte layouts"
          )}
          
          {renderThemeSection(
            largeScreenThemes, 
            "Store Skjermer & TV", 
            "Optimalisert for 32\"+ TV-skjermer og avstandslesing"
          )}
          
          {renderThemeSection(
            universalThemes, 
            "Universelle Temaer", 
            "Fungerer godt på alle skjermstørrelser"
          )}
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
