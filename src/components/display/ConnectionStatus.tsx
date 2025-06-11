
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

interface ConnectionStatusProps {
  status: 'connected' | 'connecting' | 'disconnected';
  className?: string;
}

const ConnectionStatus = ({ status, className = '' }: ConnectionStatusProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: Wifi,
          text: 'Tilkoblet',
          variant: 'default' as const,
          bgColor: 'bg-green-500'
        };
      case 'connecting':
        return {
          icon: Loader2,
          text: 'Kobler til...',
          variant: 'secondary' as const,
          bgColor: 'bg-yellow-500'
        };
      case 'disconnected':
        return {
          icon: WifiOff,
          text: 'Frakoblet',
          variant: 'destructive' as const,
          bgColor: 'bg-red-500'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`flex items-center gap-1 ${className}`}>
      <Icon className={`h-3 w-3 ${status === 'connecting' ? 'animate-spin' : ''}`} />
      <span className="text-xs">{config.text}</span>
    </Badge>
  );
};

export default ConnectionStatus;
