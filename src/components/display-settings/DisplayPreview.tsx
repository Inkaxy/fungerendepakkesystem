
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Clock } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { generateDisplayStyles, getProductBackgroundColor, getProductTextColor, getProductAccentColor } from '@/utils/displayStyleUtils';

interface DisplayPreviewProps {
  settings: DisplaySettings;
}

const DisplayPreview = ({ settings }: DisplayPreviewProps) => {
  const styles = generateDisplayStyles(settings);

  // Mock data for a single customer display
  const mockCustomer = {
    name: 'Borgheim Bakeri AS',
    progress_percentage: 67,
    overall_status: 'in_progress',
    packed_line_items_all: 4,
    total_line_items_all: 6,
    products: [
      { 
        id: '1', 
        product_name: 'Rundstykker', 
        total_quantity: 45, 
        product_unit: 'stk', 
        packed_line_items: 2, 
        total_line_items: 3, 
        packing_status: 'in_progress' 
      },
      { 
        id: '2', 
        product_name: 'Croissant', 
        total_quantity: 12, 
        product_unit: 'stk', 
        packed_line_items: 1, 
        total_line_items: 1, 
        packing_status: 'completed' 
      },
      { 
        id: '3', 
        product_name: 'Grovbrød', 
        total_quantity: 8, 
        product_unit: 'stk', 
        packed_line_items: 1, 
        total_line_items: 2, 
        packing_status: 'in_progress' 
      }
    ]
  };

  const isAllPacked = mockCustomer.progress_percentage >= 100;

  return (
    <div className="h-full">
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Live Forhåndsvisning</CardTitle>
          <p className="text-sm text-gray-600">Slik vil kunde-displayet se ut</p>
        </CardHeader>
        <CardContent className="p-0">
          <div 
            className={`relative h-[700px] overflow-y-auto rounded-b-lg display-typography ${
              settings.enable_animations ? 'display-fade-transitions' : ''
            } ${settings.text_shadow_enabled ? 'display-text-shadow' : ''}`}
            style={{
              ...styles,
              fontSize: `${settings.body_font_size}px`,
              fontFamily: settings.font_family,
              lineHeight: settings.line_height,
              ...(settings.text_shadow_enabled && {
                textShadow: `${settings.text_shadow_offset_x}px ${settings.text_shadow_offset_y}px ${settings.text_shadow_blur}px ${settings.text_shadow_color}`
              })
            }}
          >
            {/* Header with refresh button */}
            <div className="flex justify-between items-start mb-6">
              <div className="text-center flex-1">
                <h1 
                  className="font-bold mb-2"
                  style={{ 
                    fontSize: `${Math.min(settings.header_font_size * 0.6, 28)}px`,
                    color: settings.header_text_color
                  }}
                >
                  {mockCustomer.name}
                </h1>
                <p 
                  className="text-sm"
                  style={{ 
                    color: settings.text_color,
                    fontSize: `${Math.max(settings.body_font_size * 0.9, 14)}px`
                  }}
                >
                  Pakkestatus
                </p>
              </div>
              <RefreshCw className="h-4 w-4 text-gray-400" />
            </div>

            {/* Date indicator */}
            <Card 
              className={`mb-6 display-card ${settings.enable_animations ? 'animated' : ''}`}
              style={{
                backgroundColor: settings.card_background_color,
                borderColor: settings.card_border_color,
                borderRadius: `${settings.border_radius}px`,
                boxShadow: `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)`,
              }}
            >
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4" style={{ color: settings.text_color }} />
                  <span 
                    className="text-sm"
                    style={{ color: settings.text_color }}
                  >
                    12.06.2025
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Products List */}
            <Card
              className="mb-6"
              style={{
                backgroundColor: settings.card_background_color,
                borderColor: settings.card_border_color,
                borderRadius: `${settings.border_radius}px`,
                boxShadow: `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)`,
              }}
            >
              <CardContent className="p-6">
                <div className="space-y-3">
                  {mockCustomer.products.map((product, index) => (
                    <div 
                      key={product.id}
                      className={`flex justify-between items-center p-3 rounded-lg ${
                        settings.enable_animations ? 'display-scale-hover display-fade-transitions' : ''
                      } ${settings.touch_friendly_sizes ? 'touch-friendly' : ''}`}
                      style={{
                        backgroundColor: getProductBackgroundColor(settings, index),
                        borderRadius: `${settings.border_radius}px`,
                        transform: `scale(${(settings.product_card_size || 100) / 100})`,
                        transformOrigin: 'left center',
                        ...(settings.touch_friendly_sizes && {
                          minHeight: `${settings.touch_target_size}px`
                        })
                      }}
                    >
                      <div className="flex-1">
                        <h3 
                          className="font-bold mb-1"
                          style={{ 
                            color: getProductTextColor(settings, index),
                            fontSize: `${Math.max(settings.body_font_size * 1.2, 16)}px`
                          }}
                        >
                          {product.product_name}
                        </h3>
                      </div>
                      <div className="text-right space-y-1">
                        <div 
                          className="text-xl font-bold"
                          style={{ color: getProductAccentColor(settings, index) }}
                        >
                          {product.total_quantity} {product.product_unit}
                        </div>
                        <div className="text-right">
                          <span 
                            className="text-sm font-semibold block mb-1"
                            style={{ color: getProductTextColor(settings, index) }}
                          >
                            {product.packed_line_items}/{product.total_line_items}
                          </span>
                          <Badge 
                            variant={product.packing_status === 'completed' ? 'default' : 'secondary'}
                            className="text-xs"
                            style={{
                              backgroundColor: product.packing_status === 'completed' ? settings.packing_status_completed_color : settings.packing_status_ongoing_color,
                              color: 'white'
                            }}
                          >
                            {product.packing_status === 'completed' ? 'Ferdig' : 'Pågår'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status Indicator */}
            {settings.show_status_indicator && (
              <Card
                className="mb-6 text-center"
                style={{
                  backgroundColor: isAllPacked ? settings.packing_status_completed_color : settings.packing_status_ongoing_color,
                  borderColor: isAllPacked ? settings.packing_status_completed_color : settings.packing_status_ongoing_color,
                  borderRadius: `${settings.border_radius}px`,
                }}
              >
                <CardContent 
                  style={{ 
                    padding: `${settings.status_indicator_padding}px` 
                  }}
                >
                  <h2 
                    className="font-bold text-white"
                    style={{ 
                      fontSize: `${Math.min(settings.status_indicator_font_size * 0.6, 20)}px`
                    }}
                  >
                    STATUS: {isAllPacked ? 'Ferdig Pakket' : 'Pågående'}
                  </h2>
                </CardContent>
              </Card>
            )}

            {/* Progress Bar */}
            {settings.show_progress_bar && (
              <Card
                className="mb-6"
                style={{
                  backgroundColor: settings.card_background_color,
                  borderColor: settings.card_border_color,
                  borderRadius: `${settings.border_radius}px`,
                  boxShadow: `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)`
                }}
              >
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div 
                      className="w-full rounded-full relative"
                      style={{ 
                        backgroundColor: settings.progress_background_color,
                        height: `${Math.max(settings.progress_height * 2, 16)}px`
                      }}
                    >
                      <div 
                        className={`rounded-full transition-all duration-300 ${
                          settings.progress_animation ? 'display-progress-animated' : ''
                        } ${settings.enable_animations ? 'display-progress-fill' : ''}`}
                        style={{ 
                          backgroundColor: settings.progress_bar_color,
                          height: `${Math.max(settings.progress_height * 2, 16)}px`,
                          width: `${mockCustomer.progress_percentage}%`,
                          '--progress-width': `${mockCustomer.progress_percentage}%`
                        } as React.CSSProperties & { [key: string]: string }}
                      />
                      {settings.show_truck_icon && (
                        <img 
                          src="/lovable-uploads/37c33860-5f09-44ea-a64c-a7e7fb7c925b.png"
                          alt="Varebil"
                          className="absolute top-1/2 transform -translate-y-1/2" 
                          style={{ 
                            left: `${mockCustomer.progress_percentage}%`, 
                            marginLeft: `-${(settings.truck_icon_size || 24) / 2}px`,
                            width: `${Math.max(settings.truck_icon_size * 0.8, 16)}px`,
                            height: `${Math.max(settings.truck_icon_size * 0.8, 16)}px`,
                            objectFit: 'contain'
                          }}
                        />
                      )}
                    </div>
                    {settings.show_progress_percentage && (
                      <div className="text-center">
                        <span 
                          className="text-xl font-bold"
                          style={{ color: settings.text_color }}
                        >
                          {mockCustomer.progress_percentage}%
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

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
                Automatisk oppdatering hvert 30. sekund
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DisplayPreview;
