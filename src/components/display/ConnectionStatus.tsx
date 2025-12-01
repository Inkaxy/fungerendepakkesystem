
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface ConnectionStatusProps {
  status: 'connected' | 'connecting' | 'disconnected';
  pollingActive?: boolean;
  className?: string;
}

export const ConnectionStatus = ({ status, pollingActive = false, className = '' }: ConnectionStatusProps) => {
  const getConfig = (): { 
    icon: typeof Wifi | typeof RefreshCw | typeof WifiOff; 
    label: string; 
    sublabel?: string; 
    badge: 'default' | 'secondary' | 'destructive' 
  } => {
    if (status === 'connected') {
      return {
        icon: Wifi,
        label: 'Live',
        badge: 'default'
      };
    }
    if (status === 'connecting') {
      return {
        icon: RefreshCw,
        label: 'Kobler til...',
        badge: 'secondary'
      };
    }
    // disconnected
    return {
      icon: WifiOff,
      label: pollingActive ? 'Polling aktiv' : 'Frakoblet',
      sublabel: pollingActive ? 'Oppdaterer hvert 2. sekund' : undefined,
      badge: pollingActive ? 'secondary' : 'destructive'
    };
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <div className={`flex flex-col ${className}`}>
      <Badge 
        variant={config.badge}
        className="flex items-center gap-2"
      >
        <Icon className={`h-3 w-3 ${status === 'connecting' ? 'animate-spin' : ''}`} />
        {config.label}
      </Badge>
      {config.sublabel && (
        <span className="text-xs text-muted-foreground mt-1">{config.sublabel}</span>
      )}
    </div>
  );
};

export default ConnectionStatus;
