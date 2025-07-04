
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Package } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { PackingCustomer } from '@/hooks/usePackingData';

interface SharedDisplayStatsProps {
  settings: DisplaySettings | undefined;
  sharedDisplayPackingData: PackingCustomer[];
}

const SharedDisplayStats = ({ settings, sharedDisplayPackingData }: SharedDisplayStatsProps) => {
  const totalActiveProducts = sharedDisplayPackingData.reduce((sum, customer) => 
    sum + customer.products.reduce((productSum, product) => productSum + product.total_quantity, 0), 0
  );

  const stats = [
    { icon: Users, label: 'Kunder med Aktive Produkter', value: sharedDisplayPackingData.length },
    { icon: Package, label: 'Aktive Produkttyper', value: sharedDisplayPackingData.reduce((sum, customer) => sum + customer.products.length, 0) },
    { icon: Calendar, label: 'Totale Produkter', value: totalActiveProducts }
  ];

  // Determine grid columns class based on settings
  const getStatsGridClass = () => {
    const columns = settings?.stats_columns || 3;
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-3';
    }
  };

  // Get card height class based on settings
  const getCardHeightClass = () => {
    switch (settings?.stats_card_height) {
      case 'compact': return 'py-2';
      case 'extended': return 'py-6';
      default: return 'py-4';
    }
  };

  return (
    <div className={`grid ${getStatsGridClass()} gap-6 mb-8`}>
      {stats.map((stat, idx) => (
        <Card 
          key={idx}
          style={{
            backgroundColor: settings?.card_background_color || '#ffffff',
            borderColor: settings?.card_border_color || '#e5e7eb',
            borderRadius: settings?.border_radius ? `${settings.border_radius}px` : '0.5rem',
            boxShadow: settings?.card_shadow_intensity ? `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)` : undefined
          }}
        >
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${getCardHeightClass()}`}>
            <CardTitle 
              className="text-sm font-medium"
              style={{ color: settings?.text_color || '#6b7280' }}
            >
              {stat.label}
            </CardTitle>
            <stat.icon 
              className="h-4 w-4"
              style={{ color: settings?.stats_icon_color || '#6b7280' }}
            />
          </CardHeader>
          <CardContent className={getCardHeightClass()}>
            <div 
              className="text-2xl font-bold"
              style={{ color: settings?.text_color || '#111827' }}
            >
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SharedDisplayStats;
