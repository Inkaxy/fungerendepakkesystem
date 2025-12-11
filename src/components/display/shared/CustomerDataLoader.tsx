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
}

const CustomerDataLoader: React.FC<CustomerDataLoaderProps> = ({
  customer,
  bakeryId,
  activePackingDate,
  settings,
  statusColors,
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

  // ✅ Vis "venter på produktvalg" istedenfor null
  if (!activeProducts || activeProducts.length === 0) {
    return (
      <div 
        className="rounded-lg p-6 text-center border-2 border-dashed"
        style={{
          backgroundColor: settings?.card_background_color ? `${settings.card_background_color}20` : '#f3f4f620',
          borderColor: settings?.card_border_color || '#e5e7eb',
        }}
      >
        <p 
          className="text-sm animate-pulse"
          style={{ color: settings?.text_color || '#6b7280' }}
        >
          Venter på produktvalg...
        </p>
      </div>
    );
  }

  // Finn customerData fra packingData
  const customerData = packingData?.find(d => d.id === customer.id);

  if (!customerData || customerData.products.length === 0) {
    return null; // Ingen data for denne kunden
  }

  return (
    <CustomerPackingCard
      customerData={customerData}
      customer={customer}
      settings={settings}
      statusColors={statusColors}
    />
  );
};

export default CustomerDataLoader;
