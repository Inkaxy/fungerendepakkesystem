import React from 'react';
import { LucideIcon, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: 'default' | 'outline' | 'secondary';
}

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Package,
  title,
  description,
  action,
  secondaryAction,
  className,
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-6 text-center",
      className
    )}>
      {/* Icon with warm background */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl scale-150" />
        <div className="relative p-4 bg-gradient-to-br from-primary/15 to-primary/5 rounded-full border border-primary/10">
          <Icon className="h-12 w-12 text-primary/70" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-muted-foreground max-w-sm mb-6">
        {description}
      </p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <Button 
              onClick={action.onClick}
              variant={action.variant || 'default'}
              className="hover-lift"
            >
              {action.icon && <action.icon className="h-4 w-4 mr-2" />}
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button 
              onClick={secondaryAction.onClick}
              variant={secondaryAction.variant || 'outline'}
            >
              {secondaryAction.icon && <secondaryAction.icon className="h-4 w-4 mr-2" />}
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
