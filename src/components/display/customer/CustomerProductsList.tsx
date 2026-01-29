import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DisplaySettings } from '@/types/displaySettings';
import { PackingCustomer } from '@/hooks/usePackingData';
import { getProductBackgroundColor, getProductTextColor, getProductAccentColor } from '@/utils/displayStyleUtils';
import { getProductColorIndex } from '@/utils/productColorUtils';
import { cn } from '@/lib/utils';

interface CustomerProductsListProps {
  customerPackingData: PackingCustomer;
  settings: DisplaySettings | undefined;
  statusColors: { [key: string]: string };
}

const CustomerProductsList = ({ customerPackingData, settings, statusColors }: CustomerProductsListProps) => {
  // Filtrer ut fullførte produkter hvis innstillingen er på
  const visibleProducts = settings?.hide_completed_products
    ? customerPackingData.products.filter(p => p.packing_status !== 'completed')
    : customerPackingData.products;

  // Accessibility settings
  const reducedMotion = settings?.reduce_motion ?? false;
  const largeTouchTargets = settings?.large_touch_targets ?? false;

  // Get layout class based on product_card_layout setting
  const getLayoutClass = () => {
    switch (settings?.product_card_layout) {
      case 'vertical':
        return 'flex flex-col';
      case 'grid':
        return `grid gap-4`;
      case 'horizontal':
      default:
        return 'flex flex-col';
    }
  };

  const getGridColumns = () => {
    const cols = settings?.product_columns || 2;
    switch (cols) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-2';
    }
  };

  // Group products by status if setting is enabled
  const groupedProducts = settings?.product_group_by_status
    ? {
        pending: visibleProducts.filter(p => p.packing_status === 'pending'),
        in_progress: visibleProducts.filter(p => p.packing_status === 'in_progress'),
        completed: visibleProducts.filter(p => p.packing_status === 'completed'),
      }
    : null;

  const renderProduct = (product: typeof visibleProducts[0], index: number) => {
    // ✅ Bruk color_index fra databasen - stabil farge-slot
    // Fallback til product_id hash hvis colorIndex ikke finnes
    const colorIndex = (product as any).colorIndex ?? getProductColorIndex(
      (product as any).product_id || product.id,
      index,
      true // ✅ Alltid bruk konsistente farger som fallback
    );
    const bgColor = getProductBackgroundColor(settings || {} as any, colorIndex);
    const textColor = getProductTextColor(settings || {} as any, colorIndex);
    const accentColor = getProductAccentColor(settings || {} as any, colorIndex);
    
    const isVertical = settings?.product_card_layout === 'vertical';
    const isGrid = settings?.product_card_layout === 'grid';

    // Calculate scaled values based on product_card_size percentage
    const scale = (settings?.product_card_size || 100) / 100;
    const touchScale = largeTouchTargets ? 1.2 : 1;
    const scaledNameSize = Math.round((settings?.product_name_font_size || 24) * scale * touchScale);
    const scaledQuantitySize = Math.round((settings?.product_quantity_font_size || 48) * scale * touchScale);
    const scaledUnitSize = Math.round((settings?.product_unit_font_size || 24) * scale * touchScale);
    const scaledPadding = Math.round((largeTouchTargets ? 24 : 16) * scale);

    return (
      <div 
        key={product.id}
        className={cn(
          "rounded-lg",
          isVertical || isGrid ? "text-center" : "flex justify-between items-center",
          settings?.card_hover_effect && !reducedMotion && "hover:scale-[1.02] transition-transform duration-200"
        )}
        style={{
          backgroundColor: bgColor,
          borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
          padding: `${scaledPadding}px`
        }}
      >
        {/* Vertikal/Grid layout */}
        {(isVertical || isGrid) ? (
          <div className="space-y-2">
            {settings?.product_show_category && product.product_category && (
              <Badge 
                variant="outline" 
                className="mb-2"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                {product.product_category}
              </Badge>
            )}
            <h3 
              className="font-bold"
              style={{ 
                color: textColor,
                fontSize: `${scaledNameSize}px`,
                fontWeight: settings?.product_name_font_weight || 600,
                textDecoration: (settings?.strikethrough_completed_products && 
                                 product.packing_status === 'completed') 
                                 ? 'line-through' 
                                 : 'none'
              }}
            >
              {product.product_name}
              {(settings?.show_basket_quantity ?? false) && product.basket_quantity && (
                <span style={{ fontWeight: 400, fontSize: '0.75em', opacity: 0.7, marginLeft: '4px' }}>
                  - {product.basket_quantity} stk pr kurv
                </span>
              )}
            </h3>
            <div className="flex items-baseline justify-center gap-1">
              <span 
                className="font-bold"
                style={{ 
                  color: accentColor,
                  fontSize: `${scaledQuantitySize}px`,
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
                    fontSize: `${scaledUnitSize}px`,
                  }}
                >
                  {product.product_unit}
                </span>
              )}
            </div>
            <div className="flex flex-col items-center gap-1">
              {settings?.show_line_items_count !== false && (
                <span 
                  className="font-semibold"
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
        ) : (
          // Horisontal layout (default)
          <>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {settings?.product_show_category && product.product_category && (
                  <Badge 
                    variant="outline" 
                    style={{ borderColor: accentColor, color: accentColor }}
                  >
                    {product.product_category}
                  </Badge>
                )}
              </div>
              <h3 
                className="font-bold"
                style={{ 
                  color: textColor,
                  fontSize: `${scaledNameSize}px`,
                  fontWeight: settings?.product_name_font_weight || 600,
                  textDecoration: (settings?.strikethrough_completed_products && 
                                   product.packing_status === 'completed') 
                                   ? 'line-through' 
                                   : 'none'
                }}
              >
                {product.product_name}
                {(settings?.show_basket_quantity ?? false) && product.basket_quantity && (
                  <span style={{ fontWeight: 400, fontSize: '0.75em', opacity: 0.7, marginLeft: '4px' }}>
                    - {product.basket_quantity} stk pr kurv
                  </span>
                )}
              </h3>
            </div>
            <div className="text-right space-y-2">
              <div className="flex items-baseline justify-end gap-1">
                <span 
                  className="font-bold"
                  style={{ 
                    color: accentColor,
                    fontSize: `${scaledQuantitySize}px`,
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
                      fontSize: `${scaledUnitSize}px`,
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
          </>
        )}
      </div>
    );
  };

  const renderProductGroup = (products: typeof visibleProducts, title: string) => {
    if (products.length === 0) return null;
    
    return (
      <div className="space-y-3">
        <h4 
          className="text-sm font-semibold uppercase tracking-wide"
          style={{ color: settings?.text_color || '#6b7280' }}
        >
          {title}
        </h4>
        <div 
          className={cn(
            getLayoutClass(),
            settings?.product_card_layout === 'grid' && getGridColumns()
          )}
          style={{ 
            gap: `${settings?.product_spacing || 16}px`
          }}
        >
          {products.map((product, idx) => renderProduct(product, idx))}
        </div>
      </div>
    );
  };

  return (
    <Card
      style={{
        backgroundColor: settings?.card_background_color || '#ffffff',
        borderColor: settings?.card_border_color || '#e5e7eb',
        borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
        boxShadow: settings?.card_shadow_intensity 
          ? `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)` 
          : undefined
      }}
    >
      <CardContent style={{ padding: `${settings?.product_card_padding || 16}px` }}>
        {groupedProducts ? (
          <div className="space-y-6">
            {renderProductGroup(groupedProducts.in_progress, 'Pågår')}
            {renderProductGroup(groupedProducts.pending, 'Venter')}
            {renderProductGroup(groupedProducts.completed, 'Ferdig')}
          </div>
        ) : (
          <div 
            className={cn(
              getLayoutClass(),
              settings?.product_card_layout === 'grid' && getGridColumns()
            )}
            style={{ 
              gap: `${settings?.product_spacing || 16}px`
            }}
          >
            {visibleProducts.map((product, idx) => renderProduct(product, idx))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerProductsList;
