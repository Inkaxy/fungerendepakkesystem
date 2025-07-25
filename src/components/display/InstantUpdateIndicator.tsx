import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Clock } from 'lucide-react';

interface InstantUpdateIndicatorProps {
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  lastUpdateTime?: number;
  className?: string;
}

const InstantUpdateIndicator = ({ 
  connectionStatus, 
  lastUpdateTime,
  className = '' 
}: InstantUpdateIndicatorProps) => {
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return lastUpdateTime && lastUpdateTime < 50 ? 'bg-green-500' : 'bg-yellow-500';
      case 'connecting':
        return 'bg-orange-500';
      case 'disconnected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="h-3 w-3" />;
      case 'connecting':
        return <Clock className="h-3 w-3 animate-spin" />;
      case 'disconnected':
        return <WifiOff className="h-3 w-3" />;
    }
  };

  const getStatusText = () => {
    if (connectionStatus === 'connected' && lastUpdateTime !== undefined) {
      if (lastUpdateTime < 50) {
        return `⚡ ${lastUpdateTime.toFixed(0)}ms`;
      } else if (lastUpdateTime < 100) {
        return `🟡 ${lastUpdateTime.toFixed(0)}ms`;
      } else {
        return `🔴 ${lastUpdateTime.toFixed(0)}ms`;
      }
    }
    
    switch (connectionStatus) {
      case 'connected':
        return '⚡ Øyeblikkelig';
      case 'connecting':
        return 'Kobler til...';
      case 'disconnected':
        return 'Frakoblet';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`${className} text-xs font-mono ${getStatusColor()} text-white border-none`}
    >
      {getStatusIcon()}
      <span className="ml-1">{getStatusText()}</span>
    </Badge>
  );
};

export default InstantUpdateIndicator;