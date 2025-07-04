
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Zap, Play, Pause } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface AnimationSettingsTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const AnimationSettingsTab = ({ settings, onUpdate }: AnimationSettingsTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Animasjonsinnstillinger
          </CardTitle>
          <p className="text-sm text-gray-600">
            Aktiver animasjoner for å gjøre pakkeskjermen mer levende og interaktiv
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Master Animation Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Aktiver animasjoner</Label>
              <p className="text-sm text-gray-600">
                Slå på/av alle animasjoner globalt
              </p>
            </div>
            <Switch
              checked={settings.enable_animations}
              onCheckedChange={(checked) => onUpdate({ enable_animations: checked })}
            />
          </div>

          {settings.enable_animations && (
            <>
              {/* Animation Speed */}
              <div className="space-y-3">
                <Label className="text-base">Animasjonshastighet</Label>
                <RadioGroup
                  value={settings.animation_speed}
                  onValueChange={(value) => onUpdate({ animation_speed: value as 'slow' | 'normal' | 'fast' })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="slow" id="slow" />
                    <Label htmlFor="slow">Langsom (2s)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="normal" />
                    <Label htmlFor="normal">Normal (1s)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fast" id="fast" />
                    <Label htmlFor="fast">Rask (0.5s)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Specific Animation Types */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Spesifikke Animasjoner</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Fade-overganger</Label>
                    <p className="text-sm text-gray-600">
                      Myke fade-in/out effekter ved oppdateringer
                    </p>
                  </div>
                  <Switch
                    checked={settings.fade_transitions}
                    onCheckedChange={(checked) => onUpdate({ fade_transitions: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Progressbar-animasjon</Label>
                    <p className="text-sm text-gray-600">
                      Animert progressbar som fyller seg gradvis
                    </p>
                  </div>
                  <Switch
                    checked={settings.progress_animation}
                    onCheckedChange={(checked) => onUpdate({ progress_animation: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Produktendring-animasjon</Label>
                    <p className="text-sm text-gray-600">
                      Visuell effekt når produkter endres - produkter beveger seg mot lastebilen
                    </p>
                  </div>
                  <Switch
                    checked={settings.product_change_animation || false}
                    onCheckedChange={(checked) => onUpdate({ product_change_animation: checked })}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Animation Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Animasjonsforhåndsvisning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Eksempel produktkort</span>
                <div className="flex items-center space-x-2">
                  {settings.enable_animations ? (
                    <Play className="h-4 w-4 text-green-500" />
                  ) : (
                    <Pause className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-600">
                    {settings.enable_animations ? 'Animasjoner på' : 'Animasjoner av'}
                  </span>
                </div>
              </div>
              
              <div 
                className={`p-3 rounded border transition-all duration-300 ${
                  settings.enable_animations ? 'hover:shadow-md hover:scale-105' : ''
                }`}
                style={{
                  backgroundColor: settings.product_1_bg_color,
                  color: settings.product_1_text_color,
                  transitionDuration: settings.animation_speed === 'slow' ? '2s' : 
                                     settings.animation_speed === 'fast' ? '0.5s' : '1s'
                }}
              >
                <div className="flex justify-between items-center">
                  <span>Brød - Rundstykker</span>
                  <span 
                    className="px-2 py-1 rounded text-sm"
                    style={{ 
                      backgroundColor: settings.product_1_accent_color,
                      color: settings.product_1_bg_color 
                    }}
                  >
                    12
                  </span>
                </div>
                
                {settings.show_progress_bar && (
                  <div className="mt-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ backgroundColor: settings.progress_background_color }}
                    >
                      <div 
                        className={`h-full rounded-full transition-all ${
                          settings.progress_animation ? 'animate-pulse' : ''
                        }`}
                        style={{ 
                          backgroundColor: settings.progress_bar_color,
                          width: '75%',
                          transitionDuration: settings.animation_speed === 'slow' ? '2s' : 
                                             settings.animation_speed === 'fast' ? '0.5s' : '1s'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              {settings.enable_animations 
                ? 'Hover over kortet for å se animasjonseffekten'
                : 'Aktiver animasjoner for å se effektene'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimationSettingsTab;
