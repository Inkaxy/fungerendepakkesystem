
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ColorPicker from './ColorPicker';
import SliderControl from './SliderControl';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface ProductColorsTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const ProductColorsTab = ({ settings, onUpdate }: ProductColorsTabProps) => {
  return (
    <div className="space-y-6">
      {/* Individual Product Background Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Individuelle Produktbakgrunner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Hver produktlinje kan ha sin egen bakgrunnsfarge i displayet
          </p>
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

      {/* Global Product Text Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Produkttekst og Styling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Disse innstillingene gjelder for alle produkter
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPicker
              label="Produktnavn farge"
              value={settings.product_text_color}
              onChange={(color) => onUpdate({ product_text_color: color })}
              description="Farge på produktnavn i listen"
            />
            <ColorPicker
              label="Antall farge"
              value={settings.product_accent_color}
              onChange={(color) => onUpdate({ product_accent_color: color })}
              description="Farge på antall og detaljer"
            />
          </div>
          <SliderControl
            label="Produktkort størrelse"
            value={settings.product_card_size}
            onChange={(value) => onUpdate({ product_card_size: value })}
            min={50}
            max={150}
            unit="%"
            description="Justerer størrelsen på produktkortene"
          />
        </CardContent>
      </Card>

      {/* Product Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Forhåndsvisning av Produkter</CardTitle>
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
                style={{ 
                  backgroundColor: product.bgColor,
                  borderRadius: `${settings.border_radius}px`
                }}
              >
                <div 
                  className="space-y-2"
                  style={{ 
                    transform: `scale(${settings.product_card_size / 100})`,
                    transformOrigin: 'top left'
                  }}
                >
                  <div className="flex justify-between items-center">
                    <h4 
                      className="font-medium"
                      style={{ color: settings.product_text_color }}
                    >
                      {product.name}
                    </h4>
                    <span 
                      className="text-sm font-bold"
                      style={{ color: settings.product_accent_color }}
                    >
                      {idx + 3}
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

export default ProductColorsTab;
