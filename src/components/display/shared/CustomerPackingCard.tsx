
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { PackingCustomer } from '@/hooks/usePackingData';
import { Customer } from '@/types/database';
import { getProductBackgroundColor, getProductTextColor, getProductAccentColor } from '@/utils/displayStyleUtils';
import { formatQuantityWithBasket } from '@/utils/basketCalculations';

interface CustomerPackingCardProps {
  customerData: PackingCustomer;
  customer: Customer;
  settings: DisplaySettings | undefined;
  statusColors: { [key: string]: string };
}

const CustomerPackingCard = ({ customerData, customer, settings, statusColors }: CustomerPackingCardProps) => {
  // Get card height class based on settings
  const getCardHeightClass = () => {
    switch (settings?.customer_card_height) {
      case 'compact': return 'py-2';
      case 'extended': return 'py-6';
      default: return 'py-4';
    }
  };

  // Limit products based on max_products_per_card setting
  const maxProducts = settings?.max_products_per_card || 10;
  const displayProducts = customerData.products.slice(0, maxProducts);
  const hasMoreProducts = customerData.products.length > maxProducts;

  // Get product item class based on product_list_style
  const getProductItemClass = () => {
    switch (settings?.product_list_style) {
      case 'compact': return 'text-xs p-1.5';
      default: return 'text-sm p-2';
    }
  };

  return (
    <Card 
      className={`shadow-lg hover:shadow-xl transition-shadow display-card display-typography ${
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
      <CardHeader className={getCardHeightClass()}>
        <div className="flex items-center justify-between mb-2">
          {settings?.show_status_badges && (
            <Badge 
              variant="secondary"
              style={{
                backgroundColor: customerData.overall_status === 'completed' ? statusColors.completed : statusColors.in_progress,
                color: 'white',
                padding: settings?.status_indicator_padding ? `${settings.status_indicator_padding / 4}px ${settings.status_indicator_padding / 2}px` : undefined,
                fontSize: settings?.large_screen_optimization ? `${(settings?.body_font_size || 16) * 1.1}px` : undefined
              }}
            >
              {customerData.overall_status === 'completed' ? 'Ferdig' : 'Pågående'}
            </Badge>
          )}
          {settings?.show_customer_numbers && customer.customer_number && (
            <Badge 
              variant="outline"
              style={{
                backgroundColor: settings?.product_accent_color || '#f3f4f6',
                color: settings?.card_background_color || '#ffffff',
                padding: settings?.status_indicator_padding ? `${settings.status_indicator_padding / 4}px ${settings.status_indicator_padding / 2}px` : undefined,
                fontSize: settings?.large_screen_optimization ? `${(settings?.body_font_size || 16) * 1.1}px` : undefined
              }}
            >
              {customer.customer_number}
            </Badge>
          )}
        </div>
        <CardTitle 
          className="text-xl text-center mb-3"
          style={{ 
            color: settings?.header_text_color || '#111827',
            fontSize: settings?.header_font_size ? `${Math.min(settings.header_font_size * 0.6, 24)}px` : '1.25rem',
            fontWeight: settings?.large_screen_optimization ? '700' : '600',
            textShadow: settings?.large_screen_optimization && settings?.text_shadow_enabled ? 
              `${settings.text_shadow_offset_x}px ${settings.text_shadow_offset_y}px ${settings.text_shadow_blur}px ${settings.text_shadow_color}` : 'none'
          }}
        >
          {customer.name}
        </CardTitle>
      </CardHeader>
      <CardContent className={getCardHeightClass()}>
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span style={{ color: settings?.text_color || '#374151' }}>Fremgang (alle varer):</span>
              <span 
                className="font-semibold"
                style={{ color: settings?.product_accent_color || '#3b82f6' }}
              >
                {customerData.progress_percentage}%
              </span>
            </div>
            {settings?.show_progress_bar && (
              <div 
                className="w-full rounded-full h-2 relative"
                style={{ backgroundColor: settings?.progress_background_color || '#e5e7eb' }}
              >
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    settings?.progress_animation ? 'display-progress-animated' : ''
                  } ${settings?.enable_animations ? 'display-progress-fill' : ''}`}
                  style={{ 
                    backgroundColor: settings?.progress_bar_color || '#3b82f6',
                    width: `${customerData.progress_percentage}%`,
                    '--progress-width': `${customerData.progress_percentage}%`
                  } as React.CSSProperties & { [key: string]: string }}
                />
                {settings?.show_truck_icon && (
                  <img 
                    src="/lovable-uploads/37c33860-5f09-44ea-a64c-a7e7fb7c925b.png"
                    alt="Varebil"
                    className="absolute top-1/2 transform -translate-y-1/2" 
                    style={{ 
                      left: `${customerData.progress_percentage}%`, 
                      marginLeft: `-${(settings?.truck_icon_size || 24) / 2}px`,
                      width: `${settings?.truck_icon_size || 24}px`,
                      height: `${settings?.truck_icon_size || 24}px`,
                      objectFit: 'contain'
                    }}
                  />
                )}
              </div>
            )}
            {settings?.show_line_items_count && (
              <div className="text-xs text-center">
                <span style={{ color: settings?.text_color || '#6b7280' }}>
                  {customerData.packed_line_items_all}/{customerData.total_line_items_all} varelinjer pakket
                </span>
              </div>
            )}
          </div>

          <div>
            <h4 
              className="text-sm font-medium mb-2"
              style={{ color: settings?.text_color || '#374151' }}
            >
              Produkter:
            </h4>
            <div className="space-y-1">
              {displayProducts.map((product, idx) => (
                <div 
                  key={product.id} 
                  className={`${getProductItemClass()} rounded flex justify-between items-center ${
                    settings?.enable_animations ? 'display-scale-hover display-fade-transitions' : ''
                  } ${settings?.touch_friendly_sizes ? 'touch-friendly' : ''}`}
                  style={{
                    backgroundColor: getProductBackgroundColor(settings || {} as any, idx % 3),
                    borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.25rem',
                    ...(settings?.touch_friendly_sizes && {
                      minHeight: `${settings.touch_target_size}px`
                    })
                  }}
                >
                  <div className="flex flex-col flex-1">
                    <span 
                      className="font-medium"
                      style={{ color: getProductTextColor(settings || {} as any, idx % 3) }}
                    >
                      {product.product_name}
                    </span>
                    <span 
                      className="text-xs font-semibold"
                      style={{ color: getProductAccentColor(settings || {} as any, idx % 3) }}
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
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {settings?.show_line_items_count && (
                      <span 
                        className="text-xs"
                        style={{ color: getProductAccentColor(settings || {} as any, idx % 3) }}
                      >
                        {product.packed_line_items}/{product.total_line_items}
                      </span>
                    )}
                    {settings?.show_status_badges && (
                      <Badge 
                        variant={product.packing_status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                        style={{
                          backgroundColor: product.packing_status === 'completed' ? statusColors.completed : statusColors.in_progress,
                          color: 'white',
                          padding: settings?.status_indicator_padding ? `${settings.status_indicator_padding / 6}px ${settings.status_indicator_padding / 3}px` : undefined,
                          fontSize: settings?.large_screen_optimization ? `${(settings?.body_font_size || 16) * 0.85}px` : undefined
                        }}
                      >
                        {product.packing_status === 'completed' ? 'Ferdig' : 
                         product.packing_status === 'in_progress' ? 'Pågår' : 'Venter'}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              {hasMoreProducts && (
                <div 
                  className="text-xs text-center py-1"
                  style={{ color: settings?.text_color || '#6b7280', opacity: 0.7 }}
                >
                  ... og {customerData.products.length - maxProducts} flere produkter
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerPackingCard;
