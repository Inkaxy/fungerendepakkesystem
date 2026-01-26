import React from 'react';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Truck, 
  Package,
  LucideIcon 
} from 'lucide-react';

type StatusType = 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'pending' 
  | 'in_progress' 
  | 'completed' 
  | 'delivered'
  | 'active'
  | 'inactive';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig: Record<StatusType, { 
  bg: string; 
  text: string; 
  border: string;
  icon: LucideIcon;
  defaultLabel: string;
}> = {
  success: {
    bg: 'bg-success/10',
    text: 'text-success',
    border: 'border-success/20',
    icon: CheckCircle2,
    defaultLabel: 'Fullført',
  },
  warning: {
    bg: 'bg-warning/10',
    text: 'text-warning',
    border: 'border-warning/20',
    icon: AlertCircle,
    defaultLabel: 'Advarsel',
  },
  error: {
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    border: 'border-destructive/20',
    icon: XCircle,
    defaultLabel: 'Feil',
  },
  info: {
    bg: 'bg-info/10',
    text: 'text-info',
    border: 'border-info/20',
    icon: AlertCircle,
    defaultLabel: 'Info',
  },
  pending: {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-border',
    icon: Clock,
    defaultLabel: 'Venter',
  },
  in_progress: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    border: 'border-primary/20',
    icon: Package,
    defaultLabel: 'Pågår',
  },
  completed: {
    bg: 'bg-success/10',
    text: 'text-success',
    border: 'border-success/20',
    icon: CheckCircle2,
    defaultLabel: 'Fullført',
  },
  delivered: {
    bg: 'bg-info/10',
    text: 'text-info',
    border: 'border-info/20',
    icon: Truck,
    defaultLabel: 'Levert',
  },
  active: {
    bg: 'bg-success/10',
    text: 'text-success',
    border: 'border-success/20',
    icon: CheckCircle2,
    defaultLabel: 'Aktiv',
  },
  inactive: {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-border',
    icon: XCircle,
    defaultLabel: 'Inaktiv',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1.5',
  lg: 'text-base px-3 py-1.5 gap-2',
};

const iconSizes = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  showIcon = true,
  size = 'md',
  className,
}) => {
  const config = statusConfig[status] || statusConfig.info;
  const Icon = config.icon;
  const displayLabel = label || config.defaultLabel;

  return (
    <span className={cn(
      "inline-flex items-center font-medium rounded-full border",
      config.bg,
      config.text,
      config.border,
      sizeClasses[size],
      className
    )}>
      {showIcon && <Icon className={iconSizes[size]} />}
      {displayLabel}
    </span>
  );
};

export default StatusBadge;
