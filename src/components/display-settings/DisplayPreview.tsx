
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Users, Package, Calendar } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { generateDisplayStyles, getProductBackgroundColor, getProductTextColor, getProductAccentColor } from '@/utils/displayStyleUtils';

interface DisplayPreviewProps {
  settings: DisplaySettings;
}

const DisplayPreview = ({ settings }: DisplayPreviewProps) => {
  const styles = generateDisplayStyles(settings);
  const mockProgress = 67; // Mock progress percentage for preview

  const mockCustomers = [
    {
      id: '1',
      name: 'Borgheim Bakeri AS',
      customer_number: 'K001',
      progress_percentage: 75,
      overall_status: 'in_progress',
      packed_line_items_all: 6,
      total_line_items_all: 8,
      products: [
        { id: '1', product_name: 'Rundstykker', total_quantity: 45, product_unit: 'stk', packed_line_items: 2, total_line_items: 3, packing_status: 'in_progress' },
        { id: '2', product_name: 'Croissant', total_quantity: 12, product_unit: 'stk', packed_line_items: 1, total_line_items: 1, packing_status: 'completed' }
      ]
    },
    {
      id: '2',
      name: 'Sentrum Bakeri',
      customer_number: 'K002',
      progress_percentage: 100,
      overall_status: 'completed',
      packed_line_items_all: 4,
      total_line_items_all: 4,
      products: [
        { id: '3', product_name: 'Grovbrød', total_quantity: 8, product_unit: 'stk', packed_line_items: 1, total_line_items: 1, packing_status: 'completed' }
      ]
    }
  ];

  const totalActiveProducts = mockCustomers.reduce((sum, customer) => 
    sum + customer.products.reduce((productSum, product) => productSum + product.total_quantity, 0), 0
  );

  const stats = [
    { icon: Users, label: 'Kunder med Aktive Produkter', value: mockCustomers.length, desc: 'Har produkter valgt for pakking' },
    { icon: Package, label: 'Aktive Produkttyper', value: mockCustomers.reduce((sum, customer) => sum + customer.products.length, 0), desc: 'Forskjellige produkter' },
    { icon: Calendar, label: 'Totale Produkter', value: totalActiveProducts, desc: 'Antall produkter som skal pakkes' }
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
            className="relative h-[700px] overflow-y-auto rounded-b-lg p-4"
            style={{
              ...styles,
              fontSize: `${settings.body_font_size}px`,
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="text-center flex-1">
                <h1 
                  className="font-bold mb-2"
                  style={{ 
                    fontSize: `${Math.min(settings.header_font_size * 0.6, 24)}px`,
                    color: settings.header_text_color
                  }}
                >
                  Felles Display
                </h1>
                <p 
                  className="text-sm"
                  style={{ 
                    color: settings.text_color,
                    fontSize: `${Math.max(settings.body_font_size * 0.8, 12)}px`
                  }}
                >
                  Pakkestatus for kunder
                </p>
              </div>
              <RefreshCw className="h-4 w-4 text-gray-400" />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {stats.map((stat, idx) => (
                <div 
                  key={idx}
                  className="p-2 rounded text-center"
                  style={{
                    backgroundColor: settings.card_background_color,
                    borderColor: settings.card_border_color,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderRadius: `${Math.max(settings.border_radius / 2, 4)}px`,
                    boxShadow: `0 ${Math.max(settings.card_shadow_intensity / 2, 1)}px ${Math.max(settings.card_shadow_intensity, 2)}px rgba(0,0,0,0.1)`,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span 
                      className="text-xs"
                      style={{ color: settings.text_color }}
                    >
                      {stat.label}
                    </span>
                    <stat.icon 
                      className="h-3 w-3"
                      style={{ color: settings.product_accent_color }}
                    />
                  </div>
                  <div 
                    className="text-lg font-bold"
                    style={{ color: settings.text_color }}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Customer Cards */}
            <div className="space-y-3 mb-4">
              {mockCustomers.map((customer, customerIdx) => (
                <div 
                  key={customer.id}
                  className="p-3 rounded"
                  style={{
                    backgroundColor: settings.card_background_color,
                    borderColor: settings.card_border_color,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderRadius: `${settings.border_radius}px`,
                    boxShadow: `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)`,
                    transform: `scale(${Math.min(settings.product_card_size / 120, 0.9)})`,
                    transformOrigin: 'top left'
                  }}
                >
                  {/* Customer Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div 
                      className="px-2 py-1 rounded text-xs text-white"
                      style={{
                        backgroundColor: customer.overall_status === 'completed' ? settings.packing_status_completed_color : settings.packing_status_ongoing_color
                      }}
                    >
                      {customer.overall_status === 'completed' ? 'Ferdig' : 'Pågående'}
                    </div>
                    <div 
                      className="px-2 py-1 rounded text-xs"
                      style={{
                        backgroundColor: settings.product_accent_color,
                        color: 'white'
                      }}
                    >
                      {customer.customer_number}
                    </div>
                  </div>

                  <h3 
                    className="text-sm font-bold text-center mb-2"
                    style={{ 
                      color: settings.header_text_color,
                      fontSize: `${Math.max(settings.header_font_size * 0.4, 14)}px`
                    }}
                  >
                    {customer.name}
                  </h3>

                  {/* Progress */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: settings.text_color }}>Fremgang:</span>
                      <span 
                        className="font-semibold"
                        style={{ color: settings.product_accent_color }}
                      >
                        {customer.progress_percentage}%
                      </span>
                    </div>
                    <div 
                      className="w-full rounded-full"
                      style={{ 
                        backgroundColor: settings.progress_background_color,
                        height: `${Math.max(settings.progress_height / 2, 4)}px`
                      }}
                    >
                      <div 
                        className="rounded-full transition-all"
                        style={{ 
                          backgroundColor: settings.progress_bar_color,
                          height: `${Math.max(settings.progress_height / 2, 4)}px`,
                          width: `${customer.progress_percentage}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Products */}
                  <div>
                    <h4 
                      className="text-xs font-medium mb-1"
                      style={{ color: settings.text_color }}
                    >
                      Produkter:
                    </h4>
                    <div className="space-y-1">
                      {customer.products.map((product, idx) => (
                        <div 
                          key={product.id} 
                          className="text-xs p-1 rounded flex justify-between items-center"
                          style={{
                            backgroundColor: getProductBackgroundColor(settings, idx % 3),
                            borderRadius: `${Math.max(settings.border_radius / 2, 2)}px`,
                          }}
                        >
                          <div className="flex flex-col flex-1">
                            <span 
                              className="font-medium"
                              style={{ color: getProductTextColor(settings, idx % 3) }}
                            >
                              {product.product_name}
                            </span>
                            <span 
                              className="text-xs font-semibold"
                              style={{ color: getProductAccentColor(settings, idx % 3) }}
                            >
                              {product.total_quantity} {product.product_unit}
                            </span>
                          </div>
                          <div 
                            className="px-1 py-0.5 rounded text-xs text-white"
                            style={{
                              backgroundColor: product.packing_status === 'completed' ? settings.packing_status_completed_color : settings.packing_status_ongoing_color
                            }}
                          >
                            {product.packing_status === 'completed' ? 'Ferdig' : 'Pågår'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
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
                Automatisk oppdatering hvert {settings.auto_refresh_interval}. sekund
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DisplayPreview;
