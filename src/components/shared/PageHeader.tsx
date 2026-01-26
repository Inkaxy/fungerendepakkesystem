import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  icon: Icon,
  title,
  subtitle,
  actions,
  breadcrumbs,
  className,
}) => {
  return (
    <div className={cn("page-header", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-border">/</span>}
              {crumb.href ? (
                <Link 
                  to={crumb.href} 
                  className="hover:text-primary transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="stat-card-icon">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          
          {/* Title and subtitle */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-2 flex-wrap">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
