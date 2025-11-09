
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { PackingCustomer } from '@/hooks/usePackingData';
import { getProductBackgroundColor, getProductTextColor, getProductAccentColor } from '@/utils/displayStyleUtils';

interface CustomerProductsListProps {
  customerPackingData: PackingCustomer;
  settings: DisplaySettings | undefined;
  statusColors: { [key: string]: string };
}

const CustomerProductsList = ({ customerPackingData, settings, statusColors }: CustomerProductsListProps) => {
  return (
    <Card
      style={{
        backgroundColor: settings?.card_background_color || '#ffffff',
        borderColor: settings?.card_border_color || '#e5e7eb',
        borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
        boxShadow: settings?.card_shadow_intensity ? `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)` : undefined
      }}
    >
      <CardContent style={{ padding: `${settings?.product_card_padding || 16}px` }}>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: `${settings?.product_spacing || 16}px`
        }}>
          {customerPackingData.products.map((product, index) => {
            const bgColor = getProductBackgroundColor(settings || {} as any, index);
            const textColor = getProductTextColor(settings || {} as any, index);
            const accentColor = getProductAccentColor(settings || {} as any, index);
            
            return (
              <div 
                key={product.id}
                className="flex justify-between items-center p-4 rounded-lg"
                style={{
                  backgroundColor: bgColor,
                  borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
                  transform: `scale(${(settings?.product_card_size || 100) / 100})`,
                  transformOrigin: 'left center'
                }}
              >
                <div className="flex-1">
                  <h3 
                    className="font-bold mb-1"
                    style={{ 
                      color: textColor,
                      fontSize: `${settings?.product_name_font_size || 24}px`,
                      fontWeight: settings?.product_name_font_weight || 600,
                      textDecoration: (settings?.strikethrough_completed_products && 
                                       product.packing_status === 'completed') 
                                       ? 'line-through' 
                                       : 'none'
                    }}
                  >
                    {product.product_name}
                  </h3>
                </div>
                <div className="text-right space-y-2">
                  <div className="flex items-baseline justify-end gap-1">
                    <span 
                      className="font-bold"
                      style={{ 
                        color: accentColor,
                        fontSize: `${settings?.product_quantity_font_size || 48}px`,
                        fontWeight: settings?.product_quantity_font_weight || 700,
                        textDecoration: (settings?.strikethrough_completed_products && 
                                         product.packing_status === 'completed') 
                                         ? 'line-through' 
                                         : 'none'
                      }}
                    >
                      {product.total_quantity}
                    </span>
                    {settings?.show_product_unit !== false && (
                      <span 
                        style={{ 
                          color: accentColor,
                          fontSize: `${settings?.product_unit_font_size || 24}px`,
                          textDecoration: (settings?.strikethrough_completed_products && 
                                           product.packing_status === 'completed') 
                                           ? 'line-through' 
                                           : 'none'
                        }}
                      >
                        {product.product_unit}
                      </span>
                    )}
                  </div>
                  <div>
                    {settings?.show_line_items_count !== false && (
                      <span 
                        className="font-semibold block mb-1"
                        style={{ 
                          color: textColor,
                          fontSize: `${settings?.line_items_count_font_size || 18}px`
                        }}
                      >
                        {product.packed_line_items}/{product.total_line_items}
                      </span>
                    )}

                    {settings?.show_status_badges !== false && (
                      <Badge 
                        variant={product.packing_status === 'completed' ? 'default' : 'secondary'}
                        style={{
                          backgroundColor: product.packing_status === 'completed' ? statusColors.completed : statusColors.ongoing,
                          color: 'white',
                          fontSize: `${settings?.status_badge_font_size || 14}px`
                        }}
                      >
                        {product.packing_status === 'completed' ? 'Ferdig' : 
                         product.packing_status === 'in_progress' ? 'Pågår' : 'Venter'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerProductsList;
