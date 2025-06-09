
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Monitor, Users } from 'lucide-react';
import { Customer } from '@/types/database';

interface DisplayStatusBadgeProps {
  customer: Customer;
  showIcon?: boolean;
}

const DisplayStatusBadge = ({ customer, showIcon = false }: DisplayStatusBadgeProps) => {
  const hasDedicatedDisplay = customer.has_dedicated_display && customer.display_url;
  
  return (
    <Badge variant={hasDedicatedDisplay ? 'default' : 'secondary'} className="flex items-center gap-1">
      {showIcon && (
        hasDedicatedDisplay ? <Monitor className="h-3 w-3" /> : <Users className="h-3 w-3" />
      )}
      {hasDedicatedDisplay ? 'Egen' : 'Felles'}
    </Badge>
  );
};

export default DisplayStatusBadge;
