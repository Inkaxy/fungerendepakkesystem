
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { PackingCustomer } from '@/hooks/usePackingData';
import { getProductBackgroundColor, getProductTextColor, getProductAccentColor } from '@/utils/displayStyleUtils';
import { formatQuantityWithBasket } from '@/utils/basketCalculations';

interface CustomerProductsListProps {
  customerPackingData: PackingCustomer;
  settings: DisplaySettings | undefined;
  statusColors: { [key: string]: string };
}

const CustomerProductsList = ({ customerPackingData, settings, statusColors }: CustomerProductsListProps) => {
  return (
    <Card
      className={`display-card display-typography ${
        settings?.enable_animations ? 'animated display-fade-transitions' : ''
      } ${settings?.text_shadow_enabled ? 'display-text-shadow' : ''}`}
      style={{
        backgroundColor: settings?.card_background_color || '#ffffff',
        borderColor: settings?.card_border_color || '#e5e7eb',
        borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
        boxShadow: settings?.card_shadow_intensity ? `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)` : undefined,
        fontFamily: settings?.font_family || 'Inter',
        lineHeight: settings?.line_height || 1.5,
        ...(settings?.text_shadow_enabled && {
          textShadow: `${settings.text_shadow_offset_x}px ${settings.text_shadow_offset_y}px ${settings.text_shadow_blur}px ${settings.text_shadow_color}`
        })
      }}
    >
      <CardContent className="p-8">
        <div className="space-y-4">
          {customerPackingData.products.map((product, index) => (
            <div 
              key={product.id}
              className={`flex justify-between items-center p-4 rounded-lg ${
                settings?.enable_animations ? 'display-scale-hover display-fade-transitions' : ''
              } ${settings?.touch_friendly_sizes ? 'touch-friendly' : ''}`}
              style={{
                backgroundColor: getProductBackgroundColor(settings || {} as any, index),
                borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
                transform: `scale(${(settings?.product_card_size || 100) / 100})`,
                transformOrigin: 'left center',
                ...(settings?.touch_friendly_sizes && {
                  minHeight: `${settings.touch_target_size}px`
                })
              }}
            >
              <div className="flex-1">
                <h3 
                  className="font-bold mb-1"
                  style={{ 
                    color: getProductTextColor(settings || {} as any, index),
                    fontSize: settings?.body_font_size ? `${settings.body_font_size * 1.5}px` : '1.5rem'
                  }}
                >
                  {product.product_name}
                </h3>
              </div>
              <div className="text-right space-y-2">
                <div 
                  className="text-3xl font-bold"
                  style={{ color: getProductAccentColor(settings || {} as any, index) }}
                >
                  {settings?.show_basket_quantity && product.basket_quantity
                    ? formatQuantityWithBasket(
                        product.total_quantity,
                        product.basket_quantity,
                        settings.basket_display_format || 'total_first',
                        product.product_unit || 'stk'
                      )
                    : `${product.total_quantity} ${product.product_unit}`
                  }
                </div>
                <div className="text-right">
                  <span 
                    className="text-lg font-semibold block mb-1"
                    style={{ color: getProductTextColor(settings || {} as any, index) }}
                  >
                    {product.packed_line_items}/{product.total_line_items}
                  </span>
                  <Badge 
                    variant={product.packing_status === 'completed' ? 'default' : 'secondary'}
                    style={{
                      backgroundColor: product.packing_status === 'completed' ? statusColors.completed : statusColors.ongoing,
                      color: 'white'
                    }}
                  >
                    {product.packing_status === 'completed' ? 'Ferdig' : 
                     product.packing_status === 'in_progress' ? 'Pågår' : 'Venter'}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerProductsList;
