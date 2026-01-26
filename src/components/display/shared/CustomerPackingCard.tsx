import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { PackingCustomer } from '@/hooks/usePackingData';
import { Customer } from '@/types/database';
import { getProductBackgroundColor, getProductTextColor, getProductAccentColor } from '@/utils/displayStyleUtils';
import { getProductColorIndex } from '@/utils/productColorUtils';
import { cn } from '@/lib/utils';

interface CustomerPackingCardProps {
  customerData: PackingCustomer;
  customer: Customer;
  settings: DisplaySettings | undefined;
  statusColors: { [key: string]: string };
  maxHeight?: number; // For auto-fit modus
}

const CustomerPackingCard = React.memo(({ customerData, customer, settings, statusColors, maxHeight }: CustomerPackingCardProps) => {
  const isCompleted = customerData.overall_status === 'completed';
  
  // Beregn skaleringsfaktor basert på maxHeight for dynamisk skalering
  const scaleFactor = React.useMemo(() => {
    if (!maxHeight) return 1;
    // Skaler ned fra 300px som "normal" høyde - mer aggressiv i kompakt modus
    const baseScale = settings?.shared_compact_table_mode 
      ? Math.min(1, Math.max(0.5, (maxHeight - 60) / 150))
      : Math.min(1, Math.max(0.6, (maxHeight - 100) / 200));
    return baseScale;
  }, [maxHeight, settings?.shared_compact_table_mode]);
  
  // Get card height class based on settings
  const getCardHeightClass = () => {
    if (settings?.shared_compact_table_mode) return 'py-0'; // Minimal i kompakt modus
    if (maxHeight) return 'py-1'; // Kompakt når auto-fit er aktiv
    switch (settings?.customer_card_height) {
      case 'compact': return 'py-2';
      case 'large': return 'py-6';
      default: return 'py-4';
    }
  };

  // Limit products based on max_products_per_card setting OR available height
  const maxProducts = React.useMemo(() => {
    // I kompakt modus: Vis ALLTID alle produkter
    if (settings?.shared_compact_table_mode) {
      return customerData.products.length;
    }
    if (maxHeight) {
      // Estimer hvor mange produkter som får plass
      const headerHeight = 60 * scaleFactor;
      const progressHeight = 50 * scaleFactor;
      const productItemHeight = 35 * scaleFactor;
      const footerPadding = 20 * scaleFactor;
      const availableForProducts = maxHeight - headerHeight - progressHeight - footerPadding;
      return Math.max(1, Math.floor(availableForProducts / productItemHeight));
    }
    return settings?.max_products_per_card || 10;
  }, [maxHeight, settings?.max_products_per_card, scaleFactor, settings?.shared_compact_table_mode, customerData.products.length]);
  
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
      className={cn(getCardStyleClass(), hoverClass, 'h-full flex flex-col')}
      style={{
        backgroundColor: settings?.card_background_color || '#ffffff',
        borderColor: settings?.card_border_color || '#e5e7eb',
        borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
        borderWidth: settings?.card_border_width ? `${settings.card_border_width}px` : undefined,
        boxShadow: settings?.card_shadow_intensity 
          ? `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)` 
          : undefined,
        maxHeight: maxHeight ? `${maxHeight}px` : undefined,
        overflow: 'hidden'
      }}
    >
      {/* Header - Ultra-kompakt i tabell-modus */}
      {settings?.shared_compact_table_mode ? (
        <CardHeader className="py-1 px-2">
          <div 
            className="flex items-center justify-between"
            style={{ padding: `${Math.max(2, 4 * scaleFactor)}px 0` }}
          >
            <CardTitle 
              className="font-semibold flex-1 truncate"
              style={{ 
                color: settings?.header_text_color || '#111827',
                fontSize: `${Math.max(11, 13 * scaleFactor)}px`
              }}
            >
              {customer.name}
            </CardTitle>
            {/* Mini status-indikator (farget prikk i stedet for badge) */}
            <span 
              className="flex-shrink-0 rounded-full ml-2"
              style={{ 
                width: `${Math.max(8, 10 * scaleFactor)}px`,
                height: `${Math.max(8, 10 * scaleFactor)}px`,
                backgroundColor: isCompleted 
                  ? (statusColors.completed || '#10b981') 
                  : (statusColors.in_progress || '#3b82f6')
              }}
              title={isCompleted ? 'Ferdig' : 'Pågår'}
            />
          </div>
        </CardHeader>
      ) : (
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
            className="text-center mb-3"
            style={{ 
              color: settings?.header_text_color || '#111827',
              fontSize: `${(settings?.customer_name_font_size || 20) * scaleFactor}px`
            }}
          >
            {customer.name}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(settings?.shared_compact_table_mode ? 'py-1 px-2' : getCardHeightClass(), 'flex-1 overflow-hidden')}>
        <div style={{ gap: settings?.shared_compact_table_mode ? `${Math.max(2, 4 * scaleFactor)}px` : `${Math.max(8, 12 * scaleFactor)}px`, display: 'flex', flexDirection: 'column' }}>
          {/* Compact table mode */}
          {settings?.shared_compact_table_mode ? (
            <div className="flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column', gap: `${Math.max(1, 2 * scaleFactor)}px` }}>
              {displayProducts.map((product, idx) => {
                // ✅ KRITISK FIX: Bruk product_id (ikke id) for konsistent farge
                const colorIndex = getProductColorIndex(
                  product.product_id,
                  idx,
                  settings?.use_consistent_product_colors ?? true
                );
                const bgColor = getProductBackgroundColor(settings || {} as DisplaySettings, colorIndex);
                const textColor = getProductTextColor(settings || {} as DisplaySettings, colorIndex);
                const accentColor = getProductAccentColor(settings || {} as DisplaySettings, colorIndex);
                
                return (
                  <div 
                    key={product.id}
                    className="flex items-center justify-between"
                    style={{
                      backgroundColor: bgColor,
                      padding: `${Math.max(2, 3 * scaleFactor)}px ${Math.max(4, 6 * scaleFactor)}px`,
                      fontSize: `${Math.max(9, 11 * scaleFactor)}px`,
                      borderRadius: `${Math.max(2, 3 * scaleFactor)}px`,
                    }}
                  >
                    <span 
                      className="flex-1 truncate"
                      style={{ 
                        color: textColor,
                        textDecoration: product.packing_status === 'completed' ? 'line-through' : 'none',
                        opacity: product.packing_status === 'completed' ? 0.6 : 1
                      }}
                    >
                      {product.product_name}
                    </span>
                    <span 
                      className="font-semibold mx-2"
                      style={{ color: accentColor }}
                    >
                      {product.total_quantity}
                    </span>
                    <span style={{ 
                      color: product.packing_status === 'completed' ? (statusColors.completed || '#10b981') : product.packing_status === 'in_progress' ? (statusColors.in_progress || '#3b82f6') : (statusColors.pending || '#f59e0b'),
                      fontSize: `${Math.max(10, 12 * scaleFactor)}px`
                    }}>
                      {product.packing_status === 'completed' ? '✓' : 
                       product.packing_status === 'in_progress' ? '◐' : '○'}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <>
              {/* Progress section - only in standard mode */}
              {(settings?.show_customer_progress_bar ?? true) && (
                <div style={{ gap: `${Math.max(4, 8 * scaleFactor)}px`, display: 'flex', flexDirection: 'column' }}>
                  <div className="flex justify-between" style={{ fontSize: `${Math.max(10, 14 * scaleFactor)}px` }}>
                    <span style={{ color: settings?.text_color || '#374151' }}>Fremgang:</span>
                    <span 
                      className="font-semibold"
                      style={{ color: settings?.product_accent_color || '#3b82f6' }}
                    >
                      {customerData.progress_percentage}%
                    </span>
                  </div>
                  <div 
                    className="w-full rounded-full relative overflow-visible"
                    style={{ 
                      backgroundColor: settings?.progress_background_color || '#e5e7eb',
                      height: `${Math.max(4, (settings?.progress_height || 8) * scaleFactor)}px`,
                      marginLeft: (settings?.show_truck_icon ?? false) ? `${(settings?.truck_icon_size || 24) / 2}px` : undefined,
                      marginRight: (settings?.show_truck_icon ?? false) ? `${(settings?.truck_icon_size || 24) / 2}px` : undefined,
                    }}
                  >
                    <div 
                      className="rounded-full h-full"
                      style={{ 
                        backgroundColor: settings?.progress_bar_color || '#3b82f6',
                        width: `${customerData.progress_percentage}%`,
                        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        willChange: 'width',
                      }}
                    />
                    {(settings?.show_truck_icon ?? false) && (
                      <img
                        src="/lovable-uploads/37c33860-5f09-44ea-a64c-a7e7fb7c925b.png"
                        alt="Varebil"
                        className="absolute top-1/2 transform -translate-y-1/2"
                        style={{ 
                          left: `calc(${customerData.progress_percentage}% - ${(settings?.truck_icon_size || 24) / 2}px)`,
                          width: `${(settings?.truck_icon_size || 24) * scaleFactor}px`,
                          height: `${(settings?.truck_icon_size || 24) * scaleFactor}px`,
                          objectFit: 'contain',
                          transition: 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                          zIndex: 10,
                        }}
                      />
                    )}
                  </div>
                  {(settings?.show_line_items_count ?? true) && (
                    <div className="text-center" style={{ fontSize: `${Math.max(10, 12 * scaleFactor)}px` }}>
                      <span style={{ color: settings?.text_color || '#6b7280' }}>
                        {customerData.packed_line_items_all}/{customerData.total_line_items_all} varelinjer pakket
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Products list - standard mode */}
              <div>
                <h4 
                  className="font-medium mb-2"
                  style={{ 
                    color: settings?.text_color || '#374151',
                    fontSize: `${Math.max(10, 14 * scaleFactor)}px`
                  }}
                >
                  Produkter:
                </h4>
                {/* ✅ Vis melding når ingen produkter er valgt for pakking */}
                {displayProducts.length === 0 ? (
                  <div 
                    className="text-center py-2 opacity-60"
                    style={{ 
                      color: settings?.text_color || '#6b7280',
                      fontSize: `${Math.max(10, 12 * scaleFactor)}px`
                    }}
                  >
                    Ingen produkter valgt for pakking
                  </div>
                ) : (
                <div style={{ gap: `${Math.max(2, 4 * scaleFactor)}px`, display: 'flex', flexDirection: 'column' }}>
                  {displayProducts.map((product, idx) => {
                    // ✅ KRITISK FIX: Bruk product_id (ikke id) for konsistent farge
                    const colorIndex = getProductColorIndex(
                      product.product_id,
                      idx,
                      settings?.use_consistent_product_colors ?? true
                    );
                    return (
                    <div 
                      key={product.id} 
                      className={`${getProductItemClass()} rounded flex justify-between items-center`}
                      style={{
                        backgroundColor: getProductBackgroundColor(settings || {} as any, colorIndex),
                        borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.25rem',
                        padding: `${Math.max(4, 8 * scaleFactor)}px`,
                      }}
                    >
                      <div className="flex flex-col flex-1">
                        <span 
                          className="font-medium"
                          style={{ 
                            color: getProductTextColor(settings || {} as any, colorIndex),
                            fontSize: `${(settings?.shared_product_font_size || 14) * scaleFactor}px`,
                            textDecoration: (settings?.strikethrough_completed_products && 
                                             product.packing_status === 'completed') 
                                             ? 'line-through' 
                                             : 'none'
                          }}
                        >
                          {product.product_name}
                          {(settings?.show_basket_quantity ?? false) && product.basket_quantity && (
                            <span style={{ fontWeight: 400, opacity: 0.7, marginLeft: '4px' }}>
                              - {product.basket_quantity} stk pr kurv
                            </span>
                          )}
                        </span>
                        {(settings?.shared_show_product_quantity ?? true) && (
                          <span 
                            className="font-semibold"
                            style={{ 
                              color: getProductAccentColor(settings || {} as any, colorIndex),
                              fontSize: `${(settings?.shared_product_font_size || 14) * 1.2 * scaleFactor}px`,
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
                            style={{ 
                              color: getProductAccentColor(settings || {} as any, colorIndex),
                              fontSize: `${Math.max(10, 12 * scaleFactor)}px`
                            }}
                          >
                            {product.packed_line_items}/{product.total_line_items}
                          </span>
                        )}
                        {(settings?.show_status_badges ?? true) && (
                          <Badge 
                            variant={product.packing_status === 'completed' ? 'default' : 'secondary'}
                            style={{
                              backgroundColor: product.packing_status === 'completed' ? statusColors.completed : statusColors.in_progress,
                              color: 'white',
                              fontSize: `${Math.max(8, 12 * scaleFactor)}px`,
                              padding: `${Math.max(2, 4 * scaleFactor)}px ${Math.max(4, 8 * scaleFactor)}px`
                            }}
                          >
                            {product.packing_status === 'completed' ? 'Ferdig' : 
                             product.packing_status === 'in_progress' ? 'Pågår' : 'Venter'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )})}
                  {hasMoreProducts && (
                    <div 
                      className="text-center py-1"
                      style={{ 
                        color: settings?.text_color || '#6b7280', 
                        opacity: 0.7,
                        fontSize: `${Math.max(10, 12 * scaleFactor)}px`
                      }}
                    >
                      ... og {customerData.products.length - maxProducts} flere produkter
                    </div>
                  )}
                </div>
                )}
              </div>
            </>
          )}
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
    prevProps.settings?.customer_card_style === nextProps.settings?.customer_card_style &&
    prevProps.settings?.show_truck_icon === nextProps.settings?.show_truck_icon &&
    prevProps.settings?.truck_icon_size === nextProps.settings?.truck_icon_size &&
    prevProps.settings?.progress_height === nextProps.settings?.progress_height &&
    prevProps.settings?.customer_cards_columns === nextProps.settings?.customer_cards_columns &&
    prevProps.settings?.customer_name_font_size === nextProps.settings?.customer_name_font_size &&
    prevProps.settings?.shared_product_font_size === nextProps.settings?.shared_product_font_size &&
    prevProps.settings?.customer_card_height === nextProps.settings?.customer_card_height &&
    prevProps.settings?.customer_cards_gap === nextProps.settings?.customer_cards_gap &&
    prevProps.settings?.max_products_per_card === nextProps.settings?.max_products_per_card &&
    prevProps.settings?.show_basket_quantity === nextProps.settings?.show_basket_quantity &&
    prevProps.settings?.shared_compact_table_mode === nextProps.settings?.shared_compact_table_mode
  );
});

CustomerPackingCard.displayName = 'CustomerPackingCard';

export default CustomerPackingCard;
