
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Monitor } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import SliderControl from '../SliderControl';

interface ProductListSettingsCardProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const ProductListSettingsCard = ({ settings, onUpdate }: ProductListSettingsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Monitor className="h-5 w-5 mr-2" />
          Produktliste Innstillinger
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SliderControl
          label="Maks produkter per kort"
          value={settings.max_products_per_card}
          onChange={(value) => onUpdate({ max_products_per_card: value })}
          min={3}
          max={20}
          step={1}
        />

        <div>
          <Label>Produktliste stil</Label>
          <Select
            value={settings.product_list_style}
            onValueChange={(value: 'compact' | 'normal') => 
              onUpdate({ product_list_style: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Kompakt</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Sorteringsrekkefølge</Label>
          <Select
            value={settings.customer_sort_order}
            onValueChange={(value: 'alphabetical' | 'status' | 'progress') => 
              onUpdate({ customer_sort_order: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphabetical">Alfabetisk</SelectItem>
              <SelectItem value="status">Etter status</SelectItem>
              <SelectItem value="progress">Etter fremgang</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={settings.show_line_items_count}
            onCheckedChange={(checked) => onUpdate({ show_line_items_count: checked })}
          />
          <Label>Vis varelinjer-telling</Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductListSettingsCard;
