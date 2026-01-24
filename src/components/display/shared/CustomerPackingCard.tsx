import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { PackingCustomer } from '@/hooks/usePackingData';
import { Customer } from '@/types/database';
import { getProductBackgroundColor, getProductTextColor, getProductAccentColor } from '@/utils/displayStyleUtils';
import { cn } from '@/lib/utils';

interface CustomerPackingCardProps {
  customerData: PackingCustomer;
  customer: Customer;
  settings: DisplaySettings | undefined;
  statusColors: { [key: string]: string };
}

const CustomerPackingCard = React.memo(({ customerData, customer, settings, statusColors }: CustomerPackingCardProps) => {
  // Get card height class based on settings
  const getCardHeightClass = () => {
    switch (settings?.customer_card_height) {
      case 'compact': return 'py-2';
      case 'large': return 'py-6';
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

  // Card style class based on customer_card_style
  const getCardStyleClass = () => {
    switch (settings?.customer_card_style) {
      case 'minimal': return 'border-0 shadow-none';
      case 'bordered': return 'border-2 shadow-none';
      default: return 'shadow-lg';
    }
  };

  // Hover effect based on card_hover_effect
  const hoverClass = settings?.card_hover_effect 
    ? 'hover:scale-[1.02] hover:shadow-2xl transition-all duration-300' 
    : 'transition-shadow';

  return (
    <Card 
      className={cn(getCardStyleClass(), hoverClass)}
      style={{
        backgroundColor: settings?.card_background_color || '#ffffff',
        borderColor: settings?.card_border_color || '#e5e7eb',
        borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
        borderWidth: settings?.card_border_width ? `${settings.card_border_width}px` : undefined,
        boxShadow: settings?.card_shadow_intensity 
          ? `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)` 
          : undefined
      }}
    >
      <CardHeader className={getCardHeightClass()}>
        <div className="flex items-center justify-between mb-2">
          {(settings?.show_status_badges ?? true) && (
            <Badge 
              variant="secondary"
              style={{
                backgroundColor: customerData.overall_status === 'completed' ? statusColors.completed : statusColors.in_progress,
                color: 'white'
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
                color: settings?.card_background_color || '#ffffff'
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
            fontSize: settings?.customer_name_font_size 
              ? `${settings.customer_name_font_size}px` 
              : '1.25rem'
          }}
        >
          {customer.name}
        </CardTitle>
      </CardHeader>
      <CardContent className={getCardHeightClass()}>
        <div className="space-y-3">
          {/* Progress section */}
          {(settings?.show_customer_progress_bar ?? true) && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span style={{ color: settings?.text_color || '#374151' }}>Fremgang:</span>
                <span 
                  className="font-semibold"
                  style={{ color: settings?.product_accent_color || '#3b82f6' }}
                >
                  {customerData.progress_percentage}%
                </span>
              </div>
              <div 
                className="w-full rounded-full h-2 overflow-hidden"
                style={{ backgroundColor: settings?.progress_background_color || '#e5e7eb' }}
              >
                <div 
                  className="h-2 rounded-full"
                  style={{ 
                    backgroundColor: settings?.progress_bar_color || '#3b82f6',
                    width: `${customerData.progress_percentage}%`,
                    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    willChange: 'width',
                  }}
                />
              </div>
              {(settings?.show_line_items_count ?? true) && (
                <div className="text-xs text-center">
                  <span style={{ color: settings?.text_color || '#6b7280' }}>
                    {customerData.packed_line_items_all}/{customerData.total_line_items_all} varelinjer pakket
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Products list */}
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
                  className={`${getProductItemClass()} rounded flex justify-between items-center`}
                  style={{
                    backgroundColor: getProductBackgroundColor(settings || {} as any, product.colorIndex ?? idx % 3),
                    borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.25rem',
                  }}
                >
                  <div className="flex flex-col flex-1">
                    <span 
                      className="font-medium"
                      style={{ 
                        color: getProductTextColor(settings || {} as any, product.colorIndex ?? idx % 3),
                        fontSize: settings?.shared_product_font_size 
                          ? `${settings.shared_product_font_size}px` 
                          : '14px',
                        textDecoration: (settings?.strikethrough_completed_products && 
                                         product.packing_status === 'completed') 
                                         ? 'line-through' 
                                         : 'none'
                      }}
                    >
                      {product.product_name}
                    </span>
                    {(settings?.shared_show_product_quantity ?? true) && (
                      <span 
                        className="font-semibold"
                        style={{ 
                          color: getProductAccentColor(settings || {} as any, product.colorIndex ?? idx % 3),
                          fontSize: settings?.shared_product_font_size 
                            ? `${settings.shared_product_font_size * 1.2}px` 
                            : '16px',
                          textDecoration: (settings?.strikethrough_completed_products && 
                                           product.packing_status === 'completed') 
                                           ? 'line-through' 
                                           : 'none'
                        }}
                      >
                        {product.total_quantity} {product.product_unit}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {(settings?.show_line_items_count ?? true) && (
                      <span 
                        className="text-xs"
                        style={{ color: getProductAccentColor(settings || {} as any, product.colorIndex ?? idx % 3) }}
                      >
                        {product.packed_line_items}/{product.total_line_items}
                      </span>
                    )}
                    {(settings?.show_status_badges ?? true) && (
                      <Badge 
                        variant={product.packing_status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                        style={{
                          backgroundColor: product.packing_status === 'completed' ? statusColors.completed : statusColors.in_progress,
                          color: 'white'
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
}, (prevProps, nextProps) => {
  return (
    prevProps.customerData.progress_percentage === nextProps.customerData.progress_percentage &&
    prevProps.customerData.overall_status === nextProps.customerData.overall_status &&
    prevProps.customerData.products.length === nextProps.customerData.products.length &&
    prevProps.settings?.card_hover_effect === nextProps.settings?.card_hover_effect &&
    prevProps.settings?.customer_card_style === nextProps.settings?.customer_card_style
  );
});

CustomerPackingCard.displayName = 'CustomerPackingCard';

export default CustomerPackingCard;
