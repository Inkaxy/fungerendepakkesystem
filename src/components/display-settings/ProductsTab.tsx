
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Package, Palette, Type } from 'lucide-react';
import ColorPicker from './ColorPicker';
import SliderControl from './SliderControl';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface ProductsTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const ProductsTab = ({ settings, onUpdate }: ProductsTabProps) => {
  return (
    <div className="space-y-6">
      {/* Font Size Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Type className="h-5 w-5 mr-2" />
            Tekststørrelser
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SliderControl
            label="Produktnavn størrelse"
            value={settings.product_name_font_size}
            onChange={(value) => onUpdate({ product_name_font_size: value })}
            min={14}
            max={48}
            step={2}
            unit="px"
          />
          
          <SliderControl
            label="Antall størrelse"
            value={settings.product_quantity_font_size}
            onChange={(value) => onUpdate({ product_quantity_font_size: value })}
            min={24}
            max={96}
            step={4}
            unit="px"
          />
          
          <SliderControl
            label="Enhet størrelse (stk, kg)"
            value={settings.product_unit_font_size}
            onChange={(value) => onUpdate({ product_unit_font_size: value })}
            min={12}
            max={48}
            step={2}
            unit="px"
          />

          <SliderControl
            label="Font-tykkelse produktnavn"
            value={settings.product_name_font_weight}
            onChange={(value) => onUpdate({ product_name_font_weight: value })}
            min={400}
            max={900}
            step={100}
            description="400 = Normal, 600 = Semi-Bold, 700 = Bold"
          />

          <SliderControl
            label="Font-tykkelse antall"
            value={settings.product_quantity_font_weight}
            onChange={(value) => onUpdate({ product_quantity_font_weight: value })}
            min={400}
            max={900}
            step={100}
          />
        </CardContent>
      </Card>

      {/* Spacing & Layout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Package className="h-5 w-5 mr-2" />
            Størrelse og Avstand
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SliderControl
            label="Produktkort størrelse"
            value={settings.product_card_size}
            onChange={(value) => onUpdate({ product_card_size: value })}
            min={50}
            max={150}
            unit="%"
          />

          <SliderControl
            label="Avstand mellom produkter"
            value={settings.product_spacing}
            onChange={(value) => onUpdate({ product_spacing: value })}
            min={0}
            max={48}
            unit="px"
          />
          
          <SliderControl
            label="Intern padding"
            value={settings.product_card_padding}
            onChange={(value) => onUpdate({ product_card_padding: value })}
            min={8}
            max={48}
            unit="px"
          />
        </CardContent>
      </Card>

      {/* Individual Product Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Palette className="h-5 w-5 mr-2" />
            Produktlinje Farger
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Tilpass utseendet for hver produktlinje individuelt
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Product 1 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full border-2"
                style={{ backgroundColor: settings.product_1_bg_color, borderColor: settings.product_1_accent_color }}
              />
              <h3 className="text-base font-semibold">Produktlinje 1</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ColorPicker
                label="Bakgrunn"
                value={settings.product_1_bg_color}
                onChange={(color) => onUpdate({ product_1_bg_color: color })}
              />
              <ColorPicker
                label="Tekst"
                value={settings.product_1_text_color}
                onChange={(color) => onUpdate({ product_1_text_color: color })}
              />
              <ColorPicker
                label="Aksent"
                value={settings.product_1_accent_color}
                onChange={(color) => onUpdate({ product_1_accent_color: color })}
              />
            </div>
          </div>

          <Separator />

          {/* Product 2 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full border-2"
                style={{ backgroundColor: settings.product_2_bg_color, borderColor: settings.product_2_accent_color }}
              />
              <h3 className="text-base font-semibold">Produktlinje 2</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ColorPicker
                label="Bakgrunn"
                value={settings.product_2_bg_color}
                onChange={(color) => onUpdate({ product_2_bg_color: color })}
              />
              <ColorPicker
                label="Tekst"
                value={settings.product_2_text_color}
                onChange={(color) => onUpdate({ product_2_text_color: color })}
              />
              <ColorPicker
                label="Aksent"
                value={settings.product_2_accent_color}
                onChange={(color) => onUpdate({ product_2_accent_color: color })}
              />
            </div>
          </div>

          <Separator />

          {/* Product 3 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full border-2"
                style={{ backgroundColor: settings.product_3_bg_color, borderColor: settings.product_3_accent_color }}
              />
              <h3 className="text-base font-semibold">Produktlinje 3</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ColorPicker
                label="Bakgrunn"
                value={settings.product_3_bg_color}
                onChange={(color) => onUpdate({ product_3_bg_color: color })}
              />
              <ColorPicker
                label="Tekst"
                value={settings.product_3_text_color}
                onChange={(color) => onUpdate({ product_3_text_color: color })}
              />
              <ColorPicker
                label="Aksent"
                value={settings.product_3_accent_color}
                onChange={(color) => onUpdate({ product_3_accent_color: color })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Forhåndsvisning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4" style={{ gap: `${settings.product_spacing}px` }}>
            {[
              { name: 'Rugbrød', quantity: 45, unit: 'stk', bg: settings.product_1_bg_color, text: settings.product_1_text_color, accent: settings.product_1_accent_color },
              { name: 'Grovbrød', quantity: 28, unit: 'stk', bg: settings.product_2_bg_color, text: settings.product_2_text_color, accent: settings.product_2_accent_color },
              { name: 'Kringle', quantity: 12, unit: 'kg', bg: settings.product_3_bg_color, text: settings.product_3_text_color, accent: settings.product_3_accent_color }
            ].map((product, idx) => (
              <div 
                key={idx}
                className="rounded-lg border transition-all duration-300" 
                style={{ 
                  backgroundColor: product.bg,
                  borderRadius: `${settings.border_radius}px`,
                  padding: `${settings.product_card_padding}px`,
                  transform: `scale(${settings.product_card_size / 100})`,
                  transformOrigin: 'top left'
                }}
              >
                <div className="flex justify-between items-center">
                  <span 
                    style={{ 
                      color: product.text,
                      fontSize: `${settings.product_name_font_size}px`,
                      fontWeight: settings.product_name_font_weight
                    }}
                  >
                    {product.name}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span 
                      style={{ 
                        color: product.accent,
                        fontSize: `${settings.product_quantity_font_size}px`,
                        fontWeight: settings.product_quantity_font_weight
                      }}
                    >
                      {product.quantity}
                    </span>
                    {settings.show_product_unit && (
                      <span 
                        style={{ 
                          color: product.text,
                          fontSize: `${settings.product_unit_font_size}px`,
                          opacity: 0.7
                        }}
                      >
                        {product.unit}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsTab;
