
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ColorPicker from './ColorPicker';
import SliderControl from './SliderControl';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import BasketQuantitySettingsCard from './BasketQuantitySettingsCard';

interface ProductsSettingsTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const ProductsSettingsTab = ({ settings, onUpdate }: ProductsSettingsTabProps) => {
  return (
    <div className="space-y-6">
      <BasketQuantitySettingsCard settings={settings} onUpdate={onUpdate} />
      {/* General Product Card Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generelle Produktkort Innstillinger</CardTitle>
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
                      className="text-sm font-medium"
                      style={{ color: settings.product_accent_color }}
                    >
                      Antall: {idx + 3}
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
