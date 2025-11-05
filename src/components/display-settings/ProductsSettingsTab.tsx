
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ColorPicker from './ColorPicker';
import SliderControl from './SliderControl';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface ProductsSettingsTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const ProductsSettingsTab = ({ settings, onUpdate }: ProductsSettingsTabProps) => {
  return (
    <div className="space-y-6">
      {/* Text Sizes Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📝 Tekststørrelser</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SliderControl
            label="Størrelse på produktnavn"
            value={settings.product_name_font_size}
            onChange={(value) => onUpdate({ product_name_font_size: value })}
            min={14}
            max={48}
            unit="px"
            description="Størrelsen på produktnavnet"
          />
          <SliderControl
            label="Størrelse på antall"
            value={settings.product_quantity_font_size}
            onChange={(value) => onUpdate({ product_quantity_font_size: value })}
            min={24}
            max={96}
            unit="px"
            description="Størrelsen på tall som viser antall å levere"
          />
          <SliderControl
            label="Størrelse på enhet"
            value={settings.product_unit_font_size}
            onChange={(value) => onUpdate({ product_unit_font_size: value })}
            min={12}
            max={48}
            unit="px"
            description="Størrelsen på enhet (stk, kg, etc.)"
          />
          <SliderControl
            label="Størrelse på varelinjer-telling"
            value={settings.line_items_count_font_size}
            onChange={(value) => onUpdate({ line_items_count_font_size: value })}
            min={12}
            max={32}
            unit="px"
            description="Størrelsen på pakket/totalt varelinjer (f.eks. '3/5')"
          />
        </CardContent>
      </Card>

      {/* Colors Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🎨 Farger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPicker
              label="Standard tekst farge"
              value={settings.product_text_color}
              onChange={(color) => onUpdate({ product_text_color: color })}
              description="Farge på produktnavn og beskrivelse"
            />
            <ColorPicker
              label="Standard aksent farge"
              value={settings.product_accent_color}
              onChange={(color) => onUpdate({ product_accent_color: color })}
              description="Farge for ikoner og detaljer"
            />
          </div>
        </CardContent>
      </Card>

      {/* Layout Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📐 Layout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SliderControl
            label="Kort størrelse"
            value={settings.product_card_size}
            onChange={(value) => onUpdate({ product_card_size: value })}
            min={50}
            max={150}
            unit="%"
            description="Justerer størrelsen på produktkortene"
          />
        </CardContent>
      </Card>

      {/* Individual Product Background Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Individuelle Produktbakgrunner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ColorPicker
              label="Produkt 1 bakgrunn"
              value={settings.product_1_bg_color}
              onChange={(color) => onUpdate({ product_1_bg_color: color })}
              description="Bakgrunnsfarge for første produkt"
            />
            <ColorPicker
              label="Produkt 2 bakgrunn"
              value={settings.product_2_bg_color}
              onChange={(color) => onUpdate({ product_2_bg_color: color })}
              description="Bakgrunnsfarge for andre produkt"
            />
            <ColorPicker
              label="Produkt 3 bakgrunn"
              value={settings.product_3_bg_color}
              onChange={(color) => onUpdate({ product_3_bg_color: color })}
              description="Bakgrunnsfarge for tredje produkt"
            />
          </div>
        </CardContent>
      </Card>

      {/* Product Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Forhåndsvisning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Produkt 1', bgColor: settings.product_1_bg_color },
              { name: 'Produkt 2', bgColor: settings.product_2_bg_color },
              { name: 'Produkt 3', bgColor: settings.product_3_bg_color }
            ].map((product, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-lg border" 
                style={{ backgroundColor: product.bgColor }}
              >
                <div 
                  className="space-y-2"
                  style={{ 
                    transform: `scale(${settings.product_card_size / 100})`,
                    transformOrigin: 'top left'
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: settings.product_accent_color }}
                    />
                    <h4 
                      className="font-medium"
                      style={{ color: settings.product_text_color }}
                    >
                      {product.name}
                    </h4>
                  </div>
                  <p 
                    className="text-sm"
                    style={{ color: settings.product_text_color, opacity: 0.7 }}
                  >
                    Produktbeskrivelse her
                  </p>
                  <div className="flex justify-between items-center">
                    <span 
                      className="font-bold"
                      style={{ 
                        color: settings.product_accent_color,
                        fontSize: `${settings.product_quantity_font_size}px`
                      }}
                    >
                      {idx + 3} stk
                    </span>
                    <span 
                      className="text-xs px-2 py-1 rounded"
                      style={{ 
                        backgroundColor: settings.product_accent_color,
                        color: product.bgColor
                      }}
                    >
                      Klar
                    </span>
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

export default ProductsSettingsTab;
