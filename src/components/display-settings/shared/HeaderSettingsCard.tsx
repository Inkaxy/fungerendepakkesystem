
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Type } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface HeaderSettingsCardProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const HeaderSettingsCard = ({ settings, onUpdate }: HeaderSettingsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Type className="h-5 w-5 mr-2" />
          Hovedtitler og Tekst
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="main-title">Hovedtittel</Label>
            <Input
              id="main-title"
              value={settings.main_title}
              onChange={(e) => onUpdate({ main_title: e.target.value })}
              placeholder="Felles Display"
            />
          </div>
          <div>
            <Label htmlFor="subtitle">Undertittel</Label>
            <Input
              id="subtitle"
              value={settings.subtitle}
              onChange={(e) => onUpdate({ subtitle: e.target.value })}
              placeholder="Pakkestatus for kunder"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            checked={settings.show_date_indicator}
            onCheckedChange={(checked) => onUpdate({ show_date_indicator: checked })}
          />
          <Label>Vis datoindikator</Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeaderSettingsCard;
