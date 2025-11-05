
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
      <CardContent className="p-8">
        <div className="space-y-4">
          {customerPackingData.products.map((product, index) => (
            <div 
              key={product.id}
              className="flex justify-between items-center p-4 rounded-lg"
              style={{
                backgroundColor: getProductBackgroundColor(settings || {} as any, index),
                borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
                transform: `scale(${(settings?.product_card_size || 100) / 100})`,
                transformOrigin: 'left center'
              }}
            >
              <div className="flex-1">
                <h3 
                  className="font-bold mb-1"
                  style={{ 
                    color: getProductTextColor(settings || {} as any, index),
                    fontSize: settings?.product_name_font_size 
                      ? `${settings.product_name_font_size}px` 
                      : '24px'
                  }}
                >
                  {product.product_name}
                </h3>
              </div>
              <div className="text-right space-y-2">
                <div 
                  className="font-bold flex items-baseline justify-end gap-1"
                  style={{ 
                    color: getProductAccentColor(settings || {} as any, index),
                  }}
                >
                  <span style={{ 
                    fontSize: settings?.product_quantity_font_size 
                      ? `${settings.product_quantity_font_size}px` 
                      : '48px'
                  }}>
                    {product.total_quantity}
                  </span>
                  <span style={{ 
                    fontSize: settings?.product_unit_font_size 
                      ? `${settings.product_unit_font_size}px` 
                      : '24px'
                  }}>
                    {product.product_unit}
                  </span>
                </div>
                <div className="text-right">
                  <span 
                    className="font-semibold block mb-1"
                    style={{ 
                      color: getProductTextColor(settings || {} as any, index),
                      fontSize: settings?.line_items_count_font_size 
                        ? `${settings.line_items_count_font_size}px` 
                        : '18px'
                    }}
                  >
                    {product.packed_line_items}/{product.total_line_items}
                  </span>
                <Badge 
                  variant={product.packing_status === 'completed' ? 'default' : 'secondary'}
                  style={{
                    backgroundColor: product.packing_status === 'completed' ? statusColors.completed : statusColors.ongoing,
                    color: 'white',
                    fontSize: settings?.status_badge_font_size 
                      ? `${settings.status_badge_font_size}px` 
                      : '14px'
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
