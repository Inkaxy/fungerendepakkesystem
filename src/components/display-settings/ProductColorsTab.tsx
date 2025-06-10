
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
      {/* Individual Product Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Individuell Produktstyling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-gray-600 mb-4">
            Tilpass utseendet for hver produktlinje individuelt
          </p>
          
          {/* Product 1 */}
          <div className="space-y-4">
            <h3 className="text-base font-medium border-b pb-2">Produktlinje 1</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ColorPicker
                label="Bakgrunnsfarge"
                value={settings.product_1_bg_color}
                onChange={(color) => onUpdate({ product_1_bg_color: color })}
                description="Bakgrunn for produktlinje 1"
              />
              <ColorPicker
                label="Tekstfarge"
                value={settings.product_1_text_color}
                onChange={(color) => onUpdate({ product_1_text_color: color })}
                description="Tekst for produktlinje 1"
              />
              <ColorPicker
                label="Aksent farge"
                value={settings.product_1_accent_color}
                onChange={(color) => onUpdate({ product_1_accent_color: color })}
                description="Aksentfarge for produktlinje 1"
              />
            </div>
          </div>

          {/* Product 2 */}
          <div className="space-y-4">
            <h3 className="text-base font-medium border-b pb-2">Produktlinje 2</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ColorPicker
                label="Bakgrunnsfarge"
                value={settings.product_2_bg_color}
                onChange={(color) => onUpdate({ product_2_bg_color: color })}
                description="Bakgrunn for produktlinje 2"
              />
              <ColorPicker
                label="Tekstfarge"
                value={settings.product_2_text_color}
                onChange={(color) => onUpdate({ product_2_text_color: color })}
                description="Tekst for produktlinje 2"
              />
              <ColorPicker
                label="Aksent farge"
                value={settings.product_2_accent_color}
                onChange={(color) => onUpdate({ product_2_accent_color: color })}
                description="Aksentfarge for produktlinje 2"
              />
            </div>
          </div>

          {/* Product 3 */}
          <div className="space-y-4">
            <h3 className="text-base font-medium border-b pb-2">Produktlinje 3</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ColorPicker
                label="Bakgrunnsfarge"
                value={settings.product_3_bg_color}
                onChange={(color) => onUpdate({ product_3_bg_color: color })}
                description="Bakgrunn for produktlinje 3"
              />
              <ColorPicker
                label="Tekstfarge"
                value={settings.product_3_text_color}
                onChange={(color) => onUpdate({ product_3_text_color: color })}
                description="Tekst for produktlinje 3"
              />
              <ColorPicker
                label="Aksent farge"
                value={settings.product_3_accent_color}
                onChange={(color) => onUpdate({ product_3_accent_color: color })}
                description="Aksentfarge for produktlinje 3"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global Product Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Globale Produktinnstillinger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Disse innstillingene gjelder for alle produkter
          </p>
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
                  transform: settings.enable_animations ? 'scale(1)' : 'none'
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
