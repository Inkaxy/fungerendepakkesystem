
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cat, Heart, Star } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface CatAnimationSettingsTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const CatAnimationSettingsTab = ({ settings, onUpdate }: CatAnimationSettingsTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cat className="h-5 w-5 mr-2" />
            Katte-animasjoner
          </CardTitle>
          <p className="text-sm text-gray-600">
            Spesielle animasjoner for katte-temaet
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable Cat Animations */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Aktiver katte-animasjoner</Label>
              <p className="text-sm text-gray-600">
                Vis søte animerte katter på skjermen
              </p>
            </div>
            <Switch
              checked={settings.enable_cat_animations}
              onCheckedChange={(checked) => onUpdate({ enable_cat_animations: checked })}
            />
          </div>

          {settings.enable_cat_animations && (
            <>
              {/* Cat Animation Speed */}
              <div className="space-y-2">
                <Label>Hastighet på katte-animasjoner</Label>
                <Select
                  value={settings.cat_animation_speed}
                  onValueChange={(value: 'slow' | 'normal' | 'fast') => 
                    onUpdate({ cat_animation_speed: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Sakte 🐌</SelectItem>
                    <SelectItem value="normal">Normal 🐱</SelectItem>
                    <SelectItem value="fast">Rask ⚡</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Running Cats */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Løpende katter</Label>
                  <p className="text-sm text-gray-600">
                    Katter som løper over skjermen
                  </p>
                </div>
                <Switch
                  checked={settings.show_running_cats}
                  onCheckedChange={(checked) => onUpdate({ show_running_cats: checked })}
                />
              </div>

              {/* Bouncing Cats */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Hoppende katter</Label>
                  <p className="text-sm text-gray-600">
                    Katter som hopper på faste posisjoner
                  </p>
                </div>
                <Switch
                  checked={settings.show_bouncing_cats}
                  onCheckedChange={(checked) => onUpdate({ show_bouncing_cats: checked })}
                />
              </div>

              {/* Falling Cats */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Fallende katter</Label>
                  <p className="text-sm text-gray-600">
                    Katter som faller fra toppen av skjermen
                  </p>
                </div>
                <Switch
                  checked={settings.show_falling_cats}
                  onCheckedChange={(checked) => onUpdate({ show_falling_cats: checked })}
                />
              </div>

              {/* Preview */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border">
                <h4 className="font-medium mb-2 flex items-center">
                  <Star className="h-4 w-4 mr-2 text-orange-500" />
                  Katte-animasjon forhåndsvisning
                </h4>
                <div className="flex space-x-2 text-2xl">
                  {settings.show_running_cats && <span className="animate-bounce">🐱</span>}
                  {settings.show_bouncing_cats && <span className="animate-pulse">😺</span>}
                  {settings.show_falling_cats && <span className="animate-ping">😸</span>}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  <Heart className="h-3 w-3 inline mr-1 text-red-500" />
                  Katter gir bonus poeng når de samles inn!
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CatAnimationSettingsTab;
