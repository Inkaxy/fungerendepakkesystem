import React from 'react';
import { Loader2, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  icon?: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Laster...',
  icon: CustomIcon,
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: {
      container: 'h-32',
      ring: 'h-10 w-10 border-2',
      spinner: 'h-5 w-5',
      text: 'text-sm',
    },
    md: {
      container: 'h-64',
      ring: 'h-16 w-16 border-4',
      spinner: 'h-8 w-8',
      text: 'text-base',
    },
    lg: {
      container: 'h-96',
      ring: 'h-20 w-20 border-4',
      spinner: 'h-10 w-10',
      text: 'text-lg',
    },
  };

  const classes = sizeClasses[size];
  const Icon = CustomIcon || Loader2;

  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-4",
      classes.container,
      className
    )}>
      <div className="relative">
        {/* Outer pulsing ring */}
        <div className={cn(
          "rounded-full border-muted animate-pulse",
          classes.ring
        )} />
        
        {/* Inner spinning icon */}
        <Icon className={cn(
          "animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary",
          classes.spinner
        )} />
      </div>
      
      {message && (
        <p className={cn(
          "text-muted-foreground animate-pulse",
          classes.text
        )}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingState;
