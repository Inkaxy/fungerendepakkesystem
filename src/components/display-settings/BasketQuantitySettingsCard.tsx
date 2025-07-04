import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface BasketQuantitySettingsCardProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const BasketQuantitySettingsCard = ({ settings, onUpdate }: BasketQuantitySettingsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Kurvantall og Mengdevisning
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Konfigurer hvordan produktmengder og kurvantall vises på skjermene
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="show-basket-quantity">Vis kurvantall</Label>
              <p className="text-sm text-muted-foreground">
                Vis kurvantall sammen med total mengde når det er definert
              </p>
            </div>
            <Switch
              id="show-basket-quantity"
              checked={settings.show_basket_quantity}
              onCheckedChange={(checked) => onUpdate({ show_basket_quantity: checked })}
            />
          </div>
        </div>

        {settings.show_basket_quantity && (
          <div className="space-y-3">
            <Label htmlFor="basket-display-format">Visningsformat</Label>
            <Select 
              value={settings.basket_display_format} 
              onValueChange={(value) => onUpdate({ basket_display_format: value as 'total_first' | 'basket_first' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Velg visningsformat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="total_first">Total først (100 stk (5 kurv))</SelectItem>
                <SelectItem value="basket_first">Kurv først (5 kurv (100 stk))</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Velg hvordan kurvantall og total mengde skal vises sammen
            </p>
          </div>
        )}

        {/* Preview */}
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">Forhåndsvisning:</p>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Eksempel 1 (100 brød, 20 per kurv):</span><br />
              {settings.show_basket_quantity 
                ? settings.basket_display_format === 'total_first' 
                  ? "100 stk (5)"
                  : "5 (100 stk)"
                : "100 stk"
              }
            </div>
            <div className="text-sm">
              <span className="font-medium">Eksempel 2 (85 boller, 12 per kurv):</span><br />
              {settings.show_basket_quantity 
                ? settings.basket_display_format === 'total_first' 
                  ? "85 stk (7+1)"
                  : "7+1 (85 stk)"
                : "85 stk"
              }
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasketQuantitySettingsCard;