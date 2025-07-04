
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid3X3 } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import SliderControl from '../SliderControl';

interface CustomerCardsSettingsCardProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const CustomerCardsSettingsCard = ({ settings, onUpdate }: CustomerCardsSettingsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Grid3X3 className="h-5 w-5 mr-2" />
          Kunde-kort Layout
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SliderControl
          label="Antall kolonner"
          value={settings.customer_cards_columns}
          onChange={(value) => onUpdate({ customer_cards_columns: value })}
          min={1}
          max={8}
          step={1}
        />

        <div>
          <Label>Kunde-kort høyde</Label>
          <Select
            value={settings.customer_card_height}
            onValueChange={(value: 'compact' | 'normal' | 'extended') => 
              onUpdate({ customer_card_height: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Kompakt</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="extended">Utvidet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <SliderControl
          label="Avstand mellom kort (px)"
          value={settings.customer_cards_gap}
          onChange={(value) => onUpdate({ customer_cards_gap: value })}
          min={8}
          max={48}
          step={4}
        />

        <div className="flex items-center space-x-2">
          <Switch
            checked={settings.show_customer_numbers}
            onCheckedChange={(checked) => onUpdate({ show_customer_numbers: checked })}
          />
          <Label>Vis kundenummer badges</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={settings.show_status_badges}
            onCheckedChange={(checked) => onUpdate({ show_status_badges: checked })}
          />
          <Label>Vis status badges</Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerCardsSettingsCard;
