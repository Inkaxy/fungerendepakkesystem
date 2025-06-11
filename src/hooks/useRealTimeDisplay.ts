
import { useEffect, useState } from 'react';
import { useRealTimeOrders } from './useRealTimeOrders';
import { useRealTimeActivePackingProducts } from './useRealTimeActivePackingProducts';
import { useRealTimePackingSessions } from './useRealTimePackingSessions';
import { useRealTimeDisplaySettings } from './useRealTimeDisplaySettings';

export const useRealTimeDisplay = () => {
  const [overallStatus, setOverallStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
  
  const { connectionStatus: ordersStatus } = useRealTimeOrders();
  const { connectionStatus: productsStatus } = useRealTimeActivePackingProducts();
  
  // Initialize other real-time listeners
  useRealTimePackingSessions();
  useRealTimeDisplaySettings();

  useEffect(() => {
    // Determine overall connection status based on individual statuses
    const statuses = [ordersStatus, productsStatus];
    
    if (statuses.every(status => status === 'connected')) {
      setOverallStatus('connected');
    } else if (statuses.some(status => status === 'disconnected')) {
      setOverallStatus('disconnected');
    } else {
      setOverallStatus('connecting');
    }
  }, [ordersStatus, productsStatus]);

  return {
    connectionStatus: overallStatus,
    ordersStatus,
    productsStatus
  };
};
