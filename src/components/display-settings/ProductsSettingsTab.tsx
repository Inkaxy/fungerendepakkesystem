
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
      {/* Product Card Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Produktkort Farger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ColorPicker
              label="Kort bakgrunn"
              value={settings.product_card_color}
              onChange={(color) => onUpdate({ product_card_color: color })}
              description="Bakgrunnsfarge for produktkort"
            />
            <ColorPicker
              label="Tekst farge"
              value={settings.product_text_color}
              onChange={(color) => onUpdate({ product_text_color: color })}
              description="Farge på produktnavn og beskrivelse"
            />
            <ColorPicker
              label="Aksent farge"
              value={settings.product_accent_color}
              onChange={(color) => onUpdate({ product_accent_color: color })}
              description="Farge for ikoner og detaljer"
            />
          </div>
        </CardContent>
      </Card>

      {/* Product Card Size */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Produktkort Størrelse</CardTitle>
        </CardHeader>
        <CardContent>
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

      {/* Product Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Forhåndsvisning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg border" style={{ backgroundColor: settings.product_card_color }}>
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
                  Eksempel Produkt
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
                  Antall: 5
                </span>
                <span 
                  className="text-xs px-2 py-1 rounded"
                  style={{ 
                    backgroundColor: settings.product_accent_color,
                    color: settings.product_card_color
                  }}
                >
                  Klar
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsSettingsTab;
