
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePackingData } from '@/hooks/usePackingData';
import { useActivePackingProducts } from '@/hooks/useActivePackingProducts';
import { format } from 'date-fns';

interface DebugInfoProps {
  customerId?: string;
  showDebug?: boolean;
}

const DebugInfo = ({ customerId, showDebug = false }: DebugInfoProps) => {
  const targetDate = format(new Date(), 'yyyy-MM-dd');
  const { data: activeProducts, isLoading: activeLoading } = useActivePackingProducts(targetDate);
  const { data: packingData, isLoading: packingLoading } = usePackingData(customerId, targetDate, true);

  if (!showDebug) return null;

  return (
    <Card className="mb-4 border-yellow-200 bg-yellow-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Date:</strong> {targetDate}</p>
            <p><strong>Customer ID:</strong> {customerId || 'All'}</p>
            <p><strong>Active Products Loading:</strong> <Badge variant={activeLoading ? "secondary" : "default"}>{activeLoading ? "Yes" : "No"}</Badge></p>
            <p><strong>Packing Data Loading:</strong> <Badge variant={packingLoading ? "secondary" : "default"}>{packingLoading ? "Yes" : "No"}</Badge></p>
          </div>
          <div>
            <p><strong>Active Products Count:</strong> {activeProducts?.length || 0}</p>
            <p><strong>Customers with Data:</strong> {packingData?.length || 0}</p>
            <p><strong>Total Active Product Lines:</strong> {packingData?.reduce((sum, c) => sum + c.products.length, 0) || 0}</p>
          </div>
        </div>
        
        {activeProducts && activeProducts.length > 0 && (
          <div>
            <p><strong>Active Products:</strong></p>
            <ul className="ml-4 space-y-1">
              {activeProducts.map(ap => (
                <li key={ap.id}>• {ap.product_name} (ID: {ap.product_id.slice(0, 8)}...)</li>
              ))}
            </ul>
          </div>
        )}

        {packingData && packingData.length > 0 && (
          <div>
            <p><strong>Customers with Active Products:</strong></p>
            <ul className="ml-4 space-y-1">
              {packingData.map(customer => (
                <li key={customer.id}>
                  • {customer.name}: {customer.products.length} products, {customer.progress_percentage}% complete
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DebugInfo;
