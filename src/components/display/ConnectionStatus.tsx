
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface ConnectionStatusProps {
  status: 'connected' | 'connecting' | 'disconnected';
  className?: string;
}

export const ConnectionStatus = ({ status, className = '' }: ConnectionStatusProps) => {
  const statusConfig = {
    connected: {
      icon: Wifi,
      label: 'Live',
      badge: 'default' as const
    },
    connecting: {
      icon: RefreshCw,
      label: 'Kobler til...',
      badge: 'secondary' as const
    },
    disconnected: {
      icon: WifiOff,
      label: 'Frakoblet',
      badge: 'destructive' as const
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.badge}
      className={`flex items-center gap-2 ${className}`}
    >
      <Icon className={`h-3 w-3 ${status === 'connecting' ? 'animate-spin' : ''}`} />
      {config.label}
    </Badge>
  );
};

export default ConnectionStatus;
