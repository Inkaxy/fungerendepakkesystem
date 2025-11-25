import React from 'react';
import { usePublicPackingData } from '@/hooks/usePublicDisplayData';
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
  // ✅ Hook kalles på topp-nivå i denne komponenten - lovlig!
  const { data: packingData, isLoading } = usePublicPackingData(
    customer.id,
    bakeryId,
    activePackingDate
  );

  if (isLoading) {
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
