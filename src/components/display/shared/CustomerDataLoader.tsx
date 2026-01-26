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
  // ✅ Hent activeProducts
  const { data: activeProducts, isLoading: activeLoading } = usePublicActivePackingProducts(
    bakeryId,
    activePackingDate
  );

  // ✅ KRITISK ENDRING: Hent ALLTID ordredata for kunden, uavhengig av om produkter er valgt
  // Dette sikrer at kunder med ordrer for datoen ALLTID vises (viktig for sjåfører)
  const { data: packingData, isLoading: packingLoading } = usePublicPackingData(
    customer.id,
    bakeryId,
    activePackingDate,
    activeProducts, // Produktfilter for produktlisten
    customer.name
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

  // Finn customerData fra packingData
  const customerData = packingData?.find(d => d.id === customer.id);

  // ✅ KRITISK ENDRING: Sjekk om kunden har NOEN ordrer for datoen (total_line_items_all)
  // Hvis ja - vis kunden ALLTID, selv om ingen produkter er valgt ennå
  const hasOrdersForDate = customerData && customerData.total_line_items_all > 0;

  if (!hasOrdersForDate) {
    return null; // Kunden har ingen ordrer for denne datoen - ikke vis
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
