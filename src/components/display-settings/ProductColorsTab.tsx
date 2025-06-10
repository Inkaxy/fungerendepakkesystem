
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
      {/* Individual Product Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🎨 Individuell Produktstyling</CardTitle>
          <p className="text-sm text-gray-600">
            Tilpass utseendet for hver produktlinje individuelt. Hver linje kan ha sin egen fargekombinasjon.
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* Product 1 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div 
                className="w-4 h-4 rounded-full border-2"
                style={{ backgroundColor: settings.product_1_bg_color, borderColor: settings.product_1_accent_color }}
              />
              <h3 className="text-base font-semibold">Produktlinje 1</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ColorPicker
                label="🎭 Bakgrunnsfarge"
                value={settings.product_1_bg_color}
                onChange={(color) => onUpdate({ product_1_bg_color: color })}
                description="Bakgrunnsfargen som vises bak produktnavnet"
              />
              <ColorPicker
                label="📝 Tekstfarge"
                value={settings.product_1_text_color}
                onChange={(color) => onUpdate({ product_1_text_color: color })}
                description="Fargen på produktnavnet og beskrivelsen"
              />
              <ColorPicker
                label="✨ Aksent farge"
                value={settings.product_1_accent_color}
                onChange={(color) => onUpdate({ product_1_accent_color: color })}
                description="Fargen på antall og viktige elementer"
              />
            </div>
          </div>

          <Separator />

          {/* Product 2 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div 
                className="w-4 h-4 rounded-full border-2"
                style={{ backgroundColor: settings.product_2_bg_color, borderColor: settings.product_2_accent_color }}
              />
              <h3 className="text-base font-semibold">Produktlinje 2</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ColorPicker
                label="🎭 Bakgrunnsfarge"
                value={settings.product_2_bg_color}
                onChange={(color) => onUpdate({ product_2_bg_color: color })}
                description="Bakgrunnsfargen som vises bak produktnavnet"
              />
              <ColorPicker
                label="📝 Tekstfarge"
                value={settings.product_2_text_color}
                onChange={(color) => onUpdate({ product_2_text_color: color })}
                description="Fargen på produktnavnet og beskrivelsen"
              />
              <ColorPicker
                label="✨ Aksent farge"
                value={settings.product_2_accent_color}
                onChange={(color) => onUpdate({ product_2_accent_color: color })}
                description="Fargen på antall og viktige elementer"
              />
            </div>
          </div>

          <Separator />

          {/* Product 3 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div 
                className="w-4 h-4 rounded-full border-2"
                style={{ backgroundColor: settings.product_3_bg_color, borderColor: settings.product_3_accent_color }}
              />
              <h3 className="text-base font-semibold">Produktlinje 3</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ColorPicker
                label="🎭 Bakgrunnsfarge"
                value={settings.product_3_bg_color}
                onChange={(color) => onUpdate({ product_3_bg_color: color })}
                description="Bakgrunnsfargen som vises bak produktnavnet"
              />
              <ColorPicker
                label="📝 Tekstfarge"
                value={settings.product_3_text_color}
                onChange={(color) => onUpdate({ product_3_text_color: color })}
                description="Fargen på produktnavnet og beskrivelsen"
              />
              <ColorPicker
                label="✨ Aksent farge"
                value={settings.product_3_accent_color}
                onChange={(color) => onUpdate({ product_3_accent_color: color })}
                description="Fargen på antall og viktige elementer"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global Product Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🔧 Globale Produktinnstillinger</CardTitle>
          <p className="text-sm text-gray-600">
            Disse innstillingene påvirker alle produktlinjer samlet
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <SliderControl
            label="📏 Produktkort størrelse"
            value={settings.product_card_size}
            onChange={(value) => onUpdate({ product_card_size: value })}
            min={50}
            max={150}
            unit="%"
            description="Justerer størrelsen på alle produktkortene samtidig"
          />
        </CardContent>
      </Card>

      {/* Product Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">👀 Forhåndsvisning av Produkter</CardTitle>
          <p className="text-sm text-gray-600">
            Slik vil produktene se ut med dine valgte farger og innstillinger
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { 
                name: 'Produktlinje 1', 
                bgColor: settings.product_1_bg_color,
                textColor: settings.product_1_text_color,
                accentColor: settings.product_1_accent_color
              },
              { 
                name: 'Produktlinje 2', 
                bgColor: settings.product_2_bg_color,
                textColor: settings.product_2_text_color,
                accentColor: settings.product_2_accent_color
              },
              { 
                name: 'Produktlinje 3', 
                bgColor: settings.product_3_bg_color,
                textColor: settings.product_3_text_color,
                accentColor: settings.product_3_accent_color
              }
            ].map((product, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-lg border transition-all duration-300 hover:shadow-md" 
                style={{ 
                  backgroundColor: product.bgColor,
                  borderRadius: `${settings.border_radius}px`,
                  transform: `scale(${settings.product_card_size / 100})`,
                  transformOrigin: 'top left'
                }}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: product.accentColor }}
                      />
                      <h4 
                        className="font-medium"
                        style={{ color: product.textColor }}
                      >
                        {product.name}
                      </h4>
                    </div>
                    <span 
                      className="text-sm font-bold px-2 py-1 rounded"
                      style={{ 
                        color: product.bgColor,
                        backgroundColor: product.accentColor
                      }}
                    >
                      {idx + 3}
                    </span>
                  </div>
                  
                  {settings.show_progress_bar && (
                    <div className="mt-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ backgroundColor: settings.progress_background_color }}
                      >
                        <div 
                          className={`h-full rounded-full transition-all ${
                            settings.progress_animation ? 'animate-pulse' : ''
                          }`}
                          style={{ 
                            backgroundColor: settings.progress_bar_color,
                            width: `${(idx + 1) * 25}%`,
                            transitionDuration: settings.animation_speed === 'slow' ? '2s' : 
                                               settings.animation_speed === 'fast' ? '0.5s' : '1s'
                          }}
                        />
                      </div>
                      {settings.show_progress_percentage && (
                        <p 
                          className="text-xs mt-1"
                          style={{ color: product.textColor, opacity: 0.7 }}
                        >
                          {(idx + 1) * 25}% ferdig
                        </p>
                      )}
                    </div>
                  )}
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
