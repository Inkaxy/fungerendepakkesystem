import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import SliderControl from './SliderControl';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { Sliders, LayoutGrid, Type, Eye } from 'lucide-react';

interface AdvancedSettingsTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const AdvancedSettingsTab = ({ settings, onUpdate }: AdvancedSettingsTabProps) => {
  return (
    <div className="space-y-6">
      {/* Spacing & Layout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <LayoutGrid className="h-5 w-5 mr-2" />
            Avstander og Layout
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Kontroller avstand mellom elementer og intern padding i produktkort
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <SliderControl
            label="Avstand mellom produkter"
            value={settings.product_spacing}
            onChange={(value) => onUpdate({ product_spacing: value })}
            min={0}
            max={48}
            unit="px"
            description="Vertikalt mellomrom mellom produktkortene"
          />
          
          <SliderControl
            label="Intern padding i produktkort"
            value={settings.product_card_padding}
            onChange={(value) => onUpdate({ product_card_padding: value })}
            min={8}
            max={48}
            unit="px"
            description="Indre avstand fra kant til innhold i hvert produktkort"
          />
        </CardContent>
      </Card>

      {/* Typography Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Type className="h-5 w-5 mr-2" />
            Typografi-kontroller
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Juster font-tykkelse for bedre lesbarhet og visuell hierarki
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <SliderControl
            label="Font-tykkelse på produktnavn"
            value={settings.product_name_font_weight}
            onChange={(value) => onUpdate({ product_name_font_weight: value })}
            min={400}
            max={900}
            step={100}
            description="400 = Normal, 600 = Semi-Bold, 700 = Bold, 900 = Extra Bold"
          />
          
          <div className="p-3 bg-muted/50 rounded">
            <p className="text-sm mb-2">Forhåndsvisning:</p>
            <span 
              style={{ 
                fontWeight: settings.product_name_font_weight,
                fontSize: '18px'
              }}
            >
              Rugbrød
            </span>
          </div>

          <Separator />
          
          <SliderControl
            label="Font-tykkelse på antall"
            value={settings.product_quantity_font_weight}
            onChange={(value) => onUpdate({ product_quantity_font_weight: value })}
            min={400}
            max={900}
            step={100}
            description="Tykkelsen på tall som viser antall produkter"
          />
          
          <div className="p-3 bg-muted/50 rounded">
            <p className="text-sm mb-2">Forhåndsvisning:</p>
            <span 
              style={{ 
                fontWeight: settings.product_quantity_font_weight,
                fontSize: '32px'
              }}
            >
              85
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Visibility Toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Eye className="h-5 w-5 mr-2" />
            Synlighet av Elementer
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Skjul eller vis spesifikke elementer på displayet
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-unit" className="text-base font-medium">
                Vis produktenhet
              </Label>
              <p className="text-sm text-muted-foreground">
                Vis eller skjul enheter som "stk", "kg", etc.
              </p>
            </div>
            <Switch
              id="show-unit"
              checked={settings.show_product_unit}
              onCheckedChange={(checked) => onUpdate({ show_product_unit: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-line-items" className="text-base font-medium">
                Vis varelinjer-telling
              </Label>
              <p className="text-sm text-muted-foreground">
                Vis antall pakkede vs totalt varelinjer (f.eks. "12/15")
              </p>
            </div>
            <Switch
              id="show-line-items"
              checked={settings.show_line_items_count}
              onCheckedChange={(checked) => onUpdate({ show_line_items_count: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-status-badges" className="text-base font-medium">
                Vis status badges
              </Label>
              <p className="text-sm text-muted-foreground">
                Vis eller skjul status badges (Ferdig, Pågår, Venter)
              </p>
            </div>
            <Switch
              id="show-status-badges"
              checked={settings.show_status_badges}
              onCheckedChange={(checked) => onUpdate({ show_status_badges: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-completion-celebration" className="text-base font-medium">
                Vis "Loaf & Load" ferdig-animasjon
              </Label>
              <p className="text-sm text-muted-foreground">
                Når en kunde er 100% ferdig pakket, vises en morsom gjentagende animasjon der en mann laster brød inn i varebilen
              </p>
            </div>
            <Switch
              id="show-completion-celebration"
              checked={settings.show_completion_celebration}
              onCheckedChange={(checked) => onUpdate({ show_completion_celebration: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Info Box */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Sliders className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">💡 Tips for Avanserte Innstillinger</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Bruk mindre spacing for å få plass til flere produkter på skjermen</li>
                <li>• Øk font-weight for bedre lesbarhet på avstand</li>
                <li>• Skjul elementer du ikke trenger for et renere design</li>
                <li>• Test innstillingene på faktisk display-størrelse før endelig oppsett</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedSettingsTab;
