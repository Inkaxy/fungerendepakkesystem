import React from 'react';
import { usePublicPackingData, usePublicActivePackingProducts } from '@/hooks/usePublicDisplayData';
import CustomerPackingCard from './CustomerPackingCard';
import { Customer } from '@/types/database';
import { DisplaySettings } from '@/types/displaySettings';

interface CustomerDataLoaderProps {
  customer: Customer;
  bakeryId: string | undefined;
  activePackingDate: string | undefined;
  settings: DisplaySettings | undefined;
  statusColors: Record<string, string>;
  hideWhenCompleted?: boolean;
  completedOpacity?: number;
  maxHeight?: number; // For auto-fit modus
}

const CustomerDataLoader: React.FC<CustomerDataLoaderProps> = ({
  customer,
  bakeryId,
  activePackingDate,
  settings,
  statusColors,
  hideWhenCompleted = false,
  completedOpacity = 50,
  maxHeight,
}) => {
  // ✅ NYTT: Hent activeProducts FØRST
  const { data: activeProducts, isLoading: activeLoading } = usePublicActivePackingProducts(
    bakeryId,
    activePackingDate
  );

  // ✅ Send activeProducts og customerName til usePublicPackingData
  const { data: packingData, isLoading: packingLoading } = usePublicPackingData(
    customer.id,
    bakeryId,
    activePackingDate,
    activeProducts, // ✅ KRITISK: Send som parameter
    customer.name   // ✅ FIX: Send customerName for å unngå JOIN med public_display_customers
  );

  if (activeLoading || packingLoading) {
    return (
      <div 
        className="animate-pulse rounded-lg h-48"
        style={{
          backgroundColor: settings?.card_background_color ? `${settings.card_background_color}40` : '#f3f4f640',
        }}
      />
    );
  }

  // Returner null hvis ingen aktive produkter for denne dagen
  if (!activeProducts || activeProducts.length === 0) {
    return null;
  }

  // Finn customerData fra packingData
  const customerData = packingData?.find(d => d.id === customer.id);

  if (!customerData || customerData.products.length === 0) {
    return null; // Ingen data for denne kunden
  }

  // Sjekk om kunden er 100% ferdig og skal skjules
  const isCompleted = customerData.progress_percentage === 100;
  
  if (hideWhenCompleted && isCompleted) {
    return null; // Skjul fullførte kunder
  }

  // Opacity for fullførte kunder (hvis de ikke skal skjules helt)
  const cardStyle = isCompleted && !hideWhenCompleted ? {
    opacity: completedOpacity / 100,
    transition: 'opacity 0.3s ease-in-out'
  } : {};

  return (
    <div style={cardStyle} className="h-full">
      <CustomerPackingCard
        customerData={customerData}
        customer={customer}
        settings={settings}
        statusColors={statusColors}
        maxHeight={maxHeight}
      />
    </div>
  );
};

export default CustomerDataLoader;
