
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { generateDisplayStyles, getProductBackgroundColor, getProductTextColor, getProductAccentColor } from '@/utils/displayStyleUtils';

interface DisplayPreviewProps {
  settings: DisplaySettings;
}

const DisplayPreview = ({ settings }: DisplayPreviewProps) => {
  const styles = generateDisplayStyles(settings);
  const mockProgress = 67; // Mock progress percentage for preview

  const products = [
    { name: 'Rundstykker', quantity: 45, status: 'pending' },
    { name: 'Croissant', quantity: 12, status: 'in_progress' },
    { name: 'Grovbrød', quantity: 8, status: 'completed' }
  ];

  return (
    <div className="h-full">
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Live Forhåndsvisning</CardTitle>
          <p className="text-sm text-gray-600">Slik vil displayet se ut</p>
        </CardHeader>
        <CardContent className="p-0">
          <div 
            className="relative h-[600px] overflow-y-auto rounded-b-lg p-4"
            style={{
              ...styles,
              fontSize: `${settings.body_font_size}px`,
            }}
          >
            {/* Header with customer name */}
            {settings.always_show_customer_name && (
              <div className="flex justify-between items-center mb-4">
                <div className="text-center flex-1">
                  <h1 
                    className="font-bold mb-2"
                    style={{ 
                      fontSize: `${Math.min(settings.header_font_size * 0.8, 28)}px`,
                      color: settings.header_text_color
                    }}
                  >
                    Borgheim Bakeri AS
                  </h1>
                  <p 
                    className="text-sm"
                    style={{ 
                      color: settings.text_color,
                      opacity: 0.8
                    }}
                  >
                    Leveringsdato: 10. juni 2025
                  </p>
                </div>
                <RefreshCw className="h-4 w-4 text-gray-400" />
              </div>
            )}

            {/* STATUS Indicator - Show if enabled */}
            {settings.show_status_indicator && (
              <div
                className="text-center mb-4"
                style={{
                  backgroundColor: mockProgress >= 100 ? settings.packing_status_completed_color : settings.packing_status_ongoing_color,
                  borderRadius: `${settings.border_radius}px`,
                  padding: `${Math.max(settings.status_indicator_padding / 6, 12)}px`,
                }}
              >
                <h2 
                  className="font-bold text-white"
                  style={{ fontSize: `${Math.max(settings.status_indicator_font_size / 3, 16)}px` }}
                >
                  STATUS: {mockProgress >= 100 ? 'Ferdig Pakket' : 'Pågående'}
                </h2>
              </div>
            )}

            {/* Active Products indicator */}
            <div
              className="text-center mb-3 p-2 rounded"
              style={{
                backgroundColor: settings.product_accent_color,
                borderRadius: `${settings.border_radius}px`,
              }}
            >
              <h2 
                className="font-bold text-white text-sm"
              >
                Aktive Produkter for Pakking
              </h2>
            </div>

            {/* Products List */}
            <div
              className="p-3 rounded mb-3"
              style={{
                backgroundColor: settings.card_background_color,
                borderColor: settings.card_border_color,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: `${settings.border_radius}px`,
                boxShadow: `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)`,
                transform: `scale(${Math.min(settings.product_card_size / 100, 0.9)})`,
                transformOrigin: 'top left'
              }}
            >
              <div className="space-y-2">
                {products.map((product, idx) => (
                  <div key={idx} className="space-y-1">
                    <div
                      className="flex justify-between items-center p-2 rounded"
                      style={{
                        backgroundColor: getProductBackgroundColor(settings, idx),
                        borderRadius: `${settings.border_radius}px`,
                      }}
                    >
                      <div className="flex-1">
                        <span 
                          className="text-sm font-medium block"
                          style={{ color: getProductTextColor(settings, idx) }}
                        >
                          {product.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span 
                          className="text-lg font-bold block"
                          style={{ color: getProductAccentColor(settings, idx) }}
                        >
                          {product.quantity} stk
                        </span>
                        <span 
                          className="text-xs"
                          style={{ color: getProductTextColor(settings, idx) }}
                        >
                          2/3
                        </span>
                      </div>
                    </div>
                    {/* Product status badge */}
                    <div className="text-center">
                      <Badge 
                        variant={product.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                        style={{
                          backgroundColor: product.status === 'completed' ? settings.packing_status_completed_color : 
                                           product.status === 'in_progress' ? settings.packing_status_ongoing_color : 
                                           '#f59e0b',
                          color: 'white'
                        }}
                      >
                        {product.status === 'completed' ? 'Ferdig' : 
                         product.status === 'in_progress' ? 'Pågår' : 'Venter'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Bar - Only show if enabled */}
            {settings.show_progress_bar && (
              <div
                className="p-3 rounded mb-3"
                style={{
                  backgroundColor: settings.card_background_color,
                  borderColor: settings.card_border_color,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderRadius: `${settings.border_radius}px`,
                  boxShadow: `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)`,
                }}
              >
                <div className="space-y-2">
                  <div className="text-center mb-2">
                    <p 
                      className="text-xs"
                      style={{ color: settings.text_color }}
                    >
                      Pakking fremgang: 2 av 3 produkter ferdig
                    </p>
                  </div>
                  <div 
                    className="w-full rounded-full relative"
                    style={{ 
                      backgroundColor: settings.progress_background_color,
                      height: `${Math.max(settings.progress_height / 3, 6)}px`
                    }}
                  >
                    <div 
                      className={`rounded-full transition-all ${settings.progress_animation ? 'animate-pulse' : ''}`}
                      style={{ 
                        backgroundColor: settings.progress_bar_color,
                        height: `${Math.max(settings.progress_height / 3, 6)}px`,
                        width: `${mockProgress}%`,
                        transitionDuration: settings.animation_speed === 'slow' ? '2s' : 
                                           settings.animation_speed === 'fast' ? '0.5s' : '1s'
                      }}
                    />
                    {/* Bread Van Icon */}
                    {settings.show_truck_icon && (
                      <img 
                        src="/lovable-uploads/b3ac9345-de05-4c43-b926-5de697d66cce.png"
                        alt="Varebil"
                        className="absolute top-1/2 transform -translate-y-1/2" 
                        style={{ 
                          left: `${mockProgress}%`, 
                          marginLeft: `-${Math.max(settings.truck_icon_size / 6, 4)}px`,
                          width: `${Math.max(settings.truck_icon_size / 3, 8)}px`,
                          height: `${Math.max(settings.truck_icon_size / 3, 8)}px`,
                          objectFit: 'contain'
                        }}
                      />
                    )}
                  </div>
                  {settings.show_progress_percentage && (
                    <div className="text-center">
                      <span 
                        className="text-sm font-bold"
                        style={{ color: settings.text_color }}
                      >
                        {mockProgress}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Completion Status - Show if all packed */}
            {mockProgress >= 100 && settings.show_status_indicator && (
              <div
                className="text-center mb-3"
                style={{
                  backgroundColor: settings.packing_status_completed_color,
                  borderRadius: `${settings.border_radius}px`,
                  padding: `${Math.max(settings.status_indicator_padding / 6, 12)}px`,
                }}
              >
                <h2 
                  className="font-bold text-white"
                  style={{ fontSize: `${Math.max(settings.status_indicator_font_size / 3, 16)}px` }}
                >
                  STATUS: Ferdig Pakket
                </h2>
              </div>
            )}

            {/* Summary information */}
            <div
              className="p-2 rounded text-center mb-3"
              style={{
                backgroundColor: settings.card_background_color,
                borderColor: settings.card_border_color,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: `${settings.border_radius}px`,
                boxShadow: `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)`,
              }}
            >
              <div className="space-y-1">
                <p 
                  className="text-xs"
                  style={{ color: settings.text_color }}
                >
                  Totalt 65 stk bestilt
                </p>
                <p 
                  className="text-xs font-semibold"
                  style={{ color: settings.text_color }}
                >
                  45 stk pakket
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center">
              <p 
                className="text-xs"
                style={{ color: settings.text_color, opacity: 0.6 }}
              >
                Sist oppdatert: 14:23:45
              </p>
              <p 
                className="text-xs mt-1"
                style={{ color: settings.text_color, opacity: 0.5 }}
              >
                Automatisk oppdatering hvert 30. sekund • Viser kun aktive produkter
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DisplayPreview;
