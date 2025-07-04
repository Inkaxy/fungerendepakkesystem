import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
          Kurvvisning
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Vis hvor mange kurver/korter som trengs for pakking
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="show-basket-quantity">Vis kurvberegning</Label>
              <p className="text-sm text-muted-foreground">
                Vis antall kurver basert på produktets kurvstørrelse
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
            <Label>Visningsformat</Label>
            <RadioGroup
              value={settings.basket_display_format}
              onValueChange={(value) => onUpdate({ basket_display_format: value as 'total_first' | 'basket_first' })}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="total_first" id="total-first" />
                <Label htmlFor="total-first" className="cursor-pointer">
                  Total først - f.eks. "35 stk (4+2)"
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="basket_first" id="basket-first" />
                <Label htmlFor="basket-first" className="cursor-pointer">
                  Kurver først - f.eks. "4+2 (35 stk)"
                </Label>
              </div>
            </RadioGroup>
            
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Eksempel:</strong> Med kurvstørrelse 8 og totalt 35 stk:
              </p>
              <p className="text-sm mt-1">
                • Total først: "35 stk (4+3)"<br/>
                • Kurver først: "4+3 (35 stk)"
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BasketQuantitySettingsCard;