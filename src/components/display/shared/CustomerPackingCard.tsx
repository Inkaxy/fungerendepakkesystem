
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { PackingCustomer } from '@/hooks/usePackingData';
import { Customer } from '@/types/database';
import { getProductBackgroundColor, getProductTextColor, getProductAccentColor } from '@/utils/displayStyleUtils';

interface CustomerPackingCardProps {
  customerData: PackingCustomer;
  customer: Customer;
  settings: DisplaySettings | undefined;
  statusColors: { [key: string]: string };
}

const CustomerPackingCard = ({ customerData, customer, settings, statusColors }: CustomerPackingCardProps) => {
  return (
    <Card 
      className="shadow-lg hover:shadow-xl transition-shadow"
      style={{
        backgroundColor: settings?.card_background_color || '#ffffff',
        borderColor: settings?.card_border_color || '#e5e7eb',
        borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
        boxShadow: settings?.card_shadow_intensity ? `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)` : undefined
      }}
    >
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge 
            variant="secondary"
            style={{
              backgroundColor: customerData.overall_status === 'completed' ? statusColors.completed : statusColors.in_progress,
              color: 'white'
            }}
          >
            {customerData.overall_status === 'completed' ? 'Ferdig' : 'Pågående'}
          </Badge>
          <Badge 
            variant="outline"
            style={{
              backgroundColor: settings?.product_accent_color || '#f3f4f6',
              color: settings?.card_background_color || '#ffffff'
            }}
          >
            {customer.customer_number || 'Ingen nr.'}
          </Badge>
        </div>
        <CardTitle 
          className="text-xl text-center mb-3"
          style={{ 
            color: settings?.header_text_color || '#111827',
            fontSize: settings?.header_font_size ? `${Math.min(settings.header_font_size * 0.6, 24)}px` : '1.25rem'
          }}
        >
          {customer.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
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
            <div 
              className="w-full rounded-full h-2"
              style={{ backgroundColor: settings?.progress_background_color || '#e5e7eb' }}
            >
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  backgroundColor: settings?.progress_bar_color || '#3b82f6',
                  width: `${customerData.progress_percentage}%`
                }}
              />
            </div>
            <div className="text-xs text-center">
              <span style={{ color: settings?.text_color || '#6b7280' }}>
                {customerData.packed_line_items_all}/{customerData.total_line_items_all} varelinjer pakket
              </span>
            </div>
          </div>

          <div>
            <h4 
              className="text-sm font-medium mb-2"
              style={{ color: settings?.text_color || '#374151' }}
            >
              Produkter:
            </h4>
            <div className="space-y-1">
              {customerData.products.map((product, idx) => (
                <div 
                  key={product.id} 
                  className="text-sm p-2 rounded flex justify-between items-center"
                  style={{
                    backgroundColor: getProductBackgroundColor(settings || {} as any, idx % 3),
                    borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.25rem',
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
                      {product.total_quantity} {product.product_unit}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span 
                      className="text-xs"
                      style={{ color: getProductAccentColor(settings || {} as any, idx % 3) }}
                    >
                      {product.packed_line_items}/{product.total_line_items}
                    </span>
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerPackingCard;
