import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Package, Clock } from 'lucide-react';
import { DemoCustomerPackingData } from '@/utils/demoDisplayData';
import { DisplaySettings } from '@/types/displaySettings';
import { getProductColorIndex } from '@/utils/productColorUtils';
import { getProductBackgroundColor, getProductTextColor, getProductAccentColor } from '@/utils/displayStyleUtils';

interface DemoCustomerCardProps {
  customerData: DemoCustomerPackingData;
  settings: DisplaySettings | undefined;
  statusColors: Record<string, string>;
  hideWhenCompleted?: boolean;
  completedOpacity?: number;
  maxHeight?: number; // For auto-fit modus
}

const DemoCustomerCard: React.FC<DemoCustomerCardProps> = ({
  customerData,
  settings,
  statusColors,
  hideWhenCompleted = false,
  completedOpacity = 50,
  maxHeight,
}) => {
  const isCompleted = customerData.progress_percentage === 100;
  
  // Beregn skaleringsfaktor basert på maxHeight for dynamisk skalering
  const scaleFactor = React.useMemo(() => {
    if (!maxHeight) return 1;
    // Skaler ned fra 300px som "normal" høyde
    return Math.min(1, Math.max(0.6, (maxHeight - 100) / 200));
  }, [maxHeight]);
  
  // Beregn maks antall produkter basert på tilgjengelig høyde
  const maxProducts = React.useMemo(() => {
    if (maxHeight) {
      const headerHeight = 50 * scaleFactor;
      const progressHeight = 40 * scaleFactor;
      const productItemHeight = 35 * scaleFactor;
      const footerPadding = 30 * scaleFactor;
      const availableForProducts = maxHeight - headerHeight - progressHeight - footerPadding;
      return Math.max(1, Math.floor(availableForProducts / productItemHeight));
    }
    return settings?.max_products_per_card ?? 3;
  }, [maxHeight, settings?.max_products_per_card, scaleFactor]);
  
  const displayProducts = customerData.products.slice(0, maxProducts);
  
  // Skjul fullførte kunder hvis innstillingen er på
  if (hideWhenCompleted && isCompleted) {
    return null;
  }
  
  // Opacity for fullførte kunder
  const cardStyle = isCompleted && !hideWhenCompleted ? {
    opacity: completedOpacity / 100,
    transition: 'opacity 0.3s ease-in-out'
  } : {};

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'packed':
      case 'completed':
        return statusColors.completed || '#10b981';
      case 'in_progress':
        return statusColors.in_progress || '#3b82f6';
      default:
        return statusColors.pending || '#f59e0b';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'packed':
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'in_progress':
        return <Package className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div style={cardStyle} className="h-full">
      <Card
        className="h-full overflow-hidden transition-all duration-300 flex flex-col"
        style={{
          backgroundColor: settings?.card_background_color || '#ffffff',
          borderColor: settings?.card_border_color || '#e5e7eb',
          borderWidth: settings?.card_border_width ? `${settings.card_border_width}px` : '1px',
          borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
          height: '100%',
        }}
      >
        <CardContent 
          className="flex-1 overflow-hidden flex flex-col"
          style={{ 
            padding: `${Math.max(8, 16 * scaleFactor)}px`,
            gap: `${Math.max(8, 16 * scaleFactor)}px`
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {settings?.show_customer_numbers && (
                <Badge 
                  variant="outline" 
                  style={{ 
                    borderColor: settings?.card_border_color || '#e5e7eb',
                    color: settings?.text_color || '#6b7280',
                    fontSize: `${Math.max(10, 12 * scaleFactor)}px`,
                    padding: `${Math.max(2, 4 * scaleFactor)}px ${Math.max(4, 8 * scaleFactor)}px`
                  }}
                >
                  {customerData.customer_number}
                </Badge>
              )}
              <h3 
                className="font-semibold"
                style={{ 
                  color: settings?.text_color || '#1f2937',
                  fontSize: `${(settings?.customer_name_font_size || 18) * scaleFactor}px`
                }}
              >
                {customerData.name}
              </h3>
            </div>
            {(settings?.show_status_badges ?? true) && (
              <Badge
                style={{ 
                  backgroundColor: getStatusColor(customerData.overall_status),
                  color: '#ffffff',
                  fontSize: `${Math.max(10, 12 * scaleFactor)}px`,
                  padding: `${Math.max(2, 4 * scaleFactor)}px ${Math.max(4, 8 * scaleFactor)}px`
                }}
              >
                {isCompleted ? 'Ferdig' : 'Pågår'}
              </Badge>
            )}
          </div>

          {/* Products */}
          <div className="flex-1 overflow-hidden" style={{ gap: `${Math.max(4, 8 * scaleFactor)}px`, display: 'flex', flexDirection: 'column' }}>
            {displayProducts.map((product, idx) => {
              // Use consistent color based on product ID if setting is enabled
              const colorIndex = getProductColorIndex(
                product.product_id,
                idx,
                settings?.use_consistent_product_colors ?? false
              );
              const bgColor = getProductBackgroundColor(settings || {} as DisplaySettings, colorIndex);
              const textColor = getProductTextColor(settings || {} as DisplaySettings, colorIndex);
              const accentColor = getProductAccentColor(settings || {} as DisplaySettings, colorIndex);
              
              return (
                <div 
                  key={product.product_id}
                  className="flex items-center justify-between rounded"
                  style={{
                    backgroundColor: bgColor,
                    padding: `${Math.max(4, 8 * scaleFactor)}px`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      style={{ color: getStatusColor(product.packing_status) }}
                    >
                      {getStatusIcon(product.packing_status)}
                    </span>
                    <span 
                      className={product.packing_status === 'packed' ? 'line-through opacity-60' : ''}
                      style={{ 
                        color: textColor,
                        fontSize: `${(settings?.shared_product_font_size || 14) * scaleFactor}px`
                      }}
                    >
                      {product.product_name}
                    </span>
                  </div>
                  {(settings?.shared_show_product_quantity ?? true) && (
                    <span 
                      className="font-medium"
                      style={{ 
                        color: accentColor,
                        fontSize: `${(settings?.shared_product_font_size || 14) * scaleFactor}px`
                      }}
                    >
                      {product.packed_quantity}/{product.total_quantity} {product.product_unit}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress */}
          {(settings?.show_progress_bar ?? true) && (
            <div style={{ gap: `${Math.max(2, 4 * scaleFactor)}px`, display: 'flex', flexDirection: 'column' }}>
              <div className="flex items-center justify-between" style={{ fontSize: `${Math.max(10, 14 * scaleFactor)}px` }}>
                <span style={{ color: settings?.text_color || '#6b7280' }}>
                  Fremgang
                </span>
                {(settings?.show_progress_percentage ?? true) && (
                  <span 
                    className="font-medium"
                    style={{ color: settings?.text_color || '#6b7280' }}
                  >
                    {customerData.progress_percentage}%
                  </span>
                )}
              </div>
              <Progress 
                value={customerData.progress_percentage}
                style={{
                  backgroundColor: settings?.progress_background_color || '#e5e7eb',
                  height: `${Math.max(4, 8 * scaleFactor)}px`
                }}
              />
            </div>
          )}

          {/* Line items count */}
          {(settings?.show_line_items_count ?? true) && (
            <div 
              className="text-center"
              style={{ 
                color: settings?.text_color || '#6b7280', 
                opacity: 0.7,
                fontSize: `${Math.max(10, 12 * scaleFactor)}px`
              }}
            >
              {customerData.packed_line_items} av {customerData.total_line_items} linjer pakket
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoCustomerCard;
