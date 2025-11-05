
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ColorPicker from './ColorPicker';
import SliderControl from './SliderControl';
import PresetSelector from './PresetSelector';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { getProductBackgroundColor, getProductTextColor, getProductAccentColor } from '@/utils/displayStyleUtils';

interface ProductsSettingsTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const ProductsSettingsTab = ({ settings, onUpdate }: ProductsSettingsTabProps) => {
  return (
    <div className="space-y-6">
      {/* Smart Presets */}
      <PresetSelector onApplyPreset={onUpdate} />

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
          <CardTitle className="text-lg">🎨 Forhåndsvisning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { 
                name: 'Rugbrød', 
                quantity: 85,
                unit: 'stk',
                packedLines: 12,
                totalLines: 15,
                status: 'completed' as const,
                index: 0
              },
              { 
                name: 'Grovbrød', 
                quantity: 45,
                unit: 'stk',
                packedLines: 8,
                totalLines: 12,
                status: 'in_progress' as const,
                index: 1
              },
              { 
                name: 'Kringle', 
                quantity: 24,
                unit: 'kg',
                packedLines: 0,
                totalLines: 8,
                status: 'pending' as const,
                index: 2
              }
            ].map((product) => {
              const bgColor = getProductBackgroundColor(settings, product.index);
              const textColor = getProductTextColor(settings, product.index);
              const accentColor = getProductAccentColor(settings, product.index);
              
              return (
                <div 
                  key={product.index}
                  className="p-4 rounded-lg border" 
                  style={{ 
                    backgroundColor: bgColor,
                    borderRadius: `${settings.border_radius}px`,
                    transform: `scale(${settings.product_card_size / 100})`,
                    transformOrigin: 'top left'
                  }}
                >
                  <div className="flex justify-between items-center">
                    {/* Venstre side: Produktnavn */}
                    <div className="flex-1">
                      <h4 
                        className="font-bold"
                        style={{ 
                          color: textColor,
                          fontSize: `${settings.product_name_font_size}px`
                        }}
                      >
                        {product.name}
                      </h4>
                    </div>

                    {/* Høyre side: Antall, enhet, varelinjer, status */}
                    <div className="text-right space-y-2">
                      {/* Antall og enhet */}
                      <div className="flex items-baseline justify-end gap-1">
                        <span 
                          className="font-bold"
                          style={{ 
                            color: accentColor,
                            fontSize: `${settings.product_quantity_font_size}px`
                          }}
                        >
                          {product.quantity}
                        </span>
                        <span 
                          style={{ 
                            color: accentColor,
                            fontSize: `${settings.product_unit_font_size}px`
                          }}
                        >
                          {product.unit}
                        </span>
                      </div>

                      {/* Varelinjer telling */}
                      <div>
                        <span 
                          className="font-semibold block mb-1"
                          style={{ 
                            color: textColor,
                            fontSize: `${settings.line_items_count_font_size}px`
                          }}
                        >
                          {product.packedLines}/{product.totalLines}
                        </span>

                        {/* Status badge */}
                        <span 
                          className="inline-block px-2 py-1 rounded"
                          style={{
                            backgroundColor: product.status === 'completed' 
                              ? settings.packing_status_completed_color 
                              : settings.packing_status_ongoing_color,
                            color: 'white',
                            fontSize: `${settings.status_badge_font_size || 14}px`
                          }}
                        >
                          {product.status === 'completed' ? 'Ferdig' : 
                           product.status === 'in_progress' ? 'Pågår' : 'Venter'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-muted/50 rounded text-sm text-muted-foreground">
            💡 Denne forhåndsvisningen reflekterer alle dine innstillinger: produktnavn, antall, enhet, varelinjer-telling og status badge.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsSettingsTab;
