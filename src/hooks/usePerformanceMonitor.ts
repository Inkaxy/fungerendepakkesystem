import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PerformanceMetrics {
  averageUpdateTime: number;
  slowUpdates: number;
  totalUpdates: number;
  connectionStatus: 'excellent' | 'good' | 'poor';
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    averageUpdateTime: 0,
    slowUpdates: 0,
    totalUpdates: 0,
    connectionStatus: 'excellent'
  });
  const { toast } = useToast();

  const recordUpdate = (updateTime: number) => {
    setMetrics(prev => {
      const newTotal = prev.totalUpdates + 1;
      const newAverage = (prev.averageUpdateTime * prev.totalUpdates + updateTime) / newTotal;
      const newSlowUpdates = updateTime > 100 ? prev.slowUpdates + 1 : prev.slowUpdates;
      
      const slowUpdatePercentage = (newSlowUpdates / newTotal) * 100;
      const connectionStatus = 
        slowUpdatePercentage < 5 ? 'excellent' :
        slowUpdatePercentage < 15 ? 'good' : 'poor';

      return {
        averageUpdateTime: newAverage,
        slowUpdates: newSlowUpdates,
        totalUpdates: newTotal,
        connectionStatus
      };
    });

    // Alert on slow updates
    if (updateTime > 200) {
      console.warn(`🐌 SLOW UPDATE DETECTED: ${updateTime.toFixed(2)}ms - Target: <50ms`);
      toast({
        title: "Treg oppdatering oppdaget",
        description: `Display oppdaterte på ${updateTime.toFixed(0)}ms (mål: <50ms)`,
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const resetMetrics = () => {
    setMetrics({
      averageUpdateTime: 0,
      slowUpdates: 0,
      totalUpdates: 0,
      connectionStatus: 'excellent'
    });
  };

  useEffect(() => {
    // Log performance metrics every 30 seconds
    const interval = setInterval(() => {
      if (metrics.totalUpdates > 0) {
        console.log('📊 Performance Metrics:', {
          averageUpdateTime: `${metrics.averageUpdateTime.toFixed(2)}ms`,
          slowUpdates: `${metrics.slowUpdates}/${metrics.totalUpdates}`,
          connectionStatus: metrics.connectionStatus
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [metrics]);

  return {
    metrics,
    recordUpdate,
    resetMetrics
  };
};