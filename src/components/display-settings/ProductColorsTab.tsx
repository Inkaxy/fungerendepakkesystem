
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

      {/* Font Size Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📝 Tekststørrelser</CardTitle>
          <p className="text-sm text-gray-600">
            Kontroller størrelsen på tekstelementer i produktvisningen
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <SliderControl
            label="Størrelse på produktnavn"
            value={settings.product_name_font_size}
            onChange={(value) => onUpdate({ product_name_font_size: value })}
            min={14}
            max={48}
            step={2}
            unit="px"
            description="Størrelsen på teksten som viser produktnavnet"
          />
          
          <SliderControl
            label="Størrelse på antall"
            value={settings.product_quantity_font_size}
            onChange={(value) => onUpdate({ product_quantity_font_size: value })}
            min={24}
            max={96}
            step={4}
            unit="px"
            description="Størrelsen på tallet som viser antall produkter"
          />
          
          <SliderControl
            label="Størrelse på enhet (stk, kg)"
            value={settings.product_unit_font_size}
            onChange={(value) => onUpdate({ product_unit_font_size: value })}
            min={12}
            max={48}
            step={2}
            unit="px"
            description="Størrelsen på enhets-teksten ved siden av antallet"
          />
          
          <SliderControl
            label="Størrelse på varelinjer-telling (3/5)"
            value={settings.line_items_count_font_size}
            onChange={(value) => onUpdate({ line_items_count_font_size: value })}
            min={12}
            max={32}
            step={2}
            unit="px"
            description="Størrelsen på tellingen som viser antall varelinjer"
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
          <div className="space-y-4" style={{ gap: `${settings.product_spacing}px` }}>
            {[
              { 
                name: 'Rugbrød', 
                quantity: 45,
                unit: 'stk',
                completed: 3,
                total: 5,
                bgColor: settings.product_1_bg_color,
                textColor: settings.product_1_text_color,
                accentColor: settings.product_1_accent_color
              },
              { 
                name: 'Grovbrød', 
                quantity: 28,
                unit: 'stk',
                completed: 2,
                total: 4,
                bgColor: settings.product_2_bg_color,
                textColor: settings.product_2_text_color,
                accentColor: settings.product_2_accent_color
              },
              { 
                name: 'Kringle', 
                quantity: 12,
                unit: 'kg',
                completed: 1,
                total: 3,
                bgColor: settings.product_3_bg_color,
                textColor: settings.product_3_text_color,
                accentColor: settings.product_3_accent_color
              }
            ].map((product, idx) => (
              <div 
                key={idx}
                className="rounded-lg border transition-all duration-300 hover:shadow-md" 
                style={{ 
                  backgroundColor: product.bgColor,
                  borderRadius: `${settings.border_radius}px`,
                  padding: `${settings.product_card_padding}px`,
                  transform: `scale(${settings.product_card_size / 100})`,
                  transformOrigin: 'top left'
                }}
              >
                <div className="space-y-2">
                  {/* Product Name and Quantity */}
                  <div className="flex justify-between items-start gap-4">
                    <h4 
                      className="leading-tight"
                      style={{ 
                        color: product.textColor,
                        fontSize: `${settings.product_name_font_size}px`,
                        fontWeight: settings.product_name_font_weight
                      }}
                    >
                      {product.name}
                    </h4>
                    <div className="flex items-baseline gap-1 flex-shrink-0">
                      <span 
                        className="font-bold"
                        style={{ 
                          color: product.accentColor,
                          fontSize: `${settings.product_quantity_font_size}px`,
                          fontWeight: settings.product_quantity_font_weight
                        }}
                      >
                        {product.quantity}
                      </span>
                      {settings.show_product_unit && (
                        <span 
                          style={{ 
                            color: product.textColor,
                            fontSize: `${settings.product_unit_font_size}px`,
                            opacity: 0.7
                          }}
                        >
                          {product.unit}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Line Items Count */}
                  {settings.show_line_items_count && (
                    <div className="flex items-center gap-2">
                      <span 
                        style={{ 
                          color: product.textColor,
                          fontSize: `${settings.line_items_count_font_size}px`,
                          opacity: 0.6
                        }}
                      >
                        {product.completed}/{product.total} varelinjer
                      </span>
                    </div>
                  )}
                  
                  {/* Progress Bar */}
                  {settings.show_progress_bar && (
                    <div className="mt-2">
                      <div 
                        className="rounded-full overflow-hidden"
                        style={{ 
                          backgroundColor: settings.progress_background_color,
                          height: `${settings.progress_height}px`
                        }}
                      >
                        <div 
                          className={`h-full transition-all ${
                            settings.progress_animation ? 'animate-pulse' : ''
                          }`}
                          style={{ 
                            backgroundColor: settings.progress_bar_color,
                            width: `${(product.completed / product.total) * 100}%`,
                            transitionDuration: settings.animation_speed === 'slow' ? '2s' : 
                                               settings.animation_speed === 'fast' ? '0.5s' : '1s'
                          }}
                        />
                      </div>
                      {settings.show_progress_percentage && (
                        <p 
                          className="mt-1"
                          style={{ 
                            color: product.textColor, 
                            opacity: 0.7,
                            fontSize: `${settings.line_items_count_font_size}px`
                          }}
                        >
                          {Math.round((product.completed / product.total) * 100)}% ferdig
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  {settings.show_status_badges && (
                    <div className="flex gap-2 mt-2">
                      <span 
                        className="px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: settings.packing_status_ongoing_color,
                          color: product.bgColor,
                          fontSize: `${settings.status_badge_font_size}px`,
                          fontWeight: 600
                        }}
                      >
                        Pågår
                      </span>
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
