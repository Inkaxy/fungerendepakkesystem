import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { TabletStatus } from '@/types/tablet';
import { cn } from '@/lib/utils';

interface TabletStatusBadgeProps {
  status: TabletStatus;
  className?: string;
  showIcon?: boolean;
}

const TabletStatusBadge: React.FC<TabletStatusBadgeProps> = ({ 
  status, 
  className,
  showIcon = true 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          label: 'Online',
          icon: Wifi,
          className: 'bg-emerald-100 text-emerald-700 border-emerald-200'
        };
      case 'offline':
        return {
          label: 'Offline',
          icon: WifiOff,
          className: 'bg-slate-100 text-slate-600 border-slate-200'
        };
      case 'error':
        return {
          label: 'Feil',
          icon: AlertTriangle,
          className: 'bg-red-100 text-red-700 border-red-200'
        };
      default:
        return {
          label: 'Ukjent',
          icon: WifiOff,
          className: 'bg-slate-100 text-slate-600 border-slate-200'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={cn(config.className, className)}
    >
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {config.label}
    </Badge>
  );
};

export default TabletStatusBadge;
