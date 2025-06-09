
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

interface ProductCategoryBadgeProps {
  category: string;
  className?: string;
}

const ProductCategoryBadge = ({ category, className = '' }: ProductCategoryBadgeProps) => {
  return (
    <Badge variant="secondary" className={`flex items-center space-x-1 ${className}`}>
      <Tag className="w-3 h-3" />
      <span>{category || 'Ingen kategori'}</span>
    </Badge>
  );
};

export default ProductCategoryBadge;
