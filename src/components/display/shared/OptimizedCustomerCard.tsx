import React, { useMemo } from 'react';
import CustomerPackingCard from './CustomerPackingCard';
import { Customer } from '@/types/database';
import { DisplaySettings } from '@/types/displaySettings';
import { PackingCustomer } from '@/hooks/usePackingData';

interface OptimizedCustomerCardProps {
  customer: Customer;
  packingData?: PackingCustomer;
  settings: DisplaySettings | undefined;
  statusColors: Record<string, string>;
  hideWhenCompleted?: boolean;
  completedOpacity?: number;
  maxHeight?: number;
  isLoading?: boolean;
}

/**
 * Optimized card component that accepts pre-fetched data as props
 * instead of fetching its own data. This eliminates N+1 query problem.
 */
const OptimizedCustomerCard: React.FC<OptimizedCustomerCardProps> = ({
  customer,
  packingData,
  settings,
  statusColors,
  hideWhenCompleted = false,
  completedOpacity = 50,
  maxHeight,
  isLoading = false,
}) => {
  // ✅ Hooks må alltid kjøres før conditional returns
  const isCompleted = packingData?.progress_percentage === 100;
  
  // Memoize style calculation
  const cardStyle = useMemo(() => {
    if (isCompleted && !hideWhenCompleted) {
      return {
        opacity: completedOpacity / 100,
        transition: 'opacity 0.3s ease-in-out'
      };
    }
    return {};
  }, [isCompleted, hideWhenCompleted, completedOpacity]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div 
        className="animate-pulse rounded-lg h-48"
        style={{
          backgroundColor: settings?.card_background_color ? `${settings.card_background_color}40` : '#f3f4f640',
          borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
        }}
      />
    );
  }

  // ✅ Filtrering for kunder uten ordrer skjer nå i SharedDisplay (visibleCustomers)
  // Vis alltid kortet her - packingData kan være undefined/tom men vil vise "Ingen produkter"-melding

  // Skal skjules fordi fullført (håndteres også i SharedDisplay, men behold som sikkerhet)
  if (hideWhenCompleted && isCompleted) {
    return null;
  }

  return (
    <div style={cardStyle} className="h-full">
      <CustomerPackingCard
        customerData={packingData!}
        customer={customer}
        settings={settings}
        statusColors={statusColors}
        maxHeight={maxHeight}
      />
    </div>
  );
};

// Custom comparison for React.memo - only re-render when necessary
const arePropsEqual = (
  prevProps: OptimizedCustomerCardProps,
  nextProps: OptimizedCustomerCardProps
): boolean => {
  // Always re-render if customer ID changes
  if (prevProps.customer.id !== nextProps.customer.id) return false;
  
  // Re-render if loading state changes
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  
  // Re-render if packing data changes (progress, products)
  if (prevProps.packingData?.progress_percentage !== nextProps.packingData?.progress_percentage) return false;
  if (prevProps.packingData?.products?.length !== nextProps.packingData?.products?.length) return false;
  if (prevProps.packingData?.overall_status !== nextProps.packingData?.overall_status) return false;
  
  // Re-render if visibility settings change
  if (prevProps.hideWhenCompleted !== nextProps.hideWhenCompleted) return false;
  if (prevProps.completedOpacity !== nextProps.completedOpacity) return false;
  
  return true;
};

export default React.memo(OptimizedCustomerCard, arePropsEqual);
